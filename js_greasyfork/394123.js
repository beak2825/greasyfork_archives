// ==UserScript==
// @name         Dueling Nexus Notification System
// @namespace    https://duelingnexus.com/
// @version      0.2
// @description  Gives desktop notifications for joining matches.
// @author       Sock#3222
// @grant        none
// @include      https://duelingnexus.com/
// @include      https://duelingnexus.com/decks
// @include      https://duelingnexus.com/home
// @include      https://duelingnexus.com/duel
// @include      https://duelingnexus.com/profile
// @include      https://duelingnexus.com/hostgame
// @include      https://duelingnexus.com/gamelist
// @include      https://duelingnexus.com/donate
// @include      https://duelingnexus.com/leaderboard
// @include      https://duelingnexus.com/login
// @include      https://duelingnexus.com/game/*
// @downloadURL https://update.greasyfork.org/scripts/394123/Dueling%20Nexus%20Notification%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/394123/Dueling%20Nexus%20Notification%20System.meta.js
// ==/UserScript==

let waitFrame = function () {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
};

const waitForElement = async function (selector, source = document.body) {
    let query;
    while ((query = source.querySelector(selector)) === null) {
        await waitFrame();
    }
    return query;
};

const waitForNoElement = async function (selector, source = document.body) {
    while (source.querySelector(selector) !== null) {
        await waitFrame();
    }
    return;
};

let formatTime = function(time) {
    let result = "";
    result += [time.getMonth() + 1, time.getDate(), time.getFullYear()].join("/");
    result += " ";
    result += [time.getHours(), time.getMinutes(), time.getSeconds()].map(e => e.toString().padStart(2, "0")).join(":");
    return result;
};

const loadNotifications = function () {
    /* duel ready notifications */
    launchDuelReadyNotifications();
    
    
    /* lobby notifications */
    // NOTE: Might break.
    window.zd = function zd(a) {
        B[a.position] = {
            name: a.name,
            na: Number(a.avatar),
            ba: a.customAvatarPath,
            oa: a.customSleevePath,
            ready: false
        };
        $("#game-room-player" + (a.position + 1) + "-username").text(a.name);
        if(a.name !== Ib) {
            let message = "Player \"" + a.name + "\" has joined the lobby.";
            let notif = new Notification(message);
            setTimeout(notif.close.bind(notif), 4000);
        }
        Ke();
    };
};

const launchDuelReadyNotifications = function () {
    // might break easily
    const duelAreaReadyElement = "#duel-area button.bigger-button";
    
    waitForElement(duelAreaReadyElement).then(function (button) {
        console.info("Match found! " + formatTime(new Date()));
        let notif = new Notification("Your match is ready!");
        let closeNotif = notif.close.bind(notif);
        button.addEventListener("click", closeNotif);
        // may be necessary to remove that listener
        waitForNoElement(duelAreaReadyElement).then(function () {
            closeNotif();
            launchDuelReadyNotifications();
        });
    });
    
};

console.info = console.info || console.log;

(function () {
    if(!("Notification" in window)) {
        // browser does not support notifications
        console.info("Notifications could not be enabled, please update your browser or try a different one.");
        return;
    }
    
    let success = false;
    Notification.requestPermission().then(function (permission) {
        if(permission === "granted") {
            loadNotifications();
            success = true;
        }
    }).finally(function () {
        console.info(`Nexus notifications ${success ? "started" : "denied"} succesfully.`);
    });
})();