// ==UserScript==
// @name         stackoverflow-toggle-sidebar
// @version      0.1
// @description  Uses a keyboard shortcut to toggle the left sidebar in stackoverflow.
// @match        https://stackoverflow.com/*
// @namespace    https://greasyfork.org/en/users/217495-eric-toombs
// @downloadURL https://update.greasyfork.org/scripts/404838/stackoverflow-toggle-sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/404838/stackoverflow-toggle-sidebar.meta.js
// ==/UserScript==


function hide() {
    document.getElementById("left-sidebar").hidden = true;
    document.getElementById("content").style.width = "100%";
    document.panel_hidden = true;
}
function show() {
    document.getElementById("content").style.width = "";
    document.getElementById("left-sidebar").hidden = false;
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
