// ==UserScript==
// @name         Muzify Helper
// @namespace    http://tampermonkey.net/
// @version      2024-12-15
// @description  Cheat for muzify or musicnerd "Name That Tune!" quiz. Changes the text for the correct option to something recognizable.
// @author       mmedic23
// @license      MIT (https://opensource.org/licenses/MIT)
// @match        https://musicnerd.io/*
// @match        https://muzify.com/*
// @run-at document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musicnerd.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520737/Muzify%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520737/Muzify%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The target URL to monitor
    const targetURL = "https://users.asset.money/api/v1/music/artist/quiz/";

    // Hook into XMLHttpRequest
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (url.startsWith(targetURL)) {
            this.addEventListener("load", function() {
                if (this.responseType === "" || this.responseType === "text") {
                    try {
                        let jsonResponse = JSON.parse(this.responseText);
                        jsonResponse.data.artist_quiz.forEach(item => {
                            item.options.forEach(option => {
                                if (option.correct) {
                                    option.song_name = `!!!###CLICKME###!!!`; // Modify correct option's song_name
                                }
                            });
                        });
                        Object.defineProperty(this, "responseText", {
                            get: () => JSON.stringify(jsonResponse),
                        });
                    } catch (e) {
                        console.error("Failed to parse JSON:", e);
                    }
                }
            });
        }
        return open.call(this, method, url, ...rest);
    };
})();