// ==UserScript==
// @name         Songsterr Print-Enabler
// @namespace    https://greasyfork.org/de/scripts/369383-songsterr-print-enabler
// @version      0.5
// @description  Enable printing at songsterr.com
// @author       Guitar Hero
// @grant        none
// @include *songsterr.com*
// @include songsterr.com*
// @include *songsterr.com
// @include songsterr.com
// @include www.songsterr.com*
// @include http://songsterr.com/*
// @include http://*.songsterr.com/*

// @downloadURL https://update.greasyfork.org/scripts/369383/Songsterr%20Print-Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/369383/Songsterr%20Print-Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    
    // Remove nag screens
    function removeNagScreens() {
        addGlobalStyle('section section:not(#tablature) { display: none !important; }');
        addGlobalStyle('header a[target="_blank"] { display: none !important; }');
    }

    // Show tabs
    function showTabsOnPrintView() {
        addGlobalStyle('#root #tablature svg:not(:first-child) { display: block !important; }');
        addGlobalStyle('@media print { #root #tablature svg g[data-label=cursor] { display: none !important; } }');
    }

    // Enable print button
    function enablePrintButton() {
        try {
            addGlobalStyle('.enabler-print > div[role=dialog] { display: none !important; }');
            
            var printElement = document.querySelector('#print-title-id').parentNode;
            printElement.parentNode.parentNode.classList.add('enabler-print');
            printElement.onclick = function(){window.print();};
        } catch(ex) {
            console.log("error enabling print button: " + ex);
        }
    }

    function enableAll() {
        removeNagScreens();
        showTabsOnPrintView();
        enablePrintButton();
    }

    function registrateOnLocationChange() {
        var pushState = history.pushState;
        history.pushState = function () {
            var changedUrl = arguments[2];
            pushState.apply(history, arguments);
            enableAll();
        };
    }
    registrateOnLocationChange();
    enableAll();
})();
