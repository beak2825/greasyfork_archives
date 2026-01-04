// ==UserScript==
// @name         Amazon copy short link
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       You
// @match        *://www.amazon.ca/*
// @match        *://www.amazon.com/*
// @match        *://www.amazon.co.uk/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/399874/Amazon%20copy%20short%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/399874/Amazon%20copy%20short%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let id = location.pathname.match(/\/(dp|product)\/(?<id>.+?)(\/|$)/).groups.id;
    let href = `${location.origin}/dp/${id}`;
    navigator.clipboard.writeText(href);
})();
