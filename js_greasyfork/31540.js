// ==UserScript==
// @name        Reduce Page Titles
// @namespace   harl.reducepagetitles
// @description Reduces certain page titles by removing substrings
// @description:en Reduces certain page titles by removing substrings
// @include     *
// @version     0.0.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31540/Reduce%20Page%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/31540/Reduce%20Page%20Titles.meta.js
// ==/UserScript==

var hPatterns = [
  " - YouTube",
  " :: Add-ons for Firefox",
  " :: Add-ons for Thunderbird",
  " - Google Search",
  " - Google-Suche",
  " ⇔ Deutsch Wörterbuch - leo.org: Startseite",
  " - LEO: Übersetzung im Englisch ⇔ Deutsch Wörterbuch",
  " – Wikipedia"
];
var hPatternsCount = hPatterns.length;

window.addEventListener("load", hRenameTitles, false);
hRenameTitles();

function hRenameTitles()
{
  for (var i = 0; i < hPatternsCount; i++) {
    var hPattern = hPatterns[i]
    if (document.title.endsWith(hPattern)) {
      document.title = document.title.replace(hPattern, '');
    }
  }
}
