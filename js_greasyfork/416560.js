// ==UserScript==
// @name         高考倒计时
// @namespace    https://czqu.cc/
// @version      1.0.2
// @license      GNU-GPLv3
// @description  2022高考倒计时
// @author       czqu
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416560/%E9%AB%98%E8%80%83%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/416560/%E9%AB%98%E8%80%83%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

let dom = creatDom(`<div id="haato-countdown" style="position: fixed; top: 100px;
  right: 0;  margin-right: 10px;display: flex; justify-content: center; align-items: center;color:rgba(40, 82, 181, 0.5); font-size: 1vw;pointer-events:none;z-index:9999"></div>`.trim())
document.querySelector('body').appendChild(dom)

function creatDom(str) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = str
  return wrapper.childNodes[0]
}

let nextDay = new Date(2022, 5, 7, 8)
setInterval(() => {
  let diff = parseInt((nextDay - Date.now()) / 1000)
  let day = parseInt(diff / 3600/24)
  document.querySelector('#haato-countdown').innerHTML = `距离高考还有 ${day} 天`
}, 1000)