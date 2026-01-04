// ==UserScript==
// @name         TEFc Map Link Replacement
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces the official map link with Uitleger's TEFc map
// @author       Unplugged
// @match        http://endlessforest.org/community/*
// @match        http://www.endlessforest.org/community/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406263/TEFc%20Map%20Link%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/406263/TEFc%20Map%20Link%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var maplink = document.querySelector('[href="/community/current-map-forest"]');
    maplink.setAttribute("href","/community/node/102262");
})();