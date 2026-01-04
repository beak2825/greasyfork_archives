// ==UserScript==
// @name          Choose a Word
// @namespace     https://greasyfork.org/users/281093
// @match         https://sketchful.io/*
// @grant         none
// @version       1.0.2
// @author        Bell
// @description   Notifies you whenever it's your turn to draw. Notifications must be allowed.
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/406122/Choose%20a%20Word.user.js
// @updateURL https://update.greasyfork.org/scripts/406122/Choose%20a%20Word.meta.js
// ==/UserScript==

(function requestPermission() {
    if (Notification.permission === "granted") {
        console.log("Notifications allowed, Choose a Word loaded");
    } else {
        Notification.requestPermission()
            .then(result => {
                console.log(result);
            });
    }
})();

window.onfocus = () => {
    sessionStorage.setItem('tabFocus', '1');
};

window.onblur = () => {
    sessionStorage.setItem('tabFocus', '0');
};

const checkSticky = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.addedNodes[0].innerHTML && mutation.addedNodes[0].innerHTML.includes("Choose")) {
            let focus = parseInt(sessionStorage.getItem('tabFocus'));
            console.log("CHOOSE A WORD NOTIFICATION", focus);
            if (!focus) {
                notify();
            }
        }
    }
};

const playerList = document.querySelector("#gameSticky");
const observer = new MutationObserver(checkSticky);
const config = {
    attributes: false,
    childList: true,
    subtree: true
};

observer.observe(playerList, config);

function notify() {
    if (Notification.permission === "granted") {
        let notification = new Notification("Your Turn", {
            icon: "https://sketchful.io/res/logo/pencils%20optimized.png",
            body: "Click the notification to return to the game.",
            requireInteraction: true,
        });

        notification.onclick = function() {
            window.focus();
            notification.close();
        };
    } else {
        console.log("Notifications are blocked.");
    }
}