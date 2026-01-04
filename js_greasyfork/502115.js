// ==UserScript==
// @name         Altaireh TikTok Video Downloader V4
// @namespace    none
// @version      4.0
// @description  Download TikTok Videos Without A Watermark
// @author       altaireh
// @match        *://*.tiktok.com/*
// @icon         http://i.hmp.me/m/a0a089663971fa7ca3e9cdc2264ce7b4.png
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getResourceURL
// @resource     BUTTON_IMG http://i.hmp.me/m/3025e92fff4d4d7fa8e0642fb6cfe270.png
// @downloadURL https://update.greasyfork.org/scripts/502115/Altaireh%20TikTok%20Video%20Downloader%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/502115/Altaireh%20TikTok%20Video%20Downloader%20V4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FILE_NAME = 'Altaireh.mp4';

    const download = (url) => GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        onload: ({ response }) => GM_download({
            url: URL.createObjectURL(response),
            name: FILE_NAME
        })
    });

    const manageVideoButtons = (video) => {
        let button;
        const buttonActions = {
            mouseover: () => {
                if (!button) {
                    button = document.createElement('img');
                    button.src = GM_getResourceURL('BUTTON_IMG');
                    button.style.cssText = 'position: absolute; left: 10px; top: 50%; transform: translateY(-50%); z-index: 1000; width: 50px; height: 50px; cursor: pointer;';
                    button.onclick = (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        download(video.src || video.querySelector('source')?.src);
                    };
                    video.parentNode.appendChild(button);
                }
            },
            mouseout: (e) => {
                if (!video.contains(e.relatedTarget) && (!button || !button.contains(e.relatedTarget))) {
                    button.remove();
                    button = null;
                }
            }
        };
        Object.keys(buttonActions).forEach(event => video.addEventListener(event, buttonActions[event]));
    };

    new MutationObserver(() => {
        document.querySelectorAll('video:not(.processed)').forEach((video) => {
            video.classList.add('processed');
            manageVideoButtons(video);
        });
    }).observe(document.body, { childList: true, subtree: true });
})();