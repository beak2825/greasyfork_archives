// ==UserScript==
// @name        Redirect to old reddit
// @description Redirects from new reddit to the old version
// @namespace   reddit
// @match       https://www.reddit.com/*
// @run-at      document-start
// @version 0.0.1.20210302143843
// @downloadURL https://update.greasyfork.org/scripts/422540/Redirect%20to%20old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/422540/Redirect%20to%20old%20reddit.meta.js
// ==/UserScript==

window.location.host = "old.reddit.com";