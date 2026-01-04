// ==UserScript==
// @name         imgur upload
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  try to take over the world!
// @author       Killua115
// @match        https://imgur.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537709/imgur%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/537709/imgur%20upload.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const fetchMock = window.fetch;
    const xhrOpenMock = window.XMLHttpRequest.prototype.open;
    const ValidApi = ["/3/album", "/3/upload", "/3/upload/checkcaptcha"];

    const modifyUrl = function (args) {
        let uri = new URL(args);
        if (ValidApi.includes(uri.pathname)) {
            uri.host = "imgur-50c3.killua.workers.dev";
        }
        return uri.href;
    };

    window.fetch = function () {
        arguments[0] = modifyUrl(arguments[0]);
        return fetchMock.apply(this, arguments);
    };

    window.XMLHttpRequest.prototype.open = function () {
        arguments[1] = modifyUrl(arguments[1]);
        return xhrOpenMock.apply(this, arguments);
    };
    // Your code here...
})();