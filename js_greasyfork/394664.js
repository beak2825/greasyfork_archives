// ==UserScript==
// @name         百度搜索框快速定位
// @namespace    http://tampermonkey.net/
// @version      2.1
// @icon         https://www.baidu.com/favicon.ico
// @description  双击Shift即可快速定位百度搜索页面中的搜索框，Escape可使其失焦
// @author       Fred
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394664/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/394664/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const inter = 200;
    const typebox = document.querySelector('#kw');

    let last = new Date().getTime();

    document.documentElement.addEventListener('keydown', e => {
        if (e.keyCode === 16) {
            let current = new Date().getTime();
            if (current - last > inter) {
                last = current;
            } else {
                typebox.click();
                typebox.select();
            }
        }
    });

    typebox.addEventListener('keydown', e => {
        if (e.keyCode === 27) {
            typebox.blur();
        }
    });
})();
