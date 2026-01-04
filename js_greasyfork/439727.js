// ==UserScript==
// @name         Erev - Anti Cupidon
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Get rid of the Valentines theme (and maybe other themes as well) on Erevollution.
// @author       Sky
// @match        https://*.erevollution.com/*
// @icon         https://www.google.com/s2/favicons?domain=erevollution.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439727/Erev%20-%20Anti%20Cupidon.user.js
// @updateURL https://update.greasyfork.org/scripts/439727/Erev%20-%20Anti%20Cupidon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName('style')[0].textContent = '';
})();
