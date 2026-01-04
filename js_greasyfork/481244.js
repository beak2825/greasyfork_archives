// ==UserScript==
// @name        YouTube: kevlar_watch_metadata_refresh_no_old_secondary_data = false
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.4
// @author      CY Fung
// @description Disable kevlar_watch_metadata_refresh_no_old_secondary_data
// @run-at      document-start
// @inject-into page
// @unwrap
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481244/YouTube%3A%20kevlar_watch_metadata_refresh_no_old_secondary_data%20%3D%20false.user.js
// @updateURL https://update.greasyfork.org/scripts/481244/YouTube%3A%20kevlar_watch_metadata_refresh_no_old_secondary_data%20%3D%20false.meta.js
// ==/UserScript==

(() => {
  window._ytConfigHacks.add((config_) => {
    const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS;
    if (EXPERIMENT_FLAGS) {
      EXPERIMENT_FLAGS.kevlar_watch_metadata_refresh_no_old_secondary_data = false;
    }
  });
})();
