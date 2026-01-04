// ==UserScript==
// @name         swappity swap swap
// @description  swap status to keep those hoes off ya neck
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2.7
// @author       Jacob Gantz
// @match        https://max.niceincontact.com/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482689/swappity%20swap%20swap.user.js
// @updateURL https://update.greasyfork.org/scripts/482689/swappity%20swap%20swap.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var state = document.getElementsByClassName("state-item-template");
    let pausing = false;
    var intervalDelay = 4000;
    var pauseDelay = generateRandomInteger(4000, 5000);
    var randMin = generateRandomInteger(20, 30);
    var randHour = generateRandomInteger(0, 1);
    var randSecond = generateRandomInteger(0, 50);
    var fullTime = '' + randHour + ':' + randMin + ':' + randSecond;
    console.log(fullTime);

    let find = null;

    function generateRandomInteger(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1))
    }

    function changeStatus() {
        var timer = document.getElementsByClassName("timer")[0].innerHTML;

        if ((timer > fullTime) && (document.getElementsByClassName("current-out-state")[0].innerHTML == "Working with Customer" || document.getElementsByClassName("current-out-state")[0].innerHTML == "Working with Vendor")) {
            console.log(fullTime);
            randMin = generateRandomInteger(40, 55);
            randHour = generateRandomInteger(0, 0);
            randSecond = generateRandomInteger(0, 50);
            fullTime = '' + randHour + ':' + randMin + ':' + randSecond;
            console.log(fullTime);

            if (document.getElementsByClassName("current-out-state")[0].innerHTML == "Working with Customer") {
                console.log("switching to vendor");
                document.getElementsByClassName("state")[15].click();
            } else if (document.getElementsByClassName("current-out-state")[0].innerHTML == "Working with Vendor") {
                console.log("switching to customer");
                document.getElementsByClassName("state")[14].click();

            }
        }
    }

    function intervalFunc() {
        //console.log("current state is "+document.getElementsByClassName("current-state")[0].innerHTML);
            //console.log("current out state "+ document.getElementsByClassName("current-out-state")[0].innerHTML);
        if (document.getElementsByClassName("current-out-state")[0].innerHTML == "Refused" || (document.getElementsByClassName("current-out-state")[0].innerHTML == '' && (document.getElementsByClassName("current-state")[0].innerHTML != 'Available' ))) {
            console.log(fullTime);
            console.log("current state is "+document.getElementsByClassName("current-state")[0].innerHTML);
            console.log("current out state "+ document.getElementsByClassName("current-out-state")[0].innerHTML);
            document.getElementsByClassName("state")[generateRandomInteger(14, 15)].click();
            randMin = generateRandomInteger(30, 50);
            console.log(randMin);
            //console.log("first if statement true");
        }

        if (((document.getElementsByClassName("current-out-state")[0].innerHTML == 'Working with Customer' || document.getElementsByClassName("current-out-state")[0].innerHTML == 'Meeting' ||
              document.getElementsByClassName("current-out-state")[0].innerHTML == 'Working with Vendor' ||
              document.getElementsByClassName("current-out-state")[0].innerHTML == '') &&
             (document.getElementsByClassName("current-state")[0].innerHTML != 'Available') &&
            document.getElementsByClassName("current-state")[0].innerHTML != 'Working')) {
            changeStatus();
            clearInterval(find);
            setTimeout(function() {
                find = setInterval(intervalFunc, intervalDelay);
            }, pauseDelay - intervalDelay);

        }
    }
    find = setInterval(intervalFunc, intervalDelay);
})();