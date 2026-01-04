// ==UserScript==
// @name         YouTube Web Tweaks lite edition
// @version      1.8.0
// @description  This is the version of YouTube Web Tweaks but only patch collection tweaks in it.
// @author       Magma_Craft
// @license MIT
// @match        *://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @unwrap
// @run-at       document-start
// @unwrap
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466374/YouTube%20Web%20Tweaks%20lite%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/466374/YouTube%20Web%20Tweaks%20lite%20edition.meta.js
// ==/UserScript==

// Enable strict mode to catch common coding mistakes
"use strict";

// Define the flags to assign to the EXPERIMENT_FLAGS object
const flagsToAssign = {
  // Standard tweaks (YT config editor + Disable animations)
  IS_TABLET: true,
  DISABLE_YT_IMG_DELAY_LOADING: true,
  polymer_verifiy_app_state: false,
  desktop_delay_player_resizing: false,
  web_animated_actions: false,
  web_animated_like: false,
  web_animated_like_lazy_load: false,
  render_unicode_emojis_as_small_images: true,
  smartimation_background: false,
  kevlar_refresh_on_theme_change: false,
  // Disable cinematics (aka ambient lighting)
  kevlar_measure_ambient_mode_idle: false,
  kevlar_watch_cinematics_invisible: false,
  web_cinematic_theater_mode: false,
  web_cinematic_fullscreen: false,
  enable_cinematic_blur_desktop_loading: false,
  kevlar_watch_cinematics: false,
  web_cinematic_masthead: false,
  web_watch_cinematics_preferred_reduced_motion_default_disabled: false
};

const updateFlags = () => {
  // Check if the EXPERIMENT_FLAGS object exists in the window.yt.config_ property chain
  const expFlags = window?.yt?.config_?.EXPERIMENT_FLAGS;

  // If EXPERIMENT_FLAGS is not found, exit the function
  if (!expFlags) return;

  // Assign the defined flags to the EXPERIMENT_FLAGS object
  Object.assign(expFlags, flagsToAssign);
};

// Create a MutationObserver that calls the updateFlags function when changes occur in the document's subtree
const mutationObserver = new MutationObserver(updateFlags);
mutationObserver.observe(document, { subtree: true, childList: true });