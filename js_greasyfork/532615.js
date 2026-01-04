// ==UserScript==
// @name         Vols and Jezuzifier for GeoGuessr
// @namespace    volsandjezuz
// @version      1.0.6
// @description  Become just like user Vols and Jezuz by using their tweaks and style preferences
// @author       Vols and Jezuz
// @license      MIT
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532615/Vols%20and%20Jezuzifier%20for%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/532615/Vols%20and%20Jezuzifier%20for%20GeoGuessr.meta.js
// ==/UserScript==

/* ------------------------------------ NOTES ------------------------------------
   Each tweak or style change is individually commented below.
   Ones that do not suit your taste can be independently removed or commented out.

   Credit to Alien Perfect for many of the CSS alterations.
   I highly recommend also using their 'Faster Minimap (Geoguessr)' userscript.
   However, their 'Better GUI (Geoguessr)' userscript will cause conflicts.
   The CSS alterations of the userscript which runs last will be enforced.
   The order of userscript execution can be changed in your userscript manager.
   ------------------------------------------------------------------------------- */

(function() {
  `use strict`;

  GM_addStyle(`
    /* Remove map opening and closing animations for snappier response. */
    [data-qa="guess-map"] {transition:opacity 0s ease,width 0s ease,height 0s ease !important}

    /* Make biggest map size a bit wider so that entire map is initially visible without panning. */
    [class*="guess-map_size4__"] {--active-width:80vw !important}

    /* Change second biggest map size to default size of biggest map (useful when the wider map blocks signs you want to keep visible while scanning). */
    [class*="guess-map_size3__"] {--active-width:65vw !important}

    /* Remove transparent red border that appears when an opponent guesses, which can alter perception of colors near the border. */
    [class*="stress-indicator_container__"] {display:none !important}

    /* Make new compass more transparent and slightly alter its color to match other GUI elements. */
    [class*="compassContainer"] {background-color:var(--ds-color-black-60) !important}

    /* Hide zoom controls since all scrolling is done with the mouse's scroll wheel. */
    [class*="styles_controlGroup__"] {display:none !important}
    [class*="guess-map_zoomControls__"] {display:none !important}

    /* On mouseover, make map pins transparent after a small wait so that map text hidden behind them can be read. */
    [class*="map-pin_mapPin"]:hover {opacity:.15; transition-delay:.4s}
    [class*="map-pin_clickable"]:hover {transition:0s ease; transition-delay:.4s}

    /* Add transparency to the GeoGuessr logo that is rendered in the upper left corner in Singleplayer rounds, to match other GUI elements. */
    [class*="game_inGameLogos__"] {opacity:.5 !important}

    /* Add transparency to the map status bar that is rendered in the upper right corner in Singleplayer rounds, to match other GUI elements. */
    [class*="slanted-wrapper_start__"] {opacity:.5 !important}
    [class*="slanted-wrapper_end__"] {opacity:.5 !important}

    /* Add transparency to the live player count that is rendered in the upper right corner in Singleplayer rounds, to match other GUI elements. */
    [class*="live-players-count_container__"] {opacity:.5 !important}

    /* Skip the 'Loading location...' animation that briefly plays at the start of each round in Singleplayer. */
    [class*="fullscreen-spinner"] {display:none !important}
  `);

  /* Redirect the Duels 'PLAY' button to the old UI (geoguessr.com/matchmaking), which has much better performance. */
  function redirectPlayButton() {
    if (location.pathname !== `/multiplayer`) {
      return;
    }

    let b = document.getElementsByClassName(`button_button__aR6_e button_variantPrimary__u3WzI`)[0];

    if (b && !b.dataset.clickListenerAdded) {
      b.addEventListener(`click`, function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.href = `https://www.geoguessr.com/matchmaking`;
      }, true);

      b.dataset.clickListenerAdded = true;
    }
  }

  function startMutationObserver() {
    new MutationObserver(() => {
      redirectPlayButton();
    }).observe(document.body, { childList: true, subtree: true });

    redirectPlayButton();
  }

  if (document.body) {
    startMutationObserver();
  } else {
    document.addEventListener(`DOMContentLoaded`, () => {
      if (document.body) {
        startMutationObserver();
      }
    }, { once: true });
  }
})();
