// ==UserScript==
// @name         Fandom Simplifyer
// @namespace    jsnhlbr5
// @version      0.2
// @description  Hide Global Nav bar and "Community" aside
// @author       Jsnhlbr5
// @license      MIT
// @match        https://*.fandom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456031/Fandom%20Simplifyer.user.js
// @updateURL https://update.greasyfork.org/scripts/456031/Fandom%20Simplifyer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Remove unnecessary Fandom bloat
//    document.getElementsByClassName("global-navigation")[0].remove();
    document.getElementById('global-explore-navigation').remove();
    document.getElementsByClassName("page__right-rail")[0].remove();
//    document.getElementsByClassName("wikia-bar")[0].remove();
    document.getElementById('WikiaBar').remove();
    document.getElementsByClassName("notifications-placeholder")[0].remove();

    //Remove the space for the Global Nav bar
    var main = document.getElementsByClassName("main-container")[0];
    main.style.margin = 'auto';
    main.style.width = 'auto';
//    document.getElementsByClassName("fandom-sticky-header")[0].style.left = 0;
})();