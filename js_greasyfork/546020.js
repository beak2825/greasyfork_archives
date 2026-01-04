// ==UserScript==
// @name         古诗文网完形填空生成器
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  在古诗文网上生成完形填空练习，点击填空可显示原文
// @author       ChatGPT
// @match        https://www.gushiwen.cn/shiwenv.aspx?id=*
// @match        https://www.gushiwen.cn/shiwenv_*.aspx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546020/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%AE%8C%E5%BD%A2%E5%A1%AB%E7%A9%BA%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546020/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%AE%8C%E5%BD%A2%E5%A1%AB%E7%A9%BA%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const DEFAULT_PROBABILITY = 0.5; // 默认替换概率

    // 创建控制面板
    function createControlPanel() {
        // 创建折叠按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'cloze-toggle-btn';
        toggleBtn.innerHTML = '📝';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.top = '20px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.width = '40px';
        toggleBtn.style.height = '40px';
        toggleBtn.style.backgroundColor = '#3498db';
        toggleBtn.style.color = 'white';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.fontSize = '20px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.zIndex = '10000';
        toggleBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toggleBtn.style.transition = 'all 0.3s ease';

        // 悬停效果
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1)';
            toggleBtn.style.backgroundColor = '#2980b9';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1)';
            toggleBtn.style.backgroundColor = '#3498db';
        });

        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'cloze-panel';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        panel.style.border = '1px solid #e0e0e0';
        panel.style.borderRadius = '8px';
        panel.style.padding = '15px';
        panel.style.zIndex = '10000';
        panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        panel.style.fontFamily = '"Microsoft YaHei", sans-serif';
        panel.style.width = '260px';
        panel.style.transition = 'all 0.3s ease';
        panel.style.display = 'none'; // 初始隐藏

        panel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:#2c3e50; font-size:16px;">完形填空设置</h3>
                <button id="closePanelBtn" style="background:none; border:none; font-size:20px; cursor:pointer; color:#7f8c8d;">×</button>
            </div>
            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:8px; font-weight:bold; color:#34495e;">替换概率 (0-1):</label>
                <input type="number" id="probabilityInput" min="0" max="1" step="0.1" value="${DEFAULT_PROBABILITY}" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; box-sizing:border-box;">
            </div>
            <button id="generateBtn" style="background-color:#3498db; color:white; border:none; padding:10px 15px; border-radius:4px; cursor:pointer; width:100%; font-weight:bold; transition:background-color 0.3s; margin-bottom:10px;">生成填空</button>
            <button id="resetBtn" style="background-color:#95a5a6; color:white; border:none; padding:10px 15px; border-radius:4px; cursor:pointer; width:100%; font-weight:bold; transition:background-color 0.3s;">恢复原文</button>
            <div style="margin-top:15px; font-size:12px; color:#7f8c8d; line-height:1.5;">
                <p>说明：</p>
                <ul style="padding-left:15px; margin-top:5px;">
                    <li>点击"生成填空"根据概率随机挖空</li>
                    <li>点击"恢复原文"可恢复原始文本</li>
                    <li>段首缩进会被保留且不可挖空</li>
                    <li>标点符号始终可见</li>
                    <li><strong>点击填空区域可显示原文</strong></li>
                </ul>
            </div>
        `;

        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);

        // 添加事件监听
        toggleBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            toggleBtn.style.display = 'none';
        });

        document.getElementById('closePanelBtn').addEventListener('click', () => {
            panel.style.display = 'none';
            toggleBtn.style.display = 'flex';
        });

        document.getElementById('generateBtn').addEventListener('click', generateCloze);
        document.getElementById('resetBtn').addEventListener('click', resetOriginal);
    }

    // 恢复原文
    function resetOriginal() {
        const contentDiv = document.querySelector('.contson');
        if (!contentDiv) return;

        if (contentDiv.dataset.original) {
            contentDiv.innerHTML = contentDiv.dataset.original;
        }
    }

    // 生成完形填空
    function generateCloze() {
        // 获取用户设置的概率
        const probability = parseFloat(document.getElementById('probabilityInput').value) || DEFAULT_PROBABILITY;

        // 找到诗文容器
        const contentDiv = document.querySelector('.contson');
        if (!contentDiv) {
            alert('未找到诗文内容！');
            return;
        }

        // 保存原始内容以便重新生成
        if (!contentDiv.dataset.original) {
            contentDiv.dataset.original = contentDiv.innerHTML;
        } else {
            // 重置为原始HTML，保留格式
            contentDiv.innerHTML = contentDiv.dataset.original;
        }

        // 获取原始HTML内容
        const originalHTML = contentDiv.innerHTML;

        // 创建新的HTML内容
        let newHTML = originalHTML;

        // 处理段落：保留缩进和换行
        if (originalHTML.includes('<p>') || originalHTML.includes('</p>')) {
            // 处理<p>标签分段
            newHTML = processParagraphsWithPTags(originalHTML, probability);
        } else {
            // 处理<br>标签分段
            const paragraphs = originalHTML.split('<br>');
            if (paragraphs.length > 1) {
                newHTML = paragraphs.map(para => processParagraph(para, probability)).join('<br>');
            } else {
                newHTML = processParagraph(originalHTML, probability);
            }
        }

        // 应用新内容
        contentDiv.innerHTML = newHTML;

        // 添加样式
        addStyles();

        // 添加点击事件监听
        addClickEvents();
    }

    // 处理包含<p>标签的段落
    function processParagraphsWithPTags(html, probability) {
        // 使用正则表达式分割<p>标签
        const pTagRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
        const matches = [];
        let lastIndex = 0;
        let match;

        // 查找所有<p>标签
        while ((match = pTagRegex.exec(html)) !== null) {
            // 保存<p>标签前的文本
            if (match.index > lastIndex) {
                matches.push({
                    type: 'text',
                    content: html.substring(lastIndex, match.index)
                });
            }

            // 保存<p>标签内容
            matches.push({
                type: 'p',
                content: match[1],
                fullTag: match[0]
            });

            lastIndex = match.index + match[0].length;
        }

        // 保存最后一段文本
        if (lastIndex < html.length) {
            matches.push({
                type: 'text',
                content: html.substring(lastIndex)
            });
        }

        // 处理每个段落
        let processedHTML = '';
        for (const item of matches) {
            if (item.type === 'p') {
                // 处理<p>标签内的内容
                const processedContent = processParagraph(item.content, probability);
                processedHTML += item.fullTag.replace(item.content, processedContent);
            } else {
                // 处理非<p>标签的文本内容
                processedHTML += processParagraph(item.content, probability);
            }
        }

        return processedHTML;
    }

    // 处理单个段落
    function processParagraph(html, probability) {
        // 匹配段首空白（包括空格、全角空格和&nbsp;）
        const leadingSpaceRegex = /^(\s|　|&nbsp;)+/;
        const spaceMatch = html.match(leadingSpaceRegex);

        let leadingSpaces = '';
        let content = html;

        if (spaceMatch) {
            leadingSpaces = spaceMatch[0];
            content = html.substring(spaceMatch[0].length);
        }

        // 根据标点符号切分句子
        const sentences = splitSentences(content);

        // 处理每个句子
        let processedContent = leadingSpaces; // 保留段首空白（不可挖空）
        for (const sentence of sentences) {
            // 跳过空句子
            if (!sentence.trim()) continue;

            // 随机决定是否替换
            if (Math.random() < probability) {
                // 创建带标点的下划线填空
                const blankWithPunctuation = createBlankWithPunctuation(sentence);
                processedContent += blankWithPunctuation;
            } else {
                // 保留原句
                processedContent += `<span class="cloze-sentence">${sentence}</span>`;
            }
        }

        return processedContent;
    }

    // 根据标点符号切分句子
    function splitSentences(text) {
        // 中文标点符号：，。！？；
        const punctuation = /([，。！？；：“”])/g;
        const parts = text.split(punctuation);

        // 重新组合标点符号
        const sentences = [];
        for (let i = 0; i < parts.length; i += 2) {
            const sentence = parts[i] + (parts[i+1] || '');
            if (sentence.trim()) {
                sentences.push(sentence);
            }
        }

        return sentences;
    }

    // 创建带标点的下划线填空
    function createBlankWithPunctuation(sentence) {
        // 分离文字和标点
        const textParts = [];
        let currentText = '';
        let currentPunctuation = '';

        // 遍历每个字符
        for (const char of sentence) {
            if (/[，。！？；：“”]/.test(char)) {
                // 如果是标点符号
                if (currentText) {
                    textParts.push({text: currentText, punctuation: ''});
                    currentText = '';
                }
                currentPunctuation = char;
                textParts.push({text: '', punctuation: currentPunctuation});
            } else {
                // 如果是文字
                currentText += char;
                if (currentPunctuation) {
                    textParts.push({text: currentText, punctuation: currentPunctuation});
                    currentText = '';
                    currentPunctuation = '';
                }
            }
        }

        // 处理剩余的文本
        if (currentText) {
            textParts.push({text: currentText, punctuation: currentPunctuation || ''});
        }

        // 构建HTML
        let html = '';
        for (const part of textParts) {
            if (part.punctuation) {
                // 标点符号始终可见
                html += `<span class="cloze-punctuation">${part.punctuation}</span>`;
            }

            if (part.text) {
                // 文字部分替换为下划线，并存储原始文本
                html += `<span class="cloze-blank" data-original="${escapeHTML(part.text)}">${part.text}</span>`;
            }
        }

        return html;
    }

    // HTML转义函数
    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
    }

    // 添加样式
    function addStyles() {
        // 防止重复添加样式
        if (document.getElementById('cloze-styles')) return;

        const style = document.createElement('style');
        style.id = 'cloze-styles';
        style.innerHTML = `
            .cloze-blank {
                display: inline-block;
                position: relative;
                margin: 0 1px;
                padding: 0 2px;
                background-color: #f8f9fa;
                border-radius: 3px;
                vertical-align: baseline;
                line-height: 1.5;
                cursor: pointer;
                transition: all 0.3s ease;
                color: transparent !important; /* 文字透明 */
            }

            .cloze-blank::after {
                content: "";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 2px;
                background-color: #3498db;
                z-index: 1;
            }

            .cloze-blank:hover {
                background-color: #e3f2fd;
            }

            .cloze-blank.revealed {
                background-color: #e8f5e9;
                color: #2e7d32 !important; /* 显示原文时文字颜色 */
                font-family: inherit;
                letter-spacing: normal;
            }

            .cloze-blank.revealed::after {
                background-color: #81c784;
            }

            .cloze-sentence {
                display: inline;
                background-color: transparent;
                padding: 0;
                line-height: 1.5;
            }

            .cloze-punctuation {
                display: inline;
                margin: 0 1px;
                padding: 0;
                line-height: 1.5;
                color: #333;
            }

            .contson {
                line-height: 2;
                font-size: 18px;
                padding: 20px;
                background-color: #fcfcfc;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }

            #cloze-toggle-btn:hover {
                transform: scale(1.1);
                background-color: #2980b9;
            }
        `;
        document.head.appendChild(style);
    }

    // 添加点击事件
    function addClickEvents() {
        const blanks = document.querySelectorAll('.cloze-blank');
        blanks.forEach(blank => {
            blank.addEventListener('click', function() {
                // 切换显示状态
                this.classList.toggle('revealed');
            });
        });
    }

    // 初始化
    window.addEventListener('load', function() {
        createControlPanel();

        // 保存原始内容
        const contentDiv = document.querySelector('.contson');
        if (contentDiv && !contentDiv.dataset.original) {
            contentDiv.dataset.original = contentDiv.innerHTML;
        }
    });
})();