// ==UserScript==
// @name        Countdown with days - yeezy.com
// @namespace   Violentmonkey Scripts
// @match       https://www.yeezy.com/
// @grant       none
// @version     1.0.2
// @author      bhvsh
// @description 12/12/2023, 10:13:11 PM
// @license MIT

// Update:
// The countdown timer userscript has been commented out and is no longer active for use on yeezy.com.
// You don't need to install or activate the userscript anymore. The script is retained below for reference

// @downloadURL https://update.greasyfork.org/scripts/482043/Countdown%20with%20days%20-%20yeezycom.user.js
// @updateURL https://update.greasyfork.org/scripts/482043/Countdown%20with%20days%20-%20yeezycom.meta.js
// ==/UserScript==
// function countdown() {
//     var now = new Date();
//     var eventDate = new Date(2023, 11, 15);

//     var currentTime = now.getTime();
//     var eventTime = eventDate.getTime();
//     var remainingTime = eventTime - currentTime;

//     var seconds = Math.floor(remainingTime / 1000);
//     var minutes = Math.floor(seconds / 60);
//     var hours = Math.floor(minutes / 60);
//     var days = Math.floor(hours / 24);

//     hours %= 24;
//     minutes %= 60;
//     seconds %= 60;

//     hours = (hours < 10) ? "0" + hours : hours;
//     minutes = (minutes < 10) ? "0" + minutes : minutes;
//     seconds = (seconds < 10) ? "0" + seconds : seconds;

//     document.getElementById("countdown").innerHTML = days + "d " +hours + " " + minutes + " " + seconds;

//     setTimeout(countdown, 1000);
// }
// countdown();