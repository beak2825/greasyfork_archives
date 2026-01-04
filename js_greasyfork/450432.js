// ==UserScript==
// @name  Increase SB Server Size
// @description Increases the the size of Sandbox servers
// @author TheThreeBowlingBulbs
// @match  *://arras.io/*
// @version 1.0.0
// @namespace https://greasyfork.org/users/812261
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/450432/Increase%20SB%20Server%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/450432/Increase%20SB%20Server%20Size.meta.js
// ==/UserScript==

localStorage.command = true;

function pressEnter() {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "enter",
            keyCode: 13, 
            code: "KeyEnter", 
            which: 13,
            shiftKey: false, 
            ctrlKey: false, 
            metaKey: false 
        })
    );
};
let interval = setInterval(() => {
    if (localStorage.command === 'false') {
        pressEnter();
        console.log('Synced connection');
        clearInterval(interval);
    }
}, 100);