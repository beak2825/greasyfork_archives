// ==UserScript==
// @name            View images on Google Images
// @name:it         Visualizza immagini su Google Immagini
// @name:es         Ver imágenes en Google Imágenes
// @name:fr         Voir les images sur Google Images
// @author Maxeo | maxeo.net
// @version         1.1.2
//@icon https://www.maxeo.net/imgs/icon/android-chrome-192x192.png
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @description     Click and view Images on Google Images
// @description:it  Clicca e visualizza Immagini su Google Immagini
// @description:es  Haga clic y vea imágenes en Google Images
// @description:fr  Cliquez et visionnez les images sur Google Images
// @include         http*://*.google.tld/search*tbm=isch*
// @namespace https://greasyfork.org/users/88678
// @downloadURL https://update.greasyfork.org/scripts/39740/View%20images%20on%20Google%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/39740/View%20images%20on%20Google%20Images.meta.js
// ==/UserScript==
function getImgOnGoogleImage() {
  var cntList = {
    0: false,
    1: false,
    2: false
  }
  var functionListener = function (event) {
    event.preventDefault();
    window.open(this.src);
  }
  setInterval(function () {
    var imges = document.querySelectorAll('img.irc_mi')
    for (var i = 0; imges.item(i) != null; i++) {
      var imge = imges.item(i);
      if (cntList[i]) {
        imge.removeEventListener('click', functionListener, false);
      } else {
        cntList[i] = true;
      }
      imge.addEventListener('click', functionListener, false);
    }
  }, 200)
}
getImgOnGoogleImage();
