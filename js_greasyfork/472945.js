// ==UserScript==
// @name        polymer_enable_controller_extraction
// @namespace   test
// @match       https://www.youtube.com/*
// @grant       none
// @version     2.6
// @author      CY Fung
// @description Up to Controller Extraction v2 dated 2023.09.23
// @run-at      document-start
// @allFrames   true
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
// @unwrap
// @inject-into page
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472945/polymer_enable_controller_extraction.user.js
// @updateURL https://update.greasyfork.org/scripts/472945/polymer_enable_controller_extraction.meta.js
// ==/UserScript==

(() => {

  window._ytConfigHacks.add((config_) => {


    const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS;

    if (EXPERIMENT_FLAGS) {

      EXPERIMENT_FLAGS.polymer_enable_controller_extraction=true;

      // Sep 2023
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_0 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_1 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_2 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_3 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_4 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_5 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_6 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_7 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_8 = true;
      EXPERIMENT_FLAGS.main_app_controller_extraction_batch_9 = true;

      // Future?
      // EXPERIMENT_FLAGS.kevlar_wiz_prototype = true;
      EXPERIMENT_FLAGS.kevlar_wiz_prototype_enable_all_components = true;

    }

  });

})();