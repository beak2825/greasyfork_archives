// ==UserScript==
// @name         Remove snow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove snow on forum.rodina-rp.com
// @author       You
// @match        https://forum.rodina-rp.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457129/Remove%20snow.user.js
// @updateURL https://update.greasyfork.org/scripts/457129/Remove%20snow.meta.js
// ==/UserScript==

(function() {

    const elements = document.getElementsByClassName("js-thHolidaysSnowstormCanvas");

    elements[0].remove();
})();