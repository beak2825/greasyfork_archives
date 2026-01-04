// ==UserScript==
// @name         reddit-toggle-panel
// @version      0.1
// @description  Uses a keyboard shortcut to toggle the right panel on reddit.
// @match        https://old.reddit.com/*
// @namespace    https://greasyfork.org/en/users/217495-eric-toombs
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473686/reddit-toggle-panel.user.js
// @updateURL https://update.greasyfork.org/scripts/473686/reddit-toggle-panel.meta.js
// ==/UserScript==


function hide() {
    s = document.getElementsByClassName("side")[0].hidden = true;
    document.panel_hidden = true;
}
function show() {
    s = document.getElementsByClassName("side")[0].hidden = false;
    document.panel_hidden = false;
}

hide();

document.onkeydown = async function(k) {
    if (k.altKey && k.which === "P".codePointAt(0)) {
        if (document.panel_hidden) {
            show();
        } else {
            hide();
        }
    }
}
