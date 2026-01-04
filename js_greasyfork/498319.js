// ==UserScript==
// @name         Auto Scroll YouTube Shorts
// @namespace    https://greasyfork.org/users/1308345-hellfiveosborn
// @homepageURL  https://greasyfork.org/scripts/498319
// @supportURL   https://greasyfork.org/scripts/498319/feedback
// @version      1.0
// @description  Auto scroll YouTube Shorts with an ON/OFF switch and Config option
// @date         2024-06-19
// @author       HellFive Osborn
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   brave
// @compatible   kiwi
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498319/Auto%20Scroll%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/498319/Auto%20Scroll%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Init CONFIG
    const config = {
        appName: 'Auto Scroll YouTube Shorts',
        appSymbol: '📺',
        keyPrefix: 'autoscrollytshorts',
        greasyForkURL: 'https://greasyfork.org/scripts/498319-auto-scroll-youtube-shorts',
        updateUrl: 'https://update.greasyfork.org/scripts/498319/Auto%20Scroll%20YouTube%20Shorts.meta.js'
    };

    // Load TailwindCSS
    const tailwindCSS = `
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    `;
    GM_addStyle(tailwindCSS);

    // Register the Config menu command
    const idMenu = GM_registerMenuCommand('Config', showConfigInterface);
    let autoScrollInterval;

    function showConfigInterface() {
        // Check if the interface already exists
        if (document.getElementById('autoScrollInterface')) {
            return;
        }

        // Create the interface
        const interfaceHTML = `
            <div id="autoScrollInterface" class="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-50 text-center">
                <div class="flex justify-between items-center mb-2 relative">
                    <h1 class="text-gray-300 font-medium">YouTube Shorts Auto Scroll</h1>
                    <button id="closeButton" class="text-gray-100 hover:bg-red-300 p-0 lh-0 bg-red-400 mt-0 absolute -right-5 -top-6 rounded-full w-5 h-5 leading-none">&times;</button>
                </div>
                <label class="flex items-center cursor-pointer justify-center">
                    <div class="relative">
                        <input id="autoScrollToggle" type="checkbox" class="sr-only" />
                        <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <div id="toggleDot" class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                    </div>
                    <div class="ml-3 text-gray-300 font-medium">Auto Scroll</div>
                </label>
                <div id="updateMessage" class="mt-2 text-gray-300"></div>
                <button id="updateButton" class="hidden mt-2 bg-blue-500 text-white p-2 rounded-full w-full">Update now 🚀</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', interfaceHTML);

        // Toggle functionality
        const autoScrollToggle = document.getElementById('autoScrollToggle');
        const toggleDot = document.getElementById('toggleDot');
        const closeButton = document.getElementById('closeButton');
        closeButton.addEventListener('click', () => {
            document.getElementById('autoScrollInterface').remove();
        });

        autoScrollToggle.addEventListener('change', function () {
            if (this.checked) {
                toggleDot.style.transform = 'translateX(100%)';
                startAutoScroll();
                GM_setValue('autoScroll', 'on');
                closeButton.style.display = 'none';
            } else {
                toggleDot.style.transform = 'translateX(0)';
                stopAutoScroll();
                GM_setValue('autoScroll', 'off');
                closeButton.style.display = 'block';
            }
        });

        // Initialize based on GM_getValue
        const autoScrollStatus = GM_getValue('autoScroll', 'off');
        if (autoScrollStatus === 'on') {
            autoScrollToggle.checked = true;
            toggleDot.style.transform = 'translateX(100%)';
            startAutoScroll();
            closeButton.style.display = 'none';
        } else {
            autoScrollToggle.checked = false;
            toggleDot.style.transform = 'translateX(0)';
            stopAutoScroll();
            closeButton.style.display = 'block';
        }

        // Handle visibility change
        document.addEventListener('visibilitychange', function () {
            if (autoScrollToggle.checked) {
                if (document.visibilityState === 'visible' || document.pictureInPictureElement) {
                    startAutoScroll();
                } else {
                    stopAutoScroll();
                }
            }
        });

        // Check for updates
        updateCheck();
    }

    function startAutoScroll() {
        console.log('Auto scroll started');
        autoScrollInterval = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                video.loop = false; // Ensure loop is disabled
                if (video.duration > 0 && video.currentTime >= video.duration - 0.5) {
                    console.log('Video finished, scrolling to next');
                    goToNextShort();
                }
            }
        }, 1000); // Check every second
    }

    function stopAutoScroll() {
        console.log('Auto scroll stopped');
        clearInterval(autoScrollInterval);
    }

    function goToNextShort() {
        const nextButtonContainer = document.querySelector('.navigation-container #navigation-button-down');
        if (nextButtonContainer) {
            const nextButton = nextButtonContainer.querySelector('button');
            if (nextButton) {
                nextButton.click();
                console.log('Clicked next button');
            } else {
                console.log('Next button not found inside container');
            }
        } else {
            console.log('Next button container not found');
        }
    }

    // Function to handle keydown events
    function handleKeyDown(event) {
        if (event.key === 'ArrowDown') {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = video.duration; // Skip to the end of the video
            }
        }
    }

    // Update check
    function updateCheck() {
        const currentVer = GM_info.script.version;
        GM_xmlhttpRequest({
            method: 'GET',
            url: config.updateUrl + '?t=' + Date.now(),
            headers: { 'Cache-Control': 'no-cache' },
            onload: response => {
                const latestVer = /@version +(.*)/.exec(response.responseText)[1];
                console.log('[Auto Scroll Youtube Shorts]', 'Current version:', currentVer, 'Latest:', latestVer)
                if (isOutdatedVersion(currentVer, latestVer)) {
                    const updateMessage = document.getElementById('updateMessage');
                    const updateButton = document.getElementById('updateButton');
                    updateMessage.innerHTML = `There is an update available: v${latestVer}`;
                    updateButton.classList.remove('hidden');
                    updateButton.addEventListener('click', () => {
                        window.open(config.greasyForkURL, '_blank');
                    });
                }
            }
        });
    }

    function isOutdatedVersion(currentVer, latestVer) {
        const current = currentVer.split('.').map(Number);
        const latest = latestVer.split('.').map(Number);
        for (let i = 0; i < current.length; i++) {
            if (latest[i] > current[i]) return true;
            if (latest[i] < current[i]) return false;
        }
        return false;
    }

    // Add event listener for keydown events
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup on script disable
    function cleanup() {
        stopAutoScroll();
        const interfaceElement = document.getElementById('autoScrollInterface');
        if (interfaceElement) {
            interfaceElement.remove();
        }
        //GM_unregisterMenuCommand(idMenu);
    }

    // Observe script disable
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.removedNodes) {
                for (const node of mutation.removedNodes) {
                    if (node.nodeType === 1 && node.id === 'autoScrollInterface') {
                        cleanup();
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true });
})();
