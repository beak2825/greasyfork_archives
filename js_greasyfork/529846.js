// ==UserScript==
// @name         Cytube Enlarge Video
// @namespace    http://tampermonkey.net/
// @version      2025-3-14
// @description  Enlarge Video
// @author       Ash
// @match        https://cytu.be/r/*
// @icon         https://icons.duckduckgo.com/ip2/cytu.be.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529846/Cytube%20Enlarge%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/529846/Cytube%20Enlarge%20Video.meta.js
// ==/UserScript==


CyTube.ui.changeVideoWidth = function uiChangeVideoWidth(direction) {
    var body = document.body;
    if (/hd/.test(body.className)) {
        throw new Error("ui::changeVideoWidth does not work with the 'hd' layout");
    }

    var videoWrap = document.getElementById("videowrap");
    var leftControls = document.getElementById("leftcontrols");
    var leftPane = document.getElementById("leftpane");
    var chatWrap = document.getElementById("chatwrap");
    var rightControls = document.getElementById("rightcontrols");
    var rightPane = document.getElementById("rightpane");

    var match = videoWrap.className.match(/col-md-(\d+)/);
    if (!match) {
        throw new Error("ui::changeVideoWidth: videowrap is missing bootstrap class!");
    }

    var videoWidth = parseInt(match[1], 10) + direction;
    if (videoWidth < 3 || videoWidth > 10) {
        return;
    }

    var chatWidth = 12 - videoWidth;
    videoWrap.className = "col-md-" + videoWidth + " col-lg-" + videoWidth;
    rightControls.className = "col-md-" + videoWidth + " col-lg-" + videoWidth;
    rightPane.className = "col-md-" + videoWidth + " col-lg-" + videoWidth;
    chatWrap.className = "col-md-" + chatWidth + " col-lg-" + chatWidth;
    leftControls.className = "col-md-" + chatWidth + " col-lg-" + chatWidth;
    leftPane.className = "col-md-" + chatWidth + " col-lg-" + chatWidth;

    handleVideoResize();
};