// ==UserScript==
// @name         Kuaishou & Kwai Video Downloader
// @namespace    https://greasyfork.org/en/users/781396
// @version      1.5
// @description  Download videos from Kuaishou and Kwai
// @author       YAD
// @match        *://*.kuaishou.com/*
// @match        *://*.kwai.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      MIT
// @icon         https://static.yximgs.com/udata/pkg/WEB-LIVE/kwai_icon.8f6787d8.ico
// @downloadURL https://update.greasyfork.org/scripts/511837/Kuaishou%20%20Kwai%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/511837/Kuaishou%20%20Kwai%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const createDownloadButton = (videoUrl) => {
        const button = document.createElement('button');
        button.innerText = '🎞️';
        button.style.position = 'absolute';
        button.style.zIndex = '9999';
        button.style.backgroundColor = '#ff3b5c';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.right = '2%';
        button.style.top = '10px';
        button.style.width = '35px';
        button.style.height = '35px';
        button.style.borderRadius = '50%';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.fontSize = '15px';
        button.style.transition = 'background-color 1s ease';

        button.onclick = () => {
            if (videoUrl) {
                button.innerText = '0%';
                button.style.backgroundColor = '#fff';
                GM_download({
                    url: videoUrl,
                    name: 'Kuaishou_Video.mp4',
                    onprogress: (progress) => {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        button.innerText = `${percent}%`;
                        if (percent <= 100) {
                            button.style.backgroundColor = `rgba(40, 167, 69, ${percent / 100})`;
                        }
                    },
                    onload: () => {
                        button.style.backgroundColor = '#28a745';
                        button.innerText = '✅';
                        setTimeout(() => {
                            button.innerText = '🎞️';
                            button.style.backgroundColor = '#ff3b5c';
                        }, 2000);
                    },
                    onerror: () => {
                        button.innerText = '❌';
                        setTimeout(() => {
                            button.innerText = '🎞️';
                        }, 2000);
                    },
                });
            } else {
                alert('No video URL found!');
            }
        };

        return button;
    };

    const updateDownloadButton = (videoContainer) => {
        const existingButton = videoContainer.querySelector('.download-button');
        const video = videoContainer.querySelector('video');
        const videoUrl = video ? video.src : null;

        if (existingButton) {
            existingButton.onclick = () => {
                if (videoUrl) {
                    GM_download({
                        url: videoUrl,
                        name: 'Kuaishou_Video.mp4',
                        onprogress: (progress) => {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            existingButton.innerText = `${percent}%`;
                            if (percent <= 100) {
                                existingButton.style.backgroundColor = `rgba(40, 167, 69, ${percent / 100})`;
                            }
                        },
                        onload: () => {
                            existingButton.style.backgroundColor = '#28a745';
                            existingButton.innerText = '✅';
                            setTimeout(() => {
                                existingButton.innerText = '🎞️';
                                existingButton.style.backgroundColor = '#ff3b5c';
                            }, 2000);
                        },
                        onerror: () => {
                            existingButton.innerText = '❌';
                            setTimeout(() => {
                                existingButton.innerText = '🎞️';
                            }, 2000);
                        },
                    });
                } else {
                    alert('No video URL found!');
                }
            };
        } else {
            const button = createDownloadButton(videoUrl);
            button.className = 'download-button';
            videoContainer.appendChild(button);
        }
    };

    const addDownloadButtonToVideo = () => {
        const videoContainers = document.querySelectorAll('.kwai-player-container-video, ._kwai-player-video_uxc1a_11');
        videoContainers.forEach((container) => {
            updateDownloadButton(container);
        });
    };

    const observer = new MutationObserver(() => {
        addDownloadButtonToVideo();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
