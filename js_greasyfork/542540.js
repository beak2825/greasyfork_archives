// ==UserScript==
// @name         Auto Tags Filler for Iromirai & Chichi-pui
// @name:ja      タグ入力補助 for イロミライ＆ちちぷい
// @description    Auto-fills tags for Iromirai & Chichi-pui.
// @description:ja イロミライとちちぷいのタグ入力を補助します。
// @namespace    https://bsky.app/profile/neon-ai.art
// @homepage     https://bsky.app/profile/neon-ai.art
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛄️</text></svg>
// @version     7.3
// @author       ねおん
// @match        https://iromirai.jp/user/post*
// @match        https://www.chichi-pui.com/posts/upload*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/542540/Auto%20Tags%20Filler%20for%20Iromirai%20%20Chichi-pui.user.js
// @updateURL https://update.greasyfork.org/scripts/542540/Auto%20Tags%20Filler%20for%20Iromirai%20%20Chichi-pui.meta.js
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2024 ねおん (Neon)
 * Released under the CC BY-NC 4.0 License.
 * * [EN] Unauthorized re-uploading, modification of authorship, or removal of 
 * author credits is strictly prohibited. If you fork this project, you MUST 
 * retain the original credits.
 * * [JP] 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布する場合は、必ず元の作者名（ねおん）を明記してください。
 * ==============================================================================
 */

(function() {
    'use strict';

    // --- 設定関連 ---
    // exportFileNameはGM_configには直接関係しないが、エクスポート機能のために残す
    const exportFileName = 'tags_filler.json';

    // DOM要素はサイトごとに動的に設定
    let themeTagInput;
    let addButton;

    const hostname = window.location.hostname;

    if (hostname.includes('iromirai.jp')) {
        themeTagInput = document.getElementById('themeTagText');
        addButton = document.querySelector('.postmedia-mobile-addtag-button');
    } else if (hostname.includes('chichi-pui.com')) {
        themeTagInput = document.querySelector('input.input[placeholder*="タグを入力"]');
        addButton = document.querySelector('button.button.is-dark.ml-2[type="button"]');
    } else {
        console.error('このスクリプトはIromiraiまたはChichi-puiでのみ動作します。');
        return;
    }

    if (!themeTagInput || !addButton) {
        console.error('必要な要素が見つかりません。スクリプトを終了します。');
        return;
    }

    const ENABLE_TEXTFILL_INTEGRATION = false; // TextFill連携機能の有効/無効 (true:有効, false:無効)
    const ENABLE_IN_SCRIPT_TAG_MANAGEMENT = true; // スクリプト内タグ管理機能の有効/無効 (true:有効, false:無効)

    // ユーザー定義テンプレートの初期データ（GM_configにデータがない場合にロードされる）
    const DEFAULT_USER_TEMPLATES = [
        { name: "基本タグ", tags: "イラスト,AI生成,可愛い" },
        { name: "風景タグ", tags: "風景,空,自然" },
        { name: "キャラクター", tags: "女の子,オリジナル,ファンタジー" }
    ];

    let currentTemplates = []; // 現在のテンプレートリスト

    let isProcessing = false; // 二重実行防止フラグ
    let changeTimer = null;
    let isButtonTriggeredTextFill = false; // ボタンからのTextFillトリガー中を示すフラグ
    let isComposing = false; // IME変換中フラグ

    // --- GM_configの初期化 ---
    GM_config.init({
        'id': 'IromiraiChichiPuiConfig', // 設定を保存するためのユニークなID
        'title': 'テーマタグ設定', // 設定パネルのタイトル
        'fields': {
            'userTemplates': {
                'label': 'ユーザーテンプレート',
                'type': 'hidden', // UIには表示しないが、データはここに保存される
                'default': JSON.stringify(DEFAULT_USER_TEMPLATES)
            }
        },
        'events': {
            'save': function() {
                // GM_configが保存されたときに、内部のcurrentTemplatesを更新
                // ただし、このスクリプトはUIから直接GM_configを操作しないため、主にGM_config.set()の後に呼ばれる想定
                loadTemplatesFromGMConfig();
            }
        }
    });

    // --- テンプレートをグローバルに読み込む関数 ---
    function loadTemplatesFromGMConfig() {
        try {
            // グローバルキーを使用してテンプレートを読み込む
            const storedData = GM_getValue('global_user_templates', JSON.stringify(DEFAULT_USER_TEMPLATES));
            const parsedData = JSON.parse(storedData);

            if (Array.isArray(parsedData) && parsedData.every(t => typeof t.name === 'string' && typeof t.tags === 'string')) {
                currentTemplates = parsedData;
            } else {
                console.warn("グローバルストレージのテンプレートデータが不正なため、デフォルトをロードします。");
                currentTemplates = DEFAULT_USER_TEMPLATES;
                saveTemplatesToGMConfig(); // 不正な場合はデフォルトを保存し直す
            }
        } catch (e) {
            console.error("グローバルストレージからのテンプレート読み込みに失敗しました:", e);
            currentTemplates = DEFAULT_USER_TEMPLATES;
            saveTemplatesToGMConfig(); // エラー時はデフォルトを保存
        }
        console.log("ロードされたテンプレート:", currentTemplates);
    }

    // --- テンプレートをグローバルに保存する関数 ---
    function saveTemplatesToGMConfig() {
        try {
            // グローバルキーを使用してテンプレートを保存する
            GM_setValue('global_user_templates', JSON.stringify(currentTemplates));
            console.log("テンプレートをグローバルストレージに保存しました。");
        } catch (e) {
            console.error("グローバルストレージへのテンプレート保存に失敗しました:", e);
        }
    }

    // スクリプト起動時にテンプレートをロード
    if (ENABLE_IN_SCRIPT_TAG_MANAGEMENT) {
        loadTemplatesFromGMConfig();
    }

    // --- タグ追加処理の関数 (自動確定用) ---
    async function processTagsAutomatically() {
        if (isProcessing) {
            console.log('既に処理中です。');
            return;
        }
        isProcessing = true;

        const rawTagsString = themeTagInput.value;
        if (!rawTagsString.trim() || rawTagsString.trim() === '/') {
            console.log('タグ入力フォームが空か、TextFillトリガー文字のみです。自動処理をスキップします。');
            isProcessing = false;
            return;
        }

        let tagsToEnter = rawTagsString.split(/[、,　 ]+/).map(tag => tag.trim()).filter(tag => tag !== '');
        if (tagsToEnter.length === 0) {
            console.log('有効なタグが見つかりませんでした。自動処理をスキップします。');
            isProcessing = false;
            return;
        }

        console.log('自動タグ入力処理を開始します。');
        const initialDelayTime = 200;
        console.log('初回処理開始前：遅延 (' + initialDelayTime + 'ms)');
        await new Promise(resolve => setTimeout(resolve, initialDelayTime));
        themeTagInput.value = '';
        themeTagInput.dispatchEvent(new Event('input', { bubbles: true }));
        themeTagInput.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 50));
        for (let i = 0; i < tagsToEnter.length; i++) {
            const tag = tagsToEnter[i];
            themeTagInput.value = tag;
            themeTagInput.dispatchEvent(new Event('input', { bubbles: true }));
            themeTagInput.dispatchEvent(new Event('change', { bubbles: true }));

            addButton.click();
            const loopDelayTime = 100;
            console.log('各タグ追加：短めの遅延 (' + loopDelayTime + 'ms)');
            await new Promise(resolve => setTimeout(resolve, loopDelayTime));
        }
        console.log('自動タグ入力処理が完了しました。');
        isProcessing = false;
    }

    // --- UIコンポーネントの作成と配置 ---
    let triggerTextFillButton;
    if (ENABLE_TEXTFILL_INTEGRATION) {
        triggerTextFillButton = document.createElement('button');
        triggerTextFillButton.textContent = 'TextFill';
        triggerTextFillButton.style.cssText = 'position:fixed; bottom:50px; right:10px; z-index:9999; padding:10px; background-color:#800080; color:white; border:none; border-radius:5px; cursor:pointer; font-size: 0.9em;';
        document.body.appendChild(triggerTextFillButton);
    }

    let manageTemplatesButton;
    let managePanel;
    let h3TemplateList;
    let filterInput;
    let templateItemsScrollArea;
    let addFormContainer;
    let addTemplateNameInput;
    let addTemplateTagsInput;
    let addTemplateButton;
    let bottomButtonContainer;
    let addTagButton;
    let exportTagsButton;
    let importTagsButton;

    if (ENABLE_IN_SCRIPT_TAG_MANAGEMENT) {
        manageTemplatesButton = document.createElement('button');
        manageTemplatesButton.textContent = 'タグ管理';
        manageTemplatesButton.style.cssText = 'position:fixed; bottom:95px; right:10px; z-index:9999; padding:10px; background-color:#337ab7; color:white; border:none; border-radius:5px; cursor:pointer; font-size: 0.9em;';
        document.body.appendChild(manageTemplatesButton);

        managePanel = document.createElement('div');
        managePanel.style.cssText = `
            position:fixed; bottom:140px; right:10px; z-index:9999;
            background-color:white; border:1px solid #ccc; border-radius:5px;
            padding:15px; display:none; flex-direction:column; gap:10px;
            width: 350px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            max-height: calc(100vh - 150px);
            resize: vertical;
            overflow: hidden;
        `;
        document.body.appendChild(managePanel);

        h3TemplateList = document.createElement('h3');
        h3TemplateList.textContent = 'マイテーマタグ';
        managePanel.appendChild(h3TemplateList);

        filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.id = 'templateFilterInput';
        filterInput.placeholder = 'フィルター (名前、タグ)';
        filterInput.style.cssText = 'width:calc(100% - 2px); padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:3px;';
        managePanel.appendChild(filterInput);

        templateItemsScrollArea = document.createElement('div');
        templateItemsScrollArea.style.cssText = `
            flex-grow: 1;
            overflow-y: auto;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 10px;
            min-height: 50px;
        `;
        managePanel.appendChild(templateItemsScrollArea);

        addFormContainer = document.createElement('div');
        addFormContainer.style.cssText = 'padding-top: 10px; margin-top: 10px; display: none;';
        addFormContainer.innerHTML = `
            <label for="addTemplateNameInput">名前:</label><br>
            <input type="text" id="addTemplateNameInput" style="width:100%; padding:5px; margin-bottom:5px;"><br>
            <label for="addTemplateTagsInput">タグ (カンマ区切り):</label><br>
            <input type="text" id="addTemplateTagsInput" style="width:100%; padding:5px; margin-bottom:10px;"><br>
            <button id="addTemplateButton" style="padding:8px 15px; background-color:#5cb85c; color:white; border:none; border-radius:3px; cursor:pointer;">追加</button>
        `;
        managePanel.appendChild(addFormContainer);

        addTemplateNameInput = addFormContainer.querySelector('#addTemplateNameInput');
        addTemplateTagsInput = addFormContainer.querySelector('#addTemplateTagsInput');
        addTemplateButton = addFormContainer.querySelector('#addTemplateButton');

        bottomButtonContainer = document.createElement('div');
        bottomButtonContainer.style.cssText = `
            border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;
            display: flex; justify-content: space-between; flex-wrap: wrap;
            gap: 5px;
        `;
        managePanel.appendChild(bottomButtonContainer);

        addTagButton = document.createElement('button');
        addTagButton.textContent = 'タグ追加';
        addTagButton.style.cssText = 'padding:8px 15px; background-color:#6c757d; color:white; border:none; border-radius:3px; cursor:pointer; flex-grow:1; min-width:80px;';
        bottomButtonContainer.appendChild(addTagButton);

        exportTagsButton = document.createElement('button');
        exportTagsButton.textContent = 'エクスポート';
        exportTagsButton.style.cssText = 'padding:8px 15px; background-color:#007bff; color:white; border:none; border-radius:3px; cursor:pointer; margin-right: 5px; flex-grow:1; min-width:80px;';
        bottomButtonContainer.appendChild(exportTagsButton);

        importTagsButton = document.createElement('button');
        importTagsButton.textContent = 'インポート';
        importTagsButton.style.cssText = 'padding:8px 15px; background-color:#ffc107; color:black; border:none; border-radius:3px; cursor:pointer; flex-grow:1; min-width:80px;';
        bottomButtonContainer.appendChild(importTagsButton);

        const importTagsFile = document.createElement('input');
        importTagsFile.type = 'file';
        importTagsFile.id = 'importTagsFile';
        importTagsFile.accept = '.json';
        importTagsFile.style.display = 'none';
        bottomButtonContainer.appendChild(importTagsFile);

        addTagButton.addEventListener('click', () => {
            const isVisible = addFormContainer.style.display === 'block';
            addFormContainer.style.display = isVisible ? 'none' : 'block';
            addTagButton.textContent = isVisible ? 'タグ追加' : 'タグ追加 ▲';
            adjustPanelHeight();
            if (!isVisible) {
                addTemplateNameInput.focus();
            }
        });

        importTagsButton.addEventListener('click', () => {
            importTagsFile.click();
        });

        importTagsFile.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const rawData = JSON.parse(e.target.result);
                    let importedData = [];

                    if (typeof rawData === 'object' && !Array.isArray(rawData) && Object.keys(rawData).every(key => key.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))) {
                        console.log("TextFill形式のデータを検出しました。");
                        importedData = Object.values(rawData).map(item => {
                            let tags = '';
                            try {
                                if (typeof item.script === 'string') {
                                    let scriptContent;
                                    try {
                                        scriptContent = JSON.parse(item.script);
                                    } catch (innerParseError) {
                                        scriptContent = item.script;
                                    }
                                    if (Array.isArray(scriptContent) && scriptContent.length > 0 && scriptContent[0] && typeof scriptContent[0].insert === 'string') {
                                        tags = scriptContent[0].insert.replace(/\\n/g, ', ').trim();
                                        if (tags.endsWith(',')) tags = tags.slice(0, -1).trim();
                                    } else if (typeof scriptContent === 'string') {
                                        tags = scriptContent.replace(/\\n/g, ', ').trim();
                                        if (tags.endsWith(',')) tags = tags.slice(0, -1).trim();
                                    } else {
                                        tags = item.script;
                                    }
                                } else {
                                    if (Array.isArray(item.script) && item.script.length > 0 && item.script[0] && typeof item.script[0].insert === 'string') {
                                        tags = item.script[0].insert.replace(/\\n/g, ', ').trim();
                                        if (tags.endsWith(',')) tags = tags.slice(0, -1).trim();
                                    } else {
                                        tags = item.script;
                                    }
                                }
                            } catch (parseError) {
                                console.warn(`TextFillスクリプトのパースに失敗しました (${item.label || item.command}):`, parseError);
                                tags = item.script;
                            }
                            return { name: item.label || item.command || '不明なタグ', tags: tags };
                        });
                    } else if (Array.isArray(rawData) && rawData.every(t => typeof t.name === 'string' && typeof t.tags === 'string')) {
                        console.log("iromirai形式のデータを検出しました。");
                        importedData = rawData;
                    } else {
                        throw new Error("対応していないJSON形式です。TextFillのエクスポートデータか、このスクリプトでエクスポートしたJSONファイルを指定してください。");
                    }

                    const newTemplates = [...currentTemplates];
                    let importedCount = 0;
                    let updatedCount = 0;

                    importedData.forEach(importedTemplate => {
                        const existingIndex = newTemplates.findIndex(t => t.name === importedTemplate.name);
                        if (existingIndex !== -1) {
                            newTemplates[existingIndex] = importedTemplate;
                            updatedCount++;
                        } else {
                            newTemplates.push(importedTemplate);
                            importedCount++;
                        }
                    });

                    currentTemplates = newTemplates;
                    saveTemplatesToGMConfig();
                    renderTemplateList();
                    alert(`テーマタグのインポートが完了しました！\n新規追加: ${importedCount}件, 更新: ${updatedCount}件`);
                } catch (e) {
                    alert('ファイルの読み込みまたはパースに失敗しました。\nエラー: ' + e.message);
                    console.error('インポートエラー:', e);
                } finally {
                    event.target.value = '';
                }
            };
            reader.readAsText(file);
        });
    }

    // --- パネルの高さ調整関数 ---
    function adjustPanelHeight() {
        if (!ENABLE_IN_SCRIPT_TAG_MANAGEMENT) return;
        const originalDisplay = managePanel.style.display;
        managePanel.style.display = 'block';
        managePanel.style.height = 'auto';

        let fixedHeight = 0;
        fixedHeight += h3TemplateList.offsetHeight +
                       parseInt(getComputedStyle(h3TemplateList).marginTop) +
                       parseInt(getComputedStyle(h3TemplateList).marginBottom);
        fixedHeight += filterInput.offsetHeight +
                       parseInt(getComputedStyle(filterInput).marginTop) +
                       parseInt(getComputedStyle(filterInput).marginBottom);
        fixedHeight += bottomButtonContainer.offsetHeight +
                       parseInt(getComputedStyle(bottomButtonContainer).marginTop) +
                       parseInt(getComputedStyle(bottomButtonContainer).paddingTop);
        fixedHeight += parseInt(getComputedStyle(managePanel).paddingTop) +
                       parseInt(getComputedStyle(managePanel).paddingBottom);

        if (addFormContainer.style.display === 'block') {
            fixedHeight += addFormContainer.offsetHeight;
        }

        const newTemplateListMaxHeight = `calc(100vh - ${fixedHeight + 140}px)`;
        templateItemsScrollArea.style.maxHeight = newTemplateListMaxHeight;
        templateItemsScrollArea.style.height = 'auto';

        managePanel.style.display = originalDisplay;
    }

    // --- イベントハンドラの定義 ---

    // TextFillボタンクリック処理
    if (ENABLE_TEXTFILL_INTEGRATION) {
        triggerTextFillButton.onclick = () => {
            isButtonTriggeredTextFill = true;
            themeTagInput.value = '/';
            themeTagInput.dispatchEvent(new Event('input', { bubbles: true }));
            themeTagInput.dispatchEvent(new Event('change', { bubbles: true }));

            console.log('TextFillメニューをトリガーしました。手動で選択してください。');
            themeTagInput.focus();

            const tempInputListener = () => {
                if (themeTagInput.value.length > 1 && themeTagInput.value.trim() !== '/') {
                    themeTagInput.removeEventListener('input', tempInputListener);
                    console.log('TextFillがタグの展開を開始しました。自動確定を待機します。');
                    setTimeout(() => {
                        if (!isProcessing) {
                            processTagsAutomatically();
                        }
                        isButtonTriggeredTextFill = false;
                    }, 1000);
                }
            };
            themeTagInput.addEventListener('input', tempInputListener);

            setTimeout(() => {
                if (isButtonTriggeredTextFill && themeTagInput.value.trim() === '/') {
                    console.log("TextFillが使用されなかったため、ボタントリガーフラグをリセットします。");
                    isButtonTriggeredTextFill = false;
                    themeTagInput.removeEventListener('input', tempInputListener);
                }
            }, 5000);
        };
    }

    // タグ管理ボタンクリックでパネル表示/非表示
    if (ENABLE_IN_SCRIPT_TAG_MANAGEMENT) {
        manageTemplatesButton.onclick = () => {
            const isPanelVisible = managePanel.style.display === 'flex';
            managePanel.style.display = isPanelVisible ? 'none' : 'flex';

            if (!isPanelVisible) {
                addFormContainer.style.display = 'none';
                addTagButton.textContent = 'タグ追加';
                // GM_configから最新のデータをロードしてからリストをレンダリング
                loadTemplatesFromGMConfig();
                renderTemplateList();
                resetAddForm();
                adjustPanelHeight();
            }
        };

        function handleFilterInput() {
            if (!isComposing) {
                renderTemplateList();
            }
        }

        function compositionStartHandler() {
            isComposing = true;
        }

        function compositionEndHandler() {
            isComposing = false;
            renderTemplateList();
        }

        filterInput.addEventListener('input', handleFilterInput);
        filterInput.addEventListener('compositionstart', compositionStartHandler);
        filterInput.addEventListener('compositionend', compositionEndHandler);

        // ヘルパー関数：クリックされた要素が特定のコントロールボタンかどうかを判定
        function isControlButtonClicked(targetElement) {
            // 共通のコントロール
            let isCommonControl = targetElement.closest('.save-in-line-edit-btn') ||
                                  targetElement.closest('.cancel-in-line-edit-btn') ||
                                  targetElement.closest('.delete-template-btn') ||
                                  targetElement.closest('#exportTagsButton') ||
                                  targetElement.closest('#importTagsButton') ||
                                  targetElement.closest('.apply-template-btn');

            if (isCommonControl) return true;

            // サイト固有の追加ボタン
            if (hostname.includes('iromirai.jp')) {
                return targetElement.closest('.postmedia-mobile-addtag-button');
            } else if (hostname.includes('chichi-pui.com')) {
                return targetElement.closest('button.button.is-dark.ml-2[type="button"]');
            }
            return false;
        }

        // ドキュメント全体へのクリックリスナー
        document.addEventListener('click', (event) => {
            if (managePanel.style.display === 'flex' &&
                !managePanel.contains(event.target) &&
                event.target !== manageTemplatesButton &&
                event.target !== addTagButton &&
                !addFormContainer.contains(event.target) &&
                !isControlButtonClicked(event.target)) {
                managePanel.style.display = 'none';
            }
        });
    }

    // --- テンプレート一覧をレンダリングする関数 ---
    let draggedItem = null;
    function renderTemplateList() {
        if (!ENABLE_IN_SCRIPT_TAG_MANAGEMENT) return;

        let wasFilterInputFocused = (document.activeElement === filterInput);
        let selectionStart = 0;
        let selectionEnd = 0;

        if (wasFilterInputFocused) {
            selectionStart = filterInput.selectionStart;
            selectionEnd = filterInput.selectionEnd;
        }

        templateItemsScrollArea.innerHTML = '';

        if (wasFilterInputFocused) {
            filterInput.focus();
            filterInput.setSelectionRange(selectionStart, selectionEnd);
        }

        const filterText = filterInput.value;
        const lowerCaseFilter = filterText.toLowerCase();

        const filteredTemplates = currentTemplates.filter(template => {
            return template.name.toLowerCase().includes(lowerCaseFilter) ||
                   template.tags.toLowerCase().includes(lowerCaseFilter);
        });
        if (filteredTemplates.length === 0) {
            const noMatchP = document.createElement('p');
            noMatchP.textContent = '条件に一致するテーマタグが見つかりません。';
            templateItemsScrollArea.appendChild(noMatchP);
            if (currentTemplates.length === 0 && !filterText) {
                const addPromptP = document.createElement('p');
                addPromptP.textContent = '以下の「タグ追加」ボタンから追加してください。';
                templateItemsScrollArea.appendChild(addPromptP);
            }
        } else {
            const ul = document.createElement('ul');
            ul.style.cssText = 'list-style:none; padding:0;';
            filteredTemplates.forEach((template, index) => {
                const originalIndex = currentTemplates.findIndex(t => t.name === template.name && t.tags === template.tags);
                if (originalIndex === -1) return;

                const li = document.createElement('li');
                li.setAttribute('draggable', 'true');
                li.dataset.index = originalIndex;
                li.style.cssText = `
                    margin-bottom:8px; padding:8px; border:1px solid #eee; border-radius:5px;
                    display:flex; flex-direction:column; gap:5px; background-color: #f9f9f9;
                    cursor: grab;
                `;

                const nameDisplay = document.createElement('div');
                nameDisplay.className = 'template-name-display';
                nameDisplay.style.fontWeight = 'bold';
                nameDisplay.textContent = template.name;

                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.className = 'template-name-input';
                nameInput.style.cssText = 'width:100%; padding:5px; margin-bottom:5px; display:none;';
                nameInput.value = template.name;

                const tagsDisplay = document.createElement('div');
                tagsDisplay.className = 'template-tags-display';
                tagsDisplay.style.cssText = 'font-size:0.9em; color:#555; display:none;';
                tagsDisplay.textContent = template.tags;

                const tagsInput = document.createElement('input');
                tagsInput.type = 'text';
                tagsInput.className = 'template-tags-input';
                tagsInput.style.cssText = 'width:100%; padding:5px; margin-bottom:10px; display:none;';
                tagsInput.value = template.tags;

                const buttonContainer = document.createElement('div');
                buttonContainer.style.textAlign = 'right';

                const applyButton = document.createElement('button');
                applyButton.textContent = '適用';
                applyButton.className = 'apply-template-btn';
                applyButton.style.cssText = 'padding:5px 10px; background-color:#28a745; color:white; border:none; border-radius:3px; cursor:pointer; font-size:0.8em; margin-right:5px;';
                const editButton = document.createElement('button');
                editButton.textContent = '編集';
                editButton.className = 'edit-template-btn';
                editButton.style.cssText = 'padding:5px 10px; background-color:#0275d8; color:white; border:none; border-radius:3px; cursor:pointer; font-size:0.8em;';
                const saveButton = document.createElement('button');
                saveButton.textContent = '保存';
                saveButton.className = 'save-in-line-edit-btn';
                saveButton.style.cssText = 'padding:5px 10px; background-color:#5cb85c; color:white; border:none; border-radius:3px; cursor:pointer; font-size:0.8em; margin-right:5px; display:none;';

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'キャンセル';
                cancelButton.className = 'cancel-in-line-edit-btn';
                cancelButton.style.cssText = 'padding:5px 10px; background-color:#f0ad4e; color:white; border:none; border-radius:3px; cursor:pointer; font-size:0.8em; margin-right:5px; display:none;';


                const deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.className = 'delete-template-btn';
                deleteButton.style.cssText = 'padding:5px 10px; background-color:#d9534f; color:white; border:none; border-radius:3px; cursor:pointer; font-size:0.8em; margin-left:5px;';

                li.appendChild(nameDisplay);
                li.appendChild(nameInput);
                li.appendChild(tagsDisplay);
                li.appendChild(tagsInput);
                buttonContainer.appendChild(applyButton);
                buttonContainer.appendChild(editButton);
                buttonContainer.appendChild(saveButton);
                buttonContainer.appendChild(cancelButton);
                buttonContainer.appendChild(deleteButton);
                li.appendChild(buttonContainer);

                ul.appendChild(li);
            });
            templateItemsScrollArea.appendChild(ul);
            ul.querySelectorAll('.apply-template-btn').forEach(button => {
                button.onclick = (e) => applyTemplate(parseInt(e.target.closest('li').dataset.index));
            });
            ul.querySelectorAll('.delete-template-btn').forEach(button => {
                button.onclick = (e) => deleteTemplate(parseInt(e.target.closest('li').dataset.index));
            });
            ul.querySelectorAll('.edit-template-btn').forEach(button => {
                button.onclick = (e) => {
                    const li = e.target.closest('li');
                    const index = parseInt(li.dataset.index);
                    const template = currentTemplates[index];

                    li.querySelector('.template-name-display').style.display = 'none';
                    li.querySelector('.template-tags-display').style.display = 'none';
                    li.querySelector('.template-name-input').style.display = 'block';
                    li.querySelector('.template-tags-input').style.display = 'block';

                    li.querySelector('.template-name-input').value = template.name;
                    li.querySelector('.template-tags-input').value = template.tags;

                    li.querySelector('.apply-template-btn').style.display = 'none';
                    li.querySelector('.edit-template-btn').style.display = 'none';
                    li.querySelector('.delete-template-btn').style.display = 'none';
                    li.querySelector('.save-in-line-edit-btn').style.display = 'inline-block';
                    li.querySelector('.cancel-in-line-edit-btn').style.display = 'inline-block';

                    li.querySelector('.template-name-input').focus();
                };
            });
            ul.querySelectorAll('.save-in-line-edit-btn').forEach(button => {
                button.onclick = (e) => {
                    const li = e.target.closest('li');
                    const index = parseInt(li.dataset.index);
                    const newName = li.querySelector('.template-name-input').value.trim();
                    const newTags = li.querySelector('.template-tags-input').value.trim();

                    if (!newName || !newTags) {
                        alert('テーマタグ名とタグを入力してください。');
                        return;
                    }

                    if (currentTemplates.some((t, i) => i !== index && t.name === newName)) {
                        alert('同じテーマタグ名が既に存在します。別の名前を入力してください。');
                        return;
                    }

                    currentTemplates[index] = { name: newName, tags: newTags };
                    saveTemplatesToGMConfig();
                    renderTemplateList();
                };
            });
            ul.querySelectorAll('.cancel-in-line-edit-btn').forEach(button => {
                button.onclick = (e) => {
                    renderTemplateList();
                };
            });
            ul.querySelectorAll('li').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    if (item.querySelector('.template-name-input').style.display === 'block') {
                        e.preventDefault();
                        return;
                    }
                    draggedItem = item;
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', item.innerHTML);
                    setTimeout(() => {
                        item.style.opacity = '0.5';
                    }, 0);
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    if (item !== draggedItem) {
                        const bounding = item.getBoundingClientRect();
                        const offset = bounding.y + (bounding.height / 2);
                        if (e.clientY > offset) {
                            item.style.borderBottom = '2px solid blue';
                            item.style.borderTop = '';
                        } else {
                            item.style.borderTop = '2px solid blue';
                            item.style.borderBottom = '';
                        }
                    }
                });
                item.addEventListener('dragleave', () => {
                    item.style.borderTop = '';
                    item.style.borderBottom = '';
                });
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (item !== draggedItem) {
                        const draggedIndex = parseInt(draggedItem.dataset.index);
                        const targetIndex = parseInt(item.dataset.index);

                        const [removed] = currentTemplates.splice(draggedIndex, 1);
                        const bounding = item.getBoundingClientRect();
                        const offset = bounding.y + (bounding.height / 2);

                        let insertIndex;
                        if (e.clientY > offset) {
                            insertIndex = targetIndex + (draggedIndex < targetIndex ? 0 : 1);
                        } else {
                            insertIndex = targetIndex + (draggedIndex < targetIndex ? 0 : 0);
                        }
                        currentTemplates.splice(insertIndex, 0, removed);
                        saveTemplatesToGMConfig();
                        renderTemplateList();
                    }
                });
                item.addEventListener('dragend', () => {
                    ul.querySelectorAll('li').forEach(li => {
                        li.style.opacity = '1';
                        li.style.borderTop = '';
                        li.style.borderBottom = '';
                    });
                    draggedItem = null;
                });
            });
        }
        adjustPanelHeight();
    }

    // --- テンプレートの適用関数 ---
    function applyTemplate(index) {
        if (!ENABLE_IN_SCRIPT_TAG_MANAGEMENT) return;
        const template = currentTemplates[index];
        themeTagInput.value = template.tags;
        if (!isProcessing) {
            processTagsAutomatically();
        }
    }

    // --- 新規テンプレートの追加関数 ---
    if (ENABLE_IN_SCRIPT_TAG_MANAGEMENT) {
        addTemplateButton.onclick = () => {
            const name = addTemplateNameInput.value.trim();
            const tags = addTemplateTagsInput.value.trim();

            if (!name || !tags) {
                alert('テーマタグ名とタグを入力してください。');
                return;
            }

            if (currentTemplates.some(t => t.name === name)) {
                alert('同じテーマタグ名が既に存在します。別の名前を入力してください。');
                return;
            }

            currentTemplates.push({ name, tags });
            console.log("新規テーマタグを追加しました:", { name, tags });

            saveTemplatesToGMConfig();
            renderTemplateList();
            resetAddForm();

            const lastItem = templateItemsScrollArea.querySelector('ul > li:last-child');
            if (lastItem) {
                lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        };
    }

    // --- 追加フォームをリセットする関数 ---
    function resetAddForm() {
        if (!ENABLE_IN_SCRIPT_TAG_MANAGEMENT) return;
        addTemplateNameInput.value = '';
        addTemplateTagsInput.value = '';
    }

    // --- テンプレートを削除する関数 ---
    function deleteTemplate(index) {
        if (!ENABLE_IN_SCRIPT_TAG_MANAGEMENT) return;
        if (confirm(`「${currentTemplates[index].name}」を削除してもよろしいですか？`)) {
            currentTemplates.splice(index, 1);
            saveTemplatesToGMConfig();
            renderTemplateList();
            console.log("テーマタグを削除しました。");
            adjustPanelHeight();
        }
    }

    // --- エクスポート機能 ---
    if (ENABLE_IN_SCRIPT_TAG_MANAGEMENT) {
        exportTagsButton.onclick = () => {
            const dataStr = JSON.stringify(currentTemplates, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = exportFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    }

    // --- その他のイベントリスナー ---

    // themeTagInput の change イベントを監視 (手動入力や、TextFillがchangeを発火した場合用)
    themeTagInput.addEventListener('change', () => {
        if (isButtonTriggeredTextFill) {
            console.log("Changeイベント: ボタンからのTextFillトリガー中のため、changeイベントの自動確定はスキップします。");
            return;
        }

        if (changeTimer) clearTimeout(changeTimer);

        changeTimer = setTimeout(() => {
            if (themeTagInput.value.trim() === '/' || themeTagInput.value.trim() === '') {
                 console.log("Changeイベント: TextFillトリガー文字または空値が検出されました。自動確定はスキップします.");
                 return;
            }
            if (!isProcessing) {
                processTagsAutomatically();
            }
        }, 100);
    });

    // ページロード時に既に値が入っている場合（TextFillが自動で展開するなど）
    if (themeTagInput.value.trim() !== '') {
        setTimeout(() => {
            if (themeTagInput.value.trim() !== '/') {
                if (!isProcessing) {
                    processTagsAutomatically();
                }
            }
        }, 500);
    }
})();