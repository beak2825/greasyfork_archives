// ==UserScript==
// @name         Netflix seamless play
// @namespace    PoKeRGT
// @version      1.03
// @description  Skips intro, recaps and jumps to next video automatically
// @author       PoKeRGT
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @run-at       document-ready
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495694/Netflix%20seamless%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/495694/Netflix%20seamless%20play.meta.js
// ==/UserScript==


(function () {
  'use strict';

  const nextEpisodeButtonXPath = "//button[@data-uia='next-episode-seamless-button-draining']"
  const skipIntroButtonXPath = "//button[@data-uia='player-skip-intro']"
  const skipRecapButtonXPath = "//button[@data-uia='player-skip-recap']"

  function getElementByXpath(path, from) {
    return document.evaluate(path, from, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeName === 'DIV') {

          const skipIntroButton = getElementByXpath(skipIntroButtonXPath, node)
          const nextEpisodeButton = getElementByXpath(nextEpisodeButtonXPath, node)
          const skipRecapButton = getElementByXpath(skipRecapButtonXPath, node)

          if (skipIntroButton) {
            skipIntroButton.click()
          }

          if (nextEpisodeButton) {
            nextEpisodeButton.click()
          }

          if (skipRecapButton) {
            skipRecapButton.click()
          }
        }
      });
    });
  });

  observer.observe(document, { childList: true, subtree: true });
})();