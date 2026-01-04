// ==UserScript==
// @name         Leetcode Banner Hidden
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当大家在公司刷题时，Leetcode Nav栏是不是很显眼，有没有想把它隐藏调的冲动？本脚本就是为了解决这个问题而生。
// @author       Melonkid
// @match        https://leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474749/Leetcode%20Banner%20Hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/474749/Leetcode%20Banner%20Hidden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideNav() {
        let navDoc = document.querySelector("nav");
        if (navDoc) {
            navDoc.style.display = 'none';
            observer.disconnect();  // 如果找到元素，停止观察
        }
    }

    hideNav();  // 尝试首次隐藏

    // 如果首次隐藏失败，使用 MutationObserver
    var observer = new MutationObserver(hideNav);
    observer.observe(document.body, {childList: true, subtree: true});

})();