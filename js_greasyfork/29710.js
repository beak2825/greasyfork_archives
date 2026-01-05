// ==UserScript==
// @name         Smashcast VOD Timestamp Plugin
// @namespace    https://greasyfork.org/en/users/46421-rootuser
// @version      0.1
// @description  Adds timestamp support to Smashcast VODs
// @author       https://twitter.com/BitOBytes
// @match        *://*.smashcast.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29710/Smashcast%20VOD%20Timestamp%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/29710/Smashcast%20VOD%20Timestamp%20Plugin.meta.js
// ==/UserScript==

const loc = window.location.href, timestamp = calculateTimestamp();

function calculateTimestamp() {
    const ts = loc.split('t=')[1].toLowerCase();
    var hour = 0, min = 0, sec = 0;

    if (ts.indexOf('h') !== -1) hour = ts.split('h')[0];
    if (ts.indexOf('m') !== -1) {
        min = ts.split('m')[0];
        if (min.indexOf('h') !== -1) min = min.substr(min.indexOf('h') + 1);
    }
    if (ts.indexOf('s') !== -1) {
        sec = ts.split('s')[0];
        if (sec.indexOf('m') !== -1) sec = sec.substr(sec.indexOf('m') + 1);
        if (sec.indexOf('h') !== -1) sec = sec.substr(sec.indexOf('h') + 1);
    }

    return (parseInt(hour) * 60 * 60) + (parseInt(min) * 60) + parseInt(sec);
}

function run() {
    const vid = document.getElementsByTagName('video')[0];
    if (vid && !vid.paused) {
        setTimeout(function () {
            vid.currentTime = timestamp;
        }, 50);
    } else
        setTimeout(run, 50);
}

(function() {
    'use strict';

    if (loc.match(/https:\/\/www.smashcast.tv\/([^\/]+)\/videos\/([0-9]+)#t=([a-zA-Z0-9]+)/g)) setTimeout(run, 2000);
})();