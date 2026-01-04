// ==UserScript==
// @name         TORN: Disable Chat
// @namespace    dekleinekobini.private.disablechat
// @version      0.1
// @description  Completely disable the chat 3.0 system.
// @author       DeKleineKobini [2114440]
// @run-at       document-start
// @match        https://*.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533540/TORN%3A%20Disable%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/533540/TORN%3A%20Disable%20Chat.meta.js
// ==/UserScript==

const originalSharedWorker = window.SharedWorker;
const originalWorker = window.Worker;

GM_addStyle(`
  #chatRoot {
    display: none;
  }
`);

(function () {
    "use strict";

    window.SharedWorker = function (url, options) {
        if (!isBlocked(url)) {
            return new originalSharedWorker(url, options);
        } else {
            return null;
        }
    };
    window.Worker = function (url) {
        if (!isBlocked(url)) {
            return new originalWorker(url);
        } else {
            return null;
        }
    };

    function isBlocked(location) {
        const path = location instanceof URL ? location.pathname : location;

        return path.includes("chat-worker");
    }
})();
