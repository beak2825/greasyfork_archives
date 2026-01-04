// ==UserScript==
// @name         Twitch Sort Offline Channels Alphabetically
// @version      1.01
// @description  Automatically expands and sorts offline channels in the sidebar alphabetically
// @author       Stitchless
// @namespace    stitch.less
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502359/Twitch%20Sort%20Offline%20Channels%20Alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/502359/Twitch%20Sort%20Offline%20Channels%20Alphabetically.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let sortOfflineChannelsTimer = setInterval(sortOfflineChannels, 500);
  sortOfflineChannels();

  function sortOfflineChannels() {
    const mainDiv = document.querySelector('[aria-label="Followed Channels"]');
    if (mainDiv === null) {
      return;
    }

    let list = mainDiv.children[1];

    //first fully expand sidebar
    const showMoreWrapper = mainDiv.getElementsByClassName('side-nav-show-more-toggle__button')[0];
    const showMoreButton = showMoreWrapper.querySelector('button[data-a-target="side-nav-show-more-button"]');
    if (showMoreButton !== null) {
      showMoreButton.click();
      return;
    }

    /*if (!document.getElementById('sortOfflineChannels')) {
      const newDiv = document.createElement('div');
      showMoreWrapper.appendChild(newDiv);
      newDiv.innerHTML = '<a id="sortOfflineChannels" href="javascript:;">Sort Channels</a>';

      document.getElementById("sortOfflineChannels").addEventListener(
        "click", sortOfflineChannels, false
      );
    }*/

    //once "Show More" button is gone sort list
    const nodesToSort = list.children;

    Array.prototype.map.call(nodesToSort, function(node) {
      return {
        node: node,
        relevantText: node.querySelector('[data-a-target="side-nav-card-metadata"] p:first-child').textContent
      };
    }).sort(function(a, b) {
      return a.relevantText.localeCompare(b.relevantText);
    }).forEach(function(item) {
      const status = item.node.getElementsByClassName('side-nav-card__live-status')[0].children[0].textContent;
      if (status === "Offline") {
        list.appendChild(item.node);
      }
    });

    //clearInterval(sortOfflineChannelsTimer);
  }
})();