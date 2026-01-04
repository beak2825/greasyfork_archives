// ==UserScript==
// @name         Google Docs Dark Theme
// @namespace    googleDarkTheme
// @version      0.3
// @description  Make Google Docs a bit darker
// @author       JetDave
// @match        https://docs.google.com/document/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413394/Google%20Docs%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/413394/Google%20Docs%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.style.filter = "invert(0.9)";
    window.addEventListener("DOMNodeInserted",invertImgs);
    window.addEventListener("load",invertImgs)
    // kix-embeddedobject-image
    function invertImgs(){
        var elms = document.getElementsByTagName("img");
        for(let elm of elms){
            elm.style.filter = "invert(1)";
        }
        var elms2 = document.getElementsByClassName("kix-spelling-error-overlay");
        for(let elm of elms2){
            elm.style.filter = "invert(1)";
        }
        var elms3 = document.getElementsByClassName("kix-embeddedobject-image");
        for(let elm of elms3){
            elm.style.filter = "invert(1)";
        }
        var elms4 = document.getElementsByClassName("link-bubble-thumbnail-image");
        for(let elm of elms4){
            elm.style.filter = "invert(1)";
        }
    }
})();