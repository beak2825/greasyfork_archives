// ==UserScript==
// @name         Fake self-mutual
// @namespace    https://github.com/yorunoken/fake-mutual-osu
// @version      2025-01-21
// @description  Simple userscript that will self-mutual you. (Client only)
// @author       yorunoken
// @match        https://osu.ppy.sh/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524422/Fake%20self-mutual.user.js
// @updateURL https://update.greasyfork.org/scripts/524422/Fake%20self-mutual.meta.js
// ==/UserScript==

const fireOnHashChangesToo = true;
setInterval(function () {
    if (this.lastPathStr !== location.pathname || this.lastQueryStr !== location.search || (fireOnHashChangesToo && this.lastHashStr !== location.hash)) {
        this.lastPathStr = location.pathname;
        this.lastQueryStr = location.search;
        this.lastHashStr = location.hash;
        gmMain();
    }
}, 111);

function gmMain() {
    if (!location.href.startsWith("https://osu.ppy.sh/users/")) {
        return false;
    }

    const userActionButton = document.querySelector(".user-action-button");

    if (userActionButton) {
        userActionButton.classList.add("user-action-button--mutual");
    } else {
        console.log("User action button not found, aborting.");
    }
}
