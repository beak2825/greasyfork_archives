// ==UserScript==
// @name         DocTorn Margin Fixer
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  Fix the margins when DocTorn Sidebar is used on mobile.
// @author       DeadMechanic
// @match        https://www.torn.com/*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/392849/DocTorn%20Margin%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/392849/DocTorn%20Margin%20Fixer.meta.js
// ==/UserScript==

(function() {

    'use strict';
    if(getComputedStyle(document.getElementsByClassName("custom-bg-mobile")[0], null).display != "none"){
        if(document.getElementsByClassName("doctorn-sidebar-link")[0].parentElement != undefined){
            var sideBarHeight = document.getElementsByClassName("doctorn-sidebar-link")[0].parentElement.offsetHeight;
            var content = document.getElementsByClassName("content-wrapper")[0];
            var marginTop = window.getComputedStyle(content).getPropertyValue('margin-top');
            content.style.marginTop = (parseInt(marginTop.slice(0, -2)) + sideBarHeight) + "px";
        }
}
})();