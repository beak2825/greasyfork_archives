// ==UserScript==
// @name        Spiegel Minus - spiegel.de
// @namespace   meyerk.com
// @match       https://www.spiegel.de/*
// @grant       none
// @version     1.4
// @author      MeyerK
// @description Alle Spiegel Plus Artikel auf der Spiegel Homepage ausblenden
// @downloadURL https://update.greasyfork.org/scripts/403001/Spiegel%20Minus%20-%20spiegelde.user.js
// @updateURL https://update.greasyfork.org/scripts/403001/Spiegel%20Minus%20-%20spiegelde.meta.js
// ==/UserScript==

class SpiegelMinus
{
  run()
  {
    var articles = document.querySelectorAll('main article');
    for (let i=0; i < articles.length; i++)
    {
      let premium1 = articles[i].querySelector('*[data-contains-flags="Spplus-paid"]');
      //let premium2 = articles[i].querySelector('*[data-contains-flags="Spplus-conditional"]');
      if (
          premium1 !== null
         )
      {
        articles[i].style.display = 'none';
      }
    }
  }
}

let sm = new SpiegelMinus();
sm.run();
