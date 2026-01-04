// ==UserScript==
// @name         Instagram Reel Volume Control
// @namespace    http://f0ck.org/
// @version      0.4
// @description  Add a volume bar to reduce the volume of Instagrams fucking loud reels
// @author       ninjazan420
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524034/Instagram%20Reel%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/524034/Instagram%20Reel%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addVolumeControl() {
        const videoWrappers = document.querySelectorAll('div > video');

        videoWrappers.forEach(video => {
            if (!video.volumeControlAdded) {
                const volumeControl = document.createElement('input');
                volumeControl.type = 'range';
                volumeControl.min = 0;
                volumeControl.max = 1;
                volumeControl.step = 0.01;
                volumeControl.value = video.volume;
                volumeControl.style.position = 'absolute';
                volumeControl.style.bottom = '5px'; 
                volumeControl.style.left = '50%';
                volumeControl.style.transform = 'translateX(-50%)'; 
                volumeControl.style.zIndex = 1000;
                volumeControl.style.width = '80px';

                const parent = video.closest('div[role="presentation"]') || video.parentElement;
                parent.style.position = 'relative';
                parent.appendChild(volumeControl);

                volumeControl.addEventListener('input', function() {
                    video.volume = this.value;
                });

                video.volumeControlAdded = true;
            }
        });
    }

    const observer = new MutationObserver(addVolumeControl);
    observer.observe(document.body, { childList: true, subtree: true });

    addVolumeControl();
})();