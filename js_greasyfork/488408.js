// ==UserScript==
// @name         Cleanddit
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Remove some annoying things
// @author       deibit
// @license      MIT
// @match        https://*.reddit.com/*
// @icon         https://reddit.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488408/Cleanddit.user.js
// @updateURL https://update.greasyfork.org/scripts/488408/Cleanddit.meta.js
// ==/UserScript==

function removeElements() {
    // Remove promoted post
    let promoted = document.body.getElementsByClassName("promotedlink");
    for (var i = 0; i < promoted.length; i++) {
        promoted[i].parentElement.removeChild(promoted[i]);
    }

    // Remove popup for Notifications
    let popups = document.querySelectorAll('[id^="popup"]');
    for ( i = 0; i < popups.length; i++) {
        popups[i].parentElement.removeChild(popups[i]);
    }


    // Banned
    let banned_words = ["Popular", "Similar", "Because"];
    for (let idx = 0; idx < banned_words.length; idx++) {
        let banned = banned_words[idx];
        let targets = document.querySelectorAll('[id="-post-rtjson-content"]');
        for (let i = 0; i < targets.length ; i++) {
            if (targets[i].childNodes[1].textContent.includes(banned)) {
                targets[i].parentElement.removeChild(targets[i]);
            }
        }
    }

    // AntiJoin
    let joins = document.getElementsByTagName("shreddit-join-button");
    for (let i = 0; i < joins.length; i++) {
        joins[i].parentElement.parentElement.parentElement.remove();
    }


    // Remove "Create Post" popup
    let createPostPopup = document.getElementsByClassName("_3q-XSJ2vokDQrvdG6mR__k");
    if (createPostPopup.length > 0) {
        createPostPopup[0].remove();
    }
}

var MutationObserver = window.MutationObserver;
var myObserver = new MutationObserver(removeElements);
var obsConfig = {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ["class"],
};

myObserver.observe(document, obsConfig);
