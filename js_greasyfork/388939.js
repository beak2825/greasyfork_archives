// ==UserScript==
// @name         虎牙直播挖宝
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  虎牙直播自动挖宝
// @author       睿智的河水
// @match        *://*.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388939/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%8C%96%E5%AE%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/388939/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%8C%96%E5%AE%9D.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const $ = window.$
  const styleData = `
    .chat-room__gift {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .room-chat-tool-gift {
      display: inline-block;
      width: 24px;
      height: 24px;
      margin-top: -2px;
      background: url("https://huyaimg.msstatic.com/cdnimage/actprop/20293_1__45_1547818438.jpg") center no-repeat;
      background-size: contain;
      filter: grayscale(1);
      opacity: .65;
    }
    .room-chat-tool-gift:hover {
      opacity: 1;
    }
    #gift-main {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    #gift-list {
      height: 100%;
      overflow: auto;
      scroll-behavior: smooth;
    }
    #gift-list li {
      font-size: 12px;
      padding: 6px 0;
      margin: 0 10px;
      border-bottom: 1px solid #eee;
    }
    #gift-list li > div {
      display: block;
      margin: 3px 0px;
    }
    #gift-list li .time {
      color: #aaa;
    }
    #gift-list li .host {
      padding-left: 18px;
      margin-left: 3px;
      color: #f80;
      background: url(https://a.msstatic.com/huya/main3/assets/img/room/bussType_icon_c974b.png) left center no-repeat;
    }
    #gift-list li .info {
      color: #444;
    }
    #gift-list li .info i {
      font-style: normal;
      color: #3c9cfe;
    }
    #gift-list li .status {
      color: #999;
    }
    #gift-list li .winner {
      color: #d35757;
    }
    #gift-status {
      display: flex;
      align-items: baseline;
      font-size: 13px;
      padding: 6px;
      margin: 0 6px 6px;
      background: #f5f5f5;
      border: 1px solid #eee;
      border-radius: 3px;
    }
    #gift-status .time {
      color: #aaa;
      margin-right: 6px;
    }
    #gift-status .info {
      color: #999;
    }
    #gift-status .info i {
      font-style: normal;
      color: #f80;
    }
  `
  function localGet (key) {
    return JSON.parse(localStorage.getItem(key))
  }
  function localSet (key, val) {
    return localStorage.setItem(key, JSON.stringify(val))
  }
  function localRemove (key) {
    return localStorage.removeItem(key)
  }
  function updateGift (el, html, save = false) {
    const $giftEl = $('.chat-room__gift')
    let $giftMain = $('#gift-main')

    if (!$giftMain.length) {
      $giftMain = $('<div id="gift-main" class="chat-room__scroll"></div>')

      const $clearEl = $('<p class="clearBtn"><i></i><span>清除历史数据</span></p>')
      $clearEl.on('click', () => {
        $('#gift-list').html('')
        localRemove('giftHistory')
      })

      $giftMain.append($('<ul id="gift-list" class="gift-list"></ul>'))
      $giftMain.append($('<div id="gift-status" class="gift-status"></div>'))
      $giftMain.append($clearEl)
      $giftEl.append($giftMain)
    }

    switch (el) {
      case 'list':
        const $list = $('#gift-list')
        $list.append($(`<li>${html}</li>`))
        $list.scrollTop($list[0].scrollHeight)

        if (save) {
          const giftHistory = localGet('giftHistory') || []
          giftHistory.push(html)
          localSet('giftHistory', giftHistory)
        }
        break
      case 'status':
        $('#gift-status').html(html)
        break
    }
  }
  function loopGift () {
    const date = new Date().toLocaleString('zh-Hans-CN')
    const $btn = $('#J_treasureChestContainer .btn-wrap .btn')

    if (!$btn.length) {
      updateGift('status', `<div class="time">[${date}]</div><div class="info">等待宝藏掉落...</div>`)
      setTimeout(() => {
        loopGift()
      }, 500)
      return
    }

    const btnVal = $btn.text()
    const nick = $('#J_treasureChestContainer .waitTips .nick').text()
    const gName = $('#J_treasureChestContainer .waitTips .aName').text()
    const number = $('#J_treasureChestContainer .num').text()

    if (/\d+:\d+/.test(btnVal)) {
      const [min, sec] = btnVal.split(':')
      const time = Number(min) * 60 + Number(sec)
      updateGift('status', `<div class="time">[${time}s]</div><div class="info">准备挖<i>${nick}</i>${gName}，还剩${number}个</div>`)
    } else if (btnVal === '领取') {
      $btn.trigger('click')

      setTimeout(() => {
        const status = $('#watchChat_pub .treasureChest-tips .tct-cont').text()
        const hostName = $('.host-name').text()
        const hostLink = window.TT.app.main + window.TT_ROOM_DATA.profileRoom

        let cls = 'class="status"'
        if (/恭喜/.test(status)) {
          cls = 'class="status winner"'
        }

        updateGift('list', `<div class="time">[${date}] <a class="host" href="${hostLink}">${hostName}</a></div><div class="info"><i>${nick}</i>${gName}：</div><div ${cls}>${status}</div>`, true)
      }, 1000)
    } else {
      updateGift('status', `<div class="time">[${btnVal}]</div><div class="info">${
        number > 0 ? `等待中，还剩${number}个` : '当前宝藏已挖完'
      }</div>`)
    }
    requestAnimationFrame(loopGift)
  }

  $(document).ready(() => {
    const $chatRoom = $('#chatRoom')

    if (!$chatRoom.length) {
      return
    }

    const $chatPanel = $('#chatRoom .chat-room__bd')
    const $giftPanel = $('<div class="chat-room__bd chat-room__gift" style="display: none;"></div>')
    const $giftIcon = $('<i class="room-chat-tool room-chat-tool-gift" id="J-room-chat-gift" title="自动挖宝"></i>')

    $giftIcon.on('click', () => {
      $chatPanel.toggle()
      $giftPanel.toggle()
      $('#gift-list').scrollTop($('#gift-list')[0].scrollHeight)
    })

    $('head').append($(`<style>${styleData}</style>`))
    $('.room-chat-tools').append($giftIcon)

    $giftPanel.height($chatPanel.height())
    $chatRoom.append($giftPanel)

    $('#J_playerMain').on('resize', () => {
      $giftPanel.height($chatPanel.height())
    })

    const giftHistory = localGet('giftHistory') || []
    if (giftHistory.length) {
      giftHistory.forEach(v => {
        updateGift('list', v)
      })
    }

    loopGift()
  })
})()
