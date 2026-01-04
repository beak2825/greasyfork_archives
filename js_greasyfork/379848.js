// ==UserScript==
// @name         Sneaks ATC
// @namespace    https://https://greasyfork.org/en/scripts/379848-sneaks-atc
// @version      1.02
// @description  Autorun on applicable pages
// @author       Sneaks
// @match        *.sotostore.com/en/?sn=*
// @match        *.nakedcph.com/cart/?sn=*
// @match        *.sneakersnstuff.com/en/?sn=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379848/Sneaks%20ATC.user.js
// @updateURL https://update.greasyfork.org/scripts/379848/Sneaks%20ATC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('test')
    if(window.location.href.split("sn=")[1] !== undefined){
        document.cookie=`png.state=${window.location.href.split("sn=")[1]}`;
        switch(window.location.host){
            case 'www.nakedcph.com':
                window.location = "https://www.nakedcph.com/cart/view";
                break;
            case 'www.sneakersnstuff.com':
                window.location = "https://www.sneakersnstuff.com/en/cart/view";
                break;
            case 'www.sotostore.com':
                window.location = "https://www.sotostore.com/en/cart/view";
                break;
        }
    } else {
        console.log('Missing SN data');
    }

})();