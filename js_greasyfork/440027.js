// ==UserScript==
// @name        Disable Prime Video (JP) Pre-Roll Ads
// @namespace   https://rinsuki.net/
// @match       https://www.amazon.co.jp/*
// @grant       none
// @version     1.0
// @author      rinsuki
// @description Prime Video (JP) のプレロール広告(番宣)をたぶん無効にします。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/440027/Disable%20Prime%20Video%20%28JP%29%20Pre-Roll%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/440027/Disable%20Prime%20Video%20%28JP%29%20Pre-Roll%20Ads.meta.js
// ==/UserScript==

const openOrig = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function (...args) {
  if (args[1].includes("GetPlaybackResources")) {
    args[1] = args[1].replace("%2CCuepointPlaylist", "")
  }
  return openOrig.apply(this, args)
}