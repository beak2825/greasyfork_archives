// ==UserScript==
// @name         local time in stackoverflow and stackexchange
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  convert time in stackoverflow and stackexchange to the locale string
// @author       You
// @match        https://*.stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388362/local%20time%20in%20stackoverflow%20and%20stackexchange.user.js
// @updateURL https://update.greasyfork.org/scripts/388362/local%20time%20in%20stackoverflow%20and%20stackexchange.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let spans = document.querySelectorAll('div.user-action-time>span');
    spans.forEach(span => {
        let date = new Date(span.title);
        span.innerHTML = date.toLocaleString();
    })
    // Your code here...
})();