// ==UserScript==
// @name         浏览器文本阅读
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  选中文本进行朗读，支持拖动、最小化、倍速、音调调整及重复播放（可自定义次数）
// @author       Songmile
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523075/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%96%87%E6%9C%AC%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/523075/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%96%87%E6%9C%AC%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

 
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.background = 'rgba(30, 30, 30, 0.95)';
    panel.style.color = 'white';
    panel.style.padding = '15px';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    panel.style.zIndex = '9999';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.width = '300px';
    panel.style.cursor = 'move'; 
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>文本朗读控制面板</strong>
            <button id="minimizeBtn" style="background: transparent; border: none; color: white; font-size: 18px; cursor: pointer;">&#x2212;</button>
        </div>
        <div id="controls" style="margin-top: 10px;">
            <button id="playBtn" style="margin: 5px; padding: 5px 10px; background-color: #28a745; border: none; border-radius: 5px; color: white; cursor: pointer;">播放</button>
            <button id="pauseBtn" style="margin: 5px; padding: 5px 10px; background-color: #ffc107; border: none; border-radius: 5px; color: white; cursor: pointer;">暂停</button>
            <button id="stopBtn" style="margin: 5px; padding: 5px 10px; background-color: #dc3545; border: none; border-radius: 5px; color: white; cursor: pointer;">停止</button>
            <button id="replayBtn" style="margin: 5px; padding: 5px 10px; background-color: #17a2b8; border: none; border-radius: 5px; color: white; cursor: pointer;">重复播放</button>
            <div style="margin-top: 10px;">
                <label for="repeatCount">重复次数: </label>
                <input type="number" id="repeatCount" min="1" max="100" value="1" style="width: 60px;">
            </div>
            <br>
            <div style="margin-top: 10px;">
                <label for="rate">语速: </label>
                <input type="range" id="rate" min="0.5" max="2" step="0.1" value="1">
                <span id="rateValue">1</span>x
            </div>
            <div style="margin-top: 10px;">
                <label for="pitch">音调: </label>
                <input type="range" id="pitch" min="0" max="2" step="0.1" value="1">
                <span id="pitchValue">1</span>
            </div>
            <br>
            <small>选中文本后点击播放或重复播放</small>
        </div>
    `;
    document.body.appendChild(panel);


    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const replayBtn = document.getElementById('replayBtn');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const controlsDiv = document.getElementById('controls');
    const rateSlider = document.getElementById('rate');
    const pitchSlider = document.getElementById('pitch');
    const rateValue = document.getElementById('rateValue');
    const pitchValue = document.getElementById('pitchValue');
    const repeatCountInput = document.getElementById('repeatCount');


    let utterance = null;
    let isPaused = false;
    let lastText = ''; 
    let repeatTimes = 1;
    let remainingRepeats = 1;


    rateSlider.addEventListener('input', () => {
        rateValue.textContent = rateSlider.value;
        if (utterance) {
            utterance.rate = parseFloat(rateSlider.value);
        }
    });


    pitchSlider.addEventListener('input', () => {
        pitchValue.textContent = pitchSlider.value;
        if (utterance) {
            utterance.pitch = parseFloat(pitchSlider.value);
        }
    });


    repeatCountInput.addEventListener('input', () => {
        let value = parseInt(repeatCountInput.value, 10);
        if (isNaN(value) || value < 1) {
            repeatCountInput.value = 1;
            value = 1;
        } else if (value > 100) { 
            repeatCountInput.value = 100;
            value = 100;
        }
        repeatTimes = value;
    });

 
    playBtn.addEventListener('click', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            lastText = selectedText; 
            remainingRepeats = repeatTimes;
            startReading(selectedText);
        } else if (lastText) {
            // 如果没有选中文本，但有上一次播放的文本，则播放上一次的文本
            remainingRepeats = repeatTimes;
            startReading(lastText);
        } else {
            alert('请先选中文本再播放！');
        }
    });

    // 重复播放
    replayBtn.addEventListener('click', () => {
        if (lastText) {
            remainingRepeats = repeatTimes;
            startReading(lastText);
        } else {
            alert('没有可重复播放的文本！');
        }
    });

    // 暂停朗读
    pauseBtn.addEventListener('click', () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
            isPaused = true;
        } else if (speechSynthesis.paused) {
            speechSynthesis.resume();
            isPaused = false;
        }
    });

    // 停止朗读
    stopBtn.addEventListener('click', () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            isPaused = false;
            utterance = null;
        }
    });

    // 最小化面板
    minimizeBtn.addEventListener('click', () => {
        if (controlsDiv.style.display === 'none') {
            controlsDiv.style.display = 'block';
            minimizeBtn.innerHTML = '&#x2212;'; // －符号
        } else {
            controlsDiv.style.display = 'none';
            minimizeBtn.innerHTML = '&#x2b;'; // ＋符号
        }
    });

    // 使面板可拖动
    let isDragging = false;
    let offsetX, offsetY;

    panel.addEventListener('mousedown', (e) => {
        if (
            e.target.id === 'minimizeBtn' ||
            e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'LABEL' ||
            e.target.tagName === 'SPAN'
        ) {
            return; // 不触发拖动事件
        }
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            panel.style.cursor = 'move';
        }
    });

    // 开始朗读文本
    function startReading(text) {
        // 如果正在朗读，先停止
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        // 开始新的朗读
        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN'; // 设置语言，可以改为 'en-US'
        utterance.rate = parseFloat(rateSlider.value); // 语速
        utterance.pitch = parseFloat(pitchSlider.value); // 音调

        utterance.onend = function () {
            remainingRepeats--;
            if (remainingRepeats > 0) {
                // 使用 setTimeout 确保前一个朗读结束后再开始新的
                setTimeout(() => {
                    startReading(text);
                }, 500);
            }
        };

        speechSynthesis.speak(utterance);
    }



    rateSlider.addEventListener('change', () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            restartUtterance();
        }
    });

    pitchSlider.addEventListener('change', () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            restartUtterance();
        }
    });

    function restartUtterance() {
        if (utterance) {
            const currentText = utterance.text;
            speechSynthesis.cancel();
            utterance = null;
            startReading(currentText);
        }
    }

})();
