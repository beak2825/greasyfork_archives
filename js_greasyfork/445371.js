// ==UserScript==
// @name         4.4_Sort short (shoppingpals.xyz)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Sort short shoppingpals faucet
// @author       Grizon
// @match        https://shoppingpals.xyz/shortlink
// @match        https://shoppingpals.xyz/faucet
// @match        https://shoppingpals.xyz/short
// @icon         https://shoppingpals.xyz/img/logo_sp.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445371/44_Sort%20short%20%28shoppingpalsxyz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445371/44_Sort%20short%20%28shoppingpalsxyz%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
if (document.querySelector('a[href="links/link.php?shortid=43"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=43"]').click();
  }, 3000); //boxlink
}

else if (document.querySelector('a[href="links/link.php?shortid=42"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=42"]').click();
  }, 3000); //Wizzly
}

else if (document.querySelector('a[href="links/link.php?shortid=41"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=41"]').click();
  }, 3000); //Cryptoon
}

else if (document.querySelector('a[href="links/link.php?shortid=44"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=44"]').click();
  }, 3000); //foxlink
}

else if (document.querySelector('a[href="links/link.php?shortid=45"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=45"]').click();
  }, 3000); //moxlink
}

else if (document.querySelector('a[href="links/link.php?shortid=46"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=46"]').click();
  }, 3000); //zoxlink
}

else if (document.querySelector('a[href="links/link.php?shortid=52"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=52"]').click();
  }, 3000); //porofly
}

else if (document.querySelector('a[href="links/link.php?shortid=54"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=54"]').click();
  }, 3000); //zorofly
}

else if (document.querySelector('a[href="links/link.php?shortid=53"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=53"]').click();
  }, 3000); //worofly
}

else if (document.querySelector('a[href="links/link.php?shortid=51"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=51"]').click();
  }, 3000); //morofly
}

else if (document.querySelector('a[href="links/link.php?shortid=56"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=56"]').click();
  }, 3000); //Gameen
}

else if (document.querySelector('a[href="links/link.php?shortid=57"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=57"]').click();
  }, 3000); //Yameen
}

else if (document.querySelector('a[href="links/link.php?shortid=55"]')) {
  setTimeout(function() {
    document.querySelector('a[href="links/link.php?shortid=55"]').click();
  }, 3000); //Fameen
}
//ручной кран
    setInterval(function() {
            if (document.querySelector('div[class="iconcaptcha-holder iconcaptcha-theme-light iconcaptcha-success"]')) {
                document.querySelector('button[class="btn btn-block btn-primary"]').click();
            }
    }, 2000);
  setTimeout(function() {
    document.querySelector('button[name="btn-click1"]').click();
  }, 1500);
  setTimeout(function() {
    document.querySelector('button[name="btn-click2"]').click();
  }, 1500);
  setTimeout(function() {
    document.querySelector('button[name="btn-click3"]').click();
  }, 1500); //
})();