// ==UserScript==
// @name         考研倒计时
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  网页加入考研倒计时
// @author       LYX
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415853/%E8%80%83%E7%A0%94%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/415853/%E8%80%83%E7%A0%94%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

let dom = creatDom(`<div id="haato-countdown" style="position: fixed; top: 100px;
  right: 0;  margin-right: 10px;display: flex; justify-content: center; align-items: center;color:rgba(255, 0, 0, 0.3); font-size: 1vw;pointer-events:none;z-index:9999"></div>`.trim())
document.querySelector('body').appendChild(dom)

function creatDom(str) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = str
  return wrapper.childNodes[0]
}

let haato = new Date(2020, 11, 26, 8)
setInterval(() => {
  let diff = parseInt((haato - Date.now()) / 1000)
  let sec = parseInt(diff % 60)
  let min = parseInt((diff / 60) % 60)
  let hour = parseInt(diff / 3600)
  let day = parseInt(diff / 3600/24)
  document.querySelector('#haato-countdown').innerHTML = `${hour}小时${min}分${sec}秒|${day}天`
}, 1000)