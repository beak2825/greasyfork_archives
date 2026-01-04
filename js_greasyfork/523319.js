// ==UserScript==
// @name        theworldwatch downloader
// @namespace   Violentmonkey Scripts
// @match       *://theworldwatch.com/*
// @match       *://*.theworldwatch.com/*
// @grant       GM.xmlHttpRequest
// @grant       GM_addElement
// @grant       GM_addStyle
// @grant       GM_download
// @grant       GM_openInTab
// @grant       GM_log
// @version     2.6
// @author      https://greasyfork.org/en/users/1409235-paywalldespiser
// @description Video downloader for theworldwatch.com
// @license     MIT
// @require     https://update.greasyfork.org/scripts/523012/1516081/WaitForKeyElement.js
// @require     https://update.greasyfork.org/scripts/523457/1518908/GM_DL.js
// @require     https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @connect     theworldwatch.com
// @connect     cdn.theworldwatch.com
// @downloadURL https://update.greasyfork.org/scripts/523319/theworldwatch%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523319/theworldwatch%20downloader.meta.js
// ==/UserScript==

/**
 * Gets filename from theworldwatch.com video URL
 *
 * @param {string} url
 * @returns {string}
 */
function getFilenameFromURL(url) {
    const title = document.title;
    for (const [, videoURL] of url.matchAll(/\/get_file\/.*\/(.*?)\.mp4/gm)) {
        if (videoURL) {
            return `${title} [${videoURL}].mp4`;
        }
    }

    return `${title}.mp4`;
}

(function () {
    GM_addStyle(`
    .loader {
        border: 0.25em solid #f3f3f3;
        border-top: 0.25em solid rgba(0, 0, 0, 0);
        border-radius: 50%;
        width: 1em;
        height: 1em;
        animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
    
        100% {
            transform: rotate(360deg);
        }
    }
    
    .kt-player .fp-controls .fp-download {
        display: inline-flex;
        float: right;
        height: 100%;
        justify-content: center;
        align-items: center;
        margin: 2px 4px 4px 10px;
    }
    `);
    waitForKeyElement('.player video').then((video) => {
        const fullScreenButton = video.nextElementSibling.querySelector(
            '.fp-controls > .fp-screen'
        );
        const downloadButtonContainer = GM_addElement('div');
        downloadButtonContainer.classList.add('fp-download');

        const downloadButton = GM_addElement('a');
        downloadButton.style.fontSize = '1.4em';
        downloadButton.textContent = '⬇';

        downloadButtonContainer.appendChild(downloadButton);

        const loadingElement = GM_addElement('div');
        loadingElement.classList.add('loader');

        downloadButton.addEventListener('click', () => {
            downloadButtonContainer.removeChild(downloadButton);
            downloadButtonContainer.appendChild(loadingElement);
            GM_DL({url: video.src, filename: getFilenameFromURL(video.src)}).then(
                () => {
                    downloadButtonContainer.appendChild(downloadButton);

                    downloadButtonContainer.removeChild(loadingElement);

                    downloadButton.textContent = '✓';
                },
                (e) => {
                    GM_log(`error: ${e}`);
                    console.error(e);
                    downloadButtonContainer.appendChild(downloadButton);

                    downloadButtonContainer.removeChild(loadingElement);

                    downloadButton.textContent = '⮿';
                }
            );
        });
        fullScreenButton.parentNode?.insertBefore(
            downloadButtonContainer,
            fullScreenButton.nextSibling
        );
    });
})();