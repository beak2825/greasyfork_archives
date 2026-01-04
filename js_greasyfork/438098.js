
// ==UserScript==
// @name         MeetGif
// @version      0.0.3
// @description  Animated GIF Profile Picture in Google Meet
// @author       Adrish Aditya <adrishaditya@gmail.com>
// @source       https://github.com/eElec/MeetGif
// @icon         https://raw.githubusercontent.com/eElec/MeetGif/master/icons/icon48.png
// @match        https://meet.google.com/*
// @namespace https://greasyfork.org/users/861507
// @downloadURL https://update.greasyfork.org/scripts/438098/MeetGif.user.js
// @updateURL https://update.greasyfork.org/scripts/438098/MeetGif.meta.js
// ==/UserScript==

let observerConfig = {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["class"],
    subtree: true,
};

var userData = {};
var intervalTimer = null;

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // console.log("MUTATION::", mutation.target);
        if (mutation.target.childElementCount > 0) return;
        var pElem = mutation.target.closest("div[meet-gif-id]");
        if (pElem === null) return;

        var participantName = pElem.getAttribute("meet-gif-id");
        var user = userData[participantName];

        user.lastTalk = new Date();
        startedTalking(user, pElem);
    });
});

// Toggle Gif
function startedTalking(user, pElem) {
    if (user.talking === true) return;
    user.talking = true;

    var imgNode = pElem.querySelector(`img[src="${user.image}"]`);
    if (imgNode === null) return;
    imgNode.src = imgNode.src.replace("-p-k-no-mo", "-p");
    user.image = imgNode.src;
}

function stoppedTalking(user, pElem) {
    if (user.talking === false) return;
    user.talking = false;

    var imgNode = pElem.querySelector(`img[src="${user.image}"]`);
    if (imgNode === null) return;
    imgNode.src = imgNode.src.replace(/\-p$/, "-p-k-no-mo");
    user.image = imgNode.src;
}

// Populate userImages
function startObserving(nodes) {
    nodes.forEach((e) => {
        var pElem = e.parentElement.parentElement.parentElement.parentElement.querySelector(
            "div[data-self-name]"
        );
        if (pElem === null) {
            pElem=e.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector(
                "div[data-self-name]"
            )};
        if (pElem === null) return;

        var participantName = pElem.innerText;
        var user = userData[participantName];
        if (!user) {
            user = { talking: false };
            userData[participantName] = user;
        }
        user.image = e.src;

        pElem = e.closest("div[data-participant-id]");
        if (pElem === null) return;

        // If user last talked more than a sec ago, mark talking false
        if (user.lastTalk) {
            var now = new Date();
            var lastTime = now - user.lastTalk;
            if (lastTime > 500) {
                stoppedTalking(user, pElem);
            }
        }

        if (pElem.hasAttribute("meet-gif-id")) return;

        pElem.setAttribute("meet-gif-id", participantName);
        observer.observe(pElem, observerConfig);
    });
}

// Attach when connected to the meeting
function attach() {
    var images = document.querySelectorAll('img[src*="googleusercontent.com"]');
    const btn_more = document.querySelector('button[aria-label="More options"]');

    if(btn_more){
        btn_more.onclick = (e)=>{
            stopFun();
            startFun();
        }
    }

    if (images.length >= 1) {
        startObserving(images);
    } else {
        observer.disconnect();
    }
}

// Extension Options
function stopFun() {
    if (intervalTimer === null) return;

    clearInterval(intervalTimer);
    intervalTimer = null;
    observer.disconnect();

    // Stop all animations and clear all data
    var pElems = document.querySelectorAll("div[meet-gif-id]");
    if (pElems !== null) {
        pElems.forEach((e) => {
            var participantName = e.getAttribute("meet-gif-id");
            var user = userData[participantName];

            stoppedTalking(user, e);

            e.removeAttribute("meet-gif-id");
        });
    }
    userData = {};
}

function startFun() {
    if(intervalTimer !== null){
        clearInterval(intervalTimer);
    }
    intervalTimer = setInterval(attach, 1000);
}

function refresh() {
    stopFun();
    startFun();
}

startFun();

window.__meetGif_start__ = startFun;
window.__meetGif_stop__ = stopFun;
window.__meetGif_refresh__ = refresh;
window.__meetGif_userData__ = userData;