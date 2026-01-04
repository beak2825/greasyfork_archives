// ==UserScript==
// @name         Double-click Instant Leave - Bonk.io
// @version      1.0.1
// @description  Leaves the lobby instantly when you double click the Leave button, bypassing the Confirm Window.
// @author       Miquella
// @namespace    https://greasyfork.org/en/users/1502869
// @license      GPL-3.0
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545055/Double-click%20Instant%20Leave%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/545055/Double-click%20Instant%20Leave%20-%20Bonkio.meta.js
// ==/UserScript==


(function () {
  // checks if the player is either in the lobby or in an active match
  const isPlayerInLobbyOrGame = () => {
    const lobbyElement = document.querySelector("#newbonklobby");
    const gameCanvas = document.querySelector("#gamerenderer canvas");
    const lobbyVisible = lobbyElement && getComputedStyle(lobbyElement).display !== "none";
    const gameVisible = gameCanvas &&
      getComputedStyle(gameCanvas).visibility !== "hidden" &&
      getComputedStyle(gameCanvas).opacity !== "0";
    return lobbyVisible || gameVisible;
  };
  // watches the dom for the leave button
  new MutationObserver(() => {
    const leaveBtn = document.querySelector("#pretty_top_exit");
    if (!leaveBtn || leaveBtn.dataset.instLeaveHooked) return;
    leaveBtn.dataset.instLeaveHooked = "true";
    // listens for double-click on the leave button
    leaveBtn.addEventListener("dblclick", e => {
      if (!isPlayerInLobbyOrGame()) return;
      e.preventDefault();
      e.stopPropagation();
      leaveBtn.click();
        const confirmBtn = document.querySelector("#leaveconfirmwindow_okbutton");
        if (confirmBtn) confirmBtn.click(); // instantly confirms leave
    });
  }).observe(document, { childList: true, subtree: true });
})();