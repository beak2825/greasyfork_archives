// ==UserScript==
// @name            Civitai Text Downloader Mod
// @name:ja         Civitai Text Downloader Mod
// @namespace       http://tampermonkey.net/
// @version         5.3.7
// @description     Click Download button will download the file and save the JSON and images at the same time. Also add a button to download JSON and images under details.
// @description:ja  Downloadボタンをクリックするとファイルのダウンロードと同時にJSONと画像が保存されます。また、Detailsの下にJSONと画像をダウンロードするボタンを追加します。
// @author          Takenoko3333
// @match           https://civitai.com/*
// @match           https://civitai.green/*
// @icon            https://civitai.com/favicon.ico
// @grant           GM.addStyle
// @grant           GM.xmlHttpRequest
// @connect         civitai.com
// @connect         civitai.green
// @license         BSD
// @downloadURL https://update.greasyfork.org/scripts/501321/Civitai%20Text%20Downloader%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/501321/Civitai%20Text%20Downloader%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM.addStyle(`.ctd-button:not([data-disabled]) {color: #ffff00;}`);
    GM.addStyle(`a[data-tour="model:download"] {color: #ffff00;}`);

    const CTD_SELECTOR = 'main a[data-tour="model:download"], .json-image-download-button, .mantine-Accordion-panel .mantine-Button-root';
    let file_id = null;
    let category = "";

    // Processing by Browser
    if (typeof MutationObserver !== 'undefined') {
        let lastUrl = location.href;
        let observerTriggered = false;
        const observer = new MutationObserver((mutations) => {
            if (lastUrl !== location.href) {
                lastUrl = location.href;
                observerTriggered = true;
                const interval = setInterval(function() {
                    setupDownload();
                    if (file_id || category != "models" ) {
                        clearInterval(interval);
                    }
                }, 200);
            }
        });
        const config = { subtree: true, childList: true };
        observer.observe(document, config);
        // URL change not detected (initial access)
        setTimeout(() => {
            if (!observerTriggered) {
                if (isFirefox()) {
                    setupDownloadForFirefox();
                } else {
                    setupDownload();
                }
            }
        }, 0);
    } else {
        // MutationObserver is not supported
        setInterval(function(){
            setupDownload();
        }, 500);
    }

    // Process to prevent multiple download executions of the same click
    let ctdLastClickAt = 0;
    let ctdLastClickKey = '';

    document.addEventListener('click', (ev) => {
        const btn = ev.target.closest(CTD_SELECTOR);
        if (!btn) return;

        // Skip if the same element has been processed within the last 500ms
        const now = Date.now();
        const key = btn;
        if (key === ctdLastClickKey && (now - ctdLastClickAt) < 500) return;
        ctdLastClickKey = key;
        ctdLastClickAt = now;

        // Do not preventDefault here (official download behavior is maintained)
        // Only save JSON & images Additional Execution
        try {
            jsonAndImageDownload();
        } catch (e) {
            console.error('CTD error:', e);
        }
    }, /* useCapture = */ true); // Performed only once early


    function isFirefox() {
        const isFirefoxBrowser = typeof InstallTrigger !== 'undefined';
        return isFirefoxBrowser;
    }

    function setupDownloadForFirefox() {
        let counter = 0;
        const interval = setInterval(function() {
            setupDownload();
            counter++;
            if (category != "models" || counter >= 3) {
                clearInterval(interval);
            }
        }, 500);
    }

    function createButton() {
        const newElement = document.createElement('a');
        newElement.className = 'json-image-download-button';
        newElement.type = 'button';
        newElement.setAttribute('data-button', 'true');
        newElement.style.display = 'inline-block';
        newElement.style.marginTop = '8px';
        newElement.style.cursor = 'pointer';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'mantine-3xbgk5 mantine-Button-inner';

        const innerSpan = document.createElement('span');
        innerSpan.className = 'mantine-qo1k2 mantine-Button-label';
        innerSpan.textContent = 'JSON and Image Download';

        const outerDiv = document.createElement('div');
        outerDiv.className = 'json-image-download-button-outer';

        innerDiv.appendChild(innerSpan);
        newElement.appendChild(innerDiv);
        outerDiv.appendChild(newElement);

        const tableElement = document.querySelector('table');
        let currentElement = tableElement;
        while (currentElement && !currentElement.classList.contains('mantine-Accordion-item')) {
            currentElement = currentElement.parentElement;
        }
        if (currentElement) {
            currentElement.insertAdjacentElement('afterend', outerDiv);
        }
    }

    function setupDownload() {
        file_id = null
        category = location.pathname.split("/")[1];
        if (category != "models") return;

        const codeElements = document.querySelectorAll('table code');
        codeElements.forEach((element, index) => {
            if (element.textContent === '@') {
                if (codeElements[index + 1]) {
                    file_id = codeElements[index + 1].textContent;
                }
            }
        });

        const jsonImageDownloadButton = document.querySelector('.json-image-download-button');
        if (file_id && !jsonImageDownloadButton) createButton();

        document.querySelectorAll(CTD_SELECTOR).forEach(button => {
            if (file_id && !jsonImageDownloadButton) button.classList.add("ctd-button");
        });
    }

    function jsonAndImageDownload() {
        if (category !== "models" || !file_id) return;

        const modelName = document.querySelector('main h1')?.textContent || '';
        const spanElements = document.querySelectorAll('table span');
        let strength = null;
        let _id = location.pathname.split("/")[2];

        spanElements.forEach((element) => {
            if (/^Strength:/.test(element.textContent)) {
                strength = element.textContent.split(":")[1].trim();
            }
        });

        GM.xmlHttpRequest({
            method: "GET",
            url: location.origin + "/api/v1/models/" + _id,
            onload: function(response) {
                let j = JSON.parse(response.responseText);
                let file = j.modelVersions.find(x => x.id == file_id);
                let link = document.createElement('a');
                let text = {
                    "description": "",
                    "model name": modelName,
                    "model url": document.URL,
                    "base model": file.baseModel,
                    "sd version": "Unknown",
                    "activation text": "",
                    "preferred weight": 0,
                    "notes": document.URL + "\nModel name: " + modelName + "\nBase model: " + file.baseModel
                };

                if (/^SD 1/.test(file.baseModel)) {
                    text["sd version"] = "SD1";
                } else if (/^SD 2/.test(file.baseModel)) {
                    text["sd version"] = "SD2";
                } else if (/^SDXL/.test(file.baseModel) || /^Pony/.test(file.baseModel)) {
                    text["sd version"] = "SDXL";
                } else if (/^SD 3/.test(file.baseModel)) {
                    text["sd version"] = "SD3";
                }

                if (j.description && j.description.textContent) {
                    text.description = j.description.textContent;
                }
                if (file.trainedWords) {
                    text["activation text"] = file.trainedWords.join(" ");
                }
                if (strength) {
                    text["preferred weight"] = strength;
                }

                const blobText = [JSON.stringify(text)];
                link.href = window.URL.createObjectURL(new Blob(blobText));
                let filename = (file.files.find(x => x)?.name || (file_id + ".json")).replace(/\.[a-z]*$/, ".json");
                link.download = filename;
                link.click();

                let image = file.images.find(x => x.type === 'image');
                if (image) {
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: image.url,
                        responseType: "blob",
                        onload: function (resp) {
                            let dlLink = document.createElement("a");
                            const dataUrl = URL.createObjectURL(resp.response);
                            dlLink.href = dataUrl;
                            let suffix = "." + image.url.slice(image.url.lastIndexOf('.') + 1).toLowerCase();
                            if (suffix === ".jpeg") suffix = ".jpg";
                            dlLink.download = filename.replace(".json", suffix);
                            document.body.insertAdjacentElement("beforeEnd", dlLink);
                            dlLink.click();
                            dlLink.remove();
                            setTimeout(() => URL.revokeObjectURL(dataUrl), 1000);
                        }
                    });
                }
            }
        });
    }
})();