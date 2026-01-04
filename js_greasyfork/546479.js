// ==UserScript==
// @name         CHZZK(치지직) 타임스탬프
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  CHZZK(치지직) 라이브 및 다시보기 영상에서 단축키 'Y'를 눌러 메모를 작성하고 저장할 수 있습니다.
// @author       멍멍이
// @match        https://chzzk.naver.com/*
// @match        https://*.chzzk.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546479/CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84.user.js
// @updateURL https://update.greasyfork.org/scripts/546479/CHZZK%28%EC%B9%98%EC%A7%80%EC%A7%81%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const hotkey = 'Y';
 
    function saveTimestampLog(timeStr, memo) {
        const log = GM_getValue('timestampLog', []);
        log.push({ time: timeStr, memo });
        GM_setValue('timestampLog', log);
    }
 
    let offset = GM_getValue('offset', 0);
 
    GM_registerMenuCommand('⏱️시간 오프셋 설정', () => {
        let newOffset = prompt("몇 초 전의 시간을 저장할까요?\n\n[예시]\n60 입력 시, 1:00:00 → 00:59:00의 시간이 저장 (현재: " + offset + "초)");
        if (newOffset !== null && !isNaN(newOffset)) {
            offset = parseInt(newOffset, 10);
            GM_setValue('offset', offset);
            showToastMessage(`오프셋이 ${offset}초로 설정되었습니다.`);
        } else {
            showToastMessage('숫자만 입력해주세요!');
        }
    });
 
    GM_registerMenuCommand('📁 타임스탬프 파일로 저장', () => {
        const log = GM_getValue('timestampLog', []);
        if (!log || log.length === 0) return showToastMessage("저장된 내용이 없습니다.");
        const allText = log.map(item => `${item.time}, ${item.memo}`).join('\n');
        const blob = new Blob([allText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `타임라인 ${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToastMessage("파일 다운로드 완료!");
    });
 
    GM_registerMenuCommand('🗑️ 타임스탬프 초기화', () => {
        if (confirm('저장된 모든 타임스탬프 기록을 삭제하시겠습니까?')) {
            GM_setValue('timestampLog', []);
            showToastMessage('기록이 초기화되었습니다.');
        }
    });
 
    function showMemoInputPopup(time, onSave) {
        let existingPopup = document.getElementById('memoPopup');
        if (existingPopup) existingPopup.remove();
 
        const popup = document.createElement('div');
        popup.id = 'memoPopup';
        popup.style.cssText = `
            position: fixed;
            bottom: 1%;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 6px;
            padding: 8px 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            font-size: 17px;
            z-index: 9999;
            color: black;
            user-select: text;
        `;
 
        popup.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 6px; font-size: 14px; color: black;">타임스탬프 (${time})</div>
            <textarea id="memoInput" placeholder="메모를 입력하세요" style="width: 100%; padding: 6px; font-size: 14px; color: black; background: #fff; border: none; outline: none; resize: none;"></textarea>
            <div style="margin-top: 8px; text-align: right;">
                <button id="memoCancel" style="padding: 4px 10px; font-size: 13px; color: black !important;">취소</button>
                <button id="memoSave" style="padding: 4px 10px; font-size: 13px; background-color: #3ea6ff; color: white; border: none; border-radius: 4px;">저장</button>
            </div>
        `;
 
        document.body.appendChild(popup);
 
        const input = document.getElementById('memoInput');
        input.focus();
 
        function saveAndClose() {
            let memo = input.value.trim();
            if (memo === "") memo = "";
            onSave(memo);
            popup.remove();
            document.removeEventListener('mousedown', outsideClickHandler);
        }
 
        document.getElementById('memoSave').onclick = saveAndClose;
        document.getElementById('memoCancel').onclick = () => {
            popup.remove();
            document.removeEventListener('mousedown', outsideClickHandler);
        };
 
        function outsideClickHandler(event) {
            if (!popup.contains(event.target)) {
                popup.remove();
                document.removeEventListener('mousedown', outsideClickHandler);
            }
        }
 
        setTimeout(() => {
            document.addEventListener('mousedown', outsideClickHandler);
        }, 200);
 
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveAndClose();
            }
        });
    }
 
    function showToastMessage(message, isError = false) {
        let toastContainer = document.querySelector('#toastMessage');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastMessage';
            toastContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${isError ? '#f44336' : 'rgba(0, 0, 0, 0.75)'};
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                user-select: none;
                max-width: 80vw;
                text-align: center;
            `;
            const p = document.createElement('p');
            p.style.margin = '0';
            toastContainer.appendChild(p);
            document.body.appendChild(toastContainer);
        }
        const messageElement = toastContainer.querySelector('p');
        messageElement.textContent = message;
        toastContainer.style.opacity = '1';
        setTimeout(() => {
            toastContainer.style.opacity = '0';
        }, 2000);
    }
 
    const TIME_SELECTORS = [
        '.pzp-vod-time__current-time',
        '.pzp-vod-time .pzp-vod-time__current-time',
        '.time-current',
        '.current-time',
        '.time_display .time-current',
        '.time_display',
        '.timeDisplay'
    ];
 
    function findTimeElement() {
        for (const sel of TIME_SELECTORS) {
            const el = document.querySelector(sel);
            if (el && el.innerText) {
                const match = el.innerText.match(/\d{1,2}:\d{2}(?::\d{2})?/);
                if (match) return { element: el, time: match[0] };
            }
        }
        const candidates = document.querySelectorAll('span,div,button');
        for (const n of candidates) {
            if (!n || !n.innerText) continue;
            const match = n.innerText.trim().match(/\d{1,2}:\d{2}(?::\d{2})?/);
            if (match) return { element: n, time: match[0] };
        }
        return null;
    }
 
    function formatTimeWithOffset(timeStr, offsetSec) {
        if (!timeStr) return timeStr;
        const parts = timeStr.split(':').map(s => Number(s));
        let totalSeconds = 0;
        if (parts.length === 3) {
            totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            totalSeconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 1) {
            totalSeconds = parts[0];
        } else {
            return timeStr;
        }
        totalSeconds = totalSeconds - (offsetSec || 0);
        if (totalSeconds < 0) totalSeconds = 0;
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
 
    function handleChzzkTimestamp() {
        const url = window.location.href;
        const isLive = /\/live\//.test(url);
        const isVod = /\/video\//.test(url);
 
        const activeElem = document.activeElement;
        if (activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA' || activeElem.isContentEditable)) return;
 
        const found = findTimeElement();
        if (!found) return showToastMessage('시간 정보를 찾을 수 없습니다.');
 
        let raw = found.time.trim();
        const adjustedTime = formatTimeWithOffset(raw, offset);
 
        if (isLive) {
            showMemoInputPopup(adjustedTime, (memo) => {
                try { navigator.clipboard.writeText(`${adjustedTime}, ${memo}`); } catch(e){}
                saveTimestampLog(adjustedTime, memo);
                showToastMessage('저장 완료');
            });
        } else if (isVod) {
            try {
                navigator.clipboard.writeText(adjustedTime);
                showToastMessage(`${adjustedTime} 복사 완료`);
            } catch(e) {
                showToastMessage('클립보드 복사 실패', true);
            }
        } else {
            showToastMessage('지원하지 않는 페이지입니다.', true);
        }
    }
 
    function enableChzzkTimestamp() {
        if (enableChzzkTimestamp._enabled) return;
        document.addEventListener('keydown', keyHandler);
        document.addEventListener('click', clickHandler, { capture: true });
        enableChzzkTimestamp._enabled = true;
    }
 
    function disableChzzkTimestamp() {
        document.removeEventListener('keydown', keyHandler);
        document.removeEventListener('click', clickHandler, { capture: true });
        enableChzzkTimestamp._enabled = false;
    }
 
    function keyHandler(e) {
        const active = document.activeElement;
        const isInput = active && (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable
        );
        if (isInput) return;
        if (e.key === 'y' || e.key === 'Y') {
            e.preventDefault();
            handleChzzkTimestamp();
        }
    }
 
    function clickHandler(event) {
        const clicked = event.target.closest('.pzp-vod-time, .pzp-vod-time__current-time, .time_display, .timeDisplay, .time-current, .current-time');
        if (clicked) {
            const timeEl = clicked.querySelector('.pzp-vod-time__current-time') || clicked;
            const txt = (timeEl && timeEl.innerText) ? timeEl.innerText : '';
            const m = txt.match(/\d{1,2}:\d{2}(?::\d{2})?/);
            if (m) {
                try { navigator.clipboard.writeText(m[0]); } catch (e) {}
                showToastMessage(`${m[0]} 복사 완료`);
            } else {
                showToastMessage('시간 정보를 찾을 수 없습니다.', true);
            }
        }
    }
 
    const isValidChzzkPage = () => /\/(live|video)\//.test(window.location.href);
 
    function onPageChange() {
        if (isValidChzzkPage()) {
            enableChzzkTimestamp();
        } else {
            disableChzzkTimestamp();
        }
    }
 
    (function() {
        const _pushState = history.pushState;
        history.pushState = function() {
            _pushState.apply(this, arguments);
            window.dispatchEvent(new Event('urlchange'));
        };
        const _replaceState = history.replaceState;
        history.replaceState = function() {
            _replaceState.apply(this, arguments);
            window.dispatchEvent(new Event('urlchange'));
        };
    })();
 
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('urlchange')));
    window.addEventListener('urlchange', onPageChange);
    onPageChange();
 
})();