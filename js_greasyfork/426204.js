// ==UserScript==
// @name        【ZeRoTool】智慧树答题小工具✡️✡️✡️🎉
// @namespace    坏蛋MOOC
// @version      5.1.1
// @description  【最新版】专注于智慧树知到答题自动挂机看知到MOOC，章节测试自动答题，以优化答案匹配逻辑，匹配更精准
// @author       坏蛋MOOC
// @match        *://*.zhihuishu.com/*
// @match        *://*.zhihuishu.com/videoStudy*
// @match        *://*.zhihuishu.com/portals_h5*
// @match        *://*.zhihuishu.com/live*
// @match        *://*.zhihuishu.com/examh5*
// @match        *://*.zhihuishu.com/live/vod_room*
// @match        *://*.zhihuishu.com/stuExamWeb*
// @connect      up.gomooc.net
// @connect      aa.6hck.xyz
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @resource     css https://unpkg.com/element-ui@2.15.13/lib/theme-chalk/index.css
// @license      MIT
// @antifeature  ads
// @downloadURL https://update.greasyfork.org/scripts/426204/%E3%80%90ZeRoTool%E3%80%91%E6%99%BA%E6%85%A7%E6%A0%91%E7%AD%94%E9%A2%98%E5%B0%8F%E5%B7%A5%E5%85%B7%E2%9C%A1%EF%B8%8F%E2%9C%A1%EF%B8%8F%E2%9C%A1%EF%B8%8F%F0%9F%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/426204/%E3%80%90ZeRoTool%E3%80%91%E6%99%BA%E6%85%A7%E6%A0%91%E7%AD%94%E9%A2%98%E5%B0%8F%E5%B7%A5%E5%85%B7%E2%9C%A1%EF%B8%8F%E2%9C%A1%EF%B8%8F%E2%9C%A1%EF%B8%8F%F0%9F%8E%89.meta.js
// ==/UserScript==

const qrCode = ``;
let isCollapsed = false; // 折叠状态
const logMessages = []; // 日志消息存储
let windowState = { // 窗口状态存储
    width: 500, // 增大宽度以适应左右布局
    height: 450, // 减小高度
    left: 20,
    top: 20,
    collapsed: false
};

function loadWindowState() {
    try {
        const savedState = GM_getValue('windowState', null);
        if (savedState) {
            windowState = JSON.parse(savedState);
            isCollapsed = windowState.collapsed;
        }
    } catch (e) {
        logMessage('加载窗口状态失败: ' + e.message, 'warning');
    }
}

function saveWindowState() {
    try {
        const floatingWindow = document.getElementById('floating-window');
        if (floatingWindow) {
            windowState.width = parseInt(getComputedStyle(floatingWindow).width);
            windowState.height = parseInt(getComputedStyle(floatingWindow).height);
            windowState.left = parseInt(floatingWindow.style.left);
            windowState.top = parseInt(floatingWindow.style.top);
            windowState.collapsed = isCollapsed;
            GM_setValue('windowState', JSON.stringify(windowState));
        }
    } catch (e) {
        logMessage('保存窗口状态失败: ' + e.message, 'warning');
    }
}

enableWebpackHook();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const config = {
    awaitTime: 5000,
    stopTimer: false,
    questionCount: 0,
    finishCount: 0,
    questionType: {
        '判断题': 10,
        '单选题': 20,
        '多选题': 25,
        '填空题': 30,
        '问答题': 40,
    },
    apiKey: GM_getValue('apiKey', '')
};

function logMessage(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        timestamp,
        message,
        type
    };

    logMessages.push(logEntry);

    if (logMessages.length > 30) {
        logMessages.shift();
    }

    updateLogDisplay();
}

function updateLogDisplay() {
    const logContainer = document.getElementById('log-container');
    if (!logContainer) return;

    logContainer.innerHTML = '';

    logMessages.forEach(entry => {
        const logItem = document.createElement('div');
        logItem.className = `log-item log-${entry.type}`;
        logItem.innerHTML = `
            <span class="log-timestamp">${entry.timestamp}</span>
            <span class="log-content">${entry.message}</span>
        `;
        logContainer.appendChild(logItem);
    });

    logContainer.scrollTop = logContainer.scrollHeight;
}

function answerQuestion(questionBody, questionIndex) {
    const questionTitle = questionBody.querySelector('.subject_describe div,.smallStem_describe p').__Ivue__._data.shadowDom.textContent;
    appendToTable(questionTitle, "", questionIndex);
    logMessage(`正在处理第 ${questionIndex} 题: ${questionTitle.substring(0, 30)}...`);

    const questionType = questionBody.querySelector(".subject_type").innerText.match(/【(.+)】|$/)[1];
    let type = config.questionType[questionType];
    type = type !== undefined ? type : -1;

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://up.gomooc.net/tkapi4.php?question=${encodeURIComponent(questionTitle)}${config.apiKey ? `&key=${config.apiKey}` : ''}`,
        onload: xhr => {
            try {
                const res = JSON.parse(xhr.responseText);
                const msg = res.msg;
                let answerString = res.answer;
                const displayMsg = res.msgs;
                updateMsg(displayMsg);

                if (msg === "暂无答案") {
                    answerString = "暂无答案";
                    changeAnswerInTable(answerString, questionIndex, true);
                    logMessage(`第 ${questionIndex} 题: 暂无答案`, 'warning');
                } else {
                    const isSelect = chooseAnswer(type, questionBody, answerString);
                    changeAnswerInTable(answerString, questionIndex, isSelect);
                    logMessage(`第 ${questionIndex} 题: 已匹配答案${isSelect ? '' : '，但匹配度较低'}`, isSelect ? 'success' : 'warning');
                }
                document.querySelectorAll('.switch-btn-box > button')[1].click();
            } catch (error) {
                logMessage(`第 ${questionIndex} 题: 解析答案出错 - ${error.message}`, 'error');
            }
        },
        onerror: err => {
            logMessage(`第 ${questionIndex} 题: 请求答案失败 - ${err.message}`, 'error');
            console.log(err);
        }
    });
}
function chooseAnswer(questionType, questionBody, answerString) {
    let isSelect = false;
    const answers = answerString.split(/[\u0001,#=;=-|；、,]+/).map(a => a.trim()).filter(Boolean);

    if (!questionBody) return isSelect;

    switch (questionType) {
        case 10: // 判断题
            return handleJudgment(questionBody, answers);
        case 20: // 单选题
            return handleSingleChoice(questionBody, answers);
        case 25: // 多选题
            return handleMultipleChoice(questionBody, answers);
        case 30: // 填空题
            return handleFillInBlank(questionBody, answers);
        case 40: // 问答题
            return handleEssay(questionBody, answerString);
        default:
            return isSelect;
    }
}

function handleJudgment(questionBody, answers) {
    const firstOption = questionBody.querySelector(".nodeLab");
    const secondOption = questionBody.querySelectorAll(".nodeLab")[1];
    if (!firstOption || !secondOption) return false;

    const optionText = questionBody.querySelector(".node_detail")?.innerText || "";
    const givenAnswer = answers[0]?.toLowerCase();
    const isCorrect = /正确|是|对|√|t|true/i.test(givenAnswer);
    const isOptionCorrect = /正确|是|对|√|t|true/i.test(optionText);

    (isCorrect === isOptionCorrect ? firstOption : secondOption).click();
    return true;
}

function handleSingleChoice(questionBody, answers) {
    const options = questionBody.querySelectorAll(".node_detail");
    if (!options.length) return false;

    const targetAnswer = answers[0];
    if (!targetAnswer) return false;

    for (let i = 0; i < options.length; i++) {
        const optionText = options[i].innerText.trim();
        const score = calculateMatchScore(optionText, targetAnswer);

        if (score >= 80) {
            clickOption(i, questionBody);
            return true;
        }
    }

    let maxScore = 0;
    let bestIndex = -1;
    for (let i = 0; i < options.length; i++) {
        const optionText = options[i].innerText.trim();
        const score = calculateMatchScore(optionText, targetAnswer);

        if (score > maxScore) {
            maxScore = score;
            bestIndex = i;
        }
    }

    if (bestIndex >= 0 && maxScore >= 30) {
        clickOption(bestIndex, questionBody);
        return true;
    }

    return false;
}

function handleMultipleChoice(questionBody, answers) {
    const options = questionBody.querySelectorAll(".node_detail");
    if (!options.length || !answers.length) return false;

    let matched = false;
    const selectedOptions = new Set();

    answers.forEach(answer => {
        let bestScore = 0;
        let bestIndex = -1;

        options.forEach((option, index) => {
            if (selectedOptions.has(index)) return;

            const optionText = option.innerText.trim();
            const score = calculateMatchScore(optionText, answer);

            if (score > bestScore) {
                bestScore = score;
                bestIndex = index;
            }
        });

        if (bestIndex >= 0 && bestScore >= 30) {
            clickOption(bestIndex, questionBody);
            selectedOptions.add(bestIndex);
            matched = true;
        }
    });

    return matched;
}

function calculateMatchScore(optionText, answer) {
    if (optionText === answer) return 100;

    if (optionText.includes(answer) || answer.includes(optionText)) {
        return optionText.length === answer.length ? 100 :
               optionText.length > answer.length ? 80 : 60;
    }

    if (answer.includes('*') || answer.includes('?')) {
        const regex = wildcardToRegex(answer);
        if (regex.test(optionText)) {
            return 50;
        }
    }

    const optionKeywords = extractKeywords(optionText);
    const answerKeywords = extractKeywords(answer);

    if (!optionKeywords.length || !answerKeywords.length) return 0;

    const commonKeywords = optionKeywords.filter(kw => answerKeywords.includes(kw));
    const keywordMatchRate = commonKeywords.length / Math.max(optionKeywords.length, answerKeywords.length);

    const charMatchRate = calculateCharMatchRate(optionText, answer);

    return Math.round(keywordMatchRate * 70 + charMatchRate * 30);
}

function wildcardToRegex(pattern) {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const regexPattern = escaped.replace(/\*/g, '.*').replace(/\?/g, '.');
    return new RegExp(`^${regexPattern}$`);
}

function extractKeywords(text) {
    if (!text) return [];

    text = text.replace(/[^\w\u4e00-\u9fa5]/g, '');

    const keywords = [];


    const chineseWords = text.match(/[\u4e00-\u9fa5]{3,}/g) || [];
    keywords.push(...chineseWords);

    const englishWords = text.match(/[a-zA-Z]{3,}/g) || [];
    keywords.push(...englishWords);

    return keywords;
}

function calculateCharMatchRate(str1, str2) {
    const shorter = str1.length <= str2.length ? str1 : str2;
    const longer = str1.length > str2.length ? str1 : str2;

    let maxMatch = 0;

    for (let i = 0; i <= longer.length - shorter.length; i++) {
        const substr = longer.substring(i, i + shorter.length);
        let matchCount = 0;

        for (let j = 0; j < shorter.length; j++) {
            if (shorter[j] === substr[j]) {
                matchCount++;
            }
        }

        if (matchCount > maxMatch) {
            maxMatch = matchCount;
        }
    }

    return maxMatch / shorter.length;
}

function handleFillInBlank(questionBody, answers) {
    const blanks = questionBody.querySelectorAll(".blankInput");
    if (!blanks.length) return false;

    for (let i = 0; i < blanks.length; i++) {
        const blank = blanks[i];
        if (i < answers.length) {
            blank.value = answers[i];
        } else {

            blank.value = answers[0] || "";
        }
    }
    return blanks.length > 0;
}

function handleEssay(questionBody, answerString) {
    const answerArea = questionBody.querySelector("textarea");
    if (answerArea) {
        answerArea.value = answerString;
        return true;
    }
    return false;
}

function clickOption(index, questionBody) {
    const optionLabel = questionBody.querySelectorAll(".nodeLab")[index];
    if (optionLabel) optionLabel.click();
}

function appendToTable(questionTitle, answerString, questionIndex) {
    const table = document.querySelector("#record-table tbody");
    table.innerHTML += `<tr><td>${questionIndex}</td><td>${questionTitle}</td><td id="answer${questionIndex}">正在搜索...</td></tr>`;
}

function changeAnswerInTable(answerString, questionIndex, isSelect) {
    const answerCell = document.querySelector(`#answer${questionIndex}`);
    answerCell.innerHTML = answerString;
    if (answerString === "暂无答案") {
        answerCell.insertAdjacentHTML('beforeend', `<p style="color:red"><i class="el-icon-error"></i> 暂无答案</p>`);
    }
    if (!isSelect) {
        answerCell.insertAdjacentHTML('beforeend', `<p style="color:red"><i class="el-icon-warning"></i> 未匹配答案，请根据搜索结果手动选择答案</p>`);
    }
}

function enableWebpackHook() {
    const originCall = Function.prototype.call;
    Function.prototype.call = function (...args) {
        const result = originCall.apply(this, args);
        if (args[2]?.default?.version === '2.5.2') {
            args[2]?.default?.mixin({
                mounted: function () {
                    this.$el['__Ivue__'] = this;
                }
            });
        }
        return result;
    }
}

function makeElementResizableDraggable(el) {
    loadWindowState();

    el.style.position = 'absolute';
    el.style.width = `${windowState.width}px`;
    el.style.height = `${windowState.height}px`;
    el.style.left = `${windowState.left}px`;
    el.style.top = `${windowState.top}px`;
    if (isCollapsed) {
        const dialogContent = document.querySelector('.el-dialog__body');
        const collapseBtn = document.querySelector('#collapse-btn i');
        dialogContent.style.display = 'none';
        collapseBtn.className = 'el-icon-circle-plus';
    }
    const header = el.querySelector('.el-dialog__header');
    header.style.cursor = 'move';

    header.onmousedown = function (event) {
        if (event.target.id === 'collapse-btn' || event.target.parentElement.id === 'collapse-btn') {
            return;
        }

        let shiftX = event.clientX - el.getBoundingClientRect().left;
        let shiftY = event.clientY - el.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            el.style.left = pageX - shiftX + 'px';
            el.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        el.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            el.onmouseup = null;
            saveWindowState();
        };
    };

    el.ondragstart = function () {
        return false;
    };
    const resizer = document.createElement('div');
    resizer.style.position = 'absolute';
    resizer.style.bottom = '0';
    resizer.style.right = '0';
    resizer.style.width = '15px';
    resizer.style.height = '15px';
    resizer.style.cursor = 'se-resize';
    resizer.style.zIndex = '100';
    resizer.className = 'el-icon-crop';
    resizer.style.color = '#409EFF';
    el.appendChild(resizer);

    resizer.onmousedown = function (event) {
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = el.offsetWidth;
        const startHeight = el.offsetHeight;

        function resizeAt(pageX, pageY) {
            const newWidth = startWidth + (pageX - startX);
            const newHeight = startHeight + (pageY - startY);

            if (newWidth >= 500) { 
                el.style.width = newWidth + 'px';
            }
            if (newHeight >= 370) { 
                el.style.height = newHeight + 'px';
            }
        }

        function onMouseMove(event) {
            resizeAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        document.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
            saveWindowState(); 
        };

        event.preventDefault(); 
    };
}

function toggleCollapse() {
    isCollapsed = !isCollapsed;
    const dialogContent = document.querySelector('.el-dialog__body');
    const collapseBtn = document.querySelector('#collapse-btn i');

    if (isCollapsed) {
        dialogContent.style.display = 'none';
        collapseBtn.className = 'el-icon-circle-plus';
       
        const floatingWindow = document.getElementById('floating-window');
        floatingWindow.style.height = '40px';
    } else {
        dialogContent.style.display = 'block';
        collapseBtn.className = 'el-icon-circle-minus';
       
        const floatingWindow = document.getElementById('floating-window');
        floatingWindow.style.height = `${windowState.height}px`;
    }

    saveWindowState(); 
}

function updateMsg(msg) {
    document.getElementById('display-msg').innerText = msg;
    logMessage(msg);
}

function saveApiKey() {
    const apiKeyInput = document.getElementById('api-key-input');
    const newApiKey = apiKeyInput.value.trim();
    if (newApiKey) {
        GM_setValue('apiKey', newApiKey);
        config.apiKey = newApiKey; // Update the local config as well
        logMessage('API Key 保存成功', 'success');
    } else {
        logMessage('API Key 不能为空', 'warning');
    }
}

function clearApiKey() {
    GM_setValue('apiKey', '');
    config.apiKey = ''; // Clear the local config as well
    document.getElementById('api-key-input').value = ''; // Clear the input field
    logMessage('API Key 已清除', 'info');
}

unsafeWindow.onload = (() => (async () => {
    GM_addStyle(GM_getResourceText("css"));
GM_addStyle(`
    /* 整体窗口样式 */
    .el-dialog {
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

  
    .el-dialog__header {
        background: linear-gradient(90deg, #409EFF, #66b1ff);
        color: white;
        cursor: move;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .el-dialog__title {
        color: white;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
    }

    .el-dialog__title i {
        margin-right: 8px;
        font-size: 18px;
    }

    .el-dialog__headerbtn {
        top: 10px;
        right: 15px;
    }

    .el-dialog__headerbtn .el-dialog__close {
        color: white;
        transition: transform 0.3s;
    }

    .el-dialog__headerbtn:hover .el-dialog__close {
        transform: rotate(90deg);
    }

    #collapse-btn {
        top: 10px;
        right: 40px;
        position: absolute;
        cursor: pointer;
    }

    #collapse-btn i {
        color: white;
        font-size: 16px;
    }

    .el-dialog__body {
        padding: 15px;
        display: flex;
        flex-direction: row;
        gap: 15px;
        height: calc(100% - 40px);
    }

  
    .left-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    
    .right-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

  
    .el-card {
        margin: 0;
        border-radius: 6px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        transition: transform 0.2s;
    }

    .el-card:hover {
        transform: translateY(-2px);
    }

    .el-card__header {
        padding: 8px 15px;
        font-size: 14px;
        font-weight: 500;
        background-color: #f5f7fa;
        border-radius: 6px 6px 0 0;
        display: flex;
        align-items: center;
    }

    .el-card__header i {
        margin-right: 5px;
        color: #409EFF;
    }

    .el-card__body {
        padding: 10px;
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .el-form-item__label {
        font-size: 14px;
        padding: 0 10px 0 0;
    }

    .el-input--medium .el-input__inner {
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
    }

    .el-button--medium {
        padding: 8px 15px;
        font-size: 14px;
        border-radius: 4px;
    }

    .el-button--primary {
        background-color: #409EFF;
        border-color: #409EFF;
        transition: all 0.3s;
    }

    .el-button--primary:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
    }

    .el-button--danger {
        background-color: #f56c6c;
        border-color: #f56c6c;
        transition: all 0.3s;
    }

    .el-button--danger:hover {
        background-color: #f78989;
        border-color: #f78989;
    }

    /* 二维码区域 */
    .qr-code-container {
        text-align: center;
    }

    .qr-code-container img {
        width: 100%;
        max-width: 140px;
        height: auto;
        border-radius: 4px;
        border: 1px solid #ebeef5;
    }

   
    .el-alert {
        padding: 10px 15px;
        margin: 0;
        border-radius: 4px;
    }

    .el-alert__title {
        font-size: 14px;
        font-weight: 500;
    }

    .el-alert__description {
        font-size: 13px;
    }

  
    .el-table {
        border-radius: 4px;
    }

    .el-table th {
        padding: 6px 0;
        font-size: 13px;
        background-color: #f5f7fa;
    }

    .el-table td {
        padding: 6px 0;
        font-size: 13px;
    }

    .el-table__body-wrapper {
        max-height: 120px;
        overflow-y: auto;
    }

    /* 日志容器 */
    #log-container {
        height: 120px;
        margin: 0;
        font-size: 12px;
        overflow-y: auto;
        border-radius: 4px;
        background-color: #f9fafc;
        padding: 8px;
    }

    .log-item {
        margin-bottom: 5px;
        padding: 2px 0;
        border-radius: 2px;
    }

    .log-info {
        color: #909399;
    }

    .log-success {
        color: #67c23a;
    }

    .log-warning {
        color: #e6a23c;
    }

    .log-error {
        color: #f56c6c;
    }

    .log-timestamp {
        margin-right: 8px;
        font-weight: 500;
    }

   
    @font-face {
        font-family: 'element-icons';
        src: url('https://unpkg.com/element-ui@2.15.13/lib/theme-chalk/fonts/element-icons.woff') format('woff'),
             url('https://unpkg.com/element-ui@2.15.13/lib/theme-chalk/fonts/element-icons.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    [class*="el-icon-"] {
        font-family: 'element-icons' !important;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .el-icon-lightning:before { content: "⚡"; }
    .el-icon-key:before { content: "🔑"; }
    .el-icon-mobile-phone:before { content: "📱"; }
    .el-icon-document:before { content: "📄"; }
    .el-icon-check:before { content: "✔"; }
    .el-icon-delete:before { content: "❌"; }
    .el-icon-circle-plus:before { content: "+"; }
    .el-icon-circle-minus:before { content: "−"; }
    .el-icon-close:before { content: "✖"; }
    .el-icon-crop:before { content: "✂"; }
    .el-icon-error:before { content: "❗"; }
    .el-icon-warning:before { content: "⚠"; }
`);
    const dialogStyle = `
        <div id="floating-window" class="el-dialog" style="width: 600px; max-width: 90%; min-height: 40px;">
            <div class="el-dialog__header">
                <span class="el-dialog__title">
                    <i class="el-icon-lightning" style="color: #ffd700;"></i> 智慧树小助手
                </span>
                <span id="collapse-btn">
                    <i class="el-icon-circle-minus"></i>
                </span>
                <button type="button" class="el-dialog__headerbtn">
                    <i class="el-dialog__close el-icon-close"></i>
                </button>
            </div>
            <div class="el-dialog__body">
                <!-- 左侧面板 -->
                <div class="left-panel">
                    <div class="el-card">
                        <div class="el-card__header">
                            <i class="el-icon-key"></i> API设置
                        </div>
                        <div class="el-card__body">
                            <div class="el-form">
                                <div class="el-form-item">
                                    <label class="el-form-item__label"></label>
                                    <div class="el-form-item__content">
                                        <div class="el-input el-input--medium">
                                            <input id="api-key-input" type="text" placeholder="请输入API Key"
                                                class="el-input__inner" value="${config.apiKey}">
                                        </div>
                                        <div class="el-form-item__content" style="margin-top: 8px;">
                                            <button id="save-api-key-btn" class="el-button el-button--primary el-button--medium">
                                                <i class="el-icon-check"></i> 保存
                                            </button>
                                            <button id="clear-api-key-btn" class="el-button el-button--danger el-button--medium"
                                                style="margin-left: 10px;">
                                                <i class="el-icon-delete"></i> 清除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="el-card qr-code-container">
                        <div class="el-card__header">
                            <i class="el-icon-mobile-phone"></i> 扫码关注公众号
                        </div>
                        <div class="el-card__body">
                            <img src="http://up.026wk.xyz/12.png" alt="公众号二维码">
                            <p style="font-size: 12px; color: #606266; margin-top: 8px;">扫码关注公众号获取更多学习资源</p>
                        </div>
                    </div>
 <div class="el-card qr-code-container">
                    <div class="el-alert el-alert--info">
                        <i class="el-alert__icon el-icon-info"></i>
                        <div class="el-alert__content">
                            <p class="el-alert__title">当前状态</p>
                            <p id="display-msg" class="el-alert__description "></p>
                        </div>
                    </div>
                </div>
  </div>
                <!-- 右侧面板 -->
                <div class="right-panel">
                    <div class="el-card">
                        <div class="el-card__header">
                            <i class="el-icon-document"></i> 答题记录
                        </div>
                        <div class="el-card__body">
                            <div class="el-table__body-wrapper">
                                <table id="record-table" class="el-table__body">
                                    <thead>
                                        <tr class="el-table__header">
                                            <th class="el-table_1_column_1"><div class="cell">序号</div></th>
                                            <th class="el-table_1_column_2"><div class="cell">题目</div></th>
                                            <th class="el-table_1_column_3"><div class="cell">答案</div></th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="el-card">
                        <div class="el-card__header">
                            <i class="el-icon-document"></i> 操作日志
                        </div>

                        <div class="el-card__body">
                            <div id="log-container"></div>
                        </div>


                    </div>
                     <div class="el-card">
                    <div class="el-card__header"><i class="el-icon-guide"></i>使用说明</div>
                    <div class="el-card__body">
                        <p style="font-size: 12px; color: #606266; margin-bottom: 5px;">1. 输入API Key以获取更准确的答案</p>
                        <p style="font-size: 12px; color: #606266; margin-bottom: 5px;">2. 打开题目页面后会自动识别题目</p>
                        <p style="font-size: 12px; color: #606266; margin-bottom: 5px;">3. 答案匹配结果会显示在答题记录中</p>
                        <p style="font-size: 12px; color: #606266;">4. 可拖动窗口调整位置，点击顶部可折隐藏窗口（刷新恢复）</p>
                          <p style="font-size: 10px; color: #DC143C;">5. 用于学习使用，请下载后在24小时内删除</p>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', dialogStyle);
    makeElementResizableDraggable(document.getElementById('floating-window'));
    document.querySelector('.el-dialog__headerbtn').addEventListener('click', function() {
        document.getElementById('floating-window').style.display = 'none';
    });
    document.getElementById('collapse-btn').addEventListener('click', toggleCollapse);

    // Save API Key button event listener
    document.getElementById('save-api-key-btn').addEventListener('click', saveApiKey);
    // Clear API Key button event listener
    document.getElementById('clear-api-key-btn').addEventListener('click', clearApiKey);

    logMessage('智慧树小助手已启动', 'info');

    await sleep(config.awaitTime);

    const questionBodyAll = document.querySelectorAll(".examPaper_subject.mt20");
    if (questionBodyAll.length === 0) {
        logMessage('未检测到题目', 'warning');
        return;
    }

    config.questionCount = questionBodyAll.length;
    logMessage(`共检测到 ${config.questionCount} 道题目`, 'info');

    answerQuestion(questionBodyAll[0], 1);
    let finishCount = 1;
    const interval = setInterval(() => {
        if (finishCount < questionBodyAll.length) {
            answerQuestion(questionBodyAll[finishCount], finishCount + 1);
            finishCount += 1;
        } else {
            clearInterval(interval);
            updateMsg("所有题目已处理完成！", 'success');
            logMessage("所有题目已处理完成！", 'success');
        }
    }, 3000);
}))();