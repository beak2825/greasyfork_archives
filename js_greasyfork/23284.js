// ==UserScript==
// @name        LeclercDrive-PanierSansSuggestions
// @namespace   Filtres
// @description Ferme automatiquement les suggestions du panier quand la page est chargée entièrement.
// @include     http://fd*-courses.leclercdrive.fr/magasin-*/detail-panier.aspx
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23284/LeclercDrive-PanierSansSuggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/23284/LeclercDrive-PanierSansSuggestions.meta.js
// ==/UserScript==

window.onload = function() {
  var anchors = document.getElementsByTagName("a");
  for (var i=0; i<anchors.length; i++) {
    if (anchors[i].className.indexOf("SupprimeCrossUp") >= 0) {
      anchors[i].click();
    }
  }
}