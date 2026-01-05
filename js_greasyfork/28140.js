// ==UserScript==
// @name         KR exploit pt 2 /invest
// @namespace    http://tampermonkey.net/
// @version      1.06
// @description  reloads page as invest button
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28140/KR%20exploit%20pt%202%20invest.user.js
// @updateURL https://update.greasyfork.org/scripts/28140/KR%20exploit%20pt%202%20invest.meta.js
// ==/UserScript==

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 220) {
    investInClan();
  }
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 221) {
    document.getElementById("clanInvestInput").value="300";
  }
});