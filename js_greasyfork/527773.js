// ==UserScript==
// @name         Web-Ace Chapter Downloader
// @name:ja      Web-Ace チャプターダウンローダー
// @namespace    https://ceavan.com/
// @version      1.3
// @description  Download chapters from Web-Ace
// @description:ja  Web-Aceから章をダウンロード
// @author       ceavan
// @icon         https://appfav.net/image/thum_icon1/20200311105141474179OW21flGbBw.jpg
// @license MIT
// @match        https://web-ace.jp/*/episode/*/
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/527773/Web-Ace%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527773/Web-Ace%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load settings
    function loadSettings() {
        return {
            useCBZ: GM_getValue("useCBZ", false),
            includeChapterTitle: GM_getValue("includeChapterTitle", true),
        };
    }
    let { useCBZ, includeChapterTitle } = loadSettings();
    let menuIDs = [];

    // Function to save settings and refresh menu
    function updateSetting(key, value) {
        GM_setValue(key, value);
        ({ useCBZ, includeChapterTitle } = loadSettings());
        registerMenuCommands();
    }

    // Function to create and show a progress bar
    function createProgressBar() {
        let progressContainer = document.createElement("div");
        progressContainer.id = "progress-container";
        progressContainer.style.position = "fixed";
        progressContainer.style.bottom = "80px";
        progressContainer.style.right = "10px";
        progressContainer.style.width = "300px";
        progressContainer.style.height = "40px";
        progressContainer.style.border = "1px solid #000";
        progressContainer.style.background = "#ddd";
        progressContainer.style.zIndex = 1000;
        progressContainer.style.display = "flex";
        progressContainer.style.alignItems = "center";
        progressContainer.style.justifyContent = "center";
        progressContainer.style.fontSize = "20px";
        progressContainer.style.fontWeight = "bold";
        progressContainer.style.color = "#000";
        progressContainer.style.overflow = "hidden";
        progressContainer.style.textAlign = "center";

        let progressBar = document.createElement("div");
        progressBar.id = "progress-bar";
        progressBar.style.height = "100%";
        progressBar.style.width = "0%";
        progressBar.style.background = "#4caf50";
        progressBar.style.position = "absolute";
        progressBar.style.top = "0";
        progressBar.style.left = "0";
        progressBar.style.transition = "width 0.3s ease";

        let progressText = document.createElement("div");
        progressText.id = "progress-text";
        progressText.style.position = "absolute";
        progressText.style.width = "100%";
        progressText.style.textAlign = "center";
        progressText.style.fontSize = "20px";
        progressText.style.fontWeight = "bold";
        progressText.style.zIndex = "10";
        progressText.style.whiteSpace = "pre-line";

        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        document.body.appendChild(progressContainer);
    }

    // Function to update the progress bar
    function updateProgress(current, total) {
        let progressBar = document.getElementById("progress-bar");
        let progressText = document.getElementById("progress-text");
        if (progressBar && progressText) {
            let percent = Math.round((current / total) * 100);
            progressBar.style.width = percent + "%";
            progressText.innerText = `${current} / ${total}`;
        }
    }

    // Function to update the final progress text when ZIP is being saved
    function updateSavingText(total) {
        let progressText = document.getElementById("progress-text");
        if (progressText) {
            progressText.innerText = `Saving ZIP...`;
        }
    }

    // Function to update the final status after ZIP is saved
    function updateCompletedText() {
        let progressText = document.getElementById("progress-text");
        let downloadButton = document.getElementById("download-chapter-button");

        if (progressText) {
            progressText.innerText = "Chapter downloaded";
        }

        if (downloadButton) {
            setTimeout(() => {
                downloadButton.innerText = "Chapter Downloaded";
            }, 2000); // Reset button after 2 seconds
        }

        setTimeout(() => {
            let progressContainer = document.getElementById("progress-container");
            if (progressContainer) progressContainer.remove();
        }, 2000); // Remove after 2 seconds
    }

    // Function to extract the chapter title from <p class="watitle">
    function getChapterTitle() {
        let titleElement = document.querySelector("p.watitle");
        return titleElement ? titleElement.innerText.trim() : "";
    }

    // Function to download images and pack them into a zip file
    function downloadImages(imageUrls) {
        const zip = new JSZip();
        let totalImages = imageUrls.length;
        let padLength = totalImages.toString().length;
        let downloadCount = 0;

        createProgressBar();

        imageUrls.forEach((url, index) => {
            let fileNumber = String(index + 1).padStart(padLength, '0');
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    zip.file(`${fileNumber}.jpg`, response.response, { binary: true });
                    downloadCount++;
                    updateProgress(downloadCount, totalImages);

                    if (downloadCount === totalImages) {
                        updateSavingText(totalImages);
                        let title = document.title.split('｜')[0].trim();
                        let chapterTitle = includeChapterTitle ? getChapterTitle() : "";

                        // Append chapter title if it exists
                        let finalFileName = chapterTitle ? `${title} - ${chapterTitle}` : title;

                        // Determine the extension based on CBZ or ZIP preference
                        let fileExtension = useCBZ ? "cbz" : "zip";
                        finalFileName = `${finalFileName}.${fileExtension}`;

                        zip.generateAsync({ type: "blob" }).then(function(content) {
                            saveAs(content, finalFileName);
                            updateCompletedText();
                        });
                    }
                },
                onerror: function(error) {
                    console.error('Failed to download image:', error);
                }
            });
        });
    }

    // Function to get image URLs from JSON endpoint
    function getImageUrls(jsonUrl) {
        GM_xmlhttpRequest({
            method: "GET",
            url: jsonUrl,
            onload: function(response) {
                const imageUrls = JSON.parse(response.responseText);
                downloadImages(imageUrls);
            },
            onerror: function(error) {
                console.error('Failed to fetch image URLs:', error);
            }
        });
    }

    // Add download button to the page
    const button = document.createElement("button");
    button.id = "download-chapter-button";
    button.innerHTML = "Download Chapter";
    button.style.position = "fixed";
    button.style.bottom = "40px";
    button.style.right = "50px";
    button.style.fontSize= "20px";
    button.style.zIndex = 1000;
    button.onclick = function() {
        button.innerText = "Downloading chapter...";
        button.disabled = true;

        const chapterUrl = window.location.href;
        const jsonUrl = chapterUrl + 'json/';
        getImageUrls(jsonUrl);
    };
    document.body.appendChild(button);

    // Function to register or refresh menu commands
    function registerMenuCommands() {
        // Unregister old menu commands
        menuIDs.forEach(id => GM_unregisterMenuCommand(id));
        menuIDs = []; // Reset stored command IDs

        // Register new menu commands
        menuIDs.push(GM_registerMenuCommand(
            `${useCBZ ? "✅" : "❌"} Save as CBZ`,
            () => {
                updateSetting("useCBZ", !useCBZ);
            }
        ));

        menuIDs.push(GM_registerMenuCommand(
            `${includeChapterTitle ? "✅" : "❌"} Include chapter title in filename`,
            () => {
                updateSetting("includeChapterTitle", !includeChapterTitle);
            }
        ));
    }

    // Register menu commands on script load
    registerMenuCommands();
})();