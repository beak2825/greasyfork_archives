// ==UserScript==
// @name         河南专技开启倍速播放，6倍速
// @namespace    http://dltool.dong11.fun/
// @version      0.0.1
// @description  河南专技开启倍速播放，6倍速，不过需要先点击播放之后才能开启
// @author       DL
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507719/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%BC%80%E5%90%AF%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%8C6%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/507719/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%BC%80%E5%90%AF%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%8C6%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

var bjyPlayer = null
var that = this
function setAA() {
      let span = document.getElementsByClassName('bplayer-speed-control')[0]
      let inSpan = document.createElement('span')
      inSpan.innerHTML = "倍速"
      inSpan.style = "{font-size: 12px;color: #fff;}"
      span.appendChild(inSpan)
      let speedUl = span.getElementsByClassName('bplayer-option-list')[0]
      let li = document.createElement('li')
      li.innerHTML = "6倍速"
      li.onclick = function () {
            if (bjyPlayer) {
                  bjyPlayer.video.setPlaybackRate(6)
            } else {
                  bjyPlayer = baiJiaYunPlayer
                  bjyPlayer.video.setPlaybackRate(6)
            }
      }
      li.className = "bplayer-option-item speed"
      speedUl.appendChild(li)
}


setTimeout(function () {
      setAA()
      setInterval(function () {
            if (baiJiaYunPlayer&&baiJiaYunPlayer.video) {
                  if (bjyPlayer && bjyPlayer.video) {
                        bjyPlayer.video.setPlaybackRate(6)
                  } else {
                        bjyPlayer = baiJiaYunPlayer
                        bjyPlayer.video.setPlaybackRate(6)
                  }
            }

      }, 3000);
}, 5000)

setTimeout(function () {
      // baiJiaYunPlayer.video.play()
}, 1000)

