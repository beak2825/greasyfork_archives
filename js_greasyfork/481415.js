// ==UserScript==
// @name         CSGO ROLL - text to link
// @namespace    csgoroll.gg
// @version      0.1.3
// @description  This script will replace all "csgoroll battles" text messages to clickable links.
// @author       Sheepy
// @match        https://www.csgoroll.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csgoroll.gg
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/481415/CSGO%20ROLL%20-%20text%20to%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/481415/CSGO%20ROLL%20-%20text%20to%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
      setInterval(function() {
    var textSpans = document.querySelectorAll('span');
    for (var i = 0; i < textSpans.length; i++) {
      var span = textSpans[i];
      var text = span.textContent;
      if (text.includes("csgoroll")) {
        var regex = /(en\/pvp\/[^\s]+)/gi;
        var newText = text.replace(regex, '<a href="https:\/\/csgoroll\.gg\/$&" target="_blank" style="color: #d896ff;">$&</a>');
        span.innerHTML = newText;
      }
    }
  }, 500);
})();