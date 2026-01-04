// ==UserScript==
// @name         Auto reject yahoo consent screen
// @namespace    Auto-reject-yahoo-OK
// @version      1.0
// @description  Reject yahoo cookies/tracking for sites like techcrunch and others.
// @author       Anonymous
// @match        https://consent.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476707/Auto%20reject%20yahoo%20consent%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/476707/Auto%20reject%20yahoo%20consent%20screen.meta.js
// ==/UserScript==

(function() {
    document.querySelector("[name=reject]").click();
})();