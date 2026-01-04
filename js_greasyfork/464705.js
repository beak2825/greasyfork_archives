// ==UserScript==
// @name         Fandom Remove Ads
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove ads from fandom.com wiki sites
// @author       David K Johonson
// @license      MIT License
// @match        https://*.fandom.com/*
// @icon         https://static.wikia.nocookie.net/unchartedwaters/images/4/4a/Site-favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/464705/Fandom%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/464705/Fandom%20Remove%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elems = document.getElementsByClassName('top-ads-container');
    elems[0].parentNode.removeChild(elems[0]);

    elems = document.getElementsByClassName('mcf-wrapper');
    elems[0].parentNode.removeChild(elems[0]);

    elems = document.getElementsByClassName('bottom-ads-container');
    elems[0].parentNode.removeChild(elems[0]);

    elems = document.getElementsByClassName('global-footer__bottom');
    elems[0].parentNode.removeChild(elems[0]);

})();

