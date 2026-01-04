// ==UserScript==
// @name         Torn ID in profile title
// @namespace    https://github.com/sulsay/torn
// @version      1.0
// @description  Shows the player ID next to their name in the profile heading for easy copy/pasting (e.g. turns "Sulsay's profile" into "Sulsay [2173590]").
// @author       Sulsay [2173590]
// @match        https://www.torn.com/profiles.php*
// @downloadURL https://update.greasyfork.org/scripts/403125/Torn%20ID%20in%20profile%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/403125/Torn%20ID%20in%20profile%20title.meta.js
// ==/UserScript==

(function() {
    let originalHeadingTextContent = '';

    const heading = Array.from(document.querySelectorAll('h4')).find(h4 => {
        originalHeadingTextContent = h4.textContent.trim();
        return originalHeadingTextContent.endsWith(' Profile')
    });
    if (heading === undefined) {
        // Profile heading not found or already altered
        return;
    }

    const playerIdMatches = window.location.search.match(/XID=(\d+)/);
    if (playerIdMatches === null) {
        // Viewing profile without the XID query param
        return;
    }

    const apostrophePosition = originalHeadingTextContent.indexOf("'");
    const playerName = originalHeadingTextContent.substr(0, apostrophePosition);
    const playerId = parseInt(playerIdMatches[1], 10);

    heading.textContent = `${playerName} [${playerId}]`;
})();