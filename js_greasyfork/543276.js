// ==UserScript==
// @name         GreasyFork++ Install Button Fixer
// @namespace    ScriptKiddyMonkey
// @version      1
// @license      MIT
// @description  Fixes GreasyFork++ install buttons by hijacking their broken modal logic and forcing them to behave like actual install links again. No popups. No blank tabs. Just install, damn it.
// @author       ScriptKiddyMonkey & MonkeyGPT
// @match        https://greasyfork.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543276/GreasyFork%2B%2B%20Install%20Button%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/543276/GreasyFork%2B%2B%20Install%20Button%20Fixer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MAX_RETRIES = 30;
  let attempt = 0;

  const hijackInstallButtons = () => {
    const links = document.querySelectorAll('a.install-link');
    if (!links.length) {
      if (attempt++ < MAX_RETRIES) return setTimeout(hijackInstallButtons, 200);
      console.warn('[MonkeyGPT] No install links found after waiting.');
      return;
    }

    console.log(`[MonkeyGPT] Hijacking ${links.length} install button(s)...`);

    links.forEach(link => {
      const newLink = link.cloneNode(true);
      link.replaceWith(newLink);

      newLink.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('[MonkeyGPT] ⚡ Triggering inline install:', newLink.href);
        // Directly navigate to the script URL in the current tab
        window.location.href = newLink.href;
      });
    });
  };

  setTimeout(hijackInstallButtons, 1000);

})();
