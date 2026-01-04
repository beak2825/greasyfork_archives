// ==UserScript==
// @name         Aternos Auto-Skip Anti-Adblock
// @namespace    m00ny's Scripts
// @version      1.0.0
// @description  Automates skipping anti-adblock warning on aternos.
// @author       m00ny
// @match        https://aternos.org/*
// @icon         https://aternos.org/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @supportURL   https://github.com/i-Moony/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/485432/Aternos%20Auto-Skip%20Anti-Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/485432/Aternos%20Auto-Skip%20Anti-Adblock.meta.js
// ==/UserScript==

// Features:
// - Clicks "Continue with adblocker anyway" for you...

function skip() {
    try {
        const elements = document.querySelectorAll(".btn.btn-white");

        for (const element of elements)
            if (element.textContent.toLowerCase().includes("continue with adblocker anyway"))
                element.click()
    } catch (e) {
        console.error(`[Aternos Auto-Skip] There was an error: `, e);
    }
}

skip()