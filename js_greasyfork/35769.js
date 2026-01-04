// ==UserScript==
// @name         Auto Disable YouTube AutoPlay Next Video Setting
// @namespace    AutoDisableYouTubeAutoPlayNextVideoSetting
// @version      1.0.6
// @license      GNU AGPLv3
// @author       jcunews
// @description  Auto disable YouTube's AutoPlay Next Video setting at top sidebar of video page
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35769/Auto%20Disable%20YouTube%20AutoPlay%20Next%20Video%20Setting.user.js
// @updateURL https://update.greasyfork.org/scripts/35769/Auto%20Disable%20YouTube%20AutoPlay%20Next%20Video%20Setting.meta.js
// ==/UserScript==

setInterval(eleCheck => {
  if (
    (
      (eleCheck = document.querySelector(
      '#autoplay-checkbox,#improved-toggle.ytd-compact-autoplay-renderer,#toggle.ytd-compact-autoplay-renderer'
      )) &&
      eleCheck.attributes["checked"]
    ) ||
    (eleCheck = document.querySelector(':is(ytd-watch-flexy,ytd-watch-grid):not([hidden]) .ytp-autonav-toggle-button[aria-checked="true"]'))
  ) eleCheck.click();
}, 500);
