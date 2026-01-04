// ==UserScript==
// @name         Yuanbao Markdown Copy
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在腾讯元宝对话中添加一键复制Markdown按钮（含思考过程），可通过油猴菜单配置导出选项。Refactored for modularity.
// @author       LouisLUO
// @match        https://yuanbao.tencent.com/*
// @icon         https://cdn-bot.hunyuan.tencent.com/logo-v2.png
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538772/Yuanbao%20Markdown%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/538772/Yuanbao%20Markdown%20Copy.meta.js
// ==/UserScript==

// 鸣谢：本脚本部分思路和实现参考了 [腾讯元宝对话导出器 | Tencent Yuanbao Exporter](https://greasyfork.org/zh-CN/scripts/532431-%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8-tencent-yuanbao-exporter)（by Gao + Gemini 2.5 Pro），并受益于 GitHub Copilot 及 GPT-4.1 的辅助。
// Thanks: Some logic and implementation are inspired by [腾讯元宝对话导出器 | Tencent Yuanbao Exporter](https://greasyfork.org/zh-CN/scripts/532431-%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8-tencent-yuanbao-exporter) (by Gao + Gemini 2.5 Pro), with help from GitHub Copilot and GPT-4.1.

(function () {
    'use strict';

    // --- Configuration & Constants ---
    const SCRIPT_NAME = 'Yuanbao Markdown Copy';
    const BTN_STYLE = {
        background: '#13172c', // 修正: 使用 background 而不是 bg
        backgroundHover: '#24293c', // 新增: hover 时的背景色
        color: '#efefef',
        marginLeft: '8px',
        padding: '2px 8px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background 0.2s',
    };

    const EXPORT_BTN_STYLE = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 0',
        padding: '4px 0',
        margin: '4px',
        gap: '4px',
    };

    // SVG Icons
    const ICON_EXPORT_ALL = `
        <svg fill="${BTN_STYLE.color}" width="1em" height="1em" viewBox="0 0 20 20" style="margin-right:4px;vertical-align:middle;" xmlns="http://www.w3.org/2000/svg"><path d="M15 15H2V6h2.595s.689-.896 2.17-2H1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-3.746l-2 1.645V15zm-1.639-6.95v3.551L20 6.4l-6.639-4.999v3.131C5.3 4.532 5.3 12.5 5.3 12.5c2.282-3.748 3.686-4.45 8.061-4.45z"/></svg>
    `;
    const ICON_DIALOGUE = `
        <svg fill="${BTN_STYLE.color}" width="1em" height="1em" viewBox="0 0 24 24" style="margin-right:4px;vertical-align:middle;" xmlns="http://www.w3.org/2000/svg"><path d="M21 2H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v3.382a1 1 0 0 0 1.447.894L15.764 18H21a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-1 14h-5.382a1 1 0 0 0-.447.105L10 17.618V16a1 1 0 0 0-1-1H4V4h16ZM7 7h10v2H7Zm0 4h7v2H7Z"/></svg>
    `;

    // --- State Management ---
    let state = {
        latestDetailResponse: null,
        latestResponseSize: 0,
        latestResponseUrl: null,
        lastUpdateTime: null
    };

    // --- Settings Management ---
    const DEFAULT_SETTINGS = {
        autoInjectCopyBtn: true,
        exportFormat: 'markdown', // Reserved for future extensions
        replaceFormulas: true,
        exportThinkProcess: true,
        thinkProcessFormat: 'tag', // 'tag' or 'markdown'
        keepSearchResults: true,
        headerDowngrade: false
    };

    function getSettings() {
        try {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('yuanbao_md_settings') || '{}') };
        } catch {
            return { ...DEFAULT_SETTINGS };
        }
    }

    function saveSettings(settings) {
        localStorage.setItem('yuanbao_md_settings', JSON.stringify(settings));
    }

    function showSettingsDialog() {
        const settings = getSettings();
        const html = `
            <div style="font-size:14px; line-height: 1.8;">
                <label><input type="checkbox" id="autoInjectCopyBtn" ${settings.autoInjectCopyBtn ? 'checked' : ''}> 自动注入“复制MD”按钮 (刷新生效)</label><br>
                <label><input type="checkbox" id="replaceFormulas" ${settings.replaceFormulas ? 'checked' : ''}> 替换行内/块公式语法 (<code>\\(..\\)</code> -> <code>$...$</code>, <code>\\[..\\]</code> -> <code>$$...$$</code>)</label><br>
                <label><input type="checkbox" id="exportThinkProcess" ${settings.exportThinkProcess ? 'checked' : ''}> 导出思考过程</label><br>
                <label style="padding-left: 20px;">
                    思考过程格式:
                    <select id="thinkProcessFormat" ${!settings.exportThinkProcess ? 'disabled' : ''}>
                        <option value="tag" ${settings.thinkProcessFormat === 'tag' ? 'selected' : ''}>&lt;think&gt;标签</option>
                        <option value="markdown" ${settings.thinkProcessFormat === 'markdown' ? 'selected' : ''}>Markdown引用</option>
                    </select>
                </label><br>
                <label><input type="checkbox" id="keepSearchResults" ${settings.keepSearchResults ? 'checked' : ''}> 保留网页搜索内容和脚标</label><br>
                <label><input type="checkbox" id="headerDowngrade" ${settings.headerDowngrade ? 'checked' : ''}> 标题降级 (例: # -> ##)</label><br>
                <label style="display:none;">导出格式：<select id="exportFormat"><option value="markdown" ${settings.exportFormat === 'markdown' ? 'selected' : ''}>Markdown</option></select></label>
            </div>
        `;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            background: '#222', color: '#fff', padding: '24px', borderRadius: '12px',
            zIndex: 99999, boxShadow: '0 2px 16px #0008'
        });
        modal.appendChild(wrapper);

        const btnSave = document.createElement('button');
        btnSave.textContent = '保存';
        btnSave.style.margin = '16px 8px 0 0';
        btnSave.onclick = () => {
            const newSettings = {
                autoInjectCopyBtn: wrapper.querySelector('#autoInjectCopyBtn').checked,
                exportFormat: wrapper.querySelector('#exportFormat').value,
                replaceFormulas: wrapper.querySelector('#replaceFormulas').checked,
                exportThinkProcess: wrapper.querySelector('#exportThinkProcess').checked,
                thinkProcessFormat: wrapper.querySelector('#thinkProcessFormat').value,
                keepSearchResults: wrapper.querySelector('#keepSearchResults').checked,
                headerDowngrade: wrapper.querySelector('#headerDowngrade').checked
            };
            saveSettings(newSettings);
            document.body.removeChild(modal);
            alert('设置已保存，部分设置需刷新页面生效');
        };

        const btnCancel = document.createElement('button');
        btnCancel.textContent = '取消';
        btnCancel.onclick = () => document.body.removeChild(modal);

        modal.appendChild(btnSave);
        modal.appendChild(btnCancel);
        document.body.appendChild(modal);

        const exportThinkProcessCheckbox = wrapper.querySelector('#exportThinkProcess');
        const thinkProcessFormatSelect = wrapper.querySelector('#thinkProcessFormat');
        exportThinkProcessCheckbox.addEventListener('change', function () {
            thinkProcessFormatSelect.disabled = !this.checked;
        });
    }

    // --- Network Interception ---
    function processYuanbaoResponse(text, url) {
        if (!url || !url.includes('/api/user/agent/conversation/v1/detail')) return;
        try {
            if (text && text.includes('"convs":') && text.includes('"createTime":')) {
                state.latestDetailResponse = text;
                state.latestResponseSize = text.length;
                state.latestResponseUrl = url;
                state.lastUpdateTime = new Date().toLocaleTimeString();
            }
        } catch (e) { console.error(`${SCRIPT_NAME}: Error processing response`, e); }
    }

    function setupNetworkInterceptors() {
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            const url = args[0] instanceof Request ? args[0].url : args[0];
            const response = await originalFetch.apply(this, args);
            if (typeof url === 'string' && url.includes('/api/user/agent/conversation/v1/detail')) {
                response.clone().text().then(text => processYuanbaoResponse(text, url));
            }
            return response;
        };

        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;
        const xhrUrlMap = new WeakMap();
        XMLHttpRequest.prototype.open = function (method, url) {
            xhrUrlMap.set(this, url);
            if (typeof url === 'string' && url.includes('/api/user/agent/conversation/v1/detail')) {
                this.addEventListener('load', function () {
                    if (this.readyState === 4 && this.status === 200) {
                        processYuanbaoResponse(this.responseText, xhrUrlMap.get(this));
                    }
                });
            }
            return originalXhrOpen.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function () { return originalXhrSend.apply(this, arguments); };
    }

    // --- Markdown Conversion Utilities ---
    function adjustHeaderLevels(text, increaseBy = 1) {
        if (!text) return '';
        let adjustedText = text.replace(/^(#+)(\s*)(.*?)\s*$/gm, (match, hashes, space, content) =>
            '#'.repeat(hashes.length + increaseBy) + ' ' + content.trim()
        );
        adjustedText = adjustedText.replace(/^>\s*(#+)(\s*)(.*?)\s*$/gm, (match, blockquotePrefix, hashes, space, content) =>
            blockquotePrefix + '#'.repeat(hashes.length + increaseBy) + ' ' + content.trim()
        );
        return adjustedText;
    }

    function applyFormulaReplacements(text, shouldReplace) {
        if (!shouldReplace || !text) return text || '';
        return text
            .replace(/\\\((.+?)\\\)/g, (m, p1) => `$${p1}$`)
            .replace(/\\\[(.+?)\\\]/gs, (m, p1) => `$$${p1}$$`);
    }

    function formatThinkContent(thinkContent, settings) {
        let content = applyFormulaReplacements(thinkContent, settings.replaceFormulas);
        if (settings.thinkProcessFormat === 'markdown') {
            return `> ${content.replace(/\n/g, '\n> ')}\n\n`;
        }
        return `<think>\n${content}\n</think>\n\n`;
    }

    function processContentBlock(block, settings, refsContext) {
        let markdown = '';
        switch (block.type) {
            case 'text': {
                let msg = applyFormulaReplacements(block.msg || '', settings.replaceFormulas);
                if (settings.keepSearchResults && msg.includes('(@ref)')) {
                    msg = msg.replace(/\[(\d+)\]\(@ref\)/g, (_, n) => `[^${n}]`); // Placeholder, will be adjusted by searchGuid
                } else if (!settings.keepSearchResults && msg.includes('(@ref)')) {
                    msg = msg.replace(/\[\d+\]\(@ref\)/g, '').trim();
                }
                markdown += `${msg}\n\n`;
                break;
            }
            case 'think':
                if (settings.exportThinkProcess && block.content) {
                    markdown += formatThinkContent(block.content, settings);
                }
                break;
            case 'searchGuid': {
                let text = applyFormulaReplacements(block.msg || block.content || '', settings.replaceFormulas);
                if (settings.keepSearchResults) {
                    let blockScopedRefStartIndex = refsContext.nextRefIdx;
                    if (block.docs && block.docs.length > 0) {
                        block.docs.forEach(doc => {
                            refsContext.refsArray.push({
                                idx: refsContext.nextRefIdx++,
                                title: doc.title || '无标题',
                                url: doc.url || '#'
                            });
                        });
                    }
                    let currentRefPlaceholderIdx = blockScopedRefStartIndex;
                    text = text.replace(/\[(\d+)\]\(@ref\)/g, () => `[^${currentRefPlaceholderIdx++}]`);
                    markdown += text + '\n\n';
                } else if (text) {
                    text = text.replace(/\[\d+\]\(@ref\)/g, '').trim();
                    markdown += text + '\n\n';
                }
                break;
            }
            case 'image':
            case 'code':
            case 'pdf':
                markdown += `[${block.fileName || '未知文件'}](${block.url || '#'})\n\n`;
                break;
        }
        return markdown;
    }

    function processSpeech(speech, settings, refsContext) {
        let markdown = '';
        if (speech.content && speech.content.length > 0) {
            speech.content.forEach(block => {
                markdown += processContentBlock(block, settings, refsContext);
            });
        }
        return markdown;
    }

    function extractUserMessageAndMedia(turn, settings) {
        let userTextMsg = '';
        let mediaMarkdown = '';

        if (turn.speechesV2 && turn.speechesV2.length > 0 && turn.speechesV2[0].content) {
            const textBlock = turn.speechesV2[0].content.find(block => block.type === 'text');
            if (textBlock && typeof textBlock.msg === 'string') {
                userTextMsg = textBlock.msg;
            }
            let uploadedMedia = [];
            turn.speechesV2[0].content.forEach(block => {
                if (block.type !== 'text' && block.fileName && block.url) {
                    uploadedMedia.push(`[${block.fileName || '未知文件'}](${block.url || '#'})`);
                }
            });
            if (uploadedMedia.length > 0) {
                mediaMarkdown = `\n${uploadedMedia.join('\n')}\n`;
            }
        }
        // Fallback to displayPrompt if text message is still empty
        if (!userTextMsg && typeof turn.displayPrompt === 'string') {
            userTextMsg = turn.displayPrompt;
        }

        userTextMsg = applyFormulaReplacements(userTextMsg, settings.replaceFormulas);
        return (userTextMsg + '\n' + mediaMarkdown).trim() + '\n';
    }

    function processTurnToMarkdown(turn, settings, refsContext, isFullExportContext = false) {
        let markdown = '';
        if (turn.speaker === 'human') {
            if (isFullExportContext) {
                markdown += (settings.headerDowngrade ? '> ## user\n' : '> # user\n');
            }
            markdown += extractUserMessageAndMedia(turn, settings);
        } else if (turn.speaker === 'ai') {
            if (isFullExportContext) {
                markdown += (settings.headerDowngrade ? '> ## agent\n' : '> # agent\n');
            }
            if (turn.speechesV2 && turn.speechesV2.length > 0) {
                turn.speechesV2.forEach(speech => {
                    markdown += processSpeech(speech, settings, refsContext);
                });
            }
        }
        return markdown;
    }

    function convertSingleTurnJsonToMarkdown(jsonData, targetTurnIndex, settings) {
        if (!jsonData || !jsonData.convs || !Array.isArray(jsonData.convs)) {
            return '# 错误：无效的JSON数据\n\n无法解析对话内容。';
        }
        const turn = jsonData.convs.find(t => t.index === targetTurnIndex);
        if (!turn) return '';

        let refsContext = { refsArray: [], nextRefIdx: 1 };
        let markdownContent = processTurnToMarkdown(turn, settings, refsContext, false);

        if (settings.keepSearchResults && refsContext.refsArray.length > 0) {
            markdownContent += '\n';
            refsContext.refsArray.forEach(ref => {
                markdownContent += `[^${ref.idx}]: [${ref.title}](${ref.url})\n`;
            });
        }
        if (settings.headerDowngrade) {
            markdownContent = adjustHeaderLevels(markdownContent);
        }
        return markdownContent.trim();
    }

    function convertAllTurnsJsonToMarkdown(jsonData, settings) {
        if (!jsonData || !Array.isArray(jsonData.convs)) {
            return '# 错误：无效的JSON数据\n\n无法解析对话内容。';
        }
        let markdownContent = '';
        let refsContext = { refsArray: [], nextRefIdx: 1 };

        // jsonData.convs is newest first. Reverse to process oldest first for chronological output.
        jsonData.convs.slice().reverse().forEach(turn => {
            markdownContent += processTurnToMarkdown(turn, settings, refsContext, true);
        });

        if (settings.keepSearchResults && refsContext.refsArray.length > 0) {
            markdownContent += '\n';
            refsContext.refsArray.forEach(ref => {
                markdownContent += `[^${ref.idx}]: [${ref.title}](${ref.url})\n`;
            });
        }
        if (settings.headerDowngrade) {
            // Note: Speaker headers are already downgraded by processTurnToMarkdown if isFullExportContext.
            // This call will downgrade any other headers within the content.
            markdownContent = adjustHeaderLevels(markdownContent);
        }
        return markdownContent.trim();
    }


    // --- UI Injection & Event Handlers ---
    function createStyledButton(text, onclick, iconSvg = '', customStyles = {}) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = iconSvg + text;
        Object.assign(btn.style, BTN_STYLE, customStyles); // Base style, then specific overrides
        btn.onmouseover = () => { btn.style.background = BTN_STYLE.backgroundHover; };
        btn.onmouseout = () => { btn.style.background = BTN_STYLE.background; };
        btn.onclick = onclick;
        // 确保初始状态下背景色正确
        btn.style.background = BTN_STYLE.background;
        return btn;
    }

    function injectCopyButtonToBubble(copyBtnElement, allBubbles, jsonData) {
        if (copyBtnElement.parentElement.querySelector('.agent-chat__toolbar__copy-md')) return;

        const mdBtn = createStyledButton('复制MD', null, '', { fontSize: '14px' }); // Use shared styling
        mdBtn.title = '复制Markdown（接口数据）';
        mdBtn.className = 'agent-chat__toolbar__copy-md';

        mdBtn.onclick = function (e) {
            e.stopPropagation();
            const bubble = copyBtnElement.closest('.agent-chat__bubble');
            if (!bubble) { alert('未找到对话泡'); return; }

            const domIdx = allBubbles.indexOf(bubble);
            const jsonConvs = jsonData && Array.isArray(jsonData.convs) ? jsonData.convs : [];
            // Assuming jsonData.convs is newest first, and allBubbles is oldest first.
            const jsonTargetIdx = jsonConvs.length - 1 - domIdx;
            let targetTurnUniqueIndex = null;
            if (jsonConvs[jsonTargetIdx]) {
                targetTurnUniqueIndex = jsonConvs[jsonTargetIdx].index;
            }

            if (targetTurnUniqueIndex === null || targetTurnUniqueIndex === undefined) {
                alert('无法匹配到正确的对话轮次');
                return;
            }

            const settings = getSettings();
            const md = convertSingleTurnJsonToMarkdown(jsonData, targetTurnUniqueIndex, settings);
            if (!md) { alert('未提取到Markdown内容'); return; }

            navigator.clipboard.writeText(md).then(() => {
                mdBtn.title = '已复制！';
                mdBtn.style.opacity = 0.5;
                setTimeout(() => {
                    mdBtn.title = '复制Markdown（接口数据）';
                    mdBtn.style.opacity = 1;
                }, 1000);
            }).catch(err => {
                console.error(`${SCRIPT_NAME}: Failed to copy: `, err);
                alert('复制失败，详情请查看控制台。');
            });
        };
        copyBtnElement.parentElement.insertBefore(mdBtn, copyBtnElement.nextSibling);
    }

    function injectCopyButtonsToAllBubbles() {
        const settings = getSettings();
        if (!settings.autoInjectCopyBtn || !state.latestDetailResponse) return;

        let jsonData;
        try {
            jsonData = JSON.parse(state.latestDetailResponse);
        } catch (e) {
            console.error(`${SCRIPT_NAME}: JSON parsing failed for injecting copy buttons.`, e);
            // Do not alert here as this runs frequently.
            return;
        }
        if (!jsonData || !jsonData.convs) return;

        const allBubbles = Array.from(document.querySelectorAll('.agent-chat__bubble'));
        document.querySelectorAll('.agent-chat__toolbar__copy').forEach(copyBtn => {
            injectCopyButtonToBubble(copyBtn, allBubbles, jsonData);
        });
    }

    function injectExportButtonsToToolbar(toolbarElement) {
        if (!toolbarElement || toolbarElement.dataset.mdInjected) return;
        toolbarElement.innerHTML = ''; // Clear existing content
        Object.assign(toolbarElement.style, {
            display: 'flex', gap: '4px', width: '150px', alignItems: 'center', height: '34px'
        });

        const settings = getSettings();

        const btnAllOnClick = () => {
            if (!state.latestDetailResponse) {
                alert('未捕获到对话数据，请刷新页面或重新进入对话。');
                return;
            }
            let jsonData;
            try {
                jsonData = JSON.parse(state.latestDetailResponse);
            } catch (e) { alert('JSON 解析失败'); return; }

            const md = convertAllTurnsJsonToMarkdown(jsonData, settings);
            if (!md) { alert('未提取到Markdown内容'); return; }
            navigator.clipboard.writeText(md).then(() => {
                alert('全部对话已复制到剪贴板！');
            }).catch(err => {
                console.error(`${SCRIPT_NAME}: Failed to copy all: `, err);
                alert('复制失败，详情请查看控制台。');
            });
        };

        const btnAll = createStyledButton('全部', btnAllOnClick, ICON_EXPORT_ALL, EXPORT_BTN_STYLE);
        const btnDialogue = createStyledButton('对话', injectCopyButtonsToAllBubbles, ICON_DIALOGUE, EXPORT_BTN_STYLE);

        toolbarElement.appendChild(btnAll);
        toolbarElement.appendChild(btnDialogue);
        toolbarElement.dataset.mdInjected = '1';
    }

    // --- DOM Observation ---
    function observeDOMChanges() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('agent-dialogue__tool')) {
                                injectExportButtonsToToolbar(node);
                            } else if (node.querySelectorAll) {
                                node.querySelectorAll('.agent-dialogue__tool').forEach(el => injectExportButtonsToToolbar(el));
                            }
                        }
                    });
                }
            }
            // Always try to inject copy buttons if new nodes are added and auto-inject is on
            if (getSettings().autoInjectCopyBtn) {
                injectCopyButtonsToAllBubbles();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Main Initialization ---
    function init() {
        setupNetworkInterceptors();
        observeDOMChanges();
        // Initial call to inject buttons if content is already present
        if (getSettings().autoInjectCopyBtn) {
            injectCopyButtonsToAllBubbles();
        }
        // Attempt to inject toolbar buttons if already present
        const existingToolbar = document.querySelector('.agent-dialogue__tool');
        if (existingToolbar) {
            injectExportButtonsToToolbar(existingToolbar);
        }
    }

    // --- Script Execution ---
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('脚本设置', showSettingsDialog);
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();