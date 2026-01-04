// ==UserScript==
// @name         Torn Custom Background for Vinerri Members
// @namespace    By Prince-5T3N
// @version      0.2
// @description  A custom background for Vinerri Faction Members
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/439986/Torn%20Custom%20Background%20for%20Vinerri%20Members.user.js
// @updateURL https://update.greasyfork.org/scripts/439986/Torn%20Custom%20Background%20for%20Vinerri%20Members.meta.js
// ==/UserScript==



(function() {
    'use strict';
    window.onload = function() {
        document.getElementsByClassName('custom-bg-desktop')[0].style.backgroundImage = 'url("https://i.ibb.co/4J6LP9B/Viva-Vinerri-background.png")';
        document.getElementsByClassName('custom-bg-mobile')[0].style.backgroundImage = 'url("https://i.ibb.co/CQ46Jys/Viva-Vinerri-background-mobile.png")';

    }
})();