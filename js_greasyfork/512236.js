// ==UserScript==
// @name         remove_redirect
// @namespace    https://github.com/mikelxk/remove_redirect
// @version      0.1.0
// @author       mikelxk
// @description  remove redirects in zhihu.com
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512236/remove_redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/512236/remove_redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const updatedLinks = /* @__PURE__ */ new WeakSet();
  const ZHIHU_PATTERNS = [
    "https://link.zhihu.com/?target=",
    "http://link.zhihu.com/?target="
  ];
  function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  function updateLinkHref(link) {
    try {
      const href = link.href;
      if (!ZHIHU_PATTERNS.some((pattern) => href.includes(pattern))) {
        return null;
      }
      const urlParams = new URLSearchParams(href.split("?")[1]);
      const newLink = urlParams.get("target");
      if (!newLink) return null;
      const decodedLink = decodeURIComponent(newLink);
      link.href = decodedLink;
      return decodedLink;
    } catch (error) {
      console.error("Error updating link:", error);
      return null;
    }
  }
  function updateAllLinks() {
    const links = document.getElementsByTagName("a");
    Array.from(links).forEach((link) => updateLinkHref(link));
  }
  const debouncedObserverCallback = debounce((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node instanceof HTMLAnchorElement) {
              updateLinkHref(node);
            } else {
              const links = node.getElementsByTagName("a");
              Array.from(links).forEach((link) => updateLinkHref(link));
            }
          }
        });
      }
    });
  }, 100);
  document.addEventListener("DOMContentLoaded", updateAllLinks);
  const observer = new MutationObserver(debouncedObserverCallback);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  window.addEventListener("unload", () => {
    observer.disconnect();
  });
  const listenedEvents = ["click", "mouseover"];
  listenedEvents.forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      const target = event.target;
      if (target.tagName === "A") {
        const link = target;
        if (!updatedLinks.has(link)) {
          const newHref = updateLinkHref(link);
          if (newHref) {
            updatedLinks.add(link);
            if (eventName === "click") {
              event.preventDefault();
              window.location.href = newHref;
            }
          }
        }
      }
    });
  });

})();