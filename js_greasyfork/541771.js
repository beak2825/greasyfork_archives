// ==UserScript==
// @name         Bandcamp Album and Singles MP3 Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  Download Bandcamp MP3 tracks individually or all at once (*not in a zip*).
// @author       Invulbox
// @match        *://*.bandcamp.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/541771/Bandcamp%20Album%20and%20Singles%20MP3%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/541771/Bandcamp%20Album%20and%20Singles%20MP3%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Step 1: Inject page script to grab TralbumData
    const script = document.createElement('script');
    script.textContent = `
        (function () {
            if (window.TralbumData) {
                window.postMessage({
                    type: 'TralbumData',
                    data: window.TralbumData
                }, '*');
            }
        })();
    `;
    document.documentElement.appendChild(script);
    script.remove();

    // Step 2: Listen for injected TralbumData
    window.addEventListener('message', function (event) {

        if (!event.data || event.data.type !== 'TralbumData') return;

        const adata = event.data.data;
        let trackRows = $('#track_table tbody tr');
         const singl = $('#trackInfoInner > ul')
         let isSingle = false;



        if(adata.trackinfo && trackRows.length===0){

         trackRows = $('#trackInfoInner > ul')
             console.log(trackRows)
            isSingle = true;

        }
        else if (!adata.trackinfo || trackRows.length === 0) {
            console.warn('[Bandcamp Downloader] No track info found.');
            return;
        }

        const downloadQueue = [];

        adata.trackinfo.forEach((track, i) => {

            if (!track || !track.file || !track.file["mp3-128"]) return;

            const filename = `${adata.artist} - ${track.title}.mp3`;
            const url = track.file["mp3-128"];
            const row = $(trackRows[i]);
            const $cell = row.find('.dl_link');

            // Add button to each track
            const btn = $('<button>')
                .text('Download')
                .css({
                    padding: '4px 8px',
                    marginLeft: '10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginTop: '-0.7em',
                    display: 'flex'
                })
                .on('click', function (e) {
                    e.preventDefault();
                    GM_download({
                        url,
                        name: filename,
                        onload: () => console.log('Downloaded:', filename),
                        onerror: e => console.error('Error downloading', filename, e)
                    });
                });
            if(isSingle){row.append(btn);}
            else{$cell.empty().append(btn);}



            // Add to download-all queue
            downloadQueue.push({ url, filename });
        });

        // Step 3: Add "Download All" button
        const albumTitle = adata.current.title || 'Album';
        const $downloadAll = $('<button>')
            .text('Download All Tracks')
            .css({
                padding: '8px 12px',
                fontSize: '14px',
                backgroundColor: '#0288d1',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px',
                justifyContent: 'center',
                display: 'flex',
                width: '100%'
            })
            .on('click', async function () {
                for (let i = 0; i < downloadQueue.length; i++) {
                    const track = downloadQueue[i];
                    GM_download({
                        url: track.url,
                        name: track.filename,
                        onload: () => console.log('Downloaded:', track.filename),
                        onerror: e => console.error('Failed:', track.filename, e)
                    });
                    await new Promise(r => setTimeout(r, 1200)); // slight delay to avoid spam
                }
            });

        $('#track_table').before($downloadAll);
        console.log('[Bandcamp Downloader] All buttons injected.');
    });
})();
