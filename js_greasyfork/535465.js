// ==UserScript==
// @name         Perchance Image Replacer (Vietnamese Version) - Multi-Key & Contextual Sub-Tags v1.7.5
// @namespace    http://tampermonkey.net/
// @version      1.7.5
// @description  Tìm prompt, hiển thị nút "Tạo". Giữ lại ảnh cũ, thêm điều hướng ảnh. Lưu tag phụ khi tải lại trang. Cache IndexedDB, quản lý userKey. Menu chỉnh sửa prompt style & tag phụ. Giao diện nền tối. Thêm chức năng Xuất/Nhập dữ liệu. Panel đáp ứng tốt hơn trên di động.
// @author       Dựa trên ý tưởng của bạn & Gemini & Claude
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      image-generation.perchance.org
// @connect      perchance.org
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535465/Perchance%20Image%20Replacer%20%28Vietnamese%20Version%29%20-%20Multi-Key%20%20Contextual%20Sub-Tags%20v175.user.js
// @updateURL https://update.greasyfork.org/scripts/535465/Perchance%20Image%20Replacer%20%28Vietnamese%20Version%29%20-%20Multi-Key%20%20Contextual%20Sub-Tags%20v175.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROMPT_REGEX = /(?:image|img)###([^#]+)###/gi;
    const CREATE_URL = 'https://image-generation.perchance.org/api/generate';
    const DOWNLOAD_URL = 'https://image-generation.perchance.org/api/downloadTemporaryImage';
    const VERIFY_KEY_URL = 'https://image-generation.perchance.org/api/checkUserVerificationStatus';
    const KEY_FETCH_PAGE = 'https://perchance.org/ai-text-to-image-generator';
    const PERCHANCE_IFRAME_PANEL_PATH_FALLBACK = 'ai-image-generator-panel';

    const USER_KEYS_STORAGE = 'perchanceUserKeys_v4_multi';
    const MAX_STORED_KEYS = 5;
    const PROMPT_PRESETS_STORAGE = 'perchancePromptPresets_v1';
    const KEYWORD_SUBTAG_MAP_STORAGE = 'perchanceKeywordSubTagMap_v1';
    const DETAILED_PROMPTS_STORAGE = 'perchanceDetailedPrompts_v1'; // For persisting detailed tags
    const SCRIPT_SETTINGS_STORAGE = 'perchanceScriptSettings_v1'; // For general script settings if needed in future

    let ANIME_STYLE_DEFINITION = {
        positive: '(sharp_focus, pale_male, An 8k hyper-anime, HDR photo, highly detailed, split-complementary color palette, UHD, hyperrealistic, casting shadow style, vivid, clear shadows and highlights, intense, enhanced contrast, best quality, masterpiece, well-structured, vibrant colors, dynamic lighting, high resolution, sharp focus, crisp details, smooth texture, clean lines, highly polished, accurate proportions, age-appropriate features, natural skin tones, anime natural facial features, realistic age portrayal, subtle age details, refined character depth, soft, natural lighting, gentle, expressive shadows, nuanced facial contours, detailed, lifelike textures, artistically integrated age signs when applicable, flexible racial/spesies features.) NSFW, Uncensored Hentai Artwork, Ecchi, Explicit Scenes, Adult Content, Explicit Sexual Acts, Visual Hentai',
        negative: '(low quality, worst quality:1.3), text, watermark, signature, title, overused, generic, cliché, unoriginal, bland, uninspired, conventional, inconsistent style, mismatched elements, clashing colors, disjointed composition, uneven proportions, incoherent design, unbalanced layout, disorganized appearance, randomized elements, asymmetrical features, overused, predictable, wrong sex, wrong gender, wrong species, wrong age, misleading gender presentation, incorrect intimacy positioning, unnatural intimacy, distorted features, harsh lighting, overly saturated colors, cluttered background, unrealistic proportions, lack of detail, exaggerated expressions, pixelated or low-quality image, anatomical inaccuracies, mutations, deformities, disfigurements, grotesque elements, unnatural body proportions, blurred, jpeg artifacts, cropped, cut-off, flat shading, unnatural line integration with background, stiff poses, unnatural skin textures, overexposed areas, underexposed areas, excessive noise, artificial-looking shadows, disproportionate hands, large or creepy fingers and toes, deformities in close-up shots'
    };
    let DEFAULT_NEGATIVE_PROMPT_BASE = '';

    let subTagModal = null;
    let currentEditingTagElement = null;
    let originalLoadedKeywordGroupState = { keywords: [], subTags: [] };

    const DB_NAME = 'perchanceImageCacheDB_multi_v2';
    const DB_VERSION = 1;
    const IMAGE_STORE_NAME = 'images';
    let db;
    let activeRequests = new Set();
    let mutationObserver = null;
    let sillyTavernMenuIntegrationInterval = null;

    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .perchance-prompt-container {
                display: inline-block; vertical-align: middle; margin: 0 2px;
                padding: 8px; border: 1px solid #4f4f4f;
                border-radius: 5px; background-color: #3a3a3a;
                color: #f0f0f0; font-family: sans-serif;
            }
            .perchance-main-tags-area { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
            .perchance-main-tag-wrapper {
                display: flex; align-items: center; background-color: #4a4a4a;
                color: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-size: 0.9em;
            }
            .perchance-main-tag-text { margin-right: 5px; }
            .edit-subtags-btn { background-color: #4CAF50; color: white; border: none; border-radius: 3px; padding: 2px 6px; font-size: 0.85em; cursor: pointer; margin-left: 3px; }
            .edit-subtags-btn:hover { background-color: #45a049; }
            .perchance-generate-btn { padding: 4px 10px; font-size: 13px; line-height: 1.4; cursor: pointer; border: 1px solid #0056b3; border-radius: 4px; background-color: #007bff; color: white; margin-right: 4px; }
            .perchance-generate-btn:hover { background-color: #0069d9; }
            .perchance-generate-btn:disabled { background-color: #555; color: #aaa; border-color: #444; cursor: not-allowed; }
            .perchance-image-placeholder { margin-top: 8px; min-height: 20px; text-align: left; }
            .perchance-image-placeholder img { max-width: 100%; display: block; border-radius: 4px; margin-top: 8px; }
            .perchance-image-placeholder img:not(.active-gallery-image) { display: none; } /* Hide non-active gallery images */
            .perchance-image-placeholder hr { border: none; border-top: 1px solid #555; margin: 10px 0; }

            .perchance-image-nav-controls { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 5px; }
            .perchance-image-nav-controls button { background-color: #555; color: white; border: 1px solid #777; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.9em; }
            .perchance-image-nav-controls button:disabled { background-color: #333; color: #666; cursor: not-allowed; }
            .perchance-image-nav-counter { font-size: 0.9em; color: #ccc; }


            .placeholder-status-info { font-size:0.85em; color: #bbbbbb; padding: 2px 0; }
            .placeholder-error { color:#ff9999; border:1px solid #cc3333; background-color: #4d0000; padding:4px 6px; margin:0; font-size:0.85em; border-radius: 3px; }
            .placeholder-warning { color:#ffd799; border:1px solid #cc8800; background-color: #4d3300; padding:4px 6px; margin:0; font-size:0.85em; border-radius: 3px; }

            #subTagModal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background-color: #3a3a3a; color: white; padding: 20px;
                border: 1px solid #666; border-radius: 8px; z-index: 10002;
                display: none; width: 90%; max-width: 600px; /* Responsive width */
                max-height: 90vh; /* Consistent max height */
                box-shadow: 0 8px 20px rgba(0,0,0,0.6); font-family: sans-serif;
                display: flex; flex-direction: column; /* For better internal layout */
            }
            #subTagModal h3 { margin-top: 0; border-bottom: 1px solid #555; padding-bottom:10px; font-size: 1.3em; }
            #subTagModal p { font-size:0.9em; color:#ccc; margin-top:-5px; margin-bottom:15px; }
            #subTagListContainer {
                display: flex; flex-wrap: wrap; gap: 8px;
                overflow-y: auto; padding: 10px; background-color: #2c2c2c;
                border-radius: 4px; margin-bottom: 15px;
                flex-grow: 1; /* Allow container to take available space */
                min-height: 100px; /* Minimum height for the list */
                max-height: 50vh; /* Max height for list on smaller screens, adjust as needed */
            }
            #subTagModalButtons { text-align: right; margin-top: 20px; flex-shrink: 0; /* Prevent buttons from shrinking */ }
            #subTagModalButtons button { padding: 10px 18px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; font-size: 0.95em; }
            #applySubTagsBtn { background-color: #28a745; color: white; }
            #applySubTagsBtn:hover { background-color: #218838; }
            #closeSubTagModalBtn { background-color: #6c757d; color: white; }
            #closeSubTagModalBtn:hover { background-color: #5a6268; }

            .keyword-subtag-manager, .data-management-section { border-top: 1px solid #555; margin-top: 20px; padding-top: 15px; }
            .keyword-subtag-manager h4, .data-management-section h4 { margin-top: 0; margin-bottom: 10px; font-size: 1.2em; }
            .keyword-list-area { margin-bottom: 10px; }
            .keyword-list-area label, .associated-tags-area label, .keyword-edit-area label, .data-management-section label { display: block; margin-bottom: 6px; font-size: 0.95em; }
            #keywordSelector, #keywordNameInput, #associatedSubTagsTextarea { width: 100%; padding: 10px; background-color: #333; color: white; border: 1px solid #555; border-radius: 4px; box-sizing: border-box; margin-bottom:12px; font-size: 0.95em; }
            .keyword-actions button, .data-management-section button { padding: 10px 15px; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right:8px; font-size: 0.9em; }
            .keyword-actions button#saveKeywordMappingBtn { background-color: #3498db; }
            .keyword-actions button#saveKeywordMappingBtn:hover { background-color: #2980b9; }
            .keyword-actions button.delete { background-color: #e74c3c; }
            .keyword-actions button.delete:hover { background-color: #c0392b; }
            .data-management-section input[type="file"] { display: none; } /* Hide default file input */
            .data-management-section .file-input-label { background-color: #5bc0de; color: white; padding: 10px 15px; border-radius: 4px; cursor: pointer; display: inline-block; margin-right: 8px; font-size: 0.9em; }
            .data-management-section .file-input-label:hover { background-color: #31b0d5; }
            #data-management-status { margin-top:10px; font-size:0.9em; color:#ccc; }


            #perchance-prompt-menu-panel { font-family: sans-serif; }
            #perchance-prompt-menu-panel h2 { font-size: 1.6em; }
            #perchance-prompt-menu-panel label { font-size: 0.95em; }
            #perchance-prompt-menu-panel select, #perchance-prompt-menu-panel textarea, #perchance-prompt-menu-panel input[type="text"] {
                padding: 10px; font-size: 0.95em;
            }
            #perchance-prompt-menu-panel button { padding: 10px 15px; font-size: 0.9em; }
        `;
        document.head.appendChild(style);
    }

    // --- User Key Management ---
    function getStoredUserKeys() {
        const keysJson = GM_getValue(USER_KEYS_STORAGE, JSON.stringify([]));
        try { const keys = JSON.parse(keysJson); return Array.isArray(keys) ? keys.filter(key => typeof key === 'string' && /^[a-f0-9]{64}$/.test(key)) : []; }
        catch (e) { console.error("Lỗi JSON UserKeys:", e); return []; }
    }
    function saveUserKeys(keys) {
        const uniqueKeys = [...new Set(keys)].filter(key => typeof key === 'string' && /^[a-f0-9]{64}$/.test(key));
        if (uniqueKeys.length > MAX_STORED_KEYS) { uniqueKeys.splice(0, uniqueKeys.length - MAX_STORED_KEYS); }
        GM_setValue(USER_KEYS_STORAGE, JSON.stringify(uniqueKeys)); return uniqueKeys;
    }
    function addAndSaveUserKey(newKey) {
        if (!newKey || typeof newKey !== 'string' || !/^[a-f0-9]{64}$/.test(newKey)) { console.warn("Key không hợp lệ:", newKey); return getStoredUserKeys(); }
        let keys = getStoredUserKeys(); const existingIndex = keys.indexOf(newKey);
        if (existingIndex > -1) { keys.splice(existingIndex, 1); }
        keys.push(newKey); return saveUserKeys(keys);
    }
    function removeAndSaveUserKey(keyToRemove) {
        let keys = getStoredUserKeys(); const index = keys.indexOf(keyToRemove);
        if (index > -1) { keys.splice(index, 1); keys = saveUserKeys(keys); console.log(`Đã xóa key ...${keyToRemove.slice(-6)}.`); }
        return keys;
    }

    // --- IndexedDB Management ---
    async function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = (event) => { console.error("Lỗi IndexedDB:", event.target.error); reject(event.target.error); };
            request.onsuccess = (event) => { db = event.target.result; console.log("IndexedDB đã mở."); resolve(db); };
            request.onupgradeneeded = (event) => {
                const store = event.target.result.createObjectStore(IMAGE_STORE_NAME, { keyPath: 'promptKey' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            };
        });
    }
    async function storeImage(promptKey, base64Image) {
        if (!db) { console.error("DB chưa sẵn sàng."); return; }
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(IMAGE_STORE_NAME);
            const request = store.put({ promptKey: promptKey, image: base64Image, timestamp: Date.now() });
            request.onsuccess = () => resolve();
            request.onerror = (event) => { console.error(`Lỗi lưu ảnh ${promptKey.substring(0,10)}...:`, event.target.error); reject(event.target.error); };
        });
    }
    async function getCachedImage(promptKey) {
        if (!db) { console.error("DB chưa sẵn sàng."); return null; }
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([IMAGE_STORE_NAME], 'readonly');
            const store = transaction.objectStore(IMAGE_STORE_NAME);
            const request = store.get(promptKey);
            request.onsuccess = (event) => resolve(event.target.result ? event.target.result.image : null);
            request.onerror = (event) => { console.error(`Lỗi lấy cache ${promptKey.substring(0,10)}...:`, event.target.error); reject(event.target.error); };
        });
    }
    async function getAllCachedImages() {
        if (!db) { console.error("DB chưa sẵn sàng."); return []; }
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([IMAGE_STORE_NAME], 'readonly');
            const store = transaction.objectStore(IMAGE_STORE_NAME);
            const request = store.getAll();
            request.onsuccess = (event) => resolve(event.target.result || []);
            request.onerror = (event) => { console.error("Lỗi lấy tất cả ảnh cache:", event.target.error); reject(event.target.error); };
        });
    }
    async function clearAndStoreImages(imagesArray) {
        if (!db) { console.error("DB chưa sẵn sàng."); return; }
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([IMAGE_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(IMAGE_STORE_NAME);
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => {
                if (imagesArray && imagesArray.length > 0) {
                    let count = 0;
                    imagesArray.forEach(imgData => {
                        const putRequest = store.put(imgData);
                        putRequest.onsuccess = () => {
                            count++;
                            if (count === imagesArray.length) resolve();
                        };
                        putRequest.onerror = (event) => {
                            console.error(`Lỗi ghi ảnh ${imgData.promptKey ? imgData.promptKey.substring(0,10) : 'UNKNOWN'}... vào DB:`, event.target.error);
                            // Tiếp tục với các ảnh khác
                            count++;
                            if (count === imagesArray.length) resolve(); // Vẫn resolve để hoàn tất quá trình nhập
                        };
                    });
                } else {
                    resolve(); // Không có ảnh để nhập
                }
            };
            clearRequest.onerror = (event) => { console.error("Lỗi xóa ảnh cache cũ:", event.target.error); reject(event.target.error); };
        });
    }


    // --- Blob to Base64 ---
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
        });
    }

    // --- Automatic User Key Fetching ---
    async function fetchUserKeyAutomatically(showMessages = false) {
        if (showMessages) console.log(`Đang thử tự động lấy userKey từ ${KEY_FETCH_PAGE}...`);
        try {
            const mainPageResponse = await new Promise((resolve, reject) => GM_xmlhttpRequest({ method: "GET", url: KEY_FETCH_PAGE, onload: resolve, onerror: () => reject(new Error('Lỗi mạng (trang chính).')), ontimeout: () => reject(new Error('Timeout (trang chính).')) }));
            if (mainPageResponse.status !== 200) throw new Error(`Lỗi tải trang lấy key: ${mainPageResponse.status}`);
            const parser = new DOMParser(); const mainDoc = parser.parseFromString(mainPageResponse.responseText, "text/html");
            let iframeSrc; const mainIframe = mainDoc.querySelector('iframe#main');
            if (mainIframe && mainIframe.getAttribute('src')) { iframeSrc = new URL(mainIframe.getAttribute('src'), KEY_FETCH_PAGE).href; }
            else { const panelIframe = mainDoc.querySelector(`iframe[src*="${PERCHANCE_IFRAME_PANEL_PATH_FALLBACK}"]`); iframeSrc = panelIframe ? new URL(panelIframe.getAttribute('src'), KEY_FETCH_PAGE).href : new URL(PERCHANCE_IFRAME_PANEL_PATH_FALLBACK, new URL(KEY_FETCH_PAGE).origin).href; }
            if (!iframeSrc) throw new Error('Không thể xác định URL iframe chứa userKey.');
            const iframeResponse = await new Promise((resolve, reject) => GM_xmlhttpRequest({ method: "GET", url: iframeSrc, onload: resolve, onerror: () => reject(new Error(`Lỗi mạng (iframe ${iframeSrc}).`)), ontimeout: () => reject(new Error(`Timeout (iframe ${iframeSrc}).`)) }));
            if (iframeResponse.status !== 200) throw new Error(`Lỗi tải iframe (${iframeSrc}): ${iframeResponse.status}`);
            const iframeContent = iframeResponse.responseText; const keyRegex = /userKey(?:["']?:["']?|\s*=\s*['"]?)([a-f0-9]{64})['"]?/gi;
            let regexMatch; const potentialKeys = new Set();
            while ((regexMatch = keyRegex.exec(iframeContent)) !== null) potentialKeys.add(regexMatch[1]);
            if (potentialKeys.size === 0 && showMessages) console.warn(`Không tìm thấy userKey nào trong iframe từ ${iframeSrc}.`);
            for (const potentialKey of potentialKeys) {
                const verificationParams = new URLSearchParams({ 'userKey': potentialKey, '__cacheBust': Math.random().toString() });
                try {
                    const verificationResponseText = await new Promise((resolve, reject) => GM_xmlhttpRequest({ method: "GET", url: `${VERIFY_KEY_URL}?${verificationParams.toString()}`, onload: (r) => r.status === 200 ? resolve(r.responseText) : reject(new Error(`Trạng thái ${r.status}`)), onerror: () => reject(new Error('Lỗi mạng (xác minh).')), ontimeout: () => reject(new Error('Timeout (xác minh).')) }));
                    if (verificationResponseText && verificationResponseText.includes('verified') && !verificationResponseText.includes('not_verified')) {
                        if (showMessages) console.log(`UserKey tự động: ...${potentialKey.slice(-6)} (Đã xác minh từ ${iframeSrc})`);
                        addAndSaveUserKey(potentialKey); return potentialKey;
                    } else if (showMessages) console.log(`Key ...${potentialKey.slice(-6)} xác minh thất bại. Resp:`, verificationResponseText.substring(0,100));
                } catch (verifyError) { if (showMessages) console.warn(`Lỗi xác minh key ...${potentialKey.slice(-6)}: ${verifyError.message}`); }
            }
            if (showMessages) console.warn(`Không tìm thấy userKey hợp lệ tự động từ ${iframeSrc}.`); return null;
        } catch (error) { if (showMessages) console.error("Lỗi tự động lấy userKey:", error.message); return null; }
    }
    async function promptForUserKey(message) {
        const userKeyInput = prompt(message + `\n\n(Mẹo: Truy cập ${KEY_FETCH_PAGE}, mở Developer Tools (F12) > Network tab, thử tạo một hành động nào đó trên trang. Tìm request có 'userKey=xxx...' trong URL hoặc payload, copy phần giá trị 64 ký tự của userKey đó.)`);
        if (userKeyInput) {
            const trimmedKey = userKeyInput.trim();
            if (/^[a-f0-9]{64}$/.test(trimmedKey)) { addAndSaveUserKey(trimmedKey); console.log(`Đã lưu userKey: ...${trimmedKey.slice(-6)}`); return trimmedKey; }
            else { alert("Định dạng userKey không đúng."); }
        } return null;
    }

    // --- API Calls ---
    async function generateImageApi(promptText, negativePromptText, userKeyToUse, resolution = '512x768', guidanceScale = '7') {
        const createParams = new URLSearchParams({ 'prompt': promptText, 'negativePrompt': negativePromptText, 'userKey': userKeyToUse, '__cache_bust': Math.random().toString(), 'seed': '-1', 'resolution': resolution, 'guidanceScale': guidanceScale.toString(), 'channel': 'ai-text-to-image-generators', 'subChannel': 'public', 'requestId': Math.random().toString() });
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: `${CREATE_URL}?${createParams.toString()}`, headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json, text/plain, */*", "Referer": "https://perchance.org/" },
                onload: async function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status === 'success' && data.imageId) resolve(data.imageId);
                        else if (data.status === 'invalid_key' || (data.error && data.error.includes('invalid_key'))) { console.error(`UserKey ...${userKeyToUse.slice(-6)} không hợp lệ.`); reject(new Error('INVALID_KEY_API_ERROR')); }
                        else reject(new Error(data.message || data.error || 'Lỗi API Perchance.'));
                    } catch (e) { reject(new Error(response.responseText.includes("<!doctype html>") ? 'API Perchance trả về HTML.' : `Lỗi phân tích JSON: ${e.message}`)); }
                },
                onerror: (err) => { console.error("GM_xmlhttpRequest error:", err); reject(new Error('Lỗi mạng khi tạo ảnh.')); },
                ontimeout: () => reject(new Error('Timeout tạo ảnh.'))
            });
        });
    }
    async function downloadImageApi(imageId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: `${DOWNLOAD_URL}?imageId=${imageId}`, responseType: 'blob', headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/webp,image/jpeg,image/png,*/*", "Referer": "https://perchance.org/" },
                onload: (r) => (r.status === 200 && r.response) ? resolve(r.response) : reject(new Error(`Lỗi tải ảnh: ${r.status}`)),
                onerror: (err) => { console.error("GM_xmlhttpRequest error:", err); reject(new Error('Lỗi mạng khi tải ảnh.')); },
                ontimeout: () => reject(new Error('Timeout tải ảnh.'))
            });
        });
    }

    // --- Tag Parsing and Formatting ---
    function parseDetailedTag(detailedValue) {
        const match = detailedValue.match(/^([^(]+)(?:\(\(\(([^)]+)\)\)\))?$/);
        if (match) {
            const mainTag = match[1].trim();
            const subTagsString = match[2];
            const subTags = subTagsString ? subTagsString.split(',').map(s => s.trim()).filter(s => s) : [];
            return { mainTag, subTags };
        }
        return { mainTag: detailedValue.trim(), subTags: [] };
    }
    function formatDetailedTag(mainTag, subTagsArray) {
        if (subTagsArray.length === 0) return mainTag;
        return `${mainTag}(((${subTagsArray.join(', ')})))`;
    }

    // --- Keyword-SubTag Mappings Management ---
    function getKeywordSubTagMap() {
        const mapJson = GM_getValue(KEYWORD_SUBTAG_MAP_STORAGE, JSON.stringify({}));
        try {
            const map = JSON.parse(mapJson);
            for (const key in map) {
                if (Array.isArray(map[key])) {
                    map[key] = map[key].map(String).filter(s => s.trim() !== "");
                } else { delete map[key]; }
            }
            return map;
        }
        catch (e) { console.error("Error parsing KeywordSubTagMap:", e); return {}; }
    }
    function saveKeywordSubTagMap(map) {
        GM_setValue(KEYWORD_SUBTAG_MAP_STORAGE, JSON.stringify(map));
    }

    // --- Sub-Tag Modal ---
    function createSubTagModal() {
        if (document.getElementById('subTagModal')) return;
        subTagModal = document.createElement('div'); subTagModal.id = 'subTagModal';
        let modalHTML = `
            <h3>Chỉnh sửa Tag Phụ cho "<span id="editingMainTagText"></span>"</h3>
            <p>Các tag phụ được gợi ý theo từ khóa (nếu có) hoặc đã áp dụng trước đó. Chỉ những tag đã áp dụng mới được chọn sẵn.</p>
            <div id="subTagListContainer"></div>
            <div id="subTagModalButtons">
                <button id="applySubTagsBtn">Áp dụng</button>
                <button id="closeSubTagModalBtn">Đóng</button>
            </div>`;
        subTagModal.innerHTML = modalHTML; document.body.appendChild(subTagModal);

        const applyBtn = subTagModal.querySelector('#applySubTagsBtn');
        const closeBtn = subTagModal.querySelector('#closeSubTagModalBtn');

        applyBtn.addEventListener('click', () => {
            if (!currentEditingTagElement) return;
            const { mainTag } = parseDetailedTag(currentEditingTagElement.dataset.currentValue);
            const selectedSubTags = [];
            subTagModal.querySelectorAll('#subTagListContainer input[type="checkbox"]:checked').forEach(cb => {
                selectedSubTags.push(cb.value);
            });
            const newDetailedValue = formatDetailedTag(mainTag, selectedSubTags);
            currentEditingTagElement.dataset.currentValue = newDetailedValue;
            currentEditingTagElement.querySelector('.perchance-main-tag-text').textContent = newDetailedValue;

            const promptWrapper = currentEditingTagElement.closest('.perchance-prompt-container');
            if (promptWrapper && promptWrapper.dataset.rawPrompt) {
                const originalRawPrompt = promptWrapper.dataset.rawPrompt;
                const allCurrentDetailedValues = [];
                promptWrapper.querySelectorAll('.perchance-main-tag-wrapper').forEach(tagEl => {
                    allCurrentDetailedValues.push(tagEl.dataset.currentValue);
                });
                let detailedPromptsMap = GM_getValue(DETAILED_PROMPTS_STORAGE, {});
                try { detailedPromptsMap = JSON.parse(detailedPromptsMap) } catch(e) { detailedPromptsMap = {} } // Ensure it's an object
                detailedPromptsMap[originalRawPrompt] = allCurrentDetailedValues;
                GM_setValue(DETAILED_PROMPTS_STORAGE, JSON.stringify(detailedPromptsMap));
            }
            subTagModal.style.display = 'none';
        });
        closeBtn.addEventListener('click', () => { subTagModal.style.display = 'none'; });
    }

    function populateSubTagList(mainTagElement) {
        const listContainer = subTagModal.querySelector('#subTagListContainer');
        listContainer.innerHTML = '';
        const { mainTag: mainTagOnly, subTags: alreadyAppliedSubTags } = parseDetailedTag(mainTagElement.dataset.currentValue);
        let suggestedByKeywords = [];
        const keywordMap = getKeywordSubTagMap();
        for (const keyword in keywordMap) {
            if (mainTagOnly.toLowerCase().includes(keyword.toLowerCase())) {
                keywordMap[keyword].forEach(suggestedTag => {
                    if (!suggestedByKeywords.includes(suggestedTag)) { suggestedByKeywords.push(suggestedTag); }
                });
            }
        }
        const allDisplayableSubTags = [...new Set([...alreadyAppliedSubTags, ...suggestedByKeywords])].sort();
        if (allDisplayableSubTags.length === 0) {
            listContainer.innerHTML = '<p style="color:#aaa; font-style:italic; text-align:center; padding: 10px 0;">Không có tag phụ nào được áp dụng hoặc được gợi ý.</p>';
            return;
        }
        allDisplayableSubTags.forEach(subTag => {
            const item = document.createElement('label'); item.className = 'subtag-item';
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.value = subTag;
            if (alreadyAppliedSubTags.includes(subTag)) { checkbox.checked = true; }
            item.appendChild(checkbox); item.appendChild(document.createTextNode(` ${subTag}`));
            listContainer.appendChild(item);
        });
    }

    function showSubTagModal(mainTagWrapperElement) {
        if (!subTagModal) createSubTagModal();
        currentEditingTagElement = mainTagWrapperElement;
        const { mainTag } = parseDetailedTag(mainTagWrapperElement.dataset.currentValue);
        subTagModal.querySelector('#editingMainTagText').textContent = mainTag;
        populateSubTagList(mainTagWrapperElement);
        subTagModal.style.display = 'flex'; // Changed to flex to enable flex properties
    }

    // --- Image Navigation Functions ---
    function showImageAtIndex(imagePlaceholder, newIndex) {
        const galleryImages = Array.from(imagePlaceholder.querySelectorAll('img'));
        const navControls = imagePlaceholder.querySelector('.perchance-image-nav-controls');
        if (!galleryImages.length || !navControls) return;

        const currentIdx = parseInt(newIndex, 10);
        imagePlaceholder.dataset.currentImageIndex = currentIdx.toString();

        galleryImages.forEach((img, idx) => {
            img.style.display = (idx === currentIdx) ? 'block' : 'none';
            if (idx === currentIdx) img.classList.add('active-gallery-image');
            else img.classList.remove('active-gallery-image');
        });

        const counterSpan = navControls.querySelector('.perchance-image-nav-counter');
        const prevBtn = navControls.querySelector('.prev-image-btn');
        const nextBtn = navControls.querySelector('.next-image-btn');

        if (counterSpan) counterSpan.textContent = `${currentIdx + 1} / ${galleryImages.length}`;
        if (prevBtn) prevBtn.disabled = (currentIdx === 0);
        if (nextBtn) nextBtn.disabled = (currentIdx === galleryImages.length - 1);
    }

    function updateImageNavigation(imagePlaceholder) {
        let navControls = imagePlaceholder.querySelector('.perchance-image-nav-controls');
        const galleryImages = Array.from(imagePlaceholder.querySelectorAll('img'));

        if (navControls) navControls.remove();

        if (galleryImages.length <= 1) {
            galleryImages.forEach(img => {
                img.style.display = 'block';
                img.classList.add('active-gallery-image');
            });
            return;
        }

        navControls = document.createElement('div');
        navControls.className = 'perchance-image-nav-controls';

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Trước';
        prevBtn.className = 'prev-image-btn';
        prevBtn.onclick = () => {
            let currentIndex = parseInt(imagePlaceholder.dataset.currentImageIndex || "0", 10);
            if (currentIndex > 0) showImageAtIndex(imagePlaceholder, currentIndex - 1);
        };

        const counterSpan = document.createElement('span');
        counterSpan.className = 'perchance-image-nav-counter';

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Sau';
        nextBtn.className = 'next-image-btn';
        nextBtn.onclick = () => {
            let currentIndex = parseInt(imagePlaceholder.dataset.currentImageIndex || "0", 10);
            if (currentIndex < galleryImages.length - 1) showImageAtIndex(imagePlaceholder, currentIndex + 1);
        };

        navControls.appendChild(prevBtn);
        navControls.appendChild(counterSpan);
        navControls.appendChild(nextBtn);
        imagePlaceholder.appendChild(navControls);

        const initialIndex = parseInt(imagePlaceholder.dataset.currentImageIndex || "0", 10);
        showImageAtIndex(imagePlaceholder, Math.min(initialIndex, galleryImages.length - 1));
    }


    // --- Handle Generate Click ---
    async function handleGenerateClick(event) {
        const button = event.target;
        const promptWrapper = button.closest('.perchance-prompt-container');
        const imagePlaceholder = promptWrapper ? promptWrapper.querySelector('.perchance-image-placeholder') : null;
        if (!promptWrapper || !imagePlaceholder) { console.error("Thiếu thông tin."); return; }

        const mainTagElements = promptWrapper.querySelectorAll('.perchance-main-tag-wrapper');
        let detailedMainTags = [];
        mainTagElements.forEach(tagEl => { detailedMainTags.push(tagEl.dataset.currentValue); });
        const basePromptFromTags = detailedMainTags.join(', ');
        const finalDetailedPromptForHashing = `${basePromptFromTags}, ${ANIME_STYLE_DEFINITION.positive}`;
        const detailedPromptKey = CryptoJS.MD5(finalDetailedPromptForHashing + ANIME_STYLE_DEFINITION.negative).toString();

        const action = button.dataset.action || 'generate';
        button.disabled = true; activeRequests.add(detailedPromptKey);

        if (action === 'generate') {
            const cachedImage = await getCachedImage(detailedPromptKey);
            if (cachedImage) {
                imagePlaceholder.innerHTML = '';
                const img = document.createElement('img');
                img.src = cachedImage; img.alt = `${basePromptFromTags.substring(0,30)}... (cache)`; img.title = img.alt;
                img.style.border = "2px solid #00bcd4";
                imagePlaceholder.appendChild(img);
                updateImageNavigation(imagePlaceholder);
                button.textContent = 'Tạo lại'; button.dataset.action = 'regenerate';
                button.disabled = false; activeRequests.delete(detailedPromptKey);
                console.log(`Ảnh "${basePromptFromTags.substring(0,30)}..." từ cache.`); return;
            }
        }

        const statusMessages = imagePlaceholder.querySelectorAll('span.placeholder-status-info, p.placeholder-error, p.placeholder-warning');
        statusMessages.forEach(msg => msg.remove());
        const preparingMsg = document.createElement('span');
        preparingMsg.className = 'placeholder-status-info';
        preparingMsg.textContent = 'Đang chuẩn bị...';
        imagePlaceholder.insertBefore(preparingMsg, imagePlaceholder.firstChild);


        let currentKeysInStorage = getStoredUserKeys(); let keysAttemptedInThisRun = new Set(); let newKeyFetchedInThisRun = false;

        while (true) {
            let keyToTry = null;
            for (let i = currentKeysInStorage.length - 1; i >= 0; i--) {
                const storedKey = currentKeysInStorage[i];
                if (!keysAttemptedInThisRun.has(storedKey)) { keyToTry = storedKey; break; }
            }
            if (!keyToTry && !newKeyFetchedInThisRun) {
                newKeyFetchedInThisRun = true;
                preparingMsg.textContent = 'Đang lấy key mới...';
                const autoKey = await fetchUserKeyAutomatically(true);
                if (autoKey && !keysAttemptedInThisRun.has(autoKey)) keyToTry = autoKey;
                if (!keyToTry) {
                    const promptedKey = await promptForUserKey("Hết key hoặc lấy key tự động thất bại. Vui lòng nhập Perchance userKey:");
                    if (promptedKey && !keysAttemptedInThisRun.has(promptedKey)) keyToTry = promptedKey;
                }
                currentKeysInStorage = getStoredUserKeys();
            }
            if (!keyToTry) {
                preparingMsg.remove();
                const errorMsg = document.createElement('p'); errorMsg.className = 'placeholder-error';
                errorMsg.textContent = 'Hết key hoặc không lấy được key mới.';
                imagePlaceholder.insertBefore(errorMsg, imagePlaceholder.firstChild);
                button.textContent = 'Hết key! Tạo lại'; button.dataset.action = 'generate'; break;
            }
            keysAttemptedInThisRun.add(keyToTry); button.textContent = `Tạo... (${keysAttemptedInThisRun.size})`;
            preparingMsg.textContent = `Đang thử key ...${keyToTry.slice(-6)}`;
            try {
                const finalPrompt = `${basePromptFromTags}, ${ANIME_STYLE_DEFINITION.positive}`;
                const finalNegativePrompt = `${ANIME_STYLE_DEFINITION.negative}${DEFAULT_NEGATIVE_PROMPT_BASE ? ', ' + DEFAULT_NEGATIVE_PROMPT_BASE : ''}`;
                const imageId = await generateImageApi(finalPrompt, finalNegativePrompt, keyToTry);
                const imageBlob = await downloadImageApi(imageId); const base64Image = await blobToBase64(imageBlob);
                await storeImage(detailedPromptKey, base64Image);

                preparingMsg.remove();

                const newImg = document.createElement('img');
                newImg.src = base64Image;
                newImg.alt = `${basePromptFromTags.substring(0,30)}... (mới)`; newImg.title = newImg.alt;
                newImg.style.border = "2px solid #4caf50";

                const firstChildIsImageOrHr = imagePlaceholder.firstChild && (imagePlaceholder.firstChild.tagName === 'IMG' || imagePlaceholder.firstChild.tagName === 'HR');
                if (firstChildIsImageOrHr) {
                    const spacer = document.createElement('hr');
                    imagePlaceholder.insertBefore(spacer, imagePlaceholder.firstChild);
                }
                imagePlaceholder.insertBefore(newImg, imagePlaceholder.firstChild);
                imagePlaceholder.dataset.currentImageIndex = "0";
                updateImageNavigation(imagePlaceholder);

                button.textContent = 'Tạo lại'; button.dataset.action = 'regenerate';
                addAndSaveUserKey(keyToTry); console.log(`Ảnh "${basePromptFromTags.substring(0,30)}..." tạo OK với key ...${keyToTry.slice(-6)}.`); break;
            } catch (error) {
                if (error.message === 'INVALID_KEY_API_ERROR') {
                    console.warn(`Key ...${keyToTry.slice(-6)} không hợp lệ. Xóa.`); removeAndSaveUserKey(keyToTry); currentKeysInStorage = getStoredUserKeys();
                    preparingMsg.textContent = `Key ...${keyToTry.slice(-6)} không hợp lệ. Thử key khác...`;
                } else {
                    console.error(`Lỗi tạo ảnh key ...${keyToTry.slice(-6)}:`, error);
                    preparingMsg.remove();
                    const errorMsg = document.createElement('p'); errorMsg.className = 'placeholder-error';
                    errorMsg.textContent = `Lỗi: ${error.message}.`;
                    imagePlaceholder.insertBefore(errorMsg, imagePlaceholder.firstChild);
                    button.textContent = 'Lỗi! Tạo lại'; button.dataset.action = 'generate'; break;
                }
            }
        }
        activeRequests.delete(detailedPromptKey); button.disabled = false;
        if (!imagePlaceholder.querySelector('img.active-gallery-image') && (button.textContent.startsWith('Tạo...') || button.textContent.startsWith('Hết key!'))) {
            if (!imagePlaceholder.querySelector('.placeholder-error') && !imagePlaceholder.querySelector('.placeholder-warning')) {
                 const warnMsg = document.createElement('p'); warnMsg.className = 'placeholder-warning';
                 warnMsg.textContent = 'Không thể hoàn tất yêu cầu.';
                 if (preparingMsg && preparingMsg.parentNode) preparingMsg.remove();
                 imagePlaceholder.insertBefore(warnMsg, imagePlaceholder.firstChild);
            }
            if (button.textContent.startsWith('Tạo...')) button.textContent = 'Thất bại! Tạo lại';
            button.dataset.action = 'generate';
        }
    }

    // --- Process Node ---
    function processNode(node, targetDocument) {
        if (node.nodeType === Node.TEXT_NODE) {
            let match; let lastIndex = 0; const textContent = node.nodeValue; const parent = node.parentNode;
            if (!parent || parent.closest('textarea, script, style, input, button, .perchance-prompt-container, [data-perchance-processed-parent="true"], #perchance-prompt-menu-panel, #subTagModal') || parent.isContentEditable) { return; }
            const fragment = targetDocument.createDocumentFragment(); let replaced = false; PROMPT_REGEX.lastIndex = 0;

            let detailedPromptsMap = GM_getValue(DETAILED_PROMPTS_STORAGE, "{}");
            try { detailedPromptsMap = JSON.parse(detailedPromptsMap); } catch(e) { detailedPromptsMap = {}; }


            while ((match = PROMPT_REGEX.exec(textContent)) !== null) {
                replaced = true; const rawFullPromptText = match[1].trim();
                if (match.index > lastIndex) { fragment.appendChild(targetDocument.createTextNode(textContent.substring(lastIndex, match.index))); }

                const promptWrapper = targetDocument.createElement('span');
                promptWrapper.className = 'perchance-prompt-container';
                promptWrapper.dataset.rawPrompt = rawFullPromptText;

                const mainTagsArea = targetDocument.createElement('div');
                mainTagsArea.className = 'perchance-main-tags-area';

                const tagsToProcess = detailedPromptsMap[rawFullPromptText] || rawFullPromptText.split(',').map(tag => tag.trim()).filter(tag => tag);

                tagsToProcess.forEach(tagValue => {
                    const mainTagWrapper = targetDocument.createElement('span');
                    mainTagWrapper.className = 'perchance-main-tag-wrapper';
                    mainTagWrapper.dataset.currentValue = tagValue;
                    const tagTextSpan = targetDocument.createElement('span');
                    tagTextSpan.className = 'perchance-main-tag-text';
                    tagTextSpan.textContent = tagValue;
                    mainTagWrapper.appendChild(tagTextSpan);
                    const editBtn = targetDocument.createElement('button');
                    editBtn.className = 'edit-subtags-btn'; editBtn.textContent = '✎'; editBtn.title = 'Thêm/Sửa chi tiết tag';
                    editBtn.onclick = () => showSubTagModal(mainTagWrapper);
                    mainTagWrapper.appendChild(editBtn); mainTagsArea.appendChild(mainTagWrapper);
                });
                promptWrapper.appendChild(mainTagsArea);
                const generateButton = targetDocument.createElement('button');
                generateButton.textContent = 'Tạo'; generateButton.className = 'perchance-generate-btn';
                generateButton.dataset.action = 'generate'; generateButton.addEventListener('click', handleGenerateClick);
                promptWrapper.appendChild(generateButton);
                const imagePlaceholder = targetDocument.createElement('div');
                imagePlaceholder.className = 'perchance-image-placeholder';
                promptWrapper.appendChild(imagePlaceholder);

                (async () => {
                    const currentDetailedTags = [];
                    mainTagsArea.querySelectorAll('.perchance-main-tag-wrapper').forEach(tw => currentDetailedTags.push(tw.dataset.currentValue));
                    const currentBasePrompt = currentDetailedTags.join(', ');
                    const currentPromptKey = CryptoJS.MD5(`${currentBasePrompt}, ${ANIME_STYLE_DEFINITION.positive}${ANIME_STYLE_DEFINITION.negative}`).toString();
                    const cachedImgSrc = await getCachedImage(currentPromptKey);
                    if (cachedImgSrc) {
                        const img = document.createElement('img');
                        img.src = cachedImgSrc;
                        img.alt = `${currentBasePrompt.substring(0,30)}... (cache)`;
                        img.title = img.alt;
                        img.style.border = "2px solid #00bcd4";
                        imagePlaceholder.appendChild(img);
                    }
                    updateImageNavigation(imagePlaceholder);
                })();


                fragment.appendChild(promptWrapper); lastIndex = PROMPT_REGEX.lastIndex;
            }
            if (replaced) {
                if (lastIndex < textContent.length) { fragment.appendChild(targetDocument.createTextNode(textContent.substring(lastIndex))); }
                parent.replaceChild(fragment, node);
                if (parent.nodeType === Node.ELEMENT_NODE) { parent.dataset.perchanceProcessedParent = 'true'; }
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'IFRAME', 'CANVAS', 'INPUT', 'BUTTON', 'A'].includes(node.tagName.toUpperCase()) ||
                node.isContentEditable || node.closest('.perchance-prompt-container, #perchance-prompt-menu-panel, #subTagModal') || node.dataset.perchanceProcessed === 'true') { return; }
            Array.from(node.childNodes).forEach(child => processNode(child, targetDocument));
            node.dataset.perchanceProcessed = 'true';
        }
    }

    // --- Setup Observer ---
    function setupObserver(targetDoc) {
        if (mutationObserver) mutationObserver.disconnect();
        mutationObserver = new MutationObserver(async (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(newNode => {
                        if ((newNode.nodeType === Node.ELEMENT_NODE && (newNode.dataset.perchanceProcessed === 'true' || newNode.id === 'perchance-prompt-menu-panel' || newNode.id === 'subTagModal')) ||
                            (newNode.nodeType === Node.TEXT_NODE && newNode.parentNode && newNode.parentNode.dataset.perchanceProcessedParent === 'true')) return;
                        processNode(newNode, targetDoc);
                    });
                } else if (mutation.type === 'characterData') {
                     if (mutation.target.parentNode && mutation.target.parentNode.dataset.perchanceProcessedParent !== 'true' && !mutation.target.parentNode.closest('#perchance-prompt-menu-panel, #subTagModal')) {
                        processNode(mutation.target.parentNode, targetDoc);
                     }
                }
            }
        });
        mutationObserver.observe(targetDoc.body, { childList: true, subtree: true, characterData: true });
        console.log("MutationObserver đã thiết lập cho:", targetDoc.location.href || "document chính");
    }

    // --- Prompt Style Preset Management ---
    function getPromptPresets() {
        const presetsJson = GM_getValue(PROMPT_PRESETS_STORAGE, JSON.stringify({ "Mặc định": ANIME_STYLE_DEFINITION }));
        try { return JSON.parse(presetsJson); }
        catch (e) { console.error("Lỗi JSON PromptPresets:", e); return { "Mặc định": ANIME_STYLE_DEFINITION }; }
    }
    function savePromptPresets(presets) { GM_setValue(PROMPT_PRESETS_STORAGE, JSON.stringify(presets)); }
    function populatePresetDropdown(selectElement, presets) {
        selectElement.innerHTML = '';
        for (const presetName in presets) {
            const option = document.createElement('option'); option.value = presetName; option.textContent = presetName; selectElement.appendChild(option);
        }
    }
    function loadPresetToTextareas(presetName, presets, positiveArea, negativeArea) {
        if (presets[presetName]) { positiveArea.value = presets[presetName].positive; negativeArea.value = presets[presetName].negative; }
    }
    function applyPresetToScript(presetName, presets) {
        if (presets[presetName]) {
            ANIME_STYLE_DEFINITION.positive = presets[presetName].positive; ANIME_STYLE_DEFINITION.negative = presets[presetName].negative;
            alert(`Đã áp dụng style prompt: "${presetName}"`); console.log(`Đã áp dụng style: "${presetName}"`, ANIME_STYLE_DEFINITION);
        }
    }

    // --- Data Export/Import ---
    async function exportData() {
        const statusDiv = document.getElementById('data-management-status');
        if (statusDiv) statusDiv.textContent = 'Đang thu thập dữ liệu để xuất...';

        try {
            const promptPresets = getPromptPresets();
            const keywordSubTagMap = getKeywordSubTagMap();
            const userKeys = getStoredUserKeys();
            let detailedPrompts = GM_getValue(DETAILED_PROMPTS_STORAGE, "{}");
            try { detailedPrompts = JSON.parse(detailedPrompts); } catch (e) { detailedPrompts = {}; }
            const currentAnimeStyle = ANIME_STYLE_DEFINITION; // Lấy style đang được áp dụng
            const cachedImages = await getAllCachedImages();

            const dataToExport = {
                version: "1.7.5", // Cập nhật phiên bản
                exportedAt: new Date().toISOString(),
                promptPresets,
                keywordSubTagMap,
                userKeys,
                detailedPrompts,
                currentAnimeStyle, // Lưu cả style hiện tại
                cachedImages
            };

            const jsonData = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            a.download = `perchance_image_replacer_backup_${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (statusDiv) statusDiv.textContent = 'Xuất dữ liệu thành công! File đã được tải về.';
            console.log("Dữ liệu đã xuất:", dataToExport);
        } catch (error) {
            console.error("Lỗi khi xuất dữ liệu:", error);
            if (statusDiv) statusDiv.textContent = `Lỗi xuất dữ liệu: ${error.message}`;
            alert(`Lỗi khi xuất dữ liệu: ${error.message}`);
        }
    }

    async function importData(event) {
        const statusDiv = document.getElementById('data-management-status');
        const file = event.target.files[0];
        if (!file) {
            if (statusDiv) statusDiv.textContent = 'Không có file nào được chọn.';
            return;
        }
        if (statusDiv) statusDiv.textContent = `Đang đọc file ${file.name}...`;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonData = e.target.result;
                const importedData = JSON.parse(jsonData);

                if (!importedData || typeof importedData !== 'object') {
                    throw new Error("Định dạng file không hợp lệ.");
                }

                // Xác nhận trước khi ghi đè
                if (!confirm("Bạn có chắc chắn muốn nhập dữ liệu này? Dữ liệu hiện tại (bao gồm cài đặt, prompt, ảnh cache) sẽ bị ghi đè.")) {
                    if (statusDiv) statusDiv.textContent = 'Đã hủy thao tác nhập.';
                    event.target.value = null; // Reset file input
                    return;
                }

                if (statusDiv) statusDiv.textContent = 'Đang nhập dữ liệu... Vui lòng đợi.';

                // Nhập Prompt Presets
                if (importedData.promptPresets) {
                    savePromptPresets(importedData.promptPresets);
                    console.log("Prompt Presets đã được nhập.");
                }

                // Nhập Keyword-SubTag Map
                if (importedData.keywordSubTagMap) {
                    saveKeywordSubTagMap(importedData.keywordSubTagMap);
                    console.log("Keyword-SubTag Map đã được nhập.");
                }

                // Nhập User Keys
                if (importedData.userKeys && Array.isArray(importedData.userKeys)) {
                    saveUserKeys(importedData.userKeys); // Hàm này đã có sẵn logic quản lý
                    console.log("User Keys đã được nhập.");
                }

                // Nhập Detailed Prompts
                if (importedData.detailedPrompts) {
                    GM_setValue(DETAILED_PROMPTS_STORAGE, JSON.stringify(importedData.detailedPrompts));
                    console.log("Detailed Prompts đã được nhập.");
                }

                // Nhập và áp dụng Current Anime Style
                if (importedData.currentAnimeStyle && importedData.currentAnimeStyle.positive && importedData.currentAnimeStyle.negative) {
                    ANIME_STYLE_DEFINITION.positive = importedData.currentAnimeStyle.positive;
                    ANIME_STYLE_DEFINITION.negative = importedData.currentAnimeStyle.negative;
                    console.log("Current Anime Style đã được nhập và áp dụng.");
                }


                // Nhập Ảnh Cache (Xóa cũ, thêm mới)
                if (importedData.cachedImages && Array.isArray(importedData.cachedImages)) {
                    await clearAndStoreImages(importedData.cachedImages);
                    console.log(`${importedData.cachedImages.length} ảnh cache đã được nhập.`);
                }

                if (statusDiv) statusDiv.textContent = 'Nhập dữ liệu thành công! Vui lòng làm mới các panel hoặc trang nếu cần.';
                alert("Nhập dữ liệu thành công! Một số thay đổi có thể cần làm mới trang hoặc mở lại panel cài đặt để hiển thị.");

                const panel = document.getElementById('perchance-prompt-menu-panel');
                if (panel && panel.style.display !== 'none') {
                    const presetSelect = panel.querySelector('#prompt-preset-select-id');
                    const positiveArea = panel.querySelector('#positive-prompt-area-id');
                    const negativeArea = panel.querySelector('#negative-prompt-area-id');
                    const currentPresets = getPromptPresets();
                    populatePresetDropdown(presetSelect, currentPresets);
                    if (presetSelect.options.length > 0) {
                        loadPresetToTextareas(presetSelect.value, currentPresets, positiveArea, negativeArea);
                    } else if (importedData.currentAnimeStyle) {
                        positiveArea.value = ANIME_STYLE_DEFINITION.positive;
                        negativeArea.value = ANIME_STYLE_DEFINITION.negative;
                    }

                    const keywordSelector = panel.querySelector('#keywordSelector');
                    const keywordNameInput = panel.querySelector('#keywordNameInput');
                    const associatedSubTagsTextarea = panel.querySelector('#associatedSubTagsTextarea');
                    populateKeywordSelector(keywordSelector, getKeywordSubTagMap(), keywordNameInput, associatedSubTagsTextarea);
                }


            } catch (error) {
                console.error("Lỗi khi nhập dữ liệu:", error);
                if (statusDiv) statusDiv.textContent = `Lỗi nhập dữ liệu: ${error.message}`;
                alert(`Lỗi khi nhập dữ liệu: ${error.message}`);
            } finally {
                event.target.value = null;
            }
        };
        reader.onerror = () => {
            if (statusDiv) statusDiv.textContent = `Lỗi đọc file: ${reader.error}`;
            alert(`Lỗi đọc file: ${reader.error}`);
            event.target.value = null;
        };
        reader.readAsText(file);
    }


    // --- Create Prompt Edit Menu Panel ---
    function createPromptEditMenuPanel() {
        const panel = document.createElement('div'); panel.id = 'perchance-prompt-menu-panel';
        Object.assign(panel.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#2c2c2c', color: 'white',
            padding: '25px', border: '1px solid #555',
            borderRadius: '8px', zIndex: '10001',
            display: 'none',
            width: '90%', /* Responsive width */
            maxWidth: '700px', /* Max width for larger screens */
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
        });

        let htmlContent = `
            <h2 style="margin-top:0; border-bottom: 1px solid #555; padding-bottom:10px;">Chỉnh sửa Prompt Styles & Quản lý (Perchance)</h2>
            <div style="margin-bottom: 15px;"><label for="prompt-preset-select-id" style="display:block; margin-bottom:5px;">Cài đặt Style trước (Preset):</label><select id="prompt-preset-select-id" style="width: calc(100% - 125px); background-color: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-right:5px;"></select><button id="delete-prompt-preset-btn" style="background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Xóa Style</button></div>
            <div style="margin-bottom: 15px;"><label for="positive-prompt-area-id" style="display:block; margin-bottom:5px;">Prompt Tích cực (Positive):</label><textarea id="positive-prompt-area-id" style="width: 100%; height: 100px; background-color: #333; color: white; border: 1px solid #555; border-radius: 4px; box-sizing: border-box;"></textarea></div>
            <div style="margin-bottom: 20px;"><label for="negative-prompt-area-id" style="display:block; margin-bottom:5px;">Prompt Tiêu cực (Negative):</label><textarea id="negative-prompt-area-id" style="width: 100%; height: 100px; background-color: #333; color: white; border: 1px solid #555; border-radius: 4px; box-sizing: border-box;"></textarea></div>
            <div style="margin-bottom: 15px;"><input type="text" id="new-preset-name-id" placeholder="Tên Style cài đặt mới" style="width: calc(100% - 120px); background-color: #333; color: white; border: 1px solid #555; border-radius: 4px; margin-right:5px; box-sizing: border-box;"><button id="save-prompt-preset-btn" style="background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Lưu Style</button></div>
            <div><button id="apply-prompts-btn" style="background-color: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Áp dụng Style vào Script</button><button id="close-prompt-menu-btn" style="background-color: #7f8c8d; color: white; border: none; border-radius: 4px; cursor: pointer;">Đóng</button></div>`;
        htmlContent += `
            <div class="keyword-subtag-manager">
                <h4>Quản lý Tag Phụ Gợi ý theo Từ Khóa</h4>
                <div class="keyword-list-area">
                    <label for="keywordSelector">Chọn Từ khóa Hiện có (để sửa nhóm):</label>
                    <select id="keywordSelector"></select>
                </div>
                <div class="keyword-edit-area">
                    <label for="keywordNameInput">Tên Từ khóa (nhập một hoặc nhiều từ khóa cách nhau bởi dấu phẩy, ví dụ: girl, co gai, nu):</label>
                    <input type="text" id="keywordNameInput" placeholder="girl, co gai, nu...">
                    <label for="associatedSubTagsTextarea">Các Tag Phụ Gợi ý (cách nhau bởi dấu phẩy):</label>
                    <textarea id="associatedSubTagsTextarea" rows="3" placeholder="Ví dụ: blue eyes, long hair, smiling"></textarea>
                </div>
                <div class="keyword-actions">
                    <button id="saveKeywordMappingBtn">Lưu Từ khóa & Tag phụ Gợi ý</button>
                    <button id="deleteKeywordMappingBtn" class="delete">Xóa Từ khóa đang chọn (từ dropdown)</button>
                </div>
            </div>`;
        htmlContent += `
            <div class="data-management-section">
                <h4>Quản lý Dữ Liệu Script</h4>
                <p style="font-size:0.85em; color:#bbb; margin-top:-5px; margin-bottom:10px;">Xuất tất cả cài đặt, prompt styles, từ khóa, tag phụ, user keys và ảnh đã cache ra file JSON. Nhập từ file JSON để khôi phục.</p>
                <button id="export-data-btn" style="background-color: #5cb85c; color: white;">Xuất Dữ Liệu</button>
                <label for="import-data-file" class="file-input-label" style="background-color: #f0ad4e; color:white;">Chọn File để Nhập</label>
                <input type="file" id="import-data-file" accept=".json" style="display:none;">
                <div id="data-management-status" style="margin-top:10px; font-size:0.9em; color:#ccc;"></div>
            </div>`;

        panel.innerHTML = htmlContent; document.body.appendChild(panel);

        const presetSelect = panel.querySelector('#prompt-preset-select-id'); const positiveArea = panel.querySelector('#positive-prompt-area-id'); const negativeArea = panel.querySelector('#negative-prompt-area-id'); const newPresetNameInput = panel.querySelector('#new-preset-name-id'); const saveBtn = panel.querySelector('#save-prompt-preset-btn'); const deleteBtn = panel.querySelector('#delete-prompt-preset-btn'); const applyBtn = panel.querySelector('#apply-prompts-btn'); const closeBtn = panel.querySelector('#close-prompt-menu-btn');
        let currentPresets = getPromptPresets(); populatePresetDropdown(presetSelect, currentPresets);
        if (presetSelect.options.length > 0) { loadPresetToTextareas(presetSelect.value, currentPresets, positiveArea, negativeArea); } else { positiveArea.value = ANIME_STYLE_DEFINITION.positive; negativeArea.value = ANIME_STYLE_DEFINITION.negative; }
        presetSelect.addEventListener('change', () => loadPresetToTextareas(presetSelect.value, currentPresets, positiveArea, negativeArea));
        saveBtn.addEventListener('click', () => {
            const presetNameToSave = newPresetNameInput.value.trim() || presetSelect.value; if (!presetNameToSave) { alert("Nhập tên style mới hoặc chọn style có sẵn."); return; }
            currentPresets[presetNameToSave] = { positive: positiveArea.value, negative: negativeArea.value };
            savePromptPresets(currentPresets); populatePresetDropdown(presetSelect, currentPresets); presetSelect.value = presetNameToSave; newPresetNameInput.value = ''; alert(`Đã lưu style: "${presetNameToSave}"`);
        });
        deleteBtn.addEventListener('click', () => {
            const selectedPreset = presetSelect.value; if (!selectedPreset) { alert("Chọn style để xóa."); return; } if (selectedPreset === "Mặc định") { alert("Không thể xóa style 'Mặc định'."); return; }
            if (confirm(`Xóa preset style "${selectedPreset}"?`)) {
                delete currentPresets[selectedPreset]; savePromptPresets(currentPresets); populatePresetDropdown(presetSelect, currentPresets);
                if (presetSelect.options.length > 0) { loadPresetToTextareas(presetSelect.value, currentPresets, positiveArea, negativeArea); } else { positiveArea.value = ''; negativeArea.value = ''; }
                alert(`Đã xóa style: "${selectedPreset}"`);
            }
        });
        applyBtn.addEventListener('click', () => {
            const selectedPreset = presetSelect.value;
            if (selectedPreset && currentPresets[selectedPreset]) { applyPresetToScript(selectedPreset, currentPresets); }
            else { ANIME_STYLE_DEFINITION.positive = positiveArea.value; ANIME_STYLE_DEFINITION.negative = negativeArea.value; alert("Đã áp dụng style từ textareas."); console.log("Áp dụng style từ textareas:", ANIME_STYLE_DEFINITION); }
        });
        closeBtn.addEventListener('click', () => { panel.style.display = 'none'; });

        const keywordSelector = panel.querySelector('#keywordSelector');
        const keywordNameInput = panel.querySelector('#keywordNameInput');
        const associatedSubTagsTextarea = panel.querySelector('#associatedSubTagsTextarea');
        const saveKeywordMappingBtn = panel.querySelector('#saveKeywordMappingBtn');
        const deleteKeywordMappingBtn = panel.querySelector('#deleteKeywordMappingBtn');


        function populateKeywordSelectorAndUpdate(currentMap = getKeywordSubTagMap()) {
            keywordSelector.innerHTML = '<option value="">--- Chọn Từ khóa (để sửa nhóm) ---</option>';
            Object.keys(currentMap).sort().forEach(kw => {
                const option = document.createElement('option'); option.value = kw; option.textContent = kw;
                keywordSelector.appendChild(option);
            });
        }
        populateKeywordSelectorAndUpdate();


        function loadKeywordDetails(selectedKeyword) {
            let currentKeywordMap = getKeywordSubTagMap();
            if (selectedKeyword && currentKeywordMap[selectedKeyword]) {
                const subTagsOfSelected = currentKeywordMap[selectedKeyword];
                let groupKeywords = [selectedKeyword];
                for (const otherKeyword in currentKeywordMap) {
                    if (otherKeyword !== selectedKeyword) {
                        if (JSON.stringify(currentKeywordMap[otherKeyword]) === JSON.stringify(subTagsOfSelected)) {
                            groupKeywords.push(otherKeyword);
                        }
                    }
                }
                keywordNameInput.value = groupKeywords.sort().join(', ');
                associatedSubTagsTextarea.value = subTagsOfSelected.join(', ');
                originalLoadedKeywordGroupState = { keywords: [...groupKeywords], subTags: [...subTagsOfSelected] };
            } else {
                keywordNameInput.value = selectedKeyword || '';
                associatedSubTagsTextarea.value = '';
                originalLoadedKeywordGroupState = { keywords: selectedKeyword ? [selectedKeyword] : [], subTags: [] };
            }
        }

        keywordSelector.addEventListener('change', () => {
            const selectedKeyword = keywordSelector.value;
            loadKeywordDetails(selectedKeyword);
        });

        saveKeywordMappingBtn.addEventListener('click', () => {
            const keywordInputString = keywordNameInput.value.trim().toLowerCase();
            if (!keywordInputString) { alert("Tên Từ khóa không được để trống."); return; }
            const newlyInputKeywords = keywordInputString.split(',').map(kw => kw.trim()).filter(kw => kw);
            if (newlyInputKeywords.length === 0) { alert("Tên Từ khóa không hợp lệ sau khi xử lý."); return; }
            const subTagsString = associatedSubTagsTextarea.value.trim();
            const newSubTagsArray = subTagsString ? subTagsString.split(',').map(s => s.trim()).filter(s => s) : [];
            let currentKeywordMap = getKeywordSubTagMap();
            newlyInputKeywords.forEach(kw => { currentKeywordMap[kw] = newSubTagsArray; });
            saveKeywordSubTagMap(currentKeywordMap);
            populateKeywordSelectorAndUpdate(currentKeywordMap);
            keywordNameInput.value = '';
            associatedSubTagsTextarea.value = '';
            originalLoadedKeywordGroupState = { keywords: [], subTags: [] };
            alert(`Đã lưu cài đặt gợi ý cho từ khóa: ${newlyInputKeywords.join(', ')}.`);
        });

        deleteKeywordMappingBtn.addEventListener('click', () => {
            const keywordToDeleteFromDropdown = keywordSelector.value;
            let currentKeywordMap = getKeywordSubTagMap();
            if (!keywordToDeleteFromDropdown || !currentKeywordMap[keywordToDeleteFromDropdown]) {
                alert("Vui lòng chọn một từ khóa hợp lệ từ danh sách để xóa."); return;
            }
            if (confirm(`Bạn có chắc chắn muốn xóa từ khóa "${keywordToDeleteFromDropdown}" và các tag phụ gợi ý liên quan không?`)) {
                delete currentKeywordMap[keywordToDeleteFromDropdown];
                saveKeywordSubTagMap(currentKeywordMap);
                populateKeywordSelectorAndUpdate(currentKeywordMap);
                keywordNameInput.value = '';
                associatedSubTagsTextarea.value = '';
                originalLoadedKeywordGroupState = { keywords: [], subTags: [] };
                alert(`Đã xóa từ khóa "${keywordToDeleteFromDropdown}".`);
            }
        });

        const exportBtn = panel.querySelector('#export-data-btn');
        const importFileInput = panel.querySelector('#import-data-file');
        exportBtn.addEventListener('click', exportData);
        importFileInput.addEventListener('change', importData);

        return panel;
    }

    function populateKeywordSelector(selectorElement, currentMap, nameInputElement, textareaElement) {
        selectorElement.innerHTML = '<option value="">--- Chọn Từ khóa (để sửa nhóm) ---</option>';
        Object.keys(currentMap).sort().forEach(kw => {
            const option = document.createElement('option'); option.value = kw; option.textContent = kw;
            selectorElement.appendChild(option);
        });
        if (nameInputElement) nameInputElement.value = '';
        if (textareaElement) textareaElement.value = '';
        originalLoadedKeywordGroupState = { keywords: [], subTags: [] };
    }


    // --- Integrate Prompt Menu Into SillyTavern ---
    function integratePromptMenuIntoSillyTavern() {
        const targetElement = document.querySelector('#option_toggle_AN');
        if (targetElement && targetElement.parentNode && !document.getElementById('perchance_prompt_menu_toggle')) {
            if (sillyTavernMenuIntegrationInterval) { clearInterval(sillyTavernMenuIntegrationInterval); sillyTavernMenuIntegrationInterval = null; }
            const newMenuItem = document.createElement('a'); newMenuItem.id = 'perchance_prompt_menu_toggle';
            const icon = document.createElement('i'); icon.className = 'fa-lg fa-solid fa-pen-to-square'; newMenuItem.appendChild(icon);
            const span = document.createElement('span'); span.textContent = ' Perchance Styles & Tags'; newMenuItem.appendChild(span);
            Object.assign(newMenuItem.style, { display: 'block', padding: '10px 15px', cursor: 'pointer', textDecoration: 'none', color: 'var(--text_color)' });
            newMenuItem.onmouseover = function() { this.style.backgroundColor = 'var(--hover_color)'; }
            newMenuItem.onmouseout = function() { this.style.backgroundColor = 'transparent'; }
            targetElement.parentNode.insertBefore(newMenuItem, targetElement.nextSibling);
            console.log("Đã thêm 'Perchance Styles & Tags' vào menu SillyTavern.");
            let promptMenuPanel = document.getElementById('perchance-prompt-menu-panel');
            if (!promptMenuPanel) { promptMenuPanel = createPromptEditMenuPanel(); }

            newMenuItem.addEventListener('click', (event) => {
                event.preventDefault();
                promptMenuPanel.style.display = promptMenuPanel.style.display === 'none' ? 'block' : 'none';
                if (promptMenuPanel.style.display === 'block') {
                    const presetSelect = promptMenuPanel.querySelector('#prompt-preset-select-id');
                    const positiveArea = promptMenuPanel.querySelector('#positive-prompt-area-id');
                    const negativeArea = promptMenuPanel.querySelector('#negative-prompt-area-id');
                    const currentPresets = getPromptPresets();
                    populatePresetDropdown(presetSelect, currentPresets);
                    if (presetSelect.value && currentPresets[presetSelect.value]) {
                        loadPresetToTextareas(presetSelect.value, currentPresets, positiveArea, negativeArea);
                    } else if (currentPresets["Mặc định"]) {
                        presetSelect.value = "Mặc định";
                        loadPresetToTextareas("Mặc định", currentPresets, positiveArea, negativeArea);
                    } else {
                        positiveArea.value = ANIME_STYLE_DEFINITION.positive;
                        negativeArea.value = ANIME_STYLE_DEFINITION.negative;
                    }

                    const keywordSelectorElement = promptMenuPanel.querySelector('#keywordSelector');
                    const keywordNameInputElement = promptMenuPanel.querySelector('#keywordNameInput');
                    const associatedSubTagsTextareaElement = promptMenuPanel.querySelector('#associatedSubTagsTextarea');
                    populateKeywordSelector(keywordSelectorElement, getKeywordSubTagMap(), keywordNameInputElement, associatedSubTagsTextareaElement);
                    const statusDiv = document.getElementById('data-management-status');
                    if(statusDiv) statusDiv.textContent = '';
                }
            });
        } else if (!sillyTavernMenuIntegrationInterval && !document.getElementById('perchance_prompt_menu_toggle')) {
            // console.log("Chưa tìm thấy #option_toggle_AN của SillyTavern...");
        }
    }

    // --- Main Function ---
    async function main() {
        console.log("Perchance Image Replacer (VN) - Multi-Key & Contextual Sub-Tags v1.7.5 - Responsive Panel");
        addGlobalStyles(); createSubTagModal();
        try { await initDB(); } catch (error) { /* Logged */ }
        const initialPresets = getPromptPresets();
        if (initialPresets["Mặc định"]) { ANIME_STYLE_DEFINITION.positive = initialPresets["Mặc định"].positive; ANIME_STYLE_DEFINITION.negative = initialPresets["Mặc định"].negative; console.log("Đã tải prompt style 'Mặc định'."); }
        else { initialPresets["Mặc định"] = { positive: ANIME_STYLE_DEFINITION.positive, negative: ANIME_STYLE_DEFINITION.negative }; savePromptPresets(initialPresets); console.log("Đã lưu prompt style mặc định."); }
        const initialKeys = getStoredUserKeys();
        if (initialKeys.length > 0) { console.log(`Tìm thấy ${initialKeys.length} userKey. Key gần nhất: ...${initialKeys[initialKeys.length - 1].slice(-6)}`); }
        else { console.log("Không có userKey. Sẽ thử lấy tự động/hỏi khi cần."); }
        createPromptEditMenuPanel(); integratePromptMenuIntoSillyTavern();
        const outputIframe = document.querySelector('iframe#outputIframeEl');
        if (outputIframe) {
            const handleIframeLoad = () => {
                if (outputIframe.contentDocument && outputIframe.contentDocument.body) {
                    try { console.log("iframe#outputIframeEl tải xong. Xử lý node..."); processNode(outputIframe.contentDocument.body, outputIframe.contentDocument); setupObserver(outputIframe.contentDocument); }
                    catch(e) { console.error("Lỗi iframe:", e, ". Fallback."); processNode(document.body, document); setupObserver(document); }
                } else { console.error("Không truy cập được contentDocument.body iframe. Fallback."); processNode(document.body, document); setupObserver(document); }
            };
            if (outputIframe.contentDocument && outputIframe.contentDocument.readyState === 'complete') { handleIframeLoad(); }
            else { console.log("Chờ iframe#outputIframeEl tải..."); outputIframe.addEventListener('load', handleIframeLoad, { once: true }); }
        } else {
            console.warn("Không tìm thấy iframe#outputIframeEl. Xử lý trên document.body.");
            processNode(document.body, document); setupObserver(document);
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(main, 500); }
    else { window.addEventListener('load', () => setTimeout(main, 500)); }

})();
