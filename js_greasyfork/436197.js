// ==UserScript==
// @name         Acfun自动点赞(随机间隔)
// @description  直播间自动点赞
// @version      0.0.3
// @author       A
// @match        https://live.acfun.cn/live/*
// @run-at       document-start
// @license      GNU General Public License v3.0 or later
// @namespace    https://greasyfork.org/zh-CN/users/845476-longfeigit
// @downloadURL https://update.greasyfork.org/scripts/436197/Acfun%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%28%E9%9A%8F%E6%9C%BA%E9%97%B4%E9%9A%94%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436197/Acfun%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%28%E9%9A%8F%E6%9C%BA%E9%97%B4%E9%9A%94%29.meta.js
// ==/UserScript==


function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function randomClock() {
    const time = random(0, 3000)
    const timer = setTimeout(() => {
        // console.timeEnd()
        document.getElementsByClassName('like-heart')[0].click()
        randomClock()
        clearTimeout(timer)
        // console.time()
    }, time)

}
let evt = document.createEvent('HTMLEvents')
evt.initEvent('input', true, true)
document.getElementsByClassName('danmaku-input')[1].value = "点赞机器人进入";
document.getElementsByClassName('danmaku-input')[1].dispatchEvent(evt);
document.getElementsByClassName('send-btn enable')[0].click();
randomClock()
