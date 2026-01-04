// ==UserScript==
// @name         封禁直播间点亮牌子
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  封禁直播间点亮牌子，原理参考了 https://www.bilibili.com/read/cv12463422
// @author       Eric Lam
// @match        https://live.bilibili.com/p/html/live-fansmedal-wall/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/436594/%E5%B0%81%E7%A6%81%E7%9B%B4%E6%92%AD%E9%97%B4%E7%82%B9%E4%BA%AE%E7%89%8C%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/436594/%E5%B0%81%E7%A6%81%E7%9B%B4%E6%92%AD%E9%97%B4%E7%82%B9%E4%BA%AE%E7%89%8C%E5%AD%90.meta.js
// ==/UserScript==

(async function() {
    'use strict';


    const cookies = /bili_jct=(.+?);/.exec(document.cookie)
    let token;
    if (!cookies){
           token = prompt('在 cookie 找不到 bili_jct, 请手动输入: ')
    }else{
           token = cookies[1]
    }

    window.lighter = (room) => light(room, token)

    const inputElement = `<input style="margin: 0px 15px; width: 20vw" id="light-medal" type="number" min="1" placeholder="输入要点亮牌子的封禁房间号"/>`
    while ($('.title > .mount').length == 0){
        console.log(`not found element, wait a second`)
        await new Promise((res,) => setTimeout(res, 1000))
    }
    $('.title > .mount').after(inputElement)


    $('#light-medal').on('keypress', e => {
       if (e.which !== 13) return
       const room = e.target.valueAsNumber
       e.target.value = ''
       $(e.target).prop('disabled', true)
       light(room, token)
           .catch(console.error)
           .finally(() => $(e.target).prop('disabled', false))
    })

    console.log(`封禁直播间点亮牌子载入成功。`)


})().catch(err => {
  console.error(err)
  alert(`封禁直播间点亮牌子启动失败: ${err}`)
});



 async function light(room, token){
         try {
           if (!await checkRoomBanned(room)){
             alert('房间不是封禁状态')
             return
           }
             const result = await lightMedal(room, token)
             alert(`点亮${result ? '成功' : '失败'}`)
         }catch(err){
             console.warn(err)
             alert(`点亮失败: ${err}`)
         }
}


async function checkRoomBanned(room){
   const res = await fetcher('https://api.live.bilibili.com/room/v1/Room/room_init?id='+room)
   return res.data.is_locked
}

async function lightMedal(room, token){
    const form = new URLSearchParams()
    form.append('bubble', 0)
    form.append('color', 0xffffff)
    form.append('fontsize', 25)
    form.append('mode', 1)
    form.append('msg', '你好')
    form.append('rnd', Date.now())
    form.append('roomid', room)
    form.append('csrf', token)
    form.append('csrf_token', token)

    const response = await fetch('https://api.live.bilibili.com/msg/send', {
        method: 'POST',
        credentials: 'include',
        headers: {
            //'Content-Type': 'multipart/form-data',
             'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form
    })
    const json = await response.json()
    console.debug(json)
    return !!json.data
}

async function fetcher(url) {
    const res = await fetch(url)
    if (!res.ok){
        throw new Error(res.statusText)
    }

    const data = await res.json()
    console.debug(data)
    if (data.code != 0){
        throw new Error(data.message)
    }
    return data
}