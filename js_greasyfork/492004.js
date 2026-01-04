// ==UserScript==
// @name        YouTube: Stable Streaming
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.4
// @author      CY Fung
// @license     MIT
// @description Nil
// @run-at      document-start
// @inject-into page
// @unwrap
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
// @downloadURL https://update.greasyfork.org/scripts/492004/YouTube%3A%20Stable%20Streaming.user.js
// @updateURL https://update.greasyfork.org/scripts/492004/YouTube%3A%20Stable%20Streaming.meta.js
// ==/UserScript==

(() => {

  window._ytConfigHacks.add((config_) => {

    const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS;

    if (EXPERIMENT_FLAGS) {

      EXPERIMENT_FLAGS.ab_pl_man = true;
      EXPERIMENT_FLAGS.ab_fk_sk_cl = true;
      EXPERIMENT_FLAGS.ab_det_apb_b = true;

      EXPERIMENT_FLAGS.ab_net_tp_e = true;
      EXPERIMENT_FLAGS.ad_net_pb_ab = true;
      EXPERIMENT_FLAGS.ad_net_pb_pbp = true;

    }

  });

})();
