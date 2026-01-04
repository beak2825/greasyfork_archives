// ==UserScript==
// @name         Instagram Anonymous Story Viewer
// @version      1.1
// @description  Blocks specific requests to maintain anonymity while viewing Instagram stories, supporting XMLHttpRequest, Fetch API, and GraphQL.
// @license      MIT
// @author       Mobile46
// @match        *://*.instagram.com/*
// @include      *://*.instagram.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=instagram.com&sz=32
// @namespace    https://greasyfork.org/users/1466082
// @downloadURL https://update.greasyfork.org/scripts/535035/Instagram%20Anonymous%20Story%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535035/Instagram%20Anonymous%20Story%20Viewer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const config = {
    debug: false,
    blockedPatterns: [/viewSeenAt/i, /story_view/i],
  };

  const log = (...args) => {
    if (config.debug) {
      console.log("[Instagram Anonymous Story Viewer]", ...args);
    }
  };

  const shouldBlockRequest = (data) => {
    if (!data) return false;
    try {
      const strData = typeof data === "string" ? data : JSON.stringify(data);
      return config.blockedPatterns.some((pattern) => pattern.test(strData));
    } catch (e) {
      log("Error checking request data:", e);
      return false;
    }
  };

  const originalXMLSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    try {
      if (shouldBlockRequest(args[0])) {
        log("Blocked XMLHttpRequest with viewSeenAt data");
        return;
      }
      return originalXMLSend.apply(this, args);
    } catch (e) {
      log("Error in XMLHttpRequest override:", e);
      return originalXMLSend.apply(this, args);
    }
  };

  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    try {
      const [resource, options = {}] = args;
      const body = options.body || null;

      if (
        shouldBlockRequest(body) ||
        (typeof resource === "string" && shouldBlockRequest(resource))
      ) {
        log("Blocked Fetch request with viewSeenAt data");
        return new Promise(() => {});
      }

      return await originalFetch.apply(this, args);
    } catch (e) {
      log("Error in Fetch override:", e);
      return originalFetch.apply(this, args);
    }
  };

  const protectOverrides = () => {
    try {
      Object.defineProperty(window, "fetch", {
        value: window.fetch,
        writable: false,
        configurable: false,
      });

      Object.defineProperty(XMLHttpRequest.prototype, "send", {
        value: XMLHttpRequest.prototype.send,
        writable: false,
        configurable: false,
      });
    } catch (e) {
      log("Error protecting overrides:", e);
    }
  };

  try {
    protectOverrides();
    log("Script initialized successfully");
  } catch (e) {
    console.error(
      "[Instagram Anonymous Story Viewer] Initialization error:",
      e
    );
  }
})();