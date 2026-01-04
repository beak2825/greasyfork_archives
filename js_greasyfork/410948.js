// ==UserScript==
// @name         Golang website without banner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove the banner of the golang website.
// @author       Unknown
// @match        *://*.golang.org/*
// @match        *://*.go.dev/*
// @match        *://*.godoc.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410948/Golang%20website%20without%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/410948/Golang%20website%20without%20banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeWithClassName(className) {
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
        return;
    }

    if( /golang/.test(window.location.host) ){
        removeWithClassName("Header-banner");
    } else if(/go\.dev/.test(window.location.host)) {
        removeWithClassName("Banner");
    } else if(/godoc/.test(window.location.host)) {
        var elements = document.querySelectorAll('[class^=navbar-]');
        if (elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
})();