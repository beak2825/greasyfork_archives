// ==UserScript==
// @name         Year Process
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       YP
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382772/Year%20Process.user.js
// @updateURL https://update.greasyfork.org/scripts/382772/Year%20Process.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var yearProcess = document.createElement("div");
    yearProcess.innerHTML = '<div id="pbar_outerdiv" style="width: 300px; height: 20px; border: 1px solid grey; z-index: 1; position: relative; border-radius: 5px; -moz-border-radius:  5px; margin-left: auto; margin-right: auto;"> ' +
        '<div id="pbar_innerdiv" style="background-color: #1E9FFF!important; z-index: 2; height: 100%; width: 0%; border-radius:  5px; -moz-border-radius:  5px;"></div>' +
        '<div id="pbar_innertext" style="z-index: 3; position: absolute; top: 0; left: 0; width: 100%; line-height: 20px; color: black; font-weight: bold; text-align: center;">0%</div> ' +
        '</div>';
    document.body.insertBefore(yearProcess, document.body.firstChild);

    var start = new Date((new Date()).getFullYear(), 0, 1);
    var maxTime = 365 * 24 * 60 * 60 * 1000;
    var timeoutVal = Math.floor(maxTime / 100);
    animateUpdate();
    var theDiv = document.getElementById('pbar_outerdiv');
    window.setTimeout(function() {
        if (theDiv) {
            theDiv.parentNode.removeChild(theDiv);
        }
    },
    5 * 1000);

    function updateProgress(percentage) {
        $('#pbar_innerdiv').css("width", percentage + "%");
        $('#pbar_innertext').text(percentage + "%");
    }

    function animateUpdate() {
        var now = new Date();
        var timeDiff = now.getTime() - start.getTime();
        var perc = ((timeDiff / maxTime) * 100).toFixed(2);
        console.log(perc);
        if (perc <= 100) {
            updateProgress(perc);
            setTimeout(animateUpdate, timeoutVal);
        } else { // It got 100%
            updateProgress(100);
        }
    }
})();