// ==UserScript==
// @name         YouTube Web Tweaks
// @version      4.2.9
// @description  This script optimizes YouTube's performance by modified configs and much more!
// @author       Magma_Craft
// @license MIT
// @match        *://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @unwrap
// @run-at       document-end
// @unwrap
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447802/YouTube%20Web%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/447802/YouTube%20Web%20Tweaks.meta.js
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

// Other tweaks to be added
(function() {
let css = `

/* Hide ads, shorts, etc using CSS */
.ytd-search ytd-shelf-renderer, ytd-reel-shelf-renderer, ytd-merch-shelf-renderer, ytd-action-companion-ad-renderer, ytd-display-ad-renderer, ytd-rich-section-renderer, ytd-video-masthead-ad-advertiser-info-renderer, ytd-video-masthead-ad-primary-video-renderer, ytd-in-feed-ad-layout-renderer, ytd-ad-slot-renderer, ytd-statement-banner-renderer, ytd-banner-promo-renderer-background ytd-ad-slot-renderer, ytd-in-feed-ad-layout-renderer, .ytwPanelAdHeaderImageLockupViewModelHost, ytd-ads-engagement-panel-content-renderer, #content.ytd-ads-engagement-panel-content-renderer, ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"], ytd-rich-item-renderer:has(> #content > ytd-ad-slot-renderer), .ytd-video-masthead-ad-v3-renderer, div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint, div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer, div#main-container.style-scope.ytd-promoted-video-renderer, div#player-ads.style-scope.ytd-watch-flexy, #clarify-box, ytm-rich-shelf-renderer, ytm-search ytm-shelf-renderer, ytm-button-renderer.icon-avatar_logged_out, ytm-companion-slot, ytm-reel-shelf-renderer, ytm-merch-shelf-renderer, ytm-action-companion-ad-renderer, ytm-display-ad-renderer, ytm-rich-section-renderer, ytm-video-masthead-ad-advertiser-info-renderer, ytm-video-masthead-ad-primary-video-renderer, ytm-in-feed-ad-layout-renderer, ytm-ad-slot-renderer, ytm-statement-banner-renderer, ytm-banner-promo-renderer-background ytm-ad-slot-renderer, ytm-in-feed-ad-layout-renderer, ytm-rich-item-renderer:has(> #content > ytm-ad-slot-renderer) .ytm-video-masthead-ad-v3-renderer, div#root.style-scope.ytm-display-ad-renderer.yt-simple-endpoint, div#sparkles-container.style-scope.ytm-promoted-sparkles-web-renderer, div#main-container.style-scope.ytm-promoted-video-renderer, div#player-ads.style-scope.ytm-watch-flexy, ytm-pivot-bar-item-renderer:has(> .pivot-shorts), ytd-compact-movie-renderer, yt-about-this-ad-renderer, masthead-ad, ad-slot-renderer, yt-mealbar-promo-renderer, statement-banner-style-type-compact, ytm-promoted-sparkles-web-renderer, tp-yt-iron-overlay-backdrop, #masthead-ad, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Shorts"], a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer[title="Shorts"] {
display: none !important
}

.style-scope[page-subtype='channels'] ytd-shelf-renderer,
.style-scope[page-subtype='channels'] ytm-shelf-renderer {
display: block !important;
}
 
ytd-watch-metadata.ytd-watch-flexy {
padding-bottom: 36px !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();