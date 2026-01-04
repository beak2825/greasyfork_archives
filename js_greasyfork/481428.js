// ==UserScript==
// @name         Default Google Translator Languages
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Automatically selects the languages you want.
// @author       hacker09
// @match        https://translate.google.com/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://translate.google.com/&size=32
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/481428/Default%20Google%20Translator%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/481428/Default%20Google%20Translator%20Languages.meta.js
// ==/UserScript==

(function() {
  'use strict';
  GM_registerMenuCommand("Save Current Settings", function(){ GM_setValue('Settings', location.href); }); //Adds an option to the tampermonkey menu
  if (window.location.search.match('tl=') === null && GM_getValue('Settings') !== undefined) { //If the current page doesn't have any language set
    location.href = GM_getValue('Settings'); //Set the default language
  } //Finishes the if condition
 })();