// ==UserScript==
// @name         wplace.live — Hotkeys All Colors
// @version      1.0
// @description  Assign hotkeys to all colors on wplace.live; supports side mouse buttons
// @author       Anayy_n
// @match        https://wplace.live/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1505124
// @downloadURL https://update.greasyfork.org/scripts/545866/wplacelive%20%E2%80%94%20Hotkeys%20All%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/545866/wplacelive%20%E2%80%94%20Hotkeys%20All%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'wplace.manualHotkeys';
    const SWATCH_SELECTOR = 'button[id^="color-"][aria-label]';
    const PANEL_Z = 2147483647;

    let keyMap = {};
    let swatches = [];

    function loadMap() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
    }
    function saveMap() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(keyMap)); } catch {} }

    function normKey(e) {
        if(['Shift','Control','Alt','Meta'].includes(e.key)) return '';
        let mods=[];
        if(e.ctrlKey) mods.push('ctrl');
        if(e.altKey) mods.push('alt');
        if(e.shiftKey) mods.push('shift');
        let k=e.key.toLowerCase();
        if(k===' ') k='space';
        if(k==='escape') k='esc';
        return [...mods.sort(),k].join('+');
    }

    function isTyping(el){
        if(!el) return false;
        if(el.closest('#wphk-panel')) return true; // typing in panel
        const t = el.tagName?.toLowerCase();
        return t==='input'||t==='textarea'||el.isContentEditable;
    }

    function clickColor(el){
        if(!el) return;
        el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    }

    function scanSwatches(){
        swatches = Array.from(document.querySelectorAll(SWATCH_SELECTOR))
            .filter(el=>el && el.offsetParent && el.getBoundingClientRect().width>0);
    }

    function onKeyDown(e){
        if(e.repeat) return;
        if(isTyping(document.activeElement)) return;
        const key = normKey(e);
        if(!key) return;
        const id = keyMap[key];
        if(!id) return;
        const el = document.getElementById(id);
        clickColor(el);
        e.preventDefault();
        e.stopPropagation();
    }

    function onMouseDown(e){
        if(isTyping(document.activeElement)) return;
        if(e.button === 0 || e.button === 2) return; // ignore left/right
        let btn = '';
        if(e.button === 3) btn = 'mouse4';
        if(e.button === 4) btn = 'mouse5';
        if(!btn) return;
        const id = keyMap[btn];
        if(!id) return;
        const el = document.getElementById(id);
        clickColor(el);
        e.preventDefault();
        e.stopPropagation();
    }

    function panelCSS(){
        const css=`#wphk-btn{position:fixed;right:12px;bottom:12px;z-index:${PANEL_Z};border:0;padding:10px 12px;border-radius:8px;background:rgba(0,0,0,.7);color:#fff;font:13px/1.2 sans-serif;cursor:pointer}
#wphk-panel{position:fixed;right:12px;bottom:56px;z-index:${PANEL_Z};width:min(480px,92vw);max-height:70vh;background:#111;color:#eee;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.45);font:13px/1.4 system-ui,sans-serif;display:none}
#wphk-panel .hdr{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #333}
#wphk-panel .hdr h3{margin:0;font-size:14px;font-weight:600}
#wphk-panel .hdr .actions{display:flex;gap:8px}
#wphk-panel .hdr button{border:0;padding:6px 8px;border-radius:6px;background:#222;color:#eaeaea;cursor:pointer}
#wphk-panel .hdr button:hover{background:#2b2b2b}
#wphk-panel .body{padding:8px 12px;overflow:auto;max-height:calc(70vh - 48px)}
#wphk-list{width:100%;border-collapse:collapse}
#wphk-list th,#wphk-list td{padding:6px 6px;border-bottom:1px solid #222;vertical-align:middle}
#wphk-list th{position:sticky;top:0;background:#111;z-index:1}
.swatch{width:24px;height:24px;border-radius:6px;border:1px solid rgba(255,255,255,.2)}
.name{opacity:.85}
.keybox{width:130px;padding:6px 8px;border-radius:6px;border:1px solid #333;background:#1a1a1a;color:#fff}
.keybox:focus{outline:1px solid #555}
.mini{font-size:11px;opacity:.8}`;
        const tag=document.createElement('style');
        tag.textContent=css;
        document.head.appendChild(tag);
    }

    function colorOf(el){
        const st=getComputedStyle(el);
        const inline=el.getAttribute('style');
        if(inline && /background\s*:\s*[^;]+/.test(inline)){
            const m=inline.match(/background\s*:\s*([^;]+)/i);
            if(m) return m[1].trim();
        }
        return st.backgroundColor||'#000';
    }

    function buildPanel(){
        const openBtn=document.createElement('button');
        openBtn.id='wphk-btn';
        openBtn.textContent='🎨 Hotkeys';
        document.body.appendChild(openBtn);

        const panel=document.createElement('div');
        panel.id='wphk-panel';
        panel.innerHTML=`<div class="hdr">
<h3>Color Hotkeys</h3>
<div class="actions">
<button id="wphk-clear">Clear</button>
<button id="wphk-close">Close</button>
</div>
</div>
<div class="body">
<table id="wphk-list">
<thead>
<tr>
<th>Color</th>
<th>Name</th>
<th>Shortcut</th>
<th class="mini">Test</th>
</tr>
</thead>
<tbody></tbody>
</table>
<div class="mini" style="margin-top:6px;">
Tip: assign keys freely; clicks on locked colors will just fail safely.
</div>
</div>`;
        document.body.appendChild(panel);

        openBtn.addEventListener('click', ()=>{
            scanSwatches();
            renderRows();
            panel.style.display = panel.style.display==='none'||!panel.style.display?'block':'none';
        });

        panel.querySelector('#wphk-close').addEventListener('click', ()=>panel.style.display='none');
        panel.querySelector('#wphk-clear').addEventListener('click', ()=>{
            keyMap={};
            saveMap();
            renderRows();
        });

        function assignKeyToColor(keyOrBtn, colorId, input) {
            // Remove previous key or previous color mapping
            for (const [k,v] of Object.entries({...keyMap})) {
                if(k === keyOrBtn || v === colorId) delete keyMap[k];
            }
            keyMap[keyOrBtn] = colorId;
            saveMap();

            // Update current input
            input.value = keyOrBtn;

            // Live clear other inputs using the same key
            const tbody = document.querySelector('#wphk-list tbody');
            if(tbody) {
                const otherInputs = Array.from(tbody.querySelectorAll('.keybox'))
                    .filter(inp => inp !== input && inp.value === keyOrBtn);
                otherInputs.forEach(inp => inp.value = '');
            }
        }

        function renderRows(){
            const tbody = panel.querySelector('#wphk-list tbody');
            tbody.innerHTML='';
            const rev = new Map();
            for(const [k,v] of Object.entries(keyMap)) rev.set(v,k);

            for(const el of swatches){
                const id = el.id;
                const name = el.getAttribute('aria-label')||id;
                const bg = colorOf(el);
                const tr = document.createElement('tr');
                tr.innerHTML = `<td><div class="swatch" style="background:${bg}"></div></td>
<td class="name">${name}</td>
<td><input class="keybox" type="text" value="${rev.get(id)||''}" placeholder="press a key or mouse button"></td>
<td><button class="mini" data-test="${id}">Click</button></td>`;
                const input = tr.querySelector('.keybox');

                input.addEventListener('keydown', e=>{
                    e.preventDefault(); e.stopPropagation();
                    const nk = normKey(e);
                    if(!nk) return;
                    assignKeyToColor(nk, id, input);
                });

                input.addEventListener('mousedown', e=>{
                    if(e.button === 0 || e.button === 2) return;
                    let btn = '';
                    if(e.button === 3) btn = 'mouse4';
                    if(e.button === 4) btn = 'mouse5';
                    if(!btn) return;
                    assignKeyToColor(btn, id, input);
                    e.preventDefault();
                    e.stopPropagation();
                });

                tr.querySelector('button[data-test]').addEventListener('click', ()=>clickColor(el));
                tbody.appendChild(tr);
            }
        }

        buildPanel.renderRows = renderRows;
    }

    function init(){
        keyMap = loadMap();
        panelCSS();
        buildPanel();
        scanSwatches();
        window.addEventListener('keydown', onKeyDown,{capture:true});
        window.addEventListener('mousedown', onMouseDown,{capture:true});
        const mo = new MutationObserver(()=>{
            const oldCount = swatches.length;
            scanSwatches();
            if(swatches.length!==oldCount) buildPanel.renderRows?.();
        });
        mo.observe(document.body,{childList:true,subtree:true});
    }

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
    else init();
})();
