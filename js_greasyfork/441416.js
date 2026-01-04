// ==UserScript==
// @name         Cytube force inline chat and video for small device
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Force inline chat and video for small device in Cytube
// @author       Naemwu
// @match        https://cytu.be/r/*
// @icon         https://cytu.be/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441416/Cytube%20force%20inline%20chat%20and%20video%20for%20small%20device.user.js
// @updateURL https://update.greasyfork.org/scripts/441416/Cytube%20force%20inline%20chat%20and%20video%20for%20small%20device.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function uiChangeVideoWidth(direction) {
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

        var match = videoWrap.className.match(/col-(?:md|sm)-(\d+)/);
        if (!match) {
            throw new Error("ui::changeVideoWidth: videowrap is missing bootstrap class!");
        }

        var videoWidth = parseInt(match[1], 10) + direction;
        if (videoWidth < 3 || videoWidth > 9) {
            return;
        }

        var chatWidth = 12 - videoWidth;
        videoWrap.className = "col-sm-" + videoWidth + " col-md-" + videoWidth;
        rightControls.className = "col-sm-" + videoWidth + " col-md-" + videoWidth;
        rightPane.className = "col-sm-" + videoWidth + " col-md-" + videoWidth;
        chatWrap.className = "col-sm-" + chatWidth + " col-lmd" + chatWidth;
        leftControls.className = "col-sm-" + chatWidth + " col-lmd" + chatWidth;
        leftPane.className = "col-sm-" + chatWidth + " col-lmd" + chatWidth;

        handleVideoResize();
    };


    CyTube.ui.changeVideoWidth = uiChangeVideoWidth;
    uiChangeVideoWidth(0);

    $('#userlist').css('font-size', '8pt');
    $('#messagebuffer').css('font-size', '8pt');
    $('#usercount').css('font-size', '8pt');
})();