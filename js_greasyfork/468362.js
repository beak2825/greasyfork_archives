    // ==UserScript==
    // @name         Screenshot Hack
    // @namespace    http://f1tv.formula1.com
    // @version      2.32
    // @description  Allows screenshotting and capturing.
    // @author       Štěpán Prchal
    // @match        https://f1tv.formula1.com/*
    // @match        https://sport.ceskatelevize.cz/*
    // @match        https://clashofthestars.tv/*
    // @match        https://clashofthestars.tv/#/*
    // @match        https://clashofthestars.tv/#/watch/*
    // @match        https://clashofthestars.tv/#/watch/1
    // @icon         none
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468362/Screenshot%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/468362/Screenshot%20Hack.meta.js
    // ==/UserScript==
     
    /* jshint esversion:6 */
    (function () {
        'use strict';
     
        if (!localStorage.getItem('firstTime')) localStorage.setItem('firstTime', 'true');
     
        if (localStorage.getItem('firstTime') == 'true') {
            alert(`After this alert, press Alt+C, select the browser in the Window tab, now you should be able to screen record and screenshot.`);
            localStorage.setItem('firstTime', 'false'); }
     
        const fakeVideo = document.createElement('video');
        let isCapturing = false;
     
        document.onkeydown = keydown;
        function keydown(evt = event) {
            if (evt.altKey && evt.keyCode == 67 && isCapturing) {
                isCapturing = false;
                fakeVideo.srcObject.getTracks().forEach(track => track.stop())
                return; }
     
            if (evt.altKey && evt.keyCode == 67) {
                getDisplayMedia(screen => {
                    isCapturing = true;
                    console.log(isCapturing);
                    fakeVideo.srcObject = screen;
                });
                return;
            }
        }
     
        function getDisplayMedia(success, error) {
            if (navigator.mediaDevices.getDisplayMedia) navigator.mediaDevices.getDisplayMedia().then(success).catch(error);
            else navigator.getDisplayMedia().then(success).catch(error);
        }
     
    })();

