// ==UserScript==
// @name         bilibili ESC 关闭图片
// @namespace    https://www.bilibili.com
// @version      0.1
// @description  PC端浏览评论区图片时，可以通过ESC键关闭图片
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/467872/bilibili%20ESC%20%E5%85%B3%E9%97%AD%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/467872/bilibili%20ESC%20%E5%85%B3%E9%97%AD%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown',e=>{
        if(e.key=='Escape'){
            let btn = document.getElementsByClassName('close-container')[0]
            btn && btn.click()
        }
    })
})();