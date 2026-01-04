// ==UserScript==
// @name         Increase Font Size
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Increases the Font Size on all elements on the page.
// @author       hacker09
// @match        https://*/*
// @exclude      https://www.youtube.com/embed/*
// @exclude      https://temu.com/*
// @icon         https://i.imgur.com/2XQm3qI.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481430/Increase%20Font%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/481430/Increase%20Font%20Size.meta.js
// ==/UserScript==

(function() {
  'use strict';
  [...document.getElementsByTagName("*")].forEach(function(el) { el.style.fontSize = "25px"; }); //Increase the font size
})();