// ==UserScript==
// @name         monkey bruh
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  cookie clicker autoclicker
// @author       You
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439133/monkey%20bruh.user.js
// @updateURL https://update.greasyfork.org/scripts/439133/monkey%20bruh.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Create <a> element and style it with the option class then put it by the big cookie
    var clickerButton = document.createElement("A");
    clickerButton.innerHTML = "Turn on clicker";
    document.getElementById("bigCookie").appendChild(clickerButton);
    clickerButton.classList.add("option");
    // declaring the bool
    var flag = false;
    var flag2 = 0
    //input variable declaration
    var speed = "";
    var goldenCookie = 0
    // runs function when the button is clicked
    clickerButton.addEventListener("click", function() {
        if (clickerButton.innerHTML === "Turn on clicker") {
            speed = prompt("Click every how many miliseconds?");
            //changes text
            clickerButton.innerHTML = "Turn off clicker";
            //turns switch on
            flag = true;
        }
        else {
            clickerButton.innerHTML = "Turn on clicker";
            //turns switch off
            flag = false;
        }
        // run another function
        clickCookie();
    });
    function clickCookie() {
        // activates every 3 miliseconds
        setInterval(function() {
            // checks if switch is on
            if (flag) {
                // gets the big ccokie by id and simulates a click on it
                document.getElementById("bigCookie").click()
            }
        }, Number(speed));
    };
})();