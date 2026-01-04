// ==UserScript==
// @name         Animeszone ANTI-AD-DIV
// @namespace    http://tampermonkey.net/
// @version      24.69.1v
// @description  Tira a div que aparece quando vc usa adblock
// @author       Snowing comedor de casadas
// @match        https://animeszone.net/*
// @icon         https://openai.com/favicon.ico


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491216/Animeszone%20ANTI-AD-DIV.user.js
// @updateURL https://update.greasyfork.org/scripts/491216/Animeszone%20ANTI-AD-DIV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function removeAdBox() {
        
        var divToRemove = document.getElementById("show_adblock");

       
        if (divToRemove) {
            divToRemove.remove();
        }
    }

    
    window.onload = removeAdBox;

    
    setInterval(removeAdBox, 1000); 
//sim eu usei o chat gpt.
})();
