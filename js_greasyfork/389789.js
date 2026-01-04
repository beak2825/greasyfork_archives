// ==UserScript==
// @name         爱心爱心~~
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  点击冒出心心,0.2版本更新去除jquery依赖
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389789/%E7%88%B1%E5%BF%83%E7%88%B1%E5%BF%83~~.user.js
// @updateURL https://update.greasyfork.org/scripts/389789/%E7%88%B1%E5%BF%83%E7%88%B1%E5%BF%83~~.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = `
  .heart {
    color: rgb(223, 62, 62);
    opacity: 0;
    font-size: 14px;
    position: absolute;
    z-index:9999999;
  }
  .heartShowToHide {
    animation: 1.5s heart;
  }
  @keyframes heart {
    0% {transform: translateY(0);opacity: 1;}
    100% {transform: translateY(-150px);opacity: 0;}
  }
  `
  document.querySelector('head').appendChild(style)
  var timeId;
  var heartShow = function (e) {
    e = e || window.event;
    clearInterval(timeId)
    let x = e.pageX - 20;
    let y = e.pageY - 30;
    let heartDiv = document.createElement('div');
    heartDiv.classList.add('heart','heartShowToHide');
    heartDiv.innerText = '么么哒❤';
    heartDiv.setAttribute('style', `top: ${y}px; left: ${x}px;`)
    document.querySelector('body').appendChild(heartDiv)
    timeId = setInterval(() => {
        let d = document.querySelector('.heart');
        if (d) d.parentNode.removeChild(d);
    }, 1000);
  }
  document.querySelector('html').onclick = function() {
    heartShow()
  }
  // Your code here...
})();