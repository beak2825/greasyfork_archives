// ==UserScript==
// @name         假装HDR
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  假装设备屏幕是HDR
// @author       TGSAN
// @run-at       document-start
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510027/%E5%81%87%E8%A3%85HDR.user.js
// @updateURL https://update.greasyfork.org/scripts/510027/%E5%81%87%E8%A3%85HDR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDolbyVisionSupported = false;
    try {
        window.navigator.requestMediaKeySystemAccess("com.microsoft.playready", [
            {
                videoCapabilities: [
                    { contentType: 'video/mp4; codecs="dvhe.05.01"' }
                ],
            },
        ]).then((keySystemAccess) => {
            isDolbyVisionSupported = true;
        }).catch(() => {
            window.navigator.requestMediaKeySystemAccess("com.widevine.alpha.experiment", [
                {
                    videoCapabilities: [
                        { contentType: 'video/mp4; codecs="dvhe.05.01"', robustness: "HW_SECURE_DECODE" }
                    ],
                },
            ]).then((keySystemAccess) => {
                isDolbyVisionSupported = true;
            });
        });
    } catch { }

    window.matchMediaFakeHDROriginal = window.matchMedia;
    window.matchMedia = function(...args) {
        let arg = args[0].replaceAll(" ","");
        // console.log(arg);
        if (arg.indexOf("color-gamut:p3") !== -1 || arg.indexOf("color-gamut:rec2020") !== -1 || arg.indexOf("dynamic-range:high") !== -1 || arg.indexOf("video-dynamic-range:high") !== -1) {
            return {
                matches: true,
                media: arg
            };
        }
        return window.matchMediaFakeHDROriginal(...args);
    };
    if (window.screen.colorDepth < 48) {
        Object.defineProperty(window.screen, 'colorDepth', {
            value: 48
        });
    }
    if (window.MediaSource) {
        window.MediaSource.isTypeSupportedFakeHDROriginal = window.MediaSource.isTypeSupported;
        window.MediaSource.isTypeSupported = function (mimeType) {
            let r = this.isTypeSupportedFakeHDROriginal(mimeType);
            if (r === false) {
                if (mimeType.indexOf("dvh1") !== -1 || mimeType.indexOf("dvhe") !== -1) {
                    return isDolbyVisionSupported;
                }
            }
            return r;
        }
    }
})();