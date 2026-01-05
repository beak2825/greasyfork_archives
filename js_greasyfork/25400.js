// ==UserScript==
// @name         HS paywall remover, maksumuurin poistaja
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes weekly views limit on hs.fi. Ohittaa näyttökertarajoituksen.
// @author       Anonymous
// @match        http://www.hs.fi/*
// @match        https://www.hs.fi/*
// @match        http://hs.fi/*
// @match        https://hs.fi/*
// @grant        none
// @run-at       document-start
// @licence      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/25400/HS%20paywall%20remover%2C%20maksumuurin%20poistaja.user.js
// @updateURL https://update.greasyfork.org/scripts/25400/HS%20paywall%20remover%2C%20maksumuurin%20poistaja.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ready = false;          
    
    // Run until paywall called or document ready
    var disablePaywall = function() {        
        
        window.MeteredPaywall = {
            init: function() { ready = true;}
        };        
        
        if(document.readyState === 'complete') {
            ready = true;
        }
        
        if(!ready) {
            setTimeout(disablePaywall, 0);
        }
        
    };    
       
    disablePaywall();

})();