// ==UserScript==
// @name         d20PFSRD
// @namespace    lander_scripts
// @version      0.3
// @description  Ajusts content size!
// @match        https://www.d20pfsrd.com/*
// @icon         https://uptime.com/media/website_profiles/d20pfsrd.com.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424100/d20PFSRD.user.js
// @updateURL https://update.greasyfork.org/scripts/424100/d20PFSRD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.getElementsByClassName('article-text')[0].className = "col-sm-11 col-md-11 col-lg-11 col-xs-11 article-text";

    console.info('d20PFSRD - Site improvements: on!');
})();