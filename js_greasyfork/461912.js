// ==UserScript==
// @name        Steam Replay Showcase Preview Begone
// @match       https://steamcommunity.com/id/*
// @match       https://steamcommunity.com/profiles/*
// @grant       none
// @version     1.0
// @author      kubikill
// @license     MIT
// @description 3/15/2023, 8:58:59 PM
// @namespace https://greasyfork.org/users/1042734
// @downloadURL https://update.greasyfork.org/scripts/461912/Steam%20Replay%20Showcase%20Preview%20Begone.user.js
// @updateURL https://update.greasyfork.org/scripts/461912/Steam%20Replay%20Showcase%20Preview%20Begone.meta.js
// ==/UserScript==

const replayShowcaseContainer = document.querySelector('.replay_showcase');

if (replayShowcaseContainer) {
  const replayShowcase = replayShowcaseContainer.querySelector('.replay_showcase_block.preview');

  if (replayShowcase) {
    replayShowcaseContainer.remove();
    let expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 1000 * 60 * 60 * 24 * 365);
    document.cookie = `bHideReplayShowcasePreview=1; expires=${expiryDate.toGMTString()};path=/`;
  }
}