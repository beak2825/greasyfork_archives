// ==UserScript==
// @name         BGA Translation TextBox Export
// @version      1.1.0
// @namespace    ani20168
// @description  Add a button on the BGA translation page that allows all the text to be translated on the page to be placed in a text block for easy copying.
// @author       ani20168
// @license      MIT
// @match        https://boardgamearena.com/translation*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://boardgamearena.com&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468990/BGA%20Translation%20TextBox%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/468990/BGA%20Translation%20TextBox%20Export.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 常數 ***/
    const SEPARATOR = '----------------------------------';  // 分隔線

    /*** 主程式 ***/
    function setup() {
        // 避免重複建立
        if (document.getElementById('textBoxExportButton')) { return; }

        /* ---------- 1. Export 按鈕 ---------- */
        const exportButton = document.createElement('input');
        exportButton.type = 'button';
        exportButton.value = 'TextBox Export';
        exportButton.id = 'textBoxExportButton';
        exportButton.className = 'bgabutton bgabutton_blue';
        exportButton.style.marginLeft = '4px';

        const exportArea = document.createElement('textarea');
        exportArea.style.cssText = 'width:100%;height:200px;display:none;';
        exportArea.readOnly = true;

        exportButton.onclick = () => {
            if (exportArea.style.display === 'block') {
                exportArea.style.display = 'none';
            } else {
                const raws = Array.from(document.getElementsByClassName('readonly_textarea'))
                    .map(t => t.value.trim());
                exportArea.value = raws.join('\n' + SEPARATOR + '\n');
                exportArea.style.display = 'block';
            }
        };

        /* ---------- 2. Import 按鈕 ---------- */
        const importButton = document.createElement('input');
        importButton.type = 'button';
        importButton.value = 'TextBox Import';
        importButton.id = 'textBoxImportButton';
        importButton.className = 'bgabutton bgabutton_blue';
        importButton.style.marginLeft = '4px';

        const importArea = document.createElement('textarea');
        importArea.style.cssText = 'width:100%;height:200px;display:none;';

        importButton.onclick = () => {
            if (importArea.style.display === 'block') {
                // 第二次點擊 → 解析並分配
                distributeTranslations(importArea.value);
                importArea.style.display = 'none';
            } else {
                importArea.style.display = 'block';
            }
        };

        /* ---------- 3. 把按鈕插入原本 UI ---------- */
        const resetFilterButton = document.querySelector('#findreset_form > span');
        resetFilterButton.appendChild(exportButton);
        resetFilterButton.appendChild(importButton);

        const btnContainer = document.getElementById('filters_buttons');
        btnContainer.appendChild(exportArea);
        btnContainer.appendChild(importArea);
    }

    /***
     * 把整段翻譯文字依 SEPARATOR 切開並分配到每個 translation_block
     * @param {string} rawText - 使用者貼上的整份翻譯結果
     */
    function distributeTranslations(rawText) {
        const pieces = rawText
            .split(new RegExp(`\\s*${SEPARATOR}\\s*`, 'g'))
            .map(t => t.trim())
            .filter(Boolean);

        const blocks = Array.from(document.getElementsByClassName('translation_block'));
        let idx = 0;

        blocks.forEach(block => {
            const readonly = block.querySelector('.readonly_textarea');
            const translated = block.querySelector('textarea[id^="translated_"]');
            if (!readonly || !translated) { return; }  // 保險檢查

            // 如果還有對應翻譯就建立 UI
            const piece = pieces[idx++];
            if (piece !== undefined) {
                addLoadUI(block, translated, piece);
            }
        });
    }

    /**
     * 在指定翻譯區塊右側新增「載入文字框」+「確認載入」按鈕
     * @param {HTMLElement} block - .translation_block
     * @param {HTMLTextAreaElement} translatedArea - 原本用來輸入翻譯的 textarea
     * @param {string} piece - 對應的翻譯文字
     */
    function addLoadUI(block, translatedArea, piece) {
        // 若已經加過就僅更新內容
        let loadDiv = block.querySelector('.loaded_translation_zone');
        if (!loadDiv) {
            loadDiv = document.createElement('div');
            loadDiv.className = 'loaded_translation_zone translation_meta';
            // textarea
            const loadTA = document.createElement('textarea');
            loadTA.className = 'loaded_textarea';
            loadTA.style.cssText = 'width:120%;height:140px;margin-top:4px;box-sizing:border-box;';
            loadDiv.appendChild(loadTA);
            // button
            const btnWrap = document.createElement('div');
            btnWrap.style.display = 'inline-block';
            const confirmBtn = document.createElement('a');
            confirmBtn.href = 'javascript:false;';
            confirmBtn.tabIndex = -1;
            confirmBtn.className = 'bgabutton bgabutton_blue';
            confirmBtn.textContent = '確認載入';
            btnWrap.appendChild(confirmBtn);
            loadDiv.appendChild(btnWrap);

            // 行為：點下"確認載入"
            confirmBtn.onclick = () => {
                // 1) 把翻譯文字塞進官方 textarea
                translatedArea.value = loadTA.value.trim();

                // 2) 觸發 input 事件，讓網站知道值變了
                translatedArea.dispatchEvent(new Event('input', { bubbles: true }));

                // 3) 模擬「點到 → 離開」以觸發自動上傳
                translatedArea.focus();
                // 用 setTimeout 保證事件順序：先 focus，再 blur
                setTimeout(() => translatedArea.blur(), 0);

                // 4) UI 標示
                confirmBtn.textContent = '已載入';
                confirmBtn.classList.add('disabled');
            };

            // 插入到右側 col-md-6 的最下方
            const rightCol = block.querySelector('.col-md-6');
            rightCol.appendChild(loadDiv);
        }
        // 更新文字
        loadDiv.querySelector('.loaded_textarea').value = piece;
    }

    /* ---------- 啟動監聽 ---------- */
    new MutationObserver(setup).observe(document, { childList: true, subtree: true });
    setup();
})();