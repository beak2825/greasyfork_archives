// ==UserScript==
// @name         Bypass 1500chan.org
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass da mascara 1500chan.org
// @author       GPT
// @match        https://1500chan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473741/Bypass%201500chanorg.user.js
// @updateURL https://update.greasyfork.org/scripts/473741/Bypass%201500chanorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.cookie = "MC=1;domain=1500chan.org;path=/";
})();
