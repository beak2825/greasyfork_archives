// ==UserScript==
// @name         openbravo prod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.openbravo.opentix.es/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33361/openbravo%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/33361/openbravo%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function myJQueryCode() {
            $( document ).ready(function() {
                setTimeout(function(){
                    $("#isc_1D, #isc_1, .Login_LogForm").css("background-color", "red");
                }, 2000);
                setTimeout(function(){
                    $("#isc_1D, #isc_1, .Login_LogForm").css("background-color", "red");
                }, 5000);
            });
    }
    if(typeof jQuery=='undefined') {
        var headTag = document.getElementsByTagName("head")[0];
        var jqTag = document.createElement('script');
        jqTag.type = 'text/javascript';
        jqTag.src = 'https://code.jquery.com/jquery-3.2.1.min.js';
        jqTag.onload = myJQueryCode;
        headTag.appendChild(jqTag);
    } else {
        myJQueryCode();
    }

})();