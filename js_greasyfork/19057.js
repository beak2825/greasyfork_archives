// ==UserScript==
// @name          Anty Kubisiopedia
// @author        Niqueish
// @homepage      https://www.facebook.com/kamcio43924
// @description	  Usuwa wszystkie posty z nimi związane
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @grant         none
// @include       *.facebook.com/*
// @version       1.1
// @namespace https://greasyfork.org/users/31125
// @downloadURL https://update.greasyfork.org/scripts/19057/Anty%20Kubisiopedia.user.js
// @updateURL https://update.greasyfork.org/scripts/19057/Anty%20Kubisiopedia.meta.js
// ==/UserScript==

var debile = ["Jacek Malinkiewicz", "Jakub Pabian", "Kszysztow Kubis", "Kubisiopedia", "kubisiopedia", "kubisio", "Kubisio"];

$( document ).on( "mouseover", function(){
        var i;
        for	(i = 0; i < debile.length; i++) {
            $("div:contains('"+debile[i]+"')").parents("div[data-ft*='fbfeed_location']").remove();
        }
})();