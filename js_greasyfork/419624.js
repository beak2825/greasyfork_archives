// ==UserScript==
// @name         Hulu.com Subtitle Downloader
// @namespace    https://www.hulu.com
// @version      1.0.5
// @description  Downloads subtitle from Hulu.com as SRT format
// @author       subdiox
// @match        https://www.hulu.com/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://update.greasyfork.org/scripts/502635/1422102/waitForKeyElements-CoeJoder-fork.js
// @grant        GM_xmlhttpRequest
// @copyright    2025, subdiox
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/419624/Hulucom%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/419624/Hulucom%20Subtitle%20Downloader.meta.js
// ==/UserScript==

waitForKeyElements('.PlayerSettingsGroup', pageDidLoad);

function pageDidLoad(jNode) {
    jNode.appendChild(createDownloadButton());
}

function createDownloadButton() {
    const button = document.createElement('div');
    button.id = 'download-button';
    button.className = 'PlayerButton PlayerControlsButton';
    button.setAttribute('aria-label', 'Download');
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.style.touchAction = 'none';
    button.innerHTML =
        '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        'x="0px" y="0px" viewBox="0 0 29.978 29.978" style="enable-background:new 0 0 29.978 29.978;" xml:space="preserve">' +
        '<path d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012 ' +
        'v-8.861H25.462z" fill="#FEFEFE" fill-rule="evenodd"/>' +
        '<path d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723 ' +
        'c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742 ' +
        'c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193 ' +
        'C15.092,18.979,14.62,18.426,14.62,18.426z" fill="#FEFEFE" fill-rule="evenodd"/>' +
        '</svg>';
    button.addEventListener('click', downloadDidClick);
    return button;
}

async function downloadDidClick() {
    const playbackXhr = new XMLHttpRequest();
    const contentId = window.location.href.split('/').pop();
    playbackXhr.open('GET', `https://discover.hulu.com/content/v5/deeplink/playback?namespace=entity&schema=1&id=${contentId}`, false);
    playbackXhr.withCredentials = true;
    playbackXhr.send(null);
    const playbackData = JSON.parse(playbackXhr.responseText);
    const captionId = playbackData.eab_id.split('::')[2];

    const entityXhr = new XMLHttpRequest();
    entityXhr.open('GET', `https://discover.hulu.com/content/v3/entity?device_context_id=1&language=en&referral_host=www.hulu.com&schema=4&eab_ids=${playbackData.eab_id}`, false);
    entityXhr.withCredentials = true;
    entityXhr.send(null);
    const entityData = JSON.parse(entityXhr.responseText);

    let filename = '';
    const seriesName = entityData.items[0].series_name;
    const seasonNumber = entityData.items[0].season;
    const episodeNumber = entityData.items[0].number;
    const episodeTitle = entityData.items[0].name;

    if (seriesName) filename += `${seriesName} `;
    if (seasonNumber) filename += `S ${seasonNumber} `;
    if (episodeNumber) filename += `E ${episodeNumber} `;
    if (episodeTitle) {
        filename = filename
            ? `${filename}- ${episodeTitle}.srt`
            : `${episodeTitle}.srt`;
    }
    if (!filename) filename = `${captionId}.srt`;

    const captionsXhr = new XMLHttpRequest();
    captionsXhr.open('GET', `https://www.hulu.com/captions.xml?content_id=${captionId}`, false);
    captionsXhr.withCredentials = true;
    captionsXhr.send(null);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(captionsXhr.responseText, 'text/xml');
    const xmlElement = xmlDoc.getElementsByTagName('en')[0];

    let vttUrl = `https://assetshuluimcom-a.akamaihd.net/captions_webvtt/${captionId.substr(-3)}/${captionId}_US_en_en.vtt`;
    if (xmlElement) {
        vttUrl = xmlElement.childNodes[0].nodeValue
            .replace('captions', 'captions_webvtt')
            .replace('.smi', '.vtt');
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: vttUrl,
        onload: (response) => {
            let cleanedVtt = '';
            const vttText = response.responseText
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<');
            for (const line of vttText.split('\n')) {
                if (!/WEBVTT/.test(line)) {
                    cleanedVtt += line.replace(
                        /(\d{2}:\d{2}:\d{2})\.(\d{3})\s+-->\s*(\d{2}:\d{2}:\d{2})\.(\d{3})/g,
                        '$1,$2 --> $3,$4'
                    ) + '\n';
                }
            }

            let srtContent = '';
            for (const [index, rawBlock] of cleanedVtt.split('\n\n').entries()) {
                const block = rawBlock.trim();
                if (!block) continue;
                srtContent += `${index + 1}\n${block}\n\n`;
            }
            downloadSRT(srtContent, filename);
        }
    });
}

function downloadSRT(srtText, filename) {
    const blob = new Blob([srtText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}