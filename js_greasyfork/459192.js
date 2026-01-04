// ==UserScript==
// @name         Ozon catalog titles
// @namespace    https://greasyfork.org/en/scripts/459192-ozon-catalog-titles
// @version      1.2
// @description  Adds "title" attribute to ozon.ru catalog titles
// @author       Alexey Yashin <me@alexey-yashin.ru>
// @match        https://ozon.ru/*
// @match        https://*.ozon.ru/*
// @match        http://ozon.ru/*
// @match        http://*.ozon.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459192/Ozon%20catalog%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/459192/Ozon%20catalog%20titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        let titles = document.querySelectorAll('.tile-hover-target span span:not([title*=" "]), .tsBodyL span:not([title*=" "]), span.tsBody500Medium:not([title*=" "])');
        for (let span of titles) {
            span.setAttribute('title', span.innerText);
        }
    }, 100);
})();
