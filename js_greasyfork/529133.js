// ==UserScript==
// @name         slack auto reply in channel
// @description  automatically replies with everything in the channel
// @icon         https://i.imgur.com/ORAaPzD.png
// @version      1

// @author       VillainsRule
// @namespace    https://github.com/VillainsRule/Greasyfork

// @match        *://app.slack.com/client/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529133/slack%20auto%20reply%20in%20channel.user.js
// @updateURL https://update.greasyfork.org/scripts/529133/slack%20auto%20reply%20in%20channel.meta.js
// ==/UserScript==

new MutationObserver(() => {
    let checkboxes = [...document.querySelectorAll('[id^="p-thread_footer__broadcast_checkbox--"]')];
    checkboxes.forEach((box) => !box.checked && box.click());
}).observe(document.body, {
    childList: true,
    subtree: true
})