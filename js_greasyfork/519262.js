// ==UserScript==
// @name         GPT gallery downloader (GPTGD)
// @namespace    _pc
// @version      6.9
// @license      MIT
// @description  Creates a button to download all images from galleries & favorite photos in a single .zip file. Large collections are split into multiple zip files.
// @author       verydelight
// @match        https://www.gayporntube.com/user/*
// @match        https://www.gayporntube.com/galleries/*
// @connect      gayporntube.com
// @connect      media-1-albums.gayporntube.com
// @connect      media-2-albums.gayporntube.com
// @icon         https://www.gayporntube.com/favicon.ico
// @compatible   Firefox Tampermonkey
// @grant        GM.xmlHttpRequest
// @grant        GM.download
// @require      https://update.greasyfork.org/scripts/473358/1237031/JSZip.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/519262/GPT%20gallery%20downloader%20%28GPTGD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519262/GPT%20gallery%20downloader%20%28GPTGD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const enableDebugLog = false;

    console.log("GPTGD: Script is starting.");

    const profileHashPattern = /^#page.*-favorite_photos.*$/;

    const allImageUrls = new Set();
    const allAlbumUrls = new Set();
    const baseUrl = window.location.href.split('#')[0];
    let zip;

    let downloadStatus;
    let progressElement;
    let downloadButton;
    let totalImagesToDownload = 0;
    let imagesDownloadedOverall = 0;
    let mainPageRetryCount = 0;
    const maxRetries = 10;
    const CHUNK_SIZE = 50;
    const CHUNK_THRESHOLD = 75;

    const convertToFullSizeUrl = (url) => {
        const pattern1 = /\/thumbs/;
        const pattern2 = /\/main\/\d{1,4}x\d{1,4}/;
        return url.replace(pattern1, '').replace(pattern2, '/sources');
    };

    const extractAndStoreImages = (container) => {
        const anchors = container.querySelectorAll('a:has(img)');
        anchors.forEach((a) => {
            const img = a.querySelector('img');
            let imageUrl = img?.src;
            if (!imageUrl || imageUrl.startsWith('data:')) {
                imageUrl = img?.getAttribute('data-src');
            }
            if (imageUrl) {
                const fullSizeUrl = convertToFullSizeUrl(imageUrl);
                allImageUrls.add(fullSizeUrl);
            }
            const albumUrl = a.href;
            if (albumUrl) {
                allAlbumUrls.add(albumUrl);
            }
        });
    };

    const downloadFile = (url, filename, zipInstance) => {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                responseType: 'blob',
                url: url,
                headers: { "Accept": "image/*" },
                onload: (response) => {
                    const blob = response.response;
                    zipInstance.file(filename, blob, { binary: true });
                    resolve();
                },
                onerror: (err) => {
                    reject(err);
                }
            });
        });
    };

    // Try alternative formats when encountering .webp
    const tryAlternativeFormats = async (url, filenameBase, zipInstance) => {
        const extPriority = ["jpg", "jpeg", "png", "gif", "webp"];
        const urlWithoutExt = url.replace(/\.[^/.]+$/, "");
        for (const ext of extPriority) {
            const testUrl = `${urlWithoutExt}.${ext}`;
            const testFileName = `${filenameBase}.${ext}`;
            try {
                await downloadFile(testUrl, testFileName, zipInstance);
                return { success: true, filename: testFileName, finalUrl: testUrl };
            } catch (e) {
                if (enableDebugLog) console.log(`GPTGD: ${testUrl} failed, trying next format...`);
            }
        }
        return { success: false, filename: `${filenameBase}.webp`, finalUrl: url };
    };

    const scrapeAllPages = (totalPages, updateStatusCallback) => {
        return new Promise((resolve) => {
            let currentPage = 1;
            const processNextPage = () => {
                if (currentPage > totalPages) {
                    resolve();
                    return;
                }
                updateStatusCallback(`Processing page ${currentPage}/${totalPages}...`);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = `${baseUrl}#page${currentPage}-favorite_photos`;
                iframe.onload = () => {
                    let iframeRetryCount = 0;
                    const maxIframeRetries = 10;
                    const checkIframeContent = () => {
                        try {
                            const doc = iframe.contentDocument || iframe.contentWindow.document;
                            const imageContainer = doc.querySelector('#custom_fav_albums_images_fav_albums_images');
                            if (imageContainer) {
                                extractAndStoreImages(imageContainer);
                                iframe.remove();
                                currentPage++;
                                processNextPage();
                            } else if (iframeRetryCount < maxIframeRetries) {
                                iframeRetryCount++;
                                setTimeout(checkIframeContent, 500);
                            } else {
                                iframe.remove();
                                currentPage++;
                                processNextPage();
                            }
                        } catch (e) {
                            iframe.remove();
                            currentPage++;
                            processNextPage();
                        }
                    };
                    checkIframeContent();
                };
                document.body.appendChild(iframe);
            };
            processNextPage();
        });
    };

    const calculateTotalParts = (totalImages) => {
        if (totalImages <= CHUNK_THRESHOLD) return 1;
        let parts = 1;
        let imagesLeft = totalImages - CHUNK_SIZE;
        while (imagesLeft > 0) {
            if (imagesLeft > CHUNK_THRESHOLD) {
                parts++;
                imagesLeft -= CHUNK_SIZE;
            } else {
                parts++;
                imagesLeft = 0;
            }
        }
        return parts;
    };

    const processAndZipChunk = async (urls, albums, partNumber, totalParts, isSingleChunk) => {
        zip = new JSZip();
        const indexFileName = getZipFileName();
        const results = [];

        let downloadTime = 0;
        const totalInChunk = urls.length;
        const partText = isSingleChunk ? '' : `part ${partNumber}/${totalParts}: `;

        for (let i = 0; i < totalInChunk; i++) {
            const url = urls[i];
            const globalIndex = imagesDownloadedOverall + 1;
            const ext = url.split('.').pop().split('?')[0].toLowerCase();
            const fakeFileName = `${indexFileName}${globalIndex}.${ext}`;

            const downloadStart = Date.now();
            let success = true;
            let resultData;

            try {
                if (ext === "webp") {
                    resultData = await tryAlternativeFormats(url, `${indexFileName}${globalIndex}`, zip);
                    success = resultData.success;
                } else {
                    await downloadFile(url, fakeFileName, zip);
                    resultData = { success: true, filename: fakeFileName, finalUrl: url };
                }

                if (resultData.success) {
                    const downloadEnd = Date.now();
                    downloadTime += downloadEnd - downloadStart;
                    imagesDownloadedOverall++;

                    const overallProgressPercent = Math.round((imagesDownloadedOverall / totalImagesToDownload) * 100);
                    progressElement.setAttribute("value", overallProgressPercent);

                    const averageTimePerFile = downloadTime / (i + 1);
                    const downloadEstimate = Math.round((averageTimePerFile * (totalImagesToDownload - imagesDownloadedOverall)) / 1000);
                    const timeRemaining = downloadEstimate > 0 ? ` (ca.: ${formatTime(downloadEstimate)} remaining)` : '';
                    if (partText) {
                        downloadStatus.textContent = `Downloading ${partText}image ${i + 1}/${totalInChunk} [${imagesDownloadedOverall}/${totalImagesToDownload}] ${timeRemaining}`;
                    } else {
                        downloadStatus.textContent = `Downloading image ${i + 1}/${totalInChunk} ${timeRemaining}`;
                    }
                } else {
                    success = false;
                    downloadStatus.textContent = `Error downloading image ${globalIndex} (${i + 1} of current chunk). Skipping...`;
                }
            } catch (e) {
                success = false;
                console.error("GPTGD: Unexpected error: ", url, e);
            }

            results.push({
                filename: (resultData?.filename || fakeFileName) + (success ? "" : " [Failed to download]"),
                url: resultData?.finalUrl || url,
                album: albums[i]
            });
        }

        const lines = [];
        if (window.location.href.includes('/galleries/')) {
            const albumFullUrl = window.location.origin + window.location.pathname;
            lines.push(`Album link: ${albumFullUrl}`, "");
        }
        results.forEach(r => {
            lines.push(`Image: ${r.filename}`);
            lines.push(`Image URL: ${r.url}`);
            if (r.album !== undefined) {
                lines.push(`From album: ${r.album}`);
            }
            lines.push("");
        });
        const indexText = lines.join("\n");

        if (isSingleChunk) {
            zip.file(`${indexFileName} - index.txt`, indexText);
        } else {
            zip.file(`${indexFileName} - index_part${partNumber}.txt`, indexText);
        }

        downloadStatus.textContent = isSingleChunk ? `Downloaded. Zipping files...` : `Part ${partNumber}/${totalParts} downloaded. Zipping files...`;

        let finalZipFileName = getZipFileName();
        if (!isSingleChunk) {
            finalZipFileName += `_part${partNumber}`;
        }

        const content = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });
        saveAs(content, finalZipFileName);
        downloadStatus.textContent = isSingleChunk ? `Saved.` : `Part ${partNumber}/${totalParts} saved.`;
    };

    const startDownload = async () => {
        downloadStatus.textContent = "Starting to download images...";
        progressElement.style.display = "block";

        let imageUrls = Array.from(allImageUrls);
        let albumUrls = Array.from(allAlbumUrls);
        totalImagesToDownload = imageUrls.length;
        imagesDownloadedOverall = 0;

        const isSingleChunk = totalImagesToDownload <= CHUNK_THRESHOLD;
        const totalParts = calculateTotalParts(totalImagesToDownload);

        let partNumber = 1;
        while (imageUrls.length > 0) {
            let chunkSize;
            if (imageUrls.length > CHUNK_THRESHOLD) {
                chunkSize = CHUNK_SIZE;
            } else {
                chunkSize = imageUrls.length;
            }
            const imageChunk = imageUrls.splice(0, chunkSize);
            const albumChunk = albumUrls.splice(0, chunkSize);
            await processAndZipChunk(imageChunk, albumChunk, partNumber, totalParts, isSingleChunk);
            partNumber++;
        }

        downloadStatus.textContent = "All parts downloaded and saved!";
    };

    const getZipFileName = () => {
        if (window.location.href.includes('/galleries/')) {
            const zipFileName = document.querySelector('h1.title').innerText
                .replace(/[^a-zA-Z0-9-_ ]/g, '')
                .replace(/\s+/g, ' ')
                .substring(0, 235)
                .replace(/^_+|_+$/g, '')
                .trim();
            return `GPT Gallery - ${zipFileName}`;
        } else {
            const userOrGallery = window.location.pathname.split('/')[2];
            return `GPT Favorites - ${userOrGallery}`;
        }
    };

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = secs < 10 ? "0" + secs : secs;
        return minutes > 0 ? `${formattedMinutes}:${formattedSeconds} minutes` : `${formattedSeconds} seconds`;
    }

    const createDownloadUI = (container) => {
        const existingButton = document.querySelector('.gptgd-bttn');
        if (existingButton) existingButton.remove();

        downloadStatus = document.createElement("div");
        progressElement = document.createElement("progress");
        downloadButton = document.createElement("button");
        if (window.location.href.includes('/galleries/')) {
            downloadButton.textContent = "Download gallery";
        } else if (window.location.href.includes('/user/')){
            downloadButton.textContent = "Download favourites";
        }
        downloadButton.type = "button";
        downloadButton.classList.add('gptgd-bttn');
        downloadButton.style.cssText = "padding: 10px 20px; font-size: 16px; font-weight: bold; color: white; background-color: #007BFF; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;";

        progressElement.setAttribute("value", 0);
        progressElement.setAttribute("max", 100);
        progressElement.style.width = "100%";
        progressElement.style.height = "20px";
        progressElement.style.display = "none";

        downloadStatus.style.cssText = "margin-top: 10px; font-style: italic;";

        const h2 = container.querySelector('h2');
        const h1 = container.querySelector('h1');
        if (h2) {
            h2.insertAdjacentElement('afterend', downloadButton);
            downloadButton.insertAdjacentElement('afterend', downloadStatus);
            downloadStatus.insertAdjacentElement('afterend', progressElement);
        } else if (h1) {
            h1.insertAdjacentElement('afterend', downloadButton);
            downloadButton.insertAdjacentElement('afterend', downloadStatus);
            downloadStatus.insertAdjacentElement('afterend', progressElement);
        } else {
            container.prepend(downloadButton, downloadStatus, progressElement);
        }
    };

    const handleDOMChanges = () => {
        const isGalleryPage = window.location.href.includes('/galleries/');
        const isProfilePage = window.location.href.includes('/user/') && window.location.hash.match(profileHashPattern);

        let container = null;
        if (isGalleryPage) {
            container = document.querySelector('#album_view_album_view');
        } else if (isProfilePage) {
            container = document.querySelector('#custom_fav_albums_images_fav_albums_images');
        }

        if (container) {
            mainPageRetryCount = 0;
            const buttonExists = document.querySelector('.gptgd-bttn');
            if (!buttonExists) {
                allImageUrls.clear();
                createDownloadUI(container);
                downloadButton.addEventListener("click", async () => {
                    downloadButton.style.display = "none";
                    if (isGalleryPage) {
                        downloadStatus.textContent = "Processing images on current page...";
                        const images = document.querySelectorAll('#album_view_album_view > #tab5 img');
                        images.forEach((img) => {
                            let imageUrl = img.getAttribute('data-src');
                            if (imageUrl) {
                                const fullSizeUrl = convertToFullSizeUrl(imageUrl);
                                allImageUrls.add(fullSizeUrl);
                            }
                        });
                        startDownload();
                    } else if (isProfilePage) {
                        const paginationContainer = document.querySelector('#custom_fav_albums_images_fav_albums_images_pagination');
                        if (paginationContainer) {
                            const nextButton = paginationContainer.querySelector('li.next');
                            const lastPageLi = nextButton?.previousElementSibling;
                            const totalPages = parseInt(lastPageLi?.textContent.trim(), 10) || 1;
                            downloadStatus.textContent = `Processing page 1/${totalPages}...`;
                            await scrapeAllPages(totalPages, (status) => {
                                downloadStatus.textContent = status;
                            });
                        } else {
                            downloadStatus.textContent = `Processing images on current page...`;
                            extractAndStoreImages(container);
                        }
                        startDownload();
                    }
                });
            }
        } else if (mainPageRetryCount < maxRetries) {
            mainPageRetryCount++;
            setTimeout(handleDOMChanges, 500);
        } else {
            const existingButton = document.querySelector('.gptgd-bttn');
            if (existingButton) {
                existingButton.remove();
                if (downloadStatus) downloadStatus.remove();
                if (progressElement) progressElement.remove();
            }
        }
    };

    const observer = new MutationObserver(handleDOMChanges);
    observer.observe(document.body, { childList: true, subtree: true });

    handleDOMChanges();
})();