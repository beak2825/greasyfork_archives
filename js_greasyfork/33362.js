// ==UserScript==
// @name         sugar prod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.sugar.opentix.es/*
// @match        https://*.sugaropencloud.eu/*
// @match        https://*.sugarondemand.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33362/sugar%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/33362/sugar%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function myJQueryCode() {
            $( document ).ready(function() {
                setTimeout(function(){
                    $(".thumbnail.login").css("background-color", "#FA5858");
                }, 1000);
                setTimeout(function(){
                    $(".nav-collapse").css("background-color", "#FA5858");
                    $("li[data-module='Home']").children().css("background-color", "#FA5858");
                }, 2000);
                setTimeout(function(){
                    $(".nav-collapse").css("background-color", "#FA5858");
                    $("li[data-module='Home']").children().css("background-color", "#FA5858");
                }, 5000);
            });
    }
    if(typeof $=='undefined') {
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