// ==UserScript==
// @name         guilded noblox
// @description  remove the roblox link requirement from guilded...why is this an overlay bro...
// @icon         https://i.imgur.com/ORAaPzD.png
// @version      1

// @author       VillainsRule
// @namespace    https://villainsrule.xyz

// @match        *://*.guilded.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528199/guilded%20noblox.user.js
// @updateURL https://update.greasyfork.org/scripts/528199/guilded%20noblox.meta.js
// ==/UserScript==

document.head.insertAdjacentHTML('beforeend', `<style>
    [class*="verlayStackProvider"]:has([class*="ClaimAccountRobloxLandingStage"]),
    span[class*="ModalWrapper"]:has([class*="ClaimAccountRobloxLandingStage"]) {
        display: none;
    }
</style>`);