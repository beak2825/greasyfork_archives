// ==UserScript==
// @name         Rustclash.com - Text to Link
// @namespace    https://tampermonkey.com
// @version      0.1.1
// @description  This script will replace all "battle/1234567" text messages to clickable links.
// @author       Kapeika
// @match        https://rustclash.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rustclash.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/476523/Rustclashcom%20-%20Text%20to%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/476523/Rustclashcom%20-%20Text%20to%20Link.meta.js
// ==/UserScript==


(function() {
    'use strict';
      setInterval(function() {
    var textSpans = document.querySelectorAll('span');
    for (var i = 0; i < textSpans.length; i++) {
      var span = textSpans[i];
      var text = span.textContent;
      if (text.includes("battles")) {
        var regex = /(battles\/[^\s]+)/gi;
        var newText = text.replace(regex, '<a href="https:\/\/rustclash\.com\/$&" target="_blank" style="color: #22c55e;">$&</a>');
        span.innerHTML = newText;
      }
    }
  }, 500);
})();