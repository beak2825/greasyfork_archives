// ==UserScript==
// @name         Apple Music Dark Reader Fix for LibreWolf
// @namespace    http://tampermonkey.net/
// @version      0.4
// @icon         https://ptpimg.me/3wphme.png
// @description  Fixes the display of Apple Music page elements in LibreWolf when Dark Reader is installed. LibreWolf interferes with Dark Reader on some web pages elements due to the Resist Fingerprinting measures that it implements. This userscript itself will not undermine Resist Fingerprinting measures because it: does not access or expose sensitive browser APIs, only modifies CSS properties and shadow DOM elements for styling purposes, and avoids interacting with device-specific or identifying information.
// @match        https://music.apple.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/513372/Apple%20Music%20Dark%20Reader%20Fix%20for%20LibreWolf.user.js
// @updateURL https://update.greasyfork.org/scripts/513372/Apple%20Music%20Dark%20Reader%20Fix%20for%20LibreWolf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply general styles with GM_addStyle
    GM_addStyle(`
      :root {
	    --systemPrimary: hsla(0,0%,100%,.92);
	    --systemPrimary-vibrant: #f5f5f7;
	    --systemPrimary-onLight: rgba(0,0,0,.88);
	    --systemPrimary-onDark: hsla(0,0%,100%,.92);
	    --systemSecondary: hsla(0,0%,100%,.64);
	    --systemSecondary-vibrant: #a1a1a6;
	    --systemSecondary-onLight: rgba(0,0,0,.56);
	    --systemSecondary-onDark: hsla(0,0%,100%,.64);
	    --systemTertiary: hsla(0,0%,100%,.4);
	    --systemTertiary-vibrant: #6e6e73;
	    --systemTertiary-onLight: rgba(0,0,0,.48);
	    --systemTertiary-onDark: hsla(0,0%,100%,.4);
	    --keyColor: #ff364c;
	    --keyColor-rgb: 255,54,76;
	    --keyColor-rollover: #ff8a9c;
	    --keyColor-rollover-rgb: 255,138,156;
	    --keyColor-pressed: #ff7183;
	    --keyColor-pressed-rgb: 255,113,131;
	    --keyColor-deepPressed: #ff8a9c;
	    --keyColor-deepPressed-rgb: 255,138,156;
	    --keyColor-disabled: rgba(255,54,76,.35);
	    --musicKeyColor: #fa586a;
	    --musicKeyColor-rollover: #ff8a9c;
	    --musicKeyColor-pressed: #ff7183;
	    --musicKeyColor-deepPressed: #ff8a9c;
	    --musicKeyColor-disabled: rgba(255,54,76,.35);
	    --keyColorBG: #d60017;
	    --selectionColor: #a60012;
        --darkreader-bg--keyColorBG: #df1b30;
      }
      amp-chrome-player::before {
        --playerGradientTop: #fff0;
        --playerGradientBottom: #fff0;
        background-color: #2d2d2de0 !important
      }
      amp-chrome-player {
        --systemSecondary: #ffffffa3;
        --skip-control-color-hover: white;
        --chromeVolumeIcon: #fff6;
        --chromeVolumeTrack: #ffffff26;
        --chromeVolumeElapsed: #fff9;
      }
      amp-lcd {
        --lcd-artworkHoverBGColor: #121212e8;
        --playerMissingArtworkBg: #121212;
        --playerLCDBGFill: #4d4d4d;
        --systemSecondary: #ffffffa3;
      }
    `);

    function applyStylesInShadowRoot() {
        const chromePlayer = document.querySelector('amp-chrome-player');
        if (!chromePlayer || !chromePlayer.shadowRoot) return;

        const playbackControls = chromePlayer.shadowRoot.querySelector('apple-music-playback-controls');
        if (!playbackControls || !playbackControls.shadowRoot) return;

        // Add style to modify shadow DOM elements
        const style = document.createElement('style');
        style.textContent = `
          :host {
            --systemSecondary: #ffffffa3 !important;
            --systemPrimary-vibrant: white !important;
          }
        `;
        playbackControls.shadowRoot.appendChild(style);
    }

    // Monitor for changes to ensure styles are always applied
    const observer = new MutationObserver(() => {
        applyStylesInShadowRoot();
    });

    // Observe the player container for dynamic changes
    const playerContainer = document.querySelector('amp-chrome-player');
    if (playerContainer) {
        observer.observe(playerContainer, { childList: true, subtree: true });
    }

    // Initial call to apply styles after a delay
    setTimeout(applyStylesInShadowRoot, 400);
})();