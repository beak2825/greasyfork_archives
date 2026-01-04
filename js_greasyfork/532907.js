// ==UserScript==
// @name         Mobile Element Selector
// @author       ZNJXL
// @version      1.6
// @namespace    http://tampermonkey.net/
// @description  모바일 요소 선택기 
// @match        *://*/*
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532907/Mobile%20Element%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/532907/Mobile%20Element%20Selector.meta.js
// ==/UserScript==

(async function() { 'use strict'; const SCRIPT_ID = "[MES v1.4.x]";

// --- 기본 설정 값 정의 ---
const DEFAULT_SETTINGS = {
    includeSiteName: true,
    buttonSizeScale: 1.0,
    panelOpacity: 0.95,
    toggleSizeScale: 1.0,
    toggleOpacity: 1.0,
    showAdguardLogo: false
};

// --- 설정 값 로드 및 검증 ---
let includeSiteName, buttonSizeScale, panelOpacity, toggleSizeScale, toggleOpacity, showAdguardLogo;
try {
    includeSiteName    = await GM_getValue('includeSiteName', DEFAULT_SETTINGS.includeSiteName);
    buttonSizeScale    = parseFloat(await GM_getValue('buttonSizeScale', DEFAULT_SETTINGS.buttonSizeScale));
    panelOpacity       = parseFloat(await GM_getValue('panelOpacity', DEFAULT_SETTINGS.panelOpacity));
    toggleSizeScale    = parseFloat(await GM_getValue('toggleSizeScale', DEFAULT_SETTINGS.toggleSizeScale));
    toggleOpacity      = parseFloat(await GM_getValue('toggleOpacity', DEFAULT_SETTINGS.toggleOpacity));
    showAdguardLogo  = await GM_getValue('showAdguardLogo', DEFAULT_SETTINGS.showAdguardLogo);

    if (isNaN(buttonSizeScale) || buttonSizeScale < 0.5 || buttonSizeScale > 2.0) buttonSizeScale = DEFAULT_SETTINGS.buttonSizeScale;
    if (isNaN(panelOpacity)    || panelOpacity    < 0.1 || panelOpacity    > 1.0) panelOpacity    = DEFAULT_SETTINGS.panelOpacity;
    if (isNaN(toggleSizeScale) || toggleSizeScale < 0.5 || toggleSizeScale > 2.0) toggleSizeScale = DEFAULT_SETTINGS.toggleSizeScale;
    if (isNaN(toggleOpacity)   || toggleOpacity   < 0.1 || toggleOpacity   > 1.0) toggleOpacity   = DEFAULT_SETTINGS.toggleOpacity;

} catch(e) {
    includeSiteName = DEFAULT_SETTINGS.includeSiteName;
    buttonSizeScale = DEFAULT_SETTINGS.buttonSizeScale;
    panelOpacity    = DEFAULT_SETTINGS.panelOpacity;
    toggleSizeScale = DEFAULT_SETTINGS.toggleSizeScale;
    toggleOpacity   = DEFAULT_SETTINGS.toggleOpacity;
    showAdguardLogo = DEFAULT_SETTINGS.showAdguardLogo;
}

const BLOCKED_SELECTORS_KEY = 'mobileBlockedSelectors';

// --- CSS 정의 ---
const style = document.createElement('style');
style.textContent = `
:root {
    --panel-opacity: ${panelOpacity};
    --btn-padding: ${10 * buttonSizeScale}px;
    --btn-font-size: ${14 * buttonSizeScale}px;
    --btn-min-width: ${80 * buttonSizeScale}px;
    --toggle-size: ${40 * toggleSizeScale}px;
    --toggle-opacity: ${toggleOpacity};
}
.mobile-block-ui {
    z-index: 9999 !important; touch-action: manipulation !important; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-sizing: border-box; position: fixed !important; visibility: visible !important;
}
#mobile-block-panel, #mobile-settings-panel, #mobile-blocklist-panel { opacity: var(--panel-opacity) !important; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.mb-slider { width: 100%; margin: 10px 0; -webkit-appearance: none; appearance: none; background: #555; height: 8px; border-radius: 5px; outline: none; cursor: pointer; }
.mb-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #4CAF50; border-radius: 50%; cursor: pointer; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
.mb-slider::-moz-range-thumb { width: 20px; height: 20px; background: #4CAF50; border-radius: 50%; cursor: pointer; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
.selected-element { background-color: rgba(255, 0, 0, 0.3) !important; outline: 1px dashed red !important; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.1); z-index: 9998 !important; transition: background-color 0.1s ease, outline 0.1s ease, box-shadow 0.1s ease; }
#mobile-block-panel { bottom: 15px; left: 50%; transform: translateX(-50%); width: calc(100% - 30px); max-width: 350px; background: rgba(40, 40, 40, 0.95); color: #eee; padding: 15px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.6); z-index: 10001 !important; border-top: 1px solid rgba(255, 255, 255, 0.1); display: none; }
#mobile-settings-panel { top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 40px); max-width: 300px; background: rgba(50, 50, 50, 0.95); color: #eee; padding: 20px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.7); z-index: 10003 !important; border: 1px solid rgba(255, 255, 255, 0.15); display: none; }
#mobile-block-toggleBtn {
    top: 15px !important;
    left: 15px !important;
    z-index: 10002 !important;
    background: rgba(0,0,0,var(--toggle-opacity)) !important;
    width: var(--toggle-size) !important;
    height: var(--toggle-size) !important;
    border-radius: 50% !important;
    border: none !important;
    cursor: pointer !important;
    font-size: 0 !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
    transition: background 0.3s ease, transform 0.2s ease;
    display: flex !important; /* Ensure flexbox for centering */
    align-items: center !important; /* Center vertically */
    justify-content: center !important; /* Center horizontally */
    opacity: 1 !important;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    position: fixed !important; /* Ensure it's fixed relative to the viewport */
    overflow: hidden !important; /* Ensure logo fits within the circle */
    line-height: 0 !important; /* Prevent extra space for text */
}
#mobile-block-toggleBtn:active { transform: scale(0.9); }
#mobile-block-toggleBtn.selecting { background: rgba(255,87,34,0.8) !important; }
#mobile-block-toggleBtn .button-plus {
    font-size: 24px !important;
    color: #fff !important;
    line-height: var(--toggle-size) !important; /* Vertically center the plus sign */
}
#mobile-block-toggleBtn .adguard-logo {
    display: block;
    width: 60%;
    height: 60%;
    margin: auto;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    line-height: 1;
}
.mb-btn { padding: var(--btn-padding); border: none; border-radius: 8px; color: #fff; font-size: var(--btn-font-size); cursor: pointer; transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease; background-color: #555; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2); min-width: var(--btn-min-width); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; opacity: 1 !important; }
.mb-btn:active { transform: scale(0.97); box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
#blocker-copy { background: linear-gradient(145deg, #2196F3, #1976D2); } #blocker-preview { background: linear-gradient(145deg, #ff9800, #f57c00); } #blocker-add-block { background: linear-gradient(145deg, #f44336, #c62828); } #blocker-settings { background: linear-gradient(145deg, #9C27B0, #7B1FA2); } #blocker-cancel { background: linear-gradient(145deg, #607D8B, #455A64); } #settings-close { background: linear-gradient(145deg, #607D8B, #455A64); margin-top: 15px; width: 100%; } #settings-toggle-site { background: linear-gradient(145deg, #009688, #00796B); } #blocker-list { background: linear-gradient(145deg, #00BCD4, #0097A7); } #blocklist-close { background: linear-gradient(145deg, #607D8B, #455A64); margin-top: 10px; width: 100%; }
.button-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(var(--btn-min-width), 1fr)); gap: 8px; margin-top: 15px; } #blocker-info-wrapper { position: relative; margin-bottom: 10px; } #blocker-info { display: block; color: #90ee90; font-size: 13px; line-height: 1.4; background-color: rgba(0,0,0,0.3); padding: 5px 8px; border-radius: 4px; word-break: break-all; min-height: 1.4em; } .settings-item { margin-bottom: 15px; } .settings-item label { display: block; font-size: 13px; color: #ccc; margin-bottom: 5px; } .settings-value { float: right; color: #fff; font-weight: bold; }
#mobile-blocklist-panel { position: fixed !important; top: 50%; left: 50%; transform: translate(-50%, -50%); width: calc(100% - 40px); max-width: 300px; background: rgba(50,50,50, var(--panel-opacity)) !important; color: #eee; padding: 15px; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.7); z-index: 10004 !important; display: none; }
.blocklist-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.blocklist-item span { flex:1; word-break: break-all; }
.blocklist-btn { margin-left: 5px; }
`;
document.head.appendChild(style);

// --- 전역 변수 ---
let selecting = false;
let selectedEl = null;
let initialTouchedElement = null;
let touchStartX=0, touchStartY=0, touchMoved=false;
const moveThreshold = 10;

// --- 함수: 차단목록 불러오기/저장 ---
async function loadBlockedSelectors() {
    const stored = await GM_getValue(BLOCKED_SELECTORS_KEY, '[]');
    try { return JSON.parse(stored); } catch(e){ await GM_setValue(BLOCKED_SELECTORS_KEY,'[]'); return []; }
}
async function saveBlockedSelectors(list) {
    await GM_setValue(BLOCKED_SELECTORS_KEY, JSON.stringify(list));
}

// --- 함수: 차단 목록에 있는 요소 숨기기 ---
async function applyBlocking() {
    const blockedSelectors = await loadBlockedSelectors();
    blockedSelectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        } catch (e) {
            console.error("Error applying block rule:", selector, e);
        }
    });
}

// --- UI 요소 생성 ---
let panel, settingsPanel, toggleBtn, listPanel;
function createUIElements() {
    // 메인 패널
    panel = document.createElement('div'); panel.id='mobile-block-panel'; panel.className='mobile-block-ui'; panel.style.display='none';
    panel.innerHTML = `
        <div id="blocker-info-wrapper"><span style="font-size: 12px; color: #ccc;">선택된 요소:</span><span id="blocker-info">없음</span></div>
        <input type="range" id="blocker-slider" class="mb-slider" min="0" max="10" value="0">
        <div class="button-grid">
            <button id="blocker-copy" class="mb-btn">복사</button>
            <button id="blocker-preview" class="mb-btn">미리보기</button>
            <button id="blocker-add-block" class="mb-btn">저장</button>
            <button id="blocker-list" class="mb-btn">저장된 목록</button>
            <button id="blocker-settings" class="mb-btn">설정</button>
            <button id="blocker-cancel" class="mb-btn">취소</button>
        </div>`;
    document.body.appendChild(panel);

    // 차단목록 패널
    listPanel = document.createElement('div'); listPanel.id='mobile-blocklist-panel'; listPanel.className='mobile-block-ui';
    listPanel.innerHTML = `
        <h3 style="margin-top:0; color: #fff; text-align: center;">차단목록</h3>
        <div id="blocklist-container"></div>
        <button id="blocklist-close" class="mb-btn" style="width:100%;margin-top:10px;">닫기</button>
    `;
    document.body.appendChild(listPanel);

    // 설정 패널 (기존 + AdGuard 로고 설정 추가)
    settingsPanel=document.createElement('div'); settingsPanel.id='mobile-settings-panel'; settingsPanel.className='mobile-block-ui'; settingsPanel.style.display='none';
    settingsPanel.innerHTML = `
        <h3 style="text-align:center; color: #fff; margin-top: 0; margin-bottom: 20px;">설정</h3>
        <div class="settings-item"><label for="settings-toggle-site">사이트명 포함 규칙: <button id="settings-toggle-site" class="mb-btn">${includeSiteName?"ON":"OFF"}</button></label></div>
        <div class="settings-item"><label for="settings-button-size">UI 크기: <span id="button-size-value" class="settings-value">${buttonSizeScale.toFixed(1)}x</span></label><input id="settings-button-size" type="range" class="mb-slider" min="0.8" max="1.5" step="0.1" value="${buttonSizeScale}"></div>
        <div class="settings-item"><label for="settings-panel-opacity">패널 투명도: <span id="opacity-value" class="settings-value">${panelOpacity.toFixed(2)}</span></label><input id="settings-panel-opacity" type="range" class="mb-slider" min="0.1" max="1.0" step="0.05" value="${panelOpacity}"></div>
        <div class="settings-item"><label for="settings-toggle-size">토글 버튼 크기: <span id="toggle-size-value" class="settings-value">${toggleSizeScale.toFixed(1)}x</span></label><input id="settings-toggle-size" type="range" class="mb-slider" min="0.5" max="2.0" step="0.1" value="${toggleSizeScale}"></div>
        <div class="settings-item"><label for="settings-toggle-opacity">토글 투명도: <span id="toggle-opacity-value" class="settings-value">${toggleOpacity.toFixed(2)}</span></label><input id="settings-toggle-opacity" type="range" class="mb-slider" min="0.1" max="1.0" step="0.05" value="${toggleOpacity}"></div>
        <div class="settings-item"><label for="settings-adguard-logo">AdGuard 로고: <button id="settings-adguard-logo" class="mb-btn">${showAdguardLogo?"ON":"OFF"}</button></label></div>
        <button id="settings-close" class="mb-btn" style="width:100%;margin-top:15px;">닫기</button>
    `;
    document.body.appendChild(settingsPanel);

    // 토글 버튼
    toggleBtn=document.createElement('button'); toggleBtn.id='mobile-block-toggleBtn'; toggleBtn.className='mobile-block-ui';
    if (showAdguardLogo) {
        toggleBtn.innerHTML='<span class="adguard-logo">AG</span>';
    } else {
        toggleBtn.innerHTML='<span class="button-plus">+</span>';
    }
    document.body.appendChild(toggleBtn);

    initRefs();
    applyBlocking(); // 초기 로드시 차단 목록 적용
}

// --- 초기화: 참조 및 이벤트 ---
function initRefs() {
    // panel refs
    const info=panel.querySelector('#blocker-info');
    const slider=panel.querySelector('#blocker-slider');
    const copyBtn=panel.querySelector('#blocker-copy');
    const previewBtn=panel.querySelector('#blocker-preview');
    const addBtn=panel.querySelector('#blocker-add-block');
    const listBtn=panel.querySelector('#blocker-list');
    const settingsBtn=panel.querySelector('#blocker-settings');
    const cancelBtn=panel.querySelector('#blocker-cancel');
    // list panel refs
    const listContainer=listPanel.querySelector('#blocklist-container');
    const listClose=listPanel.querySelector('#blocklist-close');
    // settings refs
    const toggleSite=settingsPanel.querySelector('#settings-toggle-site');
    const btnSizeSlider=settingsPanel.querySelector('#settings-button-size');
    const panelOpacitySlider=settingsPanel.querySelector('#settings-panel-opacity');
    const toggleSizeSlider=settingsPanel.querySelector('#settings-toggle-size');
    const toggleOpacitySlider=settingsPanel.querySelector('#settings-toggle-opacity');
    const btnSizeValue=settingsPanel.querySelector('#button-size-value');
    const panelOpacityValue=settingsPanel.querySelector('#opacity-value');
    const toggleSizeValue=settingsPanel.querySelector('#toggle-size-value');
    const toggleOpacityValue=settingsPanel.querySelector('#toggle-opacity-value');
    const settingsClose=settingsPanel.querySelector('#settings-close');
    const adguardLogoToggle = settingsPanel.querySelector('#settings-adguard-logo');

    // 이벤트: 차단목록 버튼
    listBtn.addEventListener('click', showList);
    listClose.addEventListener('click', () => { listPanel.style.display='none'; });

    // render 목록
    async function showList() {
        const arr=await loadBlockedSelectors();
        listContainer.innerHTML='';
        arr.forEach((rule,i)=>{
            const item=document.createElement('div'); item.className='blocklist-item';
            const span=document.createElement('span'); span.textContent=rule;
            const del=document.createElement('button'); del.className='mb-btn blocklist-btn'; del.textContent='삭제';
            const cp =document.createElement('button'); cp.className='mb-btn blocklist-btn'; cp.textContent='복사';
            del.addEventListener('click', async()=>{
                arr.splice(i,1); await saveBlockedSelectors(arr); showList(); applyBlocking(); // 삭제 후 차단 다시 적용
            });
            cp.addEventListener('click', ()=>{ GM_setClipboard(rule); alert('복사됨: '+rule); });
            item.append(span, del, cp); listContainer.append(item);
        });
        listPanel.style.display='block';
    }

    // 설정 이벤트
    toggleSite.addEventListener('click', async()=>{
        includeSiteName = !includeSiteName;
        toggleSite.textContent = includeSiteName?'ON':'OFF';
        await GM_setValue('includeSiteName', includeSiteName);
    });
    btnSizeSlider.addEventListener('input', async e=>{
        buttonSizeScale=parseFloat(e.target.value);
        btnSizeValue.textContent=buttonSizeScale.toFixed(1)+'x';
        document.documentElement.style.setProperty('--btn-padding', `${10*buttonSizeScale}px`);
        document.documentElement.style.setProperty('--btn-font-size', `${14*buttonSizeScale}px`);
        await GM_setValue('buttonSizeScale', buttonSizeScale);
    });
    panelOpacitySlider.addEventListener('input', async e=>{
        panelOpacity=parseFloat(e.target.value);
        panelOpacityValue.textContent=panelOpacity.toFixed(2);
        document.documentElement.style.setProperty('--panel-opacity', panelOpacity);
        await GM_setValue('panelOpacity', panelOpacity);
    });
    toggleSizeSlider.addEventListener('input', async e=>{
        toggleSizeScale=parseFloat(e.target.value);
        toggleSizeValue.textContent=toggleSizeScale.toFixed(1)+'x';
        document.documentElement.style.setProperty('--toggle-size', `${40*toggleSizeScale}px`);
        await GM_setValue('toggleSizeScale', toggleSizeScale);
    });
    toggleOpacitySlider.addEventListener('input', async e=>{
        toggleOpacity=parseFloat(e.target.value);
        toggleOpacityValue.textContent=toggleOpacity.toFixed(2);
        document.documentElement.style.setProperty('--toggle-opacity', toggleOpacity);
        await GM_setValue('toggleOpacity', toggleOpacity);
    });
    settingsClose.addEventListener('click', ()=>{ settingsPanel.style.display='none'; });

    adguardLogoToggle.addEventListener('click', async () => {
        showAdguardLogo = !showAdguardLogo;
        adguardLogoToggle.textContent = showAdguardLogo ? 'ON' : 'OFF';
        await GM_setValue('showAdguardLogo', showAdguardLogo);
        if (toggleBtn) {
            if (showAdguardLogo) {
                toggleBtn.innerHTML = '<span class="adguard-logo">AG</span>';
            } else {
                toggleBtn.innerHTML = '<span class="button-plus">+</span>';
            }
        }
    });

    // 기타: 토글, 선택 등 기존 로직 연결...
    document.addEventListener('touchstart', e => { if (!selecting) return; const isUIElement = e.target.closest('.mobile-block-ui'); if (isUIElement) return; const touch = e.touches[0]; touchStartX = touch.clientX; touchStartY = touch.clientY; touchMoved = false; }, { passive: true });
    document.addEventListener('touchmove', e => { if (!selecting || touchMoved) return; const isUIElement = e.target.closest('.mobile-block-ui'); if (isUIElement || !e.touches[0]) return; const touch = e.touches[0]; const dx = touch.clientX - touchStartX; const dy = touch.clientY - touchStartY; if (Math.sqrt(dx * dx + dy * dy) > moveThreshold) { touchMoved = true; if (selectedEl) selectedEl.classList.remove('selected-element'); } }, { passive: true });
    document.addEventListener('touchend', e => { if (!selecting) return; const isUIElement = e.target.closest('.mobile-block-ui'); if (isUIElement) return; if (touchMoved) { touchMoved = false; if (selectedEl) selectedEl.classList.add('selected-element'); return; } try { e.preventDefault(); e.stopImmediatePropagation(); } catch (err) {} const touch = e.changedTouches[0]; if (!touch) return; const targetEl = document.elementFromPoint(touch.clientX, touch.clientY); if (targetEl && !targetEl.closest('.mobile-block-ui') && targetEl !== document.body && targetEl !== document.documentElement) { removeSelectionHighlight(); resetPreview(); selectedEl = targetEl; initialTouchedElement = targetEl; selectedEl.classList.add('selected-element'); if (panel && panel.querySelector('#blocker-slider')) panel.querySelector('#blocker-slider').value = 0; updateInfo(); } else { removeSelectionHighlight(); resetPreview(); updateInfo(); } }, { capture: true, passive: false });

    if (panel && panel.querySelector('#blocker-slider')) panel.querySelector('#blocker-slider').addEventListener('input', (e) => { if (!initialTouchedElement) return; resetPreview(); const level = parseInt(e.target.value, 10); let current = initialTouchedElement; for (let i = 0; i < level && current.parentElement; i++) { if (['body', 'html'].includes(current.parentElement.tagName.toLowerCase()) || current.parentElement.closest('.mobile-block-ui')) break; current = current.parentElement; } if (selectedEl !== current) { if (selectedEl) selectedEl.classList.remove('selected-element'); selectedEl = current; selectedEl.classList.add('selected-element'); updateInfo(); } });
    if (panel && panel.querySelector('#blocker-copy')) panel.querySelector('#blocker-copy').addEventListener('click', () => { if (!selectedEl) { alert('선택된 요소가 없습니다.'); return; } const selector = generateSelector(selectedEl); if (!selector) { alert('❌ 유효한 선택자를 생성할 수 없습니다.'); return; } let finalSelector = "##" + selector; if (includeSiteName) finalSelector = location.hostname + finalSelector; try { GM_setClipboard(finalSelector); alert('✅ 선택자가 복사되었습니다!\n' + finalSelector); } catch (err) { alert("❌ 클립보드 복사에 실패했습니다."); prompt("선택자를 직접 복사하세요:", finalSelector); } });
    if (panel && panel.querySelector('#blocker-preview')) panel.querySelector('#blocker-preview').addEventListener('click', () => { if (!selectedEl) { alert('선택된 요소가 없습니다.'); return; } if (!isPreviewHidden) { if (window.getComputedStyle(selectedEl).display === 'none') { alert('이미 숨겨진 요소입니다.'); return; } selectedEl.dataset._original_display = selectedEl.style.display || ''; selectedEl.style.display = 'none'; panel.querySelector('#blocker-preview').textContent = '되돌리기'; isPreviewHidden = true; previewedElement = selectedEl; selectedEl.classList.remove('selected-element'); } else if (previewedElement === selectedEl) { try { selectedEl.style.display = selectedEl.dataset._original_display || ''; delete selectedEl.dataset._original_display; } catch(e) {} panel.querySelector('#blocker-preview').textContent = '미리보기'; isPreviewHidden = false; previewedElement = null; selectedEl.classList.add('selected-element'); } else { alert('다른 요소가 선택되었습니다. 먼저 해당 요소의 미리보기를 되돌리거나 선택을 취소하세요.'); } });
    if (panel && panel.querySelector('#blocker-add-block')) panel.querySelector('#blocker-add-block').addEventListener('click', async () => { if (!selectedEl) { alert('선택된 요소가 없습니다.'); return; } const selector = generateSelector(selectedEl); if (!selector) { alert('❌ 유효한 선택자를 생성할 수 없습니다.'); return; } const result = await addBlockRule(selector); if (result.success) { alert(`✅ 선택된 요소가 차단되어 차단 목록으로 이동했습니다.`); applyBlocking(); } else { alert(`ℹ️ ${result.message}`); } });
    if (panel && panel.querySelector('#blocker-settings')) panel.querySelector('#blocker-settings').addEventListener('click', () => { settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block'; });
    if (panel && panel.querySelector('#blocker-cancel')) panel.querySelector('#blocker-cancel').addEventListener('click', () => { setBlockMode(false); });
    if (toggleBtn) toggleBtn.addEventListener('click', () => { setBlockMode(!selecting); });

    function setBlockMode(enabled) { if (!toggleBtn || !panel || !settingsPanel) return; selecting = enabled; toggleBtn.classList.toggle('selecting', enabled); panel.style.display = enabled ? 'block' : 'none'; settingsPanel.style.display = 'none'; listPanel.style.display = 'none'; if (!enabled) { removeSelectionHighlight(); resetPreview(); } if (panel && panel.querySelector('#blocker-slider')) panel.querySelector('#blocker-slider').value = 0; updateInfo(); }
    function removeSelectionHighlight() { if (selectedEl) { selectedEl.classList.remove('selected-element'); selectedEl = null; initialTouchedElement = null; } }
    let isPreviewHidden = false; let previewedElement = null; function resetPreview() { if (isPreviewHidden && previewedElement) { try { previewedElement.style.display = previewedElement.dataset._original_display || ''; delete previewedElement.dataset._original_display; } catch (e) {} if (panel && panel.querySelector('#blocker-preview')) panel.querySelector('#blocker-preview').textContent = '미리보기'; isPreviewHidden = false; previewedElement = null; } else if (panel && panel.querySelector('#blocker-preview')) { panel.querySelector('#blocker-preview').textContent = '미리보기'; } }
    function updateInfo() { if (panel && panel.querySelector('#blocker-info')) { panel.querySelector('#blocker-info').textContent = selectedEl ? generateSelector(selectedEl) : '없음'; } }
    function generateSelector(el) { if (!el || el.nodeType !== 1 || el.closest('.mobile-block-ui')) return ''; const parts = []; let current = el; const maxDepth = 7; let depth = 0; while (current && current.tagName && current.tagName.toLowerCase() !== 'body' && current.tagName.toLowerCase() !== 'html' && depth < maxDepth) { const parent = current.parentElement; if (current.classList.contains('mobile-block-ui')) { current = parent; continue; } const tagName = current.tagName.toLowerCase(); let selectorPart = tagName; if (current.id && !/\d/.test(current.id)) { try { selectorPart = `#${CSS.escape(current.id)}`; parts.unshift(selectorPart); depth++; break; } catch (e) {} } if (!selectorPart.startsWith('#')) { const classes = Array.from(current.classList).filter(c => c && !c.startsWith('ember-') && !c.startsWith('react-') && !/^[a-zA-Z]{1,2}$/.test(c) && !/\d/.test(c.substring(0,1)) && !['selected-element', 'mobile-block-ui'].includes(c)); if (classes.length > 0) { try { selectorPart += '.' + classes.map(c => CSS.escape(c)).join('.'); } catch (e) {} } else if (parent && !parent.closest('.mobile-block-ui')) { const siblings = Array.from(parent.children).filter(sibling => !sibling.classList.contains('mobile-block-ui')); let sameTagIndex = 0; let currentIndex = -1; for (let i = 0; i < siblings.length; i++) { if (siblings[i].tagName === current.tagName) { sameTagIndex++; if (siblings[i] === current) { currentIndex = sameTagIndex; } } } if (currentIndex > 0 && sameTagIndex > 1) { selectorPart = `${tagName}:nth-of-type(${currentIndex})`; } } } parts.unshift(selectorPart); depth++; if (!parent || parent.tagName.toLowerCase() === 'body' || parent.tagName.toLowerCase() === 'html') break; current = parent; } let finalSelector = parts.join(' > '); const lastIdIndex = finalSelector.lastIndexOf('#'); if (lastIdIndex > 0) { finalSelector = finalSelector.substring(lastIdIndex); } else if (finalSelector.length > 150) { finalSelector = parts.slice(-2).join(' > '); } if (!finalSelector || finalSelector === 'body' || finalSelector === 'html') return ''; return finalSelector; }
    async function loadBlockedSelectors() { const stored = await GM_getValue(BLOCKED_SELECTORS_KEY, '[]'); try { return JSON.parse(stored); } catch(e){ await GM_setValue(BLOCKED_SELECTORS_KEY,'[]'); return []; } }
    async function saveBlockedSelectors(selectors) { const selectorsToSave = Array.isArray(selectors) ? selectors : []; await GM_setValue(BLOCKED_SELECTORS_KEY, JSON.stringify(selectorsToSave)); }
    async function addBlockRule(selector) { if (!selector) return { success: false, message: '유효하지 않은 선택자입니다.' }; let fullSelector = "##" + selector; if (includeSiteName) { const hostname = location.hostname; if (!hostname) return { success: false, message: '호스트 이름을 가져올 수 없습니다.'}; fullSelector = hostname + fullSelector; } const blockedSelectors = await loadBlockedSelectors(); if (!blockedSelectors.includes(fullSelector)) { blockedSelectors.push(fullSelector); await saveBlockedSelectors(blockedSelectors); return { success: true, rule: fullSelector }; } return { success: false, message: '이미 저장된 규칙입니다.' }; }

    function makeDraggable(el) { if (!el) return; let startX, startY, dragStartX, dragStartY; let dragging = false, moved = false; let initialTransform = ''; const handleTouchStart = (e) => { const targetTag = e.target.tagName.toLowerCase(); if (['input', 'button', 'textarea', 'select'].includes(targetTag) || e.target.closest('.mb-btn, .mb-slider')) return; if (dragging) return; dragging = true; moved = false; const touch = e.touches[0]; startX = touch.clientX; startY = touch.clientY; const computedStyle = window.getComputedStyle(el); dragStartX = parseFloat(computedStyle.left) || 0; dragStartY = parseFloat(computedStyle.top) || 0; initialTransform = computedStyle.transform !== 'none' ? computedStyle.transform : ''; el.style.transition = 'none'; }; const handleTouchMove = (e) => { if (!dragging) return; const touch = e.touches[0]; const dx = touch.clientX - startX; const dy = touch.clientY - startY; if (!moved && Math.sqrt(dx * dx + dy * dy) > 10) { moved = true; if (initialTransform) { el.style.transform = 'none'; } try { e.preventDefault(); } catch {} } if (moved) { let newX = dragStartX + dx; let newY = dragStartY + dy; const elWidth = el.offsetWidth; const elHeight = el.offsetHeight; const parentWidth = window.innerWidth; const parentHeight = window.innerHeight; newX = Math.max(0, Math.min(newX, parentWidth - elWidth)); newY = Math.max(0, Math.min(newY, parentHeight - elHeight)); el.style.left = newX + 'px'; el.style.top = newY + 'px'; el.style.right = 'auto'; el.style.bottom = 'auto'; } }; const handleTouchEnd = (e) => { if (!dragging) return; dragging = false; el.style.transition = ''; if (moved) { try { e.preventDefault(); e.stopPropagation(); } catch {} } }; el.addEventListener('touchstart', handleTouchStart, { passive: true }); el.addEventListener('touchmove', handleTouchMove, { passive: false }); el.addEventListener('touchend', handleTouchEnd, { passive: false }); el.addEventListener('touchcancel', handleTouchEnd, { passive: false }); }

    makeDraggable(panel);
    makeDraggable(settingsPanel);
    makeDraggable(toggleBtn);
    makeDraggable(listPanel);

}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUIElements);
else createUIElements();

})();