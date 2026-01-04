// ==UserScript==
// @name         LduOJBetter
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  LDU OJ 增强脚本：支持复制题目内容、保存代码、发送到 CPH
// @author       LJF
// @match        https://icpc.ldu.edu.cn/problems/*
// @match        https://icpc.ldu.edu.cn/contests/*/problems/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/marked/4.0.2/marked.min.js
// @downloadURL https://update.greasyfork.org/scripts/519655/LduOJBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/519655/LduOJBetter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('LDU OJ Better 脚本已加载');

    // 样式定义
    GM_addStyle(`
        .section-copy-btn {
            padding: 2px 6px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 8px;
            font-size: 0.8em;
            line-height: 1.2;
            vertical-align: middle;
        }
        .section-copy-btn:hover {
            background-color: #45a049;
        }
    `);

    // 添加设置按钮样式
    GM_addStyle(`
        .better-settings {
            padding: 15px 20px;
        }
        .better-settings label {
            display: flex;
            align-items: center;
            margin: 12px 0;
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        .better-settings label:hover {
            background: #e9ecef;
        }
        .better-settings input[type="checkbox"] {
            margin-right: 10px;
            width: 16px;
            height: 16px;
            cursor: pointer;
        }
        .better-settings-btn {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            background-color: #6c757d;
            color: white;
            border: none;
            cursor: pointer;
            margin-left: 10px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .better-settings-btn:hover {
            background-color: #5a6268;
            transform: translateY(-1px);
        }
        .better-settings-btn i {
            font-size: 0.9em;
        }
        .modal-content {
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        }
        .modal-header {
            background: #f8f9fa;
            border-bottom: 1px solid #eee;
            border-radius: 8px 8px 0 0;
            padding: 15px 20px;
        }
        .modal-header .modal-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #343a40;
        }
        .modal-header .close {
            padding: 15px;
            margin: -15px;
            opacity: 0.5;
            transition: opacity 0.2s ease;
        }
        .modal-header .close:hover {
            opacity: 1;
        }
        .modal-footer {
            border-top: 1px solid #eee;
            padding: 15px 20px;
        }
        .modal-footer .btn {
            padding: 6px 16px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        .modal-footer .btn-primary {
            background-color: #2196F3;
            border: none;
            color: white;
        }
        .modal-footer .btn-primary:hover {
            background-color: #1976D2;
            transform: translateY(-1px);
        }
        .modal-footer .btn-secondary {
            background-color: #e0e0e0;
            border: none;
            color: #333;
        }
        .modal-footer .btn-secondary:hover {
            background-color: #d5d5d5;
            transform: translateY(-1px);
        }
    `);

    // 添加翻译按钮样式
    GM_addStyle(`
        .section-translate-btn {
            padding: 2px 6px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 8px;
            font-size: 0.8em;
            line-height: 1.2;
            vertical-align: middle;
        }
        .section-translate-btn:hover {
            background-color: #1976D2;
        }
        .translated-text {
            margin: 1em 0;
            padding: 1em;
            background-color: #f8f9fa;
            border-left: 4px solid #4CAF50;
            border-radius: 4px;
            line-height: 1.6;
        }
        .translated-text p {
            margin: 0.8em 0;
        }
        .translated-text p:first-child {
            margin-top: 0;
        }
        .translated-text p:last-child {
            margin-bottom: 0;
        }
    `);

    // 获取设置值，默认都为开启
    const settings = {
        enableCopy: GM_getValue('enableCopy', true),
        enableCodeSave: GM_getValue('enableCodeSave', true),
        enableCPH: GM_getValue('enableCPH', true),
        enableTranslate: GM_getValue('enableTranslate', true),
        // 默认保存时间：1天
        saveDay: GM_getValue('saveDay', 1),
        saveHour: GM_getValue('saveHour', 0),
        saveMinute: GM_getValue('saveMinute', 0),
        translationAPI: GM_getValue('translationAPI', 'baidu'), // 只使用百度翻译
        baiduAppId: GM_getValue('baiduAppId', ''), // 百度翻译 API ID
        baiduKey: GM_getValue('baiduKey', ''), // 百度翻译密钥
        deepseekKey: GM_getValue('deepseekKey', ''), // 新增 DeepSeek API Key
        // 可以添加其他翻译服务的凭证
    };

    // 修改 updateFeatures 函数
    function updateFeatures() {
        // 使用 DocumentFragment 减少 DOM 操作
        const fragment = document.createDocumentFragment();

        // 更新复制功能
        if (settings.enableCopy) {
            document.querySelectorAll('.section-copy-btn').forEach(btn => btn.remove());
            addAllCopyButtons(fragment);
        }

        // 更新代码自动保存
        if (settings.enableCodeSave && !window.codeEditorInitialized) {
            initializeCodeEditor();
            window.codeEditorInitialized = true;
        }

        // 更新 CPH 快捷键
        if (settings.enableCPH && !window.cphInitialized) {
            initCPHShortcut();
            window.cphInitialized = true;
        } else if (!settings.enableCPH && window.cphInitialized) {
            document.removeEventListener('keydown', cphKeydownHandler);
            window.cphInitialized = false;
        }

        // 更新翻译功能
        if (settings.enableTranslate) {
            document.querySelectorAll('.section-translate-btn').forEach(btn => btn.remove());
            addTranslateButtons(fragment);
        }

        // 一次性将所有更改应用到 DOM
        document.body.appendChild(fragment);
    }

    // CPH 快捷键处理函数
    function cphKeydownHandler(e) {
        if (e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            try {
                console.log("开始获取题目信息...");
                const problem = getProblemInfo();
                console.log("题目信息获取成功:", problem);
                sendToCPH(problem);
            } catch (error) {
                console.error("获取题目信息失败:", error);
                showNotification('解析题目信息失败: ' + error.toString(), false);
            }
        }
    }

    // HTML清理函数
    function cleanHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;

        // 将 <p> 和 <br> 标签转换为换行符
        div.querySelectorAll('p, br').forEach(element => {
        if (element.tagName === 'P') {
            element.insertAdjacentText('afterend', '\n\n');
        } else if (element.tagName === 'BR') {
            element.insertAdjacentText('afterend', '\n');
        }
    });

    // 移除重复的数学符号文本
    div.querySelectorAll('.MathJax_Preview').forEach(element => {
        element.remove();
    });
    div.querySelectorAll('script[type="math/tex"]').forEach(element => {
        const formula = element.textContent;
        const isDisplayMode = element.hasAttribute('mode') && element.getAttribute('mode') === 'display';
        const wrapper = document.createElement('span');
        wrapper.textContent = isDisplayMode ? `\n$$${formula}$$\n` : `$${formula}$`;
        element.parentNode.replaceChild(wrapper, element);
    });

    return div.innerText
        .trim()
        .replace(/\n{3,}/g, '\n\n') // 将多个连续换行替换为两个换行
        .replace(/\s*\$\$(.*?)\$\$\s*/g, '\n$$$$1$$\n') // 确保行间公式前后有换行
        .replace(/([^$])\$([^$]+)\$([^$])/g, '$1$$$2$$$3'); // 确保行内公式有正确的美元符号
    }

    // 通知函数
    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 4px;
            color: white;
            background-color: ${isSuccess ? '#4CAF50' : '#f44336'};
            z-index: 10000;
            transition: opacity 0.5s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 2000);
    }

    // 数据保存函数
    function saveWithExpiry(key, value) {
        const now = new Date();
        const expiryTime = now.getTime() +
            (settings.saveDay * 24 * 60 * 60 * 1000) +
            (settings.saveHour * 60 * 60 * 1000) +
            (settings.saveMinute * 60 * 1000);

        const item = {
            value: value,
            expiry: expiryTime,
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
            console.log('数据已保存:', key);
        } catch (e) {
            console.error('保存数据失败:', e);
        }
    }

    // 数据获取函数
    function getWithExpiry(key) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            const now = new Date();

            if (now.getTime() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch (e) {
            console.error('获取数据失败:', e);
            return null;
        }
    }

    // 修改获取题目ID的函数
    function getProblemId() {
        const path = window.location.pathname;

        // 先匹配比赛题目的格式
        const contestMatch = path.match(/\/contests\/(\d+)\/problems\/(\d+)$/);
        if (contestMatch) {
            // 比赛题目返回 "contest_比赛ID_题号"
            return `contest_${contestMatch[1]}_${contestMatch[2]}`;
        }

        // 再匹配普通题目的格式
        const problemMatch = path.match(/\/problems\/(\d+)$/);
        if (problemMatch) {
            // 普通题目返回 "problem_题号"
            return `problem_${problemMatch[1]}`;
        }

        return null;
    }

    // 保存代码
    function saveCode(editor) {
        const problemId = getProblemId();
        if (!problemId || !editor) return;

        const code = editor.getValue();
        saveWithExpiry(`code_${problemId}`, code);

        const langSelect = document.querySelector('select[name="solution[language]"]');
        if (langSelect) {
            saveWithExpiry(`lang_${problemId}`, langSelect.value);
        }
    }

    // 代码编辑器初始化
    function initializeCodeEditor() {
        const problemId = getProblemId();
        if (!problemId) return;

        let initAttempts = 0;
        const maxAttempts = 50; // 最多尝试5秒

        const initEditor = () => {
            const cmElement = document.querySelector('.CodeMirror');
            if (cmElement && cmElement.CodeMirror) {
                const editor = cmElement.CodeMirror;
                const savedCode = getWithExpiry(`code_${problemId}`);

                if (savedCode && !editor.getValue().trim()) {
                    editor.setValue(savedCode);
                }

                const langSelect = document.querySelector('select[name="solution[language]"]');
                const savedLang = getWithExpiry(`lang_${problemId}`);
                if (langSelect && savedLang) {
                    langSelect.value = savedLang;
                    langSelect.dispatchEvent(new Event('change'));
                }

                // 使用防抖处理代码变化事件
                let saveTimeout;
                editor.on('change', () => {
                    clearTimeout(saveTimeout);
                    saveTimeout = setTimeout(() => saveCode(editor), 1000);
                });

                return true;
            }

            if (++initAttempts >= maxAttempts) {
                console.warn('编辑器初始化超时');
                return true;
            }

            return false;
        };

        // 使用 requestAnimationFrame 代替 setInterval
        const tryInit = () => {
            if (!initEditor()) {
                requestAnimationFrame(tryInit);
            }
        };

        requestAnimationFrame(tryInit);
    }

    // CPH 相关函数
    function getProblemInfo() {
        try {
            let titleElement = document.querySelector("h4.text-center");
            if (!titleElement) throw new Error("未找到题目标题元素");
            let title = titleElement.childNodes[0].textContent.trim();

            let limitsElement = document.querySelector(".alert.alert-info");
            if (!limitsElement) throw new Error("未找到限制信息元素");
            let limits = limitsElement.innerText;
            let timeMatch = limits.match(/时间限制: (\d+)MS/);
            let memoryMatch = limits.match(/空间限制: (\d+)MB/);
            if (!timeMatch || !memoryMatch) throw new Error("无法解析时间或内存限制");

            let timeLimit = timeMatch[1];
            let memoryLimit = memoryMatch[1];

            let samples = [];
            let sampleDivs = document.querySelectorAll("div.border.my-2");

            if (sampleDivs.length > 0) {
                for (let div of sampleDivs) {
                    let input = div.querySelector("pre[id^='sam_in']");
                    let output = div.querySelector("pre[id^='sam_out']");
                    if (!input || !output) continue;

                    samples.push({
                        input: input.innerText.trim(),
                        output: output.innerText.trim()
                    });
                }
            }

            return {
                name: title,
                group: "LDU OJ",
                url: window.location.href,
                interactive: false,
                memoryLimit: parseInt(memoryLimit),
                timeLimit: parseInt(timeLimit),
                tests: samples,
                testType: "single",
                input: {
                    type: "stdin"
                },
                output: {
                    type: "stdout"
                },
                languages: {
                    java: {
                        mainClass: "Main",
                        taskClass: "Main"
                    }
                }
            };
        } catch (error) {
            console.error("解析题目时出错:", error);
            throw new Error(`题目解析失败: ${error.message}`);
        }
    }

    function sendToCPH(problem) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://localhost:27121',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(problem),
            timeout: 5000,
            onload: function(response) {
                if (response.status === 200) {
                    showNotification('成功发送到 CPH！');
                } else {
                    showNotification('发送失败: ' + response.statusText, false);
                }
            },
            onerror: function(error) {
                showNotification('发送失败: 请确保 CPH 插件正在运行', false);
            },
            ontimeout: function() {
                showNotification('发送超时: 请确保 CPH 插件正在运行', false);
            }
        });
    }

    function initCPHShortcut() {
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                try {
                    const problem = getProblemInfo();
                    sendToCPH(problem);
                } catch (error) {
                    showNotification('解析题目信息失败: ' + error.toString(), false);
                }
            }
        });
        console.log('CPH 快捷键已启用 (Ctrl+M)');
    }

    // 复制按钮相关函数
    function createCopyButton(text) {
        const button = document.createElement('button');
        button.className = 'section-copy-btn';
        button.textContent = '复制';
        button.addEventListener('click', function() {
            GM_setClipboard(text);
            const originalText = button.textContent;
            button.textContent = '✓';
            setTimeout(() => {
                button.textContent = originalText;
            }, 1000);
        });
        return button;
    }

    function addAllCopyButtons(fragment) {
        const sections = [
            { title: '题目描述', selector: 'h4.text-sky' },
            { title: '输入', selector: 'h4.mt-2.text-sky, h4.my-2.text-sky' },
            { title: '输出', selector: 'h4.mt-2.text-sky, h4.my-2.text-sky' },
            { title: '提示', selector: 'h4.mt-2.text-sky, h4.my-2.text-sky' }
        ];

        sections.forEach(section => {
            document.querySelectorAll(section.selector).forEach(element => {
                if (element.textContent.includes(section.title)) {
                    const content = element.nextElementSibling;
                    if (content) {
                        const button = createCopyButton(cleanHtml(content.innerHTML));
                        fragment.appendChild(button);
                        element.appendChild(button);
                    }
                }
            });
        });
    }

    // 修改 addTranslateButtons 函数
    function addTranslateButtons(fragment) {
        // 清除之前的翻译缓存
        clearTranslationCache();

        const sections = [
            { title: '题目描述复制', selector: 'h4.text-sky' },
            { title: '输入描述复制', selector: 'h4.mt-2.text-sky' },
            { title: '输出描述复制', selector: 'h4.mt-2.text-sky' },
            { title: '提示', selector: 'h4.mt-2.text-sky' }
        ];

        sections.forEach(section => {
            document.querySelectorAll('h4').forEach(element => {
                if (element.textContent.trim() === section.title) {
                    const content = element.nextElementSibling;
                    if (content) {
                        const button = createTranslateButton(content, section.title.replace('复制', ''));
                        fragment.appendChild(button);
                        element.appendChild(button);
                    }
                }
            });
        });
    }

    // 添加清除翻译缓存的函数
    function clearTranslationCache() {
        // 获取所有sessionStorage的键
        const keys = Object.keys(sessionStorage);
        // 删除所有以'trans_'开头的缓存
        keys.forEach(key => {
            if (key.startsWith('trans_')) {
                sessionStorage.removeItem(key);
            }
        });
    }

    // 修改 createTranslateButton 函数
    function createTranslateButton(element, sectionTitle) {
        const button = document.createElement('button');
        button.className = 'section-translate-btn';
        button.textContent = '翻译';

        button.addEventListener('click', async function() {
            try {
                // 获取原始内容
                let text = element.innerHTML;

                // 保存所有数学公式
                const formulas = new Map();
                let formulaId = 0;

                // 替换所有数学公式为占位符
                text = text.replace(/\$.*?\$/g, match => {
                    const id = `__FORMULA_${formulaId++}__`;
                    formulas.set(id, match);
                    return id;
                });

                // 替换所有内联公式
                text = text.replace(/\\[(\(].*?\\[\)]|\\[{\[].*?\\[}\]]/g, match => {
                    const id = `__FORMULA_${formulaId++}__`;
                    formulas.set(id, match);
                    return id;
                });

                // 清理HTML标签，但保留段落结构
                text = text.replace(/<p.*?>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n');
                text = text.replace(/<[^>]+>/g, '');
                text = text.replace(/&nbsp;/g, ' ');

                // 规范化空白字符
                text = text.replace(/\s+/g, ' ').trim();

                button.textContent = '翻译中...';
                button.disabled = true;

                const cacheKey = `trans_${sectionTitle}_${settings.translationAPI}_${MD5(text)}`;
                let translatedText = sessionStorage.getItem(cacheKey);

                if (!translatedText) {
                    translatedText = await translateText(text);
                    sessionStorage.setItem(cacheKey, translatedText);
                }

                // 还原所有数学公式
                formulas.forEach((formula, id) => {
                    translatedText = translatedText.replace(id, formula);
                });

                // 处理段落
                translatedText = translatedText
                    .split(/\n\s*\n/)
                    .map(p => p.trim())
                    .filter(p => p)
                    .map(p => `<p>${p}</p>`)
                    .join('\n');

                // 检查是否已存在翻译结果
                let translatedDiv = element.nextElementSibling;
                if (translatedDiv && translatedDiv.classList.contains('translated-text')) {
                    translatedDiv.remove();
                }

                // 创建新的翻译结果div
                translatedDiv = document.createElement('div');
                translatedDiv.className = 'translated-text';
                translatedDiv.innerHTML = translatedText;

                // 处理数学公式
                if (window.MathJax) {
                    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, translatedDiv]);
                }

                element.parentNode.insertBefore(translatedDiv, element.nextSibling);

                button.textContent = '翻译';
                button.disabled = false;
            } catch (error) {
                showNotification('翻译失败: ' + error.message, false);
                button.textContent = '翻译';
                button.disabled = false;
            }
        });

        return button;
    }

    // 修改 translateText 函数，添加缓存处理
    async function translateText(text) {
        let result;
        switch (settings.translationAPI) {
            case 'baidu':
                if (!settings.baiduAppId || !settings.baiduKey) {
                    throw new Error('请先配置百度翻译 API 凭证');
                }
                result = await translateWithBaidu(text);
                break;
            case 'deepseek':
                if (!settings.deepseekKey) {
                    throw new Error('请先配置 DeepSeek API Key');
                }
                result = await translateWithDeepSeek(text);
                break;
            default:
                throw new Error('未配置翻译服务');
        }

        return result;
    }

    // 移除其他翻译服务的实现，只保留百度翻译
    async function translateWithBaidu(text) {
        const salt = Date.now();
        const sign = MD5(settings.baiduAppId + text + salt + settings.baiduKey);

        try {
            const response = await fetch('https://api.fanyi.baidu.com/api/trans/vip/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    q: text,
                    from: 'auto',
                    to: 'zh',
                    appid: settings.baiduAppId,
                    salt: salt,
                    sign: sign
                })
            });

            const data = await response.json();
            if (data.trans_result) {
                return data.trans_result[0].dst;
            }
            throw new Error(data.error_msg || '翻译失败');
        } catch (error) {
            console.error('百度翻译出错:', error);
            throw error;
        }
    }

    // 添加 DeepSeek 翻译实现
    async function translateWithDeepSeek(text) {
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.deepseekKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            "role": "system",
                            "content": "你是一个专业的翻译助手。请将用户输入的英文内容翻译成中文，保持专业性和准确性。只需要返回翻译结果，不要添加任何解释或额外内容。"
                        },
                        {
                            "role": "user",
                            "content": text
                        }
                    ],
                    temperature: 0.3
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content.trim();
            }
            throw new Error(data.error?.message || '翻译失败');
        } catch (error) {
            console.error('DeepSeek 翻译出错:', error);
            throw error;
        }
    }

    // MD5 函数实现（需要添加）
    function MD5(string) {
        // 实现 MD5 加密
        // 可以使用第三方库或自己实现
    }

    // 修改设置UI创建函数
    function createSettingsUI() {
        // 创建设置按钮
        const settingsBtn = document.createElement('div');
        settingsBtn.className = 'flex-nowrap mr-3';
        settingsBtn.innerHTML = `
            <button type="button" class="better-settings-btn" id="betterSettingsBtn">
                <i class="fa fa-cog"></i>
                <span>Better设置</span>
            </button>
        `;

        // 找到目标位置并插入按钮
        const editorToolbar = document.querySelector('.form-inline.p-2');
        if (editorToolbar) {
            editorToolbar.appendChild(settingsBtn);
        }

        // 创建设置对话框
        const settingsDialog = document.createElement('div');
        settingsDialog.innerHTML = `
            <div class="modal fade" id="betterSettings" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fa fa-cog mr-2"></i>
                                LduOJBetter 设置
                            </h5>
                            <button type="button" class="close" data-dismiss="modal">
                                <span>&times;</span>
                            </button>
                        </div>
                        <div class="modal-body better-settings">
                            <label title="启用后可复制题目描述、输入输出格式等内容">
                                <input type="checkbox" id="enableCopy" ${settings.enableCopy ? 'checked' : ''}>
                                <span>启用复制功能</span>
                            </label>
                            <label title="启用后会自动保存代码，下次访问时自动恢复">
                                <input type="checkbox" id="enableCodeSave" ${settings.enableCodeSave ? 'checked' : ''}>
                                <span>启用代码自动保存</span>
                            </label>
                            <div class="save-time-setting" style="margin: 12px 0; padding: 8px 12px; background: #f8f9fa; border-radius: 6px;">
                                <div style="margin-bottom: 8px;">代码保存时间：</div>
                                <div style="display: flex; gap: 10px; align-items: center;">
                                    <div class="time-input-group">
                                        <input type="number" id="saveDay" value="${settings.saveDay}" min="0" max="30"
                                            style="width: 60px; padding: 4px; border: 1px solid #ced4da; border-radius: 4px;">
                                        <span style="margin-left: 4px;">天</span>
                                    </div>
                                    <div class="time-input-group">
                                        <input type="number" id="saveHour" value="${settings.saveHour}" min="0" max="23"
                                            style="width: 60px; padding: 4px; border: 1px solid #ced4da; border-radius: 4px;">
                                        <span style="margin-left: 4px;">小时</span>
                                    </div>
                                    <div class="time-input-group">
                                        <input type="number" id="saveMinute" value="${settings.saveMinute}" min="0" max="59"
                                            style="width: 60px; padding: 4px; border: 1px solid #ced4da; border-radius: 4px;">
                                        <span style="margin-left: 4px;">分钟</span>
                                    </div>
                                </div>
                            </div>
                            <label title="启用后可使用 Ctrl+M 快捷键发送题目到 CPH">
                                <input type="checkbox" id="enableCPH" ${settings.enableCPH ? 'checked' : ''}>
                                <span>启用 CPH 集成 (Ctrl+M)</span>
                            </label>
                            <label title="启用后可翻译题目内容">
                                <input type="checkbox" id="enableTranslate" ${settings.enableTranslate ? 'checked' : ''}>
                                <span>启用翻译功能</span>
                            </label>
                            <div class="translation-api-settings" style="margin: 12px 0; padding: 8px 12px; background: #f8f9fa; border-radius: 6px;">
                                <div style="margin-bottom: 8px;">翻译服务设置：</div>
                                <div style="margin-bottom: 8px;">
                                    <select id="translationAPI" class="form-control" style="width: auto;">
                                        <option value="baidu" ${settings.translationAPI === 'baidu' ? 'selected' : ''}>百度翻译</option>
                                        <option value="deepseek" ${settings.translationAPI === 'deepseek' ? 'selected' : ''}>DeepSeek AI</option>
                                    </select>
                                </div>

                                <div id="baiduApiSettings" class="api-settings" ${settings.translationAPI === 'baidu' ? '' : 'style="display:none;"'}>
                                    <div class="form-group">
                                        <label>百度翻译 APP ID:</label>
                                        <input type="text"
                                               id="baiduAppId"
                                               class="form-control"
                                               value="${settings.baiduAppId}"
                                               autocomplete="off"
                                               data-lpignore="true">
                                    </div>
                                    <div class="form-group">
                                        <label>百度翻译密钥:</label>
                                        <input type="password"
                                               id="baiduKey"
                                               class="form-control"
                                               value="${settings.baiduKey}"
                                               autocomplete="new-password"
                                               data-lpignore="true">
                                    </div>
                                </div>

                                <div id="deepseekApiSettings" class="api-settings" ${settings.translationAPI === 'deepseek' ? '' : 'style="display:none;"'}>
                                    <div class="form-group">
                                        <label>DeepSeek API Key:</label>
                                        <input type="password" id="deepseekKey" class="form-control" value="${settings.deepseekKey}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
                            <button type="button" class="btn btn-primary" id="saveSettings">
                                <i class="fa fa-save mr-1"></i>
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(settingsDialog);

        // 绑定事件，阻止默认行为
        document.getElementById('betterSettingsBtn').addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认行为
            e.stopPropagation(); // 阻止事件冒泡

            // 打开前更新复选框状态
            document.getElementById('enableCopy').checked = settings.enableCopy;
            document.getElementById('enableCodeSave').checked = settings.enableCodeSave;
            document.getElementById('enableCPH').checked = settings.enableCPH;
            document.getElementById('enableTranslate').checked = settings.enableTranslate;
            $('#betterSettings').modal('show');
            return false; // 确保不会触发表单提交
        });

        document.getElementById('saveSettings').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 获取并验证时间设置
            const day = Math.min(30, Math.max(0, parseInt(document.getElementById('saveDay').value) || 0));
            const hour = Math.min(23, Math.max(0, parseInt(document.getElementById('saveHour').value) || 0));
            const minute = Math.min(59, Math.max(0, parseInt(document.getElementById('saveMinute').value) || 0));

            // 检查是否设置了有效的保存时间
            if (day === 0 && hour === 0 && minute === 0) {
                showNotification('请设置有效的保存时间', false);
                return;
            }

            // 保存设置
            settings.enableCopy = document.getElementById('enableCopy').checked;
            settings.enableCodeSave = document.getElementById('enableCodeSave').checked;
            settings.enableCPH = document.getElementById('enableCPH').checked;
            settings.enableTranslate = document.getElementById('enableTranslate').checked;
            settings.saveDay = day;
            settings.saveHour = hour;
            settings.saveMinute = minute;

            settings.translationAPI = document.getElementById('translationAPI').value;
            settings.baiduAppId = document.getElementById('baiduAppId').value;
            settings.baiduKey = document.getElementById('baiduKey').value;
            settings.deepseekKey = document.getElementById('deepseekKey').value;

            GM_setValue('enableCopy', settings.enableCopy);
            GM_setValue('enableCodeSave', settings.enableCodeSave);
            GM_setValue('enableCPH', settings.enableCPH);
            GM_setValue('enableTranslate', settings.enableTranslate);
            GM_setValue('saveDay', settings.saveDay);
            GM_setValue('saveHour', settings.saveHour);
            GM_setValue('saveMinute', settings.saveMinute);
            GM_setValue('translationAPI', settings.translationAPI);
            GM_setValue('baiduAppId', settings.baiduAppId);
            GM_setValue('baiduKey', settings.baiduKey);
            GM_setValue('deepseekKey', settings.deepseekKey);

            // 关闭对话框
            $('#betterSettings').modal('hide');

            // 显示保存成功提示
            showNotification('设置已保存，正在刷新...', true);

            // 延迟刷新页面
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            return false;
        });

        // 添加 API 设置切换事件
        document.getElementById('translationAPI').addEventListener('change', function() {
            const apiType = this.value;
            document.querySelectorAll('.api-settings').forEach(el => el.style.display = 'none');
            document.getElementById(apiType + 'ApiSettings').style.display = 'block';
        });
    }

    // 修改初始化函数
    function initFeatures() {
        // 使用 requestIdleCallback 在浏览器空闲时初始化
        const initTask = () => {
            const editorToolbar = document.querySelector('.form-inline.p-2');
            if (editorToolbar) {
                createSettingsUI();
                updateFeatures();
                return;
            }
            // 如果还没找到目标元素，继续等待
            requestIdleCallback(initTask);
        };

        // 如果浏览器不支持 requestIdleCallback，使用 setTimeout 作为降级方案
        if ('requestIdleCallback' in window) {
            requestIdleCallback(initTask);
        } else {
            setTimeout(initTask, 100);
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFeatures);
    } else {
        initFeatures();
    }
})();