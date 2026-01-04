// ==UserScript==
// @name         Vue Loader
// @namespace    https://github.com/SaiCode-DEV
// @version      1.0.0
// @description  Loads Vue.js into the current page if it is not already loaded.
// @author       SaiCode
// @include       /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/525900/Vue%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/525900/Vue%20Loader.meta.js
// ==/UserScript==

/* global $ */
/* jshint esversion:6 */

(function main() {
  "use strict";

  const VUE_URL = "https://unpkg.com/vue@3/dist/vue.global.js";

  async function init() {
    const sandboxed = typeof unsafeWindow !== "undefined";
    const pageWindow = sandboxed ? unsafeWindow : window;

    // Check if Vue is already loaded
    if (typeof pageWindow.Vue !== "undefined") {
      console.log("Vue.js is already loaded.");
      return;
    }

    console.log("Loading Vue.js...");
    await new Promise((resolve, reject) => {
      $.getScript(VUE_URL)
        .done(() => {
          console.log("Vue.js has been successfully loaded.");
          resolve();
        })
        .fail((jqxhr, settings, exception) => {
          console.error("Failed to load Vue.js:", exception);
          reject(exception);
        });
    });

    if (typeof pageWindow.Vue !== "undefined") {
      console.log("Vue.js has been loaded successfully.");
    } else {
      console.error("Error loading Vue.js.");
    }
  }

  function bootstrap(tries = 1) {
    if (typeof $ !== "undefined") {
      init();
    } else if (tries < 100) {
      setTimeout(() => bootstrap(tries + 1), 100);
    } else {
      console.error("Vue Loader could not be initialized.");
    }
  }

  bootstrap();
})();
