
    // ==UserScript==
    // @name         High Assembler
    // @namespace    https://hiasm.com
    // @version      1.0
    // @description  I don't get why you would need this, but if any russians want block coding on wibdows91 then here you go.
    // @author       Holy Network Adapter
    // @match        http://wibdows91.ddns.net/*
    // @match        http://wibdows91-devel.ddns.net/*
    // @match        http://wibdows91-lite.ddns.net/*
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444112/High%20Assembler.user.js
// @updateURL https://update.greasyfork.org/scripts/444112/High%20Assembler.meta.js
    // ==/UserScript==
     
    // This script works on both the stable release and the beta release.
    // Created by HolyNetworkAdapter - https://holynetworkadapter.github.io
    // HiAsm (especially this one which is called Hion) is not practical for big programs, please learn a better language for gods sake.
    function hiasm() {
        var $win = make_iframe_window({
            src: "https://ide.hiasm.com/",
            icons: iconsAtTwoSizes("highoncrack"),
            title: "HiAsm",
            innerWidth: 800,
            innerHeight: 600,
        });
        return new Task($win);
    }
     
    add_icon_not_via_filesystem({
        title: "HiAsm",
        iconID: "highoncrack",
        open: hiasm,
        shortcut: true
    });

