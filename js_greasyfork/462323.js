// ==UserScript==
// @name         超星学习通+AI自动答题脚本（支持考试，作业，章节测试，支持新版学习通,一键最小化,多种AI）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  超星学习通+ChatGPT自动答题脚本（支持考试和作业和章节测试，支持新版学习通）。直接获取到答案，可以复制答案到剪切板。
// @author       Cwyu
// @license      GPL3
// @supportURL  1441577495@qq.com
// @contributionURL https://ifdian.net/a/cwyuu
// @match        *://mooc1.chaoxing.com/exam-ans/mooc2/exam/preview?*
// @match        *://mooc1.chaoxing.com/mooc2/work/dowork?*
// @match        *://mooc1.chaoxing.com/mycourse/studentstudy?*
// @match        *://mooc1.chaoxing.com/mycourse/studentstudy*
// @match        *://mooc1.chaoxing.com/mooc-ans/mooc2/work/dowork*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/462323/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%2BAI%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E6%94%AF%E6%8C%81%E8%80%83%E8%AF%95%EF%BC%8C%E4%BD%9C%E4%B8%9A%EF%BC%8C%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%EF%BC%8C%E6%94%AF%E6%8C%81%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%2C%E4%B8%80%E9%94%AE%E6%9C%80%E5%B0%8F%E5%8C%96%2C%E5%A4%9A%E7%A7%8DAI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/462323/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%2BAI%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC%EF%BC%88%E6%94%AF%E6%8C%81%E8%80%83%E8%AF%95%EF%BC%8C%E4%BD%9C%E4%B8%9A%EF%BC%8C%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%EF%BC%8C%E6%94%AF%E6%8C%81%E6%96%B0%E7%89%88%E5%AD%A6%E4%B9%A0%E9%80%9A%2C%E4%B8%80%E9%94%AE%E6%9C%80%E5%B0%8F%E5%8C%96%2C%E5%A4%9A%E7%A7%8DAI%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    GM_addStyle(`
        #my-window {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 500px;
            height: 400px;
            background-color: rgba(255, 255, 255, 0.95);
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            resize: both;
            min-width: 300px;
            min-height: 200px;
        }
        
        #my-window .header {
            background-color: #1a202c;
            color: white;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 8px 8px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        #my-window .xxt-content {
            padding: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            width: auto;
            min-height: 0;
		}
        
        #my-window .question-section,
        #my-window .answer-section {
                background-color: #fff;
				border: 1px solid #e2e8f0;
				padding: 12px;
				border-radius: 4px;
				margin-bottom: 8px;
				word-break: break-word;
				overflow-wrap: break-word;
        }
        
        #my-window .answer-section {
            flex: 1;
            overflow-y: auto;
        }

        #my-window .controls {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 10px;
        }
        
        #my-window .settings-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        #my-window .button-row {
            display: flex;
            gap: 8px;
        }
        
        #my-window button {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            border: none;
            background: #e2e8f0;
            transition: background-color 0.2s;
        }
        
        #my-window button:hover {
            background: #cbd5e1;
        }
        
        #my-window button#refresh-btn {
            background: #3b82f6;
            color: white;
        }
        
        #my-window button#refresh-btn:hover {
            background: #2563eb;
        }
        
        #my-window button#copy-btn {
            background: #10b981;
            color: white;
        }
        
        #my-window button#copy-btn:hover {
            background: #059669;
        }
        
        #my-window select {
            padding: 4px;
            border-radius: 4px;
            font-size: 12px;
            border: 1px solid #e2e8f0;
            flex: 1;
            max-width: 68%;
        }

        #my-window .mcheckbox {
            min-width:65px
        }
        
        #my-window input[type="text"] {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        border: 1px solid #e2e8f0;
        flex: 1;
        }
        
        #floating-button {
        position: fixed;
        top: 20px;
        left: -45px;
        width: 50px;
        height: 50px;
        background-color: #1a202c;
        color: white;
        border-radius: 25px;
        text-align: center;
        line-height: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 9999;
        font-size: 12px;
        }
        #floating-button:hover {
            left: 0;
        }
		
		#my-window .label {
			color: #64748b;
			font-size: 12px;
			margin-bottom: 4px;
		}
		
		#my-window .subscription-row {
			display: flex;
			gap: 8px;
			width: 100%;
		}

        #my-window .subscription-row input {
        flex: 1;
        }
        
        #my-window .subscription-row button {
        white-space: nowrap;
        }
        
        #my-window button svg {
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        }
        
        #my-window #prev-btn svg,
        #my-window #next-btn svg {
        margin-right: 0;
        }
        
        #my-window .status-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 8px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }

        .features-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
    }
    
    .feature-toggles {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }
    
    .feature-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        position: relative;
        cursor: pointer;
    }
    
    .feature-toggle input[type="checkbox"] {
        margin: 0;
    }
    
    .toggle-label {
        font-size: 12px;
        color: #1a202c;
    }
    
    .tooltip {
        display: none;
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        background: #1a202c;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        margin-left: 8px;
        z-index: 10000;
    }
    
    .feature-toggle:hover .tooltip {
        display: block;
    }
        
        `);

    const windowHTML = `
        <div id="my-window">
            <div class="header">
                <span>AI答题(Alt+Z 快速隐藏)</span>
                <button id="hide-btn">×</button>
            </div>
            <div class="xxt-content">
                <div class="question-section">
                    <div class="label">当前题目：</div>
                    <div id="question"></div>
                </div>
                <div class="answer-section">
                    <div class="label">答案：</div>
                    <div id="answer"></div>
                </div>
                <div class="controls">
                    <div class="settings-row">
                        <label class="mcheckbox"><input type="checkbox" id="use-tiku" checked> 使用题库</label>
                        <label class="mcheckbox"><input type="checkbox" id="need-analysis"> 需要解析</label>
                        <select id="ai-model">
                            <option value="">加载中...</option>
                        </select>
                    </div>
                    <div class="button-row">
                        <button id="prev-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button id="next-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                        <button id="refresh-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                class="mr-1">
                                <path d="M21 12a9 9 0 11-9-9 9 9 0 019 9z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                            获取答案
                        </button>
                        <button id="copy-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                class="mr-1">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                            复制答案
                        </button>
                    </div>
                    <div class="subscription-row">
                        <input type="text" id="subscription-key" placeholder="请输入订阅链接">
                        <button id="save-btn">保存订阅</button>
                    </div>
                    <div class="features-section">
        <div class="label">功能开关：</div>
        <div class="feature-toggles">
            <label class="feature-toggle">
                <input type="checkbox" id="paste-toggle" checked>
                <span class="toggle-label">允许粘贴</span>
                <span class="tooltip">启用后可以在页面中自由粘贴内容</span>
            </label>
            <label class="feature-toggle">
                <input type="checkbox" id="copy-toggle" checked>
                <span class="toggle-label">光标处复制</span>
                <span class="tooltip">启用后可以使用Ctrl+C复制光标位置处的文本</span>
            </label>
            <label class="feature-toggle">
                <input type="checkbox" id="watermark-toggle" checked>
                <span class="toggle-label">移除水印</span>
                <span class="tooltip">移除页面上的水印遮罩</span>
            </label>
        </div>
    </div>
                    <div class="status-info-row">
                        <div class="status" id="card_status">状态内容</div>
                        <div class="info">by: cwyu</div>
                    </div>
                </div>
            </div>
        </div>
        <div id="floating-button">显示</div>
    `;

    document.body.insertAdjacentHTML('beforeend', windowHTML);

    const myWindow = document.getElementById('my-window');
    const floatingButton = document.getElementById('floating-button');
    const hideBtn = document.getElementById('hide-btn');
    const header = document.querySelector('.header');
    const answerEl = document.getElementById('answer');
    const questionEl = document.getElementById('question');
    const subscriptionKey = document.getElementById('subscription-key');

    let answerCache = {};
    let currentIndex = 0;
    let timu = ["正在获取题目"];

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'z') {
            toggleWindow();
        }
    });
    
    hideBtn.addEventListener('click', toggleWindow);
    floatingButton.addEventListener('click', toggleWindow);

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateDisplay(currentIndex);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentIndex < timu.length - 1) {
            currentIndex++;
            updateDisplay(currentIndex);
        }
    });

    document.getElementById('refresh-btn').addEventListener('click', fetchAnswer);

    document.getElementById('copy-btn').addEventListener('click', () => {
        const answerText = answerEl.textContent;
        navigator.clipboard.writeText(answerText)
            .catch(err => console.error('复制失败:', err));
    });

    document.getElementById('save-btn').addEventListener('click', saveSubscriptionKey);

    questionEl.addEventListener("dblclick", editQuestion);

    async function loadModels() {
      try {
        const response = await fetch("https://xxt.uycc.xyz/api/v1/models");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const selectElement = document.getElementById("ai-model");
        selectElement.innerHTML = ""; 

        data.models.forEach((model) => {
          const option = document.createElement("option");
          option.value = model.modelName;
          option.textContent = model.title;
          selectElement.appendChild(option);
        });
      } catch (error) {
        console.error("Failed to load models:", error);
        const selectElement = document.getElementById("ai-model");
        selectElement.innerHTML = '<option value="">加载模型失败</option>';
      }
    }


    loadModels();

    const savedKey = GM_getValue("subscription_key");
    if (savedKey) {
      subscriptionKey.value = savedKey;
      checkSerial(savedKey);
    }

    floatingButton.style.display = "none";

    function initializeFeatures() {
        const features = {
            paste: GM_getValue('feature_paste', true),
            copy: GM_getValue('feature_copy', true),
            watermark: GM_getValue('feature_watermark', false)
        };
    

        document.getElementById('paste-toggle').checked = features.paste;
        document.getElementById('copy-toggle').checked = features.copy;
        document.getElementById('watermark-toggle').checked = features.watermark;

        applyFeatures(features);

        document.getElementById('paste-toggle').addEventListener('change', (e) => {
            features.paste = e.target.checked;
            GM_setValue('feature_paste', features.paste);
            applyFeatures(features);
        });
    
        document.getElementById('copy-toggle').addEventListener('change', (e) => {
            features.copy = e.target.checked;
            GM_setValue('feature_copy', features.copy);
            applyFeatures(features);
        });
    
        document.getElementById('watermark-toggle').addEventListener('change', (e) => {
            features.watermark = e.target.checked;
            GM_setValue('feature_watermark', features.watermark);
            applyFeatures(features);
        });
    }
    
    function applyFeatures(features) {

        if (features.paste) {
            enablePasteFeature();
        }

        if (features.copy) {
            enableCopyFeature();
        } else {
            disableCopyFeature();
        }

        if (features.watermark) {
            removeWatermarks();
        } else {
            restoreWatermarks();
        }
    }
    
    function enablePasteFeature() {
        let script = document.createElement('script');
        script.textContent = `
            function editorPaste() {
                return true;
            }
            function _0x4b84e4() {
                return;
            }
        `;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }
    
    let copyFeatureEnabled = false;
    let mouseMoveListener = null;
    let keydownListener = null;
    
    function enableCopyFeature() {
        if (copyFeatureEnabled) return;
        
        let mouseX = 0;
        let mouseY = 0;
    
        mouseMoveListener = function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
    
        keydownListener = function(e) {
            if (e.ctrlKey && e.key === 'c') {
                let element = document.elementFromPoint(mouseX, mouseY);
                if (element) {
                    let text = element.innerText;
                    copyToClipboard(text);
                }
            }
        };
    
        document.addEventListener('mousemove', mouseMoveListener);
        document.addEventListener('keydown', keydownListener);
        document.body.onselectstart = function() { return true; };
        
        copyFeatureEnabled = true;
    }
    
    function disableCopyFeature() {
        if (!copyFeatureEnabled) return;
        
        if (mouseMoveListener) {
            document.removeEventListener('mousemove', mouseMoveListener);
        }
        if (keydownListener) {
            document.removeEventListener('keydown', keydownListener);
        }
        document.body.onselectstart = null;
        
        copyFeatureEnabled = false;
    }
    
    function copyToClipboard(text) {
        let textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
    }
    
    function removeWatermarks() {
        const watermarks = document.querySelectorAll('.mask_div');
        watermarks.forEach(watermark => {
            watermark.style.display = 'none';
        });
    }
    
    function restoreWatermarks() {
        const watermarks = document.querySelectorAll('.mask_div');
        watermarks.forEach(watermark => {
            watermark.style.display = '';
        });
    }

    if (document.title === "学生学习页面") {
        queryElements();
    }

    if (document.title == "作业作答") {
        const divs = document.querySelectorAll('.padBom50.questionLi:not(script)');
        const texts = [];
        divs.forEach(div => {
            const text = div.textContent.trim().replace(/\s+/g, ' ');
            texts.push(text);
        });
        timu = texts.map((text) =>
            text.replace(/var\s+wordNum\s*=.*$/gm, "").trim()
        );
        updateDisplay(0);
    }

    if (document.title == "整卷预览") {

initializeFeatures();
        const elements = document.querySelectorAll('div.questionLi:not(script)');
        const texts = [];
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const text = element.textContent.trim().replace(/\s+/g, ' ');
            texts.push(text);
        }
        timu = texts.map((text) =>
            text.replace(/window\.UEDITOR_CONFIG\.initialFrameWidth.*保存/g, "").trim()
        );
        updateDisplay(0);
    }

    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            const content = myWindow.querySelector('.xxt-content');
            if (content) {
                content.style.height = `${height - 40}px`;
            }
        }
    });

    resizeObserver.observe(myWindow);

    async function fetchAnswer() {
        const currentQuestion = timu[currentIndex];
        answerEl.textContent = "获取答案中...";
        
        const data = {
            serial: subscriptionKey.value,
            question: currentQuestion,
            model: document.getElementById('ai-model').value,
            use_tiku: document.getElementById('use-tiku').checked,
            have_analyze: document.getElementById('need-analysis').checked
        };

        try {
            const response = await fetch('https://xxt.uycc.xyz/api/v1/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (result.answer) {
                answerCache[currentIndex] = result.answer;
                answerEl.textContent = result.answer;
                if (result.cost===0) {
                    document.getElementById('card_status').textContent = 
                        `题库中包含此题，不花费token`;
                }
                
                if (result.cost && result.balances) {
                    document.getElementById('card_status').textContent = 
                        `本次花费: ${result.cost} | 剩余余额: ${result.balances}`;
                }
            }
        } catch (error) {
            console.error('Search API error:', error);
            try {
                const errorResponse = await error.response?.json();
                answerEl.textContent = errorResponse?.detail || "请求失败，请检查网络连接";
            } catch (e) {
                answerEl.textContent = "请求失败，请检查网络连接";
            }
        }
    }

    function updateDisplay(index) {
        questionEl.textContent = timu[index];
        answerEl.textContent = answerCache[index] || '';
    }

    async function queryElements() {
        const iframe = document.getElementById('iframe');
        if (!iframe) {
            setTimeout(queryElements, 3000);
            return;
        }
    
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const second = iframeDoc.querySelector('iframe');
        if (!second) {
            setTimeout(queryElements, 3000);
            return;
        }
    
        const secondDoc = second.contentDocument || second.contentWindow.document;
        const third = secondDoc.getElementById('frame_content');
        if (!third) {
            setTimeout(queryElements, 3000);
            return;
        }
    
        const thirdDoc = third.contentDocument || third.contentWindow.document;
        const elements = thirdDoc.querySelectorAll('div.TiMu:not(script)');
        if (elements.length > 0) {
            const texts = [];
            elements.forEach(element => {
                const text = element.textContent.trim().replace(/\s+/g, ' ');
                texts.push(text);
            });
            
            const styles = thirdDoc.querySelectorAll('style[type="text/css"]');
            let fontBase64 = null;
            
            for (const style of styles) {
                const content = style.textContent;
                const match = content.match(/data:application\/font-ttf;charset=utf-8;base64,([^'")]+)/);
                if (match && match[1]) {
                    fontBase64 = match[1];
                    break;
                }
            }
    
            timu = texts.map((text) =>
                text
                    .replace(/var\s+wordNum\s*=.*$/gm, "")
                    .replace(/点击上传x[^}]*}/gm, "")
                    .replace(/填写答案[^x]*x/gm, "")
                    .trim()
            );
            await decrypt(fontBase64);
        } else {
            setTimeout(queryElements, 3000);
        }
    }

    async function decrypt(b64) {
        const data = { 
            text: timu,
            b64: b64
        };
        try {
            const response = await fetch("https://xxt.uycc.xyz/api/v1/decrypt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            timu = result.text;
            updateDisplay(0);
        } catch (error) {
            console.error('Decrypt API error:', error);
            answerEl.textContent = "解密失败，请稍后重试";
        }
    }

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === header) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            myWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

function dragEnd() {
    isDragging = false;
}

function toggleWindow() {
    if (myWindow.style.display === 'none') {
        myWindow.style.display = 'block';
        floatingButton.style.display = 'none';
    } else {
        myWindow.style.display = 'none';
        floatingButton.style.display = 'block';
    }
}


async function saveSubscriptionKey() {
    const key = subscriptionKey.value;
    GM_setValue('subscription_key', key);

    const data = { serial: key };
    try {
        const response = await fetch('https://xxt.uycc.xyz/api/v1/serial/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        document.getElementById('card_status').textContent = "可用的token余额：" + result.balances;
    } catch (error) {
        console.error('Serial check API error:', error);
        document.getElementById('card_status').textContent = "卡密验证失败，请检查卡密是否正确";
    }
}

async function checkSerial(serial) {
    const data = { serial: serial };
    try {
        const response = await fetch('https://xxt.uycc.xyz/api/v1/serial/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        document.getElementById('card_status').textContent = "可用的token余额：" + result.balances;
    } catch (error) {
        console.error('Serial check API error:', error);
        document.getElementById('card_status').textContent = "卡密验证失败，请检查卡密是否正确";
    }
}

function editQuestion(e) {
    e.preventDefault();
    
    const editableDiv = document.createElement('div');
    editableDiv.setAttribute('contenteditable', true);
    editableDiv.textContent = questionEl.textContent;
    editableDiv.style.background = '#fff';
    editableDiv.style.padding = '4px';
    editableDiv.style.border = '1px solid #3b82f6';
    editableDiv.style.borderRadius = '4px';
    editableDiv.style.minHeight = '50px';

    questionEl.replaceWith(editableDiv);
    editableDiv.focus();

    function saveEdit() {
        timu[currentIndex] = editableDiv.textContent;
        questionEl.textContent = editableDiv.textContent;
        editableDiv.replaceWith(questionEl);
    }

    editableDiv.addEventListener('blur', saveEdit);
    editableDiv.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
        }
    });
}
})();