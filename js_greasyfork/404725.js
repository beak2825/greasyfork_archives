// ==UserScript==
// @name         wiki-toggle-panel
// @version      0.3
// @description  Uses a keyboard shortcut to toggle the left panel in wikis.
// @match        https://*.wikipedia.org/*
// @match        https://wiki.archlinux.org/*
// @match        https://wiki.postmarketos.org/*
// @match        https://wiki.alpinelinux.org/*
// @match        https://wiki.pine64.org/*
// @namespace    https://greasyfork.org/en/users/217495-eric-toombs
// @downloadURL https://update.greasyfork.org/scripts/404725/wiki-toggle-panel.user.js
// @updateURL https://update.greasyfork.org/scripts/404725/wiki-toggle-panel.meta.js
// ==/UserScript==


function hide() {
    document.getElementById("mw-panel").hidden = true;
    document.getElementById("content").style.marginLeft = "0em";
    document.panel_hidden = true;
}
function show() {
    document.getElementById("content").style.marginLeft = "10em";
    document.getElementById("mw-panel").hidden = false;
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
