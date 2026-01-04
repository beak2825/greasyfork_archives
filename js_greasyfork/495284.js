// ==UserScript==
// @name         OpenAI TTS API Converter
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  调用第三方站点api将选中的文本或输入的文本转换为语音并下载
// @author       finch
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495284/OpenAI%20TTS%20API%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/495284/OpenAI%20TTS%20API%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载 Font Awesome CSS
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    // 获取用户配置
    function getUserConfig() {
        return {
            bearerToken: localStorage.getItem('tts_bearerToken') || '',
            postUrl: localStorage.getItem('tts_postUrl') || '',
            model: localStorage.getItem('tts_model') || '',
            voice: localStorage.getItem('tts_voice') || ''
        };
    }

    // 设置用户配置
    function setUserConfig(config) {
        localStorage.setItem('tts_bearerToken', config.bearerToken);
        localStorage.setItem('tts_postUrl', config.postUrl);
        localStorage.setItem('tts_model', config.model);
        localStorage.setItem('tts_voice', config.voice);
    }

    // 创建设置对话框
    function createSettingsDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        dialog.style.zIndex = 10000;
        dialog.style.display = 'none';
        dialog.style.borderRadius = '8px';
        dialog.style.maxWidth = '400px';
        dialog.style.width = '100%';

        const config = getUserConfig();

        const title = document.createElement('h2');
        title.textContent = '设置 TTS API 配置';
        title.style.marginTop = '0';
        title.style.marginBottom = '20px';
        title.style.textAlign = 'center';
        dialog.appendChild(title);

        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '10px';

        const createInputField = (labelText, inputValue) => {
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.fontWeight = 'bold';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = inputValue;
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';
            label.appendChild(input);
            return { label, input };
        };

        const bearerTokenField = createInputField('Bearer 令牌:', config.bearerToken);
        const postUrlField = createInputField('POST URL:', config.postUrl);
        const modelField = createInputField('模型名称:', config.model);
        const voiceField = createInputField('声音名称:', config.voice);

        form.appendChild(bearerTokenField.label);
        form.appendChild(postUrlField.label);
        form.appendChild(modelField.label);
        form.appendChild(voiceField.label);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '10px 20px';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            setUserConfig({
                bearerToken: bearerTokenField.input.value,
                postUrl: postUrlField.input.value,
                model: modelField.input.value,
                voice: voiceField.input.value
            });
            dialog.style.display = 'none';
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.backgroundColor = '#f44336';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            dialog.style.display = 'none';
        });

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        form.appendChild(buttonContainer);

        // 添加测试按钮
        const testButton = document.createElement('button');
        testButton.textContent = '点此测试服务';
        testButton.style.marginTop = '10px';
        testButton.style.backgroundColor = '#2196F3';
        testButton.style.color = 'white';
        testButton.style.border = 'none';
        testButton.style.padding = '10px 20px';
        testButton.style.borderRadius = '4px';
        testButton.style.cursor = 'pointer';
        testButton.addEventListener('click', (e) => {
            e.preventDefault();
            testTTSAPI();
        });

        form.appendChild(testButton);

        dialog.appendChild(form);
        document.body.appendChild(dialog);
        return dialog;
    }

    const settingsDialog = createSettingsDialog();

    // 配置菜单
    GM_registerMenuCommand('设置 TTS API 配置', () => {
        settingsDialog.style.display = 'block';
    });

    // 测试 TTS API
    function testTTSAPI() {
        const config = getUserConfig();
        const data = {
            model: config.model,
            input: 'Hello, world',
            voice: config.voice
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: config.postUrl,
            headers: {
                'Authorization': `Bearer ${config.bearerToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    alert('TTS API 连通性测试成功！');
                } else {
                    alert('TTS API 连通性测试失败，请检查配置。');
                }
            }
        });
    }

    // 将文本转换为语音并下载
    function convertTextToSpeech(text, download = false) {
        const config = getUserConfig();
        const data = {
            model: config.model,
            input: text,
            voice: config.voice
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: config.postUrl,
            headers: {
                'Authorization': `Bearer ${config.bearerToken}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    const url = URL.createObjectURL(response.response);
                    if (download) {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = url;
                        downloadLink.download = 'tts_audio.mp3'; // 默认文件名
                        downloadLink.click();
                    } else {
                        const audio = new Audio(url);
                        audio.play();
                        // 显示下载按钮
                        downloadButton.style.display = 'block';
                        downloadButton.onclick = () => {
                            const downloadLink = document.createElement('a');
                            downloadLink.href = url;
                            downloadLink.download = 'tts_audio.mp3';
                            downloadLink.click();
                        };
                    }
                } else {
                    console.error(`请求失败，状态码：${response.status}`);
                }
            }
        });
    }

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.zIndex = 1000;
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px'; // 按钮间距
    buttonContainer.style.display = 'none'; // 初始隐藏
    document.body.appendChild(buttonContainer);

    // 按钮样式
    const buttonStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.5em',
        color: 'white'
    };

    // 创建转换语音按钮
    const playButton = document.createElement('button');
    playButton.innerHTML = '<i class="fas fa-play"></i>'; // 使用 Font Awesome 播放图标
    Object.assign(playButton.style, buttonStyle, { backgroundColor: '#4CAF50' });
    playButton.addEventListener('click', () => {
        const selection = window.getSelection();
        const text = selection.toString();
        if (text) {
            convertTextToSpeech(text);
        } else {
            alert('没有选中文本');
        }
    });
    buttonContainer.appendChild(playButton);

    // 创建下载按钮
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = '<i class="fas fa-download"></i>'; // 使用 Font Awesome 下载图标
    Object.assign(downloadButton.style, buttonStyle, { backgroundColor: '#2196F3' });
    downloadButton.style.display = 'none'; // 初始隐藏
    buttonContainer.appendChild(downloadButton);

    // 创建输入文本按钮
    const inputButton = document.createElement('button');
    inputButton.innerHTML = '<i class="fas fa-file-alt"></i>'; // 使用 Font Awesome 纸张图标
    Object.assign(inputButton.style, buttonStyle, { backgroundColor: '#FF9800' });
    inputButton.addEventListener('click', () => {
        inputDialog.style.display = 'block';
    });
    buttonContainer.appendChild(inputButton);

    // 创建文本输入框页面
    const inputDialog = document.createElement('div');
    inputDialog.style.position = 'fixed';
    inputDialog.style.top = '50%';
    inputDialog.style.left = '50%';
    inputDialog.style.transform = 'translate(-50%, -50%)';
    inputDialog.style.backgroundColor = 'white';
    inputDialog.style.padding = '20px';
    inputDialog.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    inputDialog.style.zIndex = 10000;
    inputDialog.style.display = 'none';
    inputDialog.style.borderRadius = '8px';
    inputDialog.style.maxWidth = '400px';
    inputDialog.style.width = '100%';

    const inputTitle = document.createElement('h2');
    inputTitle.textContent = '输入文本进行转换';
    inputTitle.style.marginTop = '0';
    inputTitle.style.marginBottom = '20px';
    inputTitle.style.textAlign = 'center';
    inputDialog.appendChild(inputTitle);

    const inputText = document.createElement('input');
    inputText.type = 'text';
    inputText.placeholder = '输入文本';
    inputText.style.padding = '10px';
    inputText.style.border = '1px solid #ccc';
    inputText.style.borderRadius = '4px';
    inputText.style.width = '100%';
    inputText.style.marginBottom = '20px';
    inputDialog.appendChild(inputText);

    const inputButtonContainer = document.createElement('div');
    inputButtonContainer.style.display = 'flex';
    inputButtonContainer.style.justifyContent = 'space-between';

    const playInputButton = document.createElement('button');
    playInputButton.textContent = '播放';
    playInputButton.style.backgroundColor = '#4CAF50';
    playInputButton.style.color = 'white';
    playInputButton.style.border = 'none';
    playInputButton.style.padding = '10px 20px';
    playInputButton.style.borderRadius = '4px';
    playInputButton.style.cursor = 'pointer';
    playInputButton.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (text) {
            convertTextToSpeech(text);
        } else {
            alert('请输入文本');
        }
    });

    const inputDownloadButton = document.createElement('button');
    inputDownloadButton.textContent = '下载';
    inputDownloadButton.style.backgroundColor = '#4CAF50';
    inputDownloadButton.style.color = 'white';
    inputDownloadButton.style.border = 'none';
    inputDownloadButton.style.padding = '10px 20px';
    inputDownloadButton.style.borderRadius = '4px';
    inputDownloadButton.style.cursor = 'pointer';
    inputDownloadButton.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (text) {
            convertTextToSpeech(text, true);
        } else {
            alert('请输入文本');
        }
    });

    const cancelInputButton = document.createElement('button');
    cancelInputButton.textContent = '取消';
    cancelInputButton.style.backgroundColor = '#f44336';
    cancelInputButton.style.color = 'white';
    cancelInputButton.style.border = 'none';
    cancelInputButton.style.padding = '10px 20px';
    cancelInputButton.style.borderRadius = '4px';
    cancelInputButton.style.cursor = 'pointer';
    cancelInputButton.addEventListener('click', () => {
        inputDialog.style.display = 'none';
    });

    inputButtonContainer.appendChild(playInputButton);
    inputButtonContainer.appendChild(inputDownloadButton);
    inputButtonContainer.appendChild(cancelInputButton);
    inputDialog.appendChild(inputButtonContainer);
    document.body.appendChild(inputDialog);

    // 监听文本选择事件
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                buttonContainer.style.top = `${rect.bottom + window.scrollY}px`;
                buttonContainer.style.left = `${rect.right + window.scrollX}px`;
                buttonContainer.style.display = 'flex';
            } else {
                buttonContainer.style.display = 'none';
                downloadButton.style.display = 'none'; // 隐藏下载按钮
            }
        } else {
            buttonContainer.style.display = 'none';
            downloadButton.style.display = 'none'; // 隐藏下载按钮
        }
    });
})();