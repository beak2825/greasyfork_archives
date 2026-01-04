// ==UserScript==
// @name SankakuHairyBalls
// @description Removes censorship from the balls of Gundam figmas.
// @version 2
// @namespace Violentmonkey Scripts
// @match *://www.sankakucomplex.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/389646/SankakuHairyBalls.user.js
// @updateURL https://update.greasyfork.org/scripts/389646/SankakuHairyBalls.meta.js
// ==/UserScript==

var CENSOR_CLASS = "censored";
var CENSOR_URL = "?then=";

function runScript()
{
    // Removes the censor class from the images
    var x = document.getElementsByClassName(CENSOR_CLASS);
    for (var i = x.length-1; i >= 0; i--) {
        x[i].classList.remove(CENSOR_CLASS);
    }

    // Removes the disclaimer page from the links
    // example: https://www.sankakucomplex.com/mature-content-disclaimer/?then=
    var xx = document.getElementsByTagName("A");
    for (var i = 0; i < xx.length; i++) {    
        var href = xx[i].href;
        var j = href.indexOf(CENSOR_URL);
        if (j >= 0) {
            var link = href.substring(j + CENSOR_URL.length);
            link = decodeURIComponent(link); 
            //console.log(link);
            xx[i].href = link;

            // Click 'Yes' if we're in the disclaimer page
            var html = xx[i].innerHTML;
            if (html == "Yes, show me everything") {
                window.location.href = link;
                // alt
                //var evt = document.createEvent("HTMLEvents");
                //evt.initEvent("click", true, true);
                //xx[i].dispatchEvent(evt);
            }
        }
    }
}

document.addEventListener('DOMNodeInserted', runScript, false);
