// ==UserScript==
// @name         B站直播间添加个人主页连结到用户名
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  B站直播间添加个人主页连结到礼物/醒目留言/观众进入讯息的用户名上
// @author       Eric Lam
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/google/brotli@5692e422da6af1e991f9182345d58df87866bc5e/js/decode.js
// @require      https://cdn.jsdelivr.net/gh/eric2788/bliveproxy@d66adfa34cbf41db3d313f49d0814e47cb3b6c4c/bliveproxy-unsafe.js
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.bilibili.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/420655/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%B7%BB%E5%8A%A0%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E8%BF%9E%E7%BB%93%E5%88%B0%E7%94%A8%E6%88%B7%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/420655/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%B7%BB%E5%8A%A0%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E8%BF%9E%E7%BB%93%E5%88%B0%E7%94%A8%E6%88%B7%E5%90%8D.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const hoverEnable = true // 是否启用悬浮卡片

    const map = new Map()
    const infoMap = new Map()

    const config = { attributes: false, childList: true, subtree: true }

    function putToMap(uid, uname){
         if (map.has(uname)) return
         map.set(uname, uid)
    }

    async function fetchInfo(uid, uname){
         if (infoMap.has(uid)) return infoMap.get(uid)
         const { following, follower } = await webRequest(`https://api.bilibili.com/x/relation/stat?vmid=${uid}&jsonp=jsonp`)
         const { name, level, face } = await webRequest(`https://api.bilibili.com/x/space/acc/info?mid=${uid}&jsonp=jsonp`)
         console.debug(`successfully fetched ${uname} info`)
         const data = {following, follower, name, level, face}
         infoMap.set(uid, data)
         return data
    }

    async function launchEnterMessage(){
        unsafeWindow.bliveproxy.addCommandHandler('INTERACT_WORD', ({data}) => {
            const {uid, uname} = data
            console.debug(`[from enter] name: ${uname}; uid: ${uid}`)
            putToMap(uid, uname)
        })

        const observer = function(list, o){
            for(const mu of list){
                for (const node of mu.addedNodes){
                    handle(node, 'span.interact-name')
                }
            }
        }

        // observe for mutation link
        new MutationObserver(observer).observe($('#brush-prompt')[0], config)
        console.log('started enter message observing')
        //
    }

    async function launchSendGift(){

        unsafeWindow.bliveproxy.addCommandHandler('SEND_GIFT', ({data}) => {
            const {uid, uname} = data
            console.debug(`[from gift] name: ${uname}; uid: ${uid}`)
            putToMap(uid, uname)
        })

        const observer = function(list, o){
            for(const mu of list){
                for (const node of mu.addedNodes){
                    handle(node, 'span.username')
                }
            }
        }

        const observerBubble = function(list, o){
            for(const mu of list){
                for (const node of mu.addedNodes){
                    handle(node, 'div.user-name')
                }
            }
        }

        // observe for mutation link
        new MutationObserver(observer).observe($('#chat-items')[0], config)
        new MutationObserver(observer).observe($('#penury-gift-msg')[0], config)

        while($('.bubble-list').length == 0){
            await sleep(500)
        }

        new MutationObserver(observerBubble).observe($('.bubble-list')[0], config)
        console.log('started gift observing')
        //

    }

    async function launchSuperChat(){

        // websocket
        unsafeWindow.bliveproxy.addCommandHandler('SUPER_CHAT_MESSAGE', ({data}) => {
            const uid = data.uid
            const name = data.user_info.uname
            console.debug(`[from superchat] name: ${name}; uid: ${uid}`)
            putToMap(uid, name)
        })
        //

        // get current superchat
        const scList = unsafeWindow.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.super_chat_info.message_list

        for (const data of scList){
            const uid = data.uid
            const name = data.user_info.uname
            console.debug(`[from old sc list] name: ${name}; uid: ${uid}`)
            putToMap(uid, name)
        }
        //

        const observer = function(list, o){
            for(const mu of list){
                for (const node of mu.addedNodes){
                    handle(node, '.name')
                }
            }
        }

        const superChatPanelO = new MutationObserver(observer)

        const panelExist = () => $('.pay-note-panel').length > 0

        let launched = false


        while (!panelExist()){
            await sleep(500)
        }

        // observe for mutation link
        setInterval(() => {
            if (panelExist()){
                if (launched) return
                superChatPanelO.observe($('.pay-note-panel')[0], config)
                console.log('started superchat observing')
                launched = true
            }else{
                if (!launched) return
                superChatPanelO.disconnect()
                console.log('stopped superchat observing')
                launched = false
            }
        }, 1000)

    }

    function handle(node, element){
        const target = $(node).find(element)
        if (target.length == 0) return
        const uname = target[0].innerText
        const uid = map.get(uname)
        if (!uid) {
            console.warn(`找不到 ${uname} 用户的 uid`)
            return
        }
        target[0].innerHTML = `<a id="a-${uid}" href="https://space.bilibili.com/${uid}" target="_blank" style="color: inherit;text-decoration: inherit;">${uname}</a>`

        if (hoverEnable){
           $(document.body).on('click', () => $(`.hover`).css('display', 'none'))
           $(`#a-${uid}`).on('mouseenter', () => {
            // 如果已有卡片
            if ($(`#hover-content-${uid}`).length > 0 ){
              $(`#hover-content-${uid}`).css('display', 'block')
              return
            }
            // 如果没有卡片
            // 悬浮卡片在进入讯息时大部分都没办法来得及获取，所以无法获取很正常
            fetchInfo(uid, uname).then(info => {
               const {following, follower, name, level, face} = info
               const html = `
                  <div id="hover-content-${uid}" class="hover">
                  <img src="${face}" alt="${name}" style="border-radius: 20px;float: right;" height="50" width="50">
                  <p style="margin: 0px;font-size: 13px">名称: ${name} (Lv${level})</p>
                  <p style="margin: 0px; font-size: 13px">粉丝数: ${follower}</p>
                  <p style="margin: 0px;font-size: 13px">关注数: ${following}</p>
                  </div>
                `
               $('#chat-control-panel-vm').append(html)
            }).catch(err => {
               console.warn(`索取用户资讯(${uname}: ${uid})时出现错误`)
               console.error(err)
               const html = `
                  <div id="hover-content-${uid}" class="hover">
                    <p style="margin: 0px;font-size: 13px">无法索取 ${uname}(${uid}) 的卡片资讯</p>
                  </div>
                `
               $('#chat-control-panel-vm').append(html)
               setTimeout(() => $(`#hover-content-${uid}`).remove(), 1000 * 5) // 五秒后删除悬浮卡片
            }).finally(() => {
               //setTimeout(() => $(`#hover-content-${uid}`).remove(), 1000 * 60 * 5) // 五分钟后删除悬浮卡片
               $(`#hover-content-${uid}`).css('display', 'block')
            })

           })

           $(`#a-${uid}`).on('mouseleave', () => {
              $(`#hover-content-${uid}`).css('display', 'none')
           })

        }
    }

    const sc = launchSuperChat()

    const gift = launchSendGift()

    const enter = launchEnterMessage()

    if (hoverEnable){
     $(document.body).append(`
      <style>
          .hover {
            position: absolute;
            z-index: 99;
            display: none;
            height: 50px;
            width: 93%;
            background-color: gray;
            padding: 10px;
            color: white;
            border-radius: 2px;
          }
      </style>
     `)
    }

    await Promise.all([sc, gift, enter])

})();



async function webRequest(url){
  const data = await GM.xmlHttpRequest({
          method: "GET",
          url
        })
  const res = JSON.parse(data.response)
  if (res.code !== 0) throw new Error(res.message)
  return res.data
}

async function sleep(ms){
  return new Promise((res,) => setInterval(res,ms))
}