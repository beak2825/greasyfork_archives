// ==UserScript==
// @name         CHZZK Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2023-12-23
// @description  block ad from CHZZK the Korean Stream Platform
// @author       LambFerret
// @match        https://chzzk.naver.com/*
// @icon         https://ditto-phinf.pstatic.net/20231213_298/17024369030470dJNT_PNG/65792026d3c26c0931a57cb8.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482710/CHZZK%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/482710/CHZZK%20Ad%20Blocker.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const debugMode = true;
    const enableAdblock = true;
    const enableUpdate = true;
    if (enableAdblock) removeAds();
    if (enableUpdate) checkScriptUpdate();

    function checkScriptUpdate() {
        const updateAddress = 'https://greasyfork.org/ko/scripts/482710-' + GM_info.script.name.toLowerCase().replaceAll(' ', '-');
        const currentVersion = GM_info.script.version;
        const code = '/code';

        console.log(updateAddress);

        fetch(updateAddress + code)
            .then(response => response.text())
            .then(data => {
            const remoteVersionMatch = data.match(/\/\/ @version\s+([^\n]+)/);
            const remoteVersion = remoteVersionMatch ? remoteVersionMatch[1].trim() : null;

            console.log(currentVersion + ' ==> ' + remoteVersion);

            if (remoteVersion && remoteVersion !== currentVersion) {
                console.log('Update available!');
                var result = window.confirm('There is update in this script. Update now?');

                if (result) {
                    window.open(updateAddress, '_blank');
                }

            } else {
                console.log('No update available.');
            }
        })
            .catch(error => console.error('Error checking for updates:', error));



    }

    function removeAds() {
        if (debugMode) console.log("Start removing Ads");
        setInterval(()=> {
            const adList = [...document.querySelectorAll('video[data-role="videoEl"]')]
            const video = adList[0];
            if (video) video.playbackRate = 10;
            video?.addEventListener('loadedmetadata', function() {
                if (Number.isFinite(video.duration)) {
                    video.currentTime = Math.max(0, video.duration);
                }
            });
          //  if (video) video.currentTime = Math.max(0, video.duration - 0.01);
        }, 50)
    }
})();