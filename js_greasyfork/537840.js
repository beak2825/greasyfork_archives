// ==UserScript==
// @name          Pixiv小说自定义屏蔽
// @namespace     http://tampermonkey.net/
// @version       2025-11-23.1
// @description   屏蔽含有指定关键词、作者名、标签或字数范围外的 Pixiv 项目，支持设置面板、导入导出配置、控制台打印
// @author        111
// @match         https://www.pixiv.net/tags*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant         GM_addStyle
// @run-at       document-start // 尽早运行，确保在任何 fetch 发生之前完成劫持
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537840/Pixiv%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/537840/Pixiv%E5%B0%8F%E8%AF%B4%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultConfig = {
        contentKeywords: ['无限制ai', 'ai风月'],
        authorKeywords: ['（', '('],
        tagKeywords: ['语c', '男同'],
        minTextLength: 0,
        maxTextLength: 10000,
        hideNoDescription: false
    };

    function getConfig() {
        const saved = localStorage.getItem('pixivFilterConfig');
        if (saved) {
            try {
                return { ...defaultConfig, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('配置解析失败，使用默认值');
            }
        }
        return { ...defaultConfig };
    }

    function saveConfig(config) {
        localStorage.setItem('pixivFilterConfig', JSON.stringify(config));
    }

    let config = getConfig();

    GM_addStyle(`
        #pixivFilterBtn, #pixivConfigBtn {
            position: fixed;
            left: 10px;
            z-index: 9999;
            padding: 8px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        #pixivFilterBtn { top: 50%; }
        #pixivConfigBtn { top: 60%; background: #2196F3; }

        .hidden-by-ai-toggle { display: none !important; }

        #pixivConfigPanel {
            position: fixed;
            top: 120px;
            left: 120px;
            width: 400px;
            background: #fff;
            color: #333;
            padding: 16px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            font-size: 14px;
        }

        #pixivConfigPanel textarea {
            width: 100%;
            height: 60px;
            margin-bottom: 12px;
        }

        #pixivConfigPanel input[type=number] {
            width: 80px;
            margin-bottom: 12px;
        }

        #pixivConfigPanel button {
            margin-right: 8px;
        }
    `);

    const configPanel = document.createElement('div');
    configPanel.id = 'pixivConfigPanel';
    configPanel.innerHTML = `
        <div><strong>内容关键词（标题+简介）：</strong></div>
        <textarea id="contentInput">${config.contentKeywords.join('\n')}</textarea>
        <div><strong>作者关键词：</strong></div>
        <textarea id="authorInput">${config.authorKeywords.join('\n')}</textarea>
        <div><strong>标签关键词：</strong></div>
        <textarea id="tagInput">${config.tagKeywords.join('\n')}</textarea>
        <div><strong>最小字数：</strong><input type="number" id="minTextLength" value="${config.minTextLength}"></div>
        <div><strong>最大字数：</strong><input type="number" id="maxTextLength" value="${config.maxTextLength}"></div>
        <label style="display:block;margin:8px 0;">
            <input type="checkbox" id="hideNoDescription"${config.hideNoDescription ? ' checked' : ''}>
            屏蔽无简介小说
        </label>
        <br/>
        <button id="saveBtn">保存</button>
        <button id="exportBtn">导出</button>
        <button id="importBtn">导入</button>
        <button id="closeBtn">关闭</button>
    `;
    document.body.appendChild(configPanel);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'pixivFilterBtn';
    toggleButton.textContent = 'Hide AI';
    document.body.appendChild(toggleButton);

    const configButton = document.createElement('button');
    configButton.id = 'pixivConfigBtn';
    configButton.textContent = '关键词设置';
    document.body.appendChild(configButton);

    let isHidden = false;
    let configPanelVisible = false;
    let observedElements = [];

    function containsKeyword(text, keywords) {
        const lower = text.toLowerCase();
        const foundKeywords = [];
        keywords.forEach(k => {
            if (lower.includes(k.toLowerCase())) {
                foundKeywords.push(k);
            }
        });
        return foundKeywords;
    }

    function getTagTexts(li) {
        const tags = [];
        const tagLinks = li.querySelectorAll('div > div:nth-child(2) > div > div:nth-child(3) ul a, ul span span');
        tagLinks.forEach(tag => {
            const text = tag.textContent?.trim();
            if (text) tags.push(text);
        });
        return tags;
    }

    function findTargetElements() {
        return document.querySelectorAll('#__next ul li');
    }


    function toggleElements() {
        observedElements.forEach(li => {
            const titleElem = li.querySelector('div > div:nth-child(2) > div > div:nth-child(1) > div > a');
            const authorElem = li.querySelector('div > div:nth-child(2) > div > div:nth-child(2) > a');
            const authorName = authorElem ? authorElem.textContent.trim() : '';

            const contentElem = li.querySelector('div > div:nth-child(2) > div > div:nth-child(3) >div>div>div');
            const contentText = contentElem ? contentElem.textContent.trim() : '';

            const textLengthElem = li.querySelector('div > div:nth-child(2) > div > div:nth-child(3) > div > div > div > span');


            const textLength = textLengthElem ? parseInt(textLengthElem.textContent.replace(/[^\d]/g, '')) : 0;

            const tags = getTagTexts(li);

            const titleText = titleElem ? titleElem.textContent.trim() : '';

            const matchedTags = containsKeyword(tags.join(' '), config.tagKeywords);
            const matchedAuthor = containsKeyword(authorName, config.authorKeywords);
            const matchedContent = containsKeyword(contentText, config.contentKeywords);
            const matchedTitle = containsKeyword(titleText, config.contentKeywords);

            const lengthTooShort = textLength < config.minTextLength;
            const lengthTooLong = textLength > config.maxTextLength;

            const noDescription = config.hideNoDescription && (!contentElem || contentText.length === 0||contentElem.innerHTML.includes("sc-99dab233"));

            const shouldHide = isHidden && (
                matchedAuthor.length > 0 ||
                matchedContent.length > 0 ||
                matchedTitle.length > 0 ||
                matchedTags.length > 0 ||
                lengthTooShort || lengthTooLong ||
                noDescription
            );

            li.classList.toggle('hidden-by-ai-toggle', shouldHide);

            if (shouldHide) {
                let logMessage = '隐藏作品：';
                if (matchedContent.length > 0) logMessage += `[内容: ${matchedContent.join(', ')}] `;
                if (matchedTitle.length > 0) logMessage += `[标题: ${matchedTitle.join(', ')}] `;
                if (matchedAuthor.length > 0) logMessage += `[作者: ${matchedAuthor.join(', ')}] `;
                if (matchedTags.length > 0) logMessage += `[标签: ${matchedTags.join(', ')}] `;
                if (lengthTooShort) logMessage += `[字数过少: ${textLength}] `;
                if (lengthTooLong) logMessage += `[字数过多: ${textLength}] `;
                if (noDescription) logMessage += '[无简介] ';
                console.log(authorName + ' ' + logMessage);
            }
        });
    }

    function init() {
        observedElements = Array.from(findTargetElements());
        toggleElements();
    }

    toggleButton.addEventListener('click', function () {
        isHidden = !isHidden;
        toggleButton.textContent = isHidden ? 'Show AI' : 'Hide AI';
        toggleElements();
    });

    configButton.addEventListener('click', function () {
        configPanelVisible = !configPanelVisible;
        configPanel.style.display = configPanelVisible ? 'block' : 'none';
    });

    configPanel.querySelector('#saveBtn').addEventListener('click', () => {
        config.contentKeywords = configPanel.querySelector('#contentInput').value.split('\n').map(s => s.trim()).filter(Boolean);
        config.authorKeywords = configPanel.querySelector('#authorInput').value.split('\n').map(s => s.trim()).filter(Boolean);
        config.tagKeywords = configPanel.querySelector('#tagInput').value.split('\n').map(s => s.trim()).filter(Boolean);
        config.minTextLength = parseInt(configPanel.querySelector('#minTextLength').value) || 0;
        config.maxTextLength = parseInt(configPanel.querySelector('#maxTextLength').value) || 100000;
        config.hideNoDescription = configPanel.querySelector('#hideNoDescription').checked;
        saveConfig(config);
        init();
        alert('已保存设置');
    });

    configPanel.querySelector('#exportBtn').addEventListener('click', () => {
        const exportData = JSON.stringify(config, null, 2);
        navigator.clipboard.writeText(exportData).then(() => alert('配置已复制到剪贴板'));
    });

    configPanel.querySelector('#importBtn').addEventListener('click', () => {
        const input = prompt('请粘贴你导出的配置JSON：');
        if (input) {
            try {
                const imported = JSON.parse(input);
                config = { ...defaultConfig, ...imported };
                saveConfig(config);
                location.reload();
            } catch (e) {
                alert('导入失败，JSON 格式有误。');
            }
        }
    });

    configPanel.querySelector('#closeBtn').addEventListener('click', () => {
        configPanel.style.display = 'none';
        configPanelVisible = false;
    });

    const observer = new MutationObserver(() => {
        init();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    init();
})();

