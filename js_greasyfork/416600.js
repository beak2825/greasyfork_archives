// ==UserScript==
// @name         网页小时钟
// @namespace    https://weirick.github.io
// @version      1.3.0.0
// @description  在网页右上角显示当前时间和日期
// @author       RCWei
// @license      GPL-3.0
// @match        *://*/*
// @run-at      document-idle
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant    GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416600/%E7%BD%91%E9%A1%B5%E5%B0%8F%E6%97%B6%E9%92%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/416600/%E7%BD%91%E9%A1%B5%E5%B0%8F%E6%97%B6%E9%92%9F.meta.js
// ==/UserScript==

let timer = null;

let clockHTML = '<div id="clock" style="position:fixed;top:1vw;right:8vh;display:flex;justify-content:center;font-weight:bold;align-items:center;-webkit-text-stroke:1px rgba(255,255,255,.8);font-size:4vh;color:rgba(70,130,180,.7);pointer-events:none;z-index:999999999"></div>';
let timeBox = document.createElement('div');
let dateHtml = '<div id="date" style="position:fixed;top:3vw;right:8.4vh;display:flex;justify-content:center;align-items:center;font-size:2vh;color:rgba(40,55,71,.6);pointer-events:none;z-index:999999999"></div>';
let dateBox = document.createElement('div');

timeBox.innerHTML = clockHTML;
$('html').append(timeBox);
dateBox.innerHTML = dateHtml;
timeBox.appendChild(dateBox);

timer = setInterval(() => {
  let now = new Date();
  let hour = now.getHours(), minute = now.getMinutes();
  let year = now.getFullYear(), month = now.getMonth(), date = now.getDate();
  if (hour < 10) hour = '0' + hour;
  if (minute < 10) minute = '0' + minute;
  $('#clock').text(hour + ":" + minute) ;

  month++;
  if (month < 10) month = '0' + month;
  if (date < 10) date = '0' + date;
  $('#date').text(month + '.' + date + '.' + year);
}, 1000);

// 选项菜单
GM_registerMenuCommand("设置选项", () => {
  alert('该功能正在开发中，欢迎提出建议及意见！');
});
