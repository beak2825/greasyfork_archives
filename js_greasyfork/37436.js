// ==UserScript==
// @name         Remove Facebook Login Nag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the login nag screen on Facebook that shows up when you're not logged in.
// @author       Porama Ruengrairatanaroj
// @match        *://*.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37436/Remove%20Facebook%20Login%20Nag.user.js
// @updateURL https://update.greasyfork.org/scripts/37436/Remove%20Facebook%20Login%20Nag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElementsByClassName(className) {
        let elems = document.getElementsByClassName(className);

        for(let i = 0; i < elems.length; ++i) {
            elems[i].style.visibility = 'hidden';
            elems[i].style.display = 'none';
            //let comment = document.createComment(elems[i].outerHTML);
            //elems[i].replaceWith(comment);
        }
    }

    hideElementsByClassName("_3ob9");
    hideElementsByClassName("_62uh");
    hideElementsByClassName("_5hn6");
})();