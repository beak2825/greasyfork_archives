// ==UserScript==
// @name         音频压缩器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  压缩
// @author       哪里有甜品哪里就有
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499676/%E9%9F%B3%E9%A2%91%E5%8E%8B%E7%BC%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499676/%E9%9F%B3%E9%A2%91%E5%8E%8B%E7%BC%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'strict';

    function createCompressor(context, gainValue, thresholdValue, ratioValue) {
        const compressor = context.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(thresholdValue, context.currentTime);
        compressor.knee.setValueAtTime(50, context.currentTime);
        compressor.ratio.setValueAtTime(ratioValue, context.currentTime);
        compressor.attack.setValueAtTime(0.003, context.currentTime);
        compressor.release.setValueAtTime(0.1, context.currentTime);

        const gainNode = context.createGain();
        gainNode.gain.setValueAtTime(gainValue, context.currentTime);

        return {compressor, gainNode};
    }

    function setupAudioCompression(gainValue, thresholdValue, ratioValue) {
        const videoElement = document.querySelector('video');

        if (!videoElement) {
            console.error('未找到视频元素');
            return;
        }

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(videoElement);

        const {compressor, gainNode} = createCompressor(audioContext, gainValue, thresholdValue, ratioValue);

        source.connect(compressor);
        compressor.connect(gainNode);
        gainNode.connect(audioContext.destination);

        console.log('音频压缩器已设置，增益:', gainValue, '阈值:', thresholdValue, '压缩比:', ratioValue);
    }

    function waitForVideo() {
        const interval = setInterval(() => {
            if (document.querySelector('video')) {
                clearInterval(interval);
                const params = loadParams();
                setupAudioCompression(params.gain, params.threshold, params.ratio);
            }
        }, 1000);
    }

    function loadParams() {
        return {
            gain: parseFloat(localStorage.getItem('audioCompressorGain')) || 1,
            threshold: parseFloat(localStorage.getItem('audioCompressorThreshold')) || -80,
            ratio: parseFloat(localStorage.getItem('audioCompressorRatio')) || 8
        };
    }

    function saveParams(gain, threshold, ratio) {
        localStorage.setItem('audioCompressorGain', gain);
        localStorage.setItem('audioCompressorThreshold', threshold);
        localStorage.setItem('audioCompressorRatio', ratio);
    }

    function createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.top = '10px';
        uiContainer.style.right = '10px';
        uiContainer.style.padding = '10px';
        uiContainer.style.backgroundColor = 'skyblue';
        uiContainer.style.border = '1px solid #ccc';
        uiContainer.style.zIndex = '1000';

        const gainLabel = document.createElement('label');
        gainLabel.textContent = `增益: ${loadParams().gain}`;
        const gainSlider = document.createElement('input');
        gainSlider.type = 'range';
        gainSlider.min = '0';
        gainSlider.max = '2';
        gainSlider.step = '0.1';
        gainSlider.value = loadParams().gain;
        gainSlider.oninput = () => {
            gainLabel.textContent = `增益: ${gainSlider.value}`;
        };

        const thresholdLabel = document.createElement('label');
        thresholdLabel.textContent = `阈值: ${loadParams().threshold}`;
        const thresholdSlider = document.createElement('input');
        thresholdSlider.type = 'range';
        thresholdSlider.min = '-100';
        thresholdSlider.max = '0';
        thresholdSlider.step = '1';
        thresholdSlider.value = loadParams().threshold;
        thresholdSlider.oninput = () => {
            thresholdLabel.textContent = `阈值: ${thresholdSlider.value}`;
        };

        const ratioLabel = document.createElement('label');
        ratioLabel.textContent = `压缩比: ${loadParams().ratio}`;
        const ratioSlider = document.createElement('input');
        ratioSlider.type = 'range';
        ratioSlider.min = '1';
        ratioSlider.max = '20';
        ratioSlider.step = '0.1';
        ratioSlider.value = loadParams().ratio;
        ratioSlider.oninput = () => {
            ratioLabel.textContent = `压缩比: ${ratioSlider.value}`;
        };

        const applyButton = document.createElement('button');
        applyButton.textContent = '应用';
        applyButton.onclick = () => {
            const gain = parseFloat(gainSlider.value);
            const threshold = parseFloat(thresholdSlider.value);
            const ratio = parseFloat(ratioSlider.value);
            saveParams(gain, threshold, ratio);
            setupAudioCompression(gain, threshold, ratio);
        };

        uiContainer.appendChild(gainLabel);
        uiContainer.appendChild(gainSlider);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(thresholdLabel);
        uiContainer.appendChild(thresholdSlider);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(ratioLabel);
        uiContainer.appendChild(ratioSlider);
        uiContainer.appendChild(document.createElement('br'));
        uiContainer.appendChild(applyButton);

        document.body.appendChild(uiContainer);
    }

    window.addEventListener('load', () => {
        waitForVideo();
        createUI();
    });
})();