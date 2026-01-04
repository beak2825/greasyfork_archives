// ==UserScript==
// @name        YouTube: Force Animated-Rolling-Number
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.11
// @author      CY Fung
// @license     MIT
// @description To force YouTube use Animated-Rolling-Number for YouTube Live
// @run-at      document-start
// @inject-into page
// @unwrap
// @require     https://update.greasyfork.org/scripts/475632/1361351/ytConfigHacks.js
// @downloadURL https://update.greasyfork.org/scripts/475635/YouTube%3A%20Force%20Animated-Rolling-Number.user.js
// @updateURL https://update.greasyfork.org/scripts/475635/YouTube%3A%20Force%20Animated-Rolling-Number.meta.js
// ==/UserScript==

(() => {

  window._ytConfigHacks.add((config_) => {

    const EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS;

    if (EXPERIMENT_FLAGS) {

      EXPERIMENT_FLAGS.web_enable_dynamic_metadata = true;
      EXPERIMENT_FLAGS.dynamic_metadata_update_interaction_delay_period_sec = 8;
      EXPERIMENT_FLAGS.web_animated_like = true;
      EXPERIMENT_FLAGS.web_animated_like_lazy_load = true;

    }

  });

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  setInterval(() => {
    // prevent animation number flicking due to change of video content (browse -> mini -> browse of another)

    for (const an of document.querySelectorAll('[hidden] yt-animated-rolling-number:not([f9wm6="0"]), [hidden] yt-smartimation:not([f9wm6="0"])')) {
      an.setAttribute('f9wm6', '0');
      const cnt = insp(an);
      const pnt = typeof cnt.disconnectedCallback === 'function' ? cnt : an;
      if (typeof pnt.disconnectedCallback === 'function') pnt.disconnectedCallback();
    }

    for (const an of document.querySelectorAll('yt-animated-rolling-number[f9wm6="0"], yt-smartimation[f9wm6="0"]')) {
      if (an.closest('[hidden]')) continue;
      an.setAttribute('f9wm6', '1');
      const cnt = insp(an);
      const pnt = typeof cnt.connectedCallback === 'function' ? cnt : an;
      if (typeof pnt.connectedCallback === 'function') pnt.connectedCallback();
    }

  }, 100);


})();
