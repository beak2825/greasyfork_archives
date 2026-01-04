// ==UserScript==
// @name         live-msg-log
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        live.bilibili.com/*
// @match        alive.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404066/live-msg-log.user.js
// @updateURL https://update.greasyfork.org/scripts/404066/live-msg-log.meta.js
// ==/UserScript==


(function() {
  console.log('==============', window.location.href);
  // 忽略iframe
  if (window.top !== window) return
  const count = 30
  let i = 1

  console.log(`-------------- 播放器检测，最多执行${count}次`);
  function checkPlayer(cb) {
    console.log(`-------------- 播放器检测，最多执行${count}次`, i);
    if (window.livePlayer) {
      cb(true)
      return
    } else if (i >= count) {
      cb(false)
      return
    }
    i += 1
    setTimeout(function() {
      checkPlayer(cb)
    }, 1000);
  }

  checkPlayer((flag) => {
    if (flag) {
      console.log('-------------- 启动播放器消息监听');
      window.livePlayer.on('receiveMessage', (msg) => {
        console.log('【播放器消息】', msg)
      })
    } else {
      console.log('-------------- 未检测到播放器');
    }
  })

})();