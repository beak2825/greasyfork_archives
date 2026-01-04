// ==UserScript==
// @name        AnimalQueryJS
// @description Tries to speedup browsing by disabling JS (jQuery) animations
// @license     WTFPLv2, no warranty
// @version     2022.03.09.1503
// @namespace   https://greasyfork.org/users/30-opsomh
// @grant       none
// @inject-into auto
// @run-at      document-start
// @include     *
// @exclude     https://www.olx.pl/*
// @exclude     https://www.steamdeck.com/*
// @downloadURL https://update.greasyfork.org/scripts/40529/AnimalQueryJS.user.js
// @updateURL https://update.greasyfork.org/scripts/40529/AnimalQueryJS.meta.js
// ==/UserScript==
/* jshint esversion: 6 */ 

(function(){
    window.addEventListener('load', function(){
        try{
            if(window.jQuery && window.jQuery.fx){
                window.jQuery.fx.off = true;
            } else if (window.wrappedJSObject && window.wrappedJSObject.jQuery && window.wrappedJSObject.jQuery.fx ){
                window.wrappedJSObject.jQuery.fx.off = true;
            }
        }catch(e){}
    });
})();
