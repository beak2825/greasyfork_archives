// ==UserScript==
// @name         WhatsApp View Once Media Saver (No Download)
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Save WhatsApp View Once photos and videos by sending them to a backend without downloading locally.
// @author       MehmetCanWT
// @match        https://web.whatsapp.com/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/534188/WhatsApp%20View%20Once%20Media%20Saver%20%28No%20Download%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534188/WhatsApp%20View%20Once%20Media%20Saver%20%28No%20Download%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("[MediaSaver] Script started...");

    const debugLog = (message, data) => {
        console.log(`[MediaSaver] ${message}`, data || '');
    };

    const API_URL = "https://view-once-backend.onrender.com/save-media";
    const processedHashes = new Set(); // Hash'leri izleyerek tekrar işlem yapılmasını engeller

    // Hash hesaplama fonksiyonu
    const generateHash = async (data) => {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    // API'ye fotoğraf veya video gönderme
    const sendMediaToAPI = async (base64data, type, hash) => {
        if (processedHashes.has(hash)) {
            debugLog(`Media already processed (hash: ${hash}). Skipping API call.`);
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({ media: base64data, hash, type }),
            onload: (response) => {
                if (response.status === 201) {
                    debugLog("Media sent to API successfully:", response.responseText);

                    // API'ye başarıyla gönderildikten sonra hash'i işaretle
                    debugLog(`Media successfully sent. Marking hash as processed: ${hash}`);
                    processedHashes.add(hash);
                    base64data = null; // Base64 verisini bellekten temizle
                } else if (response.status === 409) {
                    debugLog("Duplicate media detected. Skipping...");
                    processedHashes.add(hash); // Duplicate olsa bile hash'i işaretle
                } else {
                    debugLog("Error sending media to API:", response.responseText);
                }
            },
            onerror: (err) => {
                debugLog("Error sending media to API:", err);
            },
        });
    };

    // Fotoğraf veya video bloblarını işleme
    const processBlobMedia = (mediaElement, type) => {
        if (!mediaElement || !mediaElement.src.startsWith('blob:') || mediaElement.dataset.processed) return;

        mediaElement.dataset.processed = "true";
        debugLog(`${type} blob detected, processing...`);

        fetch(mediaElement.src)
            .then((res) => res.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64data = reader.result;
                    debugLog(`${type} blob converted to Base64.`);

                    const hash = await generateHash(base64data);
                    if (processedHashes.has(hash)) {
                        debugLog(`Media already processed (hash: ${hash}). Skipping further actions.`);
                        return;
                    }

                    sendMediaToAPI(base64data, type, hash); // API'ye gönder
                };
                reader.readAsDataURL(blob);
            })
            .catch((err) => debugLog(`Error processing ${type} blob:`, err));
    };

    // MutationObserver: DOM'daki değişiklikleri izler
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    // Fotoğrafları algıla
                    const images = node.querySelectorAll('img');
                    images.forEach((img) => processBlobMedia(img, 'photo'));

                    // Videoları algıla
                    const videos = node.querySelectorAll('video');
                    videos.forEach((video) => processBlobMedia(video, 'video'));
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    debugLog("MutationObserver started, monitoring DOM...");
})();