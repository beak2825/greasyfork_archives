// ==UserScript==
// @name         bilibili勋章常亮
// @namespace    bilibili-medal
// @version      0.7
// @description  保持bilibili直播粉丝勋章常亮
// @author       HCLonely
// @include      https://link.bilibili.com/p/center/index
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.0.19/dist/sweetalert2.all.min.js
// @homepage     https://blog.hclonely.com/posts/578f9be7/
// @supportURL   https://blog.hclonely.com/posts/578f9be7/
// @connect      api.live.bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/429846/bilibili%E5%8B%8B%E7%AB%A0%E5%B8%B8%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/429846/bilibili%E5%8B%8B%E7%AB%A0%E5%B8%B8%E4%BA%AE.meta.js
// ==/UserScript==

/* global $, Cookies, FormData */
(function () {
  'use strict'
  const blackList = GM_getValue('blackList') || []
  const whiteList = GM_getValue('whiteList') || []
  if (window.location.href === 'https://link.bilibili.com/p/center/index#/user-center/wearing-center/my-medal') {
    const find = setInterval(async () => {
      if ($('.page-title').length > 0) {
        clearInterval(find)
        const signBtn = $('<div class="link-panigation" style="display: inline;"><button data-v-461ef7c9="" class="panigation ts-dot-4" style="height: 30px;">开始签到</button></div>')
        signBtn.click(async () => {
          $('.text-ctnr').remove()
          $('table.center-grid>thead>tr').html('<td data-v-3895bb76="" width="160" style="padding-left: 60px;">主播昵称</td><td data-v-3895bb76="" width="160">直播间</td><td data-v-3895bb76="" width="120">签到结果</td>')
          $('table.center-grid>tbody').html('').after('<tfoot><tr><td colspan="3"><font id="delay-time">0</font> 秒后进行下一个房间签到</td></tr></tfoot>')
          const allRooms = whiteList.length > 0 ? whiteList : await getroomsId()
          for (let i = 0; i < allRooms.length; i++) {
            if (allRooms[i][1] < 100000) {
              allRooms[i][1] = await toLongId(allRooms[i][1])
            }
          }
          const rooms = allRooms.filter(e => !blackList.includes(e[1]))
          let i = 0
          $('nav.tabnav').append(`<section class="tabnav-item"><div class="tabnav-content">签到进度：${rooms.length} / <span id="sign-progress" class="tabnav-tip plain">${i}</span></div></section>`)
          for (const room of rooms) {
            await sendBiliMsg(room)
            i += 1;
            $('#sign-progress').text(i)
            const time = parseInt(Math.random() * (10000 - 6000 + 1) + 6000, 10)
            $('#delay-time').text(time / 1000)
            await delay(time)
          }

          $('table.center-grid>tfoot').remove()
          // $('#sign-progress').text(++i)
        })
        $('.page-title').append(signBtn)
      }
    }, 1000)
  }
  const msgText = ['(⌒▽⌒)', '（￣▽￣）', '(=・ω・=)', '(｀・ω・´)', '(〜￣△￣)〜', '(･∀･)', '(°∀°)ﾉ', '(￣3￣)', '╮(￣▽￣)╭', '_(:3」∠)_', '( ´_ゝ｀)', '←_←', '→_→', '(<_<)', '(>_>)', '(;¬_¬)', '("▔□▔)/', '(ﾟДﾟ≡ﾟдﾟ)!?', 'Σ(ﾟдﾟ;)', 'Σ( ￣□￣||)', '(´；ω；`)', '（/TДT)/', '(^・ω・^ )', '(｡･ω･｡)', '(●￣(ｴ)￣●)', 'ε=ε=(ノ≧∇≦)ノ', '(´･_･`)', '(-_-#)', '（￣へ￣）', '(￣ε(#￣) Σ', 'ヽ(`Д´)ﾉ', '(╯°口°)╯(┴—┴', '←◡←', '( ♥д♥)', 'Σ>―(〃°ω°〃)♡→', '⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '･*･:≡(　ε:)']
  function sendBiliMsg([name, roomid]) {
    const csrf = Cookies.get('bili_jct')
    const formData = new FormData()
    formData.append('bubble', 0)
    formData.append('msg', msgText[Math.floor((Math.random() * msgText.length))])
    formData.append('color', 65532)
    formData.append('mode', 1)
    formData.append('fontsize', 25)
    formData.append('rnd', Math.floor(new Date().getTime() / 1000))
    formData.append('roomid', roomid)
    formData.append('csrf', csrf)
    formData.append('csrf_token', csrf)
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        url: 'https://api.live.bilibili.com/msg/send',
        method: 'post',
        responseType: 'json',
        headers: {
          origin: 'https://live.bilibili.com',
          referer: 'https://live.bilibili.com/'
        },
        data: formData,
        onload: data => {
          if (data.response.code === 0) {
            $('table.center-grid>tbody').append(`<tr data-v-3895bb76=""><td data-v-3895bb76="" style="padding-left: 60px;">${name}</td><td data-v-3895bb76=""><a data-v-3895bb76="" target="blank" href="https://live.bilibili.com/${roomid}" class="bili-link cyan dp-i-block t-over-hidden t-no-wrap v-middle" style="max-width: 160px;">${roomid}</a></td><td data-v-3895bb76=""><span data-v-3895bb76="" class="dp-i-block t-over-hidden t-no-wrap" style="color:green;">成功</span></td></tr>`)
          } else {
            console.log(data)
            $('table.center-grid>tbody').append(`<tr data-v-3895bb76=""><td data-v-3895bb76="" style="padding-left: 60px;">${name}</td><td data-v-3895bb76=""><a data-v-3895bb76="" target="blank" href="https://live.bilibili.com/${roomid}" class="bili-link cyan dp-i-block t-over-hidden t-no-wrap v-middle" style="max-width: 160px;">${roomid}</a></td><td data-v-3895bb76=""><span data-v-3895bb76="" class="dp-i-block t-over-hidden t-no-wrap" style="color:red;">失败：${data.response.message + '|' + data.response.msg}</span></td></tr>`)
          }
          resolve()
        },
        onerror: (data) => {
          console.log(data)
          $('table.center-grid>tbody').append(`<tr data-v-3895bb76=""><td data-v-3895bb76="" style="padding-left: 60px;">${name}</td><td data-v-3895bb76=""><a data-v-3895bb76="" target="blank" href="https://live.bilibili.com/${roomid}" class="bili-link cyan dp-i-block t-over-hidden t-no-wrap v-middle" style="max-width: 160px;">${roomid}</a></td><td data-v-3895bb76=""><span data-v-3895bb76="" class="dp-i-block t-over-hidden t-no-wrap" style="color:red;">失败</span></td></tr>`)
          resolve()
        }
      })
    })
  }
  function getroomsId(i=1) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        url: `https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel?page=${i}&page_size=50&target_id=${$('#right-part a[href*="space.bilibili.com"]').attr('href').match(/[\d]+/)?.[0]}`,
        method: 'get',
        responseType: 'json',
        headers: {
          'origin': 'https://link.bilibili.com',
          'referer': 'https://link.bilibili.com/p/center/index'
        },
        onload: async data => {
          if (data.response.code === 0) {
            if (i * 50 < data.response.data.total_number) {
              const prevPageData = await getroomsId(i + 1);
              resolve([...prevPageData, [...data.response.data.list, ...data.response.data.special_list].filter(e => e.room_info?.room_id && e.medal.today_feed < 100 && !blackList.includes(e.room_info?.roomid)).map(e => [e.anchor_info?.nick_name, e.room_info?.room_id]).filter(e => e[1])])
            } else {
              resolve([...data.response.data.list, ...data.response.data.special_list].filter(e => e.room_info?.room_id && e.medal.today_feed < 100 && !blackList.includes(e.room_info?.roomid)).map(e => [e.anchor_info?.nick_name, e.room_info?.room_id]).filter(e => e[1]))
            }
          } else {
            resolve(false)
          }
        },
        onerror: () => {
          resolve(false)
        }
      })
    })
  }
  function delay(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }
  async function toLongId(id) {
    const cache = GM_getValue('ids') || {}
    if (cache[id]) {
      return cache[id]
    }
    return await new Promise(resolve => {
      GM_xmlhttpRequest({
        url: 'http://api.live.bilibili.com/room/v1/Room/room_init?id=' + id,
        method: 'get',
        responseType: 'json',
        onload: data => {
          if (data.response.code === 0) {
            const longId = data.response.data.room_id
            cache[id] = longId
            GM_setValue('ids', cache)
            resolve(longId)
          } else {
            resolve(id)
          }
        },
        onerror: () => {
          resolve(id)
        }
      })
    })
  }
  GM_registerMenuCommand('设置黑名单', () => {
    const blackList = GM_getValue('blackList') || []
    Swal.fire({
      title: '设置黑名单',
      input: 'textarea',
      inputValue: blackList.join(','),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value) {
        GM_setValue('blackList', value.split(',').map(e => parseInt(e)))
        Swal.fire(
          '保存成功',
          '',
          'success'
        )
      }
    })
  })
  GM_registerMenuCommand('设置白名单', () => {
    const whiteList = GM_getValue('whiteList') || []
    Swal.fire({
      title: '设置白名单',
      input: 'textarea',
      inputValue: whiteList.join(','),
      showCancelButton: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    }).then(({ value }) => {
      if (value) {
        GM_setValue('whiteList', value.split(',').map(e => parseInt(e)))
        Swal.fire(
          '保存成功',
          '',
          'success'
        )
      }
    })
  })
})()
