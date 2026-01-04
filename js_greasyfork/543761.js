// ==UserScript==
// @name         Replay Logger
// @description  Logging replay hands
// @namespace    http://tampermonkey.net/
// @version      1.02
// @author       _ryan
// @match        https://www.casino.org/replaypoker/play/table/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543761/Replay%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/543761/Replay%20Logger.meta.js
// ==/UserScript==

"use strict";
window.recordSelected = false;
window.hands = [];
function l(s) {
    console.log("Logger: " + s);
}
function appendDealerMessage(message, failure = false) {
    let container = document.querySelector(".Chat__messages");
    if (!container)
        return;
    let div = document.createElement("div");
    div.className = "ChatMessage ChatMessage--dealer";
    div.innerText = message;
    div.style.fontWeight = "bold";
    div.style.color = failure ? 'red' : 'blue';
    container.appendChild(div);
}
class Hand {
    constructor() {
        this.id = 0;
        this.chips = 0;
        this.user = "";
    }
}
function appendRecordButton() {
    let container = document.querySelector(".Tabs__index");
    if (!container)
        return;
    let button = document.createElement("button");
    button.className = "Tabs__tab";
    button.innerText = "Record";
    button.addEventListener("click", () => {
        window.recordSelected = !window.recordSelected;
        button.classList.toggle("Tabs__tab--selected", window.recordSelected);
        appendDealerMessage("Recording " + (window.recordSelected ? "Enabled" : "Disabled"));
    });
    container.appendChild(button);
}
function send(hand) {
    const endpoint = "https://script.google.com/macros/s/AKfycbyekKkYT8S4z-noFjPFYyVDAdizXkuHs-7spHynJL-5gBOGDmSHHMt65fvTHr6IaOmcVA/exec";
    fetch(endpoint, {
        method: "POST",
        mode: "no-cors", // <--- Important
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: hand.id, user: hand.user, chips: hand.chips })
    }).then(() => {
        appendDealerMessage(`Saved hand ${hand.id}`);
    }).catch(err => {
        appendDealerMessage(`Failed to save hand ${hand.id}: ${err.message}`, true);
    });
}
function onReady(callback) {
    if (document.readyState !== "loading") {
        callback();
    }
    else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}
function waitForElement(selector, callback) {
    let check = setInterval(() => {
        let el = document.querySelector(selector);
        if (el) {
            clearInterval(check);
            callback(el);
        }
    }, 200);
}
onReady(() => {
    waitForElement(".Tabs__index", () => {
        appendRecordButton();
    });
});
function doThing() {
    let hands = window.hands;
    l(hands.length.toString());
    const divs = document.querySelectorAll("div.ChatMessage.ChatMessage--dealer");
    const logs = Array.from(divs)
        .filter((x) => x.innerText.includes("Dealer:"))
        .map((x) => x.innerText);
    let pending = undefined;
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (!pending) {
            // We're looking to start the hand
            // Match hand started message
            const startHandRegex = /\*\* Hand \[ (\d+) \] started \*\*/;
            if (!startHandRegex.test(log)) {
                continue;
            }
            const match = log.match(startHandRegex);
            const handId = match ? parseInt(match[1], 10) : null;
            if (handId) {
                pending = new Hand();
                pending.id = handId;
            }
        }
        else {
            // We're looking for the finish log
            const winRegex = /Dealer: (.+?) wins ([\d,]+) chips/;
            if (!winRegex.test(log)) {
                continue;
            }
            const match = log.match(winRegex);
            const user = match && match.length > 1 ? match[1].replace(/,/g, "") : null;
            const chips = match && match.length > 1
                ? parseInt(match[2].replace(/,/g, ""), 10)
                : null;
            if (chips && user) {
                pending.chips = chips;
                pending.user = user;
                if (!hands.some((x) => x.id === pending.id)) {
                    // If we've never seen this hand, push it in.
                    hands.push(pending);
                    l(`Pushed hand ${pending.id} ${pending.user} with ${pending.chips} chips`);
                    send(pending);
                }
                pending = undefined;
            }
        }
    }
}
(function () {
    "use strict";
    setInterval(() => {
        doThing();
    }, 1000);
})();