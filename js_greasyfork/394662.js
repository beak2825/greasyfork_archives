// ==UserScript==
// @name         Google搜索框快速定位
// @namespace    http://tampermonkey.net/
// @version      2.3
// @icon         https://www.google.com/favicon.ico
// @description  双击Shift即可快速定位Google搜索详情页面中的搜索框，Escape可使其失焦
// @author       Fred
// @match        https://www.google.com/search*
// @match        https://www.google.co.jp/search*
// @match        https://www.google.com.hk/search*
// @match        https://www.google.com.tw/search*
// @match        https://www.google.co.uk/search*
// @match        https://www.google.de/search*
// @match        https://www.google.fr/search*
// @match        https://www.google.nl/search*
// @match        https://www.google.com.sg/search*
// @match        https://www.google.co.kr/search*
// @match        https://www.google.ca/search*
// @match        https://www.google.com.mx/search*
// @match        https://www.google.co.in/search*
// @match        https://www.google.com.au/search*
// @match        https://www.google.ru/search*
// @match        https://www.google.com.my/search*
// @match        https://www.google.pl/search*
// @match        https://www.google.com.ua/search*
// @match        https://www.google.co.th/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394662/Google%E6%90%9C%E7%B4%A2%E6%A1%86%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/394662/Google%E6%90%9C%E7%B4%A2%E6%A1%86%E5%BF%AB%E9%80%9F%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const inter = 200;
    const typebox = document.querySelector('input[type=text]');
    const suggestionsTrigger = typebox.parentNode.children[0];
    const assist = document.querySelector('.sfbgg');

    let last = Date.now();

    document.documentElement.addEventListener('keydown', e => {
        if (e.keyCode === 16) {
            let current = Date.now();
            if (current - last > inter) {
                last = current;
            } else {
                typebox.click();
                typebox.focus();
                typebox.select();
                suggestionsTrigger.click();
            }
        }
    });

    typebox.addEventListener('keydown', e => {
        if (e.keyCode === 27) {
            typebox.blur();
            assist.click();
        }
    });
})();
