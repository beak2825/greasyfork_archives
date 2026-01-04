// ==UserScript==
// @name         CSDN免登录复制
// @namespace    zhouql8485
// @version      0.2
// @description  CSDN不登录就可以复制!
// @author       王子周棋洛
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449595/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/449595/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let style = document.createElement("style");
    style.innerText = `.passport-login-container{display:none !important}`;
    document.body.appendChild(style);
    document.querySelectorAll("code").forEach(c => {
        if( c.querySelector(".signin")) c.querySelector(".signin").remove();
        c.contentEditable = "true";
        c.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key == 'c') {
                e.preventDefault();
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.getSelection().toString());
                }
            }
        })
    });
})();