// ==UserScript==
// @name         Clash.GG - Text to Link
// @namespace    https://gge.gg
// @version      0.1.1
// @description  This script will replace all "csgo-case-battle/1234567" text messages to clickable links.
// @author       DynamixXx
// @match        https://clash.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clash.gg
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/475374/ClashGG%20-%20Text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/475374/ClashGG%20-%20Text%20to%20Link.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
      setInterval(function() {
    var textSpans = document.querySelectorAll('span');
    for (var i = 0; i < textSpans.length; i++) {
      var span = textSpans[i];
      var text = span.textContent;
      if (text.includes("csgo-case-battles")) {
        var regex = /(csgo-case-battles\/[^\s]+)/gi;
        var newText = text.replace(regex, '<a href="https:\/\/clash\.gg\/$&" target="_blank" style="color: #1167b1;">$&</a>');
        span.innerHTML = newText;
      }
    }
  }, 500);
})();