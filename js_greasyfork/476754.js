// ==UserScript==
// @name          Zynga farmville 2 figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       10.4
// @description   click automatico accesso connect with facebook  farmville 2
// @author        figuccio
// @match         https://zyngagames.com/*
// @match         https://*.facebook.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=zyngagames.com
// @grant         GM_addStyle
// @noframes
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/476754/Zynga%20farmville%202%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/476754/Zynga%20farmville%202%20figuccio.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Funzione per cercare e cliccare sull'elemento
    function clickOnAccept() {
     const elements = document.querySelectorAll('*');
     elements.forEach(element => {
 if (element.textContent.includes('Connect with Facebook') ||
     element.textContent.includes('Continua come Ivana') ||
     element.textContent.includes('Play Now!') ||
     element.textContent.includes('Continua come Federica') ||
     element.textContent.includes('Continua come Maura') ||
     element.textContent.includes('Continua come Angela') ||
     element.textContent.includes('Continua come Francesco') ||
     element.textContent.includes('Continua come Nino') ||
     element.textContent.includes('Continua come Giuseppe')) {
     element.click();
            }
        });
    }

    // Esegui la funzione al caricamento della pagina
    window.addEventListener('load', function() {
        // Ripeti la funzione dopo 2 secondi
        setTimeout(clickOnAccept, 2000);
        setTimeout(fbSignupButton, 2000);
    });
    /////////////////////////////////
       // Extra selector click for specific Facebook signup button
    const fbSignupButton = document.querySelector("#signup-carousel-fb > div > div > div > div:nth-child(3) > button");
    if (fbSignupButton) {
        fbSignupButton.click();
    }
    //////////////////////////////////

//popup zynga
GM_addStyle("#noty_layout__topRight{display:none!important;}");

})();
