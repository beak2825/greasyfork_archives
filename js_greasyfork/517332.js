// ==UserScript==
// @name         OmegaScans Downloader
// @namespace    Add Download Button
// @version      1.0
// @description  Download Chapters from OmegaScans
// @author       TRxLEGION
// @license      MIT
// @match        https://omegascans.org/*
// @icon         https://omegascans.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/517332/OmegaScans%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/517332/OmegaScans%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getChapterNumber() {
        const url = window.location.href;
        const match = url.match(/chapter-(\d+)/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    function scrapeImages() {
        const imageUrls = [];
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            let url = img.dataset.src || img.src; 
            if (url && url.endsWith('.jpg')) {
                imageUrls.push(url);
            }
        });
        return imageUrls;
    }

    function downloadImagesAsCBZ(imageUrls) {
        const zip = new JSZip();
        let count = 0;
        imageUrls.forEach(url => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    const fileName = url.substring(url.lastIndexOf("/") + 1);
                    zip.file(fileName, response.response);
                    count++;
                    if (count === imageUrls.length) {
                        zip.generateAsync({ type: "blob" })
                            .then(function(content) {
                                const chapterNumber = getChapterNumber();
                                const filename = chapterNumber ? `chapter ${chapterNumber}.cbz` : 'chapter.cbz';
                                saveAs(content, filename);
                            });
                    }
                },
                onerror: function(error) {
                    console.error("Error downloading image: " + url, error);
                }
            });
        });
    }

    function addDownloadButton() {
        const button = document.createElement('button');
        button.classList.add('Btn');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" class="svgIcon">
                <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
            </svg>
            <span class="icon2"></span>
        `;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = 9999;
        button.style.cursor = 'pointer';
        button.style.border = 'none';

        button.onclick = function() {
            const originalIcon = button.innerHTML;
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner-icon">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="20" transform="rotate(90 12 12)">
                        <animate attributeName="stroke-dashoffset" values="60;0;60" dur="2s" keyTimes="0;0.5;1" repeatCount="indefinite"></animate>
                    </circle>
                </svg>
            `;
            button.style.transform = 'scale(0.9)'; 

            const imageUrls = scrapeImages();
            if (imageUrls.length > 0) {
                downloadImagesAsCBZ(imageUrls);
            } else {
                alert('No images found!');
            }

            setTimeout(() => {
                button.innerHTML = originalIcon; 
                button.style.transform = 'scale(1)'; 
            }, 2000); 
        };

        if (!document.querySelector('#download-button')) {
            button.id = 'download-button';
            document.body.appendChild(button);
        }
    }

    window.addEventListener('load', function() {
        addDownloadButton();
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addDownloadButton();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .Btn {
            width: 50px;
            height: 50px;
            border: 2px solid rgb(214, 214, 214);
            border-radius: 15px;
            background-color: rgb(255, 255, 255);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition-duration: 0.3s;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.11);
        }

        .svgIcon {
            fill: rgb(70, 70, 70);
        }

        .icon2 {
            width: 18px;
            height: 5px;
            border-bottom: 2px solid rgb(70, 70, 70);
            border-left: 2px solid rgb(70, 70, 70);
            border-right: 2px solid rgb(70, 70, 70);
        }

        .Btn:hover {
            background-color: rgb(51, 51, 51);
            transition-duration: 0.3s;
        }

        .Btn:hover .icon2 {
            border-bottom: 2px solid rgb(235, 235, 235);
            border-left: 2px solid rgb(235, 235, 235);
            border-right: 2px solid rgb(235, 235, 235);
        }

        .Btn:hover .svgIcon {
            fill: rgb(255, 255, 255);
            animation: slide-in-top 1s linear infinite;
        }

        @keyframes slide-in-top {
            0% {
                transform: translateY(-10px);
                opacity: 0;
            }

            100% {
                transform: translateY(0px);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

})();