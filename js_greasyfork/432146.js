// ==UserScript==
// @name         wiki_mobilizer
// @namespace    https://www.wikipedia.org
// @version      0.1
// @description  convert wikipedia to mobile version on desktop
// @match        https://*.wikipedia.org/*
// @exclude      https://*m.wikipedia.org/*
// @author       iampopovich
// @icon         https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432146/wiki_mobilizer.user.js
// @updateURL https://update.greasyfork.org/scripts/432146/wiki_mobilizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentUrl = window.location.href;
    let mobileUrl = currentUrl.replace('wikipedia','m.wikipedia');
    window.location.href = mobileUrl;
})();