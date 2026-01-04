// ==UserScript==
// @author craftwar
// @name Dictionary auto pronounce
// @description Automatically pronounce searched word. You need manaully add website to autoplay whitelist to prevent error "Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first."
// @copyright 2023, craftwar (https://craftwarblog.blogspot.com/)
// @license GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/craftwar/userscript/tree/master/Dictionary
// @version 0.1.20230501
// @namespace github.com.craftwar
// @match https://www.dictionary.com/*
// @match https://tw.dictionary.search.yahoo.com/*
// @match https://dictionary.cambridge.org/*
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/450361/Dictionary%20auto%20pronounce.user.js
// @updateURL https://update.greasyfork.org/scripts/450361/Dictionary%20auto%20pronounce.meta.js
// ==/UserScript==

'use strict';
(() => {
  let voice;
  document.addEventListener('readystatechange', () => {
    if (document.readyState == "complete") {
      if (window.location.href.startsWith("https://dictionary.cambridge.org/"))
        voice = document.getElementsByTagName('audio')[1];
      else
        voice = document.getElementsByTagName('audio')[0];
      if (voice)
        voice.play();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key == "MediaPlayPause")
      voice.play();
  });
})();