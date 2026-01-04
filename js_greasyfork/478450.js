// ==UserScript==
// @name         Leetcode CN/EN site switcher
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  Leetcode中英文网站切换，切换使用ctr+`(Esc下面，数字1左边那个按钮); 屏蔽中文跳转banner，可以将"||leetcode.cn/api/is_china_ip/"填入到adblocker
// @author       GeeMaple
// @match        *://leetcode.com/*
// @match        *://leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com

// @downloadURL https://update.greasyfork.org/scripts/478450/Leetcode%20CNEN%20site%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/478450/Leetcode%20CNEN%20site%20switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey && event.key === '`')) {
            event.preventDefault();
            let url = window.location.href;
            if (url.includes('leetcode.com')) {
                window.location.assign(url.replace('leetcode.com', 'leetcode.cn'))
            } else {
                window.location.assign(url.replace('leetcode.cn', 'leetcode.com'))
            }
        }
    });
})();