// ==UserScript==
// @name        YouTube 2021 Layout
// @namespace   https://github.com/Amadeus-AI
// @description Bring back 2021 layout of YouTube
// @icon        https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @version     1.0.0
// @author      AmadeusAI
// @match       *://*.youtube.com/*
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/478159/YouTube%202021%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/478159/YouTube%202021%20Layout.meta.js
// ==/UserScript==

// Return to Old Layout
unsafeWindow.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh = false;
unsafeWindow.yt.config_.EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_secondary_data = false;