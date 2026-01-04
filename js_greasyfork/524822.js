// ==UserScript==
// @name         Destiny2_Term_replace
// @namespace    your-namespace
// @version      2.4
// @description  替换网页中出现的命运2术语
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      20xiji.github.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524822/Destiny2_Term_replace.user.js
// @updateURL https://update.greasyfork.org/scripts/524822/Destiny2_Term_replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* === 全局配置 === */
    const CACHE_DAYS = 1;            // 词库缓存天数
    const HISTORY_LIMIT = 20;        // 撤销记录上限
    const DIALOG_POS_KEY = 'dialogPos'; // 面板位置存储键
    const USER_TERMS_KEY = 'userDefinedTerms'; // 自定义术语存储键
    const ITEMS_PER_PAGE_KEY = 'itemsPerPageSetting';

    const ITEM_LIST_URL = 'https://20xiji.github.io/Destiny-item-list/Destiny2_term.json';
    let replacementHistory = [];
    let termMap = new Map();
    let userTerms = {}; // 持久化的自定义术语
    let currentMode = 1;
    let dialogVisible = false;
    let dialogXOffset = 0;
    let dialogYOffset = 0;
    let isDragging = false;
    let posObjs = [];
    let hintDialogVisible = false; // 新增提示对话框显示状态

    let currentPage = 1;
    let itemsPerPage = GM_getValue(ITEMS_PER_PAGE_KEY, 5);
    let searchTerm = '';

    GM_addStyle(`
        :root {
            --bg-color:#1f1f1f;
            --accent-color:#4caf50;
            --accent-color-light:#66bb6a;
            --btn-bg:#333;
            --text-color:#fff;
            --text-muted:#888;
        }
        @keyframes gm-fadein {from{opacity:0;transform:translateY(-8px);}to{opacity:1;}}
        #textReplacerDialog{background:var(--bg-color);color:var(--text-color);animation:gm-fadein .25s ease-out;}
        .mode-btn{background:var(--btn-bg);color:var(--text-muted);} .mode-btn:hover{background:#444;color:var(--text-color);} .mode-btn.active{background:var(--accent-color);color:var(--text-color);}
        #actionButtons button{background:var(--accent-color);} #actionButtons button:hover{background:var(--accent-color-light);} 
        #btnClearCache{background:#f44336!important;} #btnClearCache:hover{background:#e53935!important;}
        #textReplacerDialog {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1a1a1a;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            z-index: 9999;
            width: 260px;
            font-family: Arial, sans-serif;
            color: #fff;
            display: none;
            overflow: visible;
        }
        #textReplacerDialog.dragging {
            cursor: grabbing;
        }
        #dialogHeader {
            cursor: grab;
            margin-bottom: 10px;
        }
        #modeButtons {
            display: grid;
            gap: 8px;
            margin: 12px 0;
        }
        .mode-btn {
            padding: 8px;
            border: none;
            border-radius: 4px;
            background: #333;
            color: #888;
            cursor: pointer;
            transition: all 0.2s;
        }
        .mode-btn.active {
            background: #4CAF50;
            color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        #actionButtons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }
        #actionButtons button {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            min-width: 80px;
        }
        #actionButtons button:disabled {
            background: #666;
            cursor: not-allowed;
        }
        #termCount {
            font-size: 12px;
            color: #888;
            margin-left: 8px;
        }
        #btnClearCache {
            background: #f44336 !important;
        }
        .dialogButton { /* 统一关闭和提示按钮样式 */
            position: absolute;
            top: 8px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #ff6058;
            border: 1px solid #e0443e;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 0 rgba(0,0,0,.1);
            padding: 0;
            z-index: 10000;
        }
        .dialogButton:hover {
            background-color: #f0413a;
            border-color: #d02828;
        }
        .dialogButton::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #fff;
            transform: scale(0.5); /* 调整小白点初始大小 */
            opacity: 0;
            transition: opacity 0.2s ease, transform 0.2s ease; /* 添加transform过渡 */
        }
        .dialogButton:hover::before {
            opacity: 1;
            transform: scale(1);
        }
        #dialogCloseButton {
            right: 8px;
        }
        #dialogHintButton {
            right: 30px; /* 提示按钮位置在关闭按钮左侧 */
            background-color: #ffc107; /* 提示按钮颜色 */
            border-color: #e0a300;
        }
        #dialogHintButton:hover {
            background-color: #f0b200;
            border-color: #d09500;
        }
        #dialogHintButton:hover::before {
            background-color: #333; /* 提示按钮悬停小白点颜色 */
        }
        #hintDialog {
            position: fixed;
            top: 60px; /* 调整提示框的垂直位置 */
            right: 20px;
            background: #333;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            z-index: 10001; /* 确保提示框在最上层 */
            width: 300px; /* 调整宽度 */
            font-size: 14px;
            line-height: 1.6;
            display: none; /* 初始隐藏 */
        }
        #hintDialog p {
            margin-bottom: 10px;
        }
        #hintDialog p:last-child {
            margin-bottom: 0;
        }
        /* Toast 提示样式 */
        .gm-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10002;
            opacity: 0;
            transition: opacity .3s ease;
            pointer-events: none; /* 不阻挡鼠标操作 */
        }

        /* 批量添加术语面板（嵌入主对话框） */
        #addTermPanel {
            margin-top: 12px;
            display: none;
        }
        #addTermPanel textarea {
            width: 100%;
            height: 100px;
            background: #222;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 6px;
            resize: vertical;
            box-sizing: border-box;
            font-family: monospace;
        }
        #addTermPanel .panel-actions {
            text-align: right;
            margin-top: 6px;
        }
        #addTermPanel .panel-actions button {
            margin-left: 8px;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #btnSaveTerms {background:#4CAF50;color:#fff;}
        #btnCancelAdd {background:#666;color:#fff;}
    `);

    const dialog = document.createElement('div');
    dialog.id = 'textReplacerDialog';

    /* ===== 读取并应用历史面板位置 ===== */
    const savedPos = GM_getValue(DIALOG_POS_KEY);
    if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
        dialog.style.left = `${savedPos.x}px`;
        dialog.style.top  = `${savedPos.y}px`;
    }

    const dialogHeader = document.createElement('div');
    dialogHeader.id = 'dialogHeader';
    dialogHeader.style.margin = '0 0 10px 0';
    dialogHeader.style.fontSize = '16px';
    dialogHeader.textContent = '文本替换工具 ';
    dialog.appendChild(dialogHeader);

    const termCountSpan = document.createElement('span');
    termCountSpan.id = 'termCount';
    termCountSpan.textContent = '（加载中...）';
    dialogHeader.appendChild(termCountSpan);

    const modeButtonsDiv = document.createElement('div');
    modeButtonsDiv.id = 'modeButtons';

    const modeButton1 = document.createElement('button');
    modeButton1.className = 'mode-btn';
    modeButton1.dataset.mode = '1';
    modeButton1.textContent = '中文模式';
    modeButton1.title = '将英文术语替换为纯中文';
    modeButtonsDiv.appendChild(modeButton1);

    const modeButton2 = document.createElement('button');
    modeButton2.className = 'mode-btn';
    modeButton2.dataset.mode = '2';
    modeButton2.textContent = '英文|中文';
    modeButton2.title = '替换为 "英文 | 中文" 组合';
    modeButtonsDiv.appendChild(modeButton2);

    const modeButton3 = document.createElement('button');
    modeButton3.className = 'mode-btn';
    modeButton3.dataset.mode = '3';
    modeButton3.textContent = '中文(英文)';
    modeButton3.title = '替换为 "中文(英文)" 组合';
    modeButtonsDiv.appendChild(modeButton3);


    const actionButtonsDiv = document.createElement('div');
    actionButtonsDiv.id = 'actionButtons';

    const btnApplyAll = document.createElement('button');
    btnApplyAll.id = 'btnApplyAll';
    btnApplyAll.textContent = '应用规则';
    actionButtonsDiv.appendChild(btnApplyAll);

    const btnUndo = document.createElement('button');
    btnUndo.id = 'btnUndo';
    btnUndo.textContent = '撤销';
    btnUndo.disabled = true;
    actionButtonsDiv.appendChild(btnUndo);

    const btnClearCache = document.createElement('button');
    btnClearCache.id = 'btnClearCache';
    btnClearCache.textContent = '清除缓存';
    actionButtonsDiv.appendChild(btnClearCache);

    /* === 自定义术语相关按钮 === */
    const btnAddTerm = document.createElement('button');
    btnAddTerm.id = 'btnAddTerm';
    btnAddTerm.textContent = '添加术语';
    actionButtonsDiv.appendChild(btnAddTerm);

    const btnExportTerms = document.createElement('button');
    btnExportTerms.id = 'btnExportTerms';
    btnExportTerms.textContent = '导出';
    actionButtonsDiv.appendChild(btnExportTerms);

    const btnImportTerms = document.createElement('button');
    btnImportTerms.id = 'btnImportTerms';
    btnImportTerms.textContent = '导入';
    actionButtonsDiv.appendChild(btnImportTerms);

    /* === 新增：管理自定义术语按钮 === */
    const btnManageTerms = document.createElement('button');
    btnManageTerms.id = 'btnManageTerms';
    btnManageTerms.textContent = '管理术语';
    actionButtonsDiv.appendChild(btnManageTerms);

    const closeButton = document.createElement('button');
    closeButton.id = 'dialogCloseButton';
    closeButton.className = 'dialogButton'; // 添加统一样式类
    closeButton.addEventListener('click', toggleDialog);
    dialog.appendChild(closeButton);

    // 新增提示按钮
    const hintButton = document.createElement('button');
    hintButton.id = 'dialogHintButton';
    hintButton.className = 'dialogButton'; // 添加统一样式类
    hintButton.addEventListener('click', toggleHintDialog); // 添加点击事件监听器
    dialog.appendChild(hintButton);

    // 创建提示对话框
    const hintDialog = document.createElement('div');
    hintDialog.id = 'hintDialog';
    hintDialog.innerHTML = `
        <h3 style="margin:0 0 8px 0;">使用小贴士</h3>
        <ul style="padding-left:20px;line-height:1.7">
          <li><b>启动模式：</b>按 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>K</kbd> 或 点击右上角按钮 或 鼠标右键菜单可随时打开/关闭面板</li>
          <li><b>批量添加：</b>点「添加术语」后粘贴多行 <code>英文=中文</code> 或 <code>英文 中文</code> 映射即可导入</li>
          <li><b>撤销：</b>点击“撤销”按钮可回退最近 20 次替换操作</li>
          <li><b>自定义词库：</b>使用「导出 / 导入」按钮可备份和恢复自定义术语</li>
          <li><b>缓存：</b>如词库异常，可点“清除缓存”重新下载最新数据</li>
          <li><b>拖拽面板：</b>按住标题栏拖动可移动面板，位置会自动保存</li>
          <li><b>多层网页：</b>在 iframe 层内单击空白处后按快捷键，只替换当前层</li>
        </ul>
    `;
    document.body.appendChild(hintDialog);

    /* === 批量添加术语面板（在主面板内部） === */
    const addTermPanel = document.createElement('div');
    addTermPanel.id = 'addTermPanel';
    addTermPanel.innerHTML = `
        <p style="font-size:12px;color:#bbb;margin:0 0 6px;line-height:1.4;">
            <b>批量添加说明：</b>每行一条，英文与中文之间可使用 <code>=</code> 或 <code>|</code> 分隔。<br>
            例如：<br>
            <code>Gjallarhorn=加拉尔号角</code><br>
            <code>Gjallarhorn|加拉尔号角</code>
        </p>
        <textarea id="batchTermInput" placeholder="在此粘贴或输入多行术语映射..."></textarea>
        <div class="panel-actions">
            <button id="btnSaveTerms">保存</button>
            <button id="btnCancelAdd">取消</button>
        </div>`;
    // 先添加模式与操作区域，再放置批量添加面板，保证面板在最下方向下展开
    dialog.appendChild(modeButtonsDiv);
    dialog.appendChild(actionButtonsDiv);
    dialog.appendChild(addTermPanel);

    /* === 新增：管理自定义术语面板 === */
    const manageTermPanel = document.createElement('div');
    manageTermPanel.id = 'manageTermPanel';
    manageTermPanel.style.display = 'none';
    manageTermPanel.innerHTML = `
        <h4 style="margin:0 0 6px 0;">我的自定义术语</h4>
        <div style="margin-bottom:6px;display:flex;align-items:center;gap:4px;font-size:12px;flex-wrap:nowrap;">
            <input id="termSearchInput" type="text" placeholder="搜索..." style="flex:1 1 auto;min-width:0;background:#111;border:1px solid #555;border-radius:4px;padding:4px 6px;color:#fff;" />
            <label style="white-space:nowrap;">每页
                <input id="itemsPerPageInput" type="number" min="1" max="100" value="20" style="width:40px;margin:0 4px;background:#111;border:1px solid #555;border-radius:4px;padding:2px 4px;color:#fff;" />
                条
            </label>
        </div>
        <div id="termsList" style="max-height:160px;overflow:auto;border:1px solid #555;padding:6px;border-radius:4px;background:#222;"></div>
        <div id="paginationControls" style="margin-top:6px;text-align:center;font-size:12px;"></div>
        <div class="panel-actions" style="text-align:right;margin-top:6px;">
            <button id="btnCloseManage" style="background:#666;color:#fff;border:none;border-radius:4px;padding:6px 12px;cursor:pointer;">关闭</button>
        </div>`;
    dialog.appendChild(manageTermPanel);

    const batchInput = addTermPanel.querySelector('#batchTermInput');
    const btnSaveTerms = addTermPanel.querySelector('#btnSaveTerms');
    const btnCancelAdd = addTermPanel.querySelector('#btnCancelAdd');

    document.body.appendChild(dialog);

    const elements = {
        modeButtons: dialog.querySelectorAll('.mode-btn'),
        btnApplyAll: dialog.querySelector('#btnApplyAll'),
        btnUndo: dialog.querySelector('#btnUndo'),
        btnClearCache: dialog.querySelector('#btnClearCache'),
        btnAddTerm: dialog.querySelector('#btnAddTerm'),
        btnExportTerms: dialog.querySelector('#btnExportTerms'),
        btnImportTerms: dialog.querySelector('#btnImportTerms'),
        termCount: dialog.querySelector('#termCount'),
        /* === 新增 === */
        btnManageTerms: dialog.querySelector('#btnManageTerms')
    };

    elements.modeButtons.forEach(btn => btn.addEventListener('click', handleModeChange));
    elements.btnApplyAll.addEventListener('click', applyAllRules);
    elements.btnUndo.addEventListener('click', undoReplace);
    elements.btnClearCache.addEventListener('click', clearCache);

    /* === 自定义术语按钮事件 === */
    /* === 打开/关闭批量添加覆盖层 === */
    let addPanelVisible = false;
    function toggleAddTermPanel(show = !addPanelVisible) {
        addPanelVisible = show;
        addTermPanel.style.display = show ? 'block' : 'none';
        if (show) batchInput.focus();
    }

    elements.btnAddTerm.addEventListener('click', () => toggleAddTermPanel(true));

    btnCancelAdd.addEventListener('click', () => toggleAddTermPanel(false));

    btnSaveTerms.addEventListener('click', () => {
        const raw = batchInput.value;
        if (!raw) { showToast('❌ 内容为空', false); return; }
        const lines = raw.split(/\n+/);
        let added = 0;
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            const match = trimmed.match(/^(.+?)[=|]+(.+)$/);
            if (match) {
                const en = match[1].trim();
                const cn = match[2].trim();
                if (en && cn) {
                    userTerms[en] = cn;
                    termMap.set(en, cn);
                    added++;
                }
            }
        }
        if (added) {
            GM_setValue(USER_TERMS_KEY, userTerms);
            updateTermCount();
            showToast(`✅ 已添加 ${added} 条自定义术语`);
            batchInput.value = '';
            toggleAddTermPanel(false);
        } else {
            showToast('❌ 未检测到有效输入', false);
        }
    });

    elements.btnExportTerms.addEventListener('click', exportUserTerms);
    elements.btnImportTerms.addEventListener('click', importUserTerms);

    /* === 新增：管理术语按钮事件 === */
    let managePanelVisible = false;
    function toggleManagePanel(show = !managePanelVisible) {
        managePanelVisible = show;
        manageTermPanel.style.display = show ? 'block' : 'none';
        if (show) {
            // 同步控件默认值
            manageTermPanel.querySelector('#termSearchInput').value = searchTerm = '';
            const perInput = manageTermPanel.querySelector('#itemsPerPageInput');
            perInput.value = itemsPerPage;
            renderUserTermsList();
            // 绑定事件（仅绑定一次）
            if (!perInput.dataset.bound) {
                const searchInput = manageTermPanel.querySelector('#termSearchInput');
                searchInput.addEventListener('input', () => {
                    searchTerm = searchInput.value.trim().toLowerCase();
                    currentPage = 1;
                    renderUserTermsList();
                });
                perInput.addEventListener('change', () => {
                    const v = parseInt(perInput.value);
                    if (!v || v < 1) { perInput.value = 1; itemsPerPage = 1; }
                    else { itemsPerPage = v; }
                    GM_setValue(ITEMS_PER_PAGE_KEY, itemsPerPage);
                    currentPage = 1;
                    renderUserTermsList();
                });
                perInput.dataset.bound = '1';
            }
        }
    }

    elements.btnManageTerms.addEventListener('click', () => toggleManagePanel(true));
    manageTermPanel.querySelector('#btnCloseManage').addEventListener('click', () => toggleManagePanel(false));

    function renderUserTermsList() {
        const listContainer = manageTermPanel.querySelector('#termsList');
        const pageControls = manageTermPanel.querySelector('#paginationControls');
        const allEntries = Object.entries(userTerms);
        const filtered = allEntries.filter(([en, cn]) => en.toLowerCase().includes(searchTerm) || cn.toLowerCase().includes(searchTerm));

        const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
        if (currentPage > totalPages) currentPage = totalPages;

        const startIdx = (currentPage - 1) * itemsPerPage;
        const pageEntries = filtered.slice(startIdx, startIdx + itemsPerPage);

        listContainer.innerHTML = '';
        if (!pageEntries.length) {
            listContainer.textContent = '（无匹配结果）';
        } else {
            for (const [en, cn] of pageEntries) {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';
                row.style.margin = '2px 0';
                const textSpan = document.createElement('span');
                textSpan.style.fontFamily = 'monospace';
                textSpan.style.fontSize = '12px';
                textSpan.textContent = `${en} → ${cn}`;
                const delBtn = document.createElement('button');
                delBtn.textContent = '删除';
                delBtn.style.background = '#f44336';
                delBtn.style.border = 'none';
                delBtn.style.borderRadius = '4px';
                delBtn.style.color = '#fff';
                delBtn.style.cursor = 'pointer';
                delBtn.style.fontSize = '12px';
                delBtn.addEventListener('click', () => {
                    deleteUserTerm(en);
                    renderUserTermsList();
                });
                row.appendChild(textSpan);
                row.appendChild(delBtn);
                listContainer.appendChild(row);
            }
        }

        // 渲染分页控件
        pageControls.innerHTML = '';
        if (totalPages > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '上一页';
            prevBtn.disabled = currentPage === 1;
            prevBtn.style.marginRight = '8px';
            prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderUserTermsList(); } });

            const nextBtn = document.createElement('button');
            nextBtn.textContent = '下一页';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.style.marginLeft = '8px';
            nextBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; renderUserTermsList(); } });

            const infoSpan = document.createElement('span');
            infoSpan.textContent = `第 ${currentPage} / ${totalPages} 页`;
            pageControls.appendChild(prevBtn);
            pageControls.appendChild(infoSpan);
            pageControls.appendChild(nextBtn);
        }
    }

    /* === 新增：删除自定义术语 === */
    function deleteUserTerm(en) {
        if (!userTerms[en]) return;
        if (!confirm(`确定删除术语：${en} ？`)) return;
        delete userTerms[en];
        GM_setValue(USER_TERMS_KEY, userTerms);
        termMap.delete(en);
        updateTermCount();
        showToast(`✅ 已删除术语：${en}`);
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'k') {
            toggleDialog();
        }
    });

    GM_registerMenuCommand("打开文本替换工具", toggleDialog);

    document.addEventListener('click', (e) => {
        if (e.target.matches('.gm-open-text-replacer')) {
            toggleDialog();
        }
    });

    // Make dialog draggable
    dialogHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        isDragging = true;
        dialog.classList.add('dragging');
        dialogXOffset = dialog.offsetLeft - e.clientX;
        dialogYOffset = dialog.offsetTop - e.clientY;
    }

    function dragMove(e) {
        if (!isDragging) return;
        dialog.style.left = e.clientX + dialogXOffset + 'px';
        dialog.style.top = e.clientY + dialogYOffset + 'px';
    }

    function dragEnd() {
        isDragging = false;
        dialog.classList.remove('dragging');
        // 保存当前位置
        GM_setValue(DIALOG_POS_KEY, { x: dialog.offsetLeft, y: dialog.offsetTop });
    }


    initTerminology();
    updateButtonStates();

    function toggleDialog() {
        dialogVisible = !dialogVisible;
        dialog.style.display = dialogVisible ? 'block' : 'none';
        updateButtonStates();
        if (dialogVisible && hintDialogVisible) { // 关闭主面板时同时关闭提示框
            toggleHintDialog();
        }
    }

    function toggleHintDialog() {
        hintDialogVisible = !hintDialogVisible;
        hintDialog.style.display = hintDialogVisible ? 'block' : 'none';
        if (hintDialogVisible && dialogVisible === false) { // 如果提示框显示时主面板未显示，则同时显示主面板
            toggleDialog();
        }
    }

    async function clearCache() {
        try {
            GM_deleteValue('cachedTerms');
            GM_deleteValue('cacheTime');
            const freshData = await fetchTerms();
            termMap = new Map(Object.entries(freshData));
            GM_setValue('cachedTerms', freshData);
            GM_setValue('cacheTime', Date.now());
            updateTermCount();
            showToast(`✅ 缓存已清除并重新加载成功，已加载 ${termMap.size} 条术语`);
        } catch (error) {
            console.error('缓存清除失败:', error);
            showToast(`❌ 缓存清除失败：${error.message}`, false);
            termMap.clear();
            updateTermCount();
        }
    }

    async function initTerminology() {
        const cachedData = GM_getValue('cachedTerms');
        const cacheTime = GM_getValue('cacheTime', 0);

        try {
            if (!cachedData || Date.now() - cacheTime > 86400000 * CACHE_DAYS) {
                const freshData = await fetchTerms();
                termMap = new Map(Object.entries(freshData));
                GM_setValue('cachedTerms', freshData);
                GM_setValue('cacheTime', Date.now());
            } else {
                termMap = new Map(Object.entries(cachedData));
            }

            /* === 合并并加载用户自定义术语 === */
            userTerms = GM_getValue(USER_TERMS_KEY, {});
            if (userTerms && typeof userTerms === 'object') {
                for (const [en, cn] of Object.entries(userTerms)) {
                    termMap.set(en, cn);
                }
            }
        } catch (error) {
            console.error('术语表初始化失败:', error);
            if (cachedData) {
                termMap = new Map(Object.entries(cachedData));
            }
        }
        updateTermCount();
    }

    function updateTermCount() {
        elements.termCount.textContent = termMap.size > 0
            ? `（已加载${termMap.size}条）`
            : '（未加载数据）';
    }

    function fetchTerms() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: ITEM_LIST_URL,
                timeout: 15000,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data && data.data && Object.keys(data.data).length > 0) {
                                resolve(data.data);
                            } else {
                                reject(new Error('获取到空数据或data.data为空'));
                            }
                        } catch (e) {
                            reject(new Error('数据解析失败'));
                        }
                    } else {
                        reject(new Error(`HTTP ${res.status}`));
                    }
                },
                onerror: (err) => {
                    reject(new Error(`网络错误: ${err}`));
                },
                ontimeout: () => {
                    reject(new Error('请求超时（15秒）'));
                }
            });
        });
    }

    function handleModeChange(e) {
        currentMode = parseInt(e.target.dataset.mode);
        updateButtonStates();
    }

    function updateButtonStates() {
        elements.modeButtons.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.mode) === currentMode);
        });
    }

    function applyAllRules() {
        const termRules = Array.from(termMap).map(([en, cn]) => {
            switch (currentMode) {
                case 1: return [en, cn];
                case 2: return [en, `${en} | ${cn}`];
                case 3: return [en, `${cn}（${en}）`];
                default: return [en, cn];
            }
        });
        performReplace(termRules);
    }

    function performReplace(rules) {
        const regex = buildRegex(rules);
        const lowerMap = new Map(rules.map(([k, v]) => [k.toLowerCase(), v]));
        const snapshot = [];
        const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'NOSCRIPT']);

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (SKIP_TAGS.has(node.parentNode && node.parentNode.nodeName)) continue;
            const original = node.nodeValue;
            const replaced = original.replace(regex, (m) => lowerMap.get(m.toLowerCase()) ?? m);

            if (replaced !== original) {
                snapshot.push({ node, text: original });
                node.nodeValue = replaced;
            }
        }

        if (snapshot.length) {
            replacementHistory.push(snapshot);
            if (replacementHistory.length > HISTORY_LIMIT) {
                replacementHistory.shift();
            }
            elements.btnUndo.disabled = false;
        }
    }

    function buildRegex(rules) {
        const sortedKeys = [...new Set(rules.map(([k]) => k))]
            .sort((a, b) => b.length - a.length)
            .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        return new RegExp(`\\b(${sortedKeys.join('|')})\\b`, 'gi');
    }

    function undoReplace() {
        if (replacementHistory.length) {
            const last = replacementHistory.pop();
            last.forEach(({ node, text }) => {
                if (node.parentNode) node.nodeValue = text;
            });
            elements.btnUndo.disabled = !replacementHistory.length;
        }
    }

    /* ===== 自定义术语相关 ===== */
    function addUserTerm(en, cn) {
        if (!en || !cn) return;
        userTerms[en] = cn;
        GM_setValue(USER_TERMS_KEY, userTerms);
        termMap.set(en, cn);
        updateTermCount();
        showToast(`✅ 已添加术语：${en} → ${cn}`);
    }

    function exportUserTerms() {
        const blob = new Blob([JSON.stringify(userTerms, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'destiny2_custom_terms.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importUserTerms() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = () => {
            if (!input.files.length) return;
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    if (data && typeof data === 'object') {
                        Object.entries(data).forEach(([en, cn]) => {
                            userTerms[en] = cn;
                            termMap.set(en, cn);
                        });
                        GM_setValue(USER_TERMS_KEY, userTerms);
                        updateTermCount();
                        showToast(`✅ 已导入 ${Object.keys(data).length} 条自定义术语`);
                    } else {
                        showToast('❌ JSON 格式不正确', false);
                    }
                } catch (e) {
                    showToast('❌ 解析失败：' + e.message, false);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    /* ===== Toast 提示 ===== */
    function showToast(message, success = true) {
        const toast = document.createElement('div');
        toast.className = 'gm-toast';
        toast.textContent = message;
        toast.style.background = success ? 'rgba(76,175,80,0.9)' : 'rgba(244,67,54,0.9)';
        document.body.appendChild(toast);
        // 强制触发回流，启用过渡
        void toast.offsetWidth;
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }

    /* === 首次使用欢迎提示 === */
    const WELCOME_KEY = 'hasShownWelcome_v2';
    if (!GM_getValue(WELCOME_KEY)) {
        // 延迟以免与面板动画冲突
        setTimeout(()=>showToast('提示：按 Ctrl+Alt+K 或 点击右上角按钮 或 鼠标右键菜单 打开命运2术语替换面板'),500);
        GM_setValue(WELCOME_KEY,true);
    }
})();