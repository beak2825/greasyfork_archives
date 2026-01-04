// ==UserScript==
// @name         YTBetter - Enable Rewind/DVR Beta test
// @namespace    YTBetter
// @version      2.81
// @description  Unlocks rewind for YouTube live streams with disabled DVR
// @description:ru  Позволяет перематывать YouTube-стримы, где такая возможность заблокирована
// @author       copyMister
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533137/YTBetter%20-%20Enable%20RewindDVR%20Beta%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/533137/YTBetter%20-%20Enable%20RewindDVR%20Beta%20test.meta.js
// ==/UserScript==

"use strict";

// Interop with "Simple YouTube Age Restriction Bypass"
const {
    get: getter,
    set: setter,
} = Object.getOwnPropertyDescriptor(Object.prototype, "playerResponse") ?? {
    set(value) {
        this[Symbol.for("YTBetter")] = value;
    },
    get() {
        return this[Symbol.for("YTBetter")];
    },
};

const isObject = (value) => value != null && typeof value === "object";

Object.defineProperty(Object.prototype, "playerResponse", {
    set(value) {
        if (isObject(value)) {
            const { streamingData, videoDetails, playerConfig } = value;
            if (isObject(videoDetails) && videoDetails.isLive && !videoDetails.isLiveDvrEnabled) {
                videoDetails.isLiveDvrEnabled = true;
                if (isObject(playerConfig) && playerConfig.mediaCommonConfig.useServerDrivenAbr) {
                    playerConfig.mediaCommonConfig.useServerDrivenAbr = false;
                    console.log('[YTBetter] Disabled useServerDrivenAbr');
                    if (isObject(streamingData)) {
                        delete streamingData.serverAbrStreamingUrl;
                    }
                }
            }
        }
        setter.call(this, value);
    },
    get() {
        return getter.call(this);
    },
    configurable: true,
});