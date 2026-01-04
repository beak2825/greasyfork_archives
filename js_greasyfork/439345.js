// ==UserScript==
// @name         Pixiv Direct External Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When clicking links in the description redirect directly to the url.
// @author       MatteCrystal
// @match        *://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439345/Pixiv%20Direct%20External%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/439345/Pixiv%20Direct%20External%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectLink(){
        console.log("Pixiv Direct External Link Script Started");
        console.log("figcaption length: " + document.querySelector("figcaption").innerHTML.length);

        let linksLength = document.querySelectorAll('figcaption a[href^="/jump"]').length;

        console.log("Length: " + document.querySelectorAll('figcaption a[href^="/jump"]').length);
        for(let i = 0; i < linksLength; i++){
            console.log("i:" + i);
            console.log("href = " + document.querySelectorAll('figcaption a[href^="/jump"]')[0].href);
            document.querySelectorAll('figcaption a[href^="/jump"]')[0].href = document.querySelectorAll('figcaption a[href^="/jump"]')[0].text;
        }
    }
    
    waitForElementToDisplay("figcaption",function(){
        redirectLink();
    },1000,9000);

    function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
        var startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selector) != null && document.querySelector(selector).innerHTML.length != undefined ) {
                console.log("html length: " + document.querySelector(selector).innerHTML.length);
                callback();
                return;
            }
            else {
                setTimeout(function () {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                        return;
                    loopSearch();
                }, checkFrequencyInMs);
            }
        })();
    }
})();