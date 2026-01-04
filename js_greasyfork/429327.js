// ==UserScript==
// @name         cppreference-language-switch
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A simple JS for sticking language options on top for cppreference.com
// @author       Samir Duran
// @match        https://*.cppreference.com/*
// @icon         https://www.google.com/s2/favicons?domain=cppreference.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429327/cppreference-language-switch.user.js
// @updateURL https://update.greasyfork.org/scripts/429327/cppreference-language-switch.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var styleSheet = `
        #cpp-languages {
            width:100%;
        }

        #cpp-languages div {
            text-align:center;
        }
    `;
    var s = document.createElement('style');
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);

    var p = document.getElementById("cpp-languages");
    var p_prime = p.cloneNode(true);
    p_prime.removeChild(p_prime.firstElementChild);
    var parentNode = document.getElementsByTagName("body");
    var referenceNode = document.getElementById("cpp-content-base");
    var insertedNode = parentNode[0].insertBefore(p_prime, referenceNode);
})();