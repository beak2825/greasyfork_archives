// ==UserScript==
// @name        AnnaUploader (Roblox Multi-File Uploader)
// @namespace   https://github.com/AnnaRoblox
// @version     7.4
// @description allows you to upload multiple T-Shirts/Decals easily with AnnaUploader
// @match       https://create.roblox.com/*
// @match       https://www.roblox.com/users/*/profile*
// @match       https://www.roblox.com/communities/*
// @match       https://www.roblox.com/home/*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/534460/AnnaUploader%20%28Roblox%20Multi-File%20Uploader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534460/AnnaUploader%20%28Roblox%20Multi-File%20Uploader%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants for Roblox API and asset types
    const ROBLOX_UPLOAD_URL  = "https://apis.roblox.com/assets/user-auth/v1/assets";
    const ASSET_TYPE_TSHIRT  = 11;
    const ASSET_TYPE_DECAL   = 13;
    const FORCED_NAME        = "Uploaded Using AnnaUploader"; // Default name for assets

    // Storage keys and scan interval for asset logging
    const STORAGE_KEY = 'annaUploaderAssetLog';
    const SCAN_INTERVAL_MS = 10_000;

    // Script configuration variables, managed with Tampermonkey's GM_getValue/GM_setValue
    let enableAssetLogging = GM_getValue('enableAssetLogging', false);
    let USER_ID       = GM_getValue('userId', null);
    let IS_GROUP      = GM_getValue('isGroup', false);
    let useForcedName = GM_getValue('useForcedName', false);
    let useMakeUnique = GM_getValue('useMakeUnique', false);
    let uniqueCopies  = GM_getValue('uniqueCopies', 1);
    let useDownload   = GM_getValue('useDownload', false);
    let useForceCanvasUpload = GM_getValue('useForceCanvasUpload', false);
    //  Slip Mode Pixel Method - 'all_pixels', '1-3_random', '1-4_random_single_pixel', or 'random_single_pixel_full_random_color'
    let slipModePixelMethod = GM_getValue('slipModePixelMethod', '1-3_random');
    let slipModeGenerateAllFirst = GM_getValue('slipModeGenerateAllFirst', false);

    // Image resizing settings
    let enableResize = GM_getValue('enableResize', false);
    let resizeWidth = GM_getValue('resizeWidth', 300);
    let resizeHeight = GM_getValue('resizeHeight', 300);

    // Mass upload mode variables
    let massMode    = false;
    let massQueue   = [];
    let batchTotal  = 0;
    let completed   = 0;

    let scanIntervalId = null;
    let csrfToken = null;
    let statusEl, toggleBtn, startBtn, copiesInput, downloadBtn;
    let uiContainer;
    let settingsModal;

    function baseName(filename) {
        return filename.replace(/\.[^/.]+$/, '');
    }

    function loadLog() {
        const raw = GM_getValue(STORAGE_KEY, '{}');
        try { return JSON.parse(raw); }
        catch { return {}; }
    }

    function saveLog(log) {
        GM_setValue(STORAGE_KEY, JSON.stringify(log));
    }

    function logAsset(id, imageURL, name) {
        const log = loadLog();
        log[id] = {
            date: new Date().toISOString(),
            image: imageURL || log[id]?.image || null,
            name: name || log[id]?.name || '(unknown)'
        };
        saveLog(log);
        console.log(`[AssetLogger] logged asset ${id} at ${log[id].date}, name: ${log[id].name}, image: ${log[id].image || "none"}`);
    }

    function scanForAssets() {
        console.log('[AssetLogger] scanning for assets…');
        document.querySelectorAll('[href]').forEach(el => {
            let m = el.href.match(/(?:https?:\/\/create\.roblox\.com)?\/store\/asset\/(\d+)/)
                 || el.href.match(/\/dashboard\/creations\/store\/(\d+)\/configure/);
            if (m) {
                const id = m[1];
                let image = null;
                const container = el.closest('*');
                const img = container?.querySelector('img');
                if (img?.src) image = img.src;
                let name = null;
                const nameEl = container?.querySelector('span.MuiTypography-root');
                if (nameEl) name = nameEl.textContent.trim();
                logAsset(id, image, name);
            }
        });
    }

    function toggleAssetScanner(enable) {
        if (enable && !scanIntervalId) {
            scanIntervalId = setInterval(scanForAssets, SCAN_INTERVAL_MS);
            console.log('[AssetLogger] Scanner started.');
        } else if (!enable && scanIntervalId) {
            clearInterval(scanIntervalId);
            scanIntervalId = null;
            console.log('[AssetLogger] Scanner stopped.');
        }
    }

    async function fetchCSRFToken() {
        const resp = await fetch(ROBLOX_UPLOAD_URL, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        if (resp.status === 403) {
            const tok = resp.headers.get('x-csrf-token');
            if (tok) {
                csrfToken = tok;
                console.log('[CSRF] token fetched');
                return tok;
            }
        }
        throw new Error('Cannot fetch CSRF token');
    }

    function updateStatus() {
        if (!statusEl) return;
        if (massMode) {
            statusEl.textContent = `${massQueue.length} queued`;
        } else if (batchTotal > 0) {
            statusEl.textContent = `${completed} of ${batchTotal} processed`;
        } else {
            statusEl.textContent = '';
        }
    }

    async function uploadFile(file, assetType, retries = 0, forceName = false) {
        if (!csrfToken) {
            try {
                await fetchCSRFToken();
            } catch (e) {
                console.error("[Upload] Failed to fetch initial CSRF token:", e);
                completed++;
                updateStatus();
                return;
            }
        }
        const displayName = forceName ? FORCED_NAME : baseName(file.name);
        const creator = IS_GROUP
            ? { groupId: USER_ID }
            : { userId: USER_ID };

        const fd = new FormData();
        fd.append('fileContent', file, file.name);
        fd.append('request', JSON.stringify({
            displayName,
            description: FORCED_NAME,
            assetType: assetType === ASSET_TYPE_TSHIRT ? "TShirt" : "Decal",
            creationContext: { creator, expectedPrice: 0 }
        }));

        try {
            const resp = await fetch(ROBLOX_UPLOAD_URL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'x-csrf-token': csrfToken },
                body: fd
            });
            const txt = await resp.text();
            let json; try { json = JSON.parse(txt); } catch (e) {
                console.error('[Upload] Failed to parse response JSON:', e, txt);
            }

            if (json?.message && typeof json.message === 'string' && json.message.toLowerCase().includes('banned')) {
                displayMessage('Upload failed: Your account appears to be banned. Cannot complete upload.', 'error');
                console.error(`[Upload] Account banned for "${file.name}":`, txt);
                completed++;
                updateStatus();
                return;
            }

            if (resp.ok && json?.assetId) {
                if (enableAssetLogging) {
                    logAsset(json.assetId, null, displayName);
                }
                completed++;
                updateStatus();
                return;
            }

            if (json?.message === 'Asset name length is invalid.' && !forceName && retries < 5) {
                console.warn(`[Upload] "${file.name}" name too long, retrying with default name. Retry ${retries + 1}.`);
                return uploadFile(file, assetType, retries + 1, true);
            }
            if (resp.status === 400 && json?.message?.includes('moderated') && retries < 5) {
                console.warn(`[Upload] "${file.name}" content moderated, retrying with default name. Retry ${retries + 1}.`);
                return uploadFile(file, assetType, retries + 1, true);
            }
            if (resp.status === 403 && retries < 5) {
                console.warn(`[Upload] "${file.name}" 403 Forbidden, fetching new CSRF and retrying. Retry ${retries + 1}.`);
                csrfToken = null;
                await fetchCSRFToken();
                return uploadFile(file, assetType, retries + 1, forceName);
            }

            console.error(`[Upload] failed "${file.name}" [${resp.status}]`, txt);
            completed++;
            updateStatus();
        } catch (e) {
            console.error(`[Upload] error during fetch for "${file.name}":`, e);
            completed++;
            updateStatus();
        }
    }

    function convertWebPToPng(webpFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(webpFile);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                // Optimize for frequent reads
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(blob => {
                    URL.revokeObjectURL(url);
                    if (blob) {
                        const newFileName = webpFile.name.replace(/\.webp$/, '.png');
                        resolve(new File([blob], newFileName, { type: 'image/png' }));
                    } else {
                        reject(new Error('Failed to convert WebP to PNG blob.'));
                    }
                }, 'image/png');
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(new Error(`Failed to load image for conversion: ${e.message}`));
            };
            img.src = url;
        });
    }

    // Resize image as a File to width x height (returns a new File)
    function resizeImageFile(file, width, height) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                // Optimize for frequent reads
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => {
                    URL.revokeObjectURL(url);
                    if (blob) {
                        const newFileName = baseName(file.name) + '.png';
                        resolve(new File([blob], newFileName, { type: 'image/png' }));
                    } else {
                        reject(new Error('Failed to resize image.'));
                    }
                }, 'image/png');
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(new Error(`Failed to load image for resizing: ${e.message}`));
            };
            img.src = url;
        });
    }

    function processImageThroughCanvas(file, targetType = 'image/png', width = null, height = null) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width || img.width;
                canvas.height = height || img.height;
                // Optimize for frequent reads
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    URL.revokeObjectURL(url);
                    if (blob) {
                        const newFileName = baseName(file.name) + (targetType === 'image/png' ? '.png' : '.jpeg');
                        resolve(new File([blob], newFileName, { type: targetType }));
                    } else {
                        reject(new Error('Failed to process image through canvas.'));
                    }
                }, targetType);
            };
            img.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(new Error(`Failed to load image for canvas processing: ${e.message}`));
            };
            img.src = url;
        });
    }

    // OPTIMIZED: Smarter pixel manipulation to avoid lagging on large images
    function makeUniqueFile(file, origBase, copyIndex, resizeW = null, resizeH = null) {
        return new Promise(resolve => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = resizeW || img.width;
                canvas.height = resizeH || img.height;

                // VITAL: This setting drastically improves performance on Chrome for heavy read/write ops
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Optimization: Only grab whole image data if we absolutely must (for 'all_pixels' modes)
                // For single pixel modes, we will only touch one pixel.

                if (slipModePixelMethod === '1-4_random_single_pixel' || slipModePixelMethod === 'random_single_pixel_full_random_color') {
                    // FAST PATH: Single Pixel Modification
                    // Don't read the whole image! Just pick a random spot.
                    const x = Math.floor(Math.random() * canvas.width);
                    const y = Math.floor(Math.random() * canvas.height);
                    const pixelData = ctx.getImageData(x, y, 1, 1);
                    const data = pixelData.data;

                    // Ensure we aren't modifying a fully transparent pixel (if relevant), though for anti-dupe it might not matter.
                    // If transparent, we just shift it slightly off 0
                    if (data[3] === 0) {
                        data[3] = 1; // Make it essentially invisible but non-zero alpha
                    }

                    if (slipModePixelMethod === '1-4_random_single_pixel') {
                        const delta = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 4) + 1);
                        data[0] = Math.min(255, Math.max(0, data[0] + delta));
                        data[1] = Math.min(255, Math.max(0, data[1] + delta));
                        data[2] = Math.min(255, Math.max(0, data[2] + delta));
                    } else {
                         // Full Random Color
                        data[0] = Math.floor(Math.random() * 256);
                        data[1] = Math.floor(Math.random() * 256);
                        data[2] = Math.floor(Math.random() * 256);
                    }
                    ctx.putImageData(pixelData, x, y);

                } else {
                    // SLOW PATH: Full Image Iteration (Necessary if user wants 'all_pixels')
                    // We can't make this instant for 4k images in JS, but 'willReadFrequently' helps a lot.
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    for (let i = 0; i < data.length; i += 4) {
                        if (data[i + 3] !== 0) {
                            let delta;
                            if (slipModePixelMethod === 'all_pixels') {
                                delta = (Math.random() < 0.5 ? -1 : 1);
                                data[i]     = Math.min(255, Math.max(0, data[i]     + delta));
                                data[i+1]   = Math.min(255, Math.max(0, data[i+1] + delta));
                                data[i+2]   = Math.min(255, Math.max(0, data[i+2] + delta));
                            } else if (slipModePixelMethod === '1-3_random') {
                                delta = (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 3) + 1);
                                data[i]     = Math.min(255, Math.max(0, data[i]     + delta));
                                data[i+1]   = Math.min(255, Math.max(0, data[i+1] + delta));
                                data[i+2]   = Math.min(255, Math.max(0, data[i+2] + delta));
                            }
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                }

                canvas.toBlob(blob => {
                    URL.revokeObjectURL(url);
                    const ext = 'png';
                    const newName = `${origBase}_${copyIndex}.${ext}`;
                    resolve(new File([blob], newName, { type: 'image/png' }));
                }, 'image/png');
            };
            img.src = url;
        });
    }

    async function handleFileSelect(files, assetType, both = false) {
        if (!files?.length) return;

        const downloadsMap = {};
        const copies = useMakeUnique ? uniqueCopies : 1;
        const resizeActive = enableResize && Number(resizeWidth) > 0 && Number(resizeHeight) > 0;

        if (massMode) {
            displayMessage('Processing files to add to queue...', 'info');
            const processingTasks = [];
            for (const original of files) {
                let fileToProcess = original;

                // 1. WebP Conversion
                if (original.type === 'image/webp') {
                    displayMessage(`Converting ${original.name} from WebP to PNG...`, 'info');
                    try {
                        fileToProcess = await convertWebPToPng(original);
                        displayMessage(`${original.name} converted to PNG.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to convert ${original.name}: ${error.message}`, 'error');
                        console.error(`[Conversion] Failed to convert ${original.name}:`, error);
                        continue;
                    }
                }

                // 2. Optional resizing
                if (resizeActive) {
                    displayMessage(`Resizing ${fileToProcess.name} to ${resizeWidth}x${resizeHeight}...`, 'info');
                    try {
                        fileToProcess = await resizeImageFile(fileToProcess, Number(resizeWidth), Number(resizeHeight));
                        displayMessage(`${fileToProcess.name} resized.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to resize ${fileToProcess.name}: ${error.message}`, 'error');
                        console.error(`[Resize] Failed to resize ${fileToProcess.name}:`, error);
                        continue;
                    }
                }

                // 3. Force Canvas Upload
                let fileAfterCanvasProcessing = fileToProcess;
                if (useForceCanvasUpload && !useMakeUnique) {
                    displayMessage(`Processing ${fileToProcess.name} through canvas...`, 'info');
                    try {
                        fileAfterCanvasProcessing = await processImageThroughCanvas(
                            fileToProcess, 'image/png',
                            resizeActive ? Number(resizeWidth) : null,
                            resizeActive ? Number(resizeHeight) : null
                        );
                        displayMessage(`${fileToProcess.name} processed through canvas.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to process ${fileToProcess.name} through canvas: ${error.message}`, 'error');
                        console.error(`[Canvas Process] Failed to process ${fileToProcess.name}:`, error);
                        continue;
                    }
                }

                const origBase = baseName(fileAfterCanvasProcessing.name);
                for (let i = 1; i <= copies; i++) {
                    processingTasks.push(
                        (async () => {
                            const fileForQueue = useMakeUnique
                                ? await makeUniqueFile(
                                    fileAfterCanvasProcessing, origBase, i,
                                    resizeActive ? Number(resizeWidth) : null,
                                    resizeActive ? Number(resizeHeight) : null
                                )
                                : fileAfterCanvasProcessing;

                            if (both) {
                                massQueue.push({ f: fileForQueue, type: ASSET_TYPE_TSHIRT, forceName: useForcedName });
                                massQueue.push({ f: fileForQueue, type: ASSET_TYPE_DECAL, forceName: useForcedName });
                            } else {
                                massQueue.push({ f: fileForQueue, type: assetType, forceName: useForcedName });
                            }
                        })()
                    );
                }
            }
            await Promise.all(processingTasks);
            displayMessage(`${processingTasks.length} files added to queue!`, 'success');
            updateStatus();
        } else {
            const totalFilesToUpload = files.length * (both ? 2 : 1) * copies;
            batchTotal = totalFilesToUpload;
            completed = 0;
            updateStatus();
            displayMessage(`Starting upload of ${batchTotal} files...`, 'info');

            const uploadPromises = [];

            for (const original of files) {
                let fileToProcess = original;

                // 1. WebP Conversion
                if (original.type === 'image/webp') {
                    displayMessage(`Converting ${original.name} from WebP to PNG...`, 'info');
                    try {
                        fileToProcess = await convertWebPToPng(original);
                        displayMessage(`${original.name} converted to PNG.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to convert ${original.name}: ${error.message}`, 'error');
                        console.error(`[Conversion] Failed to convert ${original.name}:`, error);
                        continue;
                    }
                }

                // 2. Optional resizing
                if (resizeActive) {
                    displayMessage(`Resizing ${fileToProcess.name} to ${resizeWidth}x${resizeHeight}...`, 'info');
                    try {
                        fileToProcess = await resizeImageFile(fileToProcess, Number(resizeWidth), Number(resizeHeight));
                        displayMessage(`${fileToProcess.name} resized.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to resize ${fileToProcess.name}: ${error.message}`, 'error');
                        console.error(`[Resize] Failed to resize ${fileToProcess.name}:`, error);
                        continue;
                    }
                }

                // 3. Force Canvas Upload
                let fileAfterCanvasProcessing = fileToProcess;
                if (useForceCanvasUpload && !useMakeUnique) {
                    displayMessage(`Processing ${fileToProcess.name} through canvas...`, 'info');
                    try {
                        fileAfterCanvasProcessing = await processImageThroughCanvas(
                            fileToProcess, 'image/png',
                            resizeActive ? Number(resizeWidth) : null,
                            resizeActive ? Number(resizeHeight) : null
                        );
                        displayMessage(`${fileToProcess.name} processed through canvas.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to process ${fileToProcess.name} through canvas: ${error.message}`, 'error');
                        console.error(`[Canvas Process] Failed to process ${fileToProcess.name}:`, error);
                        continue;
                    }
                }

                const origBase = baseName(fileAfterCanvasProcessing.name);
                downloadsMap[origBase] = [];

                if (useMakeUnique && slipModeGenerateAllFirst) {
                    displayMessage(`Generating ${copies} copies for ${origBase}...`, 'info');
                    const generatedFiles = [];
                    // 1. Generate all copies first
                    for (let i = 1; i <= copies; i++) {
                        const fileToUpload = await makeUniqueFile(
                            fileAfterCanvasProcessing, origBase, i,
                            resizeActive ? Number(resizeWidth) : null,
                            resizeActive ? Number(resizeHeight) : null
                        );
                        generatedFiles.push(fileToUpload);
                        if (useDownload) downloadsMap[origBase].push(fileToUpload);
                    }

                    // 2. Then upload them
                    displayMessage(`Starting upload for ${origBase} copies...`, 'info');
                    for (const fileToUpload of generatedFiles) {
                        if (both) {
                            uploadPromises.push(uploadFile(fileToUpload, ASSET_TYPE_TSHIRT, 0, useForcedName));
                            uploadPromises.push(uploadFile(fileToUpload, ASSET_TYPE_DECAL, 0, useForcedName));
                        } else {
                            uploadPromises.push(uploadFile(fileToUpload, assetType, 0, useForcedName));
                        }
                    }

                } else {
                    // Default behavior: Generate and upload on the fly
                    for (let i = 1; i <= copies; i++) {
                        const fileToUpload = useMakeUnique
                            ? await makeUniqueFile(
                                fileAfterCanvasProcessing, origBase, i,
                                resizeActive ? Number(resizeWidth) : null,
                                resizeActive ? Number(resizeHeight) : null
                            )
                            : fileAfterCanvasProcessing;

                        if (useMakeUnique && useDownload) downloadsMap[origBase].push(fileToUpload);
                        if (both) {
                            uploadPromises.push(uploadFile(fileToUpload, ASSET_TYPE_TSHIRT, 0, useForcedName));
                            uploadPromises.push(uploadFile(fileToUpload, ASSET_TYPE_DECAL, 0, useForcedName));
                        } else {
                            uploadPromises.push(uploadFile(fileToUpload, assetType, 0, useForcedName));
                        }
                    }
                }
            }

            Promise.all(uploadPromises).then(() => {
                console.log('[Uploader] batch done');
                if (enableAssetLogging) {
                    scanForAssets();
                }
                displayMessage('Immediate upload batch complete!', 'success');
                if (useMakeUnique && useDownload) {
                    for (const [origBase, fileList] of Object.entries(downloadsMap)) {
                        if (!fileList.length) continue;
                        const zip = new JSZip();
                        fileList.forEach(f => zip.file(f.name, f));
                        zip.generateAsync({ type: 'blob' }).then(blob => {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${origBase}.zip`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        });
                    }
                }
            }).catch(error => {
                console.error("Immediate upload batch encountered an error:", error);
                displayMessage('Immediate upload batch finished with errors. Check console.', 'error');
            });
        }
    }

    function startMassUpload() {
        if (!massQueue.length) {
            displayMessage('Nothing queued for mass upload!', 'info');
            return;
        }

        batchTotal = massQueue.length;
        completed = 0;
        updateStatus();
        displayMessage(`Starting mass upload of ${batchTotal} files...`, 'info');

        const tasks = massQueue.map(item => uploadFile(item.f, item.type, 0, item.forceName));
        massQueue = [];

        Promise.all(tasks).then(() => {
            displayMessage('Mass upload complete!', 'success');
            massMode = false;
            toggleBtn.textContent = 'Enable Mass Upload';
            startBtn.style.display = 'none';
            if (enableAssetLogging) {
                scanForAssets();
            }
            batchTotal = completed = 0;
            updateStatus();
        }).catch(error => {
            console.error("Mass upload encountered an error:", error);
            displayMessage('Mass upload finished with errors. Check console.', 'error');
            massMode = false;
            toggleBtn.textContent = 'Enable Mass Upload';
            startBtn.style.display = 'none';
            batchTotal = completed = 0;
            updateStatus();
        });
    }

    function displayMessage(message, type = 'info') {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            zIndex: '10001',
            fontFamily: 'Inter, Arial, sans-serif',
            textAlign: 'center',
            minWidth: '250px',
            transition: 'opacity 0.3s ease-in-out',
            opacity: '0'
        });

        if (type === 'success') {
            modal.style.background = '#4CAF50';
        } else if (type === 'error') {
            modal.style.background = '#f44336';
        }

        modal.textContent = message;

        document.body.appendChild(modal);

        setTimeout(() => modal.style.opacity = '1', 10);

        setTimeout(() => {
            modal.style.opacity = '0';
            modal.addEventListener('transitionend', () => modal.remove());
        }, 3000);
    }

    function customPrompt(message, defaultValue = '') {
        return new Promise(resolve => {
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px',
                background: '#222',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
                zIndex: '10002',
                fontFamily: 'Inter, Arial, sans-serif',
                textAlign: 'center',
                minWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                transition: 'opacity 0.3s ease-in-out',
                opacity: '0'
            });

            const textDiv = document.createElement('div');
            textDiv.textContent = message;
            textDiv.style.fontSize = '16px';
            modal.appendChild(textDiv);

            const input = document.createElement('input');
            input.type = 'text';
            input.value = defaultValue;
            Object.assign(input.style, {
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #555',
                background: '#333',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
            });
            modal.appendChild(input);

            const buttonContainer = document.createElement('div');
            Object.assign(buttonContainer.style, {
                display: 'flex',
                justifyContent: 'space-around',
                gap: '10px',
                marginTop: '10px'
            });

            const okBtn = document.createElement('button');
            okBtn.textContent = 'OK';
            Object.assign(okBtn.style, {
                padding: '10px 20px',
                cursor: 'pointer',
                color: '#fff',
                background: '#007bff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                flexGrow: '1'
            });
            okBtn.onmouseover = () => okBtn.style.background = '#0056b3';
            okBtn.onmouseout = () => okBtn.style.background = '#007bff';
            okBtn.onclick = () => {
                modal.style.opacity = '0';
                modal.addEventListener('transitionend', () => modal.remove());
                resolve(input.value);
            };
            buttonContainer.appendChild(okBtn);

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            Object.assign(cancelBtn.style, {
                padding: '10px 20px',
                cursor: 'pointer',
                color: '#fff',
                background: '#6c757d',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                flexGrow: '1'
            });
            cancelBtn.onmouseover = () => cancelBtn.style.background = '#5a6268';
            cancelBtn.onmouseout = () => cancelBtn.style.background = '#6c757d';
            cancelBtn.onclick = () => {
                modal.style.opacity = '0';
                modal.addEventListener('transitionend', () => modal.remove());
                resolve(null);
            };
            buttonContainer.appendChild(cancelBtn);

            modal.appendChild(buttonContainer);
            document.body.appendChild(modal);

            setTimeout(() => modal.style.opacity = '1', 10);

            input.focus();
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    okBtn.click();
                }
            });
        });
    }

    function createStyledButton(text, fn) {
        const b = document.createElement('button');
        b.textContent = text;
        Object.assign(b.style, {
            padding: '10px',
            cursor: 'pointer',
            color: '#fff',
            background: '#3a3a3a',
            border: '1px solid #555',
            borderRadius: '5px',
            transition: 'background 0.2s ease-in-out',
            fontSize: '14px'
        });
        b.onmouseover = () => b.style.background = '#505050';
        b.onmouseout = () => b.style.background = '#3a3a3a';
        b.onclick = fn;
        return b;
    }

    function createUI() {
        uiContainer = document.createElement('div');
        Object.assign(uiContainer.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '280px', // Adjusted width
            background: '#1a1a1a',
            border: '2px solid #333',
            color: '#e0e0e0',
            padding: '15px 15px 15px 15px', // Adjusted padding
            zIndex: 10000,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontFamily: 'Inter, Arial, sans-serif',
            transition: 'top 0.3s ease-in-out'
        });

        // Close button
        const close = createStyledButton('×', () => uiContainer.remove());
        Object.assign(close.style, {
            position: 'absolute',
            top: '5px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            color: '#e0e0e0',
            fontWeight: 'bold',
            transition: 'color 0.2s',
            padding: '5px 8px'
        });
        close.onmouseover = () => close.style.color = '#fff';
        close.onmouseout = () => close.style.color = '#e0e0e0';
        close.title = 'Close AnnaUploader';
        uiContainer.appendChild(close);

        // Gear icon for settings
        const settingsGear = createStyledButton('⚙️', () => {
            createSettingsUI();
        });
        Object.assign(settingsGear.style, {
            position: 'absolute',
            top: '5px',
            left: '8px',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            color: '#e0e0e0',
            fontWeight: 'bold',
            transition: 'color 0.2s',
            padding: '5px 8px',
        });
        settingsGear.onmouseover = () => settingsGear.style.color = '#fff';
        settingsGear.onmouseout = () => settingsGear.style.color = '#e0e0e0';
        settingsGear.title = 'Settings';
        uiContainer.appendChild(settingsGear);

        const title = document.createElement('h3');
        title.textContent = 'AnnaUploader';
        title.style.margin = '0 0 10px 0';
        title.style.color = '#4af';
        title.style.textAlign = 'center';
        uiContainer.appendChild(title);

        uiContainer.appendChild(createStyledButton('Upload T-Shirts', () => {
            const i = document.createElement('input');
            i.type = 'file'; i.accept = 'image/*'; i.multiple = true;
            i.onchange = e => handleFileSelect(e.target.files, ASSET_TYPE_TSHIRT);
            i.click();
        }));
        uiContainer.appendChild(createStyledButton('Upload Decals', () => {
            const i = document.createElement('input');
            i.type = 'file'; i.accept = 'image/*'; i.multiple = true;
            i.onchange = e => handleFileSelect(e.target.files, ASSET_TYPE_DECAL);
            i.click();
        }));
        uiContainer.appendChild(createStyledButton('Upload Both', () => {
            const i = document.createElement('input');
            i.type = 'file'; i.accept = 'image/*'; i.multiple = true;
            i.onchange = e => handleFileSelect(e.target.files, null, true);
            i.click();
        }));

        toggleBtn = createStyledButton('Enable Mass Upload', () => {
            massMode = !massMode;
            toggleBtn.textContent = massMode ? 'Disable Mass Upload' : 'Enable Mass Upload';
            startBtn.style.display = massMode ? 'block' : 'none';
            massQueue = [];
            batchTotal = completed = 0;
            updateStatus();
            displayMessage(`Mass Upload Mode: ${massMode ? 'Enabled' : 'Disabled'}`, 'info');
        });
        uiContainer.appendChild(toggleBtn);

        startBtn = createStyledButton('Start Mass Upload', startMassUpload);
        startBtn.style.display = 'none';
        Object.assign(startBtn.style, {
            background: '#28a745',
            border: '1px solid #218838'
        });
        startBtn.onmouseover = () => startBtn.style.background = '#218838';
        startBtn.onmouseout = () => startBtn.style.background = '#28a745';
        uiContainer.appendChild(startBtn);

        const slipBtn = createStyledButton(`Slip Mode: ${useMakeUnique ? 'On' : 'Off'}`, () => {
            useMakeUnique = !useMakeUnique;
            GM_setValue('useMakeUnique', useMakeUnique);
            slipBtn.textContent = `Slip Mode: ${useMakeUnique ? 'On' : 'Off'}`;
            copiesInput.style.display = useMakeUnique ? 'block' : 'none';
            downloadBtn.style.display = useMakeUnique ? 'block' : 'none';

            if (!useMakeUnique) {
                useDownload = false;
                GM_setValue('useDownload', useDownload);
                downloadBtn.textContent = 'Download Images: Off';
            }
        });
        uiContainer.appendChild(slipBtn);

        copiesInput = document.createElement('input');
        copiesInput.type = 'number'; copiesInput.min = '1'; copiesInput.value = uniqueCopies;
        Object.assign(copiesInput.style, {
            width: '100%',
            boxSizing: 'border-box',
            display: useMakeUnique ? 'block' : 'none',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#333',
            color: '#fff',
            textAlign: 'center'
        });
        copiesInput.onchange = e => {
            const v = parseInt(e.target.value, 10);
            if (v > 0) {
                uniqueCopies = v;
                GM_setValue('uniqueCopies', uniqueCopies);
            }
            else e.target.value = uniqueCopies;
        };
        uiContainer.appendChild(copiesInput);

        downloadBtn = createStyledButton(`Download Images: ${useDownload ? 'On' : 'Off'}`, () => {
            useDownload = !useDownload;
            GM_setValue('useDownload', useDownload);
            downloadBtn.textContent = `Download Images: ${useDownload ? 'On' : 'Off'}`;
        });
        downloadBtn.style.display = useMakeUnique ? 'block' : 'none';
        uiContainer.appendChild(downloadBtn);

        uiContainer.appendChild(createStyledButton('Change ID', async () => {
            const inp = await customPrompt("Enter your Roblox User ID/URL or Group URL:", USER_ID || '');
            if (inp === null) return;
            let id, isGrp = false;
            const um = inp.match(/users\/(\d+)/);
            const gm = inp.match(/communities\/(\d+)/);
            if (um) {
                id = um[1];
            } else if (gm) {
                id = gm[1];
                isGrp = true;
            } else {
                id = inp.trim();
                if (isNaN(id) || id === '') {
                    displayMessage('Invalid input. Please enter a number or a valid URL.', 'error');
                    return;
                }
            }
            USER_ID = Number(id);
            IS_GROUP = isGrp;
            GM_setValue('userId', USER_ID);
            GM_setValue('isGroup', IS_GROUP);
            displayMessage(`Set to ${isGrp ? 'Group' : 'User'} ID: ${USER_ID}`, 'success');
        }));

        const pm = window.location.pathname.match(/^\/users\/(\d+)\/profile/);
        if (pm) {
            uiContainer.appendChild(createStyledButton('Use This Profile as ID', () => {
                USER_ID = Number(pm[1]);
                IS_GROUP = false;
                GM_setValue('userId', USER_ID);
                GM_setValue('isGroup', IS_GROUP);
                displayMessage(`User ID set to ${USER_ID}`, 'success');
            }));
        }

        const gm = window.location.pathname.match(/^\/communities\/(\d+)/);
        if (gm) {
            uiContainer.appendChild(createStyledButton('Use This Group as ID', () => {
                USER_ID = Number(gm[1]);
                IS_GROUP = true;
                GM_setValue('userId', USER_ID);
                GM_setValue('isGroup', IS_GROUP);
                displayMessage(`Group ID set to ${USER_ID}`, 'success');
            }));
        }

        // Removed the old 'Settings' button here.

        const hint = document.createElement('div');
        hint.textContent = 'Paste images (Ctrl+V) to queue/upload';
        hint.style.fontSize = '12px'; hint.style.color = '#aaa';
        hint.style.textAlign = 'center';
        hint.style.marginTop = '5px';
        uiContainer.appendChild(hint);

        statusEl = document.createElement('div');
        statusEl.style.fontSize = '13px'; statusEl.style.color = '#fff';
        statusEl.style.textAlign = 'center';
        statusEl.style.paddingTop = '5px';
        statusEl.style.borderTop = '1px solid #333';
        uiContainer.appendChild(statusEl);

        document.body.appendChild(uiContainer);
    }

    function createSettingsUI() {
        if (settingsModal) {
            settingsModal.style.display = 'flex';
            return;
        }

        settingsModal = document.createElement('div');
        Object.assign(settingsModal.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            background: '#1a1a1a',
            border: '2px solid #333',
            color: '#e0e0e0',
            padding: '20px',
            zIndex: 10005,
            borderRadius: '10px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            fontFamily: 'Inter, Arial, sans-serif',
        });

        const closeSettings = createStyledButton('×', () => {
            settingsModal.style.display = 'none';
        });
        Object.assign(closeSettings.style, {
            position: 'absolute',
            top: '8px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            color: '#e0e0e0',
            fontWeight: 'bold',
            transition: 'color 0.2s',
            padding: '5px 10px'
        });
        closeSettings.onmouseover = () => closeSettings.style.color = '#fff';
        closeSettings.onmouseout = () => closeSettings.style.color = '#e0e0e0';
        closeSettings.title = 'Close Settings';
        settingsModal.appendChild(closeSettings);

        const title = document.createElement('h3');
        title.textContent = 'AnnaUploader Settings';
        title.style.margin = '0 0 15px 0';
        title.style.color = '#4af';
        title.style.textAlign = 'center';
        settingsModal.appendChild(title);

        const nameBtn = createStyledButton(`Use default Name: ${useForcedName ? 'On' : 'Off'}`, () => {
            useForcedName = !useForcedName;
            GM_setValue('useForcedName', useForcedName);
            nameBtn.textContent = `Use default Name: ${useForcedName ? 'On' : 'Off'}`;
        });
        settingsModal.appendChild(nameBtn);

        // NEW: Asset Logging Toggle
        const assetLoggingBtn = createStyledButton(`Asset Logging: ${enableAssetLogging ? 'On' : 'Off'}`, () => {
            enableAssetLogging = !enableAssetLogging;
            GM_setValue('enableAssetLogging', enableAssetLogging);
            assetLoggingBtn.textContent = `Asset Logging: ${enableAssetLogging ? 'On' : 'Off'}`;
            toggleAssetScanner(enableAssetLogging);
            displayMessage(`Asset Logging: ${enableAssetLogging ? 'Enabled' : 'Disabled'}`, 'info');
        });
        settingsModal.appendChild(assetLoggingBtn);

        // Slip Mode Pixel Method setting
        const slipModePixelMethodLabel = document.createElement('label');
        slipModePixelMethodLabel.textContent = 'Slip Mode Pixel Method:';
        Object.assign(slipModePixelMethodLabel.style, {
            display: 'block',
            marginBottom: '5px',
            fontSize: '14px',
            color: '#bbb'
        });
        settingsModal.appendChild(slipModePixelMethodLabel);

        const slipModePixelMethodSelect = document.createElement('select');
        Object.assign(slipModePixelMethodSelect.style, {
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #555',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            marginBottom: '10px'
        });

        const optionAll = document.createElement('option');
        optionAll.value = 'all_pixels';
        optionAll.textContent = 'All Pixels (±1) [Slow on >300px]';
        slipModePixelMethodSelect.appendChild(optionAll);

        const optionRandom = document.createElement('option');
        optionRandom.value = '1-3_random';
        optionRandom.textContent = 'Random Pixels (±1-3) [Slow on >300px]';
        slipModePixelMethodSelect.appendChild(optionRandom);

        const optionSingleRandom = document.createElement('option');
        optionSingleRandom.value = '1-4_random_single_pixel';
        optionSingleRandom.textContent = 'Single Random Pixel (Fastest)';
        slipModePixelMethodSelect.appendChild(optionSingleRandom);

        const optionFullRandomSinglePixel = document.createElement('option');
        optionFullRandomSinglePixel.value = 'random_single_pixel_full_random_color';
        optionFullRandomSinglePixel.textContent = 'Single Random Pixel (Full Color) (Fastest)';
        slipModePixelMethodSelect.appendChild(optionFullRandomSinglePixel);

        slipModePixelMethodSelect.value = slipModePixelMethod;

        slipModePixelMethodSelect.onchange = (e) => {
            slipModePixelMethod = e.target.value;
            GM_setValue('slipModePixelMethod', slipModePixelMethod);
            displayMessage(`Slip Mode Pixel Method set to: ${e.target.options[e.target.selectedIndex].text}`, 'success');
        };
        settingsModal.appendChild(slipModePixelMethodSelect);

        // Slip Mode: Generate All First Toggle
        const generateFirstBtn = createStyledButton(`Slip Mode: Generate All First: ${slipModeGenerateAllFirst ? 'On' : 'Off'}`, () => {
            slipModeGenerateAllFirst = !slipModeGenerateAllFirst;
            GM_setValue('slipModeGenerateAllFirst', slipModeGenerateAllFirst);
            generateFirstBtn.textContent = `Slip Mode: Generate All First: ${slipModeGenerateAllFirst ? 'On' : 'Off'}`;
            displayMessage(`Generate All First: ${slipModeGenerateAllFirst ? 'Enabled' : 'Disabled'}`, 'info');
        });
        Object.assign(generateFirstBtn.style, {
             fontSize: '13px',
             background: '#444' // Slightly different color to distinguish sub-setting
        });
        settingsModal.appendChild(generateFirstBtn);

        // Force Upload (through Canvas) toggle
        const forceUploadBtn = createStyledButton(`Force Upload: ${useForceCanvasUpload ? 'On' : 'Off'}`, () => {
            useForceCanvasUpload = !useForceCanvasUpload;
            GM_setValue('useForceCanvasUpload', useForceCanvasUpload);
            forceUploadBtn.textContent = `Force Upload: ${useForceCanvasUpload ? 'On' : 'Off'}`;
            displayMessage(`Force Upload Mode: ${useForceCanvasUpload ? 'Enabled' : 'Disabled'}`, 'info');
        });
        settingsModal.appendChild(forceUploadBtn);

        // IMAGE RESIZE FEATURE
        const resizeContainer = document.createElement('div');
        resizeContainer.style.display = 'flex';
        resizeContainer.style.flexDirection = 'column';
        resizeContainer.style.gap = '5px';
        resizeContainer.style.margin = '10px 0';

        const resizeToggleBtn = createStyledButton(`Resize Images: ${enableResize ? 'On' : 'Off'}`, () => {
            enableResize = !enableResize;
            GM_setValue('enableResize', enableResize);
            resizeToggleBtn.textContent = `Resize Images: ${enableResize ? 'On' : 'Off'}`;
            widthInput.disabled = heightInput.disabled = !enableResize;
        });
        resizeContainer.appendChild(resizeToggleBtn);

        // Input fields for width/height
        const inputRow = document.createElement('div');
        inputRow.style.display = 'flex';
        inputRow.style.gap = '7px';
        inputRow.style.alignItems = 'center';

        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.min = '1';
        widthInput.value = resizeWidth;
        widthInput.placeholder = 'Width';
        widthInput.style.width = '60px';
        widthInput.style.padding = '6px';
        widthInput.style.borderRadius = '4px';
        widthInput.style.border = '1px solid #555';
        widthInput.style.background = '#333';
        widthInput.style.color = '#fff';
        widthInput.disabled = !enableResize;
        widthInput.onchange = () => {
            let val = Math.max(1, parseInt(widthInput.value, 10) || 512);
            widthInput.value = val;
            resizeWidth = val;
            GM_setValue('resizeWidth', resizeWidth);
        };
        inputRow.appendChild(widthInput);

        const xLabel = document.createElement('span');
        xLabel.textContent = '×';
        xLabel.style.color = '#ccc';
        inputRow.appendChild(xLabel);

        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.min = '1';
        heightInput.value = resizeHeight;
        heightInput.placeholder = 'Height';
        heightInput.style.width = '60px';
        heightInput.style.padding = '6px';
        heightInput.style.borderRadius = '4px';
        heightInput.style.border = '1px solid #555';
        heightInput.style.background = '#333';
        heightInput.style.color = '#fff';
        heightInput.disabled = !enableResize;
        heightInput.onchange = () => {
            let val = Math.max(1, parseInt(heightInput.value, 10) || 512);
            heightInput.value = val;
            resizeHeight = val;
            GM_setValue('resizeHeight', resizeHeight);
        };
        inputRow.appendChild(heightInput);

        const pxLabel = document.createElement('span');
        pxLabel.textContent = 'px';
        pxLabel.style.color = '#bbb';
        inputRow.appendChild(pxLabel);

        resizeContainer.appendChild(inputRow);

        const resizeDesc = document.createElement('div');
        resizeDesc.textContent = "If enabled, images will be resized before upload. Applies to Slip Mode too.";
        resizeDesc.style.fontSize = '12px';
        resizeDesc.style.color = '#aaa';
        resizeDesc.style.marginTop = '3px';
        resizeContainer.appendChild(resizeDesc);

        settingsModal.appendChild(resizeContainer);

        settingsModal.appendChild(createStyledButton('Show Logged Assets', () => {
            const log = loadLog();
            const entries = Object.entries(log);
            const w = window.open('', '_blank');
            w.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Logged Assets</title>
<style>
body { font-family:Arial; padding:20px; background:#121212; color:#f0f0f0; }
h1 { margin-bottom:15px; color:#4af; }
ul { list-style:none; padding:0; }
li { margin-bottom:15px; padding:10px; background:#1e1e1e; border-radius:8px; display:flex; flex-direction:column; gap:8px;}
img { max-height:60px; border:1px solid #444; border-radius:4px; object-fit:contain; background:#333; }
.asset-info { display:flex;align-items:center;gap:15px; }
a { color:#7cf; text-decoration:none; font-weight:bold; }
a:hover { text-decoration:underline; }
.asset-name { font-size:0.9em; color:#bbb; margin-left: auto; text-align: right; }
button { margin-bottom:20px; color:#fff; background:#3a3a3a; border:1px solid #555; padding:8px 15px; border-radius:5px; cursor:pointer; }
button:hover { background:#505050; }
</style></head><body>
<button onclick="document.body.style.background=(document.body.style.background==='#121212'?'#f0f0f0':'#121212');document.body.style.color=(document.body.style.color==='#f0f0f0'?'#121212':'#f0f0f0');d[...]
<h1>Logged Assets</h1>
${ entries.length ? `<ul>${entries.map(([id,entry])=>
    `<li>
        <div class="asset-info">
            ${ entry.image ? `<img src="${entry.image}" alt="Asset thumbnail">`  : `<span style="color:#888;">(no image)</span>` }
            <a href="https://create.roblox.com/store/asset/${id}" target="_blank">${id}</a>
            <span style="font-size:0.85em; color:#999;">${new Date(entry.date).toLocaleString()}</span>
        </div>
        <div class="asset-name">${entry.name}</div>
    </li>`).join('') }</ul>` : `<p style="color:#888;"><em>No assets logged yet.</em></p>`}
</body></html>`);
            w.document.close();
        }));

        document.body.appendChild(settingsModal);
    }

    async function handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        const resizeActive = enableResize && Number(resizeWidth) > 0 && Number(resizeHeight) > 0;

        for (const it of items) {
            if (it.type.startsWith('image')) {
                e.preventDefault();
                const blob = it.getAsFile();
                const ts = new Date().toISOString().replace(/[^a-z0-9]/gi,'_');

                const pastedName = await customPrompt('Enter a name for the image (no extension):', `pasted_${ts}`);
                if (pastedName === null) return;
                let name = pastedName.trim() || `pasted_${ts}`;
                let filename = name.endsWith('.png') ? name : `${name}.png`;

                let fileToProcess = new File([blob], filename, {type: blob.type});

                if (blob.type === 'image/webp') {
                    displayMessage(`Converting pasted WebP image to PNG...`, 'info');
                    try {
                        fileToProcess = await convertWebPToPng(fileToProcess);
                        name = baseName(fileToProcess.name);
                        filename = fileToProcess.name;
                        displayMessage(`Pasted WebP converted to PNG.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to convert pasted WebP: ${error.message}`, 'error');
                        console.error(`[Conversion] Failed to convert pasted WebP:`, error);
                        return;
                    }
                }

                // Resize if enabled
                if (resizeActive) {
                    displayMessage(`Resizing pasted image to ${resizeWidth}x${resizeHeight}...`, 'info');
                    try {
                        fileToProcess = await resizeImageFile(fileToProcess, Number(resizeWidth), Number(resizeHeight));
                        name = baseName(fileToProcess.name);
                        filename = fileToProcess.name;
                        displayMessage(`Pasted image resized.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to resize pasted image: ${error.message}`, 'error');
                        console.error(`[Resize] Failed to resize pasted image:`, error);
                        return;
                    }
                }

                if (useForceCanvasUpload) {
                    displayMessage(`Processing pasted image through canvas...`, 'info');
                    try {
                        fileToProcess = await processImageThroughCanvas(
                            fileToProcess, 'image/png',
                            resizeActive ? Number(resizeWidth) : null,
                            resizeActive ? Number(resizeHeight) : null
                        );
                        name = baseName(fileToProcess.name);
                        filename = fileToProcess.name;
                        displayMessage(`Pasted image processed through canvas.`, 'success');
                    } catch (error) {
                        displayMessage(`Failed to process pasted image through canvas: ${error.message}`, 'error');
                        console.error(`[Canvas Process] Failed to process pasted image:`, error);
                        return;
                    }
                }

                const typeChoice = await customPrompt('Upload as T=T-Shirt, D=Decal, B=Both, or C=Cancel?', 'D');
                if (!typeChoice) return;
                const t = typeChoice.trim().toUpperCase();

                let uploadAsBoth = false;
                let type = null;

                if (t === 'T') {
                    type = ASSET_TYPE_TSHIRT;
                } else if (t === 'D') {
                    type = ASSET_TYPE_DECAL;
                } else if (t === 'B') {
                    uploadAsBoth = true;
                } else {
                    displayMessage('Invalid asset type selected. Please choose T, D, or B.', 'error');
                    return;
                }

                handleFileSelect([fileToProcess], type, uploadAsBoth);
                break;
            }
        }
    }

    window.addEventListener('load', () => {
        createUI();
        document.addEventListener('paste', handlePaste);

        if (enableAssetLogging) {
            scanForAssets(); // Run an initial scan
            console.log('[AnnaUploader] initialized; asset logging is ON. Scanner will run every ' + (SCAN_INTERVAL_MS/1000) + 's');
        } else {
            console.log('[AnnaUploader] initialized; asset logging is OFF.');
        }
        toggleAssetScanner(enableAssetLogging); // Start/stop the interval based on the setting
    });

})();
