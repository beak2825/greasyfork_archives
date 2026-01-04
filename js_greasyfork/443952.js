// ==UserScript==
// @name         Mikasoft Wibdows 91 Sample Program
// @namespace    https://holynetworkadapter.github.io
// @version      1.0
// @description  A sample program for Mikasoft Wibdows 91
// @author       Holy Network Adapter
// @match        http://wibdows91.ddns.net/*
// @match        http://wibdows91-devel.ddns.net/*
// @match        http://wibdows91-lite.ddns.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443952/Mikasoft%20Wibdows%2091%20Sample%20Program.user.js
// @updateURL https://update.greasyfork.org/scripts/443952/Mikasoft%20Wibdows%2091%20Sample%20Program.meta.js
// ==/UserScript==

// This script works on both the stable release and the beta release.
// Created by HolyNetworkAdapter - https://holynetworkadapter.github.io
function example() {
    var $win = make_iframe_window({
        src: "/example.html",
        icons: iconsAtTwoSizes("desktop"),
        title: "hello world",
        innerWidth: 640,
        innerHeight: 480,
    });
    return new Task($win);
}

add_icon_not_via_filesystem({
    title: "hello world",
    iconID: "desktop",
    open: example,
    shortcut: true
});