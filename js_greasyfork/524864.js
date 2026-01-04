// ==UserScript==
// @name        Remove YouTube Tab Notification Count
// @match        *://*.youtube.com/*
// @version     1.0
// @author      yodaluca23
// @license      GNU GPLv3
// @description Remove your notifications count from the tab title on YouTube.
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/524864/Remove%20YouTube%20Tab%20Notification%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/524864/Remove%20YouTube%20Tab%20Notification%20Count.meta.js
// ==/UserScript==

// Save the original descriptor of document.title
const originalTitleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');

// Create a custom getter and setter
Object.defineProperty(document, 'title', {
  get: function() {
    return originalTitleDescriptor.get.call(this);
  },
  set: function(newValue) {
    // Remove the (#) with regex.
    const interceptedValue = newValue.replace(/^\(\d+\)\s?/, "");

    // Call the original setter
    originalTitleDescriptor.set.call(this, interceptedValue);
  }
});