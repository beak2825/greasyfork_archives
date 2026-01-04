// ==UserScript==
// @name         Tiktok Video & Slideshow Downloader 🎬🖼️
// @namespace    https://greasyfork.org/en/scripts/431826
// @version      2.9
// @description  Download TikTok videos without watermark and slideshow images. Hover on video and click the download button.
// @author       YAD
// @match        *://*.tiktok.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @icon         https://miro.medium.com/v2/resize:fit:512/1*KX6NTUUHWlCP4sCXz28TBA.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431826/Tiktok%20Video%20%20Slideshow%20Downloader%20%F0%9F%8E%AC%F0%9F%96%BC%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/431826/Tiktok%20Video%20%20Slideshow%20Downloader%20%F0%9F%8E%AC%F0%9F%96%BC%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        [id^="xgwrapper-"] {
            height: 100% !important;
        }
    `;
    document.head.appendChild(style);

    const getFileName = (id) => {
        return `TikTok_Video_${id}.mp4`;
    };

    const createButton = (icon, color, clickHandler) => {
        const button = document.createElement('div');
        Object.assign(button.style, {
            position: 'absolute',
            right: '15px',
            top: '27%',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            backgroundColor: color,
            color: '#ffffff',
            fontSize: '18px',
            textShadow: '3px 3px 0px #9C1331',
            textAlign: 'center',
            lineHeight: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            zIndex: '999999'
        });
        button.textContent = icon;
        button.onclick = clickHandler;
        return button;
    };

    const downloadContent = (url, filename, button, isZip = false) => {
        if (!url) {
            button.textContent = '✖️';
            return;
        }

        button.textContent = '⏳';

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            onload: ({ response }) => {
                if (response) {
                    if (isZip) {
                        filename.file('video', response);
                    } else {
                        GM_download({
                            url: URL.createObjectURL(response),
                            name: filename,
                            onload: () => {
                                button.textContent = '✔️';
                                setTimeout(() => button.remove(), 2000);
                            },
                            onerror: () => {
                                button.textContent = '✖️';
                                setTimeout(() => button.remove(), 1500);
                            }
                        });
                    }
                } else {
                    button.textContent = '✖️';
                    setTimeout(() => button.remove(), 1500);
                }
            },
            onerror: () => {
                button.textContent = '✖️';
                setTimeout(() => button.remove(), 1500);
            },
            ontimeout: () => {
                button.textContent = '✖️';
                setTimeout(() => button.remove(), 1500);
            }
        });
    };

    const createDownloadButton = (video) => {
        const button = createButton('🎞️', '#ff3b5c', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            button.textContent = '⏳';

            const videoUrl = video.src || video.querySelector('source')?.src;
            const xgwrapper = video.closest('[id^="xgwrapper-"]');
            const videoId = xgwrapper?.id.split('-')[2] || 'default';

            if (videoUrl && videoUrl.startsWith('blob:')) {
                button.style.backgroundColor = '#ffa700';

                const tiktokVideoUrl = `https://www.tiktok.com/@YAD/video/${videoId}`;

                const iframe = document.createElement('iframe');
                iframe.style.position = 'fixed';
                iframe.style.width = '80%';
                iframe.style.height = '80%';
                iframe.style.top = '10%';
                iframe.style.left = '10%';
                iframe.style.border = '2px solid #000';
                iframe.style.zIndex = '10000';
                iframe.style.visibility = 'hidden';
                iframe.src = tiktokVideoUrl;
                document.body.appendChild(iframe);

                const checkVideoUrl = () => {
                    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                    const videoElement = iframeDocument.querySelector('video');
                    const sourceElement = iframeDocument.querySelector('video source');
                    if (videoElement && sourceElement && sourceElement.src) {
                        downloadContent(sourceElement.src, getFileName(videoId), button);
                        iframe.remove();
                    } else {
                        setTimeout(checkVideoUrl, 1000);
                    }
                };

                iframe.onload = () => {
                    setTimeout(checkVideoUrl, 8000);
                };
            } else {
                button.style.backgroundColor = '#ff3b5c';
                downloadContent(videoUrl, getFileName(videoId), button);
            }
        });

        video.parentNode.style.position = 'relative';
        video.parentNode.appendChild(button);
        return button;
    };


    const manageDownloadButtons = (video) => {
        let button;
        video.addEventListener('mouseover', () => {
            if (!button) {
                button = createDownloadButton(video);
            }
        });
        video.addEventListener('mouseout', (e) => {
            if (button && !video.contains(e.relatedTarget) && !button.contains(e.relatedTarget)) {
                // Only remove the button if it's not in the loading state (⏳)
                if (button.textContent !== '⏳') {
                    button.remove();
                    button = null;
                }
            }
        });
    };

    const promptUserForZipOrIndividual = () => {
        return new Promise((resolve) => {
            const userChoice = confirm("Do you want to download images as a ZIP file? Cancel will download individually");
            resolve(userChoice);
        });
    };

    const addImageDownloadButton = (container) => {
        if (container.querySelector('.image-download-btn')) return;

        const button = createButton('🖼️', '#16b1c6', async () => {
            button.textContent = '⌛';
            const images = container.querySelectorAll('img');

            if (!images.length) {
                alert("No images found!");
                button.textContent = '✖️';
                return;
            }

            const imageUrls = Array.from(images).map(img => img.src);
            const uniqueUrls = [...new Set(imageUrls)];

            const downloadAsZip = await promptUserForZipOrIndividual();

            if (downloadAsZip) {
                const zip = new JSZip();
                let count = 0;
                uniqueUrls.forEach((url, index) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        responseType: 'blob',
                        onload: (response) => {
                            zip.file(`image${index + 1}.jpeg`, response.response);
                            count++;
                            if (count === uniqueUrls.length) {
                                zip.generateAsync({ type: 'blob' }).then((content) => {
                                    const url = URL.createObjectURL(content);
                                    GM_download({ url, name: 'TikTok_Slideshow.zip' });
                                    button.textContent = '✔️';
                                });
                            }
                        }
                    });
                });
            } else {
                uniqueUrls.forEach((url, index) => {
                    GM_download({
                        url,
                        name: `image${index + 1}.jpeg`,
                        onload: () => {
                            button.textContent = '✔️';
                        }
                    });
                });
            }
        });

        container.style.position = 'relative';
        container.appendChild(button);
    };

    const checkForImageSlideshows = () => {
        document.querySelectorAll('div[class*="DivPhotoVideoContainer"]:not(.processed)').forEach((container) => {
            container.classList.add('processed');
            addImageDownloadButton(container);
        });
    };

    new MutationObserver(checkForImageSlideshows).observe(document.body, { childList: true, subtree: true });

    new MutationObserver(() => {
        document.querySelectorAll('video:not(.processed)').forEach((video) => {
            video.classList.add('processed');
            manageDownloadButtons(video);
        });
    }).observe(document.body, { childList: true, subtree: true });

})();
