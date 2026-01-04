// ==UserScript==
// @name         Claude Project Downloader
// @name:en      Claude Project Downloader
// @name:ja      Claudeプロジェクトダウンローダー
// @namespace    https://nomin.jp/
// @version      1.0
// @description  A one-click project downloader for Claude.
// @description:en A one-click project downloader for Claude.
// @description:ja ワンクリック式のClaudeプロジェクトダウンローダー。
// @author       nomin
// @license      All Rights Reserved
// @match        https://claude.ai/*
// @require      https://unpkg.com/fflate/umd/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIvPjxwb2x5bGluZSBwb2ludHM9IjcgMTAgMTIgMTUgMTcgMTAiLz48bGluZSB4MT0iMTIiIHkxPSIxNSIgeDI9IjEyIiB5Mj0iMyIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/545726/Claude%20Project%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545726/Claude%20Project%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInitialized = false;

    function initializeDownloaderUI() {
        if (typeof fflate === 'undefined' || typeof saveAs === 'undefined') { return; }
        if (document.getElementById('downloader-corner-container')) return;

        const ICONS = {
            DOWNLOAD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
            SPINNER: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>`,
            SUCCESS: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
            ERROR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
            CANCEL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        };

        const cornerContainer = document.createElement('div');
        cornerContainer.id = 'downloader-corner-container';
        cornerContainer.innerHTML = `<button id="downloader-start-btn" class="downloader-btn"><span class="icon">${ICONS.DOWNLOAD}</span><span>プロジェクトをダウンロード</span></button>`;
        document.body.appendChild(cornerContainer);

        const modalContainer = document.createElement('div');
        modalContainer.id = 'downloader-modal-container';
        modalContainer.innerHTML = `
            <div id="downloader-modal-card">
                <div id="downloader-main-status"><span class="icon"></span><span class="text"></span></div>
                <div id="downloader-progress-bar-container"><div class="progress-bar-fill"></div></div>
                <div id="downloader-detail-status"></div>
                <button id="downloader-cancel-btn">キャンセル</button>
            </div>
        `;
        document.body.appendChild(modalContainer);

        GM_addStyle(`
            :root{--color-text:#FFFFFF;--color-background:#111111;--color-overlay:rgba(10,10,10,0.75);--color-border:rgba(255,255,255,0.15);--color-progress:#FFFFFF;--color-cancel-text:rgba(255,255,255,0.6);--transition-speed:0.6s;--transition-curve:cubic-bezier(0.2,0.8,0.2,1)}
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}
            @keyframes fade-in-up{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
            @keyframes progress-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
            #downloader-corner-container{position:fixed;bottom:25px;right:25px;z-index:9998;transition:opacity .3s,transform .3s;display:none}
            #downloader-corner-container.visible{display:block}
            .downloader-btn{display:flex;align-items:center;gap:12px;border:1px solid var(--color-border);border-radius:12px;background:rgba(30,30,30,0.8);backdrop-filter:blur(10px);color:var(--color-text);padding:0 24px;cursor:pointer;height:54px;box-shadow:0 8px 25px -5px rgba(0,0,0,0.2);transition:all .3s var(--transition-curve);font-size:16px;font-weight:500}
            .downloader-btn:hover{transform:translateY(-4px);box-shadow:0 12px 30px -8px rgba(0,0,0,0.3);background:rgba(40,40,40,0.9)}
            .downloader-btn .icon{display:flex;align-items:center;width:20px;height:20px}
            #downloader-modal-container{position:fixed;inset:0;z-index:9999;display:flex;justify-content:center;align-items:center;background:var(--color-overlay);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity var(--transition-speed) var(--transition-curve)}
            #downloader-modal-container.active{opacity:1;pointer-events:auto}
            #downloader-modal-card{display:flex;flex-direction:column;align-items:center;gap:18px;background:var(--color-background);padding:40px 56px;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);width:440px;border:1px solid var(--color-border);animation:fade-in-up .5s var(--transition-curve);cursor:default}
            #downloader-modal-container.is-dismissible #downloader-modal-card{cursor:pointer}
            #downloader-main-status{display:flex;align-items:center;gap:16px;font-size:20px;font-weight:500;color:var(--color-text)}
            #downloader-main-status .icon{display:flex;align-items:center;width:26px;height:26px}
            #downloader-progress-bar-container{width:100%;height:8px;background:rgba(255,255,255,0.08);border-radius:4px;overflow:hidden}
            .progress-bar-fill{width:0%;height:100%;background:var(--color-progress);background-image:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.2) 50%,rgba(255,255,255,0) 100%);background-size:200% 100%;animation:progress-shimmer 2s linear infinite;transition:width .3s ease-out}
            #downloader-detail-status{height:20px;font-size:14px;color:rgba(255,255,255,0.7);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;transition:opacity .3s}
            #downloader-cancel-btn{border:none;background:transparent;color:var(--color-cancel-text);padding:8px 16px;border-radius:8px;cursor:pointer;font-size:14px;transition:all .3s}
            #downloader-cancel-btn:hover{background:rgba(255,255,255,0.1);color:var(--color-text)}
        `);

        const startBtn = document.getElementById('downloader-start-btn');
        const modalIcon = modalContainer.querySelector('#downloader-main-status .icon');
        const modalText = modalContainer.querySelector('#downloader-main-status .text');
        const progressBarFill = modalContainer.querySelector('.progress-bar-fill');
        const detailStatus = modalContainer.querySelector('#downloader-detail-status');
        const cancelBtn = document.getElementById('downloader-cancel-btn');
        let isCancelled = false; let closeTimer = null;

        startBtn.addEventListener('click', startFullDownloadProcess);
        cancelBtn.addEventListener('click', () => { isCancelled = true; });
        modalContainer.addEventListener('click', (e) => {
            if (modalContainer.classList.contains('is-dismissible') && e.target === modalContainer) {
                clearTimeout(closeTimer); updateUI('idle');
            }
        });

        function animateText(element, newText) { if (element.textContent === newText) return; element.style.opacity = '0'; setTimeout(() => { element.textContent = newText; element.style.opacity = '1'; }, 200); }
        function updateUI(state, mainText = '', detailText = '', progress = 0) {
            clearTimeout(closeTimer); modalContainer.classList.remove('is-dismissible');
            if (state === 'idle') { modalContainer.classList.remove('active'); return; }
            modalContainer.classList.add('active');

            let icon = ''; let autoCloseDelay = null; cancelBtn.style.display = 'none';
            switch(state) {
                case 'processing': icon = ICONS.SPINNER; cancelBtn.style.display = 'block'; break;
                case 'zipping': icon = ICONS.SPINNER; break;
                case 'success': icon = ICONS.SUCCESS; progress = 100; mainText='成功'; detailText='ダウンロードが完了しました'; autoCloseDelay = 3000; break;
                case 'error': icon = ICONS.ERROR; progress = 100; mainText='エラー'; detailText=detailText||'不明なエラーが発生しました'; autoCloseDelay = 5000; break;
                case 'cancelled': icon = ICONS.CANCEL; progress = 100; mainText='キャンセル'; detailText='処理が中断されました'; autoCloseDelay = 1500; break;
            }
            modalIcon.innerHTML = icon;
            animateText(modalText, mainText); animateText(detailStatus, detailText);
            progressBarFill.style.width = `${progress}%`;
            if(autoCloseDelay !== null) { modalContainer.classList.add('is-dismissible'); closeTimer = setTimeout(() => updateUI('idle'), autoCloseDelay); }
        }

        async function startFullDownloadProcess() {
            isCancelled = false;
            updateUI('processing', '準備中', 'ファイル一覧をスキャン中...');
            try {
                const fileButtons = Array.from(document.querySelectorAll('button.rounded-lg')).filter(btn => btn.querySelector('h3.text-\\[12px\\]'));
                if (fileButtons.length === 0) throw new Error("対象のプロジェクトファイルが見つかりませんでした。");
                let collectedFiles = [];
                for (let i = 0; i < fileButtons.length; i++) {
                    if(isCancelled) throw new Error('cancelled');
                    const fileName = fileButtons[i].querySelector('h3')?.textContent.trim() || `untitled-${i+1}`;
                    updateUI('processing', 'ファイル収集中', `${i+1}/${fileButtons.length}: ${fileName}`, (i/fileButtons.length)*100);
                    fileButtons[i].click();
                    const contentContainer = await waitForElement('div.whitespace-pre-wrap.break-all.font-mono');
                    collectedFiles.push({ name: fileName, content: contentContainer.textContent });
                    const closeButton = document.querySelector('path[d^="M15.1465"]')?.closest('button');
                    if (closeButton) { closeButton.click(); await waitForElementToDisappear('div.whitespace-pre-wrap.break-all.font-mono'); }
                }
                updateUI('zipping', '圧縮処理中', 'ZIPファイルを生成しています...', 100);
                const filesToZip = {};
                const encoder = new TextEncoder();
                for (const file of collectedFiles) { filesToZip[file.name] = encoder.encode(file.content); }
                const zipData = fflate.zipSync(filesToZip, { level: 6 });
                const blob = new Blob([zipData], { type: "application/zip" });
                saveAs(blob, "claude_project_files.zip");
                updateUI('success');
            } catch (error) {
                console.error('Downloader Error:', error);
                if (isCancelled || error.message === 'cancelled') { updateUI('cancelled'); }
                else { updateUI('error', 'エラー', error.message); }
            }
        }
        isInitialized = true;
    }

    function sentinel() {
        if (!isInitialized) initializeDownloaderUI();
        const cornerContainer = document.getElementById('downloader-corner-container');
        if(!cornerContainer) return;
        const isProjectVisible = document.querySelector('h2[id^="radix-"]') || document.querySelector('button.rounded-lg h3.text-\\[12px\\]');
        cornerContainer.classList.toggle('visible', !!isProjectVisible);
    }
    
    setInterval(sentinel, 1000);
    
    function waitForElement(s,t=10000){return new Promise((r,j)=>{let i,m=()=>{let e=document.querySelector(s);if(e){clearInterval(i);clearTimeout(n);r(e)}};i=setInterval(m,100);let n=setTimeout(()=>{clearInterval(i);j(new Error(`Element "${s}" not found`))},t)})}
    function waitForElementToDisappear(s,t=10000){return new Promise((r,j)=>{let i,m=()=>{if(!document.querySelector(s)){clearInterval(i);clearTimeout(n);r()}};i=setInterval(m,100);let n=setTimeout(()=>{clearInterval(i);j(new Error(`"${s}" did not disappear`))},t)})}
})();