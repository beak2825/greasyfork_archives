// ==UserScript==
// @name         심층제보 알리미
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  arca.live/b/mabimobile에서 UI 표시 + 어디서든 알림 실행 가능한 심층제보 & 타이머 & 동그라미 스크립트
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      arca.live
// @downloadURL https://update.greasyfork.org/scripts/536359/%EC%8B%AC%EC%B8%B5%EC%A0%9C%EB%B3%B4%20%EC%95%8C%EB%A6%AC%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/536359/%EC%8B%AC%EC%B8%B5%EC%A0%9C%EB%B3%B4%20%EC%95%8C%EB%A6%AC%EB%AF%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === storage keys ===
    const KEY_TOGGLE        = 'arcaToggleState';
    const KEY_INPUT         = 'arcaInputValue';
    const KEY_EXPIRY        = 'timerExpiry';
    const KEY_TOGGLE2       = 'arcaToggle2State';
    const KEY_INPUT2        = 'arcaInput2Value';
    const KEY_EXPIRY2       = 'timer2Expiry';
    const KEY_STAGE2        = 'timer2Stage';
    const KEY_CIRCLES       = 'arcaCircleStates';
    const KEY_CIRCLE_RESET  = 'arcaCircleLastReset';
    const KEY_NOTIFIED      = 'notifiedIDs';

    // === determine if we should inject UI ===
    const showUI = location.hostname === 'arca.live' && location.pathname.startsWith('/b/mabimobile');

    // === helper: cross-domain fetch using GM_xmlhttpRequest ===
    function xfetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: r => resolve(r.responseText),
                onerror: reject
            });
        });
    }

    // === VARIABLES FOR TIMERS & CIRCLES ===
    let remaining = 0, timerInterval = null;
    let remaining2 = 0, timerInterval2 = null, stage2 = GM_getValue(KEY_STAGE2, 1);
    let circleStates = GM_getValue(KEY_CIRCLES, [false, false, false]);

    // === formatting ===
    function formatTime(sec) {
        const m = String(Math.floor(sec/60)).padStart(2,'0');
        const s = String(sec%60).padStart(2,'0');
        return `${m}:${s}`;
    }

    // === NOTIFICATIONS ENABLED? ===
    function notificationsEnabled() {
        // disable if all three circles are active
        return !circleStates.every(v => v === true);
    }

    // === CHECK NEW POSTS & trigger notifications ===
    async function checkNewPosts() {
        if (GM_getValue(KEY_TOGGLE, 'OFF') !== 'ON') return;
        if (!notificationsEnabled()) return;
        const kw = GM_getValue(KEY_INPUT, '').trim();
        if (!kw) return;
        try {
            const html = await xfetch('https://arca.live/b/mabimobile');
            const doc = new DOMParser().parseFromString(html, 'text/html');
            doc.querySelectorAll('.list-table a.vrow.column').forEach(row => {
                const idNode = row.querySelector('.vcol.col-id span');
                if (!idNode) return;
                const id = idNode.textContent.trim();
                if (!id) return;
                const notified = GM_getValue(KEY_NOTIFIED, []);
                if (notified.includes(id)) return;
                const badge = row.querySelector('span.badge.badge-success');
                if (!badge || badge.textContent.trim() !== '심층제보') return;
                const titleEl = row.querySelector('span.title');
                if (!titleEl) return;
                const title = titleEl.textContent.trim();
                if (!title.includes(kw)) return;
                GM_notification({ title: '심층제보 알리미', text: `새 심층제보: ${title} (ID: ${id})`, timeout: 5000 });
                notified.push(id);
                GM_setValue(KEY_NOTIFIED, notified);
                if (remaining === 0) resetTimer();
            });
        } catch (e) {
            console.error(e);
        }
    }

    // === FIRST TIMER ===
    function updateDisplay() {
        if (!showUI) return;
        document.getElementById('arcaTimer').textContent = formatTime(remaining);
        document.getElementById('arcaStatusCircle').style.backgroundColor =
            (GM_getValue(KEY_TOGGLE) === 'ON' && remaining > 0) ? 'red' : 'gray';
    }
    function tick() {
        if (GM_getValue(KEY_TOGGLE) === 'ON' && remaining > 0) {
            remaining--;
            updateDisplay();
            if (remaining <= 0) clearInterval(timerInterval), timerInterval = null;
        }
    }
    function scheduleTick() {
        if (!timerInterval) timerInterval = setInterval(tick, 1000);
    }
    function resetTimer() {
        if (GM_getValue(KEY_TOGGLE) !== 'ON') return;
        const exp = Date.now() + 30*60*1000;
        GM_setValue(KEY_EXPIRY, exp);
        initTimerFromExpiry();
    }
    function initTimerFromExpiry() {
        const exp = GM_getValue(KEY_EXPIRY, 0);
        if (exp && GM_getValue(KEY_TOGGLE) === 'ON') {
            const delta = Math.floor((exp - Date.now())/1000);
            remaining = delta > 0 ? delta : 0;
            updateDisplay();
            if (remaining > 0) scheduleTick();
        } else {
            remaining = 0;
            updateDisplay();
        }
    }

    // === SECOND TIMER (custom) ===
    function updateDisplay2() {
        if (!showUI) return;
        document.getElementById('arcaTimer2').textContent = formatTime(remaining2);
    }
    function tick2() {
        if (GM_getValue(KEY_TOGGLE2) === 'ON' && remaining2 > 0) {
            remaining2--;
            updateDisplay2();
            if (remaining2 <= 0) {
                clearInterval(timerInterval2); timerInterval2 = null;
                if (stage2 === 1 && notificationsEnabled()) {
                    GM_notification({ title: '구멍 초기화', text: '구멍 초기화', timeout: 5000 });
                    stage2 = 2;
                    GM_setValue(KEY_STAGE2, stage2);
                }
                remaining2 = 30*60;
                GM_setValue(KEY_EXPIRY2, Date.now() + remaining2*1000);
                updateDisplay2();
                scheduleTick2();
            }
        }
    }
    function scheduleTick2() {
        if (!timerInterval2) timerInterval2 = setInterval(tick2, 1000);
    }
    function initTimer2FromExpiry() {
        const exp2 = GM_getValue(KEY_EXPIRY2, 0);
        stage2 = GM_getValue(KEY_STAGE2, 1);
        if (exp2 && GM_getValue(KEY_TOGGLE2) === 'ON') {
            const delta = Math.floor((exp2 - Date.now())/1000);
            remaining2 = delta > 0 ? delta : 0;
            if (remaining2 <= 0) {
                stage2 = 2;
                GM_setValue(KEY_STAGE2, stage2);
                remaining2 = 30*60;
            }
            updateDisplay2();
            if (remaining2 > 0) scheduleTick2();
        } else {
            remaining2 = 0;
            stage2 = 1;
            GM_setValue(KEY_STAGE2, stage2);
            updateDisplay2();
        }
    }

    // === CIRCLES UI & LOGIC ===
    function updateCirclesUI() {
        if (!showUI) return;
        const defaultColor = 'gray';
        const activeColor  = '#90ee90';
        circleStates.forEach((st, i) => {
            const c = document.getElementById(`arcaExtraCircle${i+1}`);
            c.style.backgroundColor = st ? activeColor : defaultColor;
        });
        // if all three are active, auto-OFF both toggles
        if (circleStates.every(v => v)) {
            if (GM_getValue(KEY_TOGGLE) === 'ON') {
                GM_setValue(KEY_TOGGLE, 'OFF');
                clearInterval(timerInterval); timerInterval = null;
                GM_setValue(KEY_EXPIRY, 0); remaining = 0; updateDisplay();
            }
            if (GM_getValue(KEY_TOGGLE2) === 'ON') {
                GM_setValue(KEY_TOGGLE2, 'OFF');
                clearInterval(timerInterval2); timerInterval2 = null;
                GM_setValue(KEY_EXPIRY2, 0); GM_setValue(KEY_STAGE2, 1);
                remaining2 = 0; updateDisplay2();
            }
        }
    }
    function resetCircles() {
        circleStates = [false, false, false];
        GM_setValue(KEY_CIRCLES, circleStates);
        updateCirclesUI();
    }
    function scheduleCircleReset() {
        const now = Date.now();
        const d = new Date();
        const today6 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 6,0,0).getTime();
        const last = GM_getValue(KEY_CIRCLE_RESET, 0);
        let next;
        if (now >= today6) {
            if (last < today6) { resetCircles(); GM_setValue(KEY_CIRCLE_RESET, today6); }
            next = today6 + 86400000;
        } else {
            const y6 = today6 - 86400000;
            if (last < y6) { resetCircles(); GM_setValue(KEY_CIRCLE_RESET, y6); }
            next = today6;
        }
        setTimeout(() => {
            resetCircles();
            GM_setValue(KEY_CIRCLE_RESET, next);
            scheduleCircleReset();
        }, next - now);
    }

    // === INJECT UI ONLY ON /b/mabimobile ===
    if (showUI) {
        const searchLi = document.querySelector('.nav-item.nav-channel-search-wrapper');
        const ctrlLi = document.createElement('li');
        ctrlLi.className = 'nav-item';
        Object.assign(ctrlLi.style, { display:'flex', alignItems:'center', marginLeft:'8px' });

        // first toggle
        const toggleBtnEl = document.createElement('button');
        toggleBtnEl.id = 'arcaToggle';
        toggleBtnEl.textContent = GM_getValue(KEY_TOGGLE, 'OFF');
        Object.assign(toggleBtnEl.style, { padding:'2px 6px', fontSize:'0.8em', cursor:'pointer', color:'#fff', border:'none', borderRadius:'3px' });
        toggleBtnEl.addEventListener('click', () => {
            const next = toggleBtnEl.textContent==='ON'?'OFF':'ON';
            toggleBtnEl.textContent = next;
            GM_setValue(KEY_TOGGLE, next);
            toggleBtnEl.style.backgroundColor = next==='ON'?'green':'red';
            if (next==='OFF') clearInterval(timerInterval), timerInterval=null, GM_setValue(KEY_EXPIRY,0), remaining=0, updateDisplay();
            else initTimerFromExpiry();
        });
        toggleBtnEl.style.backgroundColor = toggleBtnEl.textContent==='ON'?'green':'red';

        // keyword input
        const textInputEl = document.createElement('input');
        textInputEl.id = 'arcaInput';
        textInputEl.type = 'text'; textInputEl.maxLength = 5;
        textInputEl.placeholder = '입력';
        textInputEl.value = GM_getValue(KEY_INPUT, '');
        Object.assign(textInputEl.style, { width:'60px', padding:'2px 4px', fontSize:'0.8em', marginLeft:'4px', boxSizing:'border-box' });
        textInputEl.addEventListener('input', () => GM_setValue(KEY_INPUT, textInputEl.value));

        // status circle
        const statusCircleEl = document.createElement('div');
        statusCircleEl.id = 'arcaStatusCircle';
        Object.assign(statusCircleEl.style, { width:'10px', height:'10px', borderRadius:'50%', backgroundColor:'gray', margin:'0 6px' });

        // timer span
        const timerSpanEl = document.createElement('span');
        timerSpanEl.id = 'arcaTimer';
        timerSpanEl.textContent = '00:00';
        Object.assign(timerSpanEl.style, { fontSize:'0.8em', minWidth:'50px', textAlign:'center', fontFamily:'monospace', marginLeft:'4px' });

        // separator
        const sep = document.createElement('span');
        sep.textContent = '|';
        Object.assign(sep.style, { margin:'0 6px', fontSize:'0.8em', color:'#999' });

        // second toggle
        const toggleBtn2El = document.createElement('button');
        toggleBtn2El.id = 'arcaToggle2';
        toggleBtn2El.textContent = GM_getValue(KEY_TOGGLE2, 'OFF');
        Object.assign(toggleBtn2El.style, { padding:'2px 6px', fontSize:'0.8em', cursor:'pointer', color:'#fff', border:'none', borderRadius:'3px' });
        toggleBtn2El.addEventListener('click', () => {
            const next = toggleBtn2El.textContent==='ON'?'OFF':'ON';
            toggleBtn2El.textContent = next;
            GM_setValue(KEY_TOGGLE2, next);
            toggleBtn2El.style.backgroundColor = next==='ON'?'green':'red';
            if (next==='OFF') clearInterval(timerInterval2), timerInterval2=null, GM_setValue(KEY_EXPIRY2,0), GM_setValue(KEY_STAGE2,1), remaining2=0, updateDisplay2();
            else { const num=parseInt(textInput2El.value,10); remaining2=(!isNaN(num)&&num>0)?num*60:0; stage2=1; GM_setValue(KEY_STAGE2,1); GM_setValue(KEY_EXPIRY2, remaining2>0?Date.now()+remaining2*1000:0); updateDisplay2();if(remaining2>0) scheduleTick2();}
        });
        toggleBtn2El.style.backgroundColor = toggleBtn2El.textContent==='ON'?'green':'red';

        // second input
        const textInput2El = document.createElement('input');
        textInput2El.id = 'arcaInput2';
        textInput2El.type = 'text'; textInput2El.maxLength = 5;
        textInput2El.placeholder = '입력';
        textInput2El.value = GM_getValue(KEY_INPUT2, '');
        Object.assign(textInput2El.style, { width:'60px', padding:'2px 4px', fontSize:'0.8em', marginLeft:'4px', boxSizing:'border-box' });
        textInput2El.addEventListener('input', () => {
            GM_setValue(KEY_INPUT2, textInput2El.value);
            clearInterval(timerInterval2); timerInterval2=null;
            const num = parseInt(textInput2El.value,10);
            remaining2 = (!isNaN(num)&&num>0)?num*60:0;
            stage2=1; GM_setValue(KEY_STAGE2,1);
            GM_setValue(KEY_EXPIRY2, remaining2>0?Date.now()+remaining2*1000:0);
            updateDisplay2();
            if (GM_getValue(KEY_TOGGLE2)==='ON' && remaining2>0) scheduleTick2();
        });

        // second timer span
        const timerSpan2El = document.createElement('span');
        timerSpan2El.id = 'arcaTimer2';
        timerSpan2El.textContent = '00:00';
        Object.assign(timerSpan2El.style, { fontSize:'0.8em', minWidth:'50px', textAlign:'center', fontFamily:'monospace', marginLeft:'4px' });

        // circles
        const circleContainerEl = document.createElement('div');
        Object.assign(circleContainerEl.style, { display:'flex', alignItems:'center', marginLeft:'6px' });
        for (let i = 1; i <= 3; i++) {
            const c = document.createElement('div');
            c.id = `arcaExtraCircle${i}`;
            Object.assign(c.style, { width:'20px', height:'20px', borderRadius:'50%', backgroundColor:'gray', margin:'0 4px', cursor:'pointer' });
            c.addEventListener('click', () => {
                circleStates[i-1] = !circleStates[i-1];
                GM_setValue(KEY_CIRCLES, circleStates);
                updateCirclesUI();
            });
            circleContainerEl.appendChild(c);
        }

        // append all
        ctrlLi.append(
            toggleBtnEl, textInputEl, statusCircleEl, timerSpanEl,
            sep,
            toggleBtn2El, textInput2El, timerSpan2El,
            circleContainerEl
        );
        searchLi.parentNode.insertBefore(ctrlLi, searchLi.nextSibling);
    }

    // === INITIALIZE ===
    scheduleCircleReset();
    initTimerFromExpiry();
    initTimer2FromExpiry();
    updateCirclesUI();
    checkNewPosts();
    setInterval(checkNewPosts, 30000);

})();
