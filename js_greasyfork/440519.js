// ==UserScript==
// @name         StlToday Free Browsing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the paywall on STLToday (St. Louis Post-Dispatch)
// @author       Moustapha Happydev
// @match        https://www.stltoday.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stltoday.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440519/StlToday%20Free%20Browsing.user.js
// @updateURL https://update.greasyfork.org/scripts/440519/StlToday%20Free%20Browsing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var interval = setInterval(function(){
        var modal = document.getElementById("lee-subscription-wall");
        var backdrop = document.querySelector(".modal-backdrop.fade.in");
        if (modal && backdrop){
            [backdrop, modal].forEach(function(el){el.remove();});
            document.body.style.cssText += "overflow: scroll !important";
            clearInterval(interval);
        }
    }, 0);

    })();