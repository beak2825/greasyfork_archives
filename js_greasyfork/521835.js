// ==UserScript==
// @name         本地答案答题助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  从本地文档检索答案并自动选中
// @author       侯钰熙
// @match        *://*/*
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.0/mammoth.browser.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521835/%E6%9C%AC%E5%9C%B0%E7%AD%94%E6%A1%88%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521835/%E6%9C%AC%E5%9C%B0%E7%AD%94%E6%A1%88%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化 PDF.js
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // 配置项
    const CONFIG = {
        // 题目选择器，根据实际网站调整
        questionSelector: '.subject-item .subject-question',
        // 选项选择器
        optionSelector: '.subject-item .subject-option input[type="radio"]',
        // 本地答案数据
        answers: {
            // 示例数据格式
            '题目1': '答案1',
            '题目2': '答案2'
        },
        autoAnswer: {
            enabled: false,
            delay: 2000,  // 答题延迟，单位毫秒
            skipNoAnswer: true,  // 是否跳过没有答案的题目
        },
        articleContent: '', // 存储文章内容
        matchThreshold: 0.8, // 文本相似度匹配阈值
        highlight: {
            color: 'rgba(255, 235, 59, 0.3)', // 黄色半透明
            borderColor: '#FFC107',
            currentQuestion: null // 存储当前题目元素
        },
        nextButtonSelector: '.next-btn, .submit-btn', // 下一题按钮选择器
    };

    // 添加控制面板样式
    GM_addStyle(`
        #answer-helper-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            padding: 15px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            min-width: 240px;
            transition: all 0.3s ease;
        }

        #answer-helper-panel:hover {
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
        }

        #answer-helper-panel h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
        }

        #answer-helper-panel input[type="file"] {
            display: none;
        }

        #answer-helper-panel .file-label {
            display: block;
            padding: 8px 12px;
            background: #f0f2f5;
            border-radius: 8px;
            color: #666;
            cursor: pointer;
            margin-bottom: 10px;
            text-align: center;
            transition: all 0.2s ease;
            font-size: 14px;
        }

        #answer-helper-panel .file-label:hover {
            background: #e6e8eb;
            color: #333;
        }

        #answer-helper-panel .file-name {
            font-size: 12px;
            color: #666;
            margin: 5px 0;
            text-align: center;
            word-break: break-all;
        }

        #answer-helper-panel button {
            width: 100%;
            padding: 8px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        #answer-helper-panel button:hover {
            background: #43A047;
            transform: translateY(-1px);
        }

        #answer-helper-panel button:active {
            transform: translateY(1px);
        }

        #status {
            margin-top: 10px;
            padding: 8px;
            border-radius: 6px;
            background: #f5f5f5;
            font-size: 12px;
            color: #666;
            text-align: center;
            min-height: 20px;
        }

        .status-success {
            color: #4CAF50 !important;
            background: #E8F5E9 !important;
        }

        .status-error {
            color: #F44336 !important;
            background: #FFEBEE !important;
        }

        .status-loading {
            color: #2196F3 !important;
            background: #E3F2FD !important;
        }

        .control-group {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
        }

        .control-group button {
            flex: 1;
            min-width: 0;
            padding: 6px 8px;
        }

        .toggle-button {
            background: #FF9800 !important;
        }

        .toggle-button.active {
            background: #E65100 !important;
        }

        .setting-item {
            display: flex;
            align-items: center;
            margin: 8px 0;
            font-size: 12px;
            color: #666;
        }

        .setting-item input[type="checkbox"] {
            margin-right: 8px;
        }

        .setting-item input[type="number"] {
            width: 60px;
            padding: 2px 4px;
            margin-left: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .question-highlight {
            position: relative;
            background-color: ${CONFIG.highlight.color} !important;
            border: 2px solid ${CONFIG.highlight.borderColor} !important;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .question-highlight::before {
            content: '当前题目';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${CONFIG.highlight.borderColor};
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
        }
    `);

    // 创建控制面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'answer-helper-panel';
        panel.innerHTML = `
            <h3>📚 本地答案答题助手 </h3>
            <label class="file-label" for="answer-file">
                选择答案文件
            </label>
            <input type="file" id="answer-file" accept=".txt,.json,.docx,.xlsx,.pdf">
            <div class="file-name"></div>
            <button id="load-answers">开始导入</button>

            <div style="margin: 15px 0; border-top: 1px solid #eee;"></div>

            <div class="control-group">
                <button id="toggle-auto" class="toggle-button">自动答题</button>
                <button id="next-question">下一题</button>
            </div>

            <div class="setting-item">
                <input type="checkbox" id="skip-no-answer" ${CONFIG.autoAnswer.skipNoAnswer ? 'checked' : ''}>
                <label for="skip-no-answer">未找到答案时自动跳过</label>
            </div>

            <div class="setting-item">
                <label for="answer-delay">答题延迟(秒)</label>
                <input type="number" id="answer-delay" min="0" max="10" step="0.5"
                    value="${CONFIG.autoAnswer.delay/1000}">
            </div>

            <div class="setting-item">
                <label for="highlight-color">高亮颜色</label>
                <input type="color" id="highlight-color" value="#FFEB3B">
                <input type="range" id="highlight-opacity" min="0" max="100" value="30">
                <span id="opacity-value">30%</span>
            </div>

            <div id="status"></div>
        `;
        document.body.appendChild(panel);

        // 文件选择事件
        const fileInput = panel.querySelector('#answer-file');
        const fileLabel = panel.querySelector('.file-label');
        const fileName = panel.querySelector('.file-name');

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileName.textContent = e.target.files[0].name;
                fileLabel.textContent = '更换文件';
            } else {
                fileName.textContent = '';
                fileLabel.textContent = '选择答案文件';
            }
        });

        document.getElementById('load-answers').addEventListener('click', loadAnswersFromFile);

        // 添加控制事件监听
        const toggleButton = document.getElementById('toggle-auto');
        const nextButton = document.getElementById('next-question');
        const skipCheckbox = document.getElementById('skip-no-answer');
        const delayInput = document.getElementById('answer-delay');

        toggleButton.addEventListener('click', () => {
            CONFIG.autoAnswer.enabled = !CONFIG.autoAnswer.enabled;
            toggleButton.classList.toggle('active');
            toggleButton.textContent = CONFIG.autoAnswer.enabled ? '停止答题' : '自动答题';

            if (CONFIG.autoAnswer.enabled) {
                startAutoAnswer();
            }
        });

        nextButton.addEventListener('click', () => {
            clickNextQuestion();
        });

        skipCheckbox.addEventListener('change', (e) => {
            CONFIG.autoAnswer.skipNoAnswer = e.target.checked;
        });

        delayInput.addEventListener('change', (e) => {
            CONFIG.autoAnswer.delay = Math.max(0, parseFloat(e.target.value) * 1000);
        });

        // 添加高亮颜色设置事件
        const colorInput = document.getElementById('highlight-color');
        const opacityInput = document.getElementById('highlight-opacity');
        const opacityValue = document.getElementById('opacity-value');

        function updateHighlightColor() {
            const color = colorInput.value;
            const opacity = opacityInput.value / 100;
            CONFIG.highlight.color = `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
            CONFIG.highlight.borderColor = color;

            // 更新样式
            GM_addStyle(`
                .question-highlight {
                    background-color: ${CONFIG.highlight.color} !important;
                    border: 2px solid ${CONFIG.highlight.borderColor} !important;
                }
                .question-highlight::before {
                    background: ${CONFIG.highlight.borderColor};
                }
            `);

            // 如果当前有高亮的题目，刷新其样式
            if (CONFIG.highlight.currentQuestion) {
                CONFIG.highlight.currentQuestion.classList.remove('question-highlight');
                setTimeout(() => {
                    CONFIG.highlight.currentQuestion.classList.add('question-highlight');
                }, 0);
            }
        }

        colorInput.addEventListener('input', updateHighlightColor);
        opacityInput.addEventListener('input', () => {
            opacityValue.textContent = `${opacityInput.value}%`;
            updateHighlightColor();
        });
    }

    // 文件加载处理函数
    async function loadAnswersFromFile() {
        const fileInput = document.getElementById('answer-file');
        const file = fileInput.files[0];
        if (!file) {
            updateStatus('请选择文件', 'error');
            return;
        }

        updateStatus('正在解析文件...', 'loading');

        try {
            let answers = {};
            const fileExt = file.name.split('.').pop().toLowerCase();

            switch (fileExt) {
                case 'json':
                case 'txt':
                    answers = await parseTextFile(file);
                    break;
                case 'docx':
                    answers = await parseWordFile(file);
                    break;
                case 'xlsx':
                    answers = await parseExcelFile(file);
                    break;
                case 'pdf':
                    answers = await parsePDFFile(file);
                    break;
                default:
                    throw new Error('不支持的文件格式');
            }

            CONFIG.answers = answers;
            GM_setValue('answers', answers);
            updateStatus('答案加载成功 ✨', 'success');
            startAutoMatch();
        } catch (error) {
            updateStatus('文件解析错误: ' + error.message, 'error');
        }
    }

    // 解析文本文件（JSON/TXT）
    function parseTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    try {
                        // 尝试解析为JSON
                        const answers = JSON.parse(content);
                        resolve(answers);
                    } catch {
                        // 如果不是JSON，则作为文章内容处理
                        CONFIG.articleContent = content;
                        resolve({}); // 返回空对象，因为答案需要实时搜索
                    }
                } catch (error) {
                    reject(new Error('文件解析失败'));
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }

    // 解析Word文件
    function parseWordFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    const text = result.value;

                    // 假设Word文档的格式是每行一个题目答案对，用制表符或特定分隔符分隔
                    const answers = {};
                    const lines = text.split('\n');
                    lines.forEach(line => {
                        const [question, answer] = line.split('\t');
                        if (question && answer) {
                            answers[question.trim()] = answer.trim();
                        }
                    });

                    resolve(answers);
                } catch (error) {
                    reject(new Error('Word文件解析失败'));
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsArrayBuffer(file);
        });
    }

    // 解析Excel���件
    function parseExcelFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const answers = {};

                    // 假设Excel的A列是题目，B列是答案
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: ['question', 'answer'] });
                    jsonData.forEach(row => {
                        if (row.question && row.answer) {
                            answers[row.question.trim()] = row.answer.trim();
                        }
                    });

                    resolve(answers);
                } catch (error) {
                    reject(new Error('Excel文件解析失败'));
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsArrayBuffer(file);
        });
    }

    // 解析PDF文件
    function parsePDFFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedArray = new Uint8Array(e.target.result);
                    const loadingTask = pdfjsLib.getDocument({ data: typedArray });

                    updateStatus('正在解析PDF...', 'loading');
                    const pdf = await loadingTask.promise;
                    const answers = {};
                    const numPages = pdf.numPages;

                    // 读取所有页面的文本
                    for (let i = 1; i <= numPages; i++) {
                        updateStatus(`正在解析第 ${i}/${numPages} 页...`, 'loading');
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        let pageText = '';

                        // 更好的文本提取逻辑
                        let lastY = null;
                        textContent.items.forEach(item => {
                            if (lastY !== item.transform[5]) {
                                pageText += '\n';
                                lastY = item.transform[5];
                            }
                            pageText += item.str + ' ';
                        });

                        // 处理每一行
                        const lines = pageText.split('\n').filter(line => line.trim());
                        lines.forEach(line => {
                            // 尝试多种分隔符
                            let parts = line.split(/[\t|｜|│|｜]/);
                            if (parts.length < 2) {
                                parts = line.split(/\s{2,}/); // 使用两个或更多空格作为分隔符
                            }

                            if (parts.length >= 2) {
                                const question = parts[0].trim();
                                const answer = parts[parts.length - 1].trim();
                                if (question && answer) {
                                    answers[question] = answer;
                                }
                            }
                        });
                    }

                    if (Object.keys(answers).length === 0) {
                        reject(new Error('未能从PDF中提取到答案数据'));
                    } else {
                        updateStatus('PDF解析完成', 'success');
                        resolve(answers);
                    }
                } catch (error) {
                    console.error('PDF解析错误:', error);
                    reject(new Error('PDF文件解析失败: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsArrayBuffer(file);
        });
    }

    // 更新状态显示
    function updateStatus(message, type = 'normal') {
        const statusEl = document.getElementById('status');
        statusEl.textContent = message;

        // 移除所有状态类
        statusEl.classList.remove('status-success', 'status-error', 'status-loading');

        // 根据类型添加对应的状态类
        switch (type) {
            case 'success':
                statusEl.classList.add('status-success');
                break;
            case 'error':
                statusEl.classList.add('status-error');
                break;
            case 'loading':
                statusEl.classList.add('status-loading');
                break;
        }
    }

    // 添加高亮当前题目的函数
    function highlightCurrentQuestion(question) {
        // 移除之前的高亮
        if (CONFIG.highlight.currentQuestion) {
            CONFIG.highlight.currentQuestion.classList.remove('question-highlight');
        }

        // 添加新的高亮
        if (question) {
            question.classList.add('question-highlight');
            CONFIG.highlight.currentQuestion = question;

            // 滚动到当前题目
            question.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 开始自动匹配答案
    async function startAutoMatch() {
        // 获取当前题目
        const questionItem = document.querySelector('.subject-item');
        if (!questionItem) return false;

        // 高亮当前题目
        highlightCurrentQuestion(questionItem);

        // 获取题目文本（去除分数等额外信息）
        const questionText = questionItem.querySelector('.subject-question')
            ?.textContent.trim()
            .replace(/（\d+分）/, '') // 移除分数提示
            .replace(/^\d+\.\s*/, '') // 移除题号
            .trim();

        if (!questionText) return false;

        // 先尝试精确匹配
        let answer = CONFIG.answers[questionText];
        if (answer) {
            return selectAnswer(answer, questionItem);
        }

        // 如果有文章内容，尝试从文章中查找答案
        if (CONFIG.articleContent) {
            const options = Array.from(questionItem.querySelectorAll('.subject-option'));
            if (!options.length) return false;

            // 获取问题上下文
            const context = findQuestionContext(questionText);

            // 计算每个选项在上下文中的相似度
            const optionScores = options.map(option => {
                const optionText = option.textContent.trim().replace(/^[A-Z]\./, '').trim();
                const score = calculateContextSimilarity(context, optionText);
                return { option, optionText, score };
            });

            // 获取最高分的选项
            const bestMatch = optionScores.reduce((best, current) => {
                return current.score > best.score ? current : best;
            }, { score: 0 });

            if (bestMatch.score >= CONFIG.matchThreshold) {
                const radioInput = bestMatch.option.querySelector('input[type="radio"]');
                if (radioInput) {
                    radioInput.click();
                    updateStatus(`已选中最佳匹配答案: ${bestMatch.optionText} (相似度: ${bestMatch.score.toFixed(2)})`, 'success');
                    return true;
                }
            }
        }

        updateStatus('未找到匹配的答案', 'error');
        return false;
    }

    // 查找问题上下文
    function findQuestionContext(question) {
        const normalizedContent = CONFIG.articleContent.replace(/\s+/g, '');
        const normalizedQuestion = question.replace(/\s+/g, '');

        // 在文章中查找问题相关内容
        let bestMatchIndex = -1;
        let bestMatchScore = 0;

        // 使用滑动窗口查找最相关的段落
        const windowSize = 100; // 上下文窗口大小
        for (let i = 0; i < normalizedContent.length - windowSize; i++) {
            const window = normalizedContent.slice(i, i + windowSize);
            const score = similarity(window, normalizedQuestion);
            if (score > bestMatchScore) {
                bestMatchScore = score;
                bestMatchIndex = i;
            }
        }

        if (bestMatchIndex >= 0) {
            // 返回最佳匹配位置的上下文
            const start = Math.max(0, bestMatchIndex - 50);
            const end = Math.min(normalizedContent.length, bestMatchIndex + windowSize + 50);
            return normalizedContent.slice(start, end);
        }

        return '';
    }

    // 计算选项在上下文中的相似度
    function calculateContextSimilarity(context, option) {
        if (!context || !option) return 0;

        // 将上下文分成小段落
        const segments = [];
        const segmentLength = option.length * 2;
        for (let i = 0; i < context.length - segmentLength; i += segmentLength / 2) {
            segments.push(context.slice(i, i + segmentLength));
        }

        // 计算选项与每个段落的相似度，取最高值
        return segments.reduce((maxScore, segment) => {
            const score = similarity(segment, option);
            return Math.max(maxScore, score);
        }, 0);
    }

    // 选择答案的辅助函数
    function selectAnswer(answer, questionItem) {
        const options = questionItem.querySelectorAll('.subject-option');
        for (const option of options) {
            const optionText = option.textContent.trim().replace(/^[A-Z]\./, '').trim();
            if (similarity(optionText, answer) >= CONFIG.matchThreshold) {
                const radioInput = option.querySelector('input[type="radio"]');
                if (radioInput) {
                    radioInput.click();
                    updateStatus(`已选中答案: ${answer}`, 'success');
                    return true;
                }
            }
        }
        return false;
    }

    // 添加自动答题相关函数
    function startAutoAnswer() {
        if (!CONFIG.autoAnswer.enabled) return;

        startAutoMatch().then(matched => {
            if (!matched && CONFIG.autoAnswer.skipNoAnswer) {
                updateStatus('未找到答案，准备跳过...', 'loading');
                setTimeout(() => {
                    clickNextQuestion();
                }, 1000);
            } else if (matched) {
                updateStatus('答题成功，等待下一题...', 'success');
                setTimeout(() => {
                    clickNextQuestion();
                    startAutoAnswer();
                }, CONFIG.autoAnswer.delay);
            } else {
                CONFIG.autoAnswer.enabled = false;
                document.getElementById('toggle-auto').classList.remove('active');
                document.getElementById('toggle-auto').textContent = '自动答题';
                updateStatus('自动答题已停止', 'error');
            }
        });
    }

    // 点击下一题按钮
    function clickNextQuestion() {
        // 移除当前高亮
        if (CONFIG.highlight.currentQuestion) {
            CONFIG.highlight.currentQuestion.classList.remove('question-highlight');
            CONFIG.highlight.currentQuestion = null;
        }

        // 查找下一题或提交按钮
        const nextButton = document.querySelector(CONFIG.nextButtonSelector);
        if (nextButton) {
            nextButton.click();

            // 等待新题目加载完成后高亮
            setTimeout(() => {
                const newQuestion = document.querySelector('.subject-item');
                if (newQuestion) {
                    highlightCurrentQuestion(newQuestion);
                }
            }, 500);
        } else {
            updateStatus('未找到下一题按钮', 'error');
            CONFIG.autoAnswer.enabled = false;
            document.getElementById('toggle-auto').classList.remove('active');
            document.getElementById('toggle-auto').textContent = '自动答题';
        }
    }

    // 初始化
    function init() {
        createPanel();
        // 从存储中恢复答案数据
        const savedAnswers = GM_getValue('answers');
        if (savedAnswers) {
            CONFIG.answers = savedAnswers;
            startAutoMatch();
        }
    }

    // 启动脚本
    init();
})();