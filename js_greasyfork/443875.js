// ==UserScript==
// @name Discord Fixs for Firefox
// @description Fixes some glitches Discord in Firefox browser
// @run-at document-idle
// @author GooseSima
// @license MIT
// @version 1.1
// @namespace https://github.io/GooseSima/userscripts
// @supportURL https://github.io/GooseSima/userscripts/issues
// @match https://discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/443875/Discord%20Fixs%20for%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/443875/Discord%20Fixs%20for%20Firefox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var styleFixMASIcon;
    function fixMicAndSpeakerIcon() {
        const svgsElements = document.body.querySelectorAll('svg');
        for (let i = 0; i < svgsElements.length; i++) {
            const e = svgsElements[i];
            // check if classList element starts with "status-"
            for (let j = 0; j < e.classList.length; j++) {
                const className = e.classList[j];
                if (className.startsWith('status-')) {
                    // create style element
                    if (styleFixMASIcon.innerHTML.length === 0) {
                        styleFixMASIcon.innerHTML = '.' + className + ' { border: 4px solid var(--background-floating); margin: -4px; }';
                    }
                    if(e.parentElement.getAttribute('mask')) {
                        e.parentElement.removeAttribute('mask');
                    }
                }
            }
        }
    }
    
    function update(){
        fixMicAndSpeakerIcon();
        requestAnimationFrame(update);
    }
    
    // onload
    window.addEventListener('load', function () {
        console.log('[Discord Fix for Firefox] Enabled');
        styleFixMASIcon = document.createElement('style');
        document.head.appendChild(styleFixMASIcon);
        update();
    });
})();
