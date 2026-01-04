// ==UserScript==
// @name         Source code viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Ever wanted to peek behind the scenes of any webpage instantly? With Source Code Viewer, you get a sleek, draggable menu that lets you
// @author       Canadian100 & 1234idc
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539053/Source%20code%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/539053/Source%20code%20viewer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    #customMenu {
        position: fixed;
        top: 50px;
        left: 50px;
        width: 480px;
        background: #121212;
        border: 2px solid #0af;
        border-radius: 6px;
        font-family: Arial, sans-serif;
        color: #ddd;
        z-index: 999999;
        user-select: none;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 10px #0af88f88;
    }
    #customMenu .topbar {
        cursor: grab;
        background: linear-gradient(90deg, #0af, #05c);
        padding: 8px 12px;
        user-select: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 18px;
    }
    #customMenu .topbar:active {
        cursor: grabbing;
    }
    #customMenu .closeBtn {
        cursor: pointer;
        color: #eee;
        font-size: 20px;
        line-height: 20px;
        user-select: none;
    }
    #customMenu .tabsBar {
        display: flex;
        background: #0a0a0a;
        border-bottom: 1px solid #0af;
    }
    #customMenu .tabBtn {
        flex: 1;
        padding: 10px 0;
        text-align: center;
        cursor: pointer;
        border-right: 1px solid #0af;
        transition: background 0.3s;
    }
    #customMenu .tabBtn:last-child {
        border-right: none;
    }
    #customMenu .tabBtn.active {
        background: #0af;
        color: black;
        font-weight: bold;
    }
    #customMenu .content {
        padding: 12px;
        height: 270px;
        overflow-y: auto;
        font-size: 14px;
        line-height: 1.4em;
        background: #1a1a1a;
        border-radius: 0 0 6px 6px;
    }
    #customMenu a {
        color: #0af;
        text-decoration: none;
    }
    #customMenu a:hover {
        text-decoration: underline;
    }
    #answerBox {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 480px;
        max-height: 400px;
        overflow-y: auto;
        background: linear-gradient(135deg, #001f3f, #000000);
        border: 2px solid #0af;
        border-radius: 6px;
        padding: 12px;
        font-family: Consolas, monospace;
        font-size: 13px;
        color: #0af;
        z-index: 1000000;
        user-select: text;
        box-shadow: 0 0 15px #0af88fdd;
        cursor: grab;
    }
    #answerBox:active {
        cursor: grabbing;
    }
    #answerBox code {
        white-space: pre-wrap;
        word-break: break-word;
        display: block;
    }
    #ratOptions label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        cursor: pointer;
    }
    #ratOptions label input[type=checkbox] {
        margin-right: 8px;
        cursor: pointer;
    }
    #ratOptions .optionLine {
        margin-left: 18px;
        font-size: 13px;
        color: #0af;
        font-style: italic;
    }
    #ratOptions #tmSearchContainer {
        margin-top: 10px;
        margin-left: 18px;
    }
    #ratOptions #tmSearchInput {
        width: 90%;
        padding: 5px 8px;
        font-size: 14px;
        border-radius: 4px;
        border: 1px solid #0af;
        background: #121212;
        color: #0af;
        outline: none;
    }
    #tmScriptsList {
        margin-top: 6px;
        max-height: 120px;
        overflow-y: auto;
        border: 1px solid #0af;
        border-radius: 4px;
        background: #222;
        color: #0af;
        font-size: 13px;
        padding: 6px;
        user-select: text;
    }
    #tmScriptsList div {
        margin-bottom: 4px;
        cursor: pointer;
        text-decoration: underline;
    }
    #tmScriptsList div:hover {
        color: #0ff;
    }
    #ratSliderContainer {
        margin-top: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    #ratSliderContainer label {
        font-size: 13px;
        font-style: italic;
        color: #0af;
        flex-shrink: 0;
        min-width: 180px;
    }
    #ratSlider {
        flex-grow: 1;
        cursor: pointer;
    }
    #refreshBtn {
        margin-top: 10px;
        padding: 6px 12px;
        background: #0af;
        border: none;
        border-radius: 5px;
        color: black;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
    }
    #refreshBtn:hover {
        background: #05c;
        color: white;
    }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'customMenu';

    const topbar = document.createElement('div');
    topbar.className = 'topbar';
    const closeBtn = document.createElement('div');
    closeBtn.className = 'closeBtn';
    closeBtn.textContent = '×';
    topbar.appendChild(closeBtn);
    menu.appendChild(topbar);

    const tabsBar = document.createElement('div');
    tabsBar.className = 'tabsBar';
    const tabs = [
        { id: 'rat',    label: 'RAT'    },
        { id: 'help',   label: 'Help'   },
        { id: 'credits',label: 'Credits'}
    ];
    tabs.forEach(tab => {
        const btn = document.createElement('div');
        btn.className = 'tabBtn';
        btn.dataset.tab = tab.id;
        btn.textContent = tab.label;
        tabsBar.appendChild(btn);
    });
    menu.appendChild(tabsBar);

    const content = document.createElement('div');
    content.className = 'content';
    menu.appendChild(content);
    document.body.appendChild(menu);

    const answerBox = document.createElement('div');
    answerBox.id = 'answerBox';
    answerBox.style.display = 'none';
    document.body.appendChild(answerBox);

    function makeDraggable(element, handle) {
        handle = handle || element;
        let pos = { x:0, y:0, left:0, top:0 };
        function dragMouseDown(e) {
            e.preventDefault();
            pos.x = e.clientX; pos.y = e.clientY;
            pos.left = parseInt(window.getComputedStyle(element).left,10);
            pos.top  = parseInt(window.getComputedStyle(element).top,10);
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('mouseup', closeDrag);
        }
        function elementDrag(e) {
            e.preventDefault();
            element.style.left = (pos.left + e.clientX - pos.x) + "px";
            element.style.top  = (pos.top + e.clientY - pos.y) + "px";
        }
        function closeDrag() {
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseup', closeDrag);
        }
        handle.addEventListener('mousedown', dragMouseDown);
    }

    makeDraggable(menu, topbar);
    makeDraggable(answerBox);

    let activeTab = 'credits';
    function setActiveTab(id) {
        activeTab = id;
        Array.from(tabsBar.children).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === id);
        });
        content.innerHTML = '';
        answerBox.style.display = 'none';

        if (id === 'credits') {
            content.innerHTML = `
                <div style="line-height:1.6;">
                    <strong>Canadian100</strong> - Owner and Dev<br><br>
                    Greasy Fork: <a href="https://greasyfork.org/en/users/994209-canadian100" target="_blank" rel="noopener noreferrer">Greasy Fork profile for Canadian100</a><br>
                    Github: <a href="https://github.com/canadian100" target="_blank" rel="noopener noreferrer">canadian100 - Overview</a><br><br>
                    2 repositories available. Follow their code on GitHub.<br><br>
                    Discord: <a href="https://discord.gg/z45cz2UmVC" target="_blank" rel="noopener noreferrer">Join our Discord</a>
                </div>`;
        } else if (id === 'help') {
            content.innerHTML = `
                <p>Welcome! 🌟</p>
                <p>→ Press <strong>Right Shift</strong> to toggle menu.</p>
                <p>→ Drag by the top bar.</p>
                <p>All features are tested and working. Enjoy! 🚀</p>`;
        } else if (id === 'rat') {
            buildRATTab();
        }
    }
    Array.from(tabsBar.children).forEach(btn => {
        btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });

    let cbSourceInput, cbTMInput, cbFnInput, slider, tmSearchInput, tmScriptsList, refreshBtn;

    function buildRATTab() {
        content.innerHTML = `
            <div id="ratOptions">
                <label><input type="checkbox" id="cbSource"> Source code</label>
                <div class="optionLine">first is - Source code</div>
                <label><input type="checkbox" id="cbTM"> Tampermonkey scripts</label>
                <div class="optionLine">second is - Tampermonkey scripts</div>
                <label><input type="checkbox" id="cbFn"> All the code behind the functions</label>
                <div class="optionLine">third is - Functions code</div>
                <div id="tmSearchContainer" style="display:none;">
                    <input type="text" id="tmSearchInput" placeholder="Search GreasyFork scripts..." autocomplete="off" />
                    <div id="tmScriptsList"></div>
                </div>
                <div id="ratSliderContainer">
                    <label for="ratSlider">Amount of info and answering speed</label>
                    <input type="range" id="ratSlider" min="1" max="10" value="5" />
                </div>
                <button id="refreshBtn">Refresh</button>
            </div>`;
        cbSourceInput   = document.getElementById('cbSource');
        cbTMInput       = document.getElementById('cbTM');
        cbFnInput       = document.getElementById('cbFn');
        slider          = document.getElementById('ratSlider');
        tmSearchInput   = document.getElementById('tmSearchInput');
        tmScriptsList   = document.getElementById('tmScriptsList');
        refreshBtn      = document.getElementById('refreshBtn');

        cbTMInput.addEventListener('change', () => {
            tmSearchInput.parentElement.style.display = cbTMInput.checked ? 'block' : 'none';
            if (!cbTMInput.checked) tmScriptsList.innerHTML = '';
        });

        tmSearchInput.addEventListener('input', () => {
            const term = tmSearchInput.value.trim();
            if (!term) {
                tmScriptsList.innerHTML = '';
                return;
            }
            fetch(`https://greasyfork.org/en/scripts.json?search=${encodeURIComponent(term)}`)
                .then(r => r.json())
                .then(data => {
                    tmScriptsList.innerHTML = '';
                    if (data.length === 0) {
                        tmScriptsList.textContent = 'No scripts found';
                    } else {
                        data.forEach(item => {
                            const div = document.createElement('div');
                            const a = document.createElement('a');
                            a.href = `https://greasyfork.org${item.url}`;
                            a.target = '_blank';
                            a.rel = 'noopener noreferrer';
                            a.textContent = item.name;
                            div.appendChild(a);
                            tmScriptsList.appendChild(div);
                        });
                    }
                });
        });

        cbSourceInput.addEventListener('change', updateAnswer);
        cbFnInput.addEventListener('change', updateAnswer);
        slider.addEventListener('input', updateAnswer);
        refreshBtn.addEventListener('click', updateAnswer);

        updateAnswer();
    }

    function generateAnswerContent(amount) {
        let output = '';
        if (!cbSourceInput.checked && !cbTMInput.checked && !cbFnInput.checked) {
            answerBox.style.display = 'none';
            return '';
        }
        if (cbSourceInput.checked) {
            let html = document.documentElement.outerHTML;
            if (amount < 10) {
                const len = Math.floor(html.length * amount / 10);
                html = html.slice(0, len) + (len < html.length ? '\n...[truncated]...' : '');
            }
            output += `<strong>-- Source code of page --</strong>\n<code>${escapeHtml(html)}</code>\n\n`;
        }
        if (cbTMInput.checked) {
            output += `<strong>-- Use the search box above to find GreasyFork scripts online --</strong>\n\n`;
        }
        if (cbFnInput.checked) {
            const funcs = [];
            for (const k in window) {
                if (typeof window[k] === 'function') funcs.push({ name: k, fn: window[k] });
            }
            if (funcs.length === 0) {
                output += `<strong>-- No global functions found --</strong>\n`;
            } else {
                output += `<strong>-- Functions code (up to ${amount*100} chars each) --</strong>\n`;
                funcs.forEach(f => {
                    let s = f.fn.toString();
                    if (s.length > amount*100) s = s.slice(0, amount*100) + '...';
                    output += `<div><strong>${escapeHtml(f.name)}()</strong>\n<code>${escapeHtml(s)}</code></div>\n\n`;
                });
            }
        }
        return output || 'No output for selected options.';
    }

    function updateAnswer() {
        if (activeTab !== 'rat') return;
        const html = generateAnswerContent(parseInt(slider.value,10));
        if (!html) {
            answerBox.style.display = 'none';
            return;
        }
        answerBox.innerHTML = html;
        answerBox.style.display = 'block';
    }

    function escapeHtml(t) {
        return (t||'')
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#039;');
    }

    document.addEventListener('keydown', e => {
        if (e.code === 'ShiftRight') {
            const d = menu.style.display;
            menu.style.display = d === 'none' || !d ? 'flex' : 'none';
            if (menu.style.display === 'none') answerBox.style.display = 'none';
        }
    });

    closeBtn.addEventListener('click', () => {
        menu.style.display = 'none';
        answerBox.style.display = 'none';
    });

    answerBox.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            e.target.target = '_blank';
            e.target.rel = 'noopener noreferrer';
        }
    });

    setActiveTab('credits');
})();
