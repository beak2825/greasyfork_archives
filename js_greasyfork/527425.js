// ==UserScript==
// @name         BT4G磁力提取
// @namespace    hoothin
// @version      2024-02-07
// @description  BT4G
// @author       You
// @match        https://bt4gprx.com/magnet/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/527425/BT4G%E7%A3%81%E5%8A%9B%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/527425/BT4G%E7%A3%81%E5%8A%9B%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const magnetImg = document.querySelector(`img[src="/static/img/magnet.png"]`);
    if (!magnetImg) return;
    const magnetLink = magnetImg.parentNode;
    magnetLink.href = magnetLink.href.replace(/.*\/hash\/(.*)\?name=(.*)/, "magnet:?xt=urn:btih:$1&dn=$2&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.auctor.tv%3A6969%2Fannounce&tr=udp%3A%2F%2Fopentracker.i2p.rocks%3A6969%2Fannounce&tr=https%3A%2F%2Fopentracker.i2p.rocks%3A443%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Fexplodie.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fuploads.gamecoast.net%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.skyts.net%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.cubonegro.lol%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker-udp.gbitt.info%3A80%2Fannounce&tr=udp%3A%2F%2Fopentracker.io%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.tracker.ink%3A6969%2Fannounce&tr=udp%3A%2F%2Fnew-line.net%3A6969%2Fannounce&tr=udp%3A%2F%2Fmovies.zsw.ca%3A6969%2Fannounce&tr=udp%3A%2F%2Fbt.ktrackers.com%3A6666%2Fannounce&tr=https%3A%2F%2Ftracker.tamersunion.org%3A443%2Fannounce&tr=https%3A%2F%2Ftracker.bt4g.com%3A443%2Fannounce");
})();