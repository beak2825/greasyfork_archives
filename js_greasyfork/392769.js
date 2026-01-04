// ==UserScript==
// @name         Facebook remove right column
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove the right column on facebook ( web platform )
// @author       n24xxx
// @match        https://facebook.com
// @icon         https://i.imgur.com/F8ai0jB.png
// @include		 http://facebook.com/*
// @include		 http://*.facebook.com/*
// @include		 https://facebook.com/*
// @include		 https://*.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392769/Facebook%20remove%20right%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/392769/Facebook%20remove%20right%20column.meta.js
// ==/UserScript==

(function() {
    rightCol = document.querySelector('div#rightCol')
    contentArea = document.querySelector('div#contentArea')
    rightCol.setAttribute('style','display : none')
    contentArea.setAttribute('style','right: 0px; width: 100% !important')
})();