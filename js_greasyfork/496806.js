// ==UserScript==
// @name         Rule34Video 2160p y 1080p Filter (Optimized)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Filtra videos 2160p y 1080p en Rule34Video, ocultando los que no coinciden con la calidad seleccionada.
// @author       Luis123456xp (Optimized by GPT)
// @license      MIT
// @match        https://rule34video.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @connect      sleazyfork.org
// @downloadURL https://update.greasyfork.org/scripts/496806/Rule34Video%202160p%20y%201080p%20Filter%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496806/Rule34Video%202160p%20y%201080p%20Filter%20%28Optimized%29.meta.js
// ==/UserScript==

(async function($) {
    'use strict';

    const currentVersion = '2.3';
    const scriptUrl = 'https://sleazyfork.org/es/scripts/496806-rule34video-2160p-y-1080p-filter/code';
    const userLang = navigator.language || navigator.userLanguage;
    const isEnglish = userLang.startsWith('en');
    const MAX_CONCURRENT_REQUESTS = 20;

    function compareVersions(v1, v2) {
        const v1parts = v1.split('.').map(Number);
        const v2parts = v2.split('.').map(Number);
        for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
            if ((v1parts[i] || 0) > (v2parts[i] || 0)) return 1;
            if ((v1parts[i] || 0) < (v2parts[i] || 0)) return -1;
        }
        return 0;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: scriptUrl,
        onload: function(response) {
            const match = response.responseText.match(/@version\s+(\d+\.\d+)/);
            if (match) {
                const latestVersion = match[1];
                if (compareVersions(latestVersion, currentVersion) > 0) {
                    $('body').prepend(`
                        <div id="updateNotification" style="position:fixed; top:0; left:0; width:100%; background-color:yellow; z-index:9999; text-align:center; padding:10px;">
                            ${isEnglish ? 'A new version of the script is available. --Rule34Video 2160p y 1080p Filter--' : 'Hay una nueva versión disponible del script. --Rule34Video 2160p y 1080p Filter--'} <a href="${scriptUrl}" target="_blank">${isEnglish ? 'Click here to update' : 'Haz clic aquí para actualizar'}.</a>
                        </div>
                    `);
                }
            }
        }
    });

    const button2160p = $(`<button id="search2160pButton" style="position:fixed; top:10px; right:10px; z-index:9999;">${isEnglish ? 'Filter 2160p' : 'Filtrar 2160p'}</button>`);
    const button1080p = $(`<button id="search1080pButton" style="position:fixed; top:50px; right:10px; z-index:9999;">${isEnglish ? 'Filter 1080p' : 'Filtrar 1080p'}</button>`);
    $('body').append(button2160p, button1080p);

    let currentQuality = '';

    $('#search2160pButton').on('click', function() {
        currentQuality = '2160p';
        filterVideos(currentQuality);
    });

    $('#search1080pButton').on('click', function() {
        currentQuality = '1080p';
        filterVideos(currentQuality);
    });

    async function filterVideos(quality) {
        console.log(`${isEnglish ? 'Starting video filter with quality:' : 'Iniciando filtrado de videos con calidad:'} ${quality}`);

        const videoElements = $('.item.thumb').has('a[href*="/video/"]');
        const videoData = videoElements.map(function() {
            const link = $(this).find('a[href*="/video/"]').attr('href');
            return {
                element: $(this),
                link: link
            };
        }).get();

        console.log(`${isEnglish ? 'Total videos found:' : 'Total de videos encontrados:'} ${videoData.length}`);

        const loadingDiv = $(`
            <div id="loadingMessage" style="position:fixed; top:50%; left:50%;
            transform:translate(-50%, -50%); z-index:9999; background-color: yellow; padding: 10px; font-size: 20px;">
                ${isEnglish ? 'Filtering videos...' : 'Filtrando videos...'}
            </div>
        `);
        $('body').append(loadingDiv);

        let matchCount = 0;
        let processedCount = 0;

        async function processVideo(videoInfo) {
            try {
                const html = await fetchPageHTML(videoInfo.link);
                const hasQuality = html.includes(quality);
                if (!hasQuality) {
                    videoInfo.element.hide();
                } else {
                    matchCount++;
                }
            } catch (error) {
                console.error(`Error fetching ${videoInfo.link}`, error);
            } finally {
                processedCount++;
                $('#loadingMessage').text(`${isEnglish ? 'Filtering...' : 'Filtrando...'} ${processedCount}/${videoData.length}`);
            }
        }

        const queue = [...videoData];
        const workers = [];

        for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i++) {
            workers.push((async () => {
                while (queue.length > 0) {
                    const item = queue.shift();
                    if (item) await processVideo(item);
                }
            })());
        }

        await Promise.all(workers);

        $('#loadingMessage').text(`${isEnglish ? 'Filtering complete. Videos matching' : 'Filtrado completado. Videos que coinciden con'} ${quality}: ${matchCount}`);
        setTimeout(() => { $('#loadingMessage').remove(); }, 3000);
        console.log(isEnglish ? 'Filtering complete.' : 'Filtrado completado.');
    }

    // ✅ Usar `fetch` nativo
    async function fetchPageHTML(url) {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
    }

})(window.jQuery);