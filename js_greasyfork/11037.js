// ==UserScript==
// @name        KlarerSpiegel
// @namespace   KlarerSpiegel
// @description Entfernt nicht neutrale Artikel von spiegel.de
// @include     http://www.spiegel.de/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11037/KlarerSpiegel.user.js
// @updateURL https://update.greasyfork.org/scripts/11037/KlarerSpiegel.meta.js
// ==/UserScript==

function isOpinion(text) {
  if (text.indexOf("Kommentar") != -1) return true;
  if (text.indexOf("Kolumner") != -1) return true;
  
  return false;
}

function hideTeaser(list) {
  for (let teaser of list) {
    var authors = teaser.getElementsByClassName('author');
    if (authors.length > 0) {
      var authorText = authors[0].textContent;
      if (isOpinion(authorText)) {
        console.log(authorText);
        teaser.style.display = 'none';
      }
    }
  }
}

window.addEventListener('load', function() {
  hideTeaser(document.getElementsByClassName('teaser'));
  hideTeaser(document.getElementsByClassName('ressort-teaser-box-top'));
  
  document.getElementById('html_113476').style.display = 'none';
});