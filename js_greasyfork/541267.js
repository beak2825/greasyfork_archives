// ==UserScript==
// @name         Fake Geolocation (Osaka)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将浏览器地理位置伪装为大阪指定坐标
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541267/Fake%20Geolocation%20%28Osaka%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541267/Fake%20Geolocation%20%28Osaka%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 你自定义的经纬度（大阪附近）
    const fakeLatitude = 34.668208062667325;
    const fakeLongitude = 135.43046316179306;

    const fakePosition = {
        coords: {
            latitude: fakeLatitude,
            longitude: fakeLongitude,
            accuracy: 100,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
        },
        timestamp: Date.now()
    };

    // 伪造 getCurrentPosition
    navigator.geolocation.getCurrentPosition = function(success, error) {
        success(fakePosition);
    };

    // 伪造 watchPosition
    navigator.geolocation.watchPosition = function(success, error) {
        success(fakePosition);
        return 1; // 假的 watchId
    };

    console.log(`[Fake Location] 成功设置位置为：纬度 ${fakeLatitude}，经度 ${fakeLongitude}`);
})();