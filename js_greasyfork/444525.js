// ==UserScript==
// @name         某柠檬删除前6个
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  某柠檬删除前6个!
// @author       You
// @match        https://www.moulem.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moulem.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444525/%E6%9F%90%E6%9F%A0%E6%AA%AC%E5%88%A0%E9%99%A4%E5%89%8D6%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/444525/%E6%9F%90%E6%9F%A0%E6%AA%AC%E5%88%A0%E9%99%A4%E5%89%8D6%E4%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let count = 0;
    let ul = document.querySelector(".website>ul");
    let liArr = [];
    const timer = setInterval(() => {
        if (count >= 50) {
            clearInterval(timer);
        }
        if (!ul) {
            ul = document.querySelector(".website>ul");
        }
        if (liArr.length === 0) {
            liArr = ul.querySelectorAll(".website>ul>li");
        }
        if (ul && liArr.length > 0) {
            liArr.forEach((item) => {
                if (item.getAttribute("data-sort") <= 5) {
                    ul.removeChild(item);
                }
            });
            clearInterval(timer);
        }
        count++;
    }, 100);

})();