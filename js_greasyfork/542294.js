// ==UserScript==
// @name         Rou Video Downloader
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Finds HLS playlists, decrypts, remuxes to MP4, and gets the video title from the page tab.
// @author       Gemini
// @match        *://*/*
// @resource     CRYPTOJS https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @resource     MUXJS https://cdn.jsdelivr.net/npm/mux.js@6.3.0/dist/mux.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @connect      *
// @run-at       document-start
// @all-frames   true
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542294/Rou%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/542294/Rou%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isCryptoLoaded = false;
    let isMuxLoaded = false;
    try {
        eval(GM_getResourceText('CRYPTOJS'));
        isCryptoLoaded = true;
        console.log('CryptoJS library loaded successfully.');
    } catch (e) {
        console.error('FATAL: Could not load CryptoJS library. Decryption will fail.', e);
    }
    try {
        eval(GM_getResourceText('MUXJS'));
        isMuxLoaded = true;
        console.log('Mux.js library loaded successfully.');
    } catch (e) {
        console.error('FATAL: Could not load Mux.js library. Remuxing will fail.', e);
    }


    console.log('Playlist Hunter Script v2.5 (with Remuxer) Loaded in frame:', window.location.href);

    let masterPlaylistUrl = null;
    let totalSegments = 0;
    let decryptionKey = null;
    let iv = null;

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        checkForPlaylist(url);
        return originalFetch.apply(this, args);
    };

    const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function(...args) {
        const url = args[1];
        checkForPlaylist(url);
        return originalXhrOpen.apply(this, args);
    };

    function checkForPlaylist(url) {
        if (masterPlaylistUrl) return;
        if (typeof url === 'string' && url.toLowerCase().includes('.m3u8')) {
            console.log(`SUCCESS: Playlist HLS ditemukan! URL: ${url}`);
            masterPlaylistUrl = url;
            if (downloadButton) {
                updateButtonState('found');
            }
        }
    }

    let downloadButton = null;
    let statusText = null;

    function createButtons() {
        if (document.getElementById('playlist-download-container-v2-5')) return;
        const container = document.createElement('div');
        container.id = 'playlist-download-container-v2-5';
        Object.assign(container.style, {
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex: '99999',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px',
            borderRadius: '8px'
        });

        downloadButton = document.createElement('button');
        Object.assign(downloadButton.style, {
            color: 'white',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
        });
        downloadButton.addEventListener('click', downloadFullStream);

        statusText = document.createElement('p');
        Object.assign(statusText.style, {
            color: 'white',
            margin: '0',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 'normal'
        });

        container.appendChild(downloadButton);
        container.appendChild(statusText);
        document.body.appendChild(container);

        updateButtonState(masterPlaylistUrl ? 'found' : 'initial');
    }

    function updateButtonState(state, progress = {}) {
        if (!downloadButton) return;
        switch (state) {
            case 'initial':
                downloadButton.innerHTML = '⏳ Mencari Playlist...';
                downloadButton.style.backgroundColor = '#6c757d';
                downloadButton.disabled = true;
                statusText.textContent = 'Putar video untuk mendeteksi.';
                break;
            case 'found':
                downloadButton.innerHTML = '⬇️ Unduh Video Lengkap';
                downloadButton.style.backgroundColor = '#28a745';
                downloadButton.disabled = false;
                statusText.textContent = 'Playlist ditemukan! Siap unduh.';
                break;
            case 'downloading':
                downloadButton.innerHTML = '📥 Mengunduh...';
                downloadButton.style.backgroundColor = '#fd7e14';
                downloadButton.disabled = true;
                statusText.textContent = `Segmen: ${progress.downloaded}/${progress.total}`;
                break;
            case 'decrypting':
                downloadButton.innerHTML = '🔑 Mendekripsi...';
                downloadButton.style.backgroundColor = '#6f42c1';
                downloadButton.disabled = true;
                statusText.textContent = `Segmen: ${progress.decrypted}/${progress.total}`;
                break;
            case 'remuxing':
                downloadButton.innerHTML = '⚙️ Remuxing...';
                downloadButton.style.backgroundColor = '#ffc107';
                downloadButton.disabled = true;
                statusText.textContent = `Memproses segmen ke MP4...`;
                break;
            case 'error':
                 downloadButton.innerHTML = '❌ Gagal';
                downloadButton.style.backgroundColor = '#dc3545';
                downloadButton.disabled = false;
                statusText.textContent = 'Terjadi kesalahan. Coba lagi.';
                break;
        }
    }

    async function downloadFullStream() {
        if (!masterPlaylistUrl) {
            alert('URL Playlist tidak ditemukan. Coba putar video sebentar.');
            return;
        }

        updateButtonState('downloading', { downloaded: 0, total: '??' });

        try {
            let mediaPlaylistUrl = masterPlaylistUrl;
            let playlistContent = await fetchUrl(masterPlaylistUrl, 'text');

            if (playlistContent.includes('#EXT-X-STREAM-INF')) {
                console.log('Master playlist terdeteksi. Mencari playlist media...');
                const mediaPlaylistPath = playlistContent.split('\n').find(line => line.trim() && !line.startsWith('#'));
                if (!mediaPlaylistPath) throw new Error('Master playlist tidak berisi link ke media playlist.');
                mediaPlaylistUrl = new URL(mediaPlaylistPath, masterPlaylistUrl).toString();
                console.log('Menggunakan media playlist:', mediaPlaylistUrl);
                playlistContent = await fetchUrl(mediaPlaylistUrl, 'text');
            }

            const baseUrl = new URL(mediaPlaylistUrl);
            baseUrl.pathname = baseUrl.pathname.split('/').slice(0, -1).join('/');

            const keyTag = playlistContent.split('\n').find(line => line.startsWith('#EXT-X-KEY'));
            if (keyTag) {
                if (!isCryptoLoaded) throw new Error('Gagal mendekripsi: Library kripto tidak dapat dimuat.');
                const uriMatch = keyTag.match(/URI="([^"]+)"/);
                if (uriMatch) {
                    const keyUrl = new URL(uriMatch[1], baseUrl.toString()).toString();
                    decryptionKey = await fetchUrl(keyUrl, 'arraybuffer');
                }
                const ivMatch = keyTag.match(/IV=0x([0-9a-fA-F]+)/);
                if (ivMatch) iv = CryptoJS.enc.Hex.parse(ivMatch[1]);
            }

            const segmentUrls = playlistContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
            totalSegments = segmentUrls.length;
            if (totalSegments === 0) throw new Error('Playlist tidak berisi segmen.');

            const fullSegmentUrls = segmentUrls.map(segment => new URL(segment, baseUrl.toString()).toString());

            const allChunks = [];
            for (let i = 0; i < fullSegmentUrls.length; i++) {
                updateButtonState('downloading', { downloaded: i + 1, total: totalSegments });
                let chunk = await fetchUrl(fullSegmentUrls[i], 'arraybuffer');
                if (decryptionKey) {
                    updateButtonState('decrypting', { decrypted: i + 1, total: totalSegments });
                    chunk = decryptChunk(chunk, decryptionKey, iv || i);
                }
                allChunks.push(new Uint8Array(chunk));
            }

            updateButtonState('remuxing');
            if (!isMuxLoaded) throw new Error('Gagal remuxing: Library Mux.js tidak dapat dimuat.');

            const remuxedSegments = [];
            const transmuxer = new muxjs.mp4.Transmuxer();

            transmuxer.on('data', segment => {
                remuxedSegments.push(segment.initSegment);
                remuxedSegments.push(segment.data);
            });

            await new Promise((resolve, reject) => {
                transmuxer.on('done', resolve);
                transmuxer.on('error', reject);
                allChunks.forEach(chunk => transmuxer.push(chunk));
                transmuxer.flush();
            });

            // --- PERUBAHAN KUNCI: Mengambil Judul Video dari Tag <title> ---
            let videoTitle = `video_lengkap_${new Date().getTime()}`;
            if (document.title) {
                // Ambil bagian pertama dari judul tab, sebelum tanda " - "
                const mainTitle = document.title.split(' - ')[0];
                // Membersihkan judul dari karakter yang tidak valid untuk nama file
                videoTitle = mainTitle.trim().replace(/[\\?%*|:"<>]/g, '-');
                console.log(`Judul video ditemukan: "${videoTitle}"`);
            }

            const mediaBlob = new Blob(remuxedSegments, { type: 'video/mp4' });
            const anchor = document.createElement('a');
            anchor.href = URL.createObjectURL(mediaBlob);
            anchor.download = `${videoTitle}.mp4`;
            anchor.click();
            URL.revokeObjectURL(anchor.href);
            updateButtonState('found');

        } catch (error) {
            console.error('Gagal mengunduh stream lengkap:', error);
            alert(`Terjadi kesalahan: ${error.message}`);
            updateButtonState('error');
        }
    }

    function fetchUrl(url, responseType) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: responseType === 'arraybuffer' ? 'arraybuffer' : undefined,
                onload: (res) => {
                    if (res.status === 200) resolve(responseType === 'arraybuffer' ? res.response : res.responseText);
                    else reject(`Gagal mengambil: ${url} - Status: ${res.status}`);
                },
                onerror: (err) => reject(`Kesalahan jaringan saat mengambil: ${url}`)
            });
        });
    }

    function decryptChunk(encryptedData, key, iv) {
        const encryptedWords = CryptoJS.lib.WordArray.create(encryptedData);
        const keyWords = CryptoJS.lib.WordArray.create(key);
        let ivWords = iv;
        if (typeof iv === 'number') {
            const ivArray = new Uint8Array(16);
            for (let i = 15; i >= 0; i--) {
                ivArray[i] = iv & 0xff;
                iv >>= 8;
            }
            ivWords = CryptoJS.lib.WordArray.create(ivArray.buffer);
        }
        const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedWords }, keyWords, { iv: ivWords, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding });
        const latin1String = CryptoJS.enc.Latin1.stringify(decrypted);
        const decryptedUint8Array = new Uint8Array(latin1String.length);
        for (let i = 0; i < latin1String.length; i++) {
            decryptedUint8Array[i] = latin1String.charCodeAt(i);
        }
        return decryptedUint8Array.buffer;
    }

    function setupObserver() {
        const observer = new MutationObserver((_, obs) => {
            if (document.querySelector('video')) {
                createButtons();
                obs.disconnect();
            }
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            new MutationObserver((_, obs) => {
                if (document.body) {
                    observer.observe(document.body, { childList: true, subtree: true });
                    obs.disconnect();
                }
            }).observe(document.documentElement, { childList: true });
        }
    }

    setupObserver();
})();
