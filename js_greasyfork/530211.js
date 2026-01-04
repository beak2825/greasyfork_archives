// ==UserScript==
// @name         Bypass Radiko Region Restriction
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify Radiko location check to bypass region restriction
// @match        *://radiko.jp/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530211/Bypass%20Radiko%20Region%20Restriction.user.js
// @updateURL https://update.greasyfork.org/scripts/530211/Bypass%20Radiko%20Region%20Restriction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 伪造日本的经纬度（可调整）
    const fakeCoords = {
        latitude: 35.6895,  // 东京
        longitude: 139.6917
    };

    // Hook Geolocation API
    navigator.geolocation.getCurrentPosition = function(success, error) {
        success({
            coords: {
                latitude: fakeCoords.latitude,
                longitude: fakeCoords.longitude,
                accuracy: 10
            }
        });
    };

    navigator.geolocation.watchPosition = function(success, error) {
        success({
            coords: {
                latitude: fakeCoords.latitude,
                longitude: fakeCoords.longitude,
                accuracy: 10
            }
        });
    };

    console.log("Radiko 地区限制已修改（GPS 伪造）");
})();