// ==UserScript==
// @name         OpenAI TTS Text Reader
// @namespace    http://tampermonkey.net/
// @version      2.6.2
// @description  Read selected text with OpenAI's TTS API and adjustable volume and speed.Please enter the apikey before using.
// @description:zh-CN 使用openai的tts-1阅读选定的文本。使用前请填入apikey
// @description:ja OpenAI‐TTS‐1を使用して選択したテキストを読む。使用する前にapikeyを入力してください
// @include      *
// @author       wkf16
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// @antifeature cross-domain This script makes cross-domain API calls to OpenAI's TTS service, which may have implications for data security and privacy.
// @downloadURL https://update.greasyfork.org/scripts/480382/OpenAI%20TTS%20Text%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/480382/OpenAI%20TTS%20Text%20Reader.meta.js
// ==/UserScript==
var YOUR_API_KEY = "sk-"; // 使用您的API密钥
(function() {
    'use strict';
    var currentSource = null;
    var isPlaying = false;
    var audioContext = new AudioContext();
    var gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    var playbackRate = 1;

    // 创建按钮
    var readButton = document.createElement("button");
    styleButton(readButton);
    document.body.appendChild(readButton);

    // 创建并添加按钮文本
    var buttonText = document.createElement("span");
    buttonText.textContent = ">";
    styleButtonText(buttonText);
    readButton.appendChild(buttonText);

    // 创建控制面板
    var controlPanel = document.createElement("div");
    styleControlPanel(controlPanel);
    document.body.appendChild(controlPanel);

    // 创建并添加音量和速度滑块到控制面板

    var volumeControl = createSlider("Volume", 0, 1, 0.5, 0.01, function(value) {
        gainNode.gain.value = value;
    });
    controlPanel.appendChild(volumeControl.wrapper);
    volumeControl.slider.value = 0.5; // 设置音量滑块的初始值为中间位置
    var speedControl = createSlider("Speed\u00A0\u00A0", 0.5, 1.5, 1, 0.05, function(value) { playbackRate = value; });
    controlPanel.appendChild(speedControl.wrapper);
    speedControl.slider.value = 1; // 设置音量滑块的初始值为中间位置
    // 按钮点击事件
    readButton.addEventListener('click', function() {
        var selectedText = window.getSelection().toString();
        console.log("Setting gainNode.gain.value to: ", gainNode.gain.value);
        if (isPlaying) {
            currentSource.stop(); // 停止当前播放的音频
            HideSpinner(buttonText);
        } else{
            if (selectedText) {
                textToSpeech(selectedText);
            } else {
                alert("请先选择一些文本。");
            }
       }
    });

    // 创建和样式化控制面板和滑块
    function createSlider(labelText, min, max, value, step, onChange) {
        // 添加CSS样式到<head>
        var wrapper = document.createElement("div");
        var label = document.createElement("label");
        label.textContent = labelText;
        label.style.color = "white";
        label.style.textAlign = "left"; // 保持文字左对齐
        label.style.flex = "1"; // label会填充除了slider外的空间

        var slider = document.createElement("input");
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;

        // 设置wrapper使用Flexbox布局
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center'; // 垂直居中，但不影响文字
        wrapper.style.padding = '8px'; // 根据需要调整，为控件组添加内边距

        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
        input[type='range'] {
            -webkit-appearance: none;
            appearance: none;
            width: 90%; // 可以根据需要调整滑块的宽度
            height: 8px; /* 调整轨道高度 */
            border-radius: 8px; /* 轨道边角圆滑 */
            background: rgba(255, 255, 255, 0.2); /* 轨道颜色 */
            outline: none;
            margin-left: 10px; // 为了与label对齐，可以根据需要调整
        }

        input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px; /* 把手宽度 */
            height: 16px; /* 把手高度 */
            border-radius: 50%; /* 把手为圆形 */
            background: #4CAF50; /* 把手颜色 */
            cursor: pointer;
            box-shadow: 0 0 2px #888; /* 把手阴影 */
        }

        input[type='range']:focus::-webkit-slider-thumb {
            background: #ccc; /* 把手聚焦时的颜色 */
        }
    `;
        document.head.appendChild(styleSheet);

        // 创建滑块元素
        slider.oninput = function() {
            onChange(this.value);
        };

        wrapper.appendChild(label);
        wrapper.appendChild(slider);

        console.log("Setting volume to: ", value);
        return { wrapper: wrapper, slider: slider };
    }
    // 设置控制面板样式
    function styleControlPanel(panel) {
        panel.style.position = 'fixed';
        panel.style.bottom = '20px'; // 与按钮底部对齐
        panel.style.right = '80px'; 
        panel.style.width = '200px';
        panel.style.background = 'rgba(0, 0, 0, 0.7)';
        panel.style.borderRadius = '10px';
        panel.style.padding = '10px';
        panel.style.boxSizing = 'border-box';
        panel.style.visibility = 'hidden';
        panel.style.opacity = 0;
        panel.style.transition = 'opacity 0.5s, visibility 0.5s';
        panel.style.display = 'flex'; // 使用flex布局
        panel.style.flexDirection = 'column'; // 确保子元素垂直排列
        panel.style.zIndex = '10000';
    }

    // 设置按钮样式
    function styleButton(button) {
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.width = '40px'; // 按钮宽度
        button.style.height = '40px'; // 按钮高度
        button.style.borderRadius = '50%'; // 圆形按钮
        button.style.backgroundColor = '#4CAF50';
        button.style.border = 'none'; // 确保没有边界
        button.style.outline = 'none'; // 确保没有轮廓
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s, opacity 0.4s ease';
}

    function styleButtonText(text) {
        text.style.transition = 'opacity 0.4s ease';
        text.style.opacity = '1';
        text.style.fontSize = "20px";
        text.style.textAlign = "center"; // 文本居中
        text.style.lineHeight = "40px"; // 设置行高以垂直居中文本
    }

function createVoiceSelect() {
    var selectWrapper = document.createElement("div");
    var select = document.createElement("select");
    var voices = ["nova", "onyx", "alloy", "echo", "fable", "shimmer"];

    for (var i = 0; i < voices.length; i++) {
        var option = document.createElement("option");
        option.value = voices[i];
        option.textContent = voices[i].charAt(0).toUpperCase() + voices[i].slice(1);
        select.appendChild(option);
    }

    selectWrapper.appendChild(select);
    styleSelect(selectWrapper, select);
    return { wrapper: selectWrapper, select: select };
}

// 样式化下拉菜单
function styleSelect(wrapper, select) {
    wrapper.style.padding = '5px';
    wrapper.style.marginBottom = '10px';

    select.style.width = '100%';
    select.style.padding = '8px 10px';
    select.style.borderRadius = '8px';
    select.style.background = 'rgba(0, 0, 0, 0.7)'; // 调整背景为稍微透明的黑色
    select.style.border = '2px solid #4CAF50'; // 添加绿色边框
    select.style.color = 'white'; // 白色字体
    select.style.fontFamily = 'Arial, sans-serif';
    select.style.fontSize = '14px';

    // 悬停效果
    select.onmouseover = function() {
        this.style.backgroundColor = 'rgba(50, 50, 50, 50.5)';
    };

    // 鼠标离开效果
    select.onmouseout = function() {
        this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    };

    // 聚焦效果
    select.onfocus = function() {
        this.style.outline = 'none';
        this.style.boxShadow = '0 0 5px rgba(81, 203, 238, 1)';
    };
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
        select {
            /* 为 select 元素本身设置样式 */
        }

        select option {
            background: rgba(0, 0, 0, 0.7); /* 选项背景设置为半透明黑色 */
            color: white; /* 文字颜色设置为白色 */
        }

        select option:hover {
            background: rgba(0, 0, 0, 0.7); /* 悬浮时为半透明白色 */
        }
    `;
        document.head.appendChild(styleSheet);
}

    // 将音色选择下拉菜单添加到控制面板
    var voiceSelect = createVoiceSelect();
    controlPanel.appendChild(voiceSelect.wrapper);
function textToSpeech(s) {
    var sModelId = "tts-1";
    var sVoiceId = voiceSelect.select.value;
    var API_KEY = YOUR_API_KEY

    ShowSpinner(buttonText); // 显示加载指示器

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.openai.com/v1/audio/speech",
        headers: {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
        },
        data: JSON.stringify({
            model: sModelId,
            input: s,
            voice: sVoiceId,
            speed: playbackRate // 添加speed属性，使用全局变量playbackRate的值
        }),
        responseType: "arraybuffer",

        onload: function(response) {
            if (response.status === 200) {
                HideSpinner(buttonText);
                audioContext.decodeAudioData(response.response, function(buffer) {
                    var source = audioContext.createBufferSource();
                    source.buffer = buffer;
                    source.connect(gainNode);
                    source.start(0);
                    currentSource = source; // 保存新的音频源
                    isPlaying = true;
                    StopSpinner(buttonText); // 更新按钮文本

                    // 监听音频结束事件
                    source.onended = function() {
                        isPlaying = false;
                        //currentSource = null;
                        HideSpinner(buttonText);
                    } // 更新按钮文本
                }, function(e) {
                    console.error("Error decoding audio data: ", e);
                });
            } else {
                HideSpinner(buttonText);
                console.error("Error loading TTS: ", response.status);
            }
        },
        onerror: function(error) {
            HideSpinner(buttonText);
            console.error("GM_xmlhttpRequest error: ", error);
        }
    });
}



    // 设置延迟显示和隐藏控制面板的时间（以毫秒为单位）
    var panelDisplayDelay = 700; // 700毫秒
    var panelHideDelay = 500; // 隐藏延迟时间
    var showPanelTimeout, hidePanelTimeout;

    // 鼠标悬停在按钮上时延迟显示控制面板
    readButton.addEventListener('mouseenter', function() {
        readButton.style.backgroundColor = '#45a049';
        clearTimeout(hidePanelTimeout); // 取消之前的隐藏计时器（如果有）
        showPanelTimeout = setTimeout(function() {
            controlPanel.style.visibility = 'visible';
            controlPanel.style.opacity = 1;
        }, panelDisplayDelay);
    });

    // 鼠标离开按钮时延迟隐藏控制面板
    readButton.addEventListener('mouseleave', function() {
        readButton.style.backgroundColor = '#4CAF50';
        clearTimeout(showPanelTimeout); // 取消之前的显示计时器（如果有）
        hidePanelTimeout = setTimeout(function() {
            controlPanel.style.visibility = 'hidden';
            controlPanel.style.opacity = 0;
        }, panelHideDelay);
    });

    // 鼠标在控制面板上时保持显示状态
    controlPanel.addEventListener('mouseenter', function() {
        clearTimeout(hidePanelTimeout); // 取消隐藏计时器
        controlPanel.style.visibility = 'visible';
        controlPanel.style.opacity = 1;
    });

    // 鼠标离开控制面板时延迟隐藏
    controlPanel.addEventListener('mouseleave', function() {
        hidePanelTimeout = setTimeout(function() {
            controlPanel.style.visibility = 'hidden';
            controlPanel.style.opacity = 0;
        }, panelHideDelay);
    });
    speedControl.slider.addEventListener('input', function() {
        playbackRate = this.value;
    });
function ShowSpinner(text) {
    text.style.opacity = '0';
    setTimeout(function() {
        text.textContent = "...";
        text.style.opacity = '1';
    }, 400); // 等待与 transition 时间一致
    readButton.disabled = true; // 禁用按钮以防止重复点击
}

function HideSpinner(text) {
    text.style.opacity = '0';
    setTimeout(function() {
        text.textContent = ">";
        text.style.opacity = '1';
    }, 400); // 等待与 transition 时间一致
    readButton.disabled = false; //
}
function StopSpinner(text) {
    text.style.opacity = '0';
    setTimeout(function() {
        text.textContent = "│▌";
        text.style.opacity = '1';
    }, 400); // 等待与 transition 时间一致
    //readButton.disabled = false; //
}
})();
