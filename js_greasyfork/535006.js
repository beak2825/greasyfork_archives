// ==UserScript==
// @name         魂+过滤文本提取
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.02
// @description  文本提取与处理工具
// @author       YourName
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/535006/%E9%AD%82%2B%E8%BF%87%E6%BB%A4%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535006/%E9%AD%82%2B%E8%BF%87%E6%BB%A4%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // 等待页面完全加载
        window.addEventListener('load', function() {
        // 查找目标导航栏
        const toolbar = document.querySelector('ul.fl.readbot');
        if (!toolbar) return;

        // 查找标题元素
        const titleElement = document.querySelector('h1#subject_tpc');
        if (!titleElement) return;

        // 创建复制按钮
        const li = document.createElement('li');
        li.className = 'copy';

        const link = document.createElement('a');
        link.textContent = '复制';
        link.style.cursor = 'pointer';
        link.href = 'javascript:void(0);';

        // 添加点击事件
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 提取纯文本标题（自动忽略内部HTML标签）
            const title = titleElement.textContent.trim();

            // 创建临时文本框用于复制操作
            const tempInput = document.createElement('textarea');
            tempInput.value = title;
            document.body.appendChild(tempInput);
            tempInput.select();

            try {
                // 执行复制命令
                document.execCommand('copy');
                link.textContent = '已复制';

                // 2秒后恢复文字
                setTimeout(() => {
                    link.textContent = '复制标题';
                }, 2000);
            } catch (err) {
                alert('复制失败');
            } finally {
                // 清理临时元素
                document.body.removeChild(tempInput);
            }
        });

        // 将按钮添加到导航栏最前面
        li.appendChild(link);
        toolbar.insertBefore(li, toolbar.firstChild);
    });

	// 在初始化时修正正则表达式加载方式
    const config = {
        regex: new RegExp(GM_getValue('regex', '(?<=\\])(.*?)(?=\\[(?=[^\\[]*$)| \\.\\.$)')),
        replacePattern: GM_getValue('replacePattern', ''),
        replaceReplacement: GM_getValue('replaceReplacement', ''),
        editorVisible: false
    };

    // 创建界面元素
    const mainBtn = createButton('A', '提取文本', mainClickHandler);
    const editor = createEditor();
    document.body.appendChild(mainBtn);
    document.body.appendChild(editor);

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        .config-panel {
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            min-width: 300px;
            z-index: 1002;
        }
        .config-input {
            width: 100%;
            margin: 10px 0;
            padding: 5px;
        }
    `;
    document.head.appendChild(style);


    // 主处理函数
    function processContent() {
        const targetElements = Array.from(
            document.querySelectorAll(
                'li.dcsns-li.dcsns-rss.dcsns-feed-0.rinsp-thread-filter-unscored.rinsp-thread-inspected'
            )
        ).filter(li =>
            li.attributes.length === 1 &&
            li.querySelector(':scope > div > .section-title > a[href^="./read.php"]')
        ).map(li =>
            li.querySelector(':scope > div > .section-title > a[href^="./read.php"]')
        );

        return targetElements
            .map(el => processText(el.textContent))
            .filter(Boolean);
    }

    // 正则处理逻辑
    function processText(rawText) {
        try {
            const regex = new RegExp(config.regex);
            const match = regex.exec(rawText);
			// 检查匹配结果是否存在且非空字符串
			if (match && match[0].trim() !== '') {
				return match[0].trim();
			} else {
				// 匹配结果为空或不存在时返回原文本
				return rawText.trim();
			}
        } catch {
            return rawText.trim();
        }
    }

    // 界面创建函数
    function createButton(id, text, clickHandler) {
        const btn = document.createElement('button');
        btn.id = `btn-${id}`;
        btn.textContent = text;
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '10px'
        });
        btn.addEventListener('click', clickHandler);
        return btn;
    }

    function createEditor() {
        const editor = document.createElement('div');
        editor.id = 'text-editor';
        Object.assign(editor.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            height: '400px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            display: 'none',
            zIndex: 999
        });

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = 'calc(100% - 40px)';
        editor.appendChild(textarea);

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.flexWrap = 'wrap'; // 添加换行样式
        
        // 原有功能按钮
        ['B', 'C', 'D'].forEach((id, idx) => {
            const btn = document.createElement('button');
            btn.id = `btn-${id}`;
            btn.textContent = ['正则配置', '替换设置', '复制文本'][idx];
            btn.onclick = [showRegexPanel, showReplacePanel, handleCopy][idx];
            btn.style.flex = '1 0 30%'; // 调整按钮宽度
            btnContainer.appendChild(btn);
        });

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭面板';
        closeBtn.style.flex = '1 0 100%'; // 单独一行
        closeBtn.style.marginTop = '5px';
        closeBtn.onclick = () => {
            editor.style.display = 'none';
            config.editorVisible = false;
        };
        btnContainer.appendChild(closeBtn);

        editor.appendChild(btnContainer);
        return editor;
    }

    // 事件处理函数
    function mainClickHandler() {
        config.editorVisible = !config.editorVisible;
        editor.style.display = config.editorVisible ? 'block' : 'none';
        if (config.editorVisible) {
            refreshEditorContent();
        }
    }

    function refreshEditorContent() {
        const results = processContent();
        editor.querySelector('textarea').value = results.join('\n');
    }

    // 正则表达式存储方式（在showRegexPanel中）
    function showRegexPanel() {
        const currentRegex = config.regex.source;
        const panel = createConfigPanel(
            '正则配置',
            currentRegex,
            value => {
                try {
                    // 保存时存储字符串形式
                    const newRegex = value;
                    config.regex = new RegExp(newRegex);
                    GM_setValue('regex', newRegex); // 存储正则字符串
                    refreshEditorContent();
                } catch(e) {
                    alert(`无效的正则表达式: ${e.message}`);
                }
            }
        );
    }

    // 修改后的替换面板函数
    function showReplacePanel() {
        const panel = document.createElement('div');
        panel.className = 'config-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        });

        // 正则表达式输入
        const patternInput = document.createElement('input');
        patternInput.placeholder = '正则表达式（例如：(.*?)）';
        patternInput.className = 'config-input';
        patternInput.value = config.replacePattern;

        // 替换模板输入
        const replaceInput = document.createElement('input');
        replaceInput.placeholder = '替换模板（例如：$1）';
        replaceInput.className = 'config-input';
        replaceInput.value = config.replaceReplacement;

        // 操作按钮
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '10px';

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '保存';
        confirmBtn.onclick = () => {
            try {
                // 验证正则表达式
                new RegExp(patternInput.value);

                // 保存配置
                config.replacePattern = patternInput.value;
                config.replaceReplacement = replaceInput.value;
                GM_setValue('replacePattern', patternInput.value);
                GM_setValue('replaceReplacement', replaceInput.value);
                document.body.removeChild(panel);
                refreshEditorContent();
            } catch(e) {
                alert(`无效的正则表达式: ${e.message}`);
            }
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.onclick = () => document.body.removeChild(panel);

        btnContainer.append(confirmBtn, cancelBtn);
        panel.append(patternInput, replaceInput, btnContainer);
        document.body.appendChild(panel);
    }

    function handleCopy() {
        // 复制处理逻辑
        const text = applyReplaceRules(editor.querySelector('textarea').value);
        navigator.clipboard.writeText(text);
        showFeedback('btn-D', '已复制');
    }

    // 工具函数
	// 更新后的配置面板创建函数
	function createConfigPanel(title, defaultValue, confirmHandler) {
		const panel = document.createElement('div');
		Object.assign(panel.style, {
			position: 'fixed',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			backgroundColor: 'white',
			padding: '20px',
			zIndex: 1001,
			boxShadow: '0 0 10px rgba(0,0,0,0.2)'
		});

		const titleEl = document.createElement('h3');
		titleEl.textContent = title;
		panel.appendChild(titleEl);

		const input = document.createElement('input');
		input.style.width = '100%';
		input.value = defaultValue;
		panel.appendChild(input);

		const btnContainer = document.createElement('div');
		btnContainer.style.marginTop = '10px';

		const confirmBtn = document.createElement('button');
		confirmBtn.textContent = '确认';
		confirmBtn.onclick = () => {
			confirmHandler(input.value);
			document.body.removeChild(panel);
		};

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = '取消';
		cancelBtn.onclick = () => document.body.removeChild(panel);

		btnContainer.append(confirmBtn, cancelBtn);
		panel.appendChild(btnContainer);
		document.body.appendChild(panel);
	}

    // 更新替换面板创建函数
    function createReplacePanel() {
        const panel = document.createElement('div');
        panel.className = 'config-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        });

        // 添加规则列表显示
        const ruleList = document.createElement('div');
        ruleList.style.maxHeight = '200px';
        ruleList.style.overflowY = 'auto';

        // 现有规则显示
        config.replaceRules.forEach((rule, index) => {
            const ruleItem = document.createElement('div');
            ruleItem.textContent = `${index + 1}. /${rule.pattern}/ ➔ "${rule.replacement}"`;
            ruleList.appendChild(ruleItem);
        });

        // 输入框
        const patternInput = document.createElement('input');
        patternInput.placeholder = '正则表达式（例如：(.*?)）';
        patternInput.className = 'config-input';

        const replaceInput = document.createElement('input');
        replaceInput.placeholder = '替换模板（例如：$1）';
        replaceInput.className = 'config-input';

        // 操作按钮
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '10px';

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '添加规则';
        confirmBtn.onclick = () => {
            if (patternInput.value) {
                config.replaceRules.push({
                    pattern: patternInput.value,
                    replacement: replaceInput.value || ''
                });
                GM_setValue('replaceRules', config.replaceRules);
                document.body.removeChild(panel);
                refreshEditorContent(); // 添加后刷新内容
            }
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.onclick = () => document.body.removeChild(panel);

        btnContainer.append(confirmBtn, cancelBtn);
        panel.append(ruleList, patternInput, replaceInput, btnContainer);
        document.body.appendChild(panel);
    }

    // 修改后的替换处理逻辑
    function applyReplaceRules(text) {
        if (!config.replacePattern) return text;

        try {
            const regex = new RegExp(config.replacePattern, 'gm');
            return text.replace(regex, config.replaceReplacement);
        } catch(e) {
            console.error('替换规则错误:', e);
            return text;
        }
    }

    function showFeedback(btnId, text) {
        const btn = document.getElementById(btnId);
        const originalText = btn.textContent;
        btn.textContent = text;
        setTimeout(() => btn.textContent = originalText, 2000);
    }

    // 全局点击监听
	/*
    document.addEventListener('click', (e) => {
        const activePanels = document.querySelectorAll('.config-panel, #text-editor');
        const isInsideUI = Array.from(activePanels).some(panel =>
            panel.contains(e.target) || panel === e.target
        );

        if (!isInsideUI && e.target !== mainBtn) {
            editor.style.display = 'none';
            config.editorVisible = false;
        }
    });
	*/

    // 初始化菜单命令
    // 修改重置配置命令
    GM_registerMenuCommand('重置配置', () => {
        GM_setValue('regex', '');
        GM_setValue('replacePattern', '(?<=^|\n)(.*)$');
        GM_setValue('replaceReplacement', 'www.ggbases.com,kimochi.info,51acg.buzz,www.blue-plus.net,www.hmoe11.net,snow-plus.net,south-plus.net,imoutolove.me,east-plus.net,spring-plus.net,acg.xacg.fun##li.dcsns-feed-0,div.threadlist > ul>[class^=author_],fieldset>#touch>tbody>tr.dtr,div.grid.post,article.is-hentry.is-format-standard,div.layout-simple.col-sm-12.col-md-6.col-lg-4,article.is-hentry.is-format-standard,#main > div.t > table > tbody > .tr3 > td.e.y-style.tal>*,#threadlist>*>*,tr.tac:has-text($1)');
        config.regex = /(?<=\])(.*?)(?=\[(?=[^\[]*$)| \.\.$)/g;
        config.replacePattern = '';
        config.replaceReplacement = '';
    });
})();