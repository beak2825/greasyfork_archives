// ==UserScript==
// @name         Kissanime auto hide ads
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto clicks to hide all ads
// @author       Yeo Xing Yee
// @match        *://kissanime.ru/Anime/*/*
// @match        *://kissanime.ru/Anime/*
// @match        *://kissanime.ru/Special/*
// @match        *://kissanime.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30274/Kissanime%20auto%20hide%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/30274/Kissanime%20auto%20hide%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
// your code
function hideAds(){
    if ($('#divFloatRight').css('display') !== 'none'){
        console.log( "Hiding all ads..." );
        $(".divCloseBut a").click();
        $("#divAds").hide();
        $("#divAds2").hide();
        $("#divFloatRight").hide();
        $("#divFloatLeft").hide();
         console.log("Done!");
    }

    setTimeout(hideAds, 100);
}
    hideAds();
})();