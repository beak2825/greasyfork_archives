// ==UserScript==
// @name         YouTube(유튜브) 타임스탬프
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  YouTube(유튜브) 라이브 및 다시보기 영상에서 단축키 'Y'를 눌러 메모를 작성하고 저장할 수 있습니다.
// @author       백호
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/live_chat*
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546553/YouTube%28%EC%9C%A0%ED%8A%9C%EB%B8%8C%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84.user.js
// @updateURL https://update.greasyfork.org/scripts/546553/YouTube%28%EC%9C%A0%ED%8A%9C%EB%B8%8C%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    if (window.top !== window.self) return;
    if (window.hasRunYouTubeMemo) return;
    window.hasRunYouTubeMemo = true;
 
    let offset = Number(localStorage.getItem('yt_memo_offset') || '0');
    let logs = JSON.parse(localStorage.getItem('yt_memo_logs') || '[]');
    let toastTimer = null;
    let popup = null;
 
    function showToast(msg) {
        let toast = document.getElementById('soop-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'soop-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.75);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 9999999;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                user-select: none;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
        }, 1500);
    }
 
    function formatTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
 
    function saveLog(timeStr, memo) {
        logs.push({ time: timeStr, memo });
        localStorage.setItem('yt_memo_logs', JSON.stringify(logs));
        console.log(`[저장됨] ${timeStr}, ${memo}`);
    }
 
    function promptOffset() {
        const newOffset = prompt("몇 초 전의 시간을 저장할까요?\n\n[예시]\n60 입력 시, 1:00:00 → 00:59:00의 시간이 저장 (현재: " + offset + "초)");
        if (newOffset !== null && !isNaN(newOffset)) {
            offset = parseInt(newOffset, 10);
            localStorage.setItem('yt_memo_offset', offset);
            showToast(`오프셋이 ${offset}초로 설정되었습니다.`);
        } else {
            showToast('숫자만 입력해주세요!');
        }
    }
 
    function downloadLogs() {
        if (logs.length === 0) {
            showToast('저장된 내용이 없습니다.');
            return;
        }
        const content = logs.map(l => `${l.time}, ${l.memo}`).join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
 
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `타임라인 ${dateStr}.txt`;
 
        a.click();
        URL.revokeObjectURL(url);
        showToast('파일 다운로드 완료!');
    }
 
    function clearLogs() {
        if (confirm('저장된 모든 타임스탬프 기록을 삭제하시겠습니까?')) {
            logs = [];
            localStorage.removeItem('yt_memo_logs');
            showToast('기록이 초기화되었습니다.');
        }
    }
 
    GM_registerMenuCommand('⏱️ 시간 오프셋 설정', promptOffset);
    GM_registerMenuCommand('📁 타임스탬프 파일로 저장', downloadLogs);
    GM_registerMenuCommand('🗑️ 타임스탬프 초기화', clearLogs);
 
    function createPopup() {
        if (popup) return;
 
        popup = document.createElement('div');
        popup.id = 'soop-memo-popup';
        popup.style.cssText = `
            position: fixed;
            bottom: 1%;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 6px 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            font-size: 17px;
            z-index: 9999;
            font-family: 'Noto Sans KR', 'Arial', sans-serif;
            user-select: none;
            color: black;
            display: flex;
            flex-direction: column;
        `;
 
        const video = document.querySelector('video');
        let currentTime = 0;
        if (video) {
            currentTime = Math.floor(video.currentTime) - offset;
            if (currentTime < 0) currentTime = 0;
        }
        const formattedTime = formatTime(currentTime);
 
        const title = document.createElement('div');
        title.textContent = `타임스탬프 (${formattedTime})`;
        title.style.cssText = `
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
            user-select: text;
            color: black;
        `;
        popup.appendChild(title);
 
        const textarea = document.createElement('textarea');
        textarea.id = 'soop-memo-input';
        textarea.placeholder = '메모를 입력하세요';
        textarea.style.cssText = `
            width: 100%;
            height: 50px;
            border: none;
            border-radius: 6px;
            resize: none;
            padding: 4px;
            font-size: 13px;
            background: white;
            color: black;
            outline: none;
            box-sizing: border-box;
            font-family: 'Noto Sans KR', 'Arial', sans-serif;
        `;
        textarea.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveAction();
            }
        });
        popup.appendChild(textarea);
 
        const btnWrapper = document.createElement('div');
        btnWrapper.style.cssText = `
            margin-top: 4px;
            text-align: right;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        `;
 
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '저장';
        saveBtn.style.cssText = `
            background-color: #3ea6ff;
            border: none;
            border-radius: 6px;
            color: white;
            padding: 6px 12px;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            min-width: 60px;
        `;
 
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '취소';
        cancelBtn.style.cssText = `
            background: none;
            border: none;
            color: #555;
            padding: 6px 12px;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
            min-width: 60px;
        `;
 
        function saveAction() {
            const memo = textarea.value.trim();
            const video = document.querySelector('video');
            if (!video) {
                showToast('비디오를 찾을 수 없습니다.');
                closePopup();
                return;
            }
            let currentTime = Math.floor(video.currentTime) - offset;
            if (currentTime < 0) currentTime = 0;
            const formattedTime = formatTime(currentTime);
 
            saveLog(formattedTime, memo);
            GM_setClipboard(`${formattedTime}, ${memo}`);
            showToast('저장 완료');
            closePopup();
        }
 
        saveBtn.addEventListener('click', saveAction);
        cancelBtn.addEventListener('click', () => closePopup());
 
        btnWrapper.appendChild(cancelBtn);
        btnWrapper.appendChild(saveBtn);
        popup.appendChild(btnWrapper);
 
        document.body.appendChild(popup);
 
        setTimeout(() => {
            document.addEventListener('mousedown', outsideClickListener);
        }, 10);
    }
 
    function closePopup() {
        if (!popup) return;
        document.body.removeChild(popup);
        popup = null;
        document.removeEventListener('mousedown', outsideClickListener);
    }
 
    function outsideClickListener(event) {
        if (!popup) return;
        if (!popup.contains(event.target)) {
            closePopup();
        }
    }
 
    function hasVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('v');
    }
 
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
        }
    }).observe(document, { subtree: true, childList: true });
 
    window.addEventListener('keydown', e => {
        if ((e.key === 'y' || e.key === 'Y') && !e.repeat) {
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;
            if (!hasVideoId()) return;
 
            const video = document.querySelector('video');
            if (!video) return;
 
            e.preventDefault();
 
            if (popup) {
                closePopup();
            } else {
                createPopup();
                const textarea = document.getElementById('soop-memo-input');
                if (textarea) textarea.focus();
            }
        }
    });
})();