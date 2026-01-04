// ==UserScript==
// @name         Youtube H.264 (updated 2020)
// @namespace    http://www.youtube.com
// @version      1.1.2
// @description  originally https://greasyfork.org/en/scripts/8128-youtube-h-264 (https://github.com/erkserkserks/h264ify) and https://github.com/Shimmermare/NotYetAV1
// @match        *://youtube.com/*
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/415692/Youtube%20H264%20%28updated%202020%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415692/Youtube%20H264%20%28updated%202020%29.meta.js
// ==/UserScript==

var h264ify = function () {
    // Override video element canPlayType() function
    var videoElem = document.createElement('video');
    var origCanPlayType = videoElem.canPlayType.bind(videoElem);
    videoElem.__proto__.canPlayType = function (type) {
        if (type === undefined) return '';
        // If queried about webM/vp8/vp8 support, say we don't support them
        if (type.indexOf('webm') != -1
            || type.indexOf('vp8') != -1
            || type.indexOf('vp9') != -1
            || type.indexOf('av01') !== -1) {
            return '';
        }
        // Otherwise, ask the browser
        return origCanPlayType(type);
    }
    
    // Override media source extension isTypeSupported() function
    var mse = window.MediaSource;
    var origIsTypeSupported = mse.isTypeSupported.bind(mse);
    mse.isTypeSupported = function (type) {
        if (type === undefined) return '';
        // If queried about webM/vp8/vp8 support, say we don't support them
        if (type.indexOf('webm') != -1
            || type.indexOf('vp8') != -1
            || type.indexOf('vp9') != -1
            || type.indexOf('av01') !== -1) {

            return '';
        }
        // Otherwise, ask the browser
        return origIsTypeSupported(type);
    }
};

h264ify();
