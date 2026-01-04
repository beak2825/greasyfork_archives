// ==UserScript==
// @name         课堂派 - 去弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除课堂派浮动弹幕
// @author       Xianfei
// @match        https://www.ketangpai.com/Interact/index/courseid/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397227/%E8%AF%BE%E5%A0%82%E6%B4%BE%20-%20%E5%8E%BB%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/397227/%E8%AF%BE%E5%A0%82%E6%B4%BE%20-%20%E5%8E%BB%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

setInterval(function() {
    for (var e of document.getElementsByClassName("barrage")){
        e.parentNode.removeChild(e)
    }
}, 10)
