// ==UserScript==
// @name         Mobile Element Selector
// @author       ZNJXL
// @version      2
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

(function() {
    'use strict';

    let isSelecting = false;
    let selectedElement = null;
    let elementHistory = [];
    let hiddenElements = new Map(); // 숨겨진 요소 관리

    let config = JSON.parse(localStorage.getItem('ag_selector_config')) || {
        themeColor: '#2ecc71',
        uiOpacity: 0.95,
        btnOpacity: 1.0,
        overlayOpacity: 0.2,
        uiScale: 1.0,
        btnScale: 1.0,
        showLogo: true,
        btnPosition: 'right'
    };

    const inactiveColor = '#888888';
    const getLogo = (color) => `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:60%; height:60%;"><path d="M12 2L4 5V11C4 16.1 7.4 20.9 12 22C16.6 20.9 20 16.1 20 11V5L12 2Z" fill="white"/><path d="M10 15.5L6.5 12L7.9 10.6L10 12.7L16.1 6.6L17.5 8L10 15.5Z" fill="${color}" id="ag-svg-check"/></svg>`;

    function createUI() {
        if (document.getElementById('ag-selector-container')) return;

        const container = document.createElement('div');
        container.id = 'ag-selector-container';
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.id = 'ag-main-style';
        document.head.appendChild(style);

        const updateStyles = () => {
            const bSize = Math.max(40, 60 * config.btnScale);
            const currentBtnColor = isSelecting ? config.themeColor : inactiveColor;
            
            style.innerHTML = `
                #ag-selector-btn { 
                    position: fixed !important; bottom: 30px !important; ${config.btnPosition}: 30px !important; 
                    z-index: 2147483647 !important; width: ${bSize}px !important; height: ${bSize}px !important;
                    border-radius: 50% !important; background: ${currentBtnColor} !important; 
                    border: 2.5px solid white !important; box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important; 
                    display: flex !important; align-items: center !important; justify-content: center !important; 
                    opacity: ${config.btnOpacity} !important; cursor: pointer !important; transition: all 0.3s;
                }
                .ag-logo-box { display: ${config.showLogo ? 'flex' : 'none'}; width: 100%; height: 100%; align-items: center; justify-content: center; pointer-events: none; }
                
                #ag-toolbar { 
                    position: fixed !important; bottom: 110px !important; left: 50% !important; 
                    transform: translateX(-50%) scale(${config.uiScale}) !important; 
                    display: ${isSelecting ? 'flex' : 'none'}; 
                    background: rgba(45, 45, 45, ${config.uiOpacity}); backdrop-filter: blur(10px); color: white; 
                    padding: 0 20px !important; height: 50px !important; border-radius: 12px; 
                    z-index: 2147483647 !important; gap: 18px; align-items: center; border: 1px solid rgba(255,255,255,0.1);
                }
                #ag-toolbar span { cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; opacity: 0.8; transition: 0.2s; user-select: none; }
                #ag-toolbar span:hover { opacity: 1; }

                #ag-settings-panel {
                    position: fixed !important; top: 50% !important; left: 50% !important; 
                    transform: translate(-50%, -50%) scale(${config.uiScale}) !important;
                    background: rgba(255, 255, 255, ${config.uiOpacity}) !important; backdrop-filter: blur(15px); color: #333 !important; 
                    padding: 25px !important; border-radius: 24px !important; z-index: 2147483648 !important; 
                    display: none; width: 280px !important; box-shadow: 0 20px 50px rgba(0,0,0,0.4);
                }
                .s-item { margin-bottom: 12px; }
                .s-label { font-size: 11px; font-weight: bold; color: #666; display: block; margin-bottom: 4px; }
                input[type="range"] { width: 100%; accent-color: ${config.themeColor}; }

                #ag-highlight { 
                    position: absolute !important; border: 2px solid ${config.themeColor}; 
                    pointer-events: none; z-index: 2147483646 !important; display: none;
                    background: ${config.themeColor}${Math.floor(config.overlayOpacity * 255).toString(16).padStart(2, '0')};
                }
                #ag-info-label { 
                    position: absolute; top: 100%; left: 0; background: ${config.themeColor}; 
                    color: white; padding: 2px 8px; font-size: 12px; font-weight: bold; 
                    border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; white-space: nowrap;
                }
            `;
        };
        updateStyles();

        container.innerHTML = `
            <div id="ag-selector-btn"><div class="ag-logo-box">${getLogo(inactiveColor)}</div></div>
            <div id="ag-overlay" style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483645;display:none;background:transparent;"></div>
            <div id="ag-highlight"><div id="ag-info-label"></div></div>
            <div id="ag-toolbar">
                <span id="ag-close">✕</span>
                <span id="ag-down">－</span>
                <span id="ag-up">＋</span>
                <span id="ag-toggle-vis">👁</span> <span id="ag-settings">⚙</span>
                <span id="ag-save" style="color:${config.themeColor}; font-weight:bold; font-size:22px;">✔</span>
            </div>
            <div id="ag-settings-panel">
                <h3 style="margin:0 0 15px 0; text-align: center; font-size: 16px;">⚙ 설정</h3>
                <div class="s-item"><label class="s-label">툴바 투명도</label><input type="range" id="input-ui-op" min="0.2" max="1.0" step="0.05" value="${config.uiOpacity}"></div>
                <div class="s-item"><label class="s-label">버튼 투명도</label><input type="range" id="input-btn-op" min="0.2" max="1.0" step="0.05" value="${config.btnOpacity}"></div>
                <div class="s-item"><label class="s-label">테마 색상</label><input type="color" id="input-color" value="${config.themeColor}" style="width:100%; height:25px; border:none; background:none;"></div>
                <button id="ag-settings-done" style="width:100%; background:${config.themeColor}; color:white; border:none; padding:10px; border-radius:12px; font-weight:bold; margin-top:5px;">저장 및 닫기</button>
            </div>
        `;

        const btn = container.querySelector('#ag-selector-btn');
        const overlay = container.querySelector('#ag-overlay');
        const highlight = container.querySelector('#ag-highlight');
        const label = container.querySelector('#ag-info-label');
        const toolbar = container.querySelector('#ag-toolbar');

        // --- 숨기기/보이기 기능 로직 ---
        container.querySelector('#ag-toggle-vis').onclick = () => {
            if (!selectedElement) return;
            
            if (selectedElement.style.display === 'none') {
                selectedElement.style.display = hiddenElements.get(selectedElement) || '';
                container.querySelector('#ag-toggle-vis').innerText = '👁';
                highlight.style.display = 'block'; // 다시 보이면 하이라이트 표시
            } else {
                hiddenElements.set(selectedElement, selectedElement.style.display);
                selectedElement.style.display = 'none';
                container.querySelector('#ag-toggle-vis').innerText = '🚫'; // 숨김 상태 아이콘 변경
                highlight.style.display = 'none'; // 숨기면 하이라이트도 숨김
            }
        };

        btn.onclick = () => {
            isSelecting = !isSelecting;
            overlay.style.display = isSelecting ? 'block' : 'none';
            updateStyles();
            if (!isSelecting) {
                highlight.style.display = 'none'; 
                toolbar.style.display = 'none'; 
                selectedElement = null;
                // 끌 때 아이콘 초기화
                container.querySelector('#ag-toggle-vis').innerText = '👁';
            }
        };

        overlay.addEventListener('click', (e) => {
            overlay.style.display = 'none';
            const el = document.elementFromPoint(e.clientX, e.clientY);
            overlay.style.display = 'block';
            if (el && el !== btn && !toolbar.contains(el)) {
                selectedElement = el;
                elementHistory = []; 
                updateHighlight();
            }
        });

        container.querySelector('#ag-up').onclick = () => {
            if (selectedElement?.parentElement && selectedElement.parentElement !== document.body) {
                elementHistory.push(selectedElement); 
                selectedElement = selectedElement.parentElement;
                updateHighlight();
            }
        };

        container.querySelector('#ag-down').onclick = () => {
            if (elementHistory.length > 0) {
                selectedElement = elementHistory.pop();
                updateHighlight();
            }
        };

        function updateHighlight() {
            if(!selectedElement) return;
            const rect = selectedElement.getBoundingClientRect();
            highlight.style.display = 'block';
            highlight.style.width = rect.width + 'px';
            highlight.style.height = rect.height + 'px';
            highlight.style.top = (rect.top + window.scrollY) + 'px';
            highlight.style.left = (rect.left + window.scrollX) + 'px';
            
            label.innerText = `${selectedElement.tagName.toLowerCase()}${selectedElement.id ? '#'+selectedElement.id : ''}`;
            toolbar.style.display = 'flex';
            // 요소가 보이고 있는 상태면 아이콘 👁로 유지
            container.querySelector('#ag-toggle-vis').innerText = selectedElement.style.display === 'none' ? '🚫' : '👁';
        }

        // 설정 및 기타
        container.querySelector('#input-ui-op').oninput = (e) => { config.uiOpacity = e.target.value; updateStyles(); };
        container.querySelector('#input-btn-op').oninput = (e) => { config.btnOpacity = e.target.value; updateStyles(); };
        container.querySelector('#input-color').oninput = (e) => { config.themeColor = e.target.value; updateStyles(); };
        container.querySelector('#ag-settings').onclick = () => container.querySelector('#ag-settings-panel').style.display = 'block';
        container.querySelector('#ag-settings-done').onclick = () => {
            localStorage.setItem('ag_selector_config', JSON.stringify(config));
            container.querySelector('#ag-settings-panel').style.display = 'none';
        };
        container.querySelector('#ag-close').onclick = btn.onclick;
        container.querySelector('#ag-save').onclick = () => {
            const rule = `${window.location.hostname}##${label.innerText}`;
            navigator.clipboard.writeText(rule).then(() => alert("복사 완료!"));
        };
    }

    if (document.readyState === 'complete') createUI();
    else window.addEventListener('load', createUI);
})();
