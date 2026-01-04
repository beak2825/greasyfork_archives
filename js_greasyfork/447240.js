// ==UserScript==
// @name         Shorts URL to normal video URL
// @version      0.1
// @description  Redirect from a Shorts URL to it's normal video URL
// @author       Squeef
// @match       *://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT; https://drive.google.com/file/d/1dS3JpIioYd4y8ddeYQLwJ5q0li4VIX0z/view?usp=sharing
// @namespace https://greasyfork.org/users/930493
// @downloadURL https://update.greasyfork.org/scripts/447240/Shorts%20URL%20to%20normal%20video%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/447240/Shorts%20URL%20to%20normal%20video%20URL.meta.js
// ==/UserScript==

// I don't know anything about Javascript until now plus I haven't tried to code anything in six years so this whole thing is probably ugly.
// Ugly way to check whether or not we're on a new page, message me on discord if there's a much better way.
var pageCheckTimer = setInterval(function() {
    var urlAsString = String(window.location.href);
    // I wouldn't use two strings here but javascript refuses to let me redefine any. I imagine there's a cleaner way of doing it so message me on discord if so.
    var checkIfShorts = urlAsString.split("/")[3];
    if (checkIfShorts == "shorts") {
        var grabVideoID = urlAsString.split("/")[4];
        var replacementurl = String("https://www.youtube.com/watch?v="+grabVideoID);
        window.location.replace(replacementurl);
    }
},1200);