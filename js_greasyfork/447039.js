// ==UserScript==
// @name         docsrs-toggle-panel
// @version      0.1
// @description  Uses a keyboard shortcut to toggle the left panel in docs.rs.
// @match        https://*.docs.rs/*
// @match        https://doc.rust-lang.org/nightly/*
// @namespace    https://greasyfork.org/en/users/217495-eric-toombs
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447039/docsrs-toggle-panel.user.js
// @updateURL https://update.greasyfork.org/scripts/447039/docsrs-toggle-panel.meta.js
// ==/UserScript==


function hide() {
    document.getElementsByClassName("sidebar")[0].hidden = true;
    document.panel_hidden = true;
}
function show() {
    document.getElementsByClassName("sidebar")[0].hidden = false;
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
