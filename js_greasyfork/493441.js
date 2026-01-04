// ==UserScript==
// @name         Cardmarket remember filters
// @namespace    http://tampermonkey.net/
// @version      2024-05-02
// @description  If you enter a singles page without filters, it automatically applies the last filters you had. Useful if you always filter by the same languages or card condition
// @author       You
// @match        https://www.cardmarket.com/*/*/Products/Singles/*
// @match        https://www.cardmarket.com/*/*/Cards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493441/Cardmarket%20remember%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/493441/Cardmarket%20remember%20filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const key = 'cardmarket_auto_filter'
    const search = localStorage.getItem(key)

    if (location.search === '') {
        if (search) {
            location.replace(location.href + search)
        }
    }
    else {
        localStorage.setItem(key, location.search)
    }

})();