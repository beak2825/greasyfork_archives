// ==UserScript==
// @name         Uploader - Tải Lên Nhiều File (v23.4 - Nâng Cấp Toàn Diện)
// @namespace    http://tampermonkey.net/
// @version      23.4
// @description  Nâng cấp từ v23.1: Thêm Lịch sử, Tiếp tục, Xuất/Nhập và thay đổi logic để dịch trực tiếp tên file làm tiêu đề.
// @author       Bạn & AI Helper
// @match        *://*/uploader/list-chapter/*
// @match        *://*/uploader/add-chapter/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541614/Uploader%20-%20T%E1%BA%A3i%20L%C3%AAn%20Nhi%E1%BB%81u%20File%20%28v234%20-%20N%C3%A2ng%20C%E1%BA%A5p%20To%C3%A0n%20Di%E1%BB%87n%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541614/Uploader%20-%20T%E1%BA%A3i%20L%C3%AAn%20Nhi%E1%BB%81u%20File%20%28v234%20-%20N%C3%A2ng%20C%E1%BA%A5p%20To%C3%A0n%20Di%E1%BB%87n%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CẤU HÌNH (Từ v23.1) ---
    const MIN_WAIT_TIME = 2500, MAX_WAIT_TIME = 3000, MAX_RETRIES_PER_FILE = 3, REQUEST_TIMEOUT = 10000;

    // --- CẤU HÌNH MỚI ---
    const HISTORY_STORAGE_KEY = 'uploaderHistory_v4';

    // --- CSS ---
    GM_addStyle(`
        #unstoppable-uploader-log-panel { font-size: 13px; font-family: monospace; background-color: #1a1d21; color: #ced4da; padding: 8px; margin-top: 10px; border-radius: 4px; white-space: pre-wrap; max-height: 250px; overflow-y: auto; border: 1px solid #444; display: none; }
        .unstoppable-log-success { color: #28a745; font-weight: bold; } .unstoppable-log-error { color: #dc3545; font-weight: bold; }
        .unstoppable-log-info { color: #17a2b8; } .unstoppable-log-warn { color: #ffc107; }
        .unstoppable-log-title { color: #00bcd4; } .unstoppable-log-skipped { color: #6c757d; font-style: italic; }
        .folder-upload-button { margin-left: 8px !important; background-color: #28a745 !important; }
        .control-container { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .button-group { display: flex; justify-content: center; gap: 10px; }
        #resume-button.is-resuming { background-color: #dc3545 !important; }
    `);

    // --- BIẾN TOÀN CỤC ---
    const pageAPI = unsafeWindow;
    let uploadedHistory = {};
    let pendingFilesQueue = [];
    let isProcessing = false;
    let totalChaptersInBatch = 0;

    // --- QUẢN LÝ LỊCH SỬ ---
    const historyManager = {
        load: () => { uploadedHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '{}'); },
        save: () => localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(uploadedHistory)),
        add: (id, name) => { uploadedHistory[id] = { n: name, d: new Date().toISOString() }; historyManager.save(); },
        has: (id) => uploadedHistory.hasOwnProperty(id),
        clear: () => { if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử đăng tải không?')) { uploadedHistory = {}; historyManager.save(); alert('Đã xóa lịch sử.'); }},
        export: () => {
            const dataToExport = Object.entries(uploadedHistory).map(([id, data]) => ({ id, ...data }));
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
            a.download = `sangtacviet_upload_history_${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(a.href);
        },
        import: () => {
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const importedData = JSON.parse(event.target.result);
                        if (!Array.isArray(importedData)) throw new Error('File không hợp lệ.');
                        let newIds = 0;
                        importedData.forEach(item => { if (item && item.id && !historyManager.has(item.id.toString())) { historyManager.add(item.id.toString(), item.n || `Imported ${item.id}`); newIds++; }});
                        alert(`Nhập thành công! Đã thêm ${newIds} ID mới vào lịch sử.`);
                    } catch (err) { alert(`Lỗi khi nhập file: ${err.message}`); }
                };
                reader.readAsText(file);
            };
            input.click();
        }
    };

    // --- CÁC HÀM TIỆN ÍCH ---
    const translateTextPromise = (text) => new Promise((resolve, reject) => {
        if (!pageAPI.ajax) return reject(new Error("Hàm 'ajax' không tồn tại."));
        pageAPI.ajax(`sajax=trans&content=${encodeURIComponent(text)}`, (res) => resolve(res.trim()));
    });
    const getRandomWaitTime = () => Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME) + MIN_WAIT_TIME;

    // --- HÀM ĐĂNG TẢI "BẤT TỬ" (ĐÃ SỬA ĐỔI) ---
    async function unstoppableUpload(file, log) {
        // **THAY ĐỔI CỐT LÕI: DỊCH TÊN FILE THAY VÌ DÒNG ĐẦU TIÊN**
        let titleLine = file.name; // Lấy tên file làm nguồn
        const chapterContent = await file.text(); // Đọc nội dung để lưu

        titleLine = titleLine.trim().replace(/\.txt$/i, '').trim(); // Chỉ bỏ đuôi .txt
        const translatedTitle = await translateTextPromise(titleLine);
        log(` -> Tiêu đề xử lý: "${translatedTitle}"`, 'unstoppable-log-title');

        let attempts = 0;
        while (attempts < MAX_RETRIES_PER_FILE) {
            const numInput = pageAPI.g("ip-num");
            if (!numInput) throw new Error("Không tìm thấy ô 'Số chương' (ip-num).");
            const currentChapterNumber = numInput.value;

            try {
                log(` -> Thử lần ${attempts + 1}/${MAX_RETRIES_PER_FILE} với số chương ${currentChapterNumber}...`, 'warn');
                const createPromise = new Promise((resolve, reject) => pageAPI.ajax(`ajax=bookmanager&action=createchap&ctx=${currentChapterNumber}&pctx=${pageAPI.contextParent}`, d => (d === "data broken" || !/^\d+$/.test(d)) ? reject(new Error(`Server từ chối`)) : resolve(parseInt(d))));
                const timeoutCreate = new Promise((_, reject) => setTimeout(() => reject(new Error('Hết thời gian chờ (Tạo)')), REQUEST_TIMEOUT));
                const chapterId = await Promise.race([createPromise, timeoutCreate]);

                // **THAY ĐỔI CỐT LÕI: Gửi tiêu đề đã dịch và toàn bộ nội dung gốc**
                const payload = [{ uname: "name", name: translatedTitle, ctx: chapterId }, { uname: "content", content: chapterContent.replace(/</g, ""), ctx: chapterId }];
                const savePromise = new Promise((resolve, reject) => pageAPI.postSaves(payload, (response) => response === "" ? resolve() : reject(new Error(response || "Lỗi không xác định (Lưu)"))));
                const timeoutSave = new Promise((_, reject) => setTimeout(() => reject(new Error('Hết thời gian chờ (Lưu)')), REQUEST_TIMEOUT));
                await Promise.race([savePromise, timeoutSave]);

                numInput.value = parseInt(currentChapterNumber) + 1;
                return true;
            } catch (error) {
                log(` -> Lỗi với số ${currentChapterNumber}: ${error.message}`, 'error');
                attempts++;
                numInput.value = parseInt(currentChapterNumber) + 1;
            }
        }
        return false;
    }

    // --- HÀM CHÍNH ĐỂ THIẾT LẬP GIAO DIỆN ---
    function setupUploaderInterface(originalButton) {
        if (originalButton.dataset.enhanced) return;
        originalButton.dataset.enhanced = 'true';

        const parentContainer = originalButton.parentNode;
        const logPanel = document.createElement('div');
        logPanel.id = 'unstoppable-uploader-log-panel';

        const controlContainer = document.createElement('div'); controlContainer.className = 'control-container';
        const resumeContainer = document.createElement('div'); resumeContainer.className = 'button-group';
        const historyContainer = document.createElement('div'); historyContainer.className = 'button-group';

        const resumeButton = document.createElement('button'); resumeButton.textContent = 'Bắt đầu'; resumeButton.id = 'resume-button'; resumeButton.className = 'primary'; resumeButton.style.display = 'none';

        const exportBtn = document.createElement('button'); exportBtn.textContent = 'Xuất Lịch sử'; exportBtn.className='primary'; exportBtn.onclick = historyManager.export;
        const importBtn = document.createElement('button'); importBtn.textContent = 'Nhập Lịch sử'; importBtn.className='primary'; importBtn.onclick = historyManager.import;
        const clearBtn = document.createElement('button'); clearBtn.textContent = 'Xóa Lịch sử'; clearBtn.className='primary'; clearBtn.style.backgroundColor='#dc3545'; clearBtn.onclick = historyManager.clear;

        resumeContainer.appendChild(resumeButton);
        historyContainer.appendChild(exportBtn); historyContainer.appendChild(importBtn); historyContainer.appendChild(clearBtn);
        controlContainer.appendChild(resumeContainer); controlContainer.appendChild(historyContainer);

        parentContainer.parentElement.appendChild(logPanel);
        parentContainer.parentElement.appendChild(controlContainer);

        const log = (message, type) => { /* ... */ }; // Giữ nguyên hàm log
        const log_func = (message, type) => {
            const typeClass = type ? ` class="unstoppable-log-${type}"` : '';
            logPanel.innerHTML += `<div${typeClass}>${message.replace(/</g, "<").replace(/>/g, ">")}</div>`;
            logPanel.scrollTop = logPanel.scrollHeight;
        };

        async function startOrResumeUpload() {
            if (isProcessing) return;
            if (pendingFilesQueue.length === 0) { log_func('Không còn file nào trong hàng chờ.', 'info'); return; }

            isProcessing = true;
            logPanel.style.display = 'block';
            log_func(`Bắt đầu/Tiếp tục xử lý ${pendingFilesQueue.length} chương còn lại...`, 'info');
            resumeButton.disabled = true; resumeButton.textContent = 'Đang xử lý...';

            while (pendingFilesQueue.length > 0) {
                const file = pendingFilesQueue[0];
                log_func(`[${totalChaptersInBatch - pendingFilesQueue.length + 1}/${totalChaptersInBatch}] Đang xử lý: ${file.name}`, 'info');

                try {
                    // **THAY ĐỔI CỐT LÕI: Truyền cả đối tượng file vào hàm upload**
                    const success = await unstoppableUpload(file, log_func);
                    if (success) {
                        log_func(` -> HOÀN TẤT!`, 'unstoppable-log-success');
                        const fileIdMatch = file.name.match(/(\d+)\.txt$/i);
                        if (fileIdMatch) historyManager.add(fileIdMatch[1], file.name);
                    } else {
                        log_func(` -> ĐÃ BỎ QUA sau ${MAX_RETRIES_PER_FILE} lần thử.`, 'unstoppable-log-skipped');
                    }
                } catch(error) {
                    log_func(` -> Lỗi nghiêm trọng khi xử lý file: ${error.message}`, 'error');
                }

                pendingFilesQueue.shift();

                if (pendingFilesQueue.length > 0) {
                    resumeButton.textContent = `Tiếp Tục (${pendingFilesQueue.length} còn lại)`;
                    resumeButton.classList.add('is-resuming');
                    const waitTime = getRandomWaitTime();
                    log_func(` -> Chờ ${ (waitTime / 1000).toFixed(1) } giây...`, 'info');
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
            log_func(`--- QUÁ TRÌNH KẾT THÚC. ---`, 'unstoppable-log-success');
            resumeButton.style.display = 'none';
            isProcessing = false;
        }
        resumeButton.onclick = startOrResumeUpload;

        function prepareFileList(allFiles) {
            if (isProcessing) { alert('Đang có quá trình chạy, vui lòng chờ.'); return; }
            if (!allFiles || allFiles.length === 0) return;

            logPanel.style.display = 'block'; logPanel.innerHTML = '';
            log_func(`Đã chọn ${allFiles.length} file. Bắt đầu quét lịch sử...`, 'info');

            const filesToProcess = allFiles.filter(file => {
                const fileIdMatch = file.name.match(/(\d+)\.txt$/i);
                if (fileIdMatch && historyManager.has(fileIdMatch[1])) {
                    log_func(` -> Bỏ qua (lịch sử): ${file.name}`, 'unstoppable-log-skipped');
                    return false;
                }
                return true;
            });

            if (filesToProcess.length === 0) {
                log_func('Tất cả các file đã chọn đều đã có trong lịch sử.', 'success');
                return;
            }

            filesToProcess.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
            pendingFilesQueue = [...filesToProcess];
            totalChaptersInBatch = filesToProcess.length;

            resumeButton.style.display = 'inline-block';
            resumeButton.disabled = false;
            resumeButton.textContent = `Bắt đầu (${totalChaptersInBatch} chương mới)`;
            resumeButton.classList.remove('is-resuming');

            log_func(`Quét xong. Tìm thấy ${totalChaptersInBatch} chương mới. Nhấn "Bắt đầu".`, 'success');
        }

        originalButton.onclick = (event) => {
            event.preventDefault();
            const fileInput = document.createElement('input');
            fileInput.type = 'file'; fileInput.multiple = true; fileInput.accept = '.txt';
            fileInput.style.display = 'none'; document.body.appendChild(fileInput);
            fileInput.onchange = (e) => { prepareFileList(Array.from(e.target.files)); document.body.removeChild(fileInput); };
            fileInput.click();
        };

        const folderInput = document.createElement('input');
        folderInput.type = 'file'; folderInput.webkitdirectory = true; folderInput.style.display = 'none';
        const folderButton = document.createElement('button');
        folderButton.textContent = 'Mở Thư Mục';
        folderButton.className = originalButton.className + ' folder-upload-button';
        folderButton.type = 'button';
        folderButton.onclick = () => folderInput.click();
        folderInput.onchange = (e) => {
            const files = Array.from(e.target.files).filter(f => f.name.toLowerCase().endsWith('.txt'));
            prepareFileList(files);
        };

        parentContainer.appendChild(folderButton);
        parentContainer.appendChild(folderInput);
    }

    const observer = new MutationObserver((mutationsList) => {
        const originalButton = document.querySelector('#wdaddtxt button[onclick="loadTxtFile()"]');
        if (originalButton && !originalButton.dataset.enhanced) {
            setupUploaderInterface(originalButton);
        }
    });

    historyManager.load();
    observer.observe(document.body, { childList: true, subtree: true });

})();