// ==UserScript==
// @name         百度贴吧密文解密器
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  自动检测并解密百度贴吧中的密文
// @author       travellerse
// @license      MIT
// @match        https://tieba.baidu.com/p/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/542398/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%AF%86%E6%96%87%E8%A7%A3%E5%AF%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542398/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%AF%86%E6%96%87%E8%A7%A3%E5%AF%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 密文解密器
     */
    class BeastLanguageDecryptor {
        // 常量定义
        static CONSTANTS = {
            DICT_VALUE_MAPPING: [3, 1, 0, 2],
            MIN_CIPHER_LENGTH: 8,
            REQUIRED_UNIQUE_CHARS: 4,
            CIPHER_PREFIX_LENGTH: 3,
            CIPHER_SUFFIX_LENGTH: 1,
            MAX_TEXT_LENGTH: 50000,
            MAX_CONTROL_CHAR_RATIO: 0.1,
            HEX_CHUNK_SIZE: 4,
            SUCCESS_RATE_THRESHOLD: 0.8,
            MIN_DECRYPTION_COUNT: 10,
            NOTIFICATION_DURATION: 3000,
            COPY_FEEDBACK_DURATION: 1000,

            SELECTORS: {
                POST_CONTENT: '.d_post_content, .j_d_post_content, .p_content, .post-content',
                EXCLUDED_TAGS: ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT']
            },

            STORAGE_KEYS: {
                AUTO_DECRYPT: 'autoDecrypt',
                SHOW_ORIGINAL: 'showOriginal',
                HIGHLIGHT_STYLE: 'highlightStyle',
                ENABLE_STATS: 'enableStats',
                DEBUG_MODE: 'debugMode',
                TOTAL_DECRYPTED: 'totalDecrypted',
                ERRORS: 'errors',
                PAGES_VISITED: 'pagesVisited'
            },

            THEMES: {
                blue: '#2196f3',
                green: '#4caf50',
                purple: '#9c27b0',
                orange: '#ff9800'
            },

            // URL正则表达式
            URL_REGEX: /https?:\/\/[^\s<>"'()[\]{}]+/gi
        };

        constructor() {
            this.config = this._loadConfig();
            this.stats = this._loadStats();
            this.currentDict = null;
            this.processedElements = new WeakSet();
            this.init();
        }

        /**
         * 加载配置
         */
        _loadConfig() {
            const keys = BeastLanguageDecryptor.CONSTANTS.STORAGE_KEYS;
            return {
                autoDecrypt: GM_getValue(keys.AUTO_DECRYPT, true),
                showOriginal: GM_getValue(keys.SHOW_ORIGINAL, true),
                highlightStyle: GM_getValue(keys.HIGHLIGHT_STYLE, 'blue'),
                enableStats: GM_getValue(keys.ENABLE_STATS, true),
                debugMode: GM_getValue(keys.DEBUG_MODE, false)
            };
        }

        /**
         * 加载统计数据
         */
        _loadStats() {
            const keys = BeastLanguageDecryptor.CONSTANTS.STORAGE_KEYS;
            return {
                totalDecrypted: GM_getValue(keys.TOTAL_DECRYPTED, 0),
                sessionDecrypted: 0,
                errors: GM_getValue(keys.ERRORS, 0)
            };
        }

        /**
         * 保存配置
         */
        _saveConfig() {
            const keys = BeastLanguageDecryptor.CONSTANTS.STORAGE_KEYS;
            GM_setValue(keys.AUTO_DECRYPT, this.config.autoDecrypt);
            GM_setValue(keys.SHOW_ORIGINAL, this.config.showOriginal);
            GM_setValue(keys.HIGHLIGHT_STYLE, this.config.highlightStyle);
            GM_setValue(keys.ENABLE_STATS, this.config.enableStats);
            GM_setValue(keys.DEBUG_MODE, this.config.debugMode);
        }

        /**
         * 更新统计数据
         */
        _updateStats(type, increment = 1) {
            const keys = BeastLanguageDecryptor.CONSTANTS.STORAGE_KEYS;
            switch (type) {
                case 'decrypted':
                    this.stats.totalDecrypted += increment;
                    this.stats.sessionDecrypted += increment;
                    GM_setValue(keys.TOTAL_DECRYPTED, this.stats.totalDecrypted);
                    break;
                case 'errors':
                    this.stats.errors += increment;
                    GM_setValue(keys.ERRORS, this.stats.errors);
                    break;
            }
        }

        /**
         * 清除所有统计数据
         */
        _clearAllStats() {
            const keys = BeastLanguageDecryptor.CONSTANTS.STORAGE_KEYS;
            GM_setValue(keys.TOTAL_DECRYPTED, 0);
            GM_setValue(keys.ERRORS, 0);
            GM_setValue(keys.PAGES_VISITED, 0);
            this.stats.totalDecrypted = 0;
            this.stats.sessionDecrypted = 0;
            this.stats.errors = 0;
        }

        /**
         * 初始化
         */
        init() {
            this.initStyles();
            this.registerMenuCommands();
            this.loadUserPreferences();

            if (this.config.debugMode) {
                console.log('🐺 密文解密器已初始化', this.config);
            }
        }

        /**
         * 注册菜单命令
         */
        registerMenuCommands() {
            GM_registerMenuCommand('📊 查看统计', () => this.showStats());
            GM_registerMenuCommand('⚙️ 设置', () => this.showSettings());
            GM_registerMenuCommand('🔄 重新扫描页面', () => this.scanAndProcess());
            GM_registerMenuCommand('🗑️ 清除统计', () => this.clearStats());
        }

        /**
         * 加载用户偏好设置
         */
        loadUserPreferences() {
            const { totalDecrypted, errors } = this.stats;
            const { SUCCESS_RATE_THRESHOLD, MIN_DECRYPTION_COUNT } = BeastLanguageDecryptor.CONSTANTS;

            const successRate = totalDecrypted / (totalDecrypted + errors + 1);
            if (successRate < SUCCESS_RATE_THRESHOLD && totalDecrypted > MIN_DECRYPTION_COUNT) {
                this.config.debugMode = true;
                console.warn('🐺 检测到较低的成功率，已自动启用调试模式');
            }
        }

        /**
         * 显示统计信息
         */
        showStats() {
            const keys = BeastLanguageDecryptor.CONSTANTS.STORAGE_KEYS;
            const totalPages = GM_getValue(keys.PAGES_VISITED, 0) + 1;
            GM_setValue(keys.PAGES_VISITED, totalPages);

            const successRate = this.stats.totalDecrypted > 0
                ? ((this.stats.totalDecrypted / (this.stats.totalDecrypted + this.stats.errors)) * 100).toFixed(1)
                : 100;

            alert(`📊 密文解密统计\n\n` +
                `总解密次数: ${this.stats.totalDecrypted}\n` +
                `本次会话: ${this.stats.sessionDecrypted}\n` +
                `错误次数: ${this.stats.errors}\n` +
                `访问页面: ${totalPages}\n` +
                `成功率: ${successRate}%`);
        }

        /**
         * 显示设置面板
         */
        showSettings() {
            const settings = [
                { key: 'autoDecrypt', label: '是否启用自动解密？', current: this.config.autoDecrypt },
                { key: 'showOriginal', label: '是否显示原文？', current: this.config.showOriginal },
                { key: 'debugMode', label: '是否启用调试模式？', current: this.config.debugMode }
            ];

            const updates = {};
            let hasChanges = false;

            for (const setting of settings) {
                const currentText = setting.current ? '启用' : (setting.key === 'showOriginal' ? '显示' : '禁用');
                const hideText = setting.key === 'showOriginal' ? '隐藏' : '禁用';
                const newValue = confirm(`${setting.label}\n当前: ${currentText}`);

                if (newValue !== setting.current) {
                    hasChanges = true;
                }
                updates[setting.key] = newValue;
            }

            if (hasChanges) {
                Object.assign(this.config, updates);
                this._saveConfig();
                alert('设置已保存！页面将重新加载生效。');
                location.reload();
            }
        }

        /**
         * 清除统计数据
         */
        clearStats() {
            if (confirm('确定要清除所有统计数据吗？')) {
                this._clearAllStats();
                alert('统计数据已清除！');
            }
        }

        /**
         * 初始化样式
         */
        initStyles() {
            const styleId = 'beast-decryptor-styles';
            if (document.getElementById(styleId)) return;

            const themeColor = BeastLanguageDecryptor.CONSTANTS.THEMES[this.config.highlightStyle] ||
                BeastLanguageDecryptor.CONSTANTS.THEMES.blue;

            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = this._generateCSS(themeColor);
            document.head.appendChild(style);
        }

        /**
         * 生成CSS样式
         */
        _generateCSS(themeColor) {
            const wordWrapStyles = 'white-space: pre-wrap; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word;';

            return `
                .beast-decrypted {
                    background: linear-gradient(90deg, ${themeColor}15, ${themeColor}08);
                    border-left: 4px solid ${themeColor};
                    padding: 16px 12px 12px;
                    margin: 16px 0;
                    border-radius: 6px;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }
                
                .beast-decrypted:hover {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    transform: translateY(-1px);
                }
                
                .beast-decrypted::before {
                    content: "🐺 密文解密 #" counter(beast-counter);
                    counter-increment: beast-counter;
                    position: absolute;
                    top: -12px;
                    left: 16px;
                    background: ${themeColor};
                    color: white;
                    padding: 2px 6px;
                    font-size: 10px;
                    border-radius: 3px;
                    font-weight: bold;
                    z-index: 10;
                    white-space: nowrap;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                
                body {
                    counter-reset: beast-counter;
                }
                
                .beast-content {
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 8px;
                    ${wordWrapStyles}
                }
                
                .beast-original {
                    font-size: 11px;
                    color: #666;
                    font-style: italic;
                    margin-top: 8px;
                    padding: 6px;
                    background: rgba(0,0,0,0.05);
                    border-radius: 3px;
                    max-height: 100px;
                    overflow-y: auto;
                    word-break: break-all;
                    ${wordWrapStyles}
                }
                
                .beast-controls {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                    flex-wrap: wrap;
                }
                
                .beast-btn {
                    cursor: pointer;
                    color: ${themeColor};
                    text-decoration: none;
                    font-size: 11px;
                    padding: 4px 6px;
                    border: 1px solid ${themeColor}40;
                    border-radius: 3px;
                    background: white;
                    transition: all 0.2s ease;
                }
                
                .beast-btn:hover {
                    background: ${themeColor};
                    color: white;
                }
                
                .beast-url-link {
                    color: ${themeColor};
                    text-decoration: underline;
                    word-break: break-all;
                    cursor: pointer;
                    transition: color 0.2s ease;
                }
                
                .beast-url-link:hover {
                    color: ${themeColor}dd;
                    text-decoration: underline;
                }
                
                .beast-url-link:visited {
                    color: ${themeColor}aa;
                }
                
                .beast-error {
                    color: #f44336;
                    font-size: 12px;
                    font-style: italic;
                    padding: 4px;
                    background: #ffebee;
                    border-radius: 3px;
                    margin-top: 4px;
                }
                
                .beast-stats {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 10000;
                    display: none;
                }
                
                .beast-stats.show {
                    display: block;
                    animation: fadeInOut 3s ease-in-out;
                }
                
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0; }
                    10%, 90% { opacity: 1; }
                }
            `;
        }

        /**
         * 自动识别密文字典
         * @param {string} cipherText 密文
         * @returns {Object|null} 字典对象或null
         */
        autoDetectDict(cipherText) {
            const { MIN_CIPHER_LENGTH, REQUIRED_UNIQUE_CHARS, DICT_VALUE_MAPPING } = BeastLanguageDecryptor.CONSTANTS;

            if (!cipherText || cipherText.length < MIN_CIPHER_LENGTH) return null;

            const uniqueChars = [...new Set(cipherText)];
            if (uniqueChars.length !== REQUIRED_UNIQUE_CHARS) return null;

            const dict = {};
            uniqueChars.forEach((char, index) => {
                dict[char] = DICT_VALUE_MAPPING[index];
            });

            return dict;
        }

        /**
         * 检测文本是否为密文（统一格式）
         */
        isBeastCipher(text) {
            if (!text || typeof text !== 'string') return false;

            const cleanText = text.trim();
            const { MIN_CIPHER_LENGTH, REQUIRED_UNIQUE_CHARS, CIPHER_PREFIX_LENGTH, CIPHER_SUFFIX_LENGTH } = BeastLanguageDecryptor.CONSTANTS;

            // 基本长度检查
            if (cleanText.length < MIN_CIPHER_LENGTH) return false;

            // 检查去除标识字符后的长度是否为偶数
            const actualLength = cleanText.length - CIPHER_PREFIX_LENGTH - CIPHER_SUFFIX_LENGTH;
            if (actualLength % 2 !== 0) return false;

            // 检查字符种类数量
            const uniqueChars = [...new Set(cleanText)];
            if (uniqueChars.length !== REQUIRED_UNIQUE_CHARS) return false;

            // 验证字典
            const dict = this.autoDetectDict(cleanText);
            if (!dict) return false;

            // 验证所有字符都在字典中
            return cleanText.split('').every(char => char in dict);
        }

        /**
         * 转换函数 - 字符串转16进制
         */
        stringToHex(str) {
            const { HEX_CHUNK_SIZE } = BeastLanguageDecryptor.CONSTANTS;
            let result = '';

            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                let hex = charCode.toString(16);
                result += hex.padStart(HEX_CHUNK_SIZE, '0');
            }
            return result;
        }

        /**
         * 转换函数 - 16进制转字符串
         */
        hexToString(hex) {
            const { HEX_CHUNK_SIZE } = BeastLanguageDecryptor.CONSTANTS;
            let result = '';

            try {
                for (let i = 0; i < hex.length; i += HEX_CHUNK_SIZE) {
                    const hexChunk = hex.substr(i, HEX_CHUNK_SIZE);
                    if (hexChunk.length === HEX_CHUNK_SIZE) {
                        const charCode = parseInt(hexChunk, 16);
                        if (!isNaN(charCode) && charCode > 0) {
                            result += String.fromCharCode(charCode);
                        }
                    }
                }
            } catch (error) {
                this._debugLog('Hex to string conversion error:', error);
                throw new Error('解码失败：无效的十六进制数据');
            }
            return result;
        }

        /**
         * 解密函数
         */
        decrypt(cipherText) {
            try {
                const cleanText = cipherText.trim();
                const { CIPHER_PREFIX_LENGTH, CIPHER_SUFFIX_LENGTH, MIN_CIPHER_LENGTH } = BeastLanguageDecryptor.CONSTANTS;

                if (!this.isBeastCipher(cleanText)) {
                    throw new Error('不是有效的密文格式');
                }

                // 自动识别并设置当前字典
                this.currentDict = this.autoDetectDict(cleanText);
                if (!this.currentDict) {
                    throw new Error('无法识别密文字典');
                }

                // 提取实际密文（去掉标识字符）
                if (cleanText.length < MIN_CIPHER_LENGTH) {
                    throw new Error('密文长度不足，无法去除标识字符');
                }

                const actualCipherText = cleanText.slice(CIPHER_PREFIX_LENGTH, -CIPHER_SUFFIX_LENGTH);

                if (actualCipherText.length % 2 !== 0) {
                    throw new Error('去除标识字符后的密文长度必须为偶数');
                }

                // 解密逻辑
                const hexString = this._decryptToHex(actualCipherText);
                const result = this.hexToString(hexString);

                // 更新统计
                this._updateStats('decrypted');

                this._debugLog('解密成功:', {
                    input: cleanText,
                    actualCipher: actualCipherText,
                    detectedDict: this.currentDict,
                    hex: hexString,
                    result: result
                });

                return result;

            } catch (error) {
                this._updateStats('errors');
                this._debugLog('解密失败:', error, cipherText);
                throw error;
            }
        }

        /**
         * 解密为十六进制字符串
         */
        _decryptToHex(cipherText) {
            let hexString = '';
            let n = 0;

            for (let i = 0; i < cipherText.length; i += 2) {
                const char1 = cipherText[i];
                const char2 = cipherText[i + 1];

                if (!char2) {
                    throw new Error('密文长度无效');
                }

                const pos1 = this.currentDict[char1];
                const pos2 = this.currentDict[char2];

                if (pos1 === undefined || pos2 === undefined) {
                    throw new Error('密文包含无效字符');
                }

                let k = (pos1 * 4 + pos2) - (n % 16);
                if (k < 0) {
                    k += 16;
                }

                hexString += k.toString(16);
                n++;
            }

            return hexString;
        }

        /**
         * 验证解密结果
         */
        isValidDecryption(text) {
            if (!text || text.length === 0) return false;

            const { MAX_TEXT_LENGTH, MAX_CONTROL_CHAR_RATIO } = BeastLanguageDecryptor.CONSTANTS;

            // 检查长度
            const hasReasonableLength = text.length > 0 && text.length < MAX_TEXT_LENGTH;

            // 检查控制字符比例
            const controlCharCount = (text.match(/[\x00-\x1F]/g) || []).length;
            const hasAcceptableControlChars = controlCharCount / text.length < MAX_CONTROL_CHAR_RATIO;

            return hasReasonableLength && hasAcceptableControlChars;
        }

        /**
         * 调试日志输出
         */
        _debugLog(...args) {
            if (this.config.debugMode) {
                console.log('🐺', ...args);
            }
        }

        /**
         * 调试错误输出
         */
        _debugError(...args) {
            if (this.config.debugMode) {
                console.error('🐺', ...args);
            }
        }

        /**
         * HTML文本转义
         */
        _escapeHtml(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        /**
         * 将文本中的URL转换为可点击的链接
         */
        _linkifyUrls(text) {
            const { URL_REGEX } = BeastLanguageDecryptor.CONSTANTS;

            return text.replace(URL_REGEX, (url) => {
                // 确保URL格式正确
                const href = url.startsWith('http') ? url : `http://${url}`;
                return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="beast-url-link">${url}</a>`;
            });
        }

        /**
         * 处理文本内容（转义、换行、URL链接化）
         */
        _processTextContent(text, allowHtml = false) {
            if (!allowHtml) {
                return text;
            }

            // 先转义HTML，然后处理换行符和URL
            let processed = this._escapeHtml(text);

            // 处理换行符
            if (text.includes('\n')) {
                processed = processed.replace(/\n/g, '<br>');
            }

            // 链接化URL
            processed = this._linkifyUrls(processed);

            return processed;
        }

        /**
         * 设置文本内容（支持换行符处理和URL链接）
         */
        _setTextContent(element, text, allowHtml = false) {
            if (allowHtml) {
                element.innerHTML = this._processTextContent(text, true);
            } else {
                element.textContent = text;
            }
        }

        /**
         * 复制文本到剪贴板
         */
        async _copyToClipboard(text, button) {
            const { COPY_FEEDBACK_DURATION } = BeastLanguageDecryptor.CONSTANTS;
            const originalText = button.textContent;

            try {
                await navigator.clipboard.writeText(text);
                button.textContent = '已复制';
            } catch (error) {
                // 降级方案
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                button.textContent = '已复制';
            }

            setTimeout(() => {
                button.textContent = originalText;
            }, COPY_FEEDBACK_DURATION);
        }

        /**
         * 创建控制按钮
         */
        _createControlButton(text, onClick) {
            const btn = document.createElement('span');
            btn.className = 'beast-btn';
            btn.textContent = text;
            btn.onclick = onClick;
            return btn;
        }

        /**
         * 创建解密后的内容元素
         */
        createDecryptedElement(originalText, decryptedText) {
            const container = document.createElement('div');
            container.className = 'beast-decrypted';

            // 解密内容
            const contentDiv = document.createElement('div');
            contentDiv.className = 'beast-content';
            this._setTextContent(contentDiv, decryptedText, true);
            container.appendChild(contentDiv);

            // 调试信息：字典显示
            if (this.currentDict && this.config.debugMode) {
                const dictDiv = document.createElement('div');
                dictDiv.className = 'beast-dict-info';
                dictDiv.style.cssText = 'font-size: 10px; color: #888; margin: 4px 0;';
                const dictInfo = Object.entries(this.currentDict)
                    .map(([char, value]) => `${char}:${value}`)
                    .join(' ');
                dictDiv.textContent = `字典: ${dictInfo}`;
                container.appendChild(dictDiv);
            }

            // 控制按钮区域
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'beast-controls';

            // 原文显示功能
            if (this.config.showOriginal) {
                const { originalDiv, toggleBtn } = this._createOriginalTextDisplay(originalText);
                container.appendChild(originalDiv);
                controlsDiv.appendChild(toggleBtn);
            }

            // 复制按钮
            const copyBtn = this._createControlButton('复制', () => {
                this._copyToClipboard(decryptedText, copyBtn);
            });
            controlsDiv.appendChild(copyBtn);

            container.appendChild(controlsDiv);
            return container;
        }

        /**
         * 创建原文显示组件
         */
        _createOriginalTextDisplay(originalText) {
            const originalDiv = document.createElement('div');
            originalDiv.className = 'beast-original';
            originalDiv.style.display = 'none';
            this._setTextContent(originalDiv, `原文: ${originalText}`, true);

            const toggleBtn = this._createControlButton('显示原文', () => {
                const isVisible = originalDiv.style.display !== 'none';
                originalDiv.style.display = isVisible ? 'none' : 'block';
                toggleBtn.textContent = isVisible ? '显示原文' : '隐藏原文';
            });

            return { originalDiv, toggleBtn };
        }

        /**
         * 处理文本节点
         */
        processTextNode(textNode) {
            if (!textNode.textContent || this.processedElements.has(textNode)) return;

            const originalText = textNode.textContent;
            const lines = originalText.split('\n');
            let hasDecryption = false;
            let newContent = '';

            for (const line of lines) {
                let processedLine = line;

                if (this.isBeastCipher(line)) {
                    try {
                        const decrypted = this.decrypt(line);

                        if (this.isValidDecryption(decrypted)) {
                            processedLine = decrypted;
                            hasDecryption = true;
                            this.showDecryptionNotification();
                        }
                    } catch (error) {
                        this._debugError('解密失败:', line, error);
                    }
                }

                newContent += (newContent ? '\n' : '') + processedLine;
            }

            if (hasDecryption && textNode.parentElement) {
                const parentElement = textNode.parentElement;
                this.replaceWithDecryptedContent(textNode, originalText, newContent);
                this.processedElements.add(parentElement);
            }
        }

        /**
         * 显示解密通知
         */
        showDecryptionNotification() {
            if (!this.config.enableStats) return;

            const { NOTIFICATION_DURATION } = BeastLanguageDecryptor.CONSTANTS;
            const statsDiv = document.querySelector('.beast-stats') || this._createStatsDiv();

            statsDiv.textContent = `🐺 已解密 ${this.stats.sessionDecrypted} 条消息`;
            statsDiv.classList.add('show');

            setTimeout(() => {
                statsDiv.classList.remove('show');
            }, NOTIFICATION_DURATION);
        }

        /**
         * 创建统计显示元素
         */
        _createStatsDiv() {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'beast-stats';
            document.body.appendChild(statsDiv);
            return statsDiv;
        }

        /**
         * 替换文本内容
         */
        replaceWithDecryptedContent(textNode, originalText, decryptedText) {
            const parent = textNode.parentElement;
            const container = this.createDecryptedElement(originalText, decryptedText);
            parent.replaceChild(container, textNode);
        }

        /**
         * 处理容器
         */
        processContainer(container) {
            if (this.processedElements.has(container)) return;

            const walker = this._createTextWalker(container);
            const textNodes = this._collectTextNodes(walker);

            textNodes.forEach(textNode => {
                this.processTextNode(textNode);
            });

            this.processedElements.add(container);
        }

        /**
         * 创建文本遍历器
         */
        _createTextWalker(container) {
            const { EXCLUDED_TAGS } = BeastLanguageDecryptor.CONSTANTS.SELECTORS;

            return document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        if (!node.parentElement ||
                            this.processedElements.has(node.parentElement) ||
                            EXCLUDED_TAGS.includes(node.parentElement.tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );
        }

        /**
         * 收集文本节点
         */
        _collectTextNodes(walker) {
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            return textNodes;
        }

        /**
         * 扫描并处理页面
         */
        scanAndProcess() {
            if (!this.config.autoDecrypt) return;

            const { POST_CONTENT } = BeastLanguageDecryptor.CONSTANTS.SELECTORS;
            const postContents = document.querySelectorAll(POST_CONTENT);

            postContents.forEach(container => {
                this.processContainer(container);
            });

            this._debugLog(`扫描完成，处理了 ${postContents.length} 个容器`);
        }

        /**
         * 启动
         */
        start() {
            // 初始扫描
            setTimeout(() => this.scanAndProcess(), 1000);

            // 设置DOM监控
            this._setupDOMObserver();

            // 设置页面可见性监控
            this._setupVisibilityObserver();

            console.log('🐺 密文解密器已启动');
        }

        /**
         * 设置DOM变化监控
         */
        _setupDOMObserver() {
            const { POST_CONTENT } = BeastLanguageDecryptor.CONSTANTS.SELECTORS;

            const observer = new MutationObserver((mutations) => {
                const needScan = mutations.some(mutation =>
                    mutation.type === 'childList' &&
                    mutation.addedNodes.length > 0 &&
                    this._hasRelevantNodes(mutation.addedNodes, POST_CONTENT)
                );

                if (needScan) {
                    setTimeout(() => this.scanAndProcess(), 500);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        /**
         * 检查是否包含相关节点
         */
        _hasRelevantNodes(nodes, selector) {
            for (const node of nodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches?.(selector) || node.querySelector?.(selector)) {
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * 设置页面可见性监控
         */
        _setupVisibilityObserver() {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    setTimeout(() => this.scanAndProcess(), 1000);
                }
            });
        }
    }

    // 启动脚本
    function initDecryptor() {
        const decryptor = new BeastLanguageDecryptor();
        decryptor.start();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDecryptor);
    } else {
        initDecryptor();
    }

})();
