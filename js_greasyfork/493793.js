// ==UserScript==
// @name         Disable Youtube PiP Miniplayer
// @namespace    disableMPYTxFIRKx
// @description  Prevents Youtube from keep playing videos in PiP/miniplayer
// @version      1.0
// @author       xFIRKx
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @homepageURL  https://greasyfork.org/it/scripts/493793-disable-youtube-pip-miniplayer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493793/Disable%20Youtube%20PiP%20Miniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/493793/Disable%20Youtube%20PiP%20Miniplayer.meta.js
// ==/UserScript==

(function() {
    document.body.addEventListener("yt-navigate-finish", function(event) {
        if (document.getElementsByTagName('ytd-miniplayer').length) {
            document.querySelector('ytd-miniplayer').parentNode.removeChild(document.querySelector('ytd-miniplayer'));
        }
        if (document.getElementsByClassName('ytp-miniplayer-button').length) {
            document.querySelector('.ytp-miniplayer-button').parentNode.removeChild(document.querySelector('.ytp-miniplayer-button'))
        }
        if (window.location.pathname != "/watch") {
            document.querySelector('#movie_player video').parentNode.removeChild(document.querySelector('#movie_player video'));
        }
    });
})();
(() => {
    'use strict'
    // credit: https://stackoverflow.com/a/46428962
    let oldHref = document.location.href
    window.onload = () => {
        let bodyList = document.querySelector('body')
        let observer = new MutationObserver(ms => {
            ms.forEach(_m => {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href
                    // allow some delay for page to load.
                    setTimeout(() => {
                        const jq = $('#movie_player > div.ytp-miniplayer-ui > div > button.ytp-miniplayer-close-button.ytp-button')
                        if (jq.length && !document.location.href.startsWith('https://www.youtube.com/watch?')) {
                            jq.click()
                            console.log('[AutoCloseYoutubeMiniplayer] miniplayer dismissed')
                        }}, 200)
                }
            })
        })
        observer.observe(bodyList, {childList: true, subtree: true})
    }
})()
// Function to disable play/pause keyboard shortcut within the miniplayer
function disableMiniplayerShortcut(event) {
    let miniplayer = document.querySelector('ytd-miniplayer');
    if (miniplayer && miniplayer.contains(event.target)) {
        if (event.code === 'Space' || event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
            event.stopImmediatePropagation(); // Stop event propagation
            event.preventDefault(); // Prevent default keyboard shortcut action
            console.log('Keyboard shortcut disabled for miniplayer.');
        }
    }
}

// Add event listener for keyboard shortcut within the miniplayer
document.addEventListener('keydown', disableMiniplayerShortcut, true); // Use capture phase for early interception


// === PATCH START ===
(function() {
    function handleMiniplayer() {
        const mini = document.querySelector('ytd-miniplayer');
        if (!mini) return;

        if (location.pathname === '/' || location.pathname === '/feed/library') {
            // On homepage or library: hide miniplayer to avoid breaking buttons
            mini.style.display = 'none';
            console.log('[Patch] Miniplayer hidden on homepage/library');
        } else {
            // On other pages, remove it
            mini.remove();
            console.log('[Patch] Miniplayer removed on non-homepage');
        }
    }

    window.addEventListener('load', () => {
        setTimeout(handleMiniplayer, 500);
    });

    document.body.addEventListener('yt-navigate-finish', () => {
        setTimeout(handleMiniplayer, 500);
    });
})();

// === PATCH END ===