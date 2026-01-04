// ==UserScript==
// @name         YouTube(유튜브) 타임스탬프 - 구글시트 연동
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  YouTube(유튜브) 라이브 및 다시보기 영상에서 단축키 'Y'를 눌러 메모 작성 후 구글시트에 저장합니다.
// @author       백호
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/live_chat*
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546482/YouTube%28%EC%9C%A0%ED%8A%9C%EB%B8%8C%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84%20-%20%EA%B5%AC%EA%B8%80%EC%8B%9C%ED%8A%B8%20%EC%97%B0%EB%8F%99.user.js
// @updateURL https://update.greasyfork.org/scripts/546482/YouTube%28%EC%9C%A0%ED%8A%9C%EB%B8%8C%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84%20-%20%EA%B5%AC%EA%B8%80%EC%8B%9C%ED%8A%B8%20%EC%97%B0%EB%8F%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) return;
    if (window.hasRunYouTubeMemo) return;
    window.hasRunYouTubeMemo = true;

    const hotkey = 'Y';
    let offset = 0;
    const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxCKPXG0lN831y0rjZZJWuNgf5d5h8Er1aeRYZZa2jL77oEaCy-BvKli__uoTr7eehjcg/exec';

    GM_registerMenuCommand('⏱️ 시간 오프셋 설정', () => {
        const input = prompt(`몇 초 전의 시간을 저장할까요?\n\n[예시]\n60 입력 시, 1:00:00 → 00:59:00의 시간이 저장 (현재: ${offset}초)`);
        if (input !== null) {
            const n = parseInt(input, 10);
            if (!isNaN(n)) {
                offset = n;
                showToastMessage(`오프셋이 ${offset}초로 설정되었습니다.`);
            } else {
                showToastMessage('유효한 숫자를 입력해주세요!', true);
            }
        }
    });

    let toastTimer = null;
    function showToastMessage(msg, isError = false) {
        let toast = document.getElementById('yt-memo-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'yt-memo-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 40px;
                left: 50%;
                transform: translateX(-50%);
                background: ${isError ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.75)'};
                color: white;
                padding: 8px 14px;
                border-radius: 6px;
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
        }, 1800);
    }

    function timeStrToSeconds(timeStr) {
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            return parts[0];
        }
        return 0;
    }

    function formatSecondsToTime(seconds) {
        if (seconds < 0) seconds = 0;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    function getOffsetTimeStr(currentSeconds) {
        return formatSecondsToTime(currentSeconds - offset);
    }

    function sendToGoogleSheet(timeStr, memo) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: GOOGLE_SHEET_WEBAPP_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ time: timeStr, memo }),
            onload: function(res) {
                if (res.status === 200 && res.responseText.trim() === 'success') {
                    showToastMessage('구글 시트에 저장 완료');
                } else {
                    showToastMessage('저장 실패: ' + res.responseText.trim(), true);
                }
            },
            onerror: function() {
                showToastMessage('구글 시트 전송 오류', true);
            }
        });
    }

    let popup = null;
    function createPopup(formattedTime) {
        if (popup) popup.remove();

        popup = document.createElement('div');
        popup.id = 'yt-memo-popup';
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

        const title = document.createElement('div');
        title.textContent = `타임스탬프 (${formattedTime})`;
        title.style.cssText = 'font-size: 14px; font-weight: 600; margin-bottom: 6px;';
        popup.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.id = 'yt-memo-input';
        textarea.placeholder = '메모를 입력하세요';
        textarea.style.cssText = `
            width: 100%;
            height: 50px;
            padding: 6px;
            font-size: 14px;
            border-radius: 6px;
            resize: none;
            outline: none;
            border: none;
            box-sizing: border-box;
            font-family: 'Noto Sans KR', 'Arial', sans-serif;
            margin-bottom: 8px;
        `;
        textarea.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveMemo();
            }
        });
        popup.appendChild(textarea);

        const btnWrapper = document.createElement('div');
        btnWrapper.style.cssText = 'display: flex; justify-content: flex-end; gap: 8px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '취소';
        cancelBtn.style.cssText = `
            background: none;
            border: none;
            color: #555;
            padding: 6px 12px;
            font-size: 13px;
            cursor: pointer;
            border-radius: 6px;
        `;
        cancelBtn.addEventListener('click', closePopup);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '저장';
        saveBtn.style.cssText = `
            background-color: #3ea6ff;
            border: none;
            color: white;
            padding: 6px 14px;
            font-size: 13px;
            cursor: pointer;
            border-radius: 6px;
        `;
        saveBtn.addEventListener('click', saveMemo);

        btnWrapper.appendChild(cancelBtn);
        btnWrapper.appendChild(saveBtn);
        popup.appendChild(btnWrapper);

        document.body.appendChild(popup);
        textarea.focus();

        setTimeout(() => {
            document.addEventListener('mousedown', outsideClickHandler);
        }, 10);

        function outsideClickHandler(e) {
            if (!popup) return;
            if (!popup.contains(e.target)) {
                closePopup();
            }
        }

        function saveMemo() {
            const memo = textarea.value.trim();
            if (!memo) {
                showToastMessage('메모를 입력하세요', true);
                textarea.focus();
                return;
            }

            sendToGoogleSheet(formattedTime, memo);
            GM_setClipboard(`${formattedTime}, ${memo}`);
            closePopup();
        }

        function closePopup() {
            if (!popup) return;
            popup.remove();
            popup = null;
            document.removeEventListener('mousedown', outsideClickHandler);
        }
    }

    function getVideoCurrentTime() {
        const video = document.querySelector('video');
        if (!video) return null;
        return Math.floor(video.currentTime);
    }

    window.addEventListener('keydown', e => {
        if ((e.key === hotkey || e.key === hotkey.toLowerCase()) && !e.repeat) {
            const activeElem = document.activeElement;
            if (activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA' || activeElem.isContentEditable)) {
                return;
            }

            const currentSeconds = getVideoCurrentTime();
            if (currentSeconds === null) {
                showToastMessage('비디오를 찾을 수 없습니다.', true);
                return;
            }

            const timeStr = getOffsetTimeStr(currentSeconds);
            createPopup(timeStr);
            e.preventDefault();
        }
    });
})();
