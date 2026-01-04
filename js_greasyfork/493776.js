// ==UserScript==
// @name         TwitchTV stop autoplay
// @namespace    PoKeRGT
// @version      1.0
// @description  Stops twitch autoplay on main page
// @author       PoKeRGT
// @match        https://www.twitch.tv/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-ready
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493776/TwitchTV%20stop%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/493776/TwitchTV%20stop%20autoplay.meta.js
// ==/UserScript==


(function () {
  'use strict';

  console.info('Init TwitchTV stop autoplay')

  const playButtonAttribute = {
    "name": "data-a-player-state",
    "value": "playing"
  }
  const featuredItemXPath = "//div[@data-test-selector='featured-item-video']"
  const playButtonXPath = "//button[@data-a-target='player-play-pause-button']"

  function getElementByXpath(path, from) {
    return document.evaluate(path, from, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeName === 'DIV') {
          const featuredVideo = getElementByXpath(featuredItemXPath, node)
          if (featuredVideo) {
            const playButton = getElementByXpath(playButtonXPath, featuredVideo)
            if (playButton && playButton.getAttribute(playButtonAttribute["name"]) === playButtonAttribute["value"]) {
              playButton.click()
              console.log('Stopped autoplay')
            }
          }
        }
      });
    });
  });

  observer.observe(document, { childList: true, subtree: true });
})();

