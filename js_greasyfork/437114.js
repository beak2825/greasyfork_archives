// ==UserScript==
// @name         average vulcan
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  calculate average grades in vulcan
// @author       bewu
// @license      MIT
// @match        https://uonetplus-uczen.vulcan.net.pl/*
// @icon         https://cdn-icons-png.flaticon.com/512/5084/5084428.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/437114/average%20vulcan.user.js
// @updateURL https://update.greasyfork.org/scripts/437114/average%20vulcan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.info("average vulcan by bewu");

    var subjectsDiv = $("#ext-element-110");
    var waitGrades = setInterval(function() {
        if (subjectsDiv.length != 0 && subjectsDiv[0].childElementCount != 0) {
            console.info("loaded grades!");
            clearInterval(waitGrades);

            start(subjectsDiv[0]);
        }
        else {
            subjectsDiv = $("#ext-element-110");
        }
    }, 100);
})();

function start(subjects) {
    console.info(subjects);
    for (var i = 0; i < subjects.childElementCount; i++) {
        avg(subjects.children[i], subjects.getElementsByClassName("x-label-el")[i]);
    }
}

function avg(s, sName) {
    s = s.querySelectorAll("span[aria-label]");

    if (s.length != 0) { // if there are any grades
        console.info(sName.innerText);
        var gSum = 0.0;
        var weightSum = 0;

        for (var i = 0; i < s.length; i++) {
            var tempG = s[i].innerText.replace(" (%)", "") // temp string to hold grade
            if (tempG.length > 1) { // if grade is not only + or -
                tempG = tempG.replace("+", ".5");

                if (tempG.includes("-")) { // handling grades with a -
                    tempG = tempG.replace("-", ".0");
                    if (!isNaN(tempG)) {
                        tempG = (parseInt(tempG) - 0.25).toString();
                    }
                }
            }

            if (!isNaN(tempG)) { // if the grade is numeric
                var tempW = s[i].getAttribute("aria-label").split("waga: ")[1].split(",")[0]; // temp string to hold grade's weight

                if (tempW != "0") { // if weight is not 0
                    gSum += parseInt(tempW) * parseFloat(tempG);
                    weightSum += parseInt(tempW);

                    console.info(tempG + " " + tempW);
                }
            }
        }

        var sAverage;
        if (weightSum > 0) { // to avoid dividing by 0
            sAverage = Math.round(gSum / weightSum * 100) / 100; // calculating the average

            console.info(sName.innerText + " " + sAverage);
            sName.innerHTML = sName.innerText + "<i> (" + sAverage + ")</i>";
        }
    }
}