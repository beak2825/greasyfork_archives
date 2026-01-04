// ==UserScript==
// @name         Alt-Click to attack page
// @namespace    http://tampermonkey.net/
// @author       Weav3r
// @version      1.0
// @description  Alt+click user links to attack
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/515857/Alt-Click%20to%20attack%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/515857/Alt-Click%20to%20attack%20page.meta.js
// ==/UserScript==

document.addEventListener('click', e => {
    if (!e.altKey) return;
    const link = e.target.closest('a[href*="/profiles.php?XID="]');
    if (link) {
        e.preventDefault();
        location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${link.href.match(/XID=(\d+)/)[1]}`;
    }
});