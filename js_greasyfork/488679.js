// ==UserScript==
// @name     YouTube UI update revert
// @description	Reverts the YouTube UI update by disabling an experiment
// @namespace	https://github.com/Wolfyxon/YouTube-UI-revert/
// @license LGPL-2.1
// @match	*://*.youtube.com/*
// @version  1.1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/488679/YouTube%20UI%20update%20revert.user.js
// @updateURL https://update.greasyfork.org/scripts/488679/YouTube%20UI%20update%20revert.meta.js
// ==/UserScript==

const enableNewYouTubePlayer = false;

// NOTE: the 'yt' object is only accessible on Firefox with Greasemonkey when using 'unsafeWindow'
unsafeWindow.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = enableNewYouTubePlayer;
window.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = enableNewYouTubePlayer;
