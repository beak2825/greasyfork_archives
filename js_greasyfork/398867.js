// ==UserScript==
// @name         Anty lag + Zamykanie The Best
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author
// @match        *://*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398867/Anty%20lag%20%2B%20Zamykanie%20The%20Best.user.js
// @updateURL https://update.greasyfork.org/scripts/398867/Anty%20lag%20%2B%20Zamykanie%20The%20Best.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function antyLag(){
        if($('#battletimer')[0].innerText == "Walka zakończona." && $('#battle')[0].style["display"] == "block"){
            _g('fight&a=quit');
            console.log("Zamknięto okno.");
        }
    }
    setInterval(function(){ antyLag(); }, 150);
})();