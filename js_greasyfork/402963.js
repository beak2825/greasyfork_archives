// ==UserScript==
// @name         Amazon go to offers
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       You
// @match        *://www.amazon.ca/*
// @match        *://www.amazon.com/*
// @match        *://www.amazon.co.uk/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/402963/Amazon%20go%20to%20offers.user.js
// @updateURL https://update.greasyfork.org/scripts/402963/Amazon%20go%20to%20offers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let id = location.pathname.match(/\/(dp|product)\/(?<id>.+?)(\/|$)/).groups.id;
    let href = `https://www.amazon.ca/gp/offer-listing/${id}`;
    location.href = href;
})();
