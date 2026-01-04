// ==UserScript==
// @name         No Reports
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  This userscript removes all ways to report people on Twitch. (useful for people who may need to prevent themselves from reporting people for stupid reasons)
// @author       ProKameron
// @match        https://www.twitch.tv/*
// @icon         https://cdn-icons-png.flaticon.com/512/5968/5968819.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531881/No%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/531881/No%20Reports.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeReportButtons() {
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent || "";
            const label = btn.getAttribute('aria-label') || "";
            if (text.toLowerCase().includes("report") || label.toLowerCase().includes("report")) {
                btn.remove();
            }
        });
    }

    removeReportButtons();

    const observer = new MutationObserver(() => {
        removeReportButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
