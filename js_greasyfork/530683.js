// ==UserScript==
// @name         导出DeepSeek回答为图片 | Export DeepSeek Answer to Image
// @namespace    http://github.com/byronleeeee/exportDeepseek
// @version      1.2
// @description  将DeepSeek的回答导出为一张图片，支持选择多个聊天内容和添加用户头像
// @author       ByronLeeeee
// @match        *://chat.deepseek.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530683/%E5%AF%BC%E5%87%BADeepSeek%E5%9B%9E%E7%AD%94%E4%B8%BA%E5%9B%BE%E7%89%87%20%7C%20Export%20DeepSeek%20Answer%20to%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/530683/%E5%AF%BC%E5%87%BADeepSeek%E5%9B%9E%E7%AD%94%E4%B8%BA%E5%9B%BE%E7%89%87%20%7C%20Export%20DeepSeek%20Answer%20to%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // i18n translations
    const i18n = {
        'zh': {
            exportBtn: '导出AI回答为图片',
            notFound: 'AI回答区域未找到！',
            selectScheme: '选择配色方案：',
            footer: '回答来自DeepSeek，仅供参考',
            lastAnswer: '最新回答',
            multiSelectMode: '多选模式',
            exportSelected: '导出选中的对话',
            selectAll: '全选',
            deselectAll: '取消全选',
            userMessage: '用户',
            aiMessage: 'AI',
            selectItems: '请选择要导出的对话内容：',
            noItemsSelected: '请至少选择一个对话内容',
            colorSchemes: [
                { name: '白色-蓝色', top: '#FFFFFF', bottom: '#4D6BFE', textTop: '#000000', textBottom: '#FFFFFF' },
                { name: '黑色-金色', top: '#121212', bottom: '#FFD700', textTop: '#FFFFFF', textBottom: '#000000' },
                { name: '浅灰-青色', top: '#F5F5F5', bottom: '#008080', textTop: '#000000', textBottom: '#FFFFFF' },
                { name: '深灰-紫色', top: '#333333', bottom: '#800080', textTop: '#FFFFFF', textBottom: '#FFFFFF' }
            ],
            error: '生成图片失败，请查看控制台了解详情。',
            cancel: '取消',
            export: '导出',
            next: '下一步',
            back: '返回',
            addCreator: '添加生成者信息',
            creatorName: '生成者名称',
            creatorPlaceholder: '输入你的名字',
            addAvatar: '添加用户头像'
        },
        'en': {
            exportBtn: 'Export AI Answer to Image',
            notFound: 'AI answer div not found!',
            selectScheme: 'Select a color scheme:',
            footer: 'Answer from DeepSeek, for reference only',
            lastAnswer: 'Last Answer',
            multiSelectMode: 'Multi-select Mode',
            exportSelected: 'Export Selected Items',
            selectAll: 'Select All',
            deselectAll: 'Deselect All',
            userMessage: 'User',
            aiMessage: 'AI',
            selectItems: 'Please select chat items to export:',
            noItemsSelected: 'Please select at least one chat item',
            colorSchemes: [
                { name: 'White-Blue', top: '#FFFFFF', bottom: '#4D6BFE', textTop: '#000000', textBottom: '#FFFFFF' },
                { name: 'Black-Gold', top: '#121212', bottom: '#FFD700', textTop: '#FFFFFF', textBottom: '#000000' },
                { name: 'Light Gray-Teal', top: '#F5F5F5', bottom: '#008080', textTop: '#000000', textBottom: '#FFFFFF' },
                { name: 'Dark Gray-Purple', top: '#333333', bottom: '#800080', textTop: '#FFFFFF', textBottom: '#FFFFFF' }
            ],
            error: 'Failed to generate image. Check console for details.',
            cancel: 'Cancel',
            export: 'Export',
            next: 'Next',
            back: 'Back',
            addCreator: 'Add creator info',
            creatorName: 'Creator name',
            creatorPlaceholder: 'Enter your name',
            addAvatar: 'Add user avatar'
        }
    };

    const userLang = (navigator.language || navigator.userLanguage).split('-')[0];
    const lang = i18n[userLang] ? userLang : 'en';
    const texts = i18n[lang];

    // Add styles with dark mode support
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-export-fab {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background-color: #4D6BFE;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 9999;
                transition: all 0.3s ease;
            }
            .ai-export-fab:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 12px rgba(0,0,0,0.3);
            }
            .ai-export-fab-icon {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ai-export-tooltip {
                position: absolute;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                right: 70px;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }
            .ai-export-fab:hover .ai-export-tooltip {
                opacity: 1;
            }
            .ai-color-scheme-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .ai-modal-content {
                background-color: white;
                border-radius: 8px;
                padding: 20px;
                width: 400px;
                max-width: 90%;
                color: #000000;
            }
            body.dark .ai-modal-content {
                background-color: #1e1e1e;
                color: #ffffff;
            }
            .ai-modal-header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
            }
            .ai-scheme-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 15px;
            }
            .ai-scheme-option {
                border: 2px solid transparent;
                border-radius: 6px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.2s;
            }
            .ai-scheme-option:hover {
                transform: translateY(-2px);
            }
            .ai-scheme-option.selected {
                border-color: #4D6BFE;
            }
            .ai-scheme-preview {
                display: flex;
                flex-direction: column;
                height: 100px;
            }
            .ai-scheme-top {
                flex: 3;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            .ai-scheme-bottom {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }
            .ai-modal-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .ai-modal-button {
                padding: 8px 16px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
                font-weight: bold;
            }
            .ai-modal-button.primary {
                background-color: #4D6BFE;
                color: white;
            }
            .ai-modal-button.secondary {
                background-color: #f1f1f1;
                color: #333;
            }
            body.dark .ai-modal-button.secondary {
                background-color: #333333;
                color: #ffffff;
            }
            .ai-export-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #4D6BFE;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
                z-index: 100;
            }
            ._4f9bf79:hover .ai-export-button,
            .fbb737a4:hover .ai-export-button {
                opacity: 1;
            }
            .ai-creator-option {
                margin: 15px 0;
            }
            .ai-creator-checkbox {
                margin-right: 8px;
            }
            .ai-creator-input {
                margin-top: 8px;
                width: 100%;
                padding: 8px;
                border-radius: 4px;
                border: 1px solid #ccc;
                box-sizing: border-box;
                display: none;
            }
            body.dark .ai-creator-input {
                background-color: #333;
                color: #fff;
                border-color: #555;
            }
            .ai-chat-selection {
                max-height: 50vh;
                overflow-y: auto;
                margin: 15px 0;
                border: 1px solid #eee;
                border-radius: 8px;
                padding: 10px;
            }
            body.dark .ai-chat-selection {
                border-color: #333;
            }
            .ai-chat-item {
                display: flex;
                align-items: center;
                padding: 8px;
                margin: 5px 0;
                border-radius: 4px;
                background-color: #f9f9f9;
                border-left: 4px solid transparent;
                transition: all 0.2s;
            }
            body.dark .ai-chat-item {
                background-color: #2a2a2a;
            }
            .ai-chat-item:hover {
                background-color: #f1f1f1;
            }
            body.dark .ai-chat-item:hover {
                background-color: #333;
            }
            .ai-chat-item.ai {
                border-left-color: #4D6BFE;
            }
            .ai-chat-item.user {
                border-left-color: #6FCF97;
            }
            .ai-chat-checkbox {
                margin-right: 10px;
            }
            .ai-chat-preview {
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 14px;
            }
            .ai-chat-type {
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: 8px;
            }
            .ai-chat-type.ai {
                background-color: #E1E7FF;
                color: #4D6BFE;
            }
            body.dark .ai-chat-type.ai {
                background-color: #2a3a70;
                color: #8aa3ff;
            }
            .ai-chat-type.user {
                background-color: #E3F9EB;
                color: #6FCF97;
            }
            body.dark .ai-chat-type.user {
                background-color: #2a4a3a;
                color: #8ae0a9;
            }
            .ai-selection-actions {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .ai-selection-buttons {
                display: flex;
                gap: 8px;
            }
            .ai-select-button {
                font-size: 12px;
                padding: 4px 8px;
                background-color: #f1f1f1;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            body.dark .ai-select-button {
                background-color: #333;
                color: #fff;
            }
            .ai-select-button:hover {
                background-color: #e1e1e1;
            }
            body.dark .ai-select-button:hover {
                background-color: #444;
            }
            .ai-chat-wrapper {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 15px;
                padding: 10px;
            }
            .ai-chat-content {
                flex-grow: 1;
            }
            .ai-user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    // Create FAB
    function createFAB() {
        const fab = document.createElement('div');
        fab.innerHTML = `
            <div class="ai-export-fab">
                <div class="ai-export-fab-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </div>
                <span class="ai-export-tooltip">${texts.multiSelectMode}</span>
            </div>
        `;
        document.body.appendChild(fab);

        fab.querySelector('.ai-export-fab').addEventListener('click', () => {
            showMultiSelectModal();
        });
    }

    // Add export buttons to each message
    function addExportButtonsToMessages() {
        const observer = new MutationObserver(() => {
            const aiDivs = document.querySelectorAll('div._4f9bf79._43c05b5');
            aiDivs.forEach(aiDiv => {
                if (!aiDiv.querySelector('.ai-export-button')) {
                    const exportButton = document.createElement('button');
                    exportButton.className = 'ai-export-button';
                    exportButton.textContent = texts.exportBtn;
                    exportButton.addEventListener('click', () => {
                        showColorSchemeModal([aiDiv], false);
                    });

                    const parentDiv = aiDiv.closest('.ds-relative') || aiDiv;
                    parentDiv.style.position = 'relative';
                    parentDiv.appendChild(exportButton);
                }
            });

            const userDivs = document.querySelectorAll('div.fbb737a4');
            userDivs.forEach(userDiv => {
                if (!userDiv.querySelector('.ai-export-button')) {
                    const exportButton = document.createElement('button');
                    exportButton.className = 'ai-export-button';
                    exportButton.textContent = texts.exportBtn;
                    exportButton.addEventListener('click', () => {
                        showColorSchemeModal([userDiv], false);
                    });

                    const parentDiv = userDiv.closest('.ds-relative') || userDiv;
                    parentDiv.style.position = 'relative';
                    parentDiv.appendChild(exportButton);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        const aiDivs = document.querySelectorAll('div._4f9bf79._43c05b5');
        aiDivs.forEach(aiDiv => {
            if (!aiDiv.querySelector('.ai-export-button')) {
                const exportButton = document.createElement('button');
                exportButton.className = 'ai-export-button';
                exportButton.textContent = texts.exportBtn;
                exportButton.addEventListener('click', () => {
                    showColorSchemeModal([aiDiv], false);
                });

                const parentDiv = aiDiv.closest('.ds-relative') || aiDiv;
                parentDiv.style.position = 'relative';
                parentDiv.appendChild(exportButton);
            }
        });

        const userDivs = document.querySelectorAll('div.fbb737a4');
        userDivs.forEach(userDiv => {
            if (!userDiv.querySelector('.ai-export-button')) {
                const exportButton = document.createElement('button');
                exportButton.className = 'ai-export-button';
                exportButton.textContent = texts.exportBtn;
                exportButton.addEventListener('click', () => {
                    showColorSchemeModal([userDiv], false);
                });

                const parentDiv = userDiv.closest('.ds-relative') || userDiv;
                parentDiv.style.position = 'relative';
                parentDiv.appendChild(exportButton);
            }
        });
    }

    // Show multi-select modal
    function showMultiSelectModal() {
        const aiDivs = Array.from(document.querySelectorAll('div._4f9bf79._43c05b5'));
        const userDivs = Array.from(document.querySelectorAll('div.fbb737a4'));

        if (!aiDivs.length && !userDivs.length) {
            alert(texts.notFound);
            return;
        }

        const allMessages = [...aiDivs, ...userDivs].sort((a, b) => {
            const position = a.compareDocumentPosition(b);
            return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });

        const modal = document.createElement('div');
        modal.className = 'ai-color-scheme-modal';

        modal.innerHTML = `
            <div class="ai-modal-content">
                <div class="ai-modal-header">${texts.selectItems}</div>

                <div class="ai-selection-actions">
                    <div class="ai-selection-buttons">
                        <button class="ai-select-button" id="ai-select-all">${texts.selectAll}</button>
                        <button class="ai-select-button" id="ai-deselect-all">${texts.deselectAll}</button>
                    </div>
                </div>

                <div class="ai-chat-selection">
                    ${allMessages.map((div, index) => {
            const isAI = div.classList.contains('_4f9bf79');
            const type = isAI ? 'ai' : 'user';
            const label = isAI ? texts.aiMessage : texts.userMessage;
            let content;
            if (isAI) {
                content = div.textContent.trim();
            } else {
                // For user messages, remove ai-export-button and afb1eea3
                const tempDiv = div.cloneNode(true);
                const exportButton = tempDiv.querySelector('.ai-export-button');
                if (exportButton) exportButton.remove();
                const afb1eea3 = tempDiv.querySelector('.afb1eea3');
                if (afb1eea3) afb1eea3.remove();
                content = tempDiv.textContent.trim();
            }
            if (content.length > 60) content = content.substring(0, 57) + '...';

            return `
                            <div class="ai-chat-item ${type}" data-index="${index}">
                                <input type="checkbox" class="ai-chat-checkbox" id="chat-item-${index}" ${isAI ? 'checked' : ''}>
                                <label class="ai-chat-preview" for="chat-item-${index}">${content}</label>
                                <span class="ai-chat-type ${type}">${label}</span>
                            </div>
                        `;
        }).join('')}
                </div>

                <div class="ai-modal-buttons">
                    <button class="ai-modal-button secondary" id="ai-cancel-btn">${texts.cancel}</button>
                    <button class="ai-modal-button primary" id="ai-continue-btn">${texts.next}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#ai-select-all').addEventListener('click', () => {
            modal.querySelectorAll('.ai-chat-checkbox').forEach(checkbox => {
                checkbox.checked = true;
            });
        });

        modal.querySelector('#ai-deselect-all').addEventListener('click', () => {
            modal.querySelectorAll('.ai-chat-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
        });

        modal.querySelector('#ai-cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#ai-continue-btn').addEventListener('click', () => {
            const selectedIndices = [];
            modal.querySelectorAll('.ai-chat-checkbox').forEach((checkbox, i) => {
                if (checkbox.checked) {
                    const itemIndex = parseInt(checkbox.closest('.ai-chat-item').dataset.index);
                    selectedIndices.push(itemIndex);
                }
            });

            if (selectedIndices.length === 0) {
                alert(texts.noItemsSelected);
                return;
            }

            const selectedDivs = selectedIndices.map(index => allMessages[index]);
            document.body.removeChild(modal);
            showColorSchemeModal(selectedDivs, true);
        });
    }

    // Show color scheme modal
    function showColorSchemeModal(selectedDivs, isMultiSelect) {
        const modal = document.createElement('div');
        modal.className = 'ai-color-scheme-modal';
        let selectedSchemeIndex = 0;
        let creatorName = '';
        let addCreatorInfo = false;
        let addUserAvatar = false;

        const profileNameElement = document.querySelector('.ds-dropdown-menu-option__label');
        const defaultCreatorName = profileNameElement ? profileNameElement.textContent.trim() : '';

        modal.innerHTML = `
            <div class="ai-modal-content">
                <div class="ai-modal-header">${texts.selectScheme}</div>
                <div class="ai-scheme-options">
                    ${texts.colorSchemes.map((scheme, index) => `
                        <div class="ai-scheme-option ${index === 0 ? 'selected' : ''}" data-index="${index}">
                            <div class="ai-scheme-preview">
                                <div class="ai-scheme-top" style="background-color:${scheme.top};color:${scheme.textTop}">AI</div>
                                <div class="ai-scheme-bottom" style="background-color:${scheme.bottom};color:${scheme.textBottom}">DeepSeek</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="ai-creator-option">
                    <label>
                        <input type="checkbox" class="ai-creator-checkbox" ${defaultCreatorName ? 'checked' : ''}>
                        ${texts.addCreator}
                    </label>
                    <input type="text" class="ai-creator-input" placeholder="${texts.creatorPlaceholder}"
                           value="${defaultCreatorName}" ${defaultCreatorName ? '' : 'disabled'}>
                </div>
                <div class="ai-creator-option">
                    <label>
                        <input type="checkbox" class="ai-avatar-checkbox">
                        ${texts.addAvatar}
                    </label>
                </div>
                <div class="ai-modal-buttons">
                    ${isMultiSelect ? `<button class="ai-modal-button secondary" id="ai-back-btn">${texts.back}</button>` : ''}
                    <button class="ai-modal-button secondary" id="ai-cancel-btn">${texts.cancel}</button>
                    <button class="ai-modal-button primary" id="ai-export-btn">${texts.export}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const schemeOptions = modal.querySelectorAll('.ai-scheme-option');
        schemeOptions.forEach(option => {
            option.addEventListener('click', () => {
                schemeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedSchemeIndex = parseInt(option.dataset.index);
            });
        });

        const creatorCheckbox = modal.querySelector('.ai-creator-checkbox');
        const creatorInput = modal.querySelector('.ai-creator-input');
        const avatarCheckbox = modal.querySelector('.ai-avatar-checkbox');

        creatorCheckbox.addEventListener('change', () => {
            addCreatorInfo = creatorCheckbox.checked;
            creatorInput.disabled = !addCreatorInfo;
            creatorInput.style.display = addCreatorInfo ? 'block' : 'none';
        });

        avatarCheckbox.addEventListener('change', () => {
            addUserAvatar = avatarCheckbox.checked;
        });

        addCreatorInfo = creatorCheckbox.checked;
        creatorInput.style.display = addCreatorInfo ? 'block' : 'none';

        if (isMultiSelect) {
            modal.querySelector('#ai-back-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
                showMultiSelectModal();
            });
        }

        modal.querySelector('#ai-cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#ai-export-btn').addEventListener('click', async () => {
            creatorName = creatorInput.value.trim();
            document.body.removeChild(modal);
            await generateAndDownloadImage(selectedDivs, texts.colorSchemes[selectedSchemeIndex], texts, addCreatorInfo, creatorName, addUserAvatar);
        });
    }

    // Default SVG avatar (centered)
    const defaultAvatarSVG = `
<svg class="icon" style="vertical-align: middle; overflow: hidden; height: 30px; width: 30px;" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M513 0c282.77 0 512 229.23 512 512s-229.23 512-512 512S1 794.77 1 512 230.23 0 513 0z m0 64C265.576 64 65 264.576 65 512c0 115.941 44.042 221.595 116.31 301.145 22.403-109.033 102.365-198.376 208.446-238.033l3.803-1.398-2.002-1.221C325.214 531.546 281 458.186 281 374.5 281 246.094 385.094 142 513.5 142S746 246.094 746 374.5c0 83.842-44.379 157.318-110.927 198.22l-2.012 1.223 3.804 1.405c105.77 39.776 185.46 128.986 207.816 237.803C916.953 733.606 961 627.947 961 512c0-247.424-200.576-448-448-448z" fill="#737373"></path></svg>
    `;

    // Generate and download image
    async function generateAndDownloadImage(selectedDivs, colorScheme, texts, addCreatorInfo, creatorName, addUserAvatar) {
        const container = document.createElement('div');
        container.style.width = '600px';
        container.style.borderRadius = '10px';
        container.style.overflow = 'hidden';
        container.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        const topSection = document.createElement('div');
        topSection.style.padding = '20px';
        topSection.style.backgroundColor = colorScheme.top;
        topSection.style.color = colorScheme.textTop;

        // Get user avatar if selected, otherwise use default
        let userAvatar = null;
        if (addUserAvatar) {
            const avatarImg = document.querySelector('img.fdf01f38');
            if (avatarImg) {
                userAvatar = avatarImg.cloneNode(true);
                userAvatar.className = 'ai-user-avatar';
                userAvatar.removeAttribute('aria-hidden');
            }
        }
        if (!userAvatar) {
            const avatarContainer = document.createElement('div');
            avatarContainer.innerHTML = defaultAvatarSVG;
            userAvatar = avatarContainer.firstElementChild;
        }

        selectedDivs.forEach(div => {
            const isAI = div.classList.contains('_4f9bf79');
            let contentDiv;

            const chatWrapper = document.createElement('div');
            chatWrapper.className = 'ai-chat-wrapper';

            if (isAI) {
                // For AI messages, clone the full div and remove unwanted elements
                contentDiv = div.cloneNode(true);
                const buttonDiv = contentDiv.querySelector('.ds-flex[style*="margin-top"]');
                if (buttonDiv) buttonDiv.remove();
            } else {
                // For user messages, create a new div with only the text content from fbb737a4
                contentDiv = document.createElement('div');
                contentDiv.className = 'fbb737a4 ai-chat-content';
                // Clone the div and remove export button and afb1eea3 before getting text
                const tempDiv = div.cloneNode(true);
                const exportButton = tempDiv.querySelector('.ai-export-button');
                if (exportButton) exportButton.remove();
                const afb1eea3 = tempDiv.querySelector('.afb1eea3');
                if (afb1eea3) afb1eea3.remove();
                contentDiv.textContent = tempDiv.textContent.trim();
            }

            chatWrapper.appendChild(contentDiv);

            // Add avatar on the right for user messages
            if (!isAI) {
                const avatarClone = userAvatar.cloneNode(true);
                chatWrapper.appendChild(avatarClone);
            }

            topSection.appendChild(chatWrapper);
        });

        let footerText = texts.footer;
        if (addCreatorInfo && creatorName) {
            footerText += ` — By ${creatorName}`;
        }

        const bottomSection = document.createElement('div');
        bottomSection.textContent = footerText;
        bottomSection.style.padding = '10px';
        bottomSection.style.textAlign = 'center';
        bottomSection.style.fontSize = '14px';
        bottomSection.style.fontFamily = 'Arial, sans-serif';
        bottomSection.style.backgroundColor = colorScheme.bottom;
        bottomSection.style.color = colorScheme.textBottom;

        container.appendChild(topSection);
        container.appendChild(bottomSection);

        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
                logging: false
            });

            const link = document.createElement('a');
            link.download = `chat_export_${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
            alert(texts.error);
        }

        document.body.removeChild(container);
    }

    // Initialize
    function init() {
        addStyles();
        createFAB();
        addExportButtonsToMessages();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();