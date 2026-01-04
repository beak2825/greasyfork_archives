// ==UserScript==
// @name         Block AIFiesta Message Counter
// @namespace    https://greasyfork.org/en/users/123456   // (replace with your user profile link)
// @version      1.0
// @description  Blocks the message-count API call on AIFiesta to prevent tracking usage
// @author       vaishnav0105
// @match        *://*.aifiesta.ai/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546395/Block%20AIFiesta%20Message%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/546395/Block%20AIFiesta%20Message%20Counter.meta.js
// ==/UserScript==

(function() {
    // Patch fetch()
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        if (typeof args[0] === "string" && args[0].includes("/api/chat/message-count")) {
            console.log("Blocked fetch request:", args[0]);
            return new Response("{}", { status: 200 });
        }
        return origFetch(...args);
    };

    // Patch XMLHttpRequest
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (url.includes("/api/chat/message-count")) {
            console.log("Blocked XHR request:", url);
            this.send = () => {};
            return;
        }
        return origOpen.call(this, method, url, ...rest);
    };
})();
