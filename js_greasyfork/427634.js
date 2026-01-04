// ==UserScript==
// @name         Mangadex - Full size
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Put the main container of the new mangadex website in full size
// @author       Yrtiop
// @match        https://mangadex.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427634/Mangadex%20-%20Full%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/427634/Mangadex%20-%20Full%20size.meta.js
// ==/UserScript==

(function() {

    var containerFullSize = function() {
        setTimeout(() => {
            var container = document.querySelector(".container > .row > .col-sm-8.col-md-6.col-12");
            if(container) {
                container.classList.remove("col-sm-8", "col-md-6");
            }
        }, 1000);
    }

    containerFullSize();
    window.addEventListener("click", containerFullSize, false);
})();