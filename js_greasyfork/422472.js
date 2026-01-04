// ==UserScript==
// @name         Meet Room Checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sure this works!
// @author       You
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422472/Meet%20Room%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/422472/Meet%20Room%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var classcodes = ["your_classcode"] // your class code
    var resttime = 2000; // time in between inputs
    var classresttime = 1000; // extra time to save your computer
    //
    //
    //Edit the Variables above
    //
    var oneNotification = false;
    function tryCall(number) {
        try {
            document.getElementById("i3").value = classcodes[number];
            document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d cjtUbb")[0].disabled = false
            document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d cjtUbb")[0].click()
        } catch {

            if (oneNotification === false) {
                showNotification();
                oneNotification = true;
            }
        }
    }
    function mainaction() {
        setTimeout(tryCall(0), classresttime)
    }
    function showNotification() {
        const notification = new Notification("Meet Room Has Opened", {
            body: "Your class code " + classcodes[0] + " has just opened"
        });
    }
    if (Notification.permission === "granted") {
    } else if(Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            console.log("Your notifications are " + permission);
        });
    }
    setInterval(mainaction, resttime);


})();