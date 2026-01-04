// ==UserScript==
// @name         RallyDev Improvements
// @namespace    rally
// @version      0.2
// @description  Make RallyDev easier to use
// @author       Brendan Crosser-McGay
// @match        https://rally1.rallydev.com/
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/38274/RallyDev%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/38274/RallyDev%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var eventFire = function(el, etype){
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    };
    console.log("RallyDev Improvements - Loaded");
    var makeChange = function()  {
        var theFrame = document.getElementById("ttFrame");
        if (theFrame != null) {
            var firstDiv = theFrame.contentDocument.getElementById("ext-gen43"); // header
            if (firstDiv != null) {
                firstDiv.style.position = "fixed";
                firstDiv.style.top = "30px";
                firstDiv.style.zIndex = "8000";
                console.log("RI - First change success.");
            }
            var secondDiv = theFrame.contentDocument.getElementById("ext-gen24"); // add task buttons
            if (secondDiv != null) {
                secondDiv.style.position = "fixed";
                secondDiv.style.top = "1px";
                secondDiv.style.zIndex = "9000";
                console.log("RI - Second change success.");
            }
            var thirdDiv = theFrame.contentDocument.getElementById("ext-comp-1021"); // page tools
            if (thirdDiv != null) {
                thirdDiv.style.position = "fixed";
                thirdDiv.style.top = "1px";
                thirdDiv.style.right = "250px";
                thirdDiv.style.zIndex = "9999";
                console.log("RI - Third change success.");
            }
            var fourthDiv = theFrame.contentDocument.getElementById("ext-gen25"); // added padding to list to prevent first element being hidden
            if (fourthDiv != null) {
                fourthDiv.style.paddingTop = "60px";
                window.clearInterval(intervalId);
                console.log("RI - Fourth change success, done.");
            }
            var fifthDiv = theFrame.contentDocument.getElementById("ext-gen62"); // adding background
            if (fifthDiv != null) {
                fifthDiv.style.background = "#FFFFFF";
                console.log("RI - Fifth change success.");
            }
        }
    };
    var intervalId = window.setInterval(makeChange,2000);
})();