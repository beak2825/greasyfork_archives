// ==UserScript==
// @name         Steam Skip Age Verification
// @namespace    Lander_Steam_Skip
// @version      0.11
// @description  Skip Age Verification on Steam.
// @author       Luiz Menezes
// @match        https://steamcommunity.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @downloadURL https://update.greasyfork.org/scripts/428151/Steam%20Skip%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/428151/Steam%20Skip%20Age%20Verification.meta.js
// ==/UserScript==

console.log("Steam Skip Age Verification - Loaded !");

document.querySelector('#ViewAllForApp').click()
document.querySelector('#age_gate_btn_continue').click()