// ==UserScript==
// @name         YTBetter - Enable Rewind/DVR
// @namespace    YTBetter
// @version      3.0
// @description  Unlocks rewind for YouTube live streams with disabled DVR and longer than 12 hours
// @author       copyMister
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485020/YTBetter%20-%20Enable%20RewindDVR.user.js
// @updateURL https://update.greasyfork.org/scripts/485020/YTBetter%20-%20Enable%20RewindDVR.meta.js
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
const getKeyByPropName = (object, value) => Object.keys(object).find(key => object[key] && object[key][value]);

Object.defineProperty(Object.prototype, "playerResponse", {
    set(value) {
        if (isObject(value)) {
            const { streamingData, videoDetails, playerConfig, microformat } = value;
            // Only affect live streams
            if (isObject(videoDetails) && videoDetails.isLive) {
                // Enable DVR if it's disabled
                videoDetails.isLiveDvrEnabled = true;

                // Disable server-side ads that block live rewind
                // https://greasyfork.org/en/scripts/485020-ytbetter-enable-rewind-dvr/discussions/295167
                if (isObject(playerConfig) && playerConfig.mediaCommonConfig) {
                    const mcConf = playerConfig.mediaCommonConfig;
                    mcConf.useServerDrivenAbr = false;
                    // https://greasyfork.org/en/scripts/485020-ytbetter-enable-rewind-dvr/discussions/313024
                    if (mcConf.serverPlaybackStartConfig) {
                        mcConf.serverPlaybackStartConfig.enable = false;
                    }
                }

                if (isObject(streamingData)) {
                    // Remove the stream URL with server-side ads if others are available
                    if (streamingData.serverAbrStreamingUrl && (streamingData.hlsManifestUrl || streamingData.dashManifestUrl)) {
                        delete streamingData.serverAbrStreamingUrl;
                    }

                    // Unlock rewind past 12 hours (43200 seconds), up to 7 days
                    // https://greasyfork.org/en/scripts/485020-ytbetter-enable-rewind-dvr/discussions/312558
                    const maxDefault = 43200;
                    const maxDvrSecs = maxDefault * 14;
                    let durationSecs = 0;

                    const s1 = 'playerMicroformatRenderer';
                    const s2 = 'liveBroadcastDetails';
                    const s3 = 'html5_max_live_dvr_window_plus_margin_secs';

                    if (isObject(microformat) && isObject(microformat[s1]) && isObject(microformat[s1][s2])) {
                        const nowSecs = new Date();
                        const startSecs = new Date(microformat[s1][s2].startTimestamp);
                        durationSecs = Math.floor((nowSecs - startSecs) / 1000);
                    }

                    // Proceed if the stream is longer than 12 hours
                    if (durationSecs > maxDefault) {
                        if (isObject(streamingData.adaptiveFormats)) {
                            for (const format of streamingData.adaptiveFormats) {
                                format.maxDvrDurationSec = maxDvrSecs;
                            }
                        }

                        const key = getKeyByPropName(this, 'experiments');
                        if (key) {
                            this[key].experiments.flags[s3] = maxDvrSecs;
                        }
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