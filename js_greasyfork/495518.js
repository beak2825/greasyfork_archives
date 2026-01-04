// ==UserScript==
// @name        TikTok Homepage and FYP Disable Autoplay
// @namespace   Violentmonkey Scripts
// @match        https://www.tiktok.com/
// @match        https://www.tiktok.com/foryou
// @match        https://www.tiktok.com/following
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @run-at          document-start
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @version     0.2.0
// @author      jcosentino (https://github.com/jcosentino/TikTok-Homepage-and-FYP-Disable-Autoplay)
// @description Pauses first video on homepage and FYP load, meant for navigation.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495518/TikTok%20Homepage%20and%20FYP%20Disable%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/495518/TikTok%20Homepage%20and%20FYP%20Disable%20Autoplay.meta.js
// ==/UserScript==

(() => {
  const config = {
    childList: true,
    subtree: true
  };

  const callback = () => {
    const firstVideo = document.getElementById('one-column-item-0')?.querySelector('video');
    if(firstVideo){
      firstVideo.pause();
      MutationObserver.disconnect();
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(document, config);
})();
