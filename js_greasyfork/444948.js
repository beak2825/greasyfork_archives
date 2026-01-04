    // ==UserScript==
    // @name         virtualdesktop.org
    // @namespace    http://virtualdesktop.org
    // @version      1.0
    // @description  ...Why?
    // @author       Zdrmonster1
    // @match        http://wibdows91.ddns.net/*
    // @match        http://wibdows91-devel.ddns.net/*
    // @match        http://wibdows91-lite.ddns.net/*
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444948/virtualdesktoporg.user.js
// @updateURL https://update.greasyfork.org/scripts/444948/virtualdesktoporg.meta.js
    // ==/UserScript==
     
    // This script works on both the stable release and the beta release.
    // Created by HolyNetworkAdapter - https://holynetworkadapter.github.io
    function macosx() {
        var $macos = make_iframe_window({
            src: "http://virtualdesktop.org/complete/osx4/index.html",
            icons: iconsAtTwoSizes("desktop"),
            title: "MAC OS X",
            innerWidth: 800,
            innerHeight: 600,
        });
        return new Task($macos);
    }
     
    add_icon_not_via_filesystem({
        title: "Mac OS X",
        iconID: "desktop",
        open: macosx,
        shortcut: true
    });

    function win2k() {
        var $win2k = make_iframe_window({
            src: "http://virtualdesktop.org/complete/2k/index.html",
            icons: iconsAtTwoSizes("windows-update"),
            title: "Windows 2000",
            innerWidth: 800,
            innerHeight: 600,
        });
        return new Task($win2k);
    }
     
    add_icon_not_via_filesystem({
        title: "Windows 2000",
        iconID: "windows-update",
        open: win2k,
        shortcut: true
    });

    function winxpsp2() {
        var $winxp = make_iframe_window({
            src: "http://www.virtualdesktop.org/complete/xpsp2/index.html",
            icons: iconsAtTwoSizes("windows-update"),
            title: "Windows XP",
            innerWidth: 800,
            innerHeight: 600,
        });
        return new Task($winxp);
    }
     
    add_icon_not_via_filesystem({
        title: "Windows XP",
        iconID: "windows-update",
        open: winxpsp2,
        shortcut: true
    });