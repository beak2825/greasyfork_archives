// ==UserScript==
// @name         wgs to gcj for google maps js sdk on teslafi
// @namespace    kylehe
// @version      0.1
// @description  wgs to gcj transformation of coordinates
// @author       Kyle
// @match        https://teslafi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413802/wgs%20to%20gcj%20for%20google%20maps%20js%20sdk%20on%20teslafi.user.js
// @updateURL https://update.greasyfork.org/scripts/413802/wgs%20to%20gcj%20for%20google%20maps%20js%20sdk%20on%20teslafi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.google = window.google || {};

    const google = window.google;
    google.maps = google.maps || {};

    let _gLatLng;
    const _myLatLng = class {
        constructor(lat, lng) {
            [lat, lng] = transform(lat, lng);
            return new _gLatLng(lat, lng);
        };
    };

    Object.defineProperty(google.maps, 'LatLng', {
        get() {
            return _myLatLng;
        },
        set(val) {
            _gLatLng = val;
        }
    });


    // https://gist.github.com/599316527/74d7912f5bc60ca09c662fc3edfd9a43
    const PI = 3.14159265358979324;

    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    const A = 6378245.0;
    const EE = 0.00669342162296594323;

    function transform(wgLat, wgLon) {
        if (outOfChina(wgLat, wgLon)) return [wgLat, wgLon];

        let dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
        let dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
        const radLat = wgLat / 180.0 * PI;
        let magic = Math.sin(radLat);
        magic = 1 - EE * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((A * (1 - EE)) / (magic * sqrtMagic) * PI);
        dLon = (dLon * 180.0) / (A / sqrtMagic * Math.cos(radLat) * PI);
        return [wgLat + dLat, wgLon + dLon];
    }

    function outOfChina(lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    }

    function transformLat(x, y) {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    function transformLon(x, y) {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

})();