// ==UserScript==
// @name         SCP foundation default logo
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Returns the default logo for the SCP foundation site. No keys are required for this.
// @author       KoHoneJIb
// @match        http://scp-wiki.wikidot.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428495/SCP%20foundation%20default%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/428495/SCP%20foundation%20default%20logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var header = document.getElementById("header");
    header.style.background= "url(/local--files/component:theme/logo.png) 10px 40px no-repeat";
})();