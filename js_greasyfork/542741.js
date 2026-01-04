// ==UserScript==
// @name         不太灵去除VIP遮罩
// @namespace    https://www.nite07.com
// @version      1.0.3
// @description  去除不太灵网站视频播放页的VIP登录遮罩，并显示完整的资源列表。
// @author       Nite
// @homepage     https://www.nite07.com
// @supportURL   https://www.nite07.com
// @license      MIT
// @match        https://www.0bt0.com/mv/*
// @match        https://www.1bt0.com/mv/*
// @match        https://www.2bt0.com/mv/*
// @match        https://www.3bt0.com/mv/*
// @match        https://www.4bt0.com/mv/*
// @match        https://www.5bt0.com/mv/*
// @match        https://www.6bt0.com/mv/*
// @match        https://www.7bt0.com/mv/*
// @match        https://www.8bt0.com/mv/*
// @match        https://www.9bt0.com/mv/*
// @match        https://0bt0.com/mv/*
// @match        https://1bt0.com/mv/*
// @match        https://2bt0.com/mv/*
// @match        https://3bt0.com/mv/*
// @match        https://4bt0.com/mv/*
// @match        https://5bt0.com/mv/*
// @match        https://6bt0.com/mv/*
// @match        https://7bt0.com/mv/*
// @match        https://8bt0.com/mv/*
// @match        https://9bt0.com/mv/*
// @match        https://*.mukaku.com/mv/*
// @icon         https://www.0bt0.com/favicon.ico
// @grant        none
// @run-at       context-start
// @downloadURL https://update.greasyfork.org/scripts/542741/%E4%B8%8D%E5%A4%AA%E7%81%B5%E5%8E%BB%E9%99%A4VIP%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/542741/%E4%B8%8D%E5%A4%AA%E7%81%B5%E5%8E%BB%E9%99%A4VIP%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

function waitForKeyElement(selector, callback) {
  const existingElement = document.querySelector(selector);
  if (existingElement) {
    callback(existingElement);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length === 0) continue;

      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;

        if (node.matches(selector)) {
          obs.disconnect();
          callback(node);
          return;
        }

        const targetElement = node.querySelector(selector);
        if (targetElement) {
          obs.disconnect();
          callback(targetElement);
          return;
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function observeStyleChanges(element, attribute, callback) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === attribute
      ) {
        const newAttr = element.getAttribute(attribute);
        const oldAttr = mutation.oldValue;

        callback(element, newAttr, oldAttr);
      }
    }
  });

  const config = {
    attributes: true,
    attributeOldValue: true,
    subtree: true,
  };

  observer.observe(element, config);
}

(function () {
  "use strict";
  waitForKeyElement(".vip-gate-overlay", (element) => element.remove());
  waitForKeyElement(".resources-section-container", (element) => {
    element.parentElement.removeAttribute("style");
    observeStyleChanges(element.parentElement, "style", (e) => {
      if (e.hasAttribute("style")) {
        e.removeAttribute("style");
      }
    });
  });
})();
