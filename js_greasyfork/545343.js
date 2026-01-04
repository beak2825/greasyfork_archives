// ==UserScript==
// @name         SOOP(숲) 타임스탬프 - 구글시트 연동
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  SOOP(숲) 라이브 및 다시보기 영상에서 단축키 'Y'를 눌러 메모 작성 후 구글시트에 저장 합니다.
// @author       멍멍이
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545343/SOOP%28%EC%88%B2%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84%20-%20%EA%B5%AC%EA%B8%80%EC%8B%9C%ED%8A%B8%20%EC%97%B0%EB%8F%99.user.js
// @updateURL https://update.greasyfork.org/scripts/545343/SOOP%28%EC%88%B2%29%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%83%AC%ED%94%84%20-%20%EA%B5%AC%EA%B8%80%EC%8B%9C%ED%8A%B8%20%EC%97%B0%EB%8F%99.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const hotkey = 'Y';
    let offset = 0;
 
    function sendToGoogleSheet(time, memo) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://script.google.com/macros/s/AKfycbyXlQnn08nq147xpE5W_CYXevMfH49CuQiCF3z_G76vyN5UF3xA3wVDmd_oFAtxUlJfFg/exec',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({ time, memo }),
            onload: function(response) {
                if (response.status === 200) {
                    showToastMessage('구글시트에 저장 완료');
                } else {
                    showToastMessage('구글시트 저장 실패', true);
                }
            },
            onerror: function() {
                showToastMessage('구글시트 저장 중 오류 발생', true);
            }
        });
    }
 
    GM_registerMenuCommand('⏱️시간 오프셋 설정', () => {
        let newOffset = prompt(`몇 초 전의 시간을 저장할까요?\n\n[예시]\n60 입력 시, 1:00:00 → 00:59:00의 시간이 저장 (현재: ${offset}초)`);
        if (newOffset !== null && !isNaN(newOffset)) {
            offset = parseInt(newOffset, 10);
            showToastMessage(`오프셋이 ${offset}초로 설정되었습니다.`);
        } else {
            showToastMessage('숫자만 입력해주세요!');
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
            <textarea id="memoInput" placeholder="메모를 입력하세요" style="
                width: 100%;
                padding: 6px;
                font-size: 14px;
                color: black;
                background: #fff;
                border: none;
                outline: none;
                resize: none;
                box-sizing: border-box;
                margin: 0;
            "></textarea>
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
        const toastContainer = document.querySelector('#toastMessage');
        if (toastContainer) {
            toastContainer.style.display = '';
            const messageElement = toastContainer.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            setTimeout(() => {
                if (messageElement) messageElement.textContent = '';
                toastContainer.style.display = 'none';
            }, 2000);
        } else {
            alert(message);
        }
    }
 
    if (window.location.href.includes('play.sooplive.co.kr')) {
 
        function formatTimeWithOffset(timeStr, offset) {
            const [hours, minutes, seconds] = timeStr.split(':').map(Number);
            let totalSeconds = hours * 3600 + minutes * 60 + seconds - offset;
            if (totalSeconds < 0) totalSeconds = 0;
            const newHours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const newMinutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const newSeconds = (totalSeconds % 60).toString().padStart(2, '0');
            return `${newHours}:${newMinutes}:${newSeconds}`;
        }
 
        function handleLiveTimestamp() {
            const activeElem = document.activeElement;
            if (activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA' || activeElem.isContentEditable)) {
                return;
            }
 
            const time = document.querySelector('#time')?.innerText;
            if (!time) return showToastMessage('시간 정보를 찾을 수 없습니다.');
            const adjustedTime = formatTimeWithOffset(time, offset);
            showMemoInputPopup(adjustedTime, (memo) => {
                navigator.clipboard.writeText(`${adjustedTime}, ${memo}`);
                sendToGoogleSheet(adjustedTime, memo);
            });
        }
 
        const button = document.querySelector('#broadInfo > ul > li.time');
        if (button) {
            button.title = '현재 방송시간 복사 (Y)';
            button.style.cursor = 'pointer';
            button.addEventListener('click', handleLiveTimestamp);
        }
 
        document.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            const isInput = active && (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable
            );
            if (isInput) return;
 
            if (e.key === 'y' || e.key === 'Y') {
                e.preventDefault();
                handleLiveTimestamp();
            }
        });
    }
 
    if (window.location.href.includes('vod.sooplive.co.kr')) {
        function showToastMessage(message, isError = false) {
            const toastContainer = document.querySelector('#toastMessage');
            if (toastContainer) {
                const toastWrapper = document.createElement('div');
                const toastContent = document.createElement('p');
                toastContent.textContent = message;
                toastWrapper.appendChild(toastContent);
                toastContainer.appendChild(toastWrapper);
                setTimeout(() => {
                    toastContainer.removeChild(toastWrapper);
                }, 2000);
            } else {
                alert(message);
            }
        }
 
        document.addEventListener('click', (event) => {
            const timeDisplay = event.target.closest('.time_display');
            if (timeDisplay) {
                timeDisplay.title = '현재 재생시간 복사 (Y)';
                const timeElement = document.querySelector('.time_display .time-current');
                if (timeElement) {
                    const time = timeElement.innerText;
                    navigator.clipboard.writeText(time);
                    showToastMessage(`${time} 복사 완료`);
                } else {
                    showToastMessage('시간 정보를 찾을 수 없습니다.', true);
                }
            }
        });
 
        document.addEventListener('keypress', (event) => {
            if (event.key.toUpperCase() === hotkey) {
                const timeElement = document.querySelector('.time_display .time-current');
                if (timeElement) {
                    const time = timeElement.innerText;
                    navigator.clipboard.writeText(time);
                    showToastMessage(`${time} 복사 완료`);
                } else {
                    showToastMessage('시간 정보를 찾을 수 없습니다.', true);
                }
            }
        });
    }
})();