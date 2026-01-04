// ==UserScript==
// @name         IEEE Paper Downloader
// @namespace    https://ieeexplore.ieee.org/
// @version      1.2
// @description  IEEE Paper Downloader is a Greasemonkey script that enables batch downloading of papers. It bypasses the IEEE Xplore's limit on downloading up to 10 papers at a time, allowing you to download more than 10 papers in one go.
// @author       OccDeser
// @match        https://ieeexplore.ieee.org/*/proceeding*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477452/IEEE%20Paper%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/477452/IEEE%20Paper%20Downloader.meta.js
// ==/UserScript==

const DOWNLOAD_INTERVAL = 1000; // Download interval in milliseconds

const CSS = `
.paper-downloader {
    margin-left: 15px;
    margin-right: 15px;
    padding-top: 15px;
    padding-bottom: 15px;
    background-color: #f5f5f5;
}

.paper-downloader span {
    padding: 5px;
}

.ipd-modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Gray background with 50% transparency */
    display: flex;
    justify-content: center; /* Horizontal centering */
    align-items: center; /* Vertical centering */
    z-index: 999; /* Place modal on top */
    flex-direction: column;
}

.ipd-modal-body {
    width: 75%;
    padding: 20px;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.ipd-modal-content {
    height: 450px;
    overflow-y: auto;
}
`

const HTML = `
<div class="paper-downloader">
<span>
    <xpl-conference-toc-dashboard>
        <strong class="text-base-md-lh">
            IEEE Paper Downloader
        </strong>
    </xpl-conference-toc-dashboard>
</span>
<span>
    <xpl-conference-toc-dashboard>
        <strong class="text-base-md-lh" id="ipd-strong-countdown">
        </strong>
    </xpl-conference-toc-dashboard>
</span>
<span>
<xpl-export-search-results>
    <button class="xpl-toggle-btn" id="ipd-button-showall">
        <a class="text-white">
            Show All
        </a>
    </button>
</xpl-export-search-results>
</span>
<span>
<xpl-export-search-results>
    <button class="xpl-toggle-btn" id="ipd-button-select">
        <a class="text-white">
            Select
        </a>
    </button>
</xpl-export-search-results>
</span>
<span>
<xpl-export-search-results>
    <button class="xpl-toggle-btn" id="ipd-button-download">
        <a class="text-white">
            Download
        </a>
    </button>
</xpl-export-search-results>
</span>
</div>
`

var allPapers = {};
var selectedPapers = {};

const createModal = (content, onClose) => {
    const modalHtml = `
        <div class="ipd-modal-background">
            <div class="ipd-modal-body">
                <div class="ipd-modal-content">
                    ${content}
                </div>
                <xpl-export-search-results>
                    <button class="xpl-toggle-btn" id="ipd-modal-close">
                        <a class="text-white">Close</a>
                    </button>
                </xpl-export-search-results>
            </div>
        </div>
    `

    let modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    document.body.appendChild(modalElement);

    // Bind listener
    let modalCloseButton = document.getElementById('ipd-modal-close');
    modalCloseButton.addEventListener('click', () => {
        modalElement.remove();
        onClose();
    });
}

const downloadPapers = () => {
    const downloadLinks = [];
    for (let id in selectedPapers) {
        if (selectedPapers[id]) {
            let url = new URL("https://ieeexplore.ieee.org" + allPapers[id].href);
            const arnumber = url.searchParams.get('arnumber');
            downloadLinks.push(`https://ieeexplore.ieee.org/stampPDF/getPDF.jsp?tp=&arnumber=${arnumber}&isBulkDownload=true`);
        }
    }
    console.log(downloadLinks);

    // Show download progress
    createModal(
        '<div id="ipd-modal-progress"></div>',
        () => {
            console.log('Modal closed');
        }
    );

    let progress = document.getElementById('ipd-modal-progress');
    let progressCounter = 0;

    const progressInfo = (message) => {
        let messageBox = document.createElement('div');
        messageBox.innerHTML = message;
        messageBox.style = "margin-bottom: 5px;";
        progress.insertBefore(messageBox, progress.firstChild);
    }

    const progressTop = (message) => {
        let topMessageBox = document.getElementById('ipd-modal-progress-top');
        if (topMessageBox) {
            topMessageBox.remove();
        }

        let messageBox = document.createElement('div');
        messageBox.id = 'ipd-modal-progress-top';
        messageBox.innerHTML = message;
        messageBox.style = "margin-bottom: 5px; font-weight: bold;";
        progress.insertBefore(messageBox, progress.firstChild);
    }
    progressInfo(`Downloading ${downloadLinks.length} papers...`);

    // Store downloaded content
    const downloadedContent = [];

    // Use GM_xmlhttpRequest to fetch link content
    const fetchContent = (url) => {
        let filename = new URL(url).searchParams.get('arnumber') + '.pdf';

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                onload: response => resolve(response.response),
                onerror: error => reject(error),
                onprogress: progressEvent => {
                    let size = progressEvent.loaded / 1024 / 1024;
                    progressTop(`${filename} Downloading: ${size.toFixed(2)}MB`);
                }
            });
        });
    }

    // Iterate through download links and fetch content
    const fetchAndDownload = async () => {
        for (const link of downloadLinks) {
            try {
                let filename = new URL(link).searchParams.get('arnumber') + '.pdf';
                const content = await fetchContent(link);
                downloadedContent.push({ filename: filename, content });
                progressCounter++;
                progressInfo(`[${progressCounter}/${downloadLinks.length}] Fetched content from: ${link}`);
                progressTop(`${filename} Downloaded, continuing in ${DOWNLOAD_INTERVAL / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, DOWNLOAD_INTERVAL));
            } catch (error) {
                console.error(`Error fetching content from link: ${error}`);
            }
        }

        // Compress all content into a single zip file and download
        const zip = new JSZip();
        for (const item of downloadedContent) {
            zip.file(item.filename, item.content);
        }

        zip.generateAsync({ type: 'blob' })
            .then(blob => {
                GM_download({
                    url: URL.createObjectURL(blob),
                    name: 'papers.zip'
                });
            });
    }

    fetchAndDownload();
}

const selectPapers = () => {
    const xpathExpression = '//div[@class="subid-container"]//xpl-access-type-icon/span[not(contains(@class, "locked"))]/../../../..';
    let paperResults = document.evaluate(xpathExpression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (paperResults.snapshotLength > 0) {
        let paperElement = paperResults.snapshotItem(0);
        let paperHref = paperElement.getElementsByTagName('xpl-view-pdf')[0].getElementsByTagName('a')[0].getAttribute('href');
        let paperTitle = paperElement.getElementsByTagName('h2')[0].textContent;
        let id = 0 + '-' + paperTitle.slice(0, 16) + '-' + paperHref.slice(-8);
        let first_id = Object.keys(allPapers).filter((key) => key.startsWith('0'))[0];

        // Check if the page has been updated
        if (Object.keys(allPapers).length !== paperResults.snapshotLength || id !== first_id) {
            allPapers = {};
            selectedPapers = {};
            for (let i = 0; i < paperResults.snapshotLength; i++) {
                let paperElement = paperResults.snapshotItem(i);
                let paperHref = paperElement.getElementsByTagName('xpl-view-pdf')[0].getElementsByTagName('a')[0].getAttribute('href');
                let paperTitle = paperElement.getElementsByTagName('h2')[0].textContent;
                let id = i + '-' + paperTitle.slice(0, 16) + '-' + paperHref.slice(-8);
                allPapers[id] = {
                    'title': paperTitle,
                    'href': paperHref,
                    'element': paperElement
                };
                selectedPapers[id] = true;
            }
        }
    }

    // Create modal
    createModal(
        '<form id="ipd-select-dynamic-form"></form>',
        () => {
            let counter = 0;
            for (let id in selectedPapers) {
                if (selectedPapers[id]) {
                    counter++;
                }
            }
            console.log(`Selected ${counter} papers`);
        }
    )

    // Create select form
    let dynamicForm = document.getElementById('ipd-select-dynamic-form');
    let items = []
    for (let id in allPapers) {
        items.push({ id, title: allPapers[id].title });
    }
    items.forEach(function (item, _) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = item.title;
        checkbox.value = item.id;
        checkbox.checked = selectedPapers[item.id];
        checkbox.addEventListener('change', function () {
            selectedPapers[checkbox.value] = checkbox.checked;
        });

        var label = document.createElement('label');
        label.appendChild(checkbox);

        var titleBox = document.createElement('span');
        titleBox.appendChild(document.createTextNode(item.title));
        titleBox.style = "margin-left: 5px;";
        label.appendChild(titleBox);

        var itemDiv = document.createElement('div');
        itemDiv.style = "margin-bottom: 5px;";
        itemDiv.appendChild(label);

        dynamicForm.appendChild(itemDiv);
    });
}

const showAll = () => {
    console.log("showAll");

    // Get the current rowsPerPage
    const url = new URL(window.location.href);
    const current_rows = eval(url.searchParams.get('rowsPerPage'))

    // Get the total number of rows
    const xpathExpression = "//span[contains(., 'Showing')]/span[2]/text()";
    const result = document.evaluate(xpathExpression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (result.snapshotLength == 0) {
        console.log("Cannot find total rows");
        return;
    }

    const total_rows = eval(result.snapshotItem(0).textContent);

    if (current_rows >= total_rows) {
        console.log("Already showing all");
        return;
    }

    url.searchParams.set('rowsPerPage', total_rows.toString());
    const modifiedURL = url.toString();
    window.location.href = modifiedURL;
}

const bindListener = () => {
    let buttonSelect = document.getElementById('ipd-button-select');
    let buttonDownload = document.getElementById('ipd-button-download');
    let buttonShowAll = document.getElementById('ipd-button-showall');

    buttonSelect.addEventListener('click', selectPapers);
    buttonDownload.addEventListener('click', downloadPapers);
    buttonShowAll.addEventListener('click', showAll);
}

(function () {
    'use strict';

    let mainElement = document.getElementById('xplMainContentLandmark');

    if (mainElement) {
        // Insert CSS codes
        let style = document.createElement('style');
        style.appendChild(document.createTextNode(CSS));
        document.head.appendChild(style);

        // Insert HTML codes
        let optionHeader = document.createElement('div');
        optionHeader.innerHTML = HTML;
        let firstChild = mainElement.firstChild;
        mainElement.insertBefore(optionHeader, firstChild);

        // Add event listener
        bindListener();

        // Set the countdown
        let timerCounter = 0;
        let countDownTimer = setInterval(() => {
            let countDownElement = document.getElementById('ipd-strong-countdown');
            timerCounter = timerCounter + 100;
            countDownElement.innerHTML = "Loading... " + timerCounter / 1000 + "s";
        }, 100);

        // Wait for loading
        const loadPapers = () => {
            const xpathExpression = '//div[@class="subid-container"]//xpl-access-type-icon/span[not(contains(@class, "locked"))]/../../../..';
            let paperResults = document.evaluate(xpathExpression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (paperResults.snapshotLength > 0) {
                clearInterval(countDownTimer);
                let countDownElement = document.getElementById('ipd-strong-countdown');
                countDownElement.innerHTML = "Loading complete!";
            } else {
                setTimeout(loadPapers, 100);
                return;
            }
        }
        setTimeout(loadPapers, 100);
    }
})();
