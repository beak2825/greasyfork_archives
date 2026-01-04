// ==UserScript==
// @name         SOOP (숲) - M3U8 링크 복사 버튼 추가
// @namespace    http://tampermonkey.net/
// @version      20250612
// @description  숲 LIVE, VOD M3U8 링크를 복사할 수 있게 해주는 버튼을 추가합니다.
// @author       You
// @match        https://play.sooplive.co.kr/*/*
// @match        https://vod.sooplive.co.kr/player/*
// @exclude      */embed*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537194/SOOP%20%28%EC%88%B2%29%20-%20M3U8%20%EB%A7%81%ED%81%AC%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.user.js
// @updateURL https://update.greasyfork.org/scripts/537194/SOOP%20%28%EC%88%B2%29%20-%20M3U8%20%EB%A7%81%ED%81%AC%20%EB%B3%B5%EC%82%AC%20%EB%B2%84%ED%8A%BC%20%EC%B6%94%EA%B0%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global Variables ---
    const isVodPage = window.location.href.startsWith("https://vod.sooplive.co.kr");
    let currentBroadcastInfo = {};
    let copyButtonLiElement = null;
    let copyButtonElement = null;
    let currentDownloadController = null; // Controller to manage and abort downloads

    // --- SVG Icons ---
    const linkIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    const closeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const copyIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    const checkIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const downloadIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
    const terminalIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`;

    // --- Utility Functions ---
    const getLiveBroadAid = async (id, broadNumber) => {
        const data = { bid: id, bno: broadNumber, mode: 'landing', player_type: 'html5', stream_type: 'common', quality: 'original', type: 'aid' };
        const requestOptions = { method: 'POST', body: new URLSearchParams(data), credentials: 'include' };
        try {
            const response = await fetch('https://live.sooplive.co.kr/afreeca/player_live_api.php', requestOptions);
            const result = await response.json();
            return result.CHANNEL.AID || null;
        } catch (error) { console.error('[getLiveBroadAid] AID Fetch Error:', error); return null; }
    };

    function getLiveBroadcastInfo() {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] && pathParts[2] && !isNaN(parseInt(pathParts[2]))) {
            return { userId: pathParts[1], broadNo: parseInt(pathParts[2]) };
        }
        return null;
    }

    function showToastMessage(message, autoHide = true) {
        let toast = document.querySelector('.m3u8-toast-message-userscript');
        if (toast) toast.remove();
        toast = document.createElement('div');
        toast.className = 'm3u8-toast-message-userscript';
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        if (autoHide) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 500);
            }, 3000);
        }
    }

    function formatTime(totalSeconds, showMs = false) {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        if (showMs) {
            const ms = (totalSeconds - Math.floor(totalSeconds)).toFixed(3).substring(2);
            return `${hours}:${minutes}:${seconds}.${ms}`;
        }
        return `${hours}:${minutes}:${seconds}`;
    }

    function formatShortDate(dateObj) {
        const yy = dateObj.getFullYear().toString().slice(-2);
        const mo = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const dd = dateObj.getDate().toString().padStart(2, '0');
        const hh = dateObj.getHours().toString().padStart(2, '0');
        const mi = dateObj.getMinutes().toString().padStart(2, '0');
        const ss = dateObj.getSeconds().toString().padStart(2, '0');
        return `${yy}.${mo}.${dd}. ${hh}:${mi}:${ss}`;
    }

    function formatKoreanDuration(totalSeconds) {
        const sec = Math.floor(totalSeconds);
        if (sec < 0) return "0초";
        const hours = Math.floor(sec / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const seconds = sec % 60;

        const parts = [];
        if (hours > 0) parts.push(`${hours}시간`);
        if (minutes > 0) parts.push(`${minutes}분`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}초`);

        return parts.join(' ');
    }


    function parseTimeToSeconds(timeStr) {
        const parts = timeStr.split(':');
        return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseFloat(parts[2]);
    }

    // --- Theme & Style ---
    function getCurrentTheme() {
        return document.documentElement.getAttribute('dark') === 'true' || document.body.getAttribute('dark') === 'true' ? 'dark' : 'light';
    }

    function updateButtonAppearance() {
        if (!copyButtonLiElement || !copyButtonElement) return;
        const theme = getCurrentTheme();
        const svgIcon = copyButtonElement.querySelector('svg');
        if (!svgIcon) return;
        if (theme === 'dark') {
            copyButtonLiElement.style.backgroundColor = 'rgba(70, 70, 77, 0.8)';
            svgIcon.style.stroke = '#e0e0e0';
        } else {
            copyButtonLiElement.style.backgroundColor = 'rgba(225, 226, 230, 0.9)';
            svgIcon.style.stroke = '#4a4a52';
        }
    }

    function applyGlobalStyles() {
        const styleId = 'm3u8UserScriptGlobalStyle';
        if (document.getElementById(styleId)) document.getElementById(styleId).remove();
        const isDark = getCurrentTheme() === 'dark';
        GM_addStyle(`
            :root {
                --modal-bg: ${isDark ? '#252529' : '#f7f7f8'}; --modal-text: ${isDark ? '#f0f0f1' : '#1a1a1c'};
                --modal-border: ${isDark ? '#3a3a3f' : '#e1e2e6'}; --modal-item-hover: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
                --modal-footer-bg: ${isDark ? '#1e1e21' : '#f0f0f2'}; --btn-bg: ${isDark ? '#3a3a3f' : '#fff'};
                --btn-border: ${isDark ? '#555' : '#d8d8de'}; --btn-hover-bg: ${isDark ? '#505055' : '#f5f5f5'};
                --btn-active-bg: ${isDark ? '#4785ff' : '#0062f3'}; --btn-active-border: ${isDark ? '#4785ff' : '#0062f3'};
                --success-bg: ${isDark ? '#2E7D32' : '#28a745'}; --toast-bg: ${isDark ? 'rgba(40, 40, 45, 0.95)' : 'rgba(247, 247, 248, 0.95)'};
                --toast-text: ${isDark ? '#f0f0f1' : '#1a1a1c'}; --toast-border: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
                --disabled-bg: ${isDark ? '#404044' : '#e9e9ed'};
                --disabled-text: ${isDark ? '#777' : '#999'};
            }
            #m3u8CopyButtonUserScriptItem { display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; margin-right: 8px; border-radius: 50%; width: 30px; height: 30px; transition: background-color 0.2s ease, transform 0.1s ease; }
            #m3u8CopyButtonUserScriptItem:hover { background-color: ${isDark ? 'rgba(85, 85, 92, 0.9)' : 'rgba(210, 211, 215, 1)'} !important; }
            #m3u8CopyButtonUserScriptItem:active { transform: scale(0.9); }
            #m3u8CopyButtonUserScriptButton { background-color: transparent !important; border: none !important; cursor: pointer !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; width: 100%; height: 100%; border-radius: 50%; }
            .m3u8-toast-message-userscript { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background-color: var(--toast-bg); color: var(--toast-text); padding: 12px 24px; border-radius: 8px; z-index: 9999999; font-size: 14px; opacity: 0; transition: opacity 0.4s ease-in-out, bottom 0.4s ease-in-out; backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 1px solid var(--toast-border); text-align: center; font-weight: 500; }
            .m3u8-toast-message-userscript.show { opacity: 1; bottom: 70px; }
            .vod-modal-overlay, .sub-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
            .vod-modal-overlay.visible, .sub-modal-overlay.visible { opacity: 1; pointer-events: auto; }
            .vod-modal-content { background-color: var(--modal-bg); color: var(--modal-text); border: 1px solid var(--modal-border); width: 90%; max-width: 800px; max-height: 85vh; border-radius: 16px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transform: scale(0.95); transition: transform 0.3s ease; overflow: hidden; }
            .vod-modal-overlay.visible .vod-modal-content { transform: scale(1); }
            .vod-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; flex-shrink: 0; border-bottom: 1px solid var(--modal-border); }
            .vod-modal-header h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
            .vod-edit-notice { margin: 16px 24px 0; padding: 12px 15px; border-radius: 8px; font-size: 0.85rem; line-height: 1.5; text-align: center; background-color: ${isDark ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 165, 0, 0.1)'}; border: 1px solid ${isDark ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 165, 0, 0.3)'}; color: ${isDark ? '#ffc107' : '#d9480f'}; }
            .vod-modal-header .close-btn { cursor: pointer; background: none; border: none; padding: 5px; color: var(--modal-text); display: flex; align-items: center; justify-content: center; border-radius: 50%; opacity: 0.7; transition: opacity 0.2s, background-color 0.2s; }
            .vod-modal-header .close-btn:hover { opacity: 1; background-color: var(--modal-item-hover); }
            .vod-modal-body { overflow-y: auto; padding: 8px 8px 8px 24px; }
            .vod-modal-list { list-style: none; padding: 0; margin: 0; }
            .vod-modal-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 14px 0; border-bottom: 1px solid var(--modal-border); transition: background-color 0.2s ease; }
            .vod-modal-item:last-child { border-bottom: none; }
            .vod-modal-item:hover { background-color: var(--modal-item-hover); }
            .vod-modal-item-info { display: flex; flex-direction: column; flex-grow: 1; overflow: hidden; margin-right: 20px; }
            .vod-modal-item-date { font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; font-family: 'SF Mono', Consolas, 'Courier New', monospace; }
            .vod-modal-item-url { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'SF Mono', Consolas, 'Courier New', monospace; font-size: 0.8rem; opacity: 0.7; }
            .vod-modal-copy-btn, .sub-modal-download-btn { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--btn-border); background-color: var(--btn-bg); color: var(--modal-text); cursor: pointer; font-weight: 600; font-size: 0.85rem; flex-shrink: 0; display: flex; align-items: center; gap: 6px; transition: all 0.2s ease; text-decoration: none; }
            .vod-modal-copy-btn:hover, .sub-modal-download-btn:hover { background-color: var(--btn-hover-bg); border-color: var(--btn-border); }
            .vod-modal-copy-btn:disabled, .sub-modal-download-btn:disabled { background-color: var(--disabled-bg) !important; color: var(--disabled-text) !important; border-color: transparent !important; cursor: not-allowed !important; }
            .vod-modal-copy-btn:disabled svg, .sub-modal-download-btn:disabled svg { stroke: var(--disabled-text) !important; }
            .vod-modal-copy-btn.copied, .sub-modal-download-btn.downloading { background-color: var(--success-bg) !important; border-color: var(--success-bg) !important; color: white !important; }
            .vod-modal-footer { padding: 16px 24px; flex-shrink: 0; border-top: 1px solid var(--modal-border); background-color: var(--modal-footer-bg); }
            .vod-modal-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
            .vod-modal-actions button { width: 100%; justify-content: center; }
            .sub-modal-content { background-color: var(--modal-bg); color: var(--modal-text); border: 1px solid var(--modal-border); width: 90%; max-width: 750px; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; max-height: 90vh; }
            .sub-modal-header { padding: 16px 20px; border-bottom: 1px solid var(--modal-border); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
            .sub-modal-header h3 { margin: 0; font-size: 1.1em; }
            .sub-modal-body { padding: 16px 20px; overflow-y: auto; }
            .ffmpeg-os-tabs { display: flex; gap: 10px; margin-bottom: 15px; }
            .ffmpeg-os-tabs button { flex-grow: 1; }
            .ffmpeg-os-tabs button.active { background-color: var(--btn-active-bg); border-color: var(--btn-active-border); color: white; }
            .ffmpeg-command-area { display: none; }
            .ffmpeg-command-area.active { display: block; }
            .ffmpeg-textarea { width: 100%; min-height: 220px; height: auto; padding: 15px; border-radius: 6px; font-family: 'SF Mono', Consolas, 'Courier New', monospace; font-size: 0.9em; line-height: 1.5; background-color: var(--modal-footer-bg); color: var(--modal-text); border: 1px solid var(--modal-border); resize: none; white-space: pre-wrap; word-break: break-all; }
            .clipping-controls { border: 1px solid var(--modal-border); border-radius: 8px; padding: 15px; margin-top: 15px; display: none; }
            .clipping-controls.active { display: block; }
            .clipping-controls label { font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; cursor: pointer; user-select: none;}
            .clipping-controls input[type="checkbox"] { margin-right: 10px; transform: scale(1.2); }
            .clipping-options { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
            .clipping-options input[type="text"] { flex-grow: 1; padding: 8px; border-radius: 4px; border: 1px solid var(--btn-border); background-color: var(--btn-bg); color: var(--modal-text); font-family: 'SF Mono', Consolas; }
            .clipping-options button { padding: 8px; }
        `);
    }

    // --- Download Controller ---
    class DownloadController {
        constructor() {
            this.isCancelled = false;
        }
        cancel() {
            this.isCancelled = true;
        }
    }


    // --- Modal Logic ---
    function openVodListModal(vodFiles) {
        if (document.getElementById('vodListModalOverlay')) return;

        const { writer_nick, broad_start, full_title, total_file_duration, write_tm } = currentBroadcastInfo.vodInfo;
        const vodStartDate = new Date(broad_start.replace(/-/g, '/'));
        const safeTitle = (full_title || "soop_vod").replace(/[<>:"/\\|?*!]/g, '_');
        const safeNick = (writer_nick || "BJ").replace(/[<>:"/\\|?*!]/g, '_');
        const formattedDate = `${vodStartDate.getFullYear()}${(vodStartDate.getMonth()+1).toString().padStart(2,'0')}${vodStartDate.getDate().toString().padStart(2,'0')}`;
        let vodFilename = `${formattedDate}_${safeNick}_${safeTitle}`;

        let editNoticeHtml = '';
        if (write_tm && total_file_duration) {
            try {
                const [startStr, endStr] = write_tm.split(' ~ ');
                const startTime = new Date(startStr.replace(/-/g, '/'));
                const endTime = new Date(endStr.replace(/-/g, '/'));
                const expectedDuration = (endTime - startTime) / 1000;
                const actualDuration = total_file_duration / 1000;

                if (actualDuration < expectedDuration - 60) {
                    editNoticeHtml = `<div class="vod-edit-notice"><strong>[주의]</strong> 이 VOD는 원본 방송에서 일부 편집되었거나 '같이보기' 영상일 수 있습니다.</div>`;
                }
            } catch(e) {
                console.error("Error parsing VOD edit time:", e);
            }
        }

        let mainListHtml = '';
        let totalDurationSec = 0;
        vodFiles.forEach((file, index) => {
            const durationSec = file.duration / 1000;
            totalDurationSec += durationSec;
            const startTime = new Date(file.file_start.replace(/-/g, '/'));
            const endTime = new Date(startTime.getTime() + file.duration);
            mainListHtml += `
                <li class="vod-modal-item">
                    <div class="vod-modal-item-info">
                        <div class="vod-modal-item-date">[${String(index + 1).padStart(2, '0')}] ${formatShortDate(startTime)} ~ ${formatShortDate(endTime)} (${formatKoreanDuration(durationSec)})</div>
                        <span class="vod-modal-item-url">${file.file}</span>
                    </div>
                    <button class="vod-modal-copy-btn" data-url="${file.file}">${copyIconSvg}<span>링크 복사</span></button>
                </li>`;
        });

        const isFSApiSupported = !!window.showSaveFilePicker;

        const mainModalHtml = `
            <div class="vod-modal-overlay" id="vodListModalOverlay">
                <div class="vod-modal-content" id="vodListModalContent">
                    <div class="vod-modal-header">
                        <h2>분할된 VOD 목록 (${vodFiles.length}개) - 총 길이: ${formatKoreanDuration(totalDurationSec)}</h2>
                        <button class="close-btn" id="vodModalCloseBtn" title="닫기">${closeIconSvg}</button>
                    </div>
                    ${editNoticeHtml}
                    <div class="vod-modal-body"><ul class="vod-modal-list">${mainListHtml}</ul></div>
                    <div class="vod-modal-footer">
                         <div class="vod-modal-actions">
                            <button class="vod-modal-copy-btn" id="vodModalAllCopyBtn">${copyIconSvg} <span>모든 링크 복사</span></button>
                            <button class="vod-modal-copy-btn" id="vodModalFfmpegBtn" disabled title="개발 중인 기능입니다.">${terminalIconSvg} <span>(개발중) FFmpeg 명령어 생성</span></button>
                            <button class="vod-modal-copy-btn" id="vodModalBrowserDownloadBtn" disabled title="개발 중인 기능입니다.">
                                ${downloadIconSvg} <span>(개발중) 브라우저에서 다운로드</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;


        function generateFfmpegModal() {
            const randomFolderName = Math.random().toString(36).substring(2, 11);

            const ffmpegInputOptions = `-f concat -safe 0 -allowed_extensions ALL -protocol_whitelist file,http,https,tcp,tls,crypto`;
            let ffmpegWinCmd = `set "DOWNLOAD_DIR=${randomFolderName}" & mkdir "%DOWNLOAD_DIR%" & (for %i in (${vodFiles.map(f => `'${f.file}'`).join(' ')}) do @echo file %i) > "%DOWNLOAD_DIR%\\filelist.txt" & ffmpeg ${ffmpegInputOptions} -i "%DOWNLOAD_DIR%\\filelist.txt" -c copy "%DOWNLOAD_DIR%\\${vodFilename}.mp4" & rmdir /s /q "%DOWNLOAD_DIR%\\filelist.txt" & echo. & echo *** 다운로드 완료! 저장 폴더: %DOWNLOAD_DIR% ***`;
            let ffmpegMacCmd = `DOWNLOAD_DIR="${randomFolderName}"; mkdir -p "$DOWNLOAD_DIR"; printf "file '%s'\\n" ${vodFiles.map(f => `'${f.file.replace(/'/g, "'\\''")}'`).join(' ')} > "$DOWNLOAD_DIR/filelist.txt" && ffmpeg ${ffmpegInputOptions} -i "$DOWNLOAD_DIR/filelist.txt" -c copy "$DOWNLOAD_DIR/'${vodFilename}.mp4'" && rm "$DOWNLOAD_DIR/filelist.txt" && echo "✅ 다운로드 완료! 저장 폴더: $DOWNLOAD_DIR"`;

            const clippingEnabled = document.getElementById('clipping-checkbox')?.checked;
            if (clippingEnabled) {
                try {
                    const startSec = parseTimeToSeconds(document.getElementById('clip-start-time').value);
                    const endSec = parseTimeToSeconds(document.getElementById('clip-end-time').value);

                    if (startSec >= endSec) {
                        showToastMessage("오류: 시작 시간은 종료 시간보다 빨라야 합니다.", false);
                        return null;
                    }

                    const clipCommands = [];
                    const concatList = [];
                    let accumulatedDuration = 0;

                    vodFiles.forEach((item, index) => {
                        const itemDuration = item.duration / 1000;
                        const itemStart = accumulatedDuration;
                        const itemEnd = accumulatedDuration + itemDuration;

                        if (itemEnd > startSec && itemStart < endSec) {
                            const clipStart = Math.max(0, startSec - itemStart);
                            const clipDuration = (Math.min(itemEnd, endSec) - itemStart) - clipStart;
                            const outputFilename = `part_${index + 1}.ts`;

                            let command = `ffmpeg -ss ${formatTime(clipStart, true)} -i "${item.file}" -t ${clipDuration.toFixed(3)} -c copy`;
                            clipCommands.push({ command, outputFilename });
                            concatList.push(`file '${outputFilename}'`);
                        }
                        accumulatedDuration += itemDuration;
                    });

                    if (clipCommands.length > 0) {
                        const finalFilename = `${vodFilename}_${formatTime(startSec).replace(/:/g,'')}-${formatTime(endSec).replace(/:/g,'')}`;
                        const winClipCmds = clipCommands.map(c => `${c.command} "%TEMP_DIR%\\${c.outputFilename}"`).join(' & ');
                        const winConcatList = concatList.map(c => `echo ${c.replace(/'/g, '')}`).join(' & ');
                        ffmpegWinCmd = `@echo off\nchcp 65001 >nul\nset "TEMP_DIR=${randomFolderName}__temp"\nmkdir "%TEMP_DIR%"\n${winClipCmds}\n(${winConcatList}) > "%TEMP_DIR%\\list.txt"\nffmpeg -f concat -safe 0 -i "%TEMP_DIR%\\list.txt" -c copy "${finalFilename}.mp4"\nrmdir /s /q "%TEMP_DIR%"\necho.\necho *** 클립 다운로드 완료: ${finalFilename}.mp4 ***\npause`;
                        const macClipCmds = clipCommands.map(c => `${c.command} "$TEMP_DIR/${c.outputFilename}"`).join(' && ');
                        const macConcatList = concatList.map(c => `printf "${c}\\n"`).join('; ');
                        ffmpegMacCmd = `TEMP_DIR="${randomFolderName}__temp"; mkdir -p "$TEMP_DIR" && ${macClipCmds} && (${macConcatList}) > "$TEMP_DIR/list.txt" && ffmpeg -f concat -safe 0 -i "$TEMP_DIR/list.txt" -c copy '${finalFilename}.mp4' && rm -rf "$TEMP_DIR" && echo "✅ 클립 다운로드 완료: ${finalFilename}.mp4"`;
                    }
                } catch (e) {
                    showToastMessage("오류: 시간 형식이 잘못되었습니다 (HH:MM:SS).", false);
                    console.error("Time parse error:", e);
                    return null;
                }
            }

            let existingModal = document.getElementById('ffmpegModalOverlay');
            if(existingModal) existingModal.remove();

            const ffmpegModalHtml = `
            <div class="sub-modal-overlay" id="ffmpegModalOverlay">
                <div class="sub-modal-content">
                    <div class="sub-modal-header"><h3>FFmpeg 명령어 생성</h3><button class="close-btn" data-target="ffmpegModalOverlay">${closeIconSvg}</button></div>
                    <div class="sub-modal-body">
                        <div class="clipping-controls active">
                            <label><input type="checkbox" id="clipping-checkbox" ${clippingEnabled ? 'checked' : ''}>✂️ VOD 일부만 잘라서 받기</label>
                            <div class="clipping-options" style="display: ${clippingEnabled ? 'flex' : 'none'}">
                                <input type="text" id="clip-start-time" value="${formatTime(0)}" placeholder="HH:MM:SS">
                                <span>~</span>
                                <input type="text" id="clip-end-time" value="${formatTime(totalDurationSec)}" placeholder="HH:MM:SS">
                                <button id="set-full-time-btn" class="vod-modal-copy-btn">전체 시간</button>
                            </div>
                        </div>
                        <div class="ffmpeg-os-tabs"><button class="vod-modal-copy-btn active" data-os="win">Windows</button><button class="vod-modal-copy-btn" data-os="mac">macOS / Linux</button></div>
                        <div id="win-cmd" class="ffmpeg-command-area active"><textarea class="ffmpeg-textarea" readonly>${ffmpegWinCmd}</textarea></div>
                        <div id="mac-cmd" class="ffmpeg-command-area"><textarea class="ffmpeg-textarea" readonly>${ffmpegMacCmd}</textarea></div>
                        <button class="vod-modal-copy-btn" id="ffmpegCopyCmdBtn" style="width:100%; margin-top: 15px; justify-content: center;">${copyIconSvg}<span>Windows 명령어 복사</span></button>
                    </div>
                </div>
            </div>`;

            document.body.insertAdjacentHTML('beforeend', ffmpegModalHtml);

            if(clippingEnabled){
                const startTimeInput = document.getElementById('clip-start-time');
                const endTimeInput = document.getElementById('clip-end-time');
                if (startTimeInput) startTimeInput.value = startTimeInput.value || formatTime(0);
                if (endTimeInput) endTimeInput.value = endTimeInput.value || formatTime(totalDurationSec);
            }

            return document.getElementById('ffmpegModalOverlay');
        }

        const downloadNotice = isFSApiSupported
            ? `최신 브라우저가 감지되었습니다. <strong>File System Access API</strong>를 사용하여<br>메모리를 거의 사용하지 않는 실시간 스트리밍 다운로드를 시작합니다.`
            : `이 기능은 현재 사용 중인 브라우저에서 지원되지 않습니다.<br><strong>Chrome, Edge, Opera</strong> 등 최신 브라우저를 사용해 주세요.`;

        const downloadListHtml = vodFiles.map((file, index) => `
            <li class="vod-modal-item">
                <div class="vod-modal-item-info"><strong>Part ${String(index + 1).padStart(2, '0')}</strong><span class="vod-modal-item-url">${file.file}</span></div>
                <button class="sub-modal-download-btn" data-url="${file.file}" data-filename="${vodFilename}_part${String(index + 1).padStart(2, '0')}.ts" ${!isFSApiSupported ? 'disabled' : ''}>
                    ${downloadIconSvg}<span>${isFSApiSupported ? '다운로드' : '지원 안함'}</span>
                </button>
            </li>`).join('');

        const downloadModalHtml = `
            <div class="sub-modal-overlay" id="browserDownloadModalOverlay">
                 <div class="sub-modal-content">
                    <div class="sub-modal-header"><h3>브라우저에서 직접 다운로드</h3><button class="close-btn" data-target="browserDownloadModalOverlay">${closeIconSvg}</button></div>
                    <div class="sub-modal-body">
                       <p style="font-size: 0.9em; margin: 0 0 15px; opacity: 0.9; line-height:1.6; padding: 10px; background-color: var(--modal-footer-bg); border-radius: 6px;">${downloadNotice}</p>
                       <ul class="vod-modal-list">${downloadListHtml}</ul>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', mainModalHtml + downloadModalHtml);
        setTimeout(() => document.getElementById('vodListModalOverlay').classList.add('visible'), 10);

        const handleCopy = (button, text, msg) => {
            GM_setClipboard(text, 'text');
            showToastMessage(msg);
            const original = button.innerHTML;
            button.innerHTML = `${checkIconSvg} <span>복사 완료!</span>`;
            button.classList.add('copied');
            button.disabled = true;
            setTimeout(() => { button.innerHTML = original; button.classList.remove('copied'); button.disabled = false; }, 2000);
        };

        const openSubModal = (id) => document.getElementById(id)?.classList.add('visible');
        const closeSubModal = (id) => {
             if (currentDownloadController) {
                currentDownloadController.cancel();
            }
            document.getElementById(id)?.classList.remove('visible');
        }

        function setupFfmpegModalEvents() {
            const ffmpegModal = document.getElementById('ffmpegModalOverlay');
            if(!ffmpegModal) return;

            ffmpegModal.querySelector('.close-btn').addEventListener('click', () => closeSubModal('ffmpegModalOverlay'));

            const ffmpegCopyBtn = ffmpegModal.querySelector('#ffmpegCopyCmdBtn');
            const osTabs = ffmpegModal.querySelectorAll('.ffmpeg-os-tabs button');
            osTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    osTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    ffmpegModal.querySelectorAll('.ffmpeg-command-area').forEach(area => area.classList.remove('active'));
                    const os = tab.dataset.os;
                    ffmpegModal.querySelector(`#${os}-cmd`).classList.add('active');
                    ffmpegCopyBtn.querySelector('span').textContent = `${os === 'win' ? 'Windows' : 'macOS'} 명령어 복사`;
                });
            });
            ffmpegCopyBtn.addEventListener('click', (e) => {
                const activeOS = ffmpegModal.querySelector('.ffmpeg-os-tabs button.active').dataset.os;
                const command = ffmpegModal.querySelector(`#${activeOS}-cmd .ffmpeg-textarea`).value;
                handleCopy(e.currentTarget, command, `${activeOS === 'win' ? 'Windows' : 'macOS'} 명령어가 복사되었습니다.`);
            });

            const clippingCheckbox = document.getElementById('clipping-checkbox');
            const clippingOptions = document.querySelector('.clipping-options');
            const setFullTimeBtn = document.getElementById('set-full-time-btn');

            clippingCheckbox.addEventListener('change', (e) => {
                clippingOptions.style.display = e.target.checked ? 'flex' : 'none';
                generateFfmpegModal();
                setupFfmpegModalEvents();
            });

            document.getElementById('clip-start-time').addEventListener('change', () => { generateFfmpegModal(); setupFfmpegModalEvents(); });
            document.getElementById('clip-end-time').addEventListener('change', () => { generateFfmpegModal(); setupFfmpegModalEvents(); });

            setFullTimeBtn.addEventListener('click', () => {
                document.getElementById('clip-start-time').value = formatTime(0);
                document.getElementById('clip-end-time').value = formatTime(totalDurationSec);
                generateFfmpegModal();
                setupFfmpegModalEvents();
            });
        }

        document.getElementById('vodModalCloseBtn').addEventListener('click', () => {
            if (currentDownloadController) {
                currentDownloadController.cancel();
            }
            const overlay = document.getElementById('vodListModalOverlay');
            overlay.classList.remove('visible');
            setTimeout(() => {
                const ffmpegModal = document.getElementById('ffmpegModalOverlay');
                const downloadModal = document.getElementById('browserDownloadModalOverlay');
                if (overlay) overlay.remove();
                if (ffmpegModal) ffmpegModal.remove();
                if (downloadModal) downloadModal.remove();
            }, 300);
        });
        document.getElementById('vodModalAllCopyBtn').addEventListener('click', (e) => handleCopy(e.currentTarget, vodFiles.map(f => f.file).join('\n'), "모든 VOD 링크가 복사되었습니다."));
        document.querySelectorAll('.vod-modal-item .vod-modal-copy-btn').forEach(btn => btn.addEventListener('click', (e) => handleCopy(e.currentTarget, e.currentTarget.getAttribute('data-url'), "선택한 VOD 링크가 복사되었습니다.")));

        // These buttons are now disabled, so these event listeners won't be triggered by a user click.
        // They are left here in case the buttons are re-enabled in a future version.
        document.getElementById('vodModalFfmpegBtn').addEventListener('click', () => {
            let ffmpegModal = generateFfmpegModal();
            if (ffmpegModal) {
                openSubModal('ffmpegModalOverlay');
                setupFfmpegModalEvents();
            }
        });

        document.getElementById('vodModalBrowserDownloadBtn').addEventListener('click', () => openSubModal('browserDownloadModalOverlay'));

        document.querySelectorAll('.sub-modal-header .close-btn[data-target="browserDownloadModalOverlay"]').forEach(btn => btn.addEventListener('click', (e) => closeSubModal(e.currentTarget.dataset.target)));

        document.querySelectorAll('.sub-modal-download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                if (currentDownloadController) {
                    showToastMessage("다른 다운로드가 이미 진행 중입니다.", false);
                    return;
                }
                const m3u8Url = button.dataset.url;
                const filename = button.dataset.filename;

                button.disabled = true;
                button.innerHTML = `<span>준비 중...</span>`;

                downloadWithFileSystemAPI(m3u8Url, filename, button);
            });
        });
    }

    // --- Real-time Streaming via File System Access API ---
    async function downloadWithFileSystemAPI(m3u8PlaylistUrl, filename, button) {
        currentDownloadController = new DownloadController();
        let writableStream = null;

        try {
            if (!m3u8PlaylistUrl.includes('/playlist.m3u8')) {
                 showToastMessage('오래된 VOD 형식은 스트리밍 다운로드를 지원하지 않습니다.<br>FFmpeg를 사용하거나 링크를 직접 복사하세요.', false);
                 resetButton(button, false);
                 return;
            }

            const baseUrl = m3u8PlaylistUrl.replace('/playlist.m3u8', '');
            const [videoManifest, audioManifest] = await Promise.all([
                fetchManifest(`${baseUrl}/video.m3u8?cv=v1`),
                fetchManifest(`${baseUrl}/audio.m3u8?cv=v1`)
            ]);
            const allSegments = [...parseManifest(videoManifest), ...parseManifest(audioManifest)];
            const totalSegments = allSegments.length;

            const fileHandle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{ description: 'MPEG-TS Video', accept: { 'video/mp2t': ['.ts'] } }],
            });
            writableStream = await fileHandle.createWritable();

            showToastMessage(`총 ${totalSegments}개 조각 실시간 다운로드 시작...`, false);

            for (let i = 0; i < totalSegments; i++) {
                if (currentDownloadController.isCancelled) {
                    showToastMessage('다운로드가 중단되었습니다.');
                    break;
                }
                button.innerHTML = `<span>${i + 1} / ${totalSegments}</span>`;
                const segmentBlob = await downloadSegment(`${baseUrl}/${allSegments[i]}`);
                await writableStream.write(segmentBlob);
            }

            if (!currentDownloadController.isCancelled) {
                showToastMessage('다운로드 완료!', true);
                button.innerHTML = `${checkIconSvg} <span>저장 완료</span>`;
                resetButton(button, true);
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                showToastMessage('파일 저장이 취소되었습니다.');
            } else if (!currentDownloadController.isCancelled) {
                console.error('File System API Download failed:', error);
                showToastMessage(`오류 발생: ${error.message}`, false);
            }
        } finally {
            if (writableStream) {
                await writableStream.close();
            }
            currentDownloadController = null;
            if (!button.innerHTML.includes("완료")) {
                resetButton(button, false);
            }
        }
    }

    function resetButton(button, isSuccess) {
         if (isSuccess) {
             setTimeout(() => {
                button.disabled = false;
                button.innerHTML = `${downloadIconSvg}<span>다운로드</span>`;
            }, 3000);
         } else {
            button.disabled = false;
            button.innerHTML = `${downloadIconSvg}<span>다운로드</span>`;
         }
    }

    function fetchManifest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url,
                onload: (response) => {
                    if (response.status === 200) resolve(response.responseText);
                    else reject(new Error(`매니페스트 로드 실패 (${response.status})`));
                },
                onerror: () => reject(new Error('네트워크 오류'))
            });
        });
    }

    function parseManifest(manifestText) {
        return manifestText.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    }

    function downloadSegment(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url, responseType: 'blob',
                onload: (response) => {
                    if (response.status === 200) resolve(response.response);
                    else reject(new Error(`조각 다운로드 실패 (${response.status})`));
                },
                onerror: () => reject(new Error('네트워크 오류'))
            });
        });
    }

    // --- Core Logic ---
    async function handleCopyButtonClick() {
        if (!currentBroadcastInfo) { showToastMessage("방송 정보를 아직 가져오지 못했습니다."); return; }
        if (isVodPage) {
            if (Array.isArray(currentBroadcastInfo.vodFiles) && currentBroadcastInfo.vodFiles.length > 0) {
                openVodListModal(currentBroadcastInfo.vodFiles);
            } else { showToastMessage("VOD 정보를 찾지 못했습니다.<br>잠시 후 다시 시도해주세요."); }
        } else {
            showToastMessage("m3u8 링크 추출 중...", false);
            const aid = await getLiveBroadAid(currentBroadcastInfo.userId, currentBroadcastInfo.broadNo);
            if (aid) {
                const m3u8Link = `https://live-global-cdn-v02.sooplive.co.kr/live-stm-12/auth_playlist.m3u8?aid=${aid}`;
                GM_setClipboard(m3u8Link, 'text');
                showToastMessage("LIVE m3u8 링크가 클립보드에 복사되었습니다.");
            } else { showToastMessage("LIVE m3u8 링크 추출에 실패했습니다. (AID 오류)"); }
        }
    }

    function ensureCopyLinkButton() {
        let itemListContainer = document.querySelector('.broadcast_information .player_item_list ul');
        if (!itemListContainer) itemListContainer = document.querySelector('.broadcast_information .column[number="1"] .player_item_list ul');
        if (!itemListContainer) return;
        if (!document.getElementById('m3u8CopyButtonUserScriptItem')) {
            copyButtonLiElement = document.createElement('li');
            copyButtonLiElement.id = 'm3u8CopyButtonUserScriptItem';
            copyButtonElement = document.createElement('button');
            copyButtonElement.id = 'm3u8CopyButtonUserScriptButton';
            copyButtonElement.innerHTML = linkIconSvg;
            copyButtonElement.title = '스트림/VOD 링크 복사 및 도구';
            copyButtonElement.addEventListener('click', handleCopyButtonClick);
            copyButtonLiElement.appendChild(copyButtonElement);
            itemListContainer.insertBefore(copyButtonLiElement, itemListContainer.firstChild);
        }
        updateButtonAppearance();
    }

    function setupMainObserver() {
        const broadcastInfoArea = document.querySelector('.broadcast_information');
        if (!broadcastInfoArea) { setTimeout(setupMainObserver, 500); return; }
        const mainObserver = new MutationObserver(() => ensureCopyLinkButton());
        mainObserver.observe(broadcastInfoArea, { childList: true, subtree: true });
        ensureCopyLinkButton();
        console.log("SOOP Script: Main Observer is running.");
    }

    function fetchVodInfoDirectly() {
        const vodId = window.location.pathname.split('/')[2];
        if (!vodId || isNaN(parseInt(vodId))) return;
        GM_xmlhttpRequest({
            method: "POST", url: "https://api.m.sooplive.co.kr/station/video/a/view",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `nTitleNo=${vodId}&nPlaylistIdx=0`,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data?.result === 1 && Array.isArray(data.data.files)) {
                        const modifiedFiles = data.data.files.map(file => {
                            if (file.file && file.file.includes('.smil/playlist.m3u8')) {
                                file.file = file.file.replace('.smil/playlist.m3u8', '.mp4/playlist.m3u8');
                            }
                            return file;
                        });

                        currentBroadcastInfo.vodFiles = modifiedFiles;
                        currentBroadcastInfo.vodInfo = data.data;
                        console.log(`[VOD] Fetched and modified ${modifiedFiles.length} VOD file(s) for original quality.`);
                        setupMainObserver();
                    } else { showToastMessage("VOD 정보 분석 실패."); }
                } catch (e) { console.error("VOD Info Parse Error:", e); showToastMessage("VOD 정보 분석 오류."); }
            },
            onerror: () => { showToastMessage("VOD 정보 요청 실패 (네트워크 오류)."); }
        });
    }

    function initializeScript() {
        console.log(`SOOP Link Copy Script v4.4 Initializing (Page: ${isVodPage ? 'VOD' : 'LIVE'})`);
        applyGlobalStyles();
        const themeObserver = new MutationObserver(() => { applyGlobalStyles(); updateButtonAppearance(); });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dark'] });
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ['dark'] });
        if (isVodPage) fetchVodInfoDirectly();
        else {
            currentBroadcastInfo = getLiveBroadcastInfo();
            if (currentBroadcastInfo) setupMainObserver();
        }
    }

    // --- Script Execution ---
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeScript();
    } else {
        window.addEventListener('DOMContentLoaded', initializeScript, false);
    }
})();