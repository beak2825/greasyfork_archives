// ==UserScript==
// @name         Krunker Hack
// @namespace    http://tampermonkey.net/
// @version      123
// @description  Hack
// @author       Bjarny
// @match       *://*.krunker.io/*
// @match       *://*.browserfps.com/*
// @grant        GM_openInTab
// @grant        window.close
// @grant       window.focus
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499692/Krunker%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/499692/Krunker%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('closing')
    window.close();
})();