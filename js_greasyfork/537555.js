// ==UserScript==
// @name         超星通用题目提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从超星“查看已批阅作业”或类似考试回顾页面提取题目。支持自动提取和手动提取，带自定义提示。
// @author       毫厘
// @match        *://*.chaoxing.com/exam-ans/exam/test/reVersionPaperMarkContentNew*
// @match        *://*.chaoxing.com/mooc-ans/work/selectWorkQuestionYiPiYue*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/537555/%E8%B6%85%E6%98%9F%E9%80%9A%E7%94%A8%E9%A2%98%E7%9B%AE%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537555/%E8%B6%85%E6%98%9F%E9%80%9A%E7%94%A8%E9%A2%98%E7%9B%AE%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() { // 使用立即执行函数表达式 (IIFE) 封装代码，避免污染全局作用域
    'use strict'; // 启用严格模式，有助于捕获常见错误

    // 用于存储自动提取设置的键名，确保版本更新后键名唯一性以避免冲突
    const AUTO_EXTRACT_KEY = 'chaoxingUniversalQuizAutoExtractEnabled_v3.0';

    // --- 辅助函数 (Combined and refined) ---

    /**
     * 规范化文本：移除多余空格，并将所有空白符（包括换行、制表符等）替换为单个空格，最后去除首尾空格。
     * @param {string} text - 待处理的原始文本。
     * @returns {string} 规范化后的文本。如果输入不是字符串，则返回空字符串。
     */
    function normalizeText(text) {
        if (typeof text !== 'string') return "";
        return text.replace(/\s+/g, ' ').trim();
    }

    /**
     * 规范化题目文本：
     * 1. 移除题目前缀，如 "【单选题】"。
     * 2. 移除题目末尾的分数提示，如 "（2.0 分）" 或 "(2 分)"。
     * 3. 标准化空括号，如将 "( )" 或 "（&nbsp;）" 统一为 "( )" 或 "（ ）"。
     * 4. 进行基础的 normalizeText 处理。
     * @param {string} rawText - 原始的题目文本。
     * @returns {string} 规范化后的题目文本。
     */
    function normalizeQuestionText(rawText) {
        if (!rawText) return "";
        // 移除题型前缀，例如 "【单选题】 "
        let text = rawText.replace(/^【.*?题】\s*/, '').trim();
        // 移除题干末尾的分数部分，例如 "（ 2.0 分 ）" 或 "( 2 分 )"
        text = text.replace(/\s*（\s*\d+(\.\d+)?\s*分\s*）\s*$/, '').trim();
        text = text.replace(/\s*\(\s*\d+(\.\d+)?\s*分\s*\)\s*$/, '').trim();
        // 将内容为空或只有空格/&nbsp;的括号标准化
        text = text.replace(/\(\s*(&nbsp;|\s)*\)/g, '( )'); // 半角括号
        text = text.replace(/（\s*(&nbsp;|\s)*）/g, '（ ）'); // 全角括号
        // 再次确保完全空的括号被标准化
        text = text.replace(/\(\s*\)/g, '( )').replace(/（\s*）/g, '（ ）');
        return normalizeText(text); // 最后进行通用文本规范化
    }

    /**
     * 从 DOM 元素中提取纯文本内容。
     * 该函数会克隆元素，移除其中的 <script> 和 <style> 标签，
     * 将 <p> 和 <br> 标签转换为空格（后续由 normalizeText 处理）或换行，
     * 然后获取其 textContent 或 innerText，并进行规范化处理。
     * @param {HTMLElement} element - 需要提取文本的 DOM 元素。
     * @returns {string} 清理和规范化后的纯文本内容。
     */
    function getCleanTextFromElement(element) {
        if (!element) return "";
        const clone = element.cloneNode(true); // 克隆节点以避免修改原始DOM

        // 移除脚本和样式标签，它们不应出现在题目内容中
        const scriptsAndStyles = clone.querySelectorAll('script, style');
        scriptsAndStyles.forEach(el => el.remove());

        // 将 <p> 和 <br> 标签转换成换行符，以保留段落结构和换行
        // 注意：innerHTML 操作可能引入XSS风险，但这里是处理已知页面，且是克隆节点
        let html = clone.innerHTML;
        html = html.replace(/<p[^>]*>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<br[^>]*>/gi, '\n');

        // 使用临时div来解析HTML并获取文本内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 获取文本，优先使用 textContent
        let text = normalizeText(tempDiv.textContent || tempDiv.innerText || "");
        // 移除连续的换行符，只保留一个
        return text.replace(/\n\s*\n/g, '\n').trim();
    }

    // --- 自定义悬浮通知 (from Homework Script) ---
    let notificationElement = null; // 存储通知DOM元素的引用，避免重复创建
    /**
     * 显示一个自定义的悬浮通知。
     * @param {string} message - 要显示的消息内容。
     * @param {boolean} [isError=false] - 是否为错误消息（影响背景颜色）。
     */
    function showCustomNotification(message, isError = false) {
        // 如果通知元素尚未创建，则创建并添加到body
        if (!notificationElement) {
            notificationElement = document.createElement('div');
            notificationElement.id = 'customNotificationGM'; // 用于CSS选择器
            document.body.appendChild(notificationElement);
        }
        notificationElement.textContent = message;
        notificationElement.style.backgroundColor = isError ? '#dc3545' : '#28a745'; // 红色表示错误，绿色表示成功

        // 实现简单的淡入淡出效果
        notificationElement.style.display = 'block';
        notificationElement.style.opacity = '0';
        let opacity = 0;
        const fadeInInterval = setInterval(function() {
            if (opacity < 0.95) {
                opacity += 0.1;
                notificationElement.style.opacity = opacity;
            } else {
                clearInterval(fadeInInterval);
                // 2.5秒后自动开始淡出
                setTimeout(() => {
                    let opacityOut = 0.95;
                    const fadeOutInterval = setInterval(function() {
                        if (opacityOut > 0) {
                            opacityOut -= 0.1;
                            notificationElement.style.opacity = opacityOut;
                        } else {
                            clearInterval(fadeOutInterval);
                            notificationElement.style.display = 'none';
                        }
                    }, 50); // 淡出动画的间隔
                }, 2500); // 通知显示持续时间
            }
        }, 50); // 淡入动画的间隔
    }

    // --- 主要提取逻辑 (Combined and generalized) ---
    /**
     * 提取并格式化页面上的所有题目。
     * @param {boolean} [isManualTrigger=false] - 是否为手动触发（影响通知内容）。
     * @returns {string|null} 提取并格式化后的题目字符串，如果未找到容器或题目则返回null。
     */
    function extractAndFormatQuestions(isManualTrigger = false) {
        let output = ""; // 用于累积提取结果的字符串
        // #ZyBottom 是超星题目区域的主要容器ID
        const mainQuizContainer = document.querySelector('#ZyBottom');

        if (!mainQuizContainer) {
            const msg = '错误：未能找到主要的题目容器 (ID: ZyBottom)。脚本可能无法在此页面工作。';
            if (isManualTrigger) showCustomNotification(msg, true);
            else console.warn(`油猴脚本：${msg}`);
            return null;
        }

        let currentQuestionTypeName = "未知题型"; // 默认题型名称
        let questionTypeHeaderFoundOverall = false; // 标记是否已找到并处理过题型标题
        const topLevelChildren = Array.from(mainQuizContainer.children); // 获取主容器下的所有直接子元素

        // 遍历主容器的直接子元素以识别题型标题和题目块
        for (const element of topLevelChildren) {
            // 1. 处理题型标题 (例如："一、单选题")
            if (element.classList.contains('Cy_TItle1')) { // 题型标题通常使用此class
                questionTypeHeaderFoundOverall = true;
                const headerH2 = element.querySelector('h2');
                if (headerH2) {
                    let rawHeaderText = "";
                    // 提取h2中所有文本节点，直到遇到<em>标签（通常包含分数信息）
                    for (const node of headerH2.childNodes) {
                        if (node.nodeName.toUpperCase() === "EM") break;
                        rawHeaderText += node.textContent;
                    }
                    // 清理标题文本，移除序号和多余空格，例如 "一、 单选题" -> "单选题"
                    rawHeaderText = normalizeText(rawHeaderText).replace(/^一?[、.]\s*/, '').trim();

                    // 根据关键词判断题型
                    if (rawHeaderText.includes("单选题")) currentQuestionTypeName = "单选题";
                    else if (rawHeaderText.includes("多选题")) currentQuestionTypeName = "多选题";
                    else if (rawHeaderText.includes("判断题")) currentQuestionTypeName = "判断题";
                    else if (rawHeaderText.includes("填空题")) currentQuestionTypeName = "填空题";
                    else if (rawHeaderText.includes("简答题")) currentQuestionTypeName = "简答题";
                    else if (rawHeaderText.includes("资料题") || rawHeaderText.includes("材料题")) currentQuestionTypeName = "资料题";
                    else currentQuestionTypeName = rawHeaderText || "未知题型"; // 若无匹配，则使用原始文本

                    // 添加题型标题到输出，确保格式正确且不重复添加
                    if (output === "" || (output.length > 0 && !output.endsWith("\n\n") && output.lastIndexOf("## ") !== (output.length - `## ${currentQuestionTypeName}\n`.length))) {
                         if(output !== "" && !output.endsWith("\n")) output += "\n"; // 确保在新题型前有空行
                    }
                    if (!output.endsWith(`## ${currentQuestionTypeName}\n`)) { // 避免连续相同的题型标题
                        output += `## ${currentQuestionTypeName}\n`;
                    }
                }
            }
            // 2. 处理包含多个题目的区块 (常见于考试回顾页面)
            else if (element.classList.contains('CyBottom') && element.classList.contains('ans-cc')) {
                const questionsInBlock = element.querySelectorAll('.TiMu'); // .TiMu 是单个题目的通用class
                questionsInBlock.forEach(questionElementNode => {
                    let questionOutput = processSingleQuestion(questionElementNode, currentQuestionTypeName);
                    if (questionOutput) output += questionOutput;
                });
            }
            // 3. 处理直接作为子元素的单个题目
            else if (element.classList.contains('TiMu')) {
                // 如果到目前为止还没有输出过题型标题，并且输出为空或未包含 "## "
                if (!questionTypeHeaderFoundOverall && output.indexOf("## ") === -1) {
                    output += `## ${currentQuestionTypeName}\n`; // 使用当前（或默认）的题型标题
                    questionTypeHeaderFoundOverall = true; // 标记已处理过题型标题
                }
                let questionOutput = processSingleQuestion(element, currentQuestionTypeName);
                if (questionOutput) output += questionOutput;
            }
            // 4. 兼容处理：某些页面题目可能嵌套在其他类型的子元素中 (作业回顾页面常见)
            else {
                const nestedQuestions = element.querySelectorAll('.TiMu');
                 if (nestedQuestions.length > 0) {
                    if (!questionTypeHeaderFoundOverall && output.indexOf("## ") === -1) {
                         output += `## ${currentQuestionTypeName}\n`;
                         questionTypeHeaderFoundOverall = true;
                    }
                    nestedQuestions.forEach(qEl => {
                        let questionOutput = processSingleQuestion(qEl, currentQuestionTypeName);
                        if (questionOutput) output += questionOutput;
                    });
                }
            }
        }
         // 最终检查：如果整个过程中没有找到显式的题型标题，但提取到了题目，
         // 且输出中尚未包含任何 "## " 格式的题型标题，则尝试从第一个题目推断并添加。
        if (!questionTypeHeaderFoundOverall && mainQuizContainer.querySelector('.TiMu') && output.indexOf("## ") === -1) {
            // 尝试从第一个题目的题干中推断题型
            const firstQuestionTextDiv = mainQuizContainer.querySelector('.TiMu .Cy_TItle div.clearfix, .TiMu .Zy_TItle div.clearfix');
            if (firstQuestionTextDiv) {
                const firstQuestionRawText = getCleanTextFromElement(firstQuestionTextDiv);
                if (firstQuestionRawText.startsWith("【单选题】")) currentQuestionTypeName = "单选题";
                // 可在此处添加更多题型推断逻辑
            }
            output = `## ${currentQuestionTypeName}\n` + output; // 将推断的题型标题加在最前面
        }


        // 处理最终输出
        if (output) {
            GM_setClipboard(output); // 复制到剪贴板
            showCustomNotification(`题目已${isManualTrigger ? '手动' : '自动'}提取并成功复制到剪贴板！`);
            displayOutput(output); // 在页面上显示提取的内容
        } else {
            const msg = '未能找到或处理任何题目。请检查页面结构或在浏览器控制台查看错误信息。';
            if (isManualTrigger) showCustomNotification(msg, true);
            else console.warn(`油猴脚本：${msg}`);
        }
        return output;
    }

    /**
     * 处理单个题目元素，提取题号、题干、选项、答案和解析。
     * @param {HTMLElement} questionElement - 代表单个题目的 DOM 元素 (通常是 .TiMu)。
     * @param {string} questionTypeName - 当前题目的类型名称 (例如 "单选题")。
     * @returns {string} 格式化后的单个题目字符串，如果处理出错则返回错误提示。
     */
    function processSingleQuestion(questionElement, questionTypeName) {
        let qOutput = ""; // 用于累积单个题目的输出
        try {
            // --- 提取题号和题干 ---
            // 题目标题容器，可能是 .Cy_TItle (考试) 或 .Zy_TItle (作业)
            const questionTitleDiv = questionElement.querySelector('.Cy_TItle, .Zy_TItle');
            let questionNumberElement = null; // 题号元素
            let questionTextElement = null;   // 题干元素
            let questionNumber = "?.";        // 默认题号格式，统一使用 "." 结尾

            if (questionTitleDiv) { // 优先处理带有明确标题容器的结构
                questionNumberElement = questionTitleDiv.querySelector('i.fl'); // 题号通常在 i.fl 标签内
                if (questionNumberElement) {
                    questionNumber = normalizeText(questionNumberElement.textContent) + ".";
                    // 题干通常是题号元素的下一个兄弟元素，且class为clearfix
                    if (questionNumberElement.nextElementSibling && questionNumberElement.nextElementSibling.classList.contains('clearfix')) {
                        questionTextElement = questionNumberElement.nextElementSibling;
                    }
                }
                // 如果未能通过nextElementSibling找到题干，则尝试更复杂的查找逻辑（来自考试脚本）
                if (!questionTextElement) {
                    const potentialStems = questionTitleDiv.querySelectorAll('div.clearfix'); // 查找所有clearfix的div
                    if (potentialStems.length > 0) {
                        // 从后向前遍历，找到第一个不包含题号的clearfix div作为题干
                        for(let i = potentialStems.length - 1; i >= 0; i--) {
                            if(!potentialStems[i].querySelector('i.fl')) { // 确保不是另一个题号元素
                                questionTextElement = potentialStems[i];
                                break;
                            }
                        }
                        // 如果上述逻辑未找到，则默认使用第一个clearfix div
                        if(!questionTextElement && potentialStems.length > 0) questionTextElement = potentialStems[0];
                    }
                }
            } else { // 备用逻辑：如果题目元素下没有 .Cy_TItle 或 .Zy_TItle 容器
                //直接在 questionElement 下查找题号
                questionNumberElement = questionElement.querySelector(':scope > i.fl'); // :scope确保是直接子元素
                if (questionNumberElement) {
                    questionNumber = normalizeText(questionNumberElement.textContent) + ".";
                    if (questionNumberElement.nextElementSibling && questionNumberElement.nextElementSibling.classList.contains('clearfix')) {
                        questionTextElement = questionNumberElement.nextElementSibling;
                    }
                }
                // 如果题干仍未找到，则在 questionElement 的直接子元素中查找合适的 div.clearfix
                if (!questionTextElement) {
                     const potentialStems = questionElement.querySelectorAll(':scope > div.clearfix');
                     for (let div of potentialStems) {
                         // 确保这个div不是选项列表、答案区域，并且有足够的文本内容
                         if (!div.querySelector('.Cy_ulTop, .Zy_ulTop') && !div.querySelector('.Py_answer') && (div.textContent || "").trim().length > 5) {
                             questionTextElement = div;
                             break;
                         }
                     }
                }
            }

            let questionText = "题干未能提取"; // 默认题干文本
            if (questionTextElement) {
                let rawText = getCleanTextFromElement(questionTextElement);
                questionText = normalizeQuestionText(rawText); // 使用增强的题干清理函数
            }
            qOutput += questionNumber + " " + questionText + "\n"; // 输出: 题号. 题干

            // --- 提取选项 (选择题) ---
            // 选项列表容器，可能是 .Cy_ulTop li (考试) 或 .Zy_ulTop li (作业)
            let options = questionElement.querySelectorAll('.Cy_ulTop li');
            if (options.length === 0) { // 如果未找到 .Cy_ulTop li，则尝试 .Zy_ulTop li
                options = questionElement.querySelectorAll('.Zy_ulTop li');
            }

            let optionDetails = []; // 存储选项标签和文本，用于后续答案匹配
            if (options.length > 0) {
                options.forEach(optionLi => {
                    const optionLabelElement = optionLi.querySelector('i.fl'); // 例如: A, B, C
                    const rawOptionLabel = optionLabelElement ? normalizeText(optionLabelElement.textContent) : ""; // 获取原始标签文本

                    // 选项文本通常在 <a> 标签内，有时嵌套在 <p> 标签中
                    const optionTextAnchor = optionLi.querySelector('a'); // 优先查找a标签
                    let optText = "";
                    if (optionTextAnchor) {
                        const pInA = optionTextAnchor.querySelector('p');
                        optText = pInA ? normalizeText(pInA.textContent) : normalizeText(optionTextAnchor.textContent);
                    } else { // 如果没有a标签，尝试直接从li中获取文本 (排除标签部分)
                        let tempOptClone = optionLi.cloneNode(true);
                        if(tempOptClone.querySelector('i.fl')) tempOptClone.querySelector('i.fl').remove(); // 移除标签部分
                        optText = normalizeText(tempOptClone.textContent);
                    }
                    // 存储清理后的选项标签和文本
                    optionDetails.push({ label: rawOptionLabel.replace(/[:、.]\s*$/, ''), text: optText });
                    qOutput += rawOptionLabel + " " + optText + "\n"; // 输出: A. 选项内容
                });
            }

            // --- 提取正确答案 (根据题型进行不同处理) ---
            let finalCorrectAnswer = "未能提取"; // 默认答案
            // 尝试获取隐藏的答案元素（通常包含更准确的答案信息）
            const correctAnswerPElement = questionElement.querySelector('.Py_answer span.element-invisible-hidden p'); // 隐藏的答案文本
            const correctAnswerIconElement = questionElement.querySelector('.Py_answer span.element-invisible-hidden i.font20'); // 隐藏的答案图标 (判断题√×)
            // 填空题、简答题的答案通常在特定div中显示
            const revealedAnswerDiv = questionElement.querySelector(".Py_tk div[id^='div']"); // id以div开头的答案显示区

            if (questionTypeName === "单选题" || questionTypeName === "多选题") {
                if (correctAnswerPElement) { // 优先使用隐藏的答案文本
                    let correctAnswerTextFromHidden = normalizeText(correctAnswerPElement.textContent);
                    let foundMatch = false;
                    // 尝试将隐藏的答案文本与选项文本匹配，以获取选项标签 (A, B)
                    for (const opt of optionDetails) {
                        if (typeof opt.text === 'string' && typeof correctAnswerTextFromHidden === 'string' && opt.text === correctAnswerTextFromHidden) {
                            finalCorrectAnswer = opt.label;
                            foundMatch = true;
                            break;
                        }
                    }
                    // 如果文本不匹配，但隐藏文本本身是合法的选项标签 (如 "A", "ABC")
                    if (!foundMatch && /^[A-Z]+$/.test(correctAnswerTextFromHidden) && optionDetails.some(opt => opt.label === correctAnswerTextFromHidden)) {
                        finalCorrectAnswer = correctAnswerTextFromHidden;
                    } else if (!foundMatch) { // 如果都未匹配，直接使用隐藏的文本内容
                        finalCorrectAnswer = correctAnswerTextFromHidden;
                    }
                } else { // 如果没有隐藏的答案文本，尝试从可见的 "正确答案：" 提示中提取
                    const answerSpans = questionElement.querySelectorAll('.Py_answer span');
                    for (const span of answerSpans) {
                        const spanText = normalizeText(span.textContent);
                        if (spanText.startsWith('正确答案：')) {
                            let visibleAnswerText = spanText.replace('正确答案：', '').trim();
                            let foundVisibleMatch = false;
                            // 尝试将可见答案文本与选项标签或选项文本匹配
                            for (const opt of optionDetails) {
                                if (opt.label === visibleAnswerText) { finalCorrectAnswer = opt.label; foundVisibleMatch = true; break; }
                                else if (opt.text === visibleAnswerText) { finalCorrectAnswer = opt.label; foundVisibleMatch = true; break; }
                            }
                            if (!foundVisibleMatch) finalCorrectAnswer = visibleAnswerText; // 若无匹配，使用原始可见文本
                            break;
                        }
                    }
                }
            } else if (questionTypeName === "判断题") {
                if (correctAnswerIconElement) { // 优先使用隐藏的图标 (√, ×)
                    let symbol = correctAnswerIconElement.textContent.trim();
                    if (symbol === "√") finalCorrectAnswer = "对";
                    else if (symbol === "×") finalCorrectAnswer = "错";
                    else finalCorrectAnswer = symbol; // 如果不是标准符号，直接使用
                } else if (correctAnswerPElement) { // 备用：使用隐藏的文本 ("对", "错")
                    let textAns = normalizeText(correctAnswerPElement.textContent);
                     if (textAns === "对" || textAns.toLowerCase() === "true") finalCorrectAnswer = "对";
                     else if (textAns === "错" || textAns.toLowerCase() === "false") finalCorrectAnswer = "错";
                     else finalCorrectAnswer = textAns;
                } else { // 最后尝试可见的 "正确答案：" 提示
                    const answerSpans = questionElement.querySelectorAll('.Py_answer span');
                    for (const span of answerSpans) {
                        const spanText = normalizeText(span.textContent);
                        if (spanText.startsWith('正确答案：')) {
                            let textAnswer = spanText.replace('正确答案：', '').trim();
                            // 检查可见提示中是否直接包含图标
                            const iconInSpan = span.querySelector('i.font20');
                            if (iconInSpan) textAnswer = iconInSpan.textContent.trim();

                            if (textAnswer === "√" || textAnswer.toLowerCase() === "true" || textAnswer === "对") finalCorrectAnswer = "对";
                            else if (textAnswer === "×" || textAnswer.toLowerCase() === "false" || textAnswer === "错") finalCorrectAnswer = "错";
                            else finalCorrectAnswer = textAnswer;
                            break;
                        }
                    }
                }
            } else if (revealedAnswerDiv && (questionTypeName === "填空题" || questionTypeName === "简答题" || questionTypeName === "资料题")) {
                // 处理填空题、简答题、资料题的答案
                if (questionTypeName === "填空题") {
                    const parts = []; // 存储填空的各个部分
                    // 填空答案通常在 .font14 或直接子span中
                    revealedAnswerDiv.querySelectorAll("span.font14, div > span").forEach(span => {
                        const labelElement = span.querySelector('i.fb.red'); // 例如 "空1："
                        if (labelElement && labelElement.textContent.includes("空：")) { // 带标签的填空
                            let clone = span.cloneNode(true);
                            clone.querySelector('i.fb.red').remove(); // 移除标签本身，只留答案
                            parts.push(normalizeText(clone.textContent));
                        }
                        // 不带标签，但也不是“查看答案”之类的链接
                        else if (!labelElement && span.textContent.trim() !== "" && !span.querySelector('a[onclick*="hideAndShow"]')) {
                             parts.push(normalizeText(span.textContent));
                        }
                    });
                    finalCorrectAnswer = parts.join('; '); // 用分号连接多个填空答案
                } else if (questionTypeName === "资料题") { // 资料题的答案可能包含多个子部分
                    const subAnswers = [];
                    // 资料题的答案结构可能更复杂
                    revealedAnswerDiv.querySelectorAll("span.font14, div.clearfix > span, div > span").forEach(span => {
                        const labelElement = span.querySelector('i.fb.red'); // 子题目的标签，如 "空1：" 或 "1:"
                        let partText = "";
                        if (labelElement && (labelElement.textContent.includes("空：") || labelElement.textContent.match(/\d+[:：]/))) {
                            let label = normalizeText(labelElement.textContent).replace(/[:：]\s*(&nbsp;)?/, ''); // 清理标签文本
                            let clone = span.cloneNode(true);
                            labelElement.remove(); // 移除标签
                            partText = `${label}: ${getCleanTextFromElement(clone)}`; // 输出 "标签: 答案"
                        } else {
                             if (!span.querySelector('a[onclick*="hideAndShow"]')) { // 避免“查看答案”链接
                                partText = getCleanTextFromElement(span);
                             }
                        }
                        if(partText && partText.trim()) subAnswers.push(partText.trim());
                    });
                    // 如果有子答案，则换行连接；否则使用整个div的文本
                    finalCorrectAnswer = subAnswers.length > 0 ? "\n" + subAnswers.join("\n\n") : getCleanTextFromElement(revealedAnswerDiv);
                } else { // 简答题
                    // 简答题答案通常在 revealedAnswerDiv 的 .clearfix 子div 或其本身
                    const ansContentDiv = revealedAnswerDiv.querySelector("div.clearfix") || revealedAnswerDiv;
                    finalCorrectAnswer = getCleanTextFromElement(ansContentDiv);
                }
            }

            // 针对选择题和判断题的最后一道防线：如果以上所有方法都未能提取到答案，
            // 再次检查 .Py_answer span 中是否有 "正确答案："
            if (finalCorrectAnswer === "未能提取" && (questionTypeName === "单选题" || questionTypeName === "多选题" || questionTypeName === "判断题")) {
                 const answerSpans = questionElement.querySelectorAll('.Py_answer span');
                 for(let span of answerSpans){
                     const textContent = normalizeText(span.textContent);
                     if(textContent.startsWith('正确答案：')){
                         let visibleAnswerText = textContent.replace('正确答案：', '').trim();
                         // 针对选择题，如果答案是字母且选项中有此字母
                         if ((questionTypeName === "单选题" || questionTypeName === "多选题") && /^[A-Z]+$/.test(visibleAnswerText) && optionDetails.some(opt => opt.label === visibleAnswerText)) {
                             finalCorrectAnswer = visibleAnswerText;
                         // 针对判断题
                         } else if (questionTypeName === "判断题") {
                             if (visibleAnswerText === "√" || visibleAnswerText.toLowerCase() === "true" || visibleAnswerText === "对") finalCorrectAnswer = "对";
                             else if (visibleAnswerText === "×" || visibleAnswerText.toLowerCase() === "false" || visibleAnswerText === "错") finalCorrectAnswer = "错";
                             else finalCorrectAnswer = visibleAnswerText;
                         // 针对选择题，如果答案不是字母，尝试匹配选项文本
                         } else if (questionTypeName === "单选题" || questionTypeName === "多选题") {
                             let matched = false;
                             for (const opt of optionDetails) { if (opt.text === visibleAnswerText) { finalCorrectAnswer = opt.label; matched = true; break; } }
                             if (!matched) finalCorrectAnswer = visibleAnswerText; // 若无匹配，使用原始文本
                         } else {
                             finalCorrectAnswer = visibleAnswerText;
                         }
                         break; // 找到后即跳出循环
                     }
                 }
            }

            qOutput += "答案：" + finalCorrectAnswer + "\n"; // 输出: 答案：xxx

            // --- 提取题目解析 ---
            const explanationParent = questionElement.querySelector('.Py_addpy'); // 解析区域的父容器
            if (explanationParent) {
                const explanationElement = explanationParent.querySelector('.pingyu'); // 实际的解析文本容器
                 if (explanationElement) {
                    const explanationText = getCleanTextFromElement(explanationElement);
                    if (explanationText) { // 只有当解析文本非空时才输出
                        qOutput += "解析：" + explanationText + "\n"; // 输出: 解析：xxx
                    }
                }
            }
            qOutput += "\n"; // 每个题目结束后加一个空行，用于分隔
            return qOutput;

        } catch (e) { // 异常处理
            console.error("处理题目时出错:", e, questionElement);
            // 尝试获取出错题目的题号用于提示
            const qNumEl = questionElement.querySelector('.Cy_TItle i.fl, .Zy_TItle i.fl, :scope > i.fl');
            return `处理题目 ${qNumEl ? qNumEl.textContent.trim() : '未知'} 时出错。详情请查看控制台。\n\n`;
        }
    }

    // --- UI: 输出区域和复制按钮 ---
    let outputAreaElement = null; // 存储输出文本框的DOM引用
    let scriptContainerElement = null; // 存储脚本添加的整个UI容器的引用

    /**
     * 在页面上显示提取的题目内容。
     * @param {string} output - 要显示的格式化后的题目字符串。
     */
    function displayOutput(output) {
        // 如果UI元素尚未创建，则进行初始化
        if (!scriptContainerElement) {
            scriptContainerElement = document.createElement('div');
            scriptContainerElement.id = "universalExtractorContainerGM"; // 为整个UI容器设置ID

            outputAreaElement = document.createElement('textarea');
            outputAreaElement.id = 'extractionOutputAreaGM'; // 文本框ID
            outputAreaElement.readOnly = true; // 设置为只读
            scriptContainerElement.appendChild(outputAreaElement);

            const copyButtonElement = document.createElement('button');
            copyButtonElement.id = 'copyExtractionButtonGM'; // 复制按钮ID
            copyButtonElement.textContent = '复制内容到剪贴板';
            copyButtonElement.addEventListener('click', function() {
                GM_setClipboard(outputAreaElement.value); // 点击时复制文本框内容
                showCustomNotification('内容已再次复制到剪贴板!'); // 使用自定义通知提示
            });
            scriptContainerElement.appendChild(copyButtonElement);

            // 决定将UI容器插入到页面的哪个位置
            const targetContainer = document.querySelector('#ZyBottom'); // 尝试插入到主内容区之后
            const commonWrapper = document.querySelector('.wrap1000.clearfix.con'); // 备用插入点

            if (targetContainer && targetContainer.parentNode) {
                // 插入到 #ZyBottom 元素的后面
                targetContainer.parentNode.insertBefore(scriptContainerElement, targetContainer.nextSibling);
            } else if (commonWrapper) {
                 commonWrapper.appendChild(scriptContainerElement); // 作为 .wrap1000 的子元素
            } else {
                document.body.appendChild(scriptContainerElement); // 最后手段：添加到 body 的末尾
            }
        }
        outputAreaElement.value = output; // 设置文本框内容
        outputAreaElement.scrollTop = 0; // 滚动到文本框顶部，方便查看开头
    }

    // --- UI: 手动提取按钮 ---
    /**
     * 在页面上创建一个手动提取题目的按钮。
     */
    function createManualButton() {
        // 如果按钮已存在，则不重复创建
        if (document.getElementById('extractQuizButtonGM_merged')) return;

        const manualExtractButton = document.createElement('button');
        manualExtractButton.id = 'extractQuizButtonGM_merged'; // 按钮ID，确保唯一性
        manualExtractButton.textContent = '提取题目';
        // 按钮样式由 GM_addStyle 定义

        manualExtractButton.addEventListener('click', function() {
            const btn = this;
            const originalText = btn.textContent;
            const originalBg = btn.style.backgroundColor; // 保存原始背景色

            // 更新按钮状态为“正在提取”
            btn.textContent = '正在提取...';
            btn.disabled = true;
            btn.style.backgroundColor = '#5a6268'; // 设置为“忙碌”状态的颜色

            // 使用 setTimeout 允许浏览器UI更新按钮状态，然后再执行耗时操作
            setTimeout(() => {
                const outputGenerated = extractAndFormatQuestions(true); // 调用主提取函数，标记为手动触发
                if (outputGenerated) {
                    btn.textContent = '提取完成!';
                    btn.style.backgroundColor = '#218838'; // 成功颜色
                } else {
                    btn.textContent = '提取失败!';
                    btn.style.backgroundColor = '#c82333'; // 失败颜色
                }
                // 2.5秒后恢复按钮原始状态
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = originalBg; // 恢复原始背景或默认样式定义的颜色
                    btn.disabled = false;
                }, 2500);
            }, 50); // 短暂延迟
        });
        document.body.appendChild(manualExtractButton); // 将按钮添加到body
    }

    // --- 油猴菜单设置项 & 自动提取逻辑 ---
    /**
     * 切换自动提取功能的开启/关闭状态。
     * 状态通过 GM_setValue/GM_getValue 持久化存储。
     */
    function toggleAutoExtract() {
        let isEnabled = GM_getValue(AUTO_EXTRACT_KEY, false); // 读取当前状态，默认为false
        GM_setValue(AUTO_EXTRACT_KEY, !isEnabled); // 切换状态并保存
        alert(`自动提取并复制功能已 ${!isEnabled ? '开启' : '关闭'}。\n请刷新页面以使设置生效。`);
        registerMenuCommands(); // 重新注册菜单命令以更新标签文本（例如 ✅/❌）
    }

    /**
     * 注册油猴脚本菜单命令，用于控制自动提取功能。
     * 菜单项的标签会根据当前自动提取状态动态显示。
     */
    function registerMenuCommands() {
        let isEnabled = GM_getValue(AUTO_EXTRACT_KEY, false);
        // 根据状态显示不同的前缀图标和文本
        GM_registerMenuCommand(`${isEnabled ? '✅' : '❌'} 自动提取题目 (当前: ${isEnabled ? '开启' : '关闭'}) - 点击切换`, toggleAutoExtract, 'a');
    }

    // --- 脚本初始化 ---
    registerMenuCommands(); // 页面加载时即注册菜单命令
    createManualButton();   // 创建手动提取按钮

    // 页面加载完成后执行自动提取（如果已启用）
    window.addEventListener('load', function() {
        if (GM_getValue(AUTO_EXTRACT_KEY, false)) { // 检查自动提取是否已开启
            // 使用 setTimeout 延迟执行，给页面动态内容更多加载时间
            setTimeout(function() {
                console.log("油猴脚本：自动提取功能已开启，正在尝试提取...");
                extractAndFormatQuestions(false); // 调用主提取函数，标记为自动触发
            }, 1200); // 延迟1.2秒
        }
    });

    // --- 注入CSS样式 (用于脚本添加的UI元素) ---
    GM_addStyle(`
        #extractQuizButtonGM_merged { /* 手动提取按钮样式 (ID已更新) */
            position: fixed; top: 70px; right: 20px; z-index: 10001; /* 固定在右上角，高层级 */
            padding: 10px 15px; background-color: #007bff; color: white;
            border: none; border-radius: 5px; cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* 阴影效果 */
            transition: background-color 0.3s ease, transform 0.1s ease, opacity 0.3s ease; /* 过渡动画 */
        }
        #extractQuizButtonGM_merged:hover { background-color: #0056b3; opacity: 0.9; } /* 悬停效果 */
        #extractQuizButtonGM_merged:active { transform: scale(0.98); } /* 点击效果 */
        #extractQuizButtonGM_merged:disabled { background-color: #5a6268; cursor: not-allowed; } /* 禁用状态 */

        #universalExtractorContainerGM { /* 脚本UI总容器样式 (ID已更新) */
            margin-top: 25px; padding: 15px; background-color: #f0f0f0; /* 背景与内边距 */
            border-top: 1px solid #dee2e6; border-radius: 0 0 8px 8px; /* 边框与圆角 */
            clear: both; /* 清除浮动，避免影响页面原有布局 */
        }
        #extractionOutputAreaGM { /* 提取结果文本框样式 */
            width: 95%; min-height: 300px; max-height: 70vh; /* 宽高与最大高度限制 */
            margin: 20px auto; padding: 15px; border: 1px solid #ccc;
            border-radius: 4px; font-family: 'Courier New', Courier, monospace; /* 等宽字体 */
            font-size: 13px; line-height: 1.6; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            resize: vertical; background-color: #fdfdfd; white-space: pre-wrap; /* 允许垂直调整大小，保留换行和空格 */
        }
        #copyExtractionButtonGM { /* 文本框下方的复制按钮样式 */
            display: block; margin: 10px auto 20px auto; padding: 12px 20px;
            background-color: #6c757d; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-size: 15px;
            transition: background-color 0.2s ease-in-out;
        }
        #copyExtractionButtonGM:hover { background-color: #545b62; }

        #customNotificationGM { /* 自定义悬浮通知样式 */
            position: fixed; /* 固定定位 */
            top: 20px; /* 距顶部20px */
            left: 50%; /* 水平居中 */
            transform: translateX(-50%); /* 精确水平居中 */
            color: white;
            padding: 12px 25px;
            border-radius: 6px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            z-index: 10002; /* 比提取按钮更高的层级 */
            font-size: 15px;
            display: none; /* 初始隐藏 */
            text-align: center;
            opacity: 0; /* 初始透明，配合JS实现淡入 */
        }
    `);

})(); // IIFE结束