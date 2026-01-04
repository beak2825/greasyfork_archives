// ==UserScript==
// @name         Etsy - Remove Promoted Ads [DEPRECATED]
// @author       RandomUsername404
// @namespace    https://greasyfork.org/en/users/105361-randomusername404
// @version      1.41
// @description  Remove the promoted ads that clutter the search results on Etsy.
// @run-at       document-start
// @include      https://www.etsy.com/*/search?q=*
// @include      https://www.etsy.com/search?q=*
// @grant        none
// @icon         https://www.etsy.com/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/391449/Etsy%20-%20Remove%20Promoted%20Ads%20%5BDEPRECATED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/391449/Etsy%20-%20Remove%20Promoted%20Ads%20%5BDEPRECATED%5D.meta.js
// ==/UserScript==

var promoted = ["Publicité d'", "Anzeige des", "Ad by", "Anuncio del", "Annuncio di", "Etsy セラーによる広告", "Advertentie van", "Reklama sprzedawcy", "Anúncio de", "Реклама от"];

window.onload = function() {
    setInterval(function(){
      var elements = document.querySelectorAll('[data-ad-label]').forEach((el, i) => {

          for(var count=0; count < promoted.length; count++) {

              if(el.innerText.includes(promoted[count])) {
                  var item = el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                  item.parentNode.removeChild(item);

                  console.log("Ads removed.");
              }
          }
      });
    }, 1700);
}