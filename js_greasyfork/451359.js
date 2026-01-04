// ==UserScript==
// @name         哔哩哔哩快捷键
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  哔哩哔哩快捷键!
// @author       Big0range
// @match        https://www.bilibili.com/*
// @match        http://www.bilibili.com/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451359/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/451359/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
  window.addEventListener("load", () => {
    console.log('B站快捷键功能初始化成功了')
    window.$ = $
    window.addEventListener("keydown", e => {
      if (!e.shiftKey) {
        return
      }
      // !Q 上一集
      if (e.code === 'KeyQ') {
        $("#eplist_module > .list-wrapper > .clearfix > .cursor")?.prev()?.click()
      }
      // !W 静音
      if (e.code === 'KeyW') {
        $('.squirtle-volume-icon')?.click()
        // 非番剧模式
        $('.bpx-player-ctrl-btn.bpx-player-ctrl-volume > .bpx-player-ctrl-volume-icon')?.click()
      }
      // !E 下一集
      if (e.code === 'KeyE') {
        $("#eplist_module > .list-wrapper > .clearfix > .cursor + .ep-item")?.click()
      }
      // !A 全屏
      if (e.code === 'KeyA') {
        $('.squirtle-video-fullscreen')?.click()
        // 非番剧模式
        $('.bpx-player-ctrl-btn.bpx-player-ctrl-full > .bpx-player-ctrl-btn-icon')?.click()
      }
      // !D 弹幕开关
      if (e.code === 'KeyD') {
        $('.bpx-player-sending-bar  .bpx-player-dm-root  .bui-switch-input')?.click()
      }
    })
  })

  })();
