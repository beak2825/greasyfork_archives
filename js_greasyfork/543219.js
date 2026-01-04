// ==UserScript==
// @name         AF Clock
// @namespace    artfight
// @version      2025-06-23
// @description  adds a PST clock to art fight's navbar
// @author       three
// @match        *://artfight.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artfight.net
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/543219/AF%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/543219/AF%20Clock.meta.js
// ==/UserScript==

var clock = document.createElement('li');
clock.id = 'clock';
clock.className = "nav-link";
let navbar = document.querySelectorAll("ul.ml-auto")[0];
navbar.insertBefore(clock, navbar.firstChild);

function updateClock(){
    //get date in PST
        var currentTime = new Date(new Date().toLocaleString("en-US", {timeZone: "US/Pacific"}));
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
    //format time with leading 0s
        minutes = minutes < 10 ? '0' + minutes : minutes;
        hours = hours < 10 ? '0' + hours : hours;

    // Update clock
    //console.log("update");
        clock.textContent = hours + ':' + minutes + " PST";
}

// Update clock every second
    setInterval(updateClock, 1000);
