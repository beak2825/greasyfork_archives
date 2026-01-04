// ==UserScript==
// @name         Poe fandom to wiki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto forward fandom to fanmade wiki
// @author       /u/happy_Bunny1/
// @match        https://pathofexile.fandom.com/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=fandom.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/434052/Poe%20fandom%20to%20wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/434052/Poe%20fandom%20to%20wiki.meta.js
// ==/UserScript==


var currentURL = window.document.location.toString();
if(currentURL.includes("pathofexile.fandom.com")) {
  var newURL = currentURL.replace("pathofexile.fandom.com","www.poewiki.net");
  window.document.location.replace(newURL);
}

