// ==UserScript==
// @name            Filmweb AdBlocker
// @namespace       filmweb
// @author          DominikStyp
// @copyright       2017, DominikStyp
// @homepageURL     https://github.com/DominikStyp
// @description     Skrypt wlacza mozliwosc korzystania z a adblocka na filmwebie
// @license         GPL Public License
// @include         http://*.filmweb.pl/*
// @include         https://*.filmweb.pl/*
// @match           http://*.filmweb.pl/*
// @match           https://*.filmweb.pl/*
// @version 		1.1.5
// @grant      		none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/377664/Filmweb%20AdBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/377664/Filmweb%20AdBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        window.hasAdblock = false;
		// CLONE querySelector() function so overriding native function won't affect qs()
        var qs = document.querySelector.bind(document);
        document.querySelector = function(param){
            if(param.indexOf(".filmCastBox") !== -1 ||
               param.indexOf(".filmographyTable") !== -1){
                return function(){
					return function(){};
			     };
            }
            return qs(param);
       };
       console.log("Filmweb Adblocker version: " + GM_info.script.version);
    }, 10);
})();