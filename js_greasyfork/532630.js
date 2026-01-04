// ==UserScript==
// @name         NZBGrabit Image Paster
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      3.9
// @description  Auto-upload pasted or dragged images to Imgur with progress bars, queue, speed, ETA, and history
// @author       JRem (Updated by Gemini)
// @icon         https://icons.duckduckgo.com/ip2/nzbgrabit.org.ico
// @match        https://www.nzbgrabit.org/managenzb.php?*
// @match        https://www.nzbgrabit.org/showthread.php?*
// @match        https://www.nzbgrabit.org/nzbdetail.php?*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532630/NZBGrabit%20Image%20Paster.user.js
// @updateURL https://update.greasyfork.org/scripts/532630/NZBGrabit%20Image%20Paster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const IMGUR_CLIENT_ID = 'd70305e7c3ac5c6';
    const MAX_FILE_SIZE_MB = 20;
    const queuedFiles = [];
    let activeUploads = 0;
    let lastInput = null;
    let historyMenuElement = null;

    // --- UTILITY FUNCTIONS ---
    const pasteTextAtCursor = (text, el) => {
        if (!el) return;
        if (typeof el.selectionStart === 'number') {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            el.value = el.value.slice(0, start) + text + el.value.slice(end);
            el.selectionStart = el.selectionEnd = start + text.length;
        } else if (el.isContentEditable) {
            const sel = window.getSelection();
            if (!sel.rangeCount) return;
            const range = sel.getRangeAt(0);
            const node = document.createTextNode(text);
            range.deleteContents();
            range.insertNode(node);
            range.setStartAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    // --- HISTORY FUNCTIONS ---
    const loadHistory = async () => {
        try {
            const raw = await GM_getValue('imgur_upload_history', '[]');
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    };

    const saveToHistory = async (entry) => {
        const history = await loadHistory();
        history.unshift(entry);
        if (history.length > 50) history.pop();
        await GM_setValue('imgur_upload_history', JSON.stringify(history));
    };

    // --- IMAGE PROCESSING ---
    const convertAvifToPng = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name.replace(/\.avif$/i, '.png'), { type: 'image/png' }));
                }, 'image/png');
            };
            img.onerror = () => resolve(file);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });

    const compressImage = (file, maxSizeMB, statusEl) => new Promise((resolve) => {
        if (file.size <= maxSizeMB * 1024 * 1024 || file.type === 'image/avif') return resolve(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                let quality = 0.92;
                const attemptCompression = () => {
                    canvas.toBlob((blob) => {
                        if (statusEl) statusEl.textContent = `Compressing... (${(blob.size / 1024 / 1024).toFixed(1)}MB)`;
                        if (blob.size <= maxSizeMB * 1024 * 1024 || quality < 0.1) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                        } else {
                            quality -= 0.05;
                            attemptCompression();
                        }
                    }, 'image/jpeg', quality);
                };
                attemptCompression();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // --- UI & QUEUE MANAGEMENT ---
    const createProgressContainer = () => {
        let container = document.getElementById('imgur-progress-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'imgur-progress-container';
            Object.assign(container.style, {
                position: 'fixed', bottom: '70px', right: '20px', width: '340px', maxHeight: '400px',
                overflowY: 'auto', background: 'rgba(0,0,0,0.8)', padding: '10px',
                borderRadius: '8px', zIndex: '9999', color: '#fff', fontFamily: 'sans-serif'
            });
            container.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;">Upload Queue</div>';
            document.body.appendChild(container);
        }
        return container;
    };

    const queueFile = (file) => {
        const container = createProgressContainer();
        const entry = document.createElement('div');
        entry.style.marginBottom = '8px';
        entry.innerHTML = `
            <div style="font-size:90%; margin-bottom:2px; word-wrap:break-word;">Queued: ${file.name}</div>
            <div style="background:#444; height:10px; border-radius:4px; overflow:hidden;">
                <div class="bar" style="background:#3af; height:10px; width:0%"></div>
            </div>
            <div class="status" style="font-size:80%; margin-top:2px; color:#ccc"></div>
        `;
        container.appendChild(entry);
        queuedFiles.push({ file, entry });
        processQueue();
    };

    const processQueue = async () => {
        if (activeUploads > 0 || queuedFiles.length === 0) return;
        const { file, entry } = queuedFiles.shift();
        activeUploads++;

        const statusEl = entry.querySelector('.status');
        const bar = entry.querySelector('.bar');

        const preProcessed = file.type === 'image/avif' ? await convertAvifToPng(file) : file;
        const compressed = await compressImage(preProcessed, MAX_FILE_SIZE_MB, statusEl);

        const formData = new FormData();
        formData.append('image', compressed);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.imgur.com/3/image');
        xhr.setRequestHeader('Authorization', `Client-ID ${IMGUR_CLIENT_ID}`);

        const startTime = Date.now();
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = (event.loaded / event.total) * 100;
                bar.style.width = `${percent.toFixed(1)}%`;
                const elapsed = (Date.now() - startTime) / 1000;
                const speed = elapsed > 0 ? event.loaded / elapsed : 0;
                const eta = speed > 0 ? (event.total - event.loaded) / speed : 0;
                const speedStr = speed > 1024 * 1024 ? `${(speed / 1024 / 1024).toFixed(1)} MB/s` : `${(speed / 1024).toFixed(1)} KB/s`;
                statusEl.textContent = `${percent.toFixed(1)}% • ${speedStr} • ETA ${Math.ceil(eta)}s`;
            }
        };

        xhr.onload = () => {
            activeUploads--;
            try {
                const json = JSON.parse(xhr.responseText);
                if (json.success) {
                    bar.style.backgroundColor = '#2c3';
                    entry.querySelector('div').textContent = `✅ ${file.name}`;
                    statusEl.textContent = json.data.link;
                    saveToHistory({ name: file.name, url: json.data.link, status: '✅ Success', time: new Date().toLocaleString() });
                    if (lastInput) {
                        const tag = lastInput.tagName?.toLowerCase();
                        const isEditable = lastInput.isContentEditable;
                        const isTextarea = tag === 'textarea' || isEditable;
                        const text = isTextarea ? `[img]${json.data.link}[/img]\n` : `${json.data.link}\n`;
                        pasteTextAtCursor(text, lastInput);
                    }
                } else {
                    bar.style.backgroundColor = '#d44';
                    const errorMsg = `❌ Failed: ${json.data?.error || 'Unknown error'}`;
                    statusEl.textContent = errorMsg;
                    saveToHistory({ name: file.name, url: '', status: errorMsg, time: new Date().toLocaleString() });
                }
            } catch (err) {
                statusEl.textContent = `❌ Invalid response`;
            }
            setTimeout(() => entry.remove(), 5000);
            processQueue();
        };

        xhr.onerror = () => {
            activeUploads--;
            bar.style.backgroundColor = '#d44';
            const errorMsg = '❌ Upload failed (Network Error)';
            statusEl.textContent = errorMsg;
            saveToHistory({ name: file.name, url: '', status: errorMsg, time: new Date().toLocaleString() });
            setTimeout(() => entry.remove(), 5000);
            processQueue();
        };

        xhr.send(formData);
    };


    // --- HISTORY UI ---
    async function showHistoryMenu() {
        if (historyMenuElement) {
            historyMenuElement.remove();
            historyMenuElement = null;
            return;
        }

        const history = await loadHistory();
        const div = document.createElement('div');
        historyMenuElement = div;
        Object.assign(div.style, {
            position: 'fixed', bottom: '70px', right: '20px', background: '#111', color: '#fff',
            padding: '10px', zIndex: '10001', borderRadius: '10px', width: '340px',
            maxHeight: '400px', overflowY: 'auto', fontFamily: 'sans-serif', border: '1px solid #444'
        });

        div.innerHTML = `
            <div style="font-weight:bold; margin-bottom: 5px; font-size: 14px;">Upload History</div>
            <button id="hist-close" style="position:absolute;top:5px;right:5px;background:#333;color:#fff;border:none;cursor:pointer;border-radius:4px;padding:2px 5px;">✖</button>
            <button id="hist-clear" style="position:absolute;top:5px;left:5px;background:#333;color:#fff;border:none;cursor:pointer;border-radius:4px;padding:2px 5px;">Clear</button>
            <div id="hist-list" style="margin-top:25px;"></div>
        `;
        document.body.appendChild(div);

        div.querySelector('#hist-close').onclick = () => showHistoryMenu();
        div.querySelector('#hist-clear').onclick = async () => {
            if (confirm('Are you sure you want to clear all upload history?')) {
                await GM_setValue('imgur_upload_history', '[]');
                showHistoryMenu();
            }
        };

        const list = div.querySelector('#hist-list');
        if (history.length === 0) {
            list.textContent = 'No history yet.';
            list.style.textAlign = 'center';
            list.style.padding = '10px';
        } else {
            history.forEach(entry => {
                const line = document.createElement('div');
                line.style.cssText = 'border-top: 1px solid #333; padding: 5px 0; font-size: 12px;';
                if (entry.url) {
                    line.style.cursor = 'pointer';
                    line.title = 'Click to copy URL';
                    line.onclick = (e) => {
                        if (e.target.tagName !== 'A') {
                            navigator.clipboard.writeText(entry.url);
                            const statusEl = line.querySelector('strong');
                            if(statusEl) statusEl.textContent = 'Copied!';
                        }
                    };
                }
                line.innerHTML = `
                    <strong>${entry.status}</strong> <br>
                    <span style="word-wrap:break-word;color:#ccc;">${entry.name}</span> <br>
                    <a href="${entry.url}" target="_blank" style="color:#4af;word-wrap:break-word;">${entry.url || ''}</a>
                    <br><small style="color:#888;">${entry.time}</small>
                `;
                list.appendChild(line);
            });
        }
    }

    // --- INITIALIZATION ---
    function initialize() {
        createProgressContainer();

        const zone = document.createElement('div');
        zone.textContent = 'Drop Images Here';
        Object.assign(zone.style, {
            position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#222',
            color: '#fff', padding: '10px 20px', border: '2px dashed #aaa',
            borderRadius: '8px', zIndex: '10000', fontFamily: 'sans-serif'
        });
        document.body.appendChild(zone);
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('dragenter', () => { lastInput = document.activeElement; });
        zone.addEventListener('drop', e => {
            e.preventDefault();
            [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')).forEach(queueFile);
        });

        const histBtn = document.createElement('button');
        histBtn.textContent = '📜';
        histBtn.title = 'Upload History';
        Object.assign(histBtn.style, {
            position: 'fixed', bottom: '25px', right: '210px', zIndex: '10001', padding: '5px 10px',
            borderRadius: '6px', border: 'none', background: '#333', color: '#fff',
            cursor: 'pointer', fontSize: '14px', lineHeight: '1'
        });
        histBtn.onclick = showHistoryMenu;
        document.body.appendChild(histBtn);

        document.addEventListener('paste', (e) => {
            if (!e.clipboardData?.items) return;
            lastInput = document.activeElement;
            for (const item of e.clipboardData.items) {
                if (item.kind === 'file' && item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) queueFile(file);
                }
            }
        });
    }

    initialize();
})();