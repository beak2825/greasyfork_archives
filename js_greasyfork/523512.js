// ==UserScript==
// @name         Cases.GG - Text to Link
// @description  This script will replace all "case-battle/1234567" text messages to clickable links.
// @match        https://cases.gg/*
// @grant        none
// @license      WTFPL
// @version 0.0.1.20250112004106
// @namespace https://greasyfork.org/users/1422210
// @downloadURL https://update.greasyfork.org/scripts/523512/CasesGG%20-%20Text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/523512/CasesGG%20-%20Text%20to%20Link.meta.js
// ==/UserScript==
(function() {
    'use strict';
      setInterval(function() {
    var textSpans = document.querySelectorAll('.gap-1');
    for (var i = 0; i < textSpans.length; i++) {
      var span = textSpans[i];
      var text = span.textContent;
      if (text.includes("case-battles")) {
        var regex = /(case-battles\/[^\s]+)/gi;
        var newText = text.replace(regex, '<a href="https:\/\/cases\.gg\/$&" target="_blank" style="color: #22c55e;">$&</a>');
        span.innerHTML = newText;
      }
    }
  }, 500);
})();