// ==UserScript==
// @name GreasyFork: Unified Script Downloader & Sorter
// @namespace http://tampermonkey.net/
// @version 1.2.1
// @description Agrega un botón flotante para descargar todos los scripts de un usuario de Greasy Fork!
// @author YouTubeDrawaria, Konf
// @match https://greasyfork.org/es/users/*
// @match https://greasyfork.org/*/users/*
// @match https://greasyfork.org/es/scripts/by-site/drawaria.online*
// @match https://greasyfork.org/es/scripts/by-site/*
// @match https://greasyfork.org/es/scripts*
// @match https://greasyfork.org/*/scripts/by-site/drawaria.online*
// @match https://greasyfork.org/*/scripts/by-site/*
// @match https://greasyfork.org/*/scripts*
// @match https://greasyfork.org/*/scripts/*
// @match https://sleazyfork.org/*/scripts/*
// @match https://web.archive.org/web/*/https://greasyfork.org/*/scripts/*
// @match https://web.archive.org/web/*/https://sleasyfork.org/*/scripts/*
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @connect greasyfork.org
// @connect update.greasyfork.org
// @connect sleazyfork.org
// @connect cdnjs.cloudflare.com
// @license MIT
// @icon https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @run-at document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/544300/GreasyFork%3A%20Unified%20Script%20Downloader%20%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/544300/GreasyFork%3A%20Unified%20Script%20Downloader%20%20Sorter.meta.js
// ==/UserScript==

(function() {
'use strict';

// ========== Font Awesome Inclusion ==========
function ensureFontAwesome() {
    if (!document.querySelector('link[href*="fontawesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fa);
        console.log('[Greasyfork Unified Downloader & Sorter] Font Awesome CDN injected.');
    }
}

// ========== Unified Utility Functions ==========

/**
 * Converts a new format Greasyfork script href to an old format URL for better compatibility with direct downloads.
 * @param {string} href - The script href (often from data-code-url or install-link).
 * @returns {string} The converted old format URL or the original href if conversion fails.
 */
function convertScriptHrefToAnOldFormat(href) {
    // Remove web.archive.org prefix if present to get the original Greasyfork URL
    const webArchiveMatch = href.match(/(https:\/\/web\.archive\.org\/web\/\d+\/)?id_?\/(https:\/\/(greas|sleaz)yfork\.org.+)/);
    if (webArchiveMatch) {
        href = webArchiveMatch[2];
    }

    // Regex to extract domain, script ID, and filename with extension
    const regex = /https:\/\/(?:update\.)?(\w+\.org)\/scripts\/(\d+)(?:\/\d+)?\/?([^?#]+)/;
    const match = href.match(regex);

    if (!match) {
        console.warn(`[Greasyfork Unified Downloader & Sorter] Could not convert href to old format, returning original: ${href}`);
        return href;
    }

    const domain = match[1];
    const scriptId = match[2];
    let scriptNameWithExt = match[3];

    // Ensure scriptNameWithExt includes a valid file extension
    if (!scriptNameWithExt.match(/\.(user\.js|user\.css|js|css)$/i)) {
         scriptNameWithExt += '.user.js'; // Default to .user.js for user scripts
    }

    // Construct the old format URL which typically points to the raw 'code' endpoint
    return `https://${domain}/scripts/${scriptId}/code/${scriptNameWithExt}`;
}

/**
 * Robustly downloads a file using GM_xmlhttpRequest, trying multiple URLs if provided.
 * @param {object} options
 * @param {string|string[]} options.urls - The URL(s) to download from. Can be a single string or an array of strings.
 * @param {string} options.filename - The desired filename for the downloaded file.
 * @returns {Promise<void>}
 */
async function downloadFileRobustly({ urls, filename }) {
    if (!Array.isArray(urls)) {
        urls = [urls]; // Ensure it's an array for iteration
    }

    const errors = [];

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        if (!url) continue;

        try {
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function(response) {
                        if (response.status === 200) {
                            const blob = response.response;
                            const objUrl = URL.createObjectURL(blob);

                            const a = document.createElement('a');
                            a.href = objUrl;
                            a.download = filename;
                            document.body.appendChild(a); // Needed for Firefox
                            a.click();
                            a.remove();
                            URL.revokeObjectURL(objUrl);
                            resolve(); // Success, resolve the current promise
                        } else {
                            const errorMsg = `Failed to fetch ${url}: Status ${response.status} - ${response.statusText}`;
                            errors.push(new Error(errorMsg));
                            console.warn(`[Greasyfork Unified Downloader & Sorter] ${errorMsg}`);
                            reject(new Error('Attempt failed, try next URL')); // Reject to move to next URL
                        }
                    },
                    onerror: function(error) {
                        const errorMsg = `Network error fetching ${url}: ${error.error || 'Unknown error'}`;
                        errors.push(new Error(errorMsg));
                        console.warn(`[Greasyfork Unified Downloader & Sorter] ${errorMsg}`);
                        reject(new Error('Attempt failed, try next URL')); // Reject to move to next URL
                    }
                });
            });
            return; // If successful, exit the function
        } catch (e) {
            // If the promise was rejected with 'Attempt failed, try next URL', continue loop
            if (e.message !== 'Attempt failed, try next URL') {
                // Catch other unexpected errors
                errors.push(e);
                console.error(`[Greasyfork Unified Downloader & Sorter] Unexpected error during download attempt from ${url}:`, e);
            }
        }
    }

    // If all URLs failed
    errors.forEach(e => console.error(e));
    throw new Error('Failed to download file after all attempts. See console for details.');
}

/**
 * Sanitizes a string to be a valid and clean filename.
 * @param {string} filename - The original filename string.
 * @returns {string} The sanitized filename.
 */
function sanitizeFilename(filename) {
    // Remove query parameters and hash fragments
    let cleanedFilename = filename.split('?')[0].split('#')[0];

    // Separate Greasyfork specific extensions (.user.js, .user.css)
    let baseName = cleanedFilename.replace(/\.(user\.js|user\.css)$/i, '');
    let extension = (cleanedFilename.match(/\.(user\.js|user\.css)$/i) || [''])[0];

    // If no specific Greasyfork extension, check for general .js/.css
    if (!extension) {
        let generalExtMatch = cleanedFilename.match(/\.(js|css)$/i);
        if (generalExtMatch) {
            baseName = cleanedFilename.substring(0, cleanedFilename.lastIndexOf(generalExtMatch[0]));
            extension = generalExtMatch[0];
        }
    }

    // Remove invalid characters, keeping alphanumeric, hyphens, underscores, periods, and spaces (temporarily)
    baseName = baseName.replace(/[^\p{L}\p{N}\-_. ]/gu, '');
    baseName = baseName.replace(/[\s]+/g, '_'); // Replace spaces with single underscores
    baseName = baseName.replace(/_+/g, '_'); // Collapse multiple underscores
    baseName = baseName.replace(/^[._\-]+|[._\-]+$/g, ''); // Remove leading/trailing unwanted chars

    // Ensure baseName is not empty; fallback to a generic name
    if (baseName.length === 0) {
        baseName = 'greasyfork_script';
    }

    return `${baseName}${extension}`;
}

// ========== Unified Styles ==========
function addUnifiedStyles() {
    GM_addStyle(`
        /* Mass Downloader Button Styles */
        #downloadAllGreasyforkScriptsUnified {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 25px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: background-color 0.3s ease, transform 0.1s ease, box-shadow 0.3s ease;
        }
        #downloadAllGreasyforkScriptsUnified:hover:not(:disabled) {
            background-color: #45a049;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
        }
        #downloadAllGreasyforkScriptsUnified:active:not(:disabled) {
            transform: translateY(2px);
        }
        #downloadAllGreasyforkScriptsUnified:disabled {
            background-color: #cccccc !important;
            cursor: not-allowed !important;
            box-shadow: none !important;
            transform: translateY(0) !important;
        }

        /* Individual/Library Download Button Styles */
        .GF-DSB__script-download-button-unified {
            position: relative;
            padding: 8px 22px;
            cursor: pointer;
            border: none;
            background: #0F750F;
            transition: box-shadow 0.2s;
            font-size: 15px;
            line-height: 1.5;
            font-weight: 700;
            color: #fff;
            border-radius: 3px;
            display: inline-block;
            margin-right: 5px;
            text-decoration: none;
            text-align: center; /* Center text/icon within the button */
            vertical-align: middle; /* Align button vertically */
        }

        .GF-DSB__script-download-button-unified:hover,
        .GF-DSB__script-download-button-unified:focus {
            box-shadow: 0 8px 16px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
        }

        /* Base icon styling (for both download and loading states) */
        .GF-DSB__script-download-icon-unified {
            position: absolute;
            /* Positioning for the icon within the button */
            top: 4px;
            left: 7px;
        }

        /* Download Icon Specific Styling (Font Awesome) */
        .GF-DSB__script-download-icon--download-unified {
            font-size: 30px; /* Size for Font Awesome icon */
            color: white; /* Color of the icon */
        }

        /* Loading Icon Specific Styling (Spinner) */
        .GF-DSB__script-download-icon--loading-unified {
            font-size: 0 !important; /* Hide the Font Awesome icon */
            text-indent: -9999px; /* Ensure text/icon is not visible */
            overflow: hidden; /* Hide any overflow */

            /* Spinner specific positioning - slightly different from download icon to center the spinner */
            top: 8px;
            left: 11px;

            /* Spinner animation styles */
            border-radius: 50%;
            width: 16px;
            height: 16px;
            border-top: 3px solid rgba(255, 255, 255, 0.2);
            border-right: 3px solid rgba(255, 255, 255, 0.2);
            border-bottom: 3px solid rgba(255, 255, 255, 0.2);
            border-left: 3px solid #ffffff;
            transform: translateZ(0);
            animation: GF-DSB__script-download-loading-icon-unified 1.1s infinite linear;
        }

        @keyframes GF-DSB__script-download-loading-icon-unified {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .GF-DSB__library-download-button-unified {
            transition: box-shadow 0.2s;
        }

        .GF-DSB__library-download-button--loading-unified {
            animation: GF-DSB__loading-text-unified 1s infinite linear;
        }

        @keyframes GF-DSB__loading-text-unified {
            50% {
                opacity: 0.4;
            }
        }

        /* Estilos adicionales para perfiles de usuario */
        #user-profile-sort {
            font-family: inherit;
        }

        #user-profile-sort ul {
            align-items: center;
        }

        #user-profile-sort a:hover {
            color: #0056b3 !important;
            text-decoration: underline;
        }
    `);
}

// ========== Block: Mass Download ==========

function initMassDownload() {
    console.log('[Greasyfork Unified Downloader & Sorter] Initializing Mass Download feature.');
    addDownloadAllButton();
}

// Function to add the floating download all button
function addDownloadAllButton() {
    if (document.getElementById('downloadAllGreasyforkScriptsUnified')) {
        console.log('[Greasyfork Unified Downloader & Sorter] Mass download button already exists, skipping.');
        return;
    }

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Descargar Todos los Scripts';
    downloadButton.id = 'downloadAllGreasyforkScriptsUnified';

    document.body.appendChild(downloadButton);
    console.log('[Greasyfork Unified Downloader & Sorter] Mass download button added to DOM.');

    downloadButton.addEventListener('click', downloadAllScriptsMass);
}

async function downloadAllScriptsMass() {
    const scriptListItems = document.querySelectorAll('li[data-code-url]');

    console.log(`[Greasyfork Unified Downloader & Sorter] Found ${scriptListItems.length} potential scripts for mass download.`);

    if (scriptListItems.length === 0) {
        alert('No se encontraron scripts para descarga masiva. Asegúrate de estar en una página de listado de scripts o perfil de usuario con scripts públicos.');
        console.error('[Greasyfork Unified Downloader & Sorter] No <li> elements with data-code-url found for mass download.');
        return;
    }

    const downloadQueue = [];
    scriptListItems.forEach((li) => {
        const url = li.getAttribute('data-code-url');
        if (!url) {
            console.warn(`[Greasyfork Unified Downloader & Sorter] Element <li> without data-code-url:`, li);
            return;
        }

        let initialFilename = url.substring(url.lastIndexOf('/') + 1);
        const finalFilename = sanitizeFilename(initialFilename);

        downloadQueue.push({ url, filename: finalFilename });
    });

    const totalScripts = downloadQueue.length;
    let downloadedCount = 0;

    alert(`Se encontraron ${totalScripts} scripts para descargar. Iniciando descarga de cada uno...`);

    const downloadButton = document.getElementById('downloadAllGreasyforkScriptsUnified');
    if (downloadButton) {
        downloadButton.disabled = true;
        downloadButton.textContent = `Descargando 0/${totalScripts}...`;
    }

    const delayMs = 1200; // 1.2 seconds between each download

    for (const { url, filename } of downloadQueue) {
        console.log(`[Greasyfork Unified Downloader & Sorter] Attempting to download: "${filename}" from "${url}"`);
        try {
            const urlsToTry = [convertScriptHrefToAnOldFormat(url), url];
            await downloadFileRobustly({ urls: urlsToTry, filename: filename });
            downloadedCount++;
            if (downloadButton) {
                downloadButton.textContent = `Descargando ${downloadedCount}/${totalScripts}...`;
            }
            console.log(`[Greasyfork Unified Downloader & Sorter] Successfully downloaded: "${filename}"`);
        } catch (error) {
            console.error(`[Greasyfork Unified Downloader & Sorter] ERROR downloading "${filename}":`, error);
        }
        if (downloadedCount < totalScripts) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    setTimeout(() => {
        alert(`Se completó el intento de descarga de ${downloadedCount} de ${totalScripts} scripts. Revise las descargas de su navegador y la consola (F12) para cualquier error.`);

        if (downloadButton) {
            downloadButton.disabled = false;
            downloadButton.textContent = 'Descargar Todos los Scripts';
        }
    }, 1000);
}

// ========== Block: Individual Download Button ==========

const i18n = {
    download: 'download',
    downloadWithoutInstalling: 'downloadWithoutInstalling',
    failedToDownload: 'failedToDownload',
};

const translate = (function() {
    const userLang = location.pathname.split('/')[1];
    const strings = {
        'en': {
            [i18n.download]: 'Download ⇩',
            [i18n.downloadWithoutInstalling]: 'Download without installing',
            [i18n.failedToDownload]:
                'Failed to download the script. There is might be more info in the browser console',
        },
        'ru': {
            [i18n.download]: 'Скачать ⇩',
            [i18n.downloadWithoutInstalling]: 'Скачать no устанавливая',
            [i18n.failedToDownload]:
                'Не удалось скачать скрипт. Больше информации может быть в консоли браузера',
        },
        'zh-CN': {
            [i18n.download]: '下载 ⇩',
            [i18n.downloadWithoutInstalling]: '下载此脚本',
            [i18n.failedToDownload]: '无法下载此脚本',
        },
        'es': {
            [i18n.download]: 'Descargar ⇩',
            [i18n.downloadWithoutInstalling]: 'Descargar sin instalar',
            [i18n.failedToDownload]:
                'No se pudo descargar el script. Puede haber más información en la consola del navegador',
        }
    };

    return id => (strings[userLang] || strings.en)[id] || strings.en[id];
}());

function initIndividualDownloadButton() {
    console.log('[Greasyfork Unified Downloader & Sorter] Initializing Individual Download Button feature.');
    const installArea = document.querySelector('div#install-area');
    const installBtns = installArea?.querySelectorAll(':scope > a.install-link');
    const installHelpLinks = document.querySelectorAll('a.install-help-link');
    const suggestion = document.querySelector('div#script-feedback-suggestion');
    const libraryRequire = document.querySelector('div#script-content > p > code');
    const libraryVersion = document.querySelector(
        '#script-stats > dd.script-show-version > span'
    );

    if (
        installArea &&
        (installBtns.length > 0) &&
        (installBtns.length === installHelpLinks.length)
    ) {
        for (let i = 0; i < installBtns.length; i++) {
            mountScriptDownloadButton(installBtns[i], installArea, installHelpLinks[i]);
        }
    }
    else if (suggestion && libraryRequire) {
        mountLibraryDownloadButton(suggestion, libraryRequire, libraryVersion);
    }
}

function mountScriptDownloadButton(
    installBtn,
    installArea,
    installHelpLink,
) {
    if (!installBtn.href) {
        console.error('[Greasyfork Unified Downloader & Sorter] Script href is not found for individual button.');
        return;
    }

    if (installArea.querySelector('.GF-DSB__script-download-button-unified')) {
        console.log('[Greasyfork Unified Downloader & Sorter] Individual script download button already exists, skipping.');
        return;
    }

    const b = document.createElement('a');
    const bIcon = document.createElement('i');

    b.href = '#';
    b.title = translate(i18n.downloadWithoutInstalling);
    b.draggable = false;
    b.className = 'GF-DSB__script-download-button-unified';

    bIcon.className =
        'fas fa-download GF-DSB__script-download-icon-unified GF-DSB__script-download-icon--download-unified';

    installHelpLink.style.position = 'relative';

    b.appendChild(bIcon);
    installArea.insertBefore(b, installHelpLink);

    let isFetchingAllowed = true;

    async function clicksHandler(ev) {
        ev.preventDefault();

        setTimeout(() => b === document.activeElement && b.blur(), 250);

        if (isFetchingAllowed === false) return;

        isFetchingAllowed = false;
        bIcon.className =
            'GF-DSB__script-download-icon-unified GF-DSB__script-download-icon--loading-unified';

        try {
            let scriptName = installBtn.dataset.scriptName;

            if (installBtn.dataset.scriptVersion) {
                scriptName += ` ${installBtn.dataset.scriptVersion}`;
            }

            const fileExt = `.${installBtn.dataset.installFormat || 'user.js'}`;
            const filename = sanitizeFilename(`${scriptName}${fileExt}`);
            const href = installBtn.href;

            const urlsToTry = [convertScriptHrefToAnOldFormat(href), href];

            await downloadFileRobustly({
                urls: urlsToTry,
                filename: filename,
            });
        } catch (e) {
            console.error('[Greasyfork Unified Downloader & Sorter] Error during individual script download:', e);
            alert(`${translate(i18n.failedToDownload)}: \n${e.message || e}`);
        } finally {
            setTimeout(() => {
                isFetchingAllowed = true;
                bIcon.className =
                    'fas fa-download GF-DSB__script-download-icon-unified GF-DSB__script-download-icon--download-unified';
            }, 300);
        }
    }

    b.addEventListener('click', clicksHandler);
    b.addEventListener('auxclick', e => e.button === 1 && clicksHandler(e));
}

function mountLibraryDownloadButton(suggestion, libraryRequire, libraryVersion) {
    let match = libraryRequire.innerText.match(
        /\/\/ @require (https:\/\/.+\/scripts\/\d+\/\d+\/(.*)\.js)/
    );

    if (!match) {
        console.error('[Greasyfork Unified Downloader & Sorter] Library href regex match failed.');
        return;
    }

    let libraryHref = match[1];
    let libraryName = decodeURIComponent(match[2]);

    if (!libraryHref) {
        console.error('[Greasyfork Unified Downloader & Sorter] Library href is not found for library button.');
        return;
    }

    if (suggestion.querySelector('.GF-DSB__library-download-button-unified')) {
        console.log('[Greasyfork Unified Downloader & Sorter] Library download button already exists, skipping.');
        return;
    }

    if (libraryVersion?.innerText) libraryName += ` ${libraryVersion.innerText}`;

    const b = document.createElement('a');

    b.href = '#';
    b.draggable = false;
    b.innerText = translate(i18n.download);
    b.className = 'GF-DSB__library-download-button-unified';

    suggestion.appendChild(b);

    let isFetchingAllowed = true;

    async function clicksHandler(ev) {
        ev.preventDefault();

        setTimeout(() => b === document.activeElement && b.blur(), 250);

        if (isFetchingAllowed === false) return;

        isFetchingAllowed = false;
        b.className =
            'GF-DSB__library-download-button-unified GF-DSB__library-download-button--loading-unified';

        try {
            const fileExt = '.js';
            const filename = sanitizeFilename(`${libraryName}${fileExt}`);

            const urlsToTry = [convertScriptHrefToAnOldFormat(libraryHref), libraryHref];

            await downloadFileRobustly({
                urls: urlsToTry,
                filename: filename,
            });
        } catch (e) {
            console.error('[Greasyfork Unified Downloader & Sorter] Error during library download:', e);
            alert(`${translate(i18n.failedToDownload)}: \n${e.message || e}`);
        } finally {
            setTimeout(() => {
                isFetchingAllowed = true;
                b.className = 'GF-DSB__library-download-button-unified';
            }, 300);
        }
    }

    b.addEventListener('click', clicksHandler);
    b.addEventListener('auxclick', e => e.button === 1 && clicksHandler(e));
}

// ========== Block: Order Scripts by Older ==========

function getList() {
    let list = document.querySelector('#browse-script-list');

    if (!list && isUserProfilePage()) {
        const firstScript = document.querySelector('li[data-code-url]');
        if (firstScript) {
            list = firstScript.parentElement;
        }
    }

    return list;
}

function getOptionBar() {
    let bar = document.querySelector('#script-list-sort ul');

    if (!bar && isUserProfilePage()) {
        bar = document.querySelector('#user-profile-sort ul');
    }

    return bar;
}

function addOldestButton() {
    const bar = getOptionBar();

    if (!bar && isUserProfilePage()) {
        createUserProfileSortBar();
        const newBar = getOptionBar(); // Try to get the newly created bar
        if (newBar) {
            addOldestButtonToBar(newBar);
        }
        return;
    }

    if (!bar || bar.querySelector('.sort-oldest-added')) {
        console.log('[Greasyfork Unified Downloader & Sorter] "Más antiguo" button already exists or no bar found, skipping.');
        return;
    }

    addOldestButtonToBar(bar);
}

function addOldestButtonToBar(barElement) {
    if (barElement.querySelector('.sort-oldest-added')) {
        console.log('[Greasyfork Unified Downloader & Sorter] "Más antiguo" button already exists in this bar, skipping.');
        return;
    }

    const li = document.createElement('li');
    li.className = 'list-option sort-oldest-added';

    const a = document.createElement('a');
    a.href = "#";
    a.textContent = "Más antiguo";
    a.style.cssText = "font-weight: bold !important; color: #007bff; text-decoration: none;"; // Added !important
    a.onclick = function(e){
        e.preventDefault();
        sortByOldest();
    };
    li.appendChild(a);
    barElement.appendChild(li);
    console.log('[Greasyfork Unified Downloader & Sorter] "Más antiguo" button added.');
}

function createUserProfileSortBar() {
    if (document.getElementById('user-profile-sort')) {
        console.log('[Greasyfork Unified Downloader & Sorter] User profile sort bar already exists, skipping creation.');
        return;
    }

    let insertBeforeElement = document.querySelector('ul.list-options') ||
        document.querySelector('div.scripts-list') ||
        document.querySelector('li[data-code-url]')?.parentElement ||
        document.querySelector('article.script')?.parentElement;

    let targetParent = null;

    if (insertBeforeElement) {
        targetParent = insertBeforeElement.parentElement;
    } else {
        targetParent = document.querySelector('.user-content') ||
                       document.querySelector('main');
    }

    if (!targetParent) {
        console.warn('[Greasyfork Unified Downloader & Sorter] Could not find a suitable target parent to insert user profile sort bar.');
        return;
    }

    const sortBar = document.createElement('div');
    sortBar.id = 'user-profile-sort';
    sortBar.style.cssText = `
        margin: 10px 0;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
        border: 1px solid #dee2e6;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    `;

    const sortList = document.createElement('ul');
    sortList.style.cssText = `
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    `;
    sortBar.appendChild(sortList);

    if (insertBeforeElement && targetParent) {
        targetParent.insertBefore(sortBar, insertBeforeElement);
    } else {
        targetParent.appendChild(sortBar);
    }
    console.log('[Greasyfork Unified Downloader & Sorter] User profile sort bar created.');
}

function sortByOldest() {
    const list = getList();
    if (!list) {
        console.warn('[Greasyfork Unified Downloader & Sorter] No script list found to sort.');
        return;
    }
    const items = Array.from(list.querySelectorAll('li[data-script-created-date]'));

    if (items.length === 0) {
        alert('No se encontraron scripts con fecha de creación para ordenar.');
        console.warn('[Greasyfork Unified Downloader & Sorter] No sortable items found.');
        return;
    }

    items.sort(function (a, b) {
        const da = new Date(a.getAttribute('data-script-created-date'));
        const db = new Date(b.getAttribute('data-script-created-date'));
        return da - db;
    });
    while (list.firstChild) list.removeChild(list.firstChild);
    for (const it of items) list.appendChild(it);
    console.log('[Greasyfork Unified Downloader & Sorter] Scripts sorted by oldest.');
}

function initOrderByOldest() {
    console.log('[Greasyfork Unified Downloader & Sorter] Initializing "Order by Older" feature.');
    addOldestButton();
}

// ========== Helper functions to determine the current page type ==========

function isUserProfilePage() {
    const path = location.pathname;
    const userProfilePattern = /\/(?:[a-z]{2}\/)?users\/\d+-/;
    return userProfilePattern.test(path);
}

function isScriptListPage() {
    // Check for standard list page elements
    const hasGeneralScriptList = document.querySelector('#browse-script-list') &&
                                 document.querySelector('#script-list-sort ul');

    // Check for user profile page URL pattern AND presence of any script list items
    const hasScriptsInUserContext = isUserProfilePage() && (
        document.querySelector('li[data-code-url]') ||
        document.querySelector('.script-list') ||
        document.querySelector('div.scripts-list') ||
        document.querySelector('ul.list-options')
    );

    // Fallback: check if there's *any* installable script item on the page, regardless of container
    const anyDownloadableScriptItem = document.querySelectorAll('li[data-code-url]').length > 0;

    const result = hasGeneralScriptList || hasScriptsInUserContext || anyDownloadableScriptItem;
    console.log(`[Greasyfork Unified Downloader & Sorter] isScriptListPage returns: ${result}`);
    return result;
}

function isIndividualScriptPage() {
    const path = location.pathname;
    const parts = path.split('/').filter(Boolean);

    if (parts.length >= 2 && parts.includes('scripts')) {
        const scriptsIndex = parts.indexOf('scripts');
        const potentialIdPart = parts[scriptsIndex + 1];

        return potentialIdPart && /^\d+/.test(potentialIdPart) &&
               !path.includes('/by-site/') &&
               !path.includes('/new') &&
               !path.includes('/discussions') &&
               !path.includes('/versions') &&
               !path.includes('/users/');
    }
    return false;
}

// ========== Global Initialization with MutationObserver ==========
function initializeUnifiedScript() {
    console.log('[Greasyfork Unified Downloader & Sorter] Initializing unified script...');
    ensureFontAwesome();
    addUnifiedStyles();

    let listFeaturesInitialized = false;
    let individualFeatureInitialized = false;
    let observer = null;
    let debounceTimeoutId = null;

    function tryInitFeatures() {
        if (debounceTimeoutId) {
            clearTimeout(debounceTimeoutId);
            debounceTimeoutId = null;
        }

        if (!individualFeatureInitialized && isIndividualScriptPage()) {
            console.log('[Greasyfork Unified Downloader & Sorter] Individual script page detected, initializing individual features.');
            initIndividualDownloadButton();
            individualFeatureInitialized = true;
        }

        if (!listFeaturesInitialized && isScriptListPage()) {
            console.log('[Greasyfork Unified Downloader & Sorter] Script list page (or user profile with scripts) detected, initializing list features.');
            initMassDownload();
            initOrderByOldest();
            listFeaturesInitialized = true;
        }

        if (individualFeatureInitialized || listFeaturesInitialized) {
             if (observer) {
                observer.disconnect();
                console.log('[Greasyfork Unified Downloader & Sorter] MutationObserver disconnected as features initialized.');
             }
        }
    }

    setTimeout(tryInitFeatures, 100); // Initial quick check

    const observerTarget = document.body;
    if (observerTarget) {
        observer = new MutationObserver((mutationsList, observerInstance) => {
            if (listFeaturesInitialized && individualFeatureInitialized) {
                observerInstance.disconnect();
                return;
            }

            // Debounce the call to tryInitFeatures to avoid excessive re-runs
            if (!debounceTimeoutId) {
                debounceTimeoutId = setTimeout(tryInitFeatures, 200); // Wait 200ms after last mutation
            }
        });

        observer.observe(observerTarget, { childList: true, subtree: true });
        console.log('[Greasyfork Unified Downloader & Sorter] MutationObserver started for dynamic content.');
    } else {
        console.warn('[Greasyfork Unified Downloader & Sorter] Could not find observer target (document.body). Dynamic features might not initialize.');
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initializeUnifiedScript);
} else {
    initializeUnifiedScript();
}
})();