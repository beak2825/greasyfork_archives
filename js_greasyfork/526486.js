// ==UserScript==
// @name         URL Query Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically change pageNo and pageSize in URL queries
// @author       Your Name
// @match        http://<IP_ADDRESS>:<PORT>/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526486/URL%20Query%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/526486/URL%20Query%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    url.searchParams.set('pageNo', '6');
    url.searchParams.set('pageSize', '20');
    window.location.href = url.toString();
})();
