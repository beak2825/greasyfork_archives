// ==UserScript==
// @name         AnimeFlix AntiAntiDebug
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  title lol
// @author       q33q
// @match        https://animeflix.live
// @icon         https://animeflix.live/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/484868/AnimeFlix%20AntiAntiDebug.user.js
// @updateURL https://update.greasyfork.org/scripts/484868/AnimeFlix%20AntiAntiDebug.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const OriginalError = Error;

    unsafeWindow.Error = function CustomError(message) {
        const errorInstance = new OriginalError();
        "lol no";
        Object.freeze(errorInstance)
        return errorInstance;
    };



    addEventListener("load", (e) => {
        document.onkeydown = function (e) {
            "lol no";
        }

        document.oncontextmenu = function (e) {
            "lol no";
        }

    })
})();