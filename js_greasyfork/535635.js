// ==UserScript==
// @name         심층제보 알리미
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  기본 게시판에서 ON/OFF 토글·입력창·상태원·30분 카운트다운 타이머 적용, 상태·타이머 유지
// @match        https://arca.live/b/mabimobile*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/535635/%EC%8B%AC%EC%B8%B5%EC%A0%9C%EB%B3%B4%20%EC%95%8C%EB%A6%AC%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/535635/%EC%8B%AC%EC%B8%B5%EC%A0%9C%EB%B3%B4%20%EC%95%8C%EB%A6%AC%EB%AF%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 키 상수 ===
    const KEY_TOGGLE = 'arcaToggleState';
    const KEY_INPUT = 'arcaInputValue';
    const KEY_NOTIFIED = 'notifiedIDs';
    const KEY_EXPIRY = 'timerExpiry';

    // === UI 요소 생성 ===
    const searchLi = document.querySelector('.nav-item.nav-channel-search-wrapper');
    if (!searchLi || !searchLi.parentNode) return;

    const ctrlLi = document.createElement('li');
    ctrlLi.className = 'nav-item';
    Object.assign(ctrlLi.style, { display: 'flex', alignItems: 'center', marginLeft: '8px' });

    // ON/OFF 버튼
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'arcaToggle';
    toggleBtn.textContent = GM_getValue(KEY_TOGGLE, 'OFF');
    Object.assign(toggleBtn.style, { padding: '2px 6px', fontSize: '0.8em', cursor: 'pointer', color: '#fff', border: 'none', borderRadius: '3px' });
    function updateToggleColor() {
        toggleBtn.style.backgroundColor = toggleBtn.textContent === 'ON' ? 'green' : 'red';
    }
    toggleBtn.addEventListener('click', () => {
        // 상태 전환
        const next = toggleBtn.textContent === 'ON' ? 'OFF' : 'ON';
        toggleBtn.textContent = next;
        GM_setValue(KEY_TOGGLE, next);
        updateToggleColor();
        // OFF 시 타이머 정리
        if (next === 'OFF') {
            clearInterval(timerInterval);
            timerInterval = null;
            GM_setValue(KEY_EXPIRY, 0);
            remaining = 0;
            updateDisplay();
        } else {
            // ON 전환 시 expiry 값 복원 가능성 체크
            initTimerFromExpiry();
        }
    });
    updateToggleColor();

    // 텍스트 입력창
    const textInput = document.createElement('input');
    textInput.id = 'arcaInput'; textInput.type = 'text'; textInput.maxLength = 5;
    textInput.placeholder = '입력'; textInput.value = GM_getValue(KEY_INPUT, '');
    Object.assign(textInput.style, { width: '60px', padding: '2px 4px', fontSize: '0.8em', marginLeft: '4px', boxSizing: 'border-box' });
    textInput.addEventListener('input', () => {
        GM_setValue(KEY_INPUT, textInput.value);
    });

    // 상태 원형
    const statusCircle = document.createElement('div');
    statusCircle.id = 'arcaStatusCircle';
    Object.assign(statusCircle.style, { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'gray', margin: '0 6px' });

    // 타이머 표시
    const timerSpan = document.createElement('span');
    timerSpan.id = 'arcaTimer'; timerSpan.textContent = '00:00';
    Object.assign(timerSpan.style, { fontSize: '0.8em', minWidth: '50px', textAlign: 'center', fontFamily: 'monospace' });

    ctrlLi.append(toggleBtn, textInput, statusCircle, timerSpan);
    searchLi.parentNode.insertBefore(ctrlLi, searchLi.nextSibling);

    // === 타이머 로직 ===
    let remaining = 0;
    let timerInterval = null;

    function formatTime(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    }
    function updateDisplay() {
        timerSpan.textContent = formatTime(remaining);
        statusCircle.style.backgroundColor = (toggleBtn.textContent === 'ON' && remaining > 0) ? 'red' : 'gray';
    }
    function tick() {
        if (toggleBtn.textContent === 'ON' && remaining > 0) {
            remaining--;
            updateDisplay();
            if (remaining <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }
    }

    function scheduleTick() {
        if (!timerInterval) timerInterval = setInterval(tick, 1000);
    }

    function resetTimer() {
        if (toggleBtn.textContent !== 'ON') return;
        const expiry = Date.now() + 30 * 60 * 1000;
        GM_setValue(KEY_EXPIRY, expiry);
        initTimerFromExpiry();
    }

    function initTimerFromExpiry() {
        const expiry = GM_getValue(KEY_EXPIRY, 0);
        if (expiry && toggleBtn.textContent === 'ON') {
            const delta = Math.floor((expiry - Date.now()) / 1000);
            remaining = delta > 0 ? delta : 0;
            updateDisplay();
            if (remaining > 0) scheduleTick();
        } else {
            remaining = 0;
            updateDisplay();
        }
    }

    // === 알림 트리거 ===
    function getNotified() { return GM_getValue(KEY_NOTIFIED, []); }
    function addNotified(id) {
        const arr = getNotified(); arr.push(id); GM_setValue(KEY_NOTIFIED, arr);
    }

    function checkNewPosts() {
        if (toggleBtn.textContent !== 'ON') return;
        const keyword = textInput.value.trim(); if (!keyword) return;
        fetch('https://arca.live/b/mabimobile')
            .then(r => r.text())
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                doc.querySelectorAll('.list-table a.vrow.column').forEach(row => {
                    const idNode = row.querySelector('.vcol.col-id span');
                    if (!idNode) return;
                    const id = idNode.textContent.trim();
                    if (!id || getNotified().includes(id)) return;
                    const badge = row.querySelector('span.badge.badge-success');
                    if (!badge || badge.textContent.trim() !== '심층제보') return;
                    const titleEl = row.querySelector('span.title');
                    if (!titleEl) return;
                    const title = titleEl.textContent.trim();
                    if (!title.includes(keyword)) return;
                    GM_notification({ title: '심층제보 알리미', text: `새 심층제보: ${title} (ID: ${id})`, timeout: 5000 });
                    addNotified(id);
                    resetTimer();
                });
            }).catch(console.error);
    }

    // 초기화
    initTimerFromExpiry();
    checkNewPosts();
    setInterval(checkNewPosts, 30000);
})();
