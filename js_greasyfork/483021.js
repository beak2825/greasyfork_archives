// ==UserScript==
// @name         Aviso - automatic video playback
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Renda Extra
// @author       Groland
// @match        https://aviso.bz/*
// @match        https://skyhome.webflow.io/*
// @match        https://www.youtube.com/*
// @match        https://avisoview.jimdofree.com/*
// @match        https://twiron.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aviso.bz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483021/Aviso%20-%20automatic%20video%20playback.user.js
// @updateURL https://update.greasyfork.org/scripts/483021/Aviso%20-%20automatic%20video%20playback.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    if (window.location.href.includes("https://twiron.com/no_referer?go_url=https://www.youtube.com/") ){
      window.location.replace("https://aviso.bz/work-youtube?tab=price")}
 
    function foo() {
$("div:nth-of-type(3) span").click();
}
 
setTimeout(foo, 7000);
 
 
 
    setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('.go-link-youtube').click();
    }, 8000);
 
setTimeout(function() {
   if (!(/[?&]autoplay=1/).test(location.search)) {
  document.querySelector(".ytp-large-play-button").click();
}
}, 500);
 
 
 
        if( $(".notranslate.timer") ) {
 
            var check = setInterval( function() {
 
                if( $(".notranslate.timer").text() == "1" ) {
                    clearInterval( check )
                    setTimeout(function() {window.location.replace("https://aviso.bz/work-youtube?tab=price")}, 2000);
 
                }1 * 1000;
            }, 1000);
 
 
        }

 
 


 

 
 
 
 
 
 
})();