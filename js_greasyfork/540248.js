// ==UserScript==
// @name         Stack Overflow Focus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  simply removes unnecessary stuff on stack overflow so you can just focus on getting the information you need
// @author       conder13
// @match        https://stackoverflow.com/questions/*
// @icon         https://conder.dev/image.png
// @grant    GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540248/Stack%20Overflow%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/540248/Stack%20Overflow%20Focus.meta.js
// ==/UserScript==

(function () {
   'use strict';
   document.querySelector("header").remove();
   document.querySelector("#announcement-banner").remove();
   document.querySelector("#sidebar").remove();
   document.querySelector("#left-sidebar").remove();
   document.querySelector("footer").remove();
   document.querySelector(".ps-relative").remove();
   document.querySelector("form").remove();
})();