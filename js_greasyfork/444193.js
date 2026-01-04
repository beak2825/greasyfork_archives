// ==UserScript==
// @name         DBLP显示页数
// @version      1.0
// @description  如题。
// @author       You
// @match        https://dblp.uni-trier.de/db/*/*/*.html
// @icon         https://dblp.uni-trier.de/img/dblp.icon.192x192.png
// @grant        none
// @license      GPL-3.0 License
// @namespace https://greasyfork.org/users/812132
// @downloadURL https://update.greasyfork.org/scripts/444193/DBLP%E6%98%BE%E7%A4%BA%E9%A1%B5%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/444193/DBLP%E6%98%BE%E7%A4%BA%E9%A1%B5%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = window.location.href;

    let spans = document.getElementsByClassName('title');
    for (let i = 0; i < spans.length; i++) {
        let span = spans[i].nextElementSibling.innerHTML.split(/:|-/ig);
        let num = url.match(/jmlr/ig) ? span[3] - span[1] : span[1] - span[0];
        let printSpan = document.createElement('span');
        printSpan.id = "printSpan";
        printSpan.style.color = "red";
        printSpan.innerHTML = num;
        spans[i].append(printSpan);
    }
})();