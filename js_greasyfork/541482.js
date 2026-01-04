// ==UserScript==
// @name         微媒 去除蒙层
// @namespace    http://tampermonkey.net/
// @version      2025-07-03
// @description  微媒去除蒙层
// @author       wanstu
// @match        *://*.wmnetwork.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541482/%E5%BE%AE%E5%AA%92%20%E5%8E%BB%E9%99%A4%E8%92%99%E5%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/541482/%E5%BE%AE%E5%AA%92%20%E5%8E%BB%E9%99%A4%E8%92%99%E5%B1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        const guide = document.querySelector('#guide');
        if (guide) {
            console.log(guide, 'guide')
            guide.remove();
        }
        const bar = document.querySelector('.bar');
        if(bar) {
            const ding_pop = bar.querySelector('.ding_pop');
            if(ding_pop && ding_pop.innerText === '您当前使用的浏览器可能出现卡顿或异常，推荐使用最新版') {
                bar.remove();
            }
        }

    }, 500);
    // Your code here...
})();