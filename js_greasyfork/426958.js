// ==UserScript==
// @name         Disable Unload Confirmation
// @namespace    https://github.com/to
// @version      0.1
// @description  disable unload confirmation
// @match        https://*.apple.com/*
// @icon         https://www.google.com/s2/favicons?domain=apple.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/426958/Disable%20Unload%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/426958/Disable%20Unload%20Confirmation.meta.js
// ==/UserScript==

window.addEventListener('beforeunload', (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
}, true);