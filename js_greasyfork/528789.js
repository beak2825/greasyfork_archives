// ==UserScript==
// @name         Pi.ai Hide auto sidebar
// @namespace    https://github.com/legovader09
// @version      1.1
// @description  Hide the sidebar on initial load to prevent it from showing up each time you send a message
// @author       Doomnik
// @match        https://pi.ai/discover
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pi.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528789/Piai%20Hide%20auto%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/528789/Piai%20Hide%20auto%20sidebar.meta.js
// ==/UserScript==

(function() {
    const interval = setInterval(() => {
        const sidebar = document.getElementsByClassName('lg:border-r')[0];
        if (!sidebar) return;
        sidebar.classList.toggle('hidden', true);
        clearInterval(interval)
    }, 1000);
})();