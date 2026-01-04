// ==UserScript==
// @name         斗鱼去广告
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  去除部分斗鱼播放器广告
// @author       You
// @match        https://www.douyu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469487/%E6%96%97%E9%B1%BC%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/469487/%E6%96%97%E9%B1%BC%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';
  //Mutation Event version
  function removeNodeFromContainerME(containerSelector, nodeSelector) {
    let node = document.querySelector(nodeSelector);
    node && node.remove();

    let container = document.querySelector(containerSelector);
    container &&
      container.addEventListener('DOMNodeInserted', function () {
        let node = container.querySelector(
          `${containerSelector} ${nodeSelector}`
        );
        if (node) {
          node.remove();
        }
      });
  }

  //Mutation Observer version
  function removeNodeFromContainerMO(containerSelector, nodeSelector) {
    //remove node initially
    const node = document.querySelector(`${containerSelector} ${nodeSelector}`);
    node && node.remove();

    const container = document.querySelector(containerSelector);
    const config = { childList: true, subtree: true };
    const callback = function () {
      const childNode = container.querySelector(
        `${containerSelector} ${nodeSelector}`
      );
      if (childNode) {
        childNode.remove();
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(container, config);

    //observer.disconnect();
  }

  function removeNodeDirectly(selector) {
    const node = document.querySelector(selector);
    node && node.remove();
  }

  removeNodeDirectly('#js-room-activity');
  removeNodeFromContainerMO('#js-player-video', '.ScreenBannerAd');
  removeNodeDirectly('.RedEnvelopAd');
  removeNodeFromContainerMO('.layout-Player-toolbar', '.AnchorPocketTips');
})();
