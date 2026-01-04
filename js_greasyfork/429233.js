// ==UserScript==
// @name         指定时间倒计时
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  网页加入倒计时
// @author       Macao
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429233/%E6%8C%87%E5%AE%9A%E6%97%B6%E9%97%B4%E5%80%92%E8%AE%A1%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/429233/%E6%8C%87%E5%AE%9A%E6%97%B6%E9%97%B4%E5%80%92%E8%AE%A1%E6%97%B6.meta.js
// ==/UserScript==

let dom = creatDom(`<div id="haato-countdown" style="position: fixed; top: 100px;
  right: 0;  margin-right: 10px;display: flex; justify-content: center; align-items: center;color:rgba(255, 0, 0, 0.3); font-size: 1vw;pointer-events:none;z-index:9999"></div>`.trim())
document.querySelector('body').appendChild(dom)

function creatDom(str) {
  let wrapper = document.createElement('div')
  wrapper.innerHTML = str
  return wrapper.childNodes[0]
}
function timeone() {
var haato = new Date("2021/12/20 00:00:00");
var nowTime = new Date();

  var diff = haato.getTime() - nowTime.getTime();
  var sec = parseInt(diff /1000 % 60)
  var min = parseInt(diff/ 1000/60%60)
  var hour = parseInt(diff / 60/60/1000 %24)
  var day = parseInt(diff /(60*60*24*1000))
  document.querySelector('#haato-countdown').innerHTML = `${day}天${hour}小时${min}分${sec}秒,集中注意力，加油`
}
var myVar=setInterval(function(){timeone()},1000);