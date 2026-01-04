// ==UserScript==
// @name         网页文本语音播放助手
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  在网页上添加浮动框，选择文本并用语音播放（支持桌面和移动设备）
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533368/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533368/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E8%AF%AD%E9%9F%B3%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 动态加载 Readability.js（带完整性校验和跨域属性）
    const readabilityScript = document.createElement('script');
    readabilityScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/readability/0.6.0/Readability.js';
    readabilityScript.integrity = 'sha512-cY9LjZzucgo2OKzTs/0J5LrG2IqeDv2CB+0JQ6O9B+J6Mu+fKZ4qI5/NxnGQq6AGx2mtsJhWLuAfBsV7gPnoZA==';
    readabilityScript.crossOrigin = 'anonymous';
    readabilityScript.referrerPolicy = 'no-referrer';
    document.head.appendChild(readabilityScript);

    // 从本地存储中获取设置或使用默认值
    let apiKey = GM_getValue('tts_api_key', '');
    let voiceOption = GM_getValue('tts_voice', 'FunAudioLLM/CosyVoice2-0.5B:anna');
    let speedValue = GM_getValue('tts_speed', 1);
    let gainValue = GM_getValue('tts_gain', 0);
    let isMinimized = GM_getValue('tts_minimized', true);
    let enableHighlight = GM_getValue('tts_enable_highlight', false);

    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 调整移动设备样式
    const boxWidth = isMobile ? '85vw' : '300px';
    const boxPosition = isMobile ? '10px' : '20px';
    const textareaHeight = isMobile ? '80px' : '100px';
    const fontSize = isMobile ? '14px' : '16px';
    const buttonPadding = isMobile ? '8px 12px' : '5px 10px';

    // 添加样式
    GM_addStyle(`
        #tts-floating-box {
            position: fixed;
            bottom: ${boxPosition};
            right: ${boxPosition};
            width: ${boxWidth};
            max-width: 90vw;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            padding: 10px;
            font-family: Arial, sans-serif;
            font-size: ${fontSize};
        }
        #tts-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        #tts-header h3 {
            margin: 0;
            font-size: ${fontSize};
        }
        #tts-header-buttons {
            display: flex;
        }
        #tts-settings, #tts-minimize {
            cursor: pointer;
            background: none;
            border: none;
            font-size: ${fontSize};
            padding: 0 5px;
        }
        #tts-text {
            width: 100%;
            height: ${textareaHeight};
            margin-bottom: 10px;
            resize: vertical;
            border: 1px solid #ddd;
            padding: 5px;
            box-sizing: border-box;
            font-size: ${fontSize};
        }
        #tts-controls {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        #tts-controls button {
            padding: ${buttonPadding};
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 5px;
            font-size: ${fontSize};
        }
        #tts-controls button:hover {
            background-color: #45a049;
        }
        #tts-stop {
            background-color: #f44336 !important;
        }
        #tts-stop:hover {
            background-color: #d32f2f !important;
        }
        #tts-translate {
            background-color: #2196F3 !important;
        }
        #tts-translate:hover {
            background-color: #0b7dda !important;
        }
        #tts-progress {
            margin-top: 10px;
            font-size: ${isMobile ? '12px' : '12px'};
        }
        #tts-minimized {
            position: fixed;
            bottom: ${boxPosition};
            right: ${boxPosition};
            width: ${isMobile ? '50px' : '40px'};
            height: ${isMobile ? '50px' : '40px'};
            background-color: #4CAF50;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            font-size: ${isMobile ? '20px' : '18px'};
        }
        #tts-settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
        }
        #tts-settings-content {
            width: ${isMobile ? '90vw' : '400px'};
            background-color: #fff;
            border-radius: 5px;
            padding: 20px;
            max-height: ${isMobile ? '80vh' : 'auto'};
            overflow-y: ${isMobile ? 'auto' : 'visible'};
        }
        #tts-settings-content h3 {
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .tts-settings-group {
            margin-bottom: 15px;
        }
        .tts-settings-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .tts-settings-group input, .tts-settings-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 3px;
            box-sizing: border-box;
            font-size: ${fontSize};
        }
        .tts-checkbox-container {
            display: flex;
            align-items: center;
        }
        .tts-checkbox-container input[type="checkbox"] {
            width: auto;
            margin-right: 10px;
        }
        .tts-slider-container {
            display: flex;
            align-items: center;
        }
        .tts-slider-container input[type="range"] {
            flex: 1;
        }
        .tts-slider-value {
            width: 40px;
            text-align: center;
            margin-left: 10px;
        }
        .tts-settings-buttons {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .tts-settings-buttons button {
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 10px;
            font-size: ${fontSize};
        }
        .tts-settings-buttons button.cancel {
            background-color: #f44336;
        }
        #tts-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            display: none;
        }
        #tts-navigation button {
            padding: ${buttonPadding};
            background-color: #FF9800;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: ${fontSize};
            width: 48%;
        }
        #tts-navigation button:hover {
            background-color: #F57C00;
        }
        .tts-highlight {
            background-color: #FFEB3B;
            color: #000;
            border-radius: 2px;
            box-shadow: 0 0 2px rgba(0,0,0,0.3);
        }
        /* 移动端特别优化 */
        @media (max-width: 768px) {
            #tts-controls {
                flex-direction: ${isMobile ? 'column' : 'row'};
            }
            #tts-controls button {
                width: ${isMobile ? '100%' : 'auto'};
                margin-bottom: 8px;
            }
        }
    `);

    // 创建浮动框
    const floatingBox = document.createElement('div');
    floatingBox.id = 'tts-floating-box';
    floatingBox.innerHTML = `
        <div id="tts-header">
            <h3>文本语音播放</h3>
            <div id="tts-header-buttons">
                <button id="tts-settings" title="设置">⚙️</button>
                <button id="tts-minimize" title="最小化">-</button>
            </div>
        </div>
        <textarea id="tts-text" placeholder="在此输入文本或从网页选择文本"></textarea>
        <div id="tts-controls">
            <button id="tts-play">播放</button>
            <button id="tts-stop">停止</button>
            <button id="tts-translate">翻译</button>
            <button id="tts-get-selection">获取选中文本</button>
        </div>
        <div id="tts-navigation">
            <button id="tts-prev">上一句</button>
            <button id="tts-next">下一句</button>
        </div>
        <div id="tts-progress"></div>
    `;
    document.body.appendChild(floatingBox);
    
    // 创建最小化后的图标
    const minimizedIcon = document.createElement('div');
    minimizedIcon.id = 'tts-minimized';
    minimizedIcon.textContent = 'TTS';
    document.body.appendChild(minimizedIcon);

    // 创建设置窗口
    const settingsModal = document.createElement('div');
    settingsModal.id = 'tts-settings-modal';
    settingsModal.innerHTML = `
        <div id="tts-settings-content">
            <h3>设置</h3>
            <div class="tts-settings-group">
                <label for="tts-api-key">API Key</label>
                <input type="text" id="tts-api-key" placeholder="请输入API Key" value="${apiKey}">
            </div>
            <div class="tts-settings-group">
                <label for="tts-voice-select">语音选择</label>
                <select id="tts-voice-select">
                    <option value="FunAudioLLM/CosyVoice2-0.5B:alex" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:alex' ? 'selected' : ''}>Alex（男声）</option>
                    <option value="FunAudioLLM/CosyVoice2-0.5B:anna" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:anna' ? 'selected' : ''}>Anna（女声）</option>
                    <option value="FunAudioLLM/CosyVoice2-0.5B:bella" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:bella' ? 'selected' : ''}>Bella（女声）</option>
                    <option value="FunAudioLLM/CosyVoice2-0.5B:benjamin" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:benjamin' ? 'selected' : ''}>Benjamin（男声）</option>
                    <option value="FunAudioLLM/CosyVoice2-0.5B:charles" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:charles' ? 'selected' : ''}>Charles（男声）</option>
                    <option value="FunAudioLLM/CosyVoice2-0.5B:claire" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:claire' ? 'selected' : ''}>Claire（女声）</option>
                    <option value="FunAudioLLM/CosyVoice2-0.5B:david" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:david' ? 'selected' : ''}>David（男声）</option>
                    <option value="FunAudioLLM/CosyVoice2-0.5B:diana" ${voiceOption === 'FunAudioLLM/CosyVoice2-0.5B:diana' ? 'selected' : ''}>Diana（女声）</option>
                </select>
            </div>
            <div class="tts-settings-group">
                <label for="tts-speed-slider">语音速度（0.25-4.0）</label>
                <div class="tts-slider-container">
                    <input type="range" id="tts-speed-slider" min="0.25" max="4" step="0.05" value="${speedValue}">
                    <span id="tts-speed-value" class="tts-slider-value">${speedValue}</span>
                </div>
            </div>
            <div class="tts-settings-group">
                <label for="tts-gain-slider">音量（-10至10）</label>
                <div class="tts-slider-container">
                    <input type="range" id="tts-gain-slider" min="-10" max="10" step="0.5" value="${gainValue}">
                    <span id="tts-gain-value" class="tts-slider-value">${gainValue}</span>
                </div>
            </div>
            <div class="tts-settings-group">
                <div class="tts-checkbox-container">
                    <input type="checkbox" id="tts-enable-highlight" ${enableHighlight ? 'checked' : ''}>
                    <label for="tts-enable-highlight">启用文本高亮和导航</label>
                </div>
            </div>
            <div class="tts-settings-buttons">
                <button id="tts-settings-cancel" class="cancel">取消</button>
                <button id="tts-settings-save">保存</button>
            </div>
        </div>
    `;
    document.body.appendChild(settingsModal);

    // 播放状态管理
    let isPlaying = false;
    let audioQueue = [];
    let currentAudio = null;
    let nextAudio = null;
    let textSegments = [];
    let currentIndex = 0;
    let translatedText = "";
    let highlightElements = [];
    let lastHighlightElement = null;

    // 根据保存的设置决定是否最小化
    if (isMinimized) {
        document.getElementById('tts-floating-box').style.display = 'none';
        document.getElementById('tts-minimized').style.display = 'flex';
    } else {
        document.getElementById('tts-floating-box').style.display = 'block';
        document.getElementById('tts-minimized').style.display = 'none';
    }

    // 根据高亮设置显示或隐藏导航按钮
    document.getElementById('tts-navigation').style.display = enableHighlight ? 'flex' : 'none';

    // 最小化和恢复功能
    document.getElementById('tts-minimize').addEventListener('click', function() {
        document.getElementById('tts-floating-box').style.display = 'none';
        document.getElementById('tts-minimized').style.display = 'flex';
        isMinimized = true;
        GM_setValue('tts_minimized', true);
    });
    
    document.getElementById('tts-minimized').addEventListener('click', function() {
        document.getElementById('tts-floating-box').style.display = 'block';
        document.getElementById('tts-minimized').style.display = 'none';
        isMinimized = false;
        GM_setValue('tts_minimized', false);
    });

    // 设置按钮事件
    document.getElementById('tts-settings').addEventListener('click', function() {
        document.getElementById('tts-settings-modal').style.display = 'flex';
    });

    // 设置窗口中的滑动条事件
    document.getElementById('tts-speed-slider').addEventListener('input', function() {
        document.getElementById('tts-speed-value').textContent = this.value;
    });

    document.getElementById('tts-gain-slider').addEventListener('input', function() {
        document.getElementById('tts-gain-value').textContent = this.value;
    });

    // 高亮复选框事件
    document.getElementById('tts-enable-highlight').addEventListener('change', function() {
        document.getElementById('tts-navigation').style.display = this.checked ? 'flex' : 'none';
    });

    // 取消和保存设置事件
    document.getElementById('tts-settings-cancel').addEventListener('click', function() {
        document.getElementById('tts-settings-modal').style.display = 'none';
    });

    document.getElementById('tts-settings-save').addEventListener('click', function() {
        // 保存设置到本地存储
        apiKey = document.getElementById('tts-api-key').value;
        voiceOption = document.getElementById('tts-voice-select').value;
        speedValue = parseFloat(document.getElementById('tts-speed-slider').value);
        gainValue = parseFloat(document.getElementById('tts-gain-slider').value);
        enableHighlight = document.getElementById('tts-enable-highlight').checked;

        GM_setValue('tts_api_key', apiKey);
        GM_setValue('tts_voice', voiceOption);
        GM_setValue('tts_speed', speedValue);
        GM_setValue('tts_gain', gainValue);
        GM_setValue('tts_enable_highlight', enableHighlight);

        // 根据高亮设置显示或隐藏导航按钮
        document.getElementById('tts-navigation').style.display = enableHighlight ? 'flex' : 'none';

        document.getElementById('tts-settings-modal').style.display = 'none';
    });

    // 导航按钮事件
    document.getElementById('tts-prev').addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            if (isPlaying) {
                stopPlayback();
                playNext();
            } else {
                highlightCurrentText();
            }
        }
    });

    document.getElementById('tts-next').addEventListener('click', function() {
        if (currentIndex < textSegments.length - 1) {
            currentIndex++;
            if (isPlaying) {
                stopPlayback();
                playNext();
            } else {
                highlightCurrentText();
            }
        }
    });

    // 点击设置窗口外部关闭窗口
    document.getElementById('tts-settings-modal').addEventListener('click', function(e) {
        if (e.target === document.getElementById('tts-settings-modal')) {
            document.getElementById('tts-settings-modal').style.display = 'none';
        }
    });

    // 修改获取选中文本的逻辑
    document.getElementById('tts-get-selection').addEventListener('click', function() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            document.getElementById('tts-text').value = selectedText;
        } else {
            // 使用 Readability.js 提取主要内容
            const mainArticle = extractMainArticle();
            if (mainArticle) {
                document.getElementById('tts-text').value = mainArticle.textContent.trim();
            } else {
                alert('未找到主要内容或 Readability.js 加载失败');
            }
        }
    });

    // 翻译按钮事件
    document.getElementById('tts-translate').addEventListener('click', function() {
        const text = document.getElementById('tts-text').value.trim();
        if (!text) {
            alert('请输入或选择文本');
            return;
        }

        if (!apiKey) {
            alert('请先在设置中配置API Key');
            document.getElementById('tts-settings-modal').style.display = 'flex';
            return;
        }

        document.getElementById('tts-progress').textContent = '正在翻译...';
        
        // 调用API进行翻译
        translateText(text, function(result) {
            if (result) {
                translatedText = result;
                document.getElementById('tts-text').value = translatedText;
                document.getElementById('tts-progress').textContent = '翻译完成';
            } else {
                document.getElementById('tts-progress').textContent = '翻译失败';
            }
        });
    });

    // 播放按钮事件
    document.getElementById('tts-play').addEventListener('click', function() {
        const text = document.getElementById('tts-text').value.trim();
        if (!text) {
            alert('请输入或选择文本');
            return;
        }

        if (!apiKey) {
            alert('请先在设置中配置API Key');
            document.getElementById('tts-settings-modal').style.display = 'flex';
            return;
        }

        if (isPlaying) {
            return;
        }

        // 清除所有高亮
        clearAllHighlights();

        isPlaying = true;
        document.getElementById('tts-progress').textContent = '准备播放...';

        // 按标点符号拆分文本，每段最多50个字
        textSegments = splitText(text);
        
        // 如果之前已经导航过，从当前位置开始播放
        // 否则从第一句开始
        if (currentIndex === undefined || currentIndex < 0) {
            currentIndex = 0;
        }

        // 开始播放
        playNext();
    });

    // 停止按钮事件
    document.getElementById('tts-stop').addEventListener('click', function() {
        stopPlayback();
    });
    
    // 翻译文本
    function translateText(text, callback) {
        const options = {
            method: 'POST',
            url: 'https://api.siliconflow.cn/v1/chat/completions',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "model": "THUDM/GLM-4-9B-0414",
                "messages": [
                    {
                        "role": "user",
                        "content":
                            `请将\"${text}\"按以下规则转换文本：
                            -请将整体内容按中文句号分隔，并翻译为中文。
                            -请将所有数字部分转换为中文可读的数字形式，比如1.23，你应该转换为一点二三，这样数字的小数点也可以用于读音。\n\n`
                    }
                ],
                "stream": false,
                "max_tokens": 1024,
                "temperature": 0.7,
                "top_p": 0.7,
                "top_k": 50,
                "frequency_penalty": 0.5,
                "n": 1,
                "response_format": {
                    "type": "text"
                }
            }),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices[0] && data.choices[0].message) {
                            callback(data.choices[0].message.content);
                        } else {
                            console.error('翻译API返回了异常的数据结构:', data);
                            callback(null);
                        }
                    } catch (e) {
                        console.error('无法解析翻译结果:', e);
                        callback(null);
                    }
                } else {
                    console.error('翻译请求失败:', response.statusText);
                    callback(null);
                }
            },
            onerror: function(error) {
                console.error('翻译API请求错误:', error);
                callback(null);
            }
        };
        
        GM_xmlhttpRequest(options);
    }

    // 根据标点符号拆分文本，优先按完整句子拆分
    function splitText(text) {
        // 主要句子结束标点
        const sentenceEnders = ['。', '！', '？', '.', '!', '?', '\n\n'];
        // 次要分隔标点（句内停顿）
        const clauseSeparators = ['，', ',', '；', ';', '：', ':', '、', '\n'];
        
        let segments = [];
        let currentText = text;
        
        // 第一步：尝试按句子结束标点拆分
        while (currentText.length > 0) {
            let sentenceEndIndex = -1;
            
            // 寻找最近的句子结束标点
            for (let punct of sentenceEnders) {
                let index = currentText.indexOf(punct);
                if (index !== -1 && (sentenceEndIndex === -1 || index < sentenceEndIndex)) {
                    sentenceEndIndex = index;
                }
            }
            
            // 如果找到句子结束标点
            if (sentenceEndIndex !== -1) {
                // 提取一个完整句子（包含结束标点）
                const sentence = currentText.substring(0, sentenceEndIndex + 1).trim();
                
                // 检查句子长度，如果超过150个字符，进一步拆分
                if (sentence.length > 150) {
                    // 按次级标点拆分长句
                    const subSegments = splitLongSentence(sentence, clauseSeparators);
                    segments = segments.concat(subSegments);
                } else if (sentence.trim()) {
                    segments.push(sentence);
                }
                
                // 移除已处理的句子
                currentText = currentText.substring(sentenceEndIndex + 1);
            } else {
                // 没有找到句子结束标点，尝试按次级标点拆分
                if (currentText.length > 100) {
                    const subSegments = splitLongSentence(currentText, clauseSeparators);
                    segments = segments.concat(subSegments);
                } else if (currentText.trim()) { 
                    segments.push(currentText.trim());
                }
                currentText = '';
            }
        }
        
        return segments;
    }
    
    // 按次级标点拆分长句
    function splitLongSentence(sentence, punctuations) {
        let segments = [];
        let currentSegment = '';
        let maxLength = 100;  // 长句子的最大长度
        
        for (let i = 0; i < sentence.length; i++) {
            currentSegment += sentence[i];
            
            // 如果遇到次级标点且当前段落已有一定长度，或当前段落过长
            if ((punctuations.includes(sentence[i]) && currentSegment.length > 20) || 
                currentSegment.length >= maxLength || 
                i === sentence.length - 1) {
                if (currentSegment.trim()) {
                    segments.push(currentSegment.trim());
                }
                currentSegment = '';
            }
        }
        
        // 处理剩余内容
        if (currentSegment.trim()) {
            segments.push(currentSegment.trim());
        }
        
        return segments;
    }

    // 播放下一段文本
    function playNext() {
        if (!isPlaying || currentIndex >= textSegments.length) {
            if (currentIndex >= textSegments.length) {
                document.getElementById('tts-progress').textContent = '播放完成';
                isPlaying = false;
            }
            return;
        }

        document.getElementById('tts-progress').textContent = `播放中 ${currentIndex + 1}/${textSegments.length}`;

        // 当前要处理的文本段
        const segment = textSegments[currentIndex];
        
        // 如果启用了高亮，先高亮当前文本
        if (enableHighlight) {
            highlightCurrentText();
        }
        
        // 转换当前文本为语音
        convertTextToSpeech(segment, function(audioData) {
            // 创建音频并播放
            const audio = new Audio(URL.createObjectURL(audioData));
            
            audio.onended = function() {
                currentIndex++;
                playNext();
            };
            
            // 存储当前音频
            currentAudio = audio;
            
            // 播放音频
            audio.play();
            
            // 如果还有下一段，预加载下一段
            if (currentIndex + 1 < textSegments.length) {
                preloadNextSegment();
            }
        });
    }

    // 高亮当前文本
    function highlightCurrentText() {
        if (!enableHighlight || currentIndex >= textSegments.length || currentIndex < 0) {
            return;
        }
        
        // 清除之前的高亮
        clearAllHighlights();
        
        const textToHighlight = textSegments[currentIndex];
        
        // 查找页面上所有文本节点
        const textNodes = findTextNodes(document.body);
        
        // 在文本节点中查找匹配的文本并高亮
        let found = false;
        
        for (let i = 0; i < textNodes.length; i++) {
            const node = textNodes[i];
            const nodeText = node.nodeValue;
            
            if (nodeText.includes(textToHighlight)) {
                const startIndex = nodeText.indexOf(textToHighlight);
                const endIndex = startIndex + textToHighlight.length;
                
                // 将文本节点分割，并用高亮元素包裹匹配文本
                const range = document.createRange();
                const textNode = node;
                
                // 分割文本节点
                if (startIndex > 0) {
                    const beforeText = nodeText.substring(0, startIndex);
                    const beforeNode = document.createTextNode(beforeText);
                    node.parentNode.insertBefore(beforeNode, node);
                }
                
                // 创建高亮元素
                const highlightSpan = document.createElement('span');
                highlightSpan.className = 'tts-highlight';
                highlightSpan.textContent = textToHighlight;
                
                // 将高亮元素插入到原始节点之前
                node.parentNode.insertBefore(highlightSpan, node);
                
                // 修改原始节点的文本
                if (endIndex < nodeText.length) {
                    node.nodeValue = nodeText.substring(endIndex);
                } else {
                    node.nodeValue = '';
                }
                
                // 存储高亮元素以便后续清除
                highlightElements.push(highlightSpan);
                
                // 记录最后创建的高亮元素
                lastHighlightElement = highlightSpan;
                
                // 滚动到高亮元素位置
                scrollToElement(highlightSpan);
                
                found = true;
                break;
            }
        }
        
        // 如果未找到匹配文本，可以尝试部分匹配
        if (!found && textToHighlight.length > 10) {
            const partialText = textToHighlight.substring(0, 10);
            
            for (let i = 0; i < textNodes.length; i++) {
                const node = textNodes[i];
                const nodeText = node.nodeValue;
                
                if (nodeText.includes(partialText)) {
                    const startIndex = nodeText.indexOf(partialText);
                    
                    // 获取可能的匹配文本
                    const possibleMatchLength = Math.min(textToHighlight.length, nodeText.length - startIndex);
                    const possibleMatch = nodeText.substring(startIndex, startIndex + possibleMatchLength);
                    
                    // 创建高亮元素
                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = 'tts-highlight';
                    highlightSpan.textContent = possibleMatch;
                    
                    // 将原始节点分割
                    if (startIndex > 0) {
                        node.parentNode.insertBefore(document.createTextNode(nodeText.substring(0, startIndex)), node);
                    }
                    
                    node.parentNode.insertBefore(highlightSpan, node);
                    
                    if (startIndex + possibleMatchLength < nodeText.length) {
                        node.nodeValue = nodeText.substring(startIndex + possibleMatchLength);
                    } else {
                        node.nodeValue = '';
                    }
                    
                    // 存储高亮元素
                    highlightElements.push(highlightSpan);
                    
                    // 记录最后创建的高亮元素
                    lastHighlightElement = highlightSpan;
                    
                    // 滚动到高亮元素位置
                    scrollToElement(highlightSpan);
                    
                    found = true;
                    break;
                }
            }
        }
    }
    
    // 查找所有文本节点
    function findTextNodes(node) {
        let textNodes = [];
        
        // 忽略脚本标签、样式标签和隐藏元素中的文本
        if (node.nodeName === 'SCRIPT' || 
            node.nodeName === 'STYLE' || 
            node.nodeName === 'NOSCRIPT' ||
            (node.style && (node.style.display === 'none' || node.style.visibility === 'hidden')) ||
            (node.id && typeof node.id === 'string' && node.id.startsWith('tts-'))) {
            return textNodes;
        }
        
        // 如果是文本节点且有内容，添加到结果中
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
            textNodes.push(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 递归处理子节点
            for (let i = 0; i < node.childNodes.length; i++) {
                const childTextNodes = findTextNodes(node.childNodes[i]);
                textNodes = textNodes.concat(childTextNodes);
            }
        }
        
        return textNodes;
    }
    
    // 清除所有高亮
    function clearAllHighlights() {
        highlightElements.forEach(element => {
            if (element && element.parentNode) {
                // 将高亮元素的内容合并到前一个或后一个文本节点，或创建新的文本节点
                const textNode = document.createTextNode(element.textContent);
                element.parentNode.replaceChild(textNode, element);
            }
        });
        
        // 安全地尝试合并相邻文本节点
        try {
            document.body.normalize();
        } catch (error) {
            console.warn('合并文本节点时出错:', error);
        }
        
        // 清空高亮元素数组
        highlightElements = [];
        lastHighlightElement = null;
    }
    
    // 滚动到元素位置
    function scrollToElement(element) {
        if (!element) return;
        
        // 计算元素的位置
        const rect = element.getBoundingClientRect();
        
        // 如果元素不在可视区域内，滚动到元素位置
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
            // 滚动到元素位置，使其在视图中间
            window.scrollTo({
                top: window.pageYOffset + rect.top - (window.innerHeight / 2),
                behavior: 'smooth'
            });
        }
    }

    // 预加载下一段音频
    function preloadNextSegment() {
        if (currentIndex + 1 < textSegments.length) {
            const nextSegment = textSegments[currentIndex + 1];
            convertTextToSpeech(nextSegment, function(audioData) {
                // 存储下一段的音频数据，以备后用
                nextAudio = {
                    blob: audioData,
                    index: currentIndex + 1
                };
            });
        }
    }

    // 停止播放
    function stopPlayback() {
        isPlaying = false;
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        
        document.getElementById('tts-progress').textContent = '已停止';
        
        // 如果启用了高亮功能，保留当前高亮但不清除
        // 这样用户可以在暂停后使用导航按钮
    }

    // 调用API将文本转换为语音
    function convertTextToSpeech(text, callback) {
        const options = {
            method: 'POST',
            url: 'https://api.siliconflow.cn/v1/audio/speech',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: "FunAudioLLM/CosyVoice2-0.5B",
                input: text,
                voice: voiceOption,
                response_format: "mp3",
                sample_rate: 32000,
                stream: false,
                speed: speedValue,
                gain: gainValue
            }),
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    callback(response.response);
                } else {
                    console.error('语音合成失败:', response.statusText);
                    document.getElementById('tts-progress').textContent = '语音合成失败';
                    isPlaying = false;
                }
            },
            onerror: function(error) {
                console.error('API请求错误:', error);
                document.getElementById('tts-progress').textContent = 'API请求错误';
                isPlaying = false;
            }
        };
        
        GM_xmlhttpRequest(options);
    }

    // 让浮动框可拖动 - 同时支持鼠标和触摸事件
    makeFloatingBoxDraggable();
    
    // 拖动功能实现 - 同时支持鼠标和触摸事件
    function makeFloatingBoxDraggable() {
        const box = document.getElementById('tts-floating-box');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.querySelector('#tts-header');
        
        // 鼠标事件
        header.onmousedown = dragMouseDown;
        
        // 触摸事件
        header.addEventListener('touchstart', dragTouchStart, { passive: false });
        
        function dragMouseDown(e) {
            // 如果点击的是最小化按钮或设置按钮，不进行拖动
            if (e.target.id === 'tts-minimize' || e.target.id === 'tts-settings') {
                return;
            }
            
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标在点击时的位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 当鼠标移动时调用elementDrag
            document.onmousemove = elementDrag;
        }
        
        function dragTouchStart(e) {
            // 如果触摸的是最小化按钮或设置按钮，不进行拖动
            if (e.target.id === 'tts-minimize' || e.target.id === 'tts-settings') {
                return;
            }
            
            e.preventDefault();
            const touch = e.touches[0];
            // 获取触摸开始的位置
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.addEventListener('touchend', closeTouchDrag, { passive: false });
            document.addEventListener('touchcancel', closeTouchDrag, { passive: false });
            document.addEventListener('touchmove', elementTouchDrag, { passive: false });
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            setBoxPosition();
        }
        
        function elementTouchDrag(e) {
            e.preventDefault();
            const touch = e.touches[0];
            // 计算新位置
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            // 设置元素的新位置
            setBoxPosition();
        }
        
        function setBoxPosition() {
            box.style.top = (box.offsetTop - pos2) + "px";
            box.style.left = (box.offsetLeft - pos1) + "px";
            box.style.right = 'auto';
            box.style.bottom = 'auto';
        }
        
        function closeDragElement() {
            // 停止鼠标移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
        
        function closeTouchDrag() {
            // 停止触摸移动
            document.removeEventListener('touchend', closeTouchDrag);
            document.removeEventListener('touchcancel', closeTouchDrag);
            document.removeEventListener('touchmove', elementTouchDrag);
        }
    }

    // 替换原有的 extractMainArticle 函数
    function extractMainArticle() {
        // 等待 Readability.js 加载完成
        if (typeof Readability === 'undefined') {
            console.error('Readability.js 未加载完成');
            return null;
        }

        try {
            // 创建 Readability 实例
            const documentClone = document.cloneNode(true);
            const readability = new Readability(documentClone);
            const article = readability.parse();

            if (article && article.textContent) {
                return {
                    textContent: article.textContent,
                    title: article.title
                };
            } else {
                console.error('未找到主要内容');
                return null;
            }
        } catch (error) {
            console.error('提取内容时出错:', error);
            return null;
        }
    }

    // // 调用函数并获取主要文章
    // const mainArticle = extractMainArticle();
    // if (mainArticle) {
    //     console.log('主要文章内容:', mainArticle.textContent);
    // } else {
    //     console.log('未找到主要文章部分');
    // }
})(); 