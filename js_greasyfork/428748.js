// ==UserScript==
// @name         Faucetcrypto miniLink Clicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sh.faucet.gold and Sh.faucetcrypto.com autocompletion 
// @author       Kduytsch
// @match        https://faucetcrypto.com/claim/*
// @match        https://faucet.gold/*/*
// @icon         https://www.google.com/s2/favicons?domain=faucetcrypto.com
// @note         Please register with my referral link : https://faucetcrypto.com/ref/1380686
// @downloadURL https://update.greasyfork.org/scripts/428748/Faucetcrypto%20miniLink%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/428748/Faucetcrypto%20miniLink%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timerCSS='#showTimerText';
    var continueCSS='#main-button';
    // var continueCSS='body > div.container.container-fluid > div:nth-child(7)';
    let observer = new MutationObserver(mutationRecords => {
        console.log(mutationRecords); // console.log(the changes)
        setTimeout(function() {
            clickOnCssLink(continueCSS);
        }, random(500,1000));
    });

    function isVisible (element) {
        //start with initial element to check visibility and display
        var el = document.querySelector(element);
        //display and visibility vary per browser and must be sought in different ways depending on the browser
        var t1 = el.currentStyle ? el.currentStyle.visibility : getComputedStyle(el, null).visibility;
        var t2 = el.currentStyle ? el.currentStyle.display : getComputedStyle(el, null).display;
        //if either of these are true, then the element is not visible
        if (t1 === "hidden" || t2 === "none") {
            return false;
        }
        //This regex is used to scan the parent nodes all the way up to the body element
        while (!(/body/i).test(el)) {
            //get the next parent node
            el = el.parentNode;
            //grab the values, if available,
            t1 = el.currentStyle ? el.currentStyle.visibility : getComputedStyle(el, null).visibility;
            t2 = el.currentStyle ? el.currentStyle.display : getComputedStyle(el, null).display;
            if (t1 === "hidden" || t2 === "none") {
                return false;
            }
        }
        //if all scans are not successful, then the element is visible
        return true;
    }
    function random(min,max){
        return min + (max - min) * Math.random();
    }
    function clickOnCssLink(pCSSPathStr) {
        var elemFound = document.querySelector(pCSSPathStr);
        if (elemFound) {
            elemFound.click();
            console.log("clicked on "+ pCSSPathStr);
        } else {
            console.log('Element NOT FOUND for XPath:\n' + pCSSPathStr);
        }
    };


    setTimeout(function() {
        if (isVisible(timerCSS)) {
            clickOnCssLink(timerCSS);
            observer.observe(document.querySelector(continueCSS), {
                childList: true, // observe direct children
                subtree: true, // and lower descendants too
                attributes: true,
                characterDataOldValue: true // pass old data to callback
            });
        }
    }, random(1000,2000));

})();