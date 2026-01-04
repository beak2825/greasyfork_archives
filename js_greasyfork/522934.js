// ==UserScript==
// @name         BTN Swap release info
// @namespace    http://tampermonkey.net/
// @version      2025-01-05
// @description  Swap release info and release title
// @author       Sapphire_e
// @match        https://broadcasthe.net/torrents.php?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522934/BTN%20Swap%20release%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/522934/BTN%20Swap%20release%20info.meta.js
// ==/UserScript==

const displayInfosForBoth = true;

(() => {
    const torrentGroups = document.querySelectorAll(".torrent_table .group_torrent");
    torrentGroups.forEach((torrentGroup) => {
        const releaseInfoEl = torrentGroup.querySelector("a[href='#']");
        const releaseTitleEl = torrentGroup.nextElementSibling.firstElementChild;
        const releaseInfo = /(.*?)<br>/.test(releaseInfoEl.innerHTML) ? releaseInfoEl.innerHTML.match(/(.*?)<br>/)[1] : releaseInfoEl.innerHTML.trim();
        const releaseTitle = releaseTitleEl.textContent.trim();
        releaseInfoEl.textContent = releaseTitle;
        releaseTitleEl.textContent = releaseInfo;
        if (displayInfosForBoth) {
            const swapDisplay = releaseInfoEl.getAttribute("onclick");
            releaseTitleEl.setAttribute("onclick", swapDisplay);
        }
    });
})();