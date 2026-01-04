// ==UserScript==
// @name         Bangumi jump to multiple sites
// @namespace    http://tampermonkey.net/
// @version      0.9.5.6
// @description  在Bangumi游戏条目上添加实用的按钮
// @author       Sedoruee
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in).*/
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526830/Bangumi%20jump%20to%20multiple%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/526830/Bangumi%20jump%20to%20multiple%20sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const subjectType = document.querySelector('.nameSingle > .grey')?.textContent;
    const gameTitle = document.querySelector('.nameSingle > a')?.textContent;

    if (subjectType === '游戏' && gameTitle) {
        const nameSingle = document.querySelector('.nameSingle');

        GM_addStyle(`
            .combined-button, .multisearch-select-container .combined-button, .jump-button {
                display: inline-flex;
                align-items: center;
                margin-left: 5px;
                border: 1px solid #ccc;
                border-radius: 3px;
                background-color: #f0f0f0;
                color: black;
                font-size: 14px;
                cursor: pointer;
                height: 32px;
                box-sizing: border-box;
                overflow: hidden;
            }

            .button-name {
                padding: 5px 10px;
                border: none;
                background-color: transparent;
                color: inherit;
                font-size: inherit;
                cursor: pointer;
                text-align: center;
                flex-grow: 1;
                flex-shrink: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                min-width: 50px;
            }

            .select-arrow {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                background-color: transparent;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                font-size: inherit;
                color: inherit;
                position: relative;
                z-index: 1;
                width: 20px;
                flex-shrink: 0;
                background-image: url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
                background-repeat: no-repeat;
                background-position: center;
                border-left: 1px solid #ddd;
                margin-left: 2px;
            }

            .select-arrow::-ms-expand {
                display: none;
            }

            .combined-button:hover, .multisearch-select-container .combined-button:hover, .jump-button:hover,
            .button-name:hover, .select-arrow:hover {
                background-color: #e0e0e0;
            }
            .combined-button:active, .multisearch-select-container .combined-button:active, .jump-button:active,
            .button-name:active, .select-arrow:active {
                background-color: #d0d0d0;
            }

            .jump-button {
                height: 32px;
                line-height: 32px;
                padding-top: 0;
                padding-bottom: 0;
                display: inline-flex;
                align-items: center;
                text-align: center;
            }

            .multisearch-select-container {
                display: inline-block;
                position: relative;
                margin-left: 5px;
            }

            .multisearch-select-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                z-index: 10;
                border: 1px solid #ccc;
                border-radius: 3px;
                background-color: white;
                padding: 5px 0;
                min-width: 150px;
                display: none;
            }

            .multisearch-select-dropdown.show {
                display: block;
            }

            .multisearch-select-dropdown label {
                display: block;
                padding: 5px 15px;
                cursor: pointer;
            }

            .multisearch-select-dropdown label:hover {
                background-color: #f0f0f0;
            }

            .settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border: 1px solid #ccc;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                z-index: 1000;
                max-height: 80vh;
                overflow-y: auto;
            }

            .settings-panel h2, .settings-panel h3 {
                margin-top: 0;
            }

            .settings-panel label {
                display: block;
                margin-bottom: 5px;
            }

            .settings-panel input[type="text"], .settings-panel input[type="url"], .settings-panel select {
                width: calc(100% - 10px);
                padding: 8px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                box-sizing: border-box;
            }

            .settings-panel button {
                padding: 8px 15px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 3px;
                cursor: pointer;
                margin-right: 5px;
            }

            .settings-panel button:hover {
                background-color: #e0e0e0;
            }

            .settings-panel-buttons {
                margin-bottom: 15px;
                border: 1px solid #eee;
                padding: 10px;
                border-radius: 5px;
            }
            .settings-panel-button-item {
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px dashed #eee;
            }
            .settings-panel-button-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            .settings-panel-button-actions {
                margin-top: 5px;
            }

            .settings-tutorial {
                margin-top: 20px;
                border-top: 1px solid #eee;
                padding-top: 15px;
            }

            .settings-tutorial h3 {
                margin-bottom: 10px;
            }

            .settings-tutorial p {
                line-height: 1.6;
            }
            .hidden {
                display: none !important;
            }
        `);

        const createButton = (buttonConfig) => {
            if (buttonConfig.type === 'jump') {
                return createJumpButton(buttonConfig);
            } else if (buttonConfig.type === 'combined') {
                return createCombinedButton(buttonConfig);
            } else if (buttonConfig.type === 'multisearch') {
                return createMultiSearchSelect(buttonConfig);
            }
            return null;
        };

        const createJumpButton = (buttonConfig) => {
            const button = document.createElement('button');
            button.textContent = buttonConfig.name;
            button.className = 'jump-button';
            button.addEventListener('click', () => {
                if (buttonConfig.clipboardText) {
                    GM_setClipboard(gameTitle);
                }
                window.open(buttonConfig.url.replace('{{gameTitle}}', encodeURIComponent(gameTitle)));
            });
            return button;
        };

        const createCombinedButton = (buttonConfig) => {
            const container = document.createElement('div');
            container.className = 'combined-button';

            const nameButton = document.createElement('button');
            nameButton.className = 'button-name';
            container.appendChild(nameButton);

            const selectArrow = document.createElement('select');
            selectArrow.className = 'select-arrow';
            container.appendChild(selectArrow);

            buttonConfig.options.forEach(site => {
                const option = document.createElement('option');
                option.value = site.value;
                option.text = site.text;
                selectArrow.appendChild(option);
            });

            const storedSite = GM_getValue(buttonConfig.storageKey, buttonConfig.defaultOption);
            selectArrow.value = storedSite;
            updateButtonName(nameButton, selectArrow.options[selectArrow.selectedIndex].text);

            selectArrow.addEventListener('change', function() {
                GM_setValue(buttonConfig.storageKey, this.value);
                updateButtonName(nameButton, this.options[this.selectedIndex].text);
            });

            nameButton.addEventListener('click', () => {
                const selectedOption = selectArrow.value;
                const selectedSiteOption = buttonConfig.options.find(opt => opt.value === selectedOption);
                if (selectedSiteOption) {
                    if (buttonConfig.clipboardText) {
                        GM_setClipboard(gameTitle);
                    }
                    window.open(selectedSiteOption.url.replace('{{gameTitle}}', encodeURIComponent(gameTitle)));
                }
            });
            selectArrow.addEventListener('click', function(event) {
                this.focus();
                event.stopPropagation();
            });
            container.addEventListener('click', function(event) {
                if (!container.contains(event.target)) {
                    selectArrow.blur();
                }
            });

            function updateButtonName(button, siteName) {
                button.textContent = siteName;
            }
            return container;
        };

        const createMultiSearchSelect = (buttonConfig) => {
            const container = document.createElement('div');
            container.className = 'multisearch-select-container';

            const buttonArea = document.createElement('div');
            buttonArea.className = 'combined-button';
            container.appendChild(buttonArea);

            const nameButton = document.createElement('button');
            nameButton.className = 'button-name';
            nameButton.textContent = buttonConfig.name;
            buttonArea.appendChild(nameButton);

            const selectArrow = document.createElement('button');
            selectArrow.className = 'select-arrow';
            buttonArea.appendChild(selectArrow);

            const dropdown = document.createElement('div');
            dropdown.className = 'multisearch-select-dropdown';
            dropdown.id = 'multisearchDropdown';
            container.appendChild(dropdown);

            const sites = buttonConfig.options;

            let storedMultiSearchSites = GM_getValue(buttonConfig.storageKey, sites.filter(site => site.checked).map(site => site.value).join(','));
            let selectedSitesValues = storedMultiSearchSites ? storedMultiSearchSites.split(',') : sites.filter(site => site.checked).map(site => site.value);

            sites.forEach(site => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = site.value;
                checkbox.checked = selectedSitesValues.includes(site.value);

                checkbox.addEventListener('change', function() {
                    let currentSelectedValues = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
                    GM_setValue(buttonConfig.storageKey, currentSelectedValues.join(','));
                });

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + site.text));
                dropdown.appendChild(label);
            });

            selectArrow.addEventListener('click', function(event) {
                dropdown.classList.toggle('show');
                event.stopPropagation();
            });
            nameButton.addEventListener('click', () => {
                openPreviewWindowsWithDelay(buttonConfig, gameTitle, container, 500); // 延迟 500ms 打开
            });

            document.addEventListener('click', function(event) {
                if (!container.contains(event.target)) {
                    dropdown.classList.remove('show');
                }
            });
            return container;
        };

        // 修改后的延迟打开函数
        function openPreviewWindowsWithDelay(buttonConfig, gameTitle, multiSearchSelectContainer, delay) {
            setTimeout(() => {
                openPreviewWindows(buttonConfig, gameTitle, multiSearchSelectContainer);
            }, delay);
        }

        function openPreviewWindows(buttonConfig, gameTitle, multiSearchSelectContainer) {
            closePreviewWindows();

            const dropdownElement = multiSearchSelectContainer.querySelector('.multisearch-select-dropdown');
            const selectedCheckboxes = dropdownElement.querySelectorAll('input[type="checkbox"]:checked');
            const selectedSitesValues = Array.from(selectedCheckboxes).map(cb => cb.value);

            const sites = buttonConfig.options.filter(site => selectedSitesValues.includes(site.value));
            const urls = sites.map(site => site.url.replace('{{gameTitle}}', encodeURIComponent(gameTitle)));

            if (urls.length === 0) {
                alert("请选择至少一个多搜索站点。");
                return;
            }

            const gap = 10;
            const winWidth = Math.floor(screen.width / urls.length);
            const winHeight = 1600;
            const totalWidth = winWidth * urls.length + gap * (urls.length -1 );
            const leftStart = Math.floor((screen.width - totalWidth) / 2);
            const topPos = Math.floor((screen.height - winHeight) / 2);

            previewWindows = [];
            urls.forEach((url, index) => {
                const leftPos = leftStart + index * (winWidth + gap);
                const features = `width=${winWidth},height=${winHeight},left=${leftPos},top=${topPos},resizable=yes,scrollbars=yes`;
                const newWin = window.open(url, '_blank', features);
                if (newWin) {
                    previewWindows.push(newWin);
                    newWin.onload = () => {
                        newWin.document.addEventListener('click', function(event) {
                            if (event.target.tagName === 'A') {
                                event.preventDefault();
                                const href = event.target.href;
                                closePreviewWindows();
                                window.open(href, '_blank');
                            }
                        });
                    };
                } else {
                    console.warn("弹窗被拦截，无法打开：", url);
                }
            });

            focusMonitorDelayTimer = setTimeout(() => {
                startFocusMonitor();
            }, 2000);
        }

        let previewWindows = [];
        let monitorInterval = null;
        let focusMonitorDelayTimer = null;

        function closePreviewWindows() {
            stopFocusMonitor();
            if (focusMonitorDelayTimer) {
                clearTimeout(focusMonitorDelayTimer);
                focusMonitorDelayTimer = null;
            }
            previewWindows.forEach(win => {
                if (win && !win.closed) {
                    win.close();
                }
            });
            previewWindows = [];
        }

        function startFocusMonitor() {
            if (!monitorInterval) {
                monitorInterval = setInterval(monitorFocus, 300);
            }
        }

        function stopFocusMonitor() {
            if (monitorInterval) {
                clearInterval(monitorInterval);
                monitorInterval = null;
            }
        }

        function monitorFocus() {
            for (let i = 0; i < previewWindows.length; i++) {
                if (previewWindows[i] && previewWindows[i].closed) {
                    closePreviewWindows();
                    return;
                }
            }
            if (!document.hasFocus()) {
                let previewWindowFocused = false;
                for (let win of previewWindows) {
                    if (win && !win.closed && win.document.hasFocus()) {
                        previewWindowFocused = true;
                        break;
                    }
                }
                if (!previewWindowFocused) {
                    closePreviewWindows();
                }
            }
        }

        function loadButtonSettings() {
            return GM_getValue('customButtons', [
                { type: 'jump', name: 'VNDB', url: 'https://vndb.org/v?q={{gameTitle}}' },
                { type: 'jump', name: 'Hitomi', url: 'https://hitomi.la/search.html?type%3Agamecg%20{{gameTitle}}%20orderby%3Apopular%20orderbykey%3Ayear', processTitle: 'hitomi' },
                {
                    type: 'combined',
                    name: '魔皇/zi0',
                    storageKey: 'selectedSite',
                    defaultOption: 'mhdy',
                    clipboardText: true,
                    options: [
                        { value: 'mhdy', text: '魔皇地狱', url: 'https://pan1.mhdy.shop/' },
                        { value: 'zi0', text: 'zi0.cc', url: 'https://zi0.cc/' }
                    ]
                },
                { type: 'jump', name: '2dfan', clipboardText: true, url: 'https://2dfan.com/subjects/search?keyword={{gameTitle}}' },
                {
                    type: 'multisearch',
                    name: '多搜索',
                    storageKey: 'multiSearchSites',
                    options: [
                        { value: 'ai2', text: 'ai2.moe', url: 'https://www.ai2.moe/search/?q={{gameTitle}}&updated_after=any&sortby=relevancy&search_in=titles', checked: true },
                        { value: 'moyu', text: 'moyu.moe', url: 'https://www.moyu.moe/search?q={{gameTitle}}', checked: true },
                        { value: '2dfan_preview', text: '2dfan', url: 'https://2dfan.com/subjects/search?keyword={{gameTitle}}', checked: true }
                    ]
                }
            ]);
        }

        function saveButtonSettings(settings) {
            GM_setValue('customButtons', settings);
        }

        function renderButtons() {
            const buttonSettings = loadButtonSettings();
            nameSingle.querySelectorAll('.jump-button, .combined-button, .multisearch-select-container').forEach(btn => btn.remove());
            nameSingle.appendChild(document.createElement('br'));
            buttonSettings.forEach(buttonConfig => {
                const button = createButton(buttonConfig);
                if (button) {
                    nameSingle.appendChild(button);
                }
            });
             const settingsButton = document.createElement('button');
            settingsButton.textContent = '设置';
            settingsButton.className = 'jump-button';
            settingsButton.addEventListener('click', openSettingsPanel);
            nameSingle.appendChild(settingsButton);
        }

        renderButtons();

        let settingsPanel;

        function openSettingsPanel() {
            if (!settingsPanel) {
                settingsPanel = createSettingsPanel();
                document.body.appendChild(settingsPanel);
            }
            settingsPanel.classList.remove('hidden');
        }

        function closeSettingsPanel() {
            if (settingsPanel) {
                settingsPanel.classList.add('hidden');
            }
        }

        function createSettingsPanel() {
            const panel = document.createElement('div');
            panel.className = 'settings-panel hidden';

            const title = document.createElement('h2');
            title.textContent = '网址按钮设置';
            panel.appendChild(title);

            const tutorialSection = createTutorialSection();
            panel.appendChild(tutorialSection);

            const buttonsSection = createButtonsSettingsSection();
            panel.appendChild(buttonsSection);

            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.addEventListener('click', closeSettingsPanel);
            panel.appendChild(closeButton);

            return panel;
        }

        function createTutorialSection() {
            const section = document.createElement('div');
            section.className = 'settings-tutorial';

            const title = document.createElement('h3');
            title.textContent = '修改教程';
            section.appendChild(title);

            const tutorialText = document.createElement('p');
            tutorialText.innerHTML = `
                1. **添加按钮**: 点击 “添加按钮”，填写按钮名称，类型，URL等信息，点击 “保存按钮” 完成添加。<br>
                2. **修改按钮**: 在按钮列表中，点击 “编辑” 按钮，修改按钮信息后，点击 “保存按钮” 完成修改。<br>
                3. **删除按钮**: 在按钮列表中，点击 “删除” 按钮即可删除按钮。<br>
                4. **按钮类型说明**: <br>
                   - **Jump Button**:  点击直接跳转到设置的URL，URL中可以使用 {{gameTitle}} 占位符代表游戏标题。<br>
                   - **Combined Button**:  合并按钮，左侧为按钮名称，右侧下拉选择不同站点。需要设置多个 options，每个 option 包含 value, text, url。<br>
                   - **MultiSearch Select**: 多搜索按钮，点击按钮显示下拉菜单，用户可以选择多个站点进行多搜索。需要设置多个 options，每个 option 包含 value, text, url, checked (默认选中)。<br>
                5. **保存设置**: 修改完成后，点击 “保存设置” 保存所有更改。点击 “关闭” 关闭设置面板。<br>
                *URL 填写说明*: URL 中可以使用 {{gameTitle}} 作为占位符，脚本运行时会自动替换为当前页面的游戏标题。
            `;
            section.appendChild(tutorialText);
            return section;
        }


        function createButtonsSettingsSection() {
            const section = document.createElement('div');
            section.className = 'settings-panel-buttons';

            const title = document.createElement('h3');
            title.textContent = '按钮列表';
            section.appendChild(title);

            const buttonsList = document.createElement('div');
            section.appendChild(buttonsList);

            let currentButtonSettings = loadButtonSettings();

            function refreshButtonsList() {
                buttonsList.innerHTML = '';
                currentButtonSettings.forEach((buttonConfig, index) => {
                    const buttonItem = createButtonItem(buttonConfig, index);
                    buttonsList.appendChild(buttonItem);
                });
            }

            function createButtonItem(buttonConfig, index) {
                const item = document.createElement('div');
                item.className = 'settings-panel-button-item';

                const nameLabel = document.createElement('label');
                nameLabel.textContent = `名称: ${buttonConfig.name}, 类型: ${buttonConfig.type}`;
                item.appendChild(nameLabel);

                const actions = document.createElement('div');
                actions.className = 'settings-panel-button-actions';

                const editButton = document.createElement('button');
                editButton.textContent = '编辑';
                editButton.addEventListener('click', () => openEditButtonForm(buttonConfig, index));
                actions.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.addEventListener('click', () => {
                    currentButtonSettings.splice(index, 1);
                    saveButtonSettings(currentButtonSettings);
                    refreshButtonsList();
                    renderButtons();
                });
                actions.appendChild(deleteButton);

                item.appendChild(actions);
                return item;
            }

            refreshButtonsList();

            const addButtonButton = document.createElement('button');
            addButtonButton.textContent = '添加按钮';
            addButtonButton.addEventListener('click', openAddButtonForm);
            section.appendChild(addButtonButton);

            let formContainer = document.createElement('div');
            section.appendChild(formContainer);
            let currentForm = null;

            function openAddButtonForm() {
                if (currentForm) formContainer.removeChild(currentForm);
                currentForm = createButtonForm(null, (newButtonConfig) => {
                    currentButtonSettings.push(newButtonConfig);
                    saveButtonSettings(currentButtonSettings);
                    refreshButtonsList();
                    renderButtons();
                    formContainer.removeChild(currentForm);
                    currentForm = null;
                }, () => {
                    formContainer.removeChild(currentForm);
                    currentForm = null;
                });
                formContainer.appendChild(currentForm);
            }

            function openEditButtonForm(buttonConfig, index) {
                if (currentForm) formContainer.removeChild(currentForm);
                currentForm = createButtonForm(buttonConfig, (updatedButtonConfig) => {
                    currentButtonSettings[index] = updatedButtonConfig;
                    saveButtonSettings(currentButtonSettings);
                    refreshButtonsList();
                    renderButtons();
                    formContainer.removeChild(currentForm);
                    currentForm = null;
                }, () => {
                    formContainer.removeChild(currentForm);
                    currentForm = null;
                });
                formContainer.appendChild(currentForm);
            }


            function createButtonForm(initialConfig, saveCallback, cancelCallback) {
                const isEdit = initialConfig !== null;
                const form = document.createElement('div');

                const typeLabel = document.createElement('label');
                typeLabel.textContent = '按钮类型:';
                const typeSelect = document.createElement('select');
                const types = ['jump', 'combined', 'multisearch'];
                types.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type;
                    option.textContent = type;
                    typeSelect.appendChild(option);
                });
                typeSelect.value = initialConfig ? initialConfig.type : 'jump';
                form.appendChild(typeLabel);
                form.appendChild(typeSelect);

                const nameLabel = document.createElement('label');
                nameLabel.textContent = '按钮名称:';
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.value = initialConfig ? initialConfig.name : '';
                form.appendChild(nameLabel);
                form.appendChild(nameInput);

                const urlLabel = document.createElement('label');
                urlLabel.textContent = 'URL (Jump/Combined/MultiSearch):';
                const urlInput = document.createElement('input');
                urlInput.type = 'url';
                urlInput.value = initialConfig && initialConfig.url ? initialConfig.url : '';
                form.appendChild(urlLabel);
                form.appendChild(urlInput);

                const storageKeyLabel = document.createElement('label');
                storageKeyLabel.textContent = 'Storage Key (Combined/MultiSearch):';
                const storageKeyInput = document.createElement('input');
                storageKeyInput.type = 'text';
                storageKeyInput.value = initialConfig && initialConfig.storageKey ? initialConfig.storageKey : '';
                form.appendChild(storageKeyLabel);
                form.appendChild(storageKeyInput);

                const defaultOptionLabel = document.createElement('label');
                defaultOptionLabel.textContent = 'Default Option Value (Combined):';
                const defaultOptionInput = document.createElement('input');
                defaultOptionInput.type = 'text';
                defaultOptionInput.value = initialConfig && initialConfig.defaultOption ? initialConfig.defaultOption : '';
                form.appendChild(defaultOptionLabel);
                form.appendChild(defaultOptionInput);

                const clipboardTextLabel = document.createElement('label');
                clipboardTextLabel.textContent = '复制标题到剪贴板 (Jump/Combined/2dfan):';
                const clipboardTextSelect = document.createElement('select');
                const clipboardOptions = [{value: true, text: '是'}, {value: false, text: '否'}];
                clipboardOptions.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.text;
                    clipboardTextSelect.appendChild(option);
                });
                clipboardTextSelect.value = initialConfig && initialConfig.clipboardText !== undefined ? String(initialConfig.clipboardText) : 'false';
                form.appendChild(clipboardTextLabel);
                form.appendChild(clipboardTextSelect);


                const optionsLabel = document.createElement('label');
                optionsLabel.textContent = 'Options (Combined/MultiSearch, JSON Array):';
                const optionsTextarea = document.createElement('input');
                optionsTextarea.type = 'text';
                optionsTextarea.value = initialConfig && initialConfig.options ? JSON.stringify(initialConfig.options) : '[]';
                form.appendChild(optionsLabel);
                form.appendChild(optionsTextarea);


                const saveButton = document.createElement('button');
                saveButton.textContent = '保存按钮';
                saveButton.addEventListener('click', () => {
                    let optionsArray = [];
                    try {
                        optionsArray = JSON.parse(optionsTextarea.value || '[]');
                    } catch (e) {
                        alert('Options JSON 格式错误');
                        return;
                    }

                    const newConfig = {
                        type: typeSelect.value,
                        name: nameInput.value,
                        url: urlInput.value || undefined,
                        storageKey: storageKeyInput.value || undefined,
                        defaultOption: defaultOptionInput.value || undefined,
                        clipboardText: clipboardTextSelect.value === 'true',
                        options: optionsArray.length > 0 ? optionsArray : undefined
                    };
                    saveCallback(newConfig);
                });
                form.appendChild(saveButton);

                const cancelButton = document.createElement('button');
                cancelButton.textContent = '取消';
                cancelButton.addEventListener('click', cancelCallback);
                form.appendChild(cancelButton);

                return form;
            }

            return section;
        }

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeSettingsPanel();
            }
        });

    }
})();