// ==UserScript==
// @name         Remove Banners from watchseries
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  remove annonying and useless banners from mywatchseries.ac
// @license      https://www.gnu.org/licenses/gpl-3.0.html
// @author       ExtendUrExperience
// @match        http://www.mywatchseries.ac/episode/
// @grant        none
// @include      http*://www.mywatchseries.ac/episode/*
// @downloadURL https://update.greasyfork.org/scripts/28754/Remove%20Banners%20from%20watchseries.user.js
// @updateURL https://update.greasyfork.org/scripts/28754/Remove%20Banners%20from%20watchseries.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var crap = document.getElementsByClassName("sp-leader hidden-sm hidden-xs");
    crap[0].parentNode.removeChild(crap[0]);
    crap[0].parentNode.removeChild(crap[0]);
})();