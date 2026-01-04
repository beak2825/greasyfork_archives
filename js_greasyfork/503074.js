// ==UserScript==
// @name        vrbdl
// @namespace   Violentmonkey Scripts
// @match       *://vrbangers.com/video/*
// @grant       none
// @version     1.0
// @author      -
// @run-at       document-end
// @description UserScript version of this extension https://github.com/dvick/vrbdownres
// @downloadURL https://update.greasyfork.org/scripts/503074/vrbdl.user.js
// @updateURL https://update.greasyfork.org/scripts/503074/vrbdl.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function doInjectButton() {
        if (document.querySelector('.video-download-button__activator')) {
            return;
        }
        const button = document.createElement('button');
        button.className = 'video-download-button__activator app-link app-link__button app-link__button--block --single-video';
        button.setAttribute('data-v-d6d564ee', '');
        button.innerText = 'Download';
        const appMenuActivator = document.querySelector('.single-video-info__download-button > .app-menu__activator');
        if (appMenuActivator) {
            appMenuActivator.appendChild(button);
        }
    }

    function injectButton() {
        const preview = document.querySelector('.single-video-poster__preview');

        if (preview && preview.classList.contains('--loading')) {
            const observer = new MutationObserver((mutations, observer) => {
                if (!preview.classList.contains('--loading')) {
                    observer.disconnect();
                    doInjectButton();
                }
            });
            observer.observe(preview, {
                attributes: true,
                attributeFilter: ['class']
            });
        } else {
            doInjectButton();
        }
    }

    function observePage() {
        const target = document.querySelector('main.app-content') || document.getElementById('__nuxt');
        if (target) {
            const observer = new MutationObserver((mutations, observer) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.id === '__layout' || node.classList.contains('single-video-info__download-button')) {
                            observer.disconnect();
                            injectButton();
                            return;
                        }
                    }
                }
            });
            observer.observe(target, { childList: true });
        }
    }

    // Initial button injection on page load
    if (window.location.pathname.startsWith('/video/')) {
        injectButton();
        observePage();
    }

    // Observe history changes and re-inject button if necessary
    const historyPushState = history.pushState;
    history.pushState = function() {
        historyPushState.apply(this, arguments);
        if (window.location.pathname.startsWith('/video/')) {
            injectButton();
            observePage();
        }
    };
})();