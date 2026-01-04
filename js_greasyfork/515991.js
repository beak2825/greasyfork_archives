// ==UserScript==
// @name         hyw自动答题助手
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  hyw自动答题脚本
// @author       小马
// @license MIT
// @match        https://hyw.shixizhi.huawei.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/515991/hyw%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/515991/hyw%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let questionBank = [];

    // 添加面板样式
    GM_addStyle(`
        .answer-panel {
            position: fixed;
            top: 500px;
            right: 500px;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 2147483647;  /* 最大z-index值 */
            min-width: 200px;
            font-family: Arial, sans-serif;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
        }

        .answer-panel h3 {
            margin: 0 0 10px 0;
            padding: 0;
            font-size: 16px;
            color: #333;
        }

        .answer-panel select,
        .answer-panel input,
        .answer-panel button {
            margin: 5px 0;
            padding: 5px;
            width: 100%;
            box-sizing: border-box;
        }

        .answer-panel button {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 8px;
            margin: 5px 0;
            cursor: pointer;
        }

        .answer-panel button:hover {
            background: #0056b3;
        }

        #status {
            margin-top: 10px;
            color: #666;
            font-size: 14px;
            word-break: break-all;
        }

        /* 确保面板始终可见 */
        .answer-panel * {
            display: block;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `);

    // 创建控制面板
    function createPanel() {
        try {
            // 先检查是否已存在面板
            const existingPanel = document.querySelector('.answer-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            const panel = document.createElement('div');
            panel.className = 'answer-panel';
            panel.innerHTML = `
                <div>
                    <h3>自动答题助手</h3>
                    <select id="examType">
                        <option value="security">保密考试</option>
                        <option value="functional">职能考试</option>
                        <option value="shixizhi">应知应会考试</option>
                    </select>
                    <input type="file" id="fileInput" accept=".xlsx,.xls">
                    <button id="startBtn">开始答题</button>
                    <button id="stopBtn">停止答题</button>
                    <div id="status">等待上传题库...</div>
                </div>
            `;

            // 确保面板被添加到 body 的最后
            document.body.appendChild(panel);

            // 添加拖拽相关变量
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            // 拖拽开始
            function dragStart(e) {
                // 如果点击的是select、input或button元素，不启动拖拽
                if (e.target.tagName.toLowerCase() === 'select' ||
                    e.target.tagName.toLowerCase() === 'input' ||
                    e.target.tagName.toLowerCase() === 'button') {
                    return;
                }

                if (e.type === "mousedown") {
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                } else if (e.type === "touchstart") {
                    initialX = e.touches[0].clientX - xOffset;
                    initialY = e.touches[0].clientY - yOffset;
                }

                if (e.target === panel || panel.contains(e.target)) {
                    isDragging = true;
                }
            }

            // 拖拽过程
            function drag(e) {
                if (isDragging) {
                    e.preventDefault();

                    if (e.type === "mousemove") {
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                    } else if (e.type === "touchmove") {
                        currentX = e.touches[0].clientX - initialX;
                        currentY = e.touches[0].clientY - initialY;
                    }

                    xOffset = currentX;
                    yOffset = currentY;

                    setTranslate(currentX, currentY, panel);
                }
            }

            // 设置面板位置
            function setTranslate(xPos, yPos, el) {
                el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            }

            // 拖拽结束
            function dragEnd() {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }

            // 添加拖拽事件监听
            panel.addEventListener('mousedown', dragStart, false);
            document.addEventListener('mousemove', drag, false);
            document.addEventListener('mouseup', dragEnd, false);

            panel.addEventListener('touchstart', dragStart, false);
            document.addEventListener('touchmove', drag, false);
            document.addEventListener('touchend', dragEnd, false);

            // 阻止select的mousedown事件冒泡
            document.getElementById('examType').addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });

            // 原有的事件绑定
            document.getElementById('fileInput').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) processExcel(file);
            });

            document.getElementById('startBtn').addEventListener('click', startAutoAnswer);
            document.getElementById('stopBtn').addEventListener('click', stopAutoAnswer);
        } catch (error) {
            // 可以尝试使用更简单的备用面板
            try {
                const simplePanel = document.createElement('div');
                simplePanel.className = 'answer-panel';
                simplePanel.innerHTML = `
                    <div>
                        <h3>自动答题助手(简易版)</h3>
                        <input type="file" id="fileInput" accept=".xlsx,.xls">
                        <button id="startBtn">开始答题</button>
                        <button id="stopBtn">停止答题</button>
                        <div id="status">等待上传题库...</div>
                    </div>
                `;
                document.body.appendChild(simplePanel);
            } catch (backupError) {
            }
        }
    }

    // 更新状态显示
    function updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    let isRunning = false;

    // 停止自动答题
    function stopAutoAnswer() {
        isRunning = false;
        updateStatus('已停止答题');
    }

    // 开始自动答题
    async function startAutoAnswer() {
        if (questionBank.length === 0) {
            updateStatus('请先上传题库！');
            return;
        }

        isRunning = true;
        updateStatus('开始自动答题...');

        while (isRunning) {
            try {
                const questionInfo = getCurrentQuestionInfo();
                if (!questionInfo.question) {
                    updateStatus('未检测到题目，可能已完成答题');
                    isRunning = false;
                    break;
                }

                console.log('当前题目:', questionInfo.question);

                const answerInfo = findAnswer(questionInfo.question);
                if (answerInfo) {
                    const selected = selectAnswer(answerInfo, questionInfo.isMultipleChoice);
                    if (selected) {
                        updateStatus(`已答题: ${questionInfo.question.substring(0, 20)}...`);
                        // 减少答题后的等待时间为500ms
                        await new Promise(resolve => setTimeout(resolve, 200));

                        if (!clickNext(true)) {
                            updateStatus('无法找到下一题按钮，停止答题');
                            isRunning = false;
                            break;
                        }
                    } else {
                        updateStatus('答案选择失败');
                        if (!clickNext(false)) break;
                    }
                } else {
                    updateStatus('未找到匹配答案');
                    if (!clickNext(false)) break;
                }

                // 减少题目间的等待时间为500ms
                await new Promise(resolve => setTimeout(resolve, 200));

            } catch (error) {
                updateStatus('答题过程出错，已停止');
                isRunning = false;
                break;
            }
        }
    }

    // 处理Excel文件上传
    async function handleFileUpload(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            questionBank = XLSX.utils.sheet_to_json(firstSheet);
            document.getElementById('status').innerText = `已加载 ${questionBank.length} 道题目`;
        };

        reader.readAsArrayBuffer(file);
    }

    // 处理Excel数据结构
    function processExcel(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            // 获取当前选择的考试类型
            const examType = document.getElementById('examType').value;

            // 根据不同的考试类型处理数据
            if (examType === 'security') {
                // 保密考试题库格式
                questionBank = jsonData.map(row => ({
                    sequence: row['序号'],
                    type: row['试题类别'],
                    questionId: row['试题类型'],
                    question: row['试题题目'],
                    options: row['选项'],
                    answer: row['正确答案']
                }));
            } else if (examType === 'functional') {
                // 职能考试题格式
                questionBank = jsonData.map(row => ({
                    sequence: row['题库'],
                    type: row['题型'],
                    questionId: '',
                    question: row['题'],
                    options: `${row['选项A']}\n${row['选项B']}\n${row['选项C']}\n${row['选项D']}\n${row['选项E'] || ''}\n${row['选项F'] || ''}\n${row['选项G'] || ''}\n${row['选项H'] || ''}`.trim(),
                    answer: row['正确答案']
                }));
            } else if (examType === 'shixizhi') {
                // 输出原始数据到控制台
                console.log('时习知原始数据:', jsonData);

                // 时习知考试题库格式处理
                questionBank = jsonData.map(row => {
                    // 跳过表头行
                    if (row['序号'] === '序号') return null;

                    // 处理题目中的下划线
                    let processedQuestion = row['__EMPTY'] || '';
                    processedQuestion = processedQuestion
                        // 统一下划线格式（将连续的下划线替换为5个下划线）
                        .replace(/_{2,}/g, '_____')
                        // 处理可能存在的特殊下划线字符
                        .replace(/＿/g, '_')
                        // 处理下划线加空格的情况
                        .replace(/_ /g, '_')
                        .replace(/ _/g, '_');

                    return {
                        sequence: row['序号'] || '',
                        type: row['__EMPTY_3'] || '单选',
                        questionId: '',
                        question: processedQuestion,
                        options: row['__EMPTY_1'] || '',
                        answer: row['__EMPTY_2'] || '',
                        originalQuestion: row['__EMPTY'] || ''
                    };
                }).filter(item => item !== null);

                // 输出处理后的题库到控制台
                console.log('时习知题库数据:', questionBank);
                updateStatus(`已导入 ${questionBank.length} 道题目`);
            }

            updateStatus(`已导入 ${questionBank.length} 道题目`);
        };
        reader.readAsArrayBuffer(file);
    }

    // 查找答案
    function findAnswer(currentQuestion) {
        try {
            if (!currentQuestion) {
                console.log('当前题目为空');
                return null;
            }

            // 获取当前页面的所有选项文本
            const currentOptions = Array.from(document.querySelectorAll('.option-list-item'))
                .map(option => option.textContent.trim());
            console.log('当前页面选项:', currentOptions);

            // 标准化当前题目
            let normalizedCurrentQuestion = currentQuestion
                .replace(/\s+/g, '')  // 移除所有空格
                .replace(/（）/g, '______')  // 将括号替换为6个下划线
                .replace(/\(\)/g, '______')  // 将英文括号替换为6个下划线
                .replace(/_+/g, '______');   // 将任意数量的下划线替换为6个下划线

            console.log('标准化后的当前题目:', normalizedCurrentQuestion);

            // 在题库中查找匹配的题目
            const matchedQuestions = questionBank.filter(item => {
                if (!item || !item.question) {
                    console.log('题库中存在无效题目:', item);
                    return false;
                }

                // 标准化题库中的题目
                const normalizedItemQuestion = item.question
                    .replace(/\s+/g, '')  // 移除所有空格
                    .replace(/_+/g, '______')   // 将任意数量的下划线替换为6个下划线
                    .replace(/。$/, '');   // 移除句尾句号

                // 完全匹配比较
                if (normalizedCurrentQuestion === normalizedItemQuestion) {
                    return true;
                }

                // 移除标点符号后的模糊匹配
                const cleanCurrentQuestion = normalizedCurrentQuestion.replace(/[。，,]/g, '');
                const cleanItemQuestion = normalizedItemQuestion.replace(/[。，,]/g, '');

                // 检查是否包含相同数量的填空
                const currentBlanks = (cleanCurrentQuestion.match(/______/g) || []).length;
                const itemBlanks = (cleanItemQuestion.match(/______/g) || []).length;

                // 如果填空数量相同且文本相似，则认为是匹配的
                return currentBlanks === itemBlanks &&
                    (cleanItemQuestion.includes(cleanCurrentQuestion) ||
                        cleanCurrentQuestion.includes(cleanItemQuestion));
            });

            console.log('匹配到的题目:', matchedQuestions);

            if (matchedQuestions.length === 0) {
                return null;
            }

            // 如果只有一个匹配项，验证必要属性后返回
            if (matchedQuestions.length === 1) {
                const question = matchedQuestions[0];
                if (!question.answer || !question.options) {
                    console.log('匹配题目缺少必要属性:', question);
                    return null;
                }
                return {
                    answer: question.answer,
                    type: question.type,
                    options: question.options
                };
            }

            // 如果有多个匹配项，通过比对选项找到最匹配的题目
            let bestMatch = null;
            let highestMatchScore = 0;

            for (const question of matchedQuestions) {
                // 确保题目包含必要属性
                if (!question.options) {
                    console.log('题目缺少选项:', question);
                    continue;
                }

                // 将题库中的选项按分隔符分割并清空
                const bankOptions = question.options.split(/[\n^]/)
                    .map(opt => opt.trim())
                    .filter(opt => opt)
                    .map(opt => opt.replace(/^[A-Z]\s*[.．、]\s*/, '').trim());

                // 计算选项匹配分数
                let matchScore = 0;
                let matchedOptionsCount = 0;

                // 对每个当前页面的选项进行匹配度计算
                for (const currentOpt of currentOptions) {
                    const cleanCurrentOpt = currentOpt.replace(/^[A-Z]\s*[.．、]\s*/, '').trim();

                    // 在题库选项中寻找最佳匹配
                    const bestOptionMatch = bankOptions.find(bankOpt => {
                        if (!bankOpt) return false;
                        // 完全匹配得3分
                        if (bankOpt === cleanCurrentOpt) {
                            return true;
                        }
                        // 包含关系得2分
                        if (bankOpt.includes(cleanCurrentOpt) || cleanCurrentOpt.includes(bankOpt)) {
                            return true;
                        }
                        // 部分词语匹配得1分
                        const bankWords = bankOpt.split(/\s+/);
                        const currentWords = cleanCurrentOpt.split(/\s+/);
                        return bankWords.some(word => currentWords.includes(word));
                    });

                    if (bestOptionMatch) {
                        matchedOptionsCount++;
                        if (bestOptionMatch === cleanCurrentOpt) {
                            matchScore += 3;
                        } else if (bestOptionMatch.includes(cleanCurrentOpt) || cleanCurrentOpt.includes(bestOptionMatch)) {
                            matchScore += 2;
                        } else {
                            matchScore += 1;
                        }
                    }
                }

                // 计算最终匹配分数
                const finalScore = matchScore * (matchedOptionsCount / currentOptions.length);

                // 更新最佳匹配
                if (finalScore > highestMatchScore) {
                    highestMatchScore = finalScore;
                    bestMatch = question;
                }
            }

            // 如果找到了足够好的匹配（设置一个阈值）
            if (bestMatch && highestMatchScore >= currentOptions.length * 1.5) {
                if (!bestMatch.answer || !bestMatch.options) {
                    console.log('最佳匹配题目缺少必要属性:', bestMatch);
                    return null;
                }
                return {
                    answer: bestMatch.answer,
                    type: bestMatch.type,
                    options: bestMatch.options
                };
            }

            // 如果没有找到足够好的匹配，返回null
            return null;

        } catch (error) {
            console.error('查找答案时出错:', error);
            return null;
        }
    }

    // 获取当前题目信息
    function getCurrentQuestionInfo() {
        try {
            // 修改选择器以匹配实际DOM结构
            const questionElement = document.querySelector('.main-title .content');
            if (!questionElement) {
                console.log('未找到题目元素');
                return { question: '', isMultipleChoice: false };
            }

            const question = questionElement.textContent.trim();

            // 判断是否为多选题 - 检查题类型标签
            const typeElement = document.querySelector('.type-name');
            const isMultipleChoice = typeElement && typeElement.textContent.includes('多选题');

            return { question, isMultipleChoice };
        } catch (error) {
            console.error('获取题目信息出错:', error);
            return { question: '', isMultipleChoice: false };
        }
    }

    // 选择答案
    function selectAnswer(answerInfo, isMultipleChoice) {
        try {
            if (!answerInfo) return false;
            const options = document.querySelectorAll('.option-list-item');
            let selected = false;
            console.log('answerInfo:', answerInfo);

            // 同时处理 ^  \n 分隔符
            const allOptions = answerInfo.options
                .split(/[\n^]/)  // 使用正则表达式同时匹配\n和^
                .map(opt => opt.trim())
                .filter(opt => opt); // 过滤掉空字符串

            console.log('allOptions', allOptions);

            if (isMultipleChoice) {
                // 多选题处理：答案可能是多个字母组合（如"ABC"）
                const correctAnswers = answerInfo.answer.split('').map(letter => {
                    // 尝试在选项中找到以该字母开头的选项
                    const matchedOption = allOptions.find((opt, index) => {
                        // 如果选项没有字母前缀，则使用索引作为选项序号（A=0, B=1, 等）
                        if (!opt.match(/^[A-Z]/)) {
                            return index === (letter.charCodeAt(0) - 'A'.charCodeAt(0));
                        }
                        // 则匹配选项前缀
                        return opt.startsWith(letter + '．') ||
                            opt.startsWith(letter + '.') ||
                            opt.startsWith(letter + '、') ||
                            opt.startsWith(letter + ' 、') ||
                            opt.match(new RegExp(`^${letter}\\s*[.．、]`));
                    });
                    console.log('matchedOption', matchedOption);

                    return matchedOption;
                }).filter(Boolean);



                // 遍历页面上的选项
                options.forEach((option, index) => {
                    const optionText = option.textContent.trim();
                    // 检查当前选项是否是正确答案之一
                    const isCorrectOption = correctAnswers.some(correctAnswer => {
                        // 如果正确答案没有字母前缀，直接比较内容
                        const correctContent = correctAnswer.replace(/^[A-Z]\s*[.．、]\s*/, '').trim();
                        const cleanOptionText = optionText.replace(/^[A-Z]\s*[.．、]\s*/, '').trim();
                        return cleanOptionText === correctContent ||
                            cleanOptionText.includes(correctContent) ||
                            correctContent.includes(cleanOptionText);
                    });

                    const input = option.querySelector('input[type="checkbox"]');
                    if (input && isCorrectOption && !input.checked) {
                        input.click();
                        selected = true;
                    }
                });
            } else {
                // 单选题处理
                let correctAnswerContent;

                // 检查是否是标准的选项格式（A. B. C. 等）
                const hasStandardPrefix = allOptions.every(opt =>
                    opt.match(/^[A-Z][.．、\s]/) || // 匹配 A. A． A、 A [空格]
                    opt.match(/^[A-Z][\s]*[.．、]/) // 匹配 A  . A  ． A  、
                );

                if (!hasStandardPrefix) {
                    // 如果不是标准格式，直接使用索引
                    const index = answerInfo.answer.charCodeAt(0) - 'A'.charCodeAt(0);
                    if (index >= 0 && index < allOptions.length) {
                        correctAnswerContent = allOptions[index];
                        console.log('根据索引找到的正确答案内容:', correctAnswerContent);
                    }
                } else {
                    // 如果是标准格式，查找匹配的选项
                    correctAnswerContent = allOptions.find(opt =>
                        opt.match(new RegExp(`^${answerInfo.answer}[.．、\\s]`)) || // 匹配 A. A． A、 A [空格]
                        opt.match(new RegExp(`^${answerInfo.answer}\\s*[.．、]`)) // 匹配 A  . A  ． A  、
                    );
                }

                if (!correctAnswerContent) {
                    console.log('未找到正确答案内容');
                    return false;
                }

                // 清理选项内容时保留原始文本
                const cleanContent = (text) => {
                    let cleanText = text;
                    // 如果文本以标准选项格式开头，才移除前缀
                    if (text.match(/^[A-Z][.．、\s]/) || text.match(/^[A-Z][\s]*[.．、]/)) {
                        cleanText = text.replace(/^[A-Z]\s*[.．、]\s*/, '').trim();
                    }
                    // 处理分号和空格
                    return cleanText
                        .replace(/[;；]/g, ' ')  // 将中英文分号替换为空格
                        .replace(/\s+/g, ' ')    // 将多个空格合并为单个空格
                        .trim();                 // 移除首尾空格
                };

                // 比较选项时使用清理后的内容
                options.forEach((option, index) => {
                    const optionText = option.textContent.trim();
                    const cleanOptionText = cleanContent(optionText);
                    const cleanCorrectContent = cleanContent(correctAnswerContent);

                    console.log(`比较选项 ${index + 1}:`, {
                        correctContent: cleanCorrectContent,
                        cleanOptionText: cleanOptionText,
                        isMatch: cleanOptionText === cleanCorrectContent
                    });

                    // 只在完全相等时选中选项
                    if (cleanOptionText === cleanCorrectContent) {
                        const input = option.querySelector('input[type="radio"]');
                        if (input && !input.checked) {
                            console.log('找到完全匹配选项，点击选择');
                            input.click();
                            selected = true;
                        }
                    }
                });
            }

            return selected;
        } catch (error) {
            console.error('选择答案出错:', error);
            return false;
        }
    }

    // 点击下一题
    function clickNext(answered) {
        try {
            // 获取下一题按钮
            const nextButton = Array.from(document.querySelectorAll('.subject-btns .subject-btn'))
                .find(button => button.textContent.trim() === '下一题');

            // 点击下一题按钮
            if (nextButton) {
                nextButton.click();
                return true;
            }
            return false;
        } catch (error) {
            console.error('点击下一题按钮出错:', error);
            return false;
        }
    }

    // 修改初始化部分
    function init() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => setTimeout(createPanel, 1000));
        } else {
            setTimeout(createPanel, 1000);
        }
    }

    // 使用 window.onload 确保所有资源都加载完成
    window.addEventListener('load', () => {
        setTimeout(init, 1000);
    });
})();

