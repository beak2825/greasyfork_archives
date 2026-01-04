// ==UserScript==
// @name         Publish Contentful entities - Keyboard shortcut
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Script that enables Contentful entities to be published with ctrl+p/cmnd+p
// @author       IPJT - Ian Thorslund
// @match        https://app.contentful.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contentful.com
// @grant        window.onurlchange
// @license MIT
// @website      https://github.com/IPJT/contentful-publish-shortcut
// @downloadURL https://update.greasyfork.org/scripts/495272/Publish%20Contentful%20entities%20-%20Keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/495272/Publish%20Contentful%20entities%20-%20Keyboard%20shortcut.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function matchScript({ url }) {
    removeEventListener("keydown", saveShortcut);

    if (
      /^https:\/\/app\.contentful\.com\/spaces\/[^\/]+\/environments\/[^\/]+\/entries\//.test(
        url
      )
    ) {
      addEventListener("keydown", saveShortcut);
    }
  }

  if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener("urlchange", matchScript);
  }
})();

function saveShortcut(e) {
  // Use Ctrl+S on Windows or Cmd+S on macOS
  if ((e.ctrlKey && e.key === "p") || (e.metaKey && e.key === "p")) {
    // Prevent the default print action
    e.preventDefault();

    // Find and click the publish button
    const publishButton = document.getElementById(
      "status-widget-primary-action"
    );
    if (publishButton) {
      publishButton.click();
      console.log("Publish button clicked");
    } else {
      console.log("Publish button not found");
    }
  }
}
