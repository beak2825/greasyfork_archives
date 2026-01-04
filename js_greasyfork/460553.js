// ==UserScript==
// @name         [zrh] 回到顶部、前往底部
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  显示 回到顶部、前往底部 按钮
// @author       zrh
// @match        *://*/*
// @icon         https://cdn3.iconfinder.com/data/icons/leto-space/64/__rocket_spaceship-64.png
// @noframes
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460553/%5Bzrh%5D%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E3%80%81%E5%89%8D%E5%BE%80%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460553/%5Bzrh%5D%20%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E3%80%81%E5%89%8D%E5%BE%80%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        setTimeout(() => main_(), 1000);
    } else {
        document.addEventListener("DOMContentLoaded", function () { setTimeout(() => main_(), 1000) });
    }

    function main_(){
        createButtonToTop()
        createButtonToBottom()
    }

    function createButtonToTop() {
      const btn = document.createElement('div')
      btn.innerHTML = '<img width="50px" height="50px" alt="↑" title="回到顶部(右键隐藏该按钮)" src="data:image/png;base64,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"/>'
      var img = btn.firstChild;
      img.style.opacity = 0.2
      img.addEventListener('mouseover', function(){ img.style.opacity = 1;}, false);
      img.addEventListener('mouseout', function(){ img.style.opacity = 0.2; }, false);
      btn.style.fontSize = '28px'
      btn.style.fontWeight = 900
      btn.style.textAlign = 'center'
      btn.style.lineHeight = '50px'
      btn.style.cursor = 'pointer'
      btn.style.width = '50px'
      btn.style.height = '50px'
      btn.style.background = 'transparent'
      btn.style.position = 'fixed'
      btn.style.right = '50px'
      btn.style.bottom = '55px'
      btn.onclick = () => scrollTo(0, 0)
      btn.oncontextmenu = (e) => {
        e.preventDefault()
        btn.style.display = 'none'
      }
      document.querySelector('html body').appendChild(btn)
    }

    function createButtonToBottom() {
      const btn = document.createElement('div')
      btn.innerHTML = '<img width="50px" height="50px" alt="↓" title="前往底部(右键隐藏该按钮)" src="data:image/png;base64,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"/>'
      var img = btn.firstChild;
      img.style.opacity = 0.2
      img.addEventListener('mouseover', function(){ img.style.opacity = 1;}, false);
      img.addEventListener('mouseout', function(){ img.style.opacity = 0.2; }, false);
      btn.style.fontSize = '28px'
      btn.style.fontWeight = 900
      btn.style.textAlign = 'center'
      btn.style.lineHeight = '50px'
      btn.style.cursor = 'pointer'
      btn.style.width = '50px'
      btn.style.height = '50px'
      btn.style.background = 'transparent'
      btn.style.position = 'fixed'
      btn.style.right = '50px'
      btn.style.bottom = '5px'
      btn.onclick = () => scrollTo(0, 9999999999)
      btn.oncontextmenu = (e) => {
        e.preventDefault()
        btn.style.display = 'none'
      }
      document.querySelector('html body').appendChild(btn)
    }
})();
