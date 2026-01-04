// ==UserScript==
// @name         Easy Attack
// @namespace    http://tampermonkey.net/
// @author       Houdini
// @version      1.5
// @description  Easy attack from user links
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/537201/Easy%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/537201/Easy%20Attack.meta.js
// ==/UserScript==

document.addEventListener('click', handleClick);
document.addEventListener('auxclick', handleClick);

function handleClick(e) {
    if (!e.altKey) return;
    const link = e.target.closest('a[href*="/profiles.php?XID="]');
    if (link) {
        e.preventDefault();
        const userId = link.href.match(/XID=(\d+)/)[1];
        const attackUrl = `https://www.torn.com/page.php?sid=attack&user2ID=${userId}`;
        if (e.button === 1) {
            window.open(attackUrl, '_blank');
        } else if (e.button === 0) {
            location.href = attackUrl;
        }
    }
}