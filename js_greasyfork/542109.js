// ==UserScript==
// @name        hxty.live - remove player footer and chat panel
// @namespace   Violentmonkey Scripts
// @match       *://*.hxty.live/live/*
// @match       *://*.360pai.xyz/live/*
// @match       *://*.idevkit.com/live/*
// @grant       none
// @version     0.0.1
// @author      Bin
// @description Remove player footer and chat panel
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/542109/hxtylive%20-%20remove%20player%20footer%20and%20chat%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/542109/hxtylive%20-%20remove%20player%20footer%20and%20chat%20panel.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

window.addEventListener("load", () => {
  document.querySelector('[class^="player-footer_live-player-footer"]').remove();
  document.querySelector('[class^="anchor-detail-page_chat-panel"]').remove();

  const playerContainer = document.querySelector('[class^="anchor-detail-page_anchor-live-container"]');

  var observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const target = mutation.target;
      if (mutation.type === "attributes" && /anchor-detail-page_theater-mode/.test(target.className)) {
        target.style.bottom = 0
      }
    });
  });

  observer.observe(playerContainer, {
    attributes: true //configure it to listen to attribute changes
  });
});
