// ==UserScript==
// @name         colamanga漫画广告屏蔽器
// @namespace    https://www.colamanga.com
// @version      2024-09-04
// @description  colamanga漫画广告屏蔽器!
// @author       You
// @match        https://www.colamanga.com/*
// @icon         https://www.colamanga.com/favicon.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507979/colamanga%E6%BC%AB%E7%94%BB%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/507979/colamanga%E6%BC%AB%E7%94%BB%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        console.log(mutation.addedNodes);
        mutation.addedNodes.forEach((node) => {
          if (node.tagName === "IFRAME") {
            console.log("发现新插入的 iframe");
            // 在这里可以进行你想要的处理，比如屏蔽 iframe
            node.style.display = "none";
          }
        });
      }
    });
  });

  observer.observe(document, { childList: true, subtree: true });

  setInterval(function () {
    document.querySelector("#HMhrefleft").style.display = "none";
    document.querySelector("#HMhrefright").style.display = "none";

    const allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      if (element.tagName === "DIVZ") {
        // 假设组件名是大写敏感的，如果不是，请根据实际情况调整
        element.style.display = "none";
      }
    }
  }, 2000);

  let operations = [];

  function logOperation(type, target, value) {
    operations.push({
      type: type,
      target: target,
      value: value,
    });
  }

  const originalCreateElement = document.createElement;
  document.createElement = function (tagName) {
    const element = originalCreateElement.call(document, tagName);
    logOperation("createElement", tagName, null);
    return element;
  };

  const originalAppendChild = document.appendChild;
  document.appendChild = function (child) {
    const parent = this;
    originalAppendChild.call(parent, child);
    logOperation("appendChild", parent, child);
    return child;
  };

  const originalRemoveChild = document.removeChild;
  document.removeChild = function (child) {
    const parent = this;
    originalRemoveChild.call(parent, child);
    logOperation("removeChild", parent, child);
    return child;
  };

  // You can add more overridden methods for other DOM operations as needed.

  // Periodically log the operations (for demonstration purposes).
  setInterval(() => {
    if (operations.length > 0) {
      console.log(operations);
      operations = [];
    }
  }, 5000);
})();
