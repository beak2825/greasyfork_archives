// ==UserScript==
// @name         TVerを iOS版Safariで視聴可能にするスクリプト
// @name:ja         TVerを iOS版Safariで視聴可能にするスクリプト
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description:ja  TVerを iOS版Safariで視聴可能にするスクリプト
// @match        https://tver.jp/*
// @run-at       document-start
// @description Spoof desktop UA on TVer and Prime Video for iOS Safari
// @downloadURL https://update.greasyfork.org/scripts/539168/TVer%E3%82%92%20iOS%E7%89%88Safari%E3%81%A7%E8%A6%96%E8%81%B4%E5%8F%AF%E8%83%BD%E3%81%AB%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539168/TVer%E3%82%92%20iOS%E7%89%88Safari%E3%81%A7%E8%A6%96%E8%81%B4%E5%8F%AF%E8%83%BD%E3%81%AB%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const spoofProps = {
        userAgent:       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
        platform:        "MacIntel",
        vendor:          "Apple Computer, Inc.",
        maxTouchPoints:  1
    };

    for (const [key, value] of Object.entries(spoofProps)) {
        Object.defineProperty(navigator, key, {
            get: () => value,
            configurable: true
        });
    }
})();
