// ==UserScript==
// @name         Songsterr - Print-Enabler
// @version      0.2.6
// @description  Enable printing at songsterr.com for free accounts
// @author       thedrunkendev
// @namespace    https://greasyfork.org/users/869634
// @grant        GM_addStyle
// @match        https://www.songsterr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://songsterr.com/
// @match        https://songsterr.com/*
// @downloadURL https://update.greasyfork.org/scripts/443566/Songsterr%20-%20Print-Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/443566/Songsterr%20-%20Print-Enabler.meta.js
// ==/UserScript==

/*
This script has been forked from the following, with some tweaks / hacks added as it no longer works
https://greasyfork.org/de/scripts/369383-songsterr-print-enabler

An easy way to test the CSS in this script is to emulate the 'print' css media type. To do this,
open 'dev tools' -> 'more tools' -> rendering -> set 'Emulate CSS media type' to 'print'
*/

(function() {
    'use strict';

    for(var i=document.styleSheets[0].rules.length -1; i >0; i--){
        if(document.styleSheets[0].rules[i].cssText.indexOf("@media print") !=-1)
        {
            console.log("found @media print rule", i, document.styleSheets[0].href)
            console.log(document.styleSheets[0].rules[i].cssText)
        }
    }


    // Remove nag screens
    function removeNagScreens() {
        GM_addStyle('section section:not(#tablature) { display: none !important; }');
        GM_addStyle('header a[target="_blank"] { display: none !important; }');
        // This disables the "You need premium" message when printing
        GM_addStyle(`.Cdy160::after, .Cdy160::before{display: none !important;}`)
        GM_addStyle(`@media print { #promo{display: none !important; } }`)
    }

    // Show tabs
    function showTabsOnPrintView() {
        GM_addStyle('#tablature svg { display: block !important; }');
        // GM_addStyle('#tablature svg:not(:first-child) { display: block !important; }');
        GM_addStyle('@media print { #tablature svg g[data-label=cursor] { display: none !important; } }');

        // Set the height of the tabs so we can print them.
        // This can be a bit buggy but without this CSS, tabs won't get rendered at all
        // on the printed document.
        GM_addStyle(`@media print { .Cdy160 { height:unset; } }`);
    }

    // Enable print button
    function enablePrintButton() {
        try {
            GM_addStyle('.enabler-print > div[role=dialog] { display: none !important; }');

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

        setTimeout(() => {
            var oldFn = document.querySelector("#control-print svg").onclick;
            document.querySelector("#control-print svg").onclick = () => {
                // HACKS: SVG is lazy loaded somehow. Scroll to the bottom to force it to render.
                //window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
                setTimeout(() => oldFn(), 1000)
            };
        },100)

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
