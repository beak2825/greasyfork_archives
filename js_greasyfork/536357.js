// ==UserScript==
// @name         심층제보 알리미
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  기본 게시판에서 ON/OFF 토글·입력창·30분 카운트다운 타이머 유지 + 사용자 지정 타이머 + 추가 동그라미 UI + 상태 원형 복원 + 일일 동그라미 리셋 + 동그라미 전부 선택 시 자동 OFF
// @match        https://arca.live/b/mabimobile*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/536357/%EC%8B%AC%EC%B8%B5%EC%A0%9C%EB%B3%B4%20%EC%95%8C%EB%A6%AC%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/536357/%EC%8B%AC%EC%B8%B5%EC%A0%9C%EB%B3%B4%20%EC%95%8C%EB%A6%AC%EB%AF%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 키 상수 ===
    const KEY_TOGGLE        = 'arcaToggleState';
    const KEY_INPUT         = 'arcaInputValue';
    const KEY_NOTIFIED      = 'notifiedIDs';
    const KEY_EXPIRY        = 'timerExpiry';
    const KEY_TOGGLE2       = 'arcaToggle2State';
    const KEY_INPUT2        = 'arcaInput2Value';
    const KEY_EXPIRY2       = 'timer2Expiry';
    const KEY_STAGE2        = 'timer2Stage';
    const KEY_CIRCLES       = 'arcaCircleStates';
    const KEY_CIRCLE_RESET  = 'arcaCircleLastReset';

    // === UI 생성 위치 찾기 ===
    const searchLi = document.querySelector('.nav-item.nav-channel-search-wrapper');
    if (!searchLi || !searchLi.parentNode) return;
    const ctrlLi = document.createElement('li');
    ctrlLi.className = 'nav-item';
    Object.assign(ctrlLi.style, { display: 'flex', alignItems: 'center', marginLeft: '8px' });

    // ===== 심층제보 토글 & 키워드 입력 =====
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'arcaToggle';
    toggleBtn.textContent = GM_getValue(KEY_TOGGLE, 'OFF');
    Object.assign(toggleBtn.style, { padding:'2px 6px', fontSize:'0.8em', cursor:'pointer', color:'#fff', border:'none', borderRadius:'3px' });
    function updateToggleColor() {
        toggleBtn.style.backgroundColor = toggleBtn.textContent==='ON' ? 'green' : 'red';
    }
    toggleBtn.addEventListener('click', () => {
        const next = toggleBtn.textContent==='ON' ? 'OFF' : 'ON';
        toggleBtn.textContent = next;
        GM_setValue(KEY_TOGGLE, next);
        updateToggleColor();
        if (next==='OFF') {
            clearInterval(timerInterval);
            timerInterval = null;
            GM_setValue(KEY_EXPIRY, 0);
            remaining = 0;
            updateDisplay();
        } else {
            initTimerFromExpiry();
        }
    });
    updateToggleColor();

    const textInput = document.createElement('input');
    textInput.id = 'arcaInput';
    textInput.type = 'text';
    textInput.maxLength = 5;
    textInput.placeholder = '입력';
    textInput.value = GM_getValue(KEY_INPUT, '');
    Object.assign(textInput.style, { width:'60px', padding:'2px 4px', fontSize:'0.8em', marginLeft:'4px', boxSizing:'border-box' });
    textInput.addEventListener('input', () => GM_setValue(KEY_INPUT, textInput.value));

    const statusCircle = document.createElement('div');
    statusCircle.id = 'arcaStatusCircle';
    Object.assign(statusCircle.style, { width:'10px', height:'10px', borderRadius:'50%', backgroundColor:'gray', margin:'0 6px' });

    const timerSpan = document.createElement('span');
    timerSpan.id = 'arcaTimer';
    timerSpan.textContent = '00:00';
    Object.assign(timerSpan.style, { fontSize:'0.8em', minWidth:'50px', textAlign:'center', fontFamily:'monospace', marginLeft:'4px' });

    // ===== 구분선 =====
    const separator = document.createElement('span');
    separator.textContent = '|';
    Object.assign(separator.style, { margin:'0 6px', fontSize:'0.8em', color:'#999' });

    // ===== 사용자 지정 타이머 ON/OFF & 입력 =====
    const toggleBtn2 = document.createElement('button');
    toggleBtn2.id = 'arcaToggle2';
    toggleBtn2.textContent = GM_getValue(KEY_TOGGLE2, 'OFF');
    Object.assign(toggleBtn2.style, { padding:'2px 6px', fontSize:'0.8em', cursor:'pointer', color:'#fff', border:'none', borderRadius:'3px' });
    function updateToggleColor2() {
        toggleBtn2.style.backgroundColor = toggleBtn2.textContent==='ON' ? 'green' : 'red';
    }
    toggleBtn2.addEventListener('click', () => {
        const next = toggleBtn2.textContent==='ON' ? 'OFF' : 'ON';
        toggleBtn2.textContent = next;
        GM_setValue(KEY_TOGGLE2, next);
        updateToggleColor2();
        if (next==='OFF') {
            clearInterval(timerInterval2);
            timerInterval2 = null;
            GM_setValue(KEY_EXPIRY2, 0);
            GM_setValue(KEY_STAGE2, 1);
            remaining2 = 0;
            updateDisplay2();
        } else {
            const num = parseInt(textInput2.value, 10);
            remaining2 = (!isNaN(num)&&num>0)?num*60:0;
            stage2 = 1; GM_setValue(KEY_STAGE2, stage2);
            const expiry2 = remaining2>0?Date.now()+remaining2*1000:0;
            GM_setValue(KEY_EXPIRY2, expiry2);
            updateDisplay2();
            if (remaining2>0) scheduleTick2();
        }
    });
    updateToggleColor2();

    const textInput2 = document.createElement('input');
    textInput2.id = 'arcaInput2';
    textInput2.type = 'text';
    textInput2.maxLength = 5;
    textInput2.placeholder = '입력';
    textInput2.value = GM_getValue(KEY_INPUT2, '');
    Object.assign(textInput2.style, { width:'60px', padding:'2px 4px', fontSize:'0.8em', marginLeft:'4px', boxSizing:'border-box' });
    textInput2.addEventListener('input', () => {
        GM_setValue(KEY_INPUT2, textInput2.value);
        clearInterval(timerInterval2);
        timerInterval2 = null;
        const num = parseInt(textInput2.value, 10);
        remaining2 = (!isNaN(num)&&num>0)?num*60:0;
        stage2 = 1; GM_setValue(KEY_STAGE2, stage2);
        const expiry2 = remaining2>0?Date.now()+remaining2*1000:0;
        GM_setValue(KEY_EXPIRY2, expiry2);
        updateDisplay2();
        if (toggleBtn2.textContent==='ON'&&remaining2>0) scheduleTick2();
    });

    const timerSpan2 = document.createElement('span');
    timerSpan2.id = 'arcaTimer2';
    timerSpan2.textContent = '00:00';
    Object.assign(timerSpan2.style, { fontSize:'0.8em', minWidth:'50px', textAlign:'center', fontFamily:'monospace', marginLeft:'4px' });

    // ===== 추가 동그라미 =====
    const circleContainer = document.createElement('div');
    Object.assign(circleContainer.style, { display:'flex', alignItems:'center', marginLeft:'6px' });
    let circleStates = GM_getValue(KEY_CIRCLES, [false,false,false]);
    const defaultColor = 'gray';
    const activeColor  = '#90ee90';
    function updateCirclesUI() {
        circleStates.forEach((st,i) => {
            const c = document.getElementById(`arcaExtraCircle${i+1}`);
            c.style.backgroundColor = st? activeColor: defaultColor;
        });
        // 모두 선택되면 자동 OFF
        if (circleStates.every(v=>v)) {
            if (toggleBtn.textContent==='ON') {
                toggleBtn.textContent='OFF';
                GM_setValue(KEY_TOGGLE,'OFF');
                updateToggleColor();
                clearInterval(timerInterval); timerInterval=null;
                GM_setValue(KEY_EXPIRY,0);
                remaining=0; updateDisplay();
            }
            if (toggleBtn2.textContent==='ON') {
                toggleBtn2.textContent='OFF';
                GM_setValue(KEY_TOGGLE2,'OFF');
                updateToggleColor2();
                clearInterval(timerInterval2); timerInterval2=null;
                GM_setValue(KEY_EXPIRY2,0);
                GM_setValue(KEY_STAGE2,1);
                remaining2=0; updateDisplay2();
            }
        }
    }
    function resetCircles() {
        circleStates = [false,false,false];
        GM_setValue(KEY_CIRCLES, circleStates);
        updateCirclesUI();
    }
    for (let i=1;i<=3;i++) {
        const circ = document.createElement('div');
        circ.id = `arcaExtraCircle${i}`;
        Object.assign(circ.style, {
            width:'20px', height:'20px', borderRadius:'50%',
            backgroundColor: defaultColor, margin:'0 4px', cursor:'pointer'
        });
        circ.addEventListener('click', () => {
            circleStates[i-1] = !circleStates[i-1];
            GM_setValue(KEY_CIRCLES, circleStates);
            updateCirclesUI();
        });
        circleContainer.appendChild(circ);
    }

    // UI 삽입
    ctrlLi.append(
        toggleBtn, textInput, statusCircle, timerSpan, separator,
        toggleBtn2, textInput2, timerSpan2, circleContainer
    );
    searchLi.parentNode.insertBefore(ctrlLi, searchLi.nextSibling);

    // 일일 6:00 동그라미 리셋
    function scheduleCircleReset() {
        const now = Date.now();
        const d = new Date();
        const today6 = new Date(d.getFullYear(),d.getMonth(),d.getDate(),6,0,0).getTime();
        const last = GM_getValue(KEY_CIRCLE_RESET,0);
        let next6;
        if (now>=today6) {
            if (last<today6) { resetCircles(); GM_setValue(KEY_CIRCLE_RESET,today6); }
            next6 = today6 + 86400000;
        } else {
            const yest6 = today6 - 86400000;
            if (last<yest6) { resetCircles(); GM_setValue(KEY_CIRCLE_RESET,yest6); }
            next6 = today6;
        }
        setTimeout(()=>{
            resetCircles();
            GM_setValue(KEY_CIRCLE_RESET,next6);
            scheduleCircleReset();
        }, next6-now);
    }

    // ===== 타이머 로직 =====
    let remaining=0, timerInterval=null;
    function formatTime(sec){ const m=String(Math.floor(sec/60)).padStart(2,'0'); const s=String(sec%60).padStart(2,'0'); return `${m}:${s}`;}
    function updateDisplay(){
        timerSpan.textContent = formatTime(remaining);
        statusCircle.style.backgroundColor = (toggleBtn.textContent==='ON'&&remaining>0)?'red':'gray';
    }
    function tick(){ if(toggleBtn.textContent==='ON'&&remaining>0){ remaining--; updateDisplay(); if(remaining<=0){ clearInterval(timerInterval); timerInterval=null; }}}
    function scheduleTick(){ if(!timerInterval) timerInterval=setInterval(tick,1000); }
    function resetTimer(){ if(toggleBtn.textContent!=='ON') return; GM_setValue(KEY_EXPIRY, Date.now()+1800000); initTimerFromExpiry(); }
    function initTimerFromExpiry(){
        const exp=GM_getValue(KEY_EXPIRY,0);
        if(exp&&toggleBtn.textContent==='ON'){ const d=Math.floor((exp-Date.now())/1000); remaining=d>0?d:0; updateDisplay(); if(remaining>0) scheduleTick(); }
        else { remaining=0; updateDisplay(); }
    }

    let remaining2=0, timerInterval2=null, stage2=GM_getValue(KEY_STAGE2,1);
    function updateDisplay2(){ timerSpan2.textContent = formatTime(remaining2); }
    function tick2(){
        if(toggleBtn2.textContent==='ON'&&remaining2>0){
            remaining2--; updateDisplay2();
            if(remaining2<=0){
                clearInterval(timerInterval2); timerInterval2=null;
                if(stage2===1 && !circleStates.every(v=>v)){
                    GM_notification({title:'구멍 초기화',text:'구멍 초기화',timeout:5000});
                    stage2=2; GM_setValue(KEY_STAGE2,stage2);
                }
                remaining2=1800; GM_setValue(KEY_EXPIRY2,Date.now()+remaining2*1000);
                updateDisplay2(); scheduleTick2();
            }
        }
    }
    function scheduleTick2(){ if(!timerInterval2) timerInterval2=setInterval(tick2,1000); }
    function initTimer2FromExpiry(){
        const exp2=GM_getValue(KEY_EXPIRY2,0);
        stage2=GM_getValue(KEY_STAGE2,1);
        if(exp2&&toggleBtn2.textContent==='ON'){
            const d=Math.floor((exp2-Date.now())/1000);
            remaining2=d>0?d:0;
            if(remaining2<=0){ stage2=2; GM_setValue(KEY_STAGE2,stage2); remaining2=1800; }
            updateDisplay2(); if(remaining2>0) scheduleTick2();
        } else { remaining2=0; stage2=1; GM_setValue(KEY_STAGE2,stage2); updateDisplay2(); }
    }

    function getNotified(){ return GM_getValue(KEY_NOTIFIED,[]); }
    function addNotified(id){ const a=getNotified(); a.push(id); GM_setValue(KEY_NOTIFIED,a); }
    function checkNewPosts(){
        if(toggleBtn.textContent!=='ON') return;
        if(circleStates.every(v=>v)) return;
        const kw=textInput.value.trim(); if(!kw) return;
        fetch('https://arca.live/b/mabimobile')
            .then(r=>r.text())
            .then(html=>{
                const doc=new DOMParser().parseFromString(html,'text/html');
                doc.querySelectorAll('.list-table a.vrow.column').forEach(row=>{
                    const idN=row.querySelector('.vcol.col-id span');
                    if(!idN) return;
                    const id=idN.textContent.trim();
                    if(!id||getNotified().includes(id)) return;
                    const bd=row.querySelector('span.badge.badge-success');
                    if(!bd||bd.textContent.trim()!=='심층제보') return;
                    const te=row.querySelector('span.title');
                    if(!te) return;
                    const title=te.textContent.trim();
                    if(!title.includes(kw)) return;
                    GM_notification({title:'심층제보 알리미',text:`새 심층제보: ${title} (ID: ${id})`,timeout:5000});
                    addNotified(id);
                    if(remaining===0) resetTimer();
                });
            }).catch(console.error);
    }

    // 초기화
    updateCirclesUI();
    scheduleCircleReset();
    initTimerFromExpiry();
    initTimer2FromExpiry();
    checkNewPosts();
    setInterval(checkNewPosts,30000);

})();
