// ==UserScript==
// @name         QQ邮箱 显示下次扩容时间
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       luofo
// @match        *://mail.qq.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/416383/QQ%E9%82%AE%E7%AE%B1%20%E6%98%BE%E7%A4%BA%E4%B8%8B%E6%AC%A1%E6%89%A9%E5%AE%B9%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/416383/QQ%E9%82%AE%E7%AE%B1%20%E6%98%BE%E7%A4%BA%E4%B8%8B%E6%AC%A1%E6%89%A9%E5%AE%B9%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let c = setInterval(function() {
        if (window.frames["mainFrame"] && window.frames["mainFrame"].document.querySelector(".addrtitle b")) {
            var node = window.frames["mainFrame"].document.querySelector(".addrtitle");
            var selectNode = window.frames["mainFrame"].document.querySelector(".addrtitle b");
            var num = selectNode.textContent.match(/([0-9]{1,4})/g).toString();
            var newNode = document.createElement('div');
            newNode.innerHTML = "下次扩容时间:" + new Date(Date.parse(new Date(num)) + 7776000000).toLocaleDateString();
            node.appendChild(newNode);
            clearInterval(c);
        } else {
            return
        }
    },1000)
    // Your code here...
})();