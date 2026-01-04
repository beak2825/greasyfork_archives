// ==UserScript==
// @name         YouTube Instant Preview
// @namespace    https://greasyfork.org/ru/users/1217463
// @version      1.6
// @description  load youtube preview
// @author       madeinsolyar
// @grant        none
// @include      https://www.youtube.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479890/YouTube%20Instant%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/479890/YouTube%20Instant%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override YouTube's default preview quality settings
    Object.defineProperty(window, 'ytInitialPlayerResponse', {
        get: function() {
            return undefined;
        },
        set: function(value) {
            if (value) {
                // Set the desired preview quality here
                value.playabilityStatus.liveStreamability = 'LIVE_STREAM_OFFLINE';
                value.streamingData.adaptiveFormats.some(function(format) {
                    if (format.width && format.height) {
                        format.url = format.url.replace('sqp=', 'sqp=16800');
                        return true;
                    }
                });
            }
            return value;
        }
    });
})();