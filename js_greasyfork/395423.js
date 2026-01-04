// ==UserScript==
// @name         心心复活倒计时
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  网页加入心心复活倒计时
// @author       You
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395423/%E5%BF%83%E5%BF%83%E5%A4%8D%E6%B4%BB%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/395423/%E5%BF%83%E5%BF%83%E5%A4%8D%E6%B4%BB%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

let dom = creatDom(`<div id="haato-countdown" style="position: fixed; top:0;bottom: 0; left: 0;right: 0;display: flex; justify-content: center; align-items: center;color:rgba(255, 0, 0, 0.3); font-size: 5vw;pointer-events:none;z-index:9999"></div>`.trim())
document.querySelector('body').appendChild(dom)

function creatDom(str) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = str
  return wrapper.childNodes[0]
}

let haato = new Date(2020, 0, 20, 22)
setInterval(() => {
  let diff = parseInt((haato - Date.now()) / 1000)
  let sec = parseInt(diff % 60)
  let min = parseInt((diff / 60) % 60)
  let hour = parseInt(diff / 3600)
  document.querySelector('#haato-countdown').innerHTML = `离心心复活还有：${hour}小时${min}分${sec}秒`
}, 1000)