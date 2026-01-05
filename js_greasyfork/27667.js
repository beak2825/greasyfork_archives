// ==UserScript==
// @name        Direct download from Nokia Ovi Store (WaybackMachine Backup)
// @namespace   StephenP
// @description Replaces the Download Button on the Nokia Ovi Store to allow direct downloads from the backup version of the website.
// @include     http://web.archive.org/web/*/http://store.ovi.com/content/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27667/Direct%20download%20from%20Nokia%20Ovi%20Store%20%28WaybackMachine%20Backup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27667/Direct%20download%20from%20Nokia%20Ovi%20Store%20%28WaybackMachine%20Backup%29.meta.js
// ==/UserScript==
var dlButton = document.getElementById('sendViaSuiteBtn');
var price = document.getElementById('price_pricerange');
if (price.innerHTML.trim().localeCompare('Free') === 0) {
  var link = window.location.href.toString();
  var qmpos = link.search('clickSource');
  link = link.substring(0, qmpos - 1) + '/download';
  dlButton.parentElement.innerHTML = '<button style="border-radius: 8px;" id="sendViaSuiteBtn" onClick="window.open(\'' + link + '\',\'_self\')">Download Now!</button>';
} 
else {
  dlButton.parentElement.innerHTML = '<button class="disabled" style="border-radius: 8px;" id="sendViaSuiteBtn">Download not available.</button>';
}
