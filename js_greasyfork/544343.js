// ==UserScript==
// @name          Gofile Download Bypass
// @namespace     http://tampermonkey.net/
// @version       1.5.1
// @description   Unlimited Download for Files and Folders on Gofile.io without quota
// @author        NoOne
// @license       MIT
// @match         https://gofile.io/d/*
// @match         https://gofile-bypass.cybar.to/*
// @icon          https://www.google.com/s2/favicons?domain=gofile.io
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/544343/Gofile%20Download%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/544343/Gofile%20Download%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const bypassBase = "https://gf.1drv.eu.org/";
    const folderExtractorBase = "https://gofile-bypass.cybar.to/";

    let jsonData = null;
    let linksExtracted = false;
    let buttonInserted = false;
    let isFolder = false;
    let currentContentId = null;

    function getContentId() {
        const match = window.location.pathname.match(/\/d\/(\w+)/);
        return match && match[1] ? match[1] : null;
    }

    function startDownload(link) {
        const a = document.createElement("a");
        a.href = link;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function copyAllLinks(btn) {
        const urlArea = document.getElementById('extractedUrls');
        if (!urlArea) {
            console.error('Textarea #extractedUrls not found.');
            return;
        }

        const links = urlArea.value.trim();

        if (links.length === 0) {
            alert("No links found to copy.");
            return;
        }

        navigator.clipboard.writeText(links).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy links.');
        });
    }

    function downloadAllLinks() {
        const urlArea = document.getElementById('extractedUrls');
        if (!urlArea) {
            alert("Please wait for the links to be extracted and converted.");
            return;
        }

        const links = urlArea.value.split('\n')
                                  .map(link => link.trim())
                                  .filter(link => link.length > 0);

        if (links.length === 0) {
            alert("No links found to download.");
            return;
        }

        if (!confirm(`You are about to start ${links.length} downloads. Continue? (Your browser might require permissions)`)) {
            return;
        }

        let index = 0;
        function nextDownload() {
            if (index < links.length) {
                const link = links[index];
                startDownload(link);
                console.log(`Starting download ${index + 1}/${links.length}: ${link}`);
                index++;
                setTimeout(nextDownload, 500);
            } else {
                console.log('All downloads initiated.');
            }
        }

        nextDownload();
    }


    function showPopup(link) {
        const popup = document.createElement("div");
        Object.assign(popup.style, {
             position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
             zIndex: "9999", background: "#1e1e2f", padding: "20px", border: "2px solid #5af",
             color: "#fff", borderRadius: "10px", width: "400px", textAlign: "center",
             boxShadow: "0 0 15px rgba(0,0,0,0.5)"
        });

        const close = document.createElement("span");
        close.innerHTML = "&times;";
        Object.assign(close.style, {
             position: "absolute", top: "5px", right: "10px", cursor: "pointer", fontSize: "20px"
        });
        close.onclick = () => popup.remove();
        popup.appendChild(close);

        const title = document.createElement("h3");
        title.innerHTML = '<i class="fa-solid fa-link"></i> Bypass Link';
        title.style.marginBottom = "15px";
        popup.appendChild(title);

        const linkElem = document.createElement("input");
        linkElem.type = "text";
        linkElem.value = link;
        linkElem.readOnly = true;
        Object.assign(linkElem.style, {
             width: "100%", marginBottom: "15px", padding: "8px", borderRadius: "5px",
             border: "1px solid #444", background: "#2e2e4f", color: "#6cf", textAlign: "center"
        });
        popup.appendChild(linkElem);

        const copyBtn = document.createElement("button");
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Link';
        copyBtn.className = "bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2";
        copyBtn.onclick = () => {
             navigator.clipboard.writeText(link).then(() => {
                 copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
                 setTimeout(() => copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Link', 2000);
             });
        };
        popup.appendChild(copyBtn);

        document.body.appendChild(popup);
    }

    function removeExistingButtons() {
        const container = document.querySelector("#index_accounts");
        if (!container) return;
        const targetButton = container.querySelector(".index_addAccount");
        if (!targetButton) return;

        let next = targetButton.nextElementSibling;
        while (next && next.tagName === 'BUTTON') {
            const temp = next.nextElementSibling;
            next.remove();
            next = temp;
        }
    }

    const originalConsoleLog = console.log;

    const captureConsoleLog = function(...args) {
        originalConsoleLog.apply(console, args);

        if (linksExtracted) return;

        args.forEach(arg => {
            if (typeof arg === 'object' && arg.status === 'ok' && arg.data && arg.data.children) {
                jsonData = arg;
                linksExtracted = true;

                const childrenCount = Object.keys(arg.data.children).length;

                isFolder = false;
                if (childrenCount > 1) {
                    isFolder = true;
                } else if (childrenCount === 1) {
                    const singleChild = Object.values(arg.data.children)[0];
                    if (singleChild.type === 'folder') {
                        isFolder = true;
                    }
                }

                insertConditionalButtons();
            }
        });
    };

    console.log = captureConsoleLog;

    function insertConditionalButtons() {
        if (buttonInserted) return;

        const container = document.querySelector("#index_accounts");
        if (!container) return;

        const targetButton = container.querySelector(".index_addAccount");
        if (!targetButton) return;

        const id = getContentId();
        if (!id) return;

        removeExistingButtons();
        buttonInserted = true;

        if (isFolder) {
            const btnFolder = document.createElement("button");
            btnFolder.innerHTML = '<i class="fa-solid fa-folder-open"></i> Extract Folder';
            btnFolder.title = "Open and auto-extract in the folder tool";
            btnFolder.className = "mt-2 flex items-center justify-center gap-2 p-2 text-white bg-purple-600 hover:bg-purple-700 rounded w-full";
            btnFolder.onclick = () => {
                window.open(folderExtractorBase + "?autoId=" + id, '_blank');
            };
            targetButton.insertAdjacentElement('afterend', btnFolder);
        } else {
            const btnDownload = document.createElement("button");
            btnDownload.innerHTML = '<i class="fa-solid fa-download"></i> Download';
            btnDownload.className = "mt-2 flex items-center justify-center gap-2 p-2 text-white bg-green-600 hover:bg-green-700 rounded w-full";
            btnDownload.onclick = () => startDownload(bypassBase + id);

            const btnShow = document.createElement("button");
            btnShow.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Show Link';
            btnShow.className = "mt-2 flex items-center justify-center gap-2 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded w-full";
            btnShow.onclick = () => showPopup(bypassBase + id);

            targetButton.insertAdjacentElement('afterend', btnDownload);
            btnDownload.insertAdjacentElement('afterend', btnShow);
        }
    }

    function clickGofileRefresh() {
        const refreshButton = document.getElementById('filemanager_mainbuttons_refresh');
        if (refreshButton) {
            refreshButton.click();
            console.log('Simulated Gofile Refresh button click.');
            return true;
        }
        return false;
    }

    function watchUrlChanges() {
        const newId = getContentId();

        if (newId && newId !== currentContentId) {
            console.log(`Content ID changed from ${currentContentId} to ${newId}. Re-scanning.`);
            currentContentId = newId;
            linksExtracted = false;
            buttonInserted = false;
            removeExistingButtons();

            clickGofileRefresh();

            const waitForAPI = setInterval(() => {
                if (linksExtracted) {
                    clearInterval(waitForAPI);
                } else {
                    clickGofileRefresh();
                }
            }, 1000);
        }
    }

    if (window.location.hostname.includes("gofile.io")) {
        currentContentId = getContentId();
        setInterval(watchUrlChanges, 500);
    }

    function handleCybar() {
        const urlParams = new URLSearchParams(window.location.search);
        const autoId = urlParams.get('autoId');

        if (!autoId) {
            insertDownloadAndCopyButtons();
            return;
        }

        const waitForElements = setInterval(() => {
            const tabButton = document.querySelector('.tab[data-tab="album"]');
            const inputField = document.getElementById('folderId');
            const submitButton = document.getElementById('getFilesButton');

            if (tabButton && inputField && submitButton) {
                clearInterval(waitForElements);

                tabButton.click();

                setTimeout(() => {
                    inputField.value = autoId;
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    submitButton.click();

                    setTimeout(insertDownloadAndCopyButtons, 1500);

                }, 300);
            }
        }, 500);
    }

    function insertDownloadAndCopyButtons() {
        const urlArea = document.getElementById('extractedUrls');
        if (!urlArea) return;

        const existingContainer = document.getElementById('cybarActionButtons');
        if (existingContainer) existingContainer.remove();

        const buttonContainer = document.createElement("div");
        buttonContainer.id = "cybarActionButtons";
        Object.assign(buttonContainer.style, {
            marginTop: '8px',
            display: 'flex',
            gap: '10px'
        });

        const downloadButton = document.createElement("button");
        downloadButton.id = "downloadAllCybarBtn";
        downloadButton.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Download';
        downloadButton.title = "Download all extracted links sequentially";
        downloadButton.className = "btn";
        Object.assign(downloadButton.style, {
            flexGrow: '1',
            flexBasis: '50%',
            backgroundColor: '#198754',
            color: 'white'
        });

        downloadButton.onclick = downloadAllLinks;

        const copyButton = document.createElement("button");
        copyButton.id = "copyAllCybarBtn";
        copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
        copyButton.title = "Copy all extracted links to clipboard";
        copyButton.className = "btn";
        Object.assign(copyButton.style, {
            flexGrow: '1',
            flexBasis: '50%',
            backgroundColor: '#0d6efd',
            color: 'white'
        });

        copyButton.onclick = () => copyAllLinks(copyButton);

        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(copyButton);

        urlArea.insertAdjacentElement('afterend', buttonContainer);
    }

    if (window.location.hostname.includes("gofile.io")) {
    } else if (window.location.hostname.includes("cybar.to")) {
        handleCybar();
    }
})();