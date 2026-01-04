// ==UserScript==
// @name         nhentai-add-month-filter
// @namespace    https://google.fr
// @version      0.1
// @description  add month filter
// @author       Hynauts
// @match        https://nhentai.net/search/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429061/nhentai-add-month-filter.user.js
// @updateURL https://update.greasyfork.org/scripts/429061/nhentai-add-month-filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.getElementsByClassName("sort-type");
    var q = a[1].innerHTML.substring(a[1].innerHTML.indexOf("?q=") + 3, a[1].innerHTML.indexOf("&amp"))

    a[1].innerHTML = `<span class="sort-name">Popular:</span><a href="/search/?q=${q}&amp;sort=popular-today">today</a><a href="/search/?q=${q}&amp;sort=popular-week">week</a><a href="/search/?q=${q}&amp;sort=popular-month">month</a><a href="/search/?q=${q}&amp;sort=popular">all time</a>`
})();