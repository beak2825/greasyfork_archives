// ==UserScript==
// @name         Steam Skip External Site Warning
// @namespace    https://steamcommunity.com
// @version      0.1
// @description  Skips the "x is not an official Steam site." page
// @author       pgsill
// @match        https://steamcommunity.com/linkfilter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374139/Steam%20Skip%20External%20Site%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/374139/Steam%20Skip%20External%20Site%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const destinationUrl = window.location.href.split('https://steamcommunity.com/linkfilter/?url=')[1];

    window.location.href = destinationUrl;
})();