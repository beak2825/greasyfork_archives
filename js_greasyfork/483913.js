// ==UserScript==
// @name         Twitch & YouTube Audio Normalizer
// @namespace    http://tampermonkey.net/
// @version      0.7RR
// @description  Tenta ajustar o volume para X LUFS no Twitch e YouTube //Attempts to adjust the volume to X LUFS on Twitch and YouTube //尝试将音量调整到在Twitch和YouTube上为X LUFS
// @author       Nuzoeto
// @match        https://www.twitch.tv/*
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483913/Twitch%20%20YouTube%20Audio%20Normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/483913/Twitch%20%20YouTube%20Audio%20Normalizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para ajustar o volume para x LUFS
    // 调整音量到 x LUFS 的功能
    // Function to adjust the volume to x LUFS
    function adjustVolumeToMinus9LUFS() {
        // Defina o valor desejado para x LUFS (ajuste conforme necessário)
        // 设置 x LUFS 的期望值（根据需要调整）
        // Set the desired value for x LUFS (adjust as needed)
        const targetLufs = -5;

        // Obtenha todos os elementos de áudio e vídeo na página
        // 获取页面上的所有音频和视频元素
        // Get all audio and video elements on the page
        const mediaElements = document.querySelectorAll('audio, video');

        mediaElements.forEach((element) => {
            // Obtenha o valor atual do volume
            // 获取当前音量值
            // Get the current volume value
            const currentVolume = element.volume;

            console.log('Volume atual:', currentVolume);

            // Use a API de áudio HTML5 para ajustar o volume
            // 使用 HTML5 音频 API 调整音量
            // Use the HTML5 audio API to adjust the volume
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaElementSource(element);
            const gainNode = audioContext.createGain();

            source.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Calcule o ajuste necessário para o ganho
            // 计算必要的增益调整
            // Calculate the necessary gain adjustment
            const gainAdjustment = Math.pow(5, targetLufs / 20);

            // Ajuste o ganho
            // 调整增益
            // Adjust the gain
            gainNode.gain.value = currentVolume * gainAdjustment;

            // Inicie a reprodução se o áudio estiver pausado
            // 如果音频已暂停，则开始播放
            // Start playback if the audio is paused
            if (element.paused) {
                element.play();
            }
        });
    }

    // Chame a função para ajustar o volume
    // 调用调整音量的功能
    // Call the function to adjust the volume
    adjustVolumeToMinus9LUFS();
})();
