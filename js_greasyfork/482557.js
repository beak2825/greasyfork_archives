// ==UserScript==
// @name         语音维基合并当前页音频
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  以特定时间间隔合并音频文件并下载合并好的音频
// @author       You
// @match        https://voicewiki.cn/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voicewiki.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481693/%E8%AF%AD%E9%9F%B3%E7%BB%B4%E5%9F%BA%E5%90%88%E5%B9%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9F%B3%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/481693/%E8%AF%AD%E9%9F%B3%E7%BB%B4%E5%9F%BA%E5%90%88%E5%B9%B6%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9F%B3%E9%A2%91.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Function to merge audio files with a 1-second gap
    async function mergeAudio(audioUrls) {
        const audioContext = new AudioContext();

        // Helper function to fetch and decode audio data
        async function fetchAndDecode(url) {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return audioContext.decodeAudioData(arrayBuffer);
        }

        // Fetch and decode all audio data asynchronously
        const audioDataArray = await Promise.all(audioUrls.map(fetchAndDecode));

        // Output some information for debugging
        console.log('音频数据数组:', audioDataArray);
        // 设置间隔
        var intersec = 0.9 //在这里改间隔时间，0.9代表0.9秒

        // Calculate the total length of the merged audio
        const totalFrames = audioDataArray.reduce((acc, data) => acc + data.length + (intersec * audioContext.sampleRate), 0);

        // Output the total frames for debugging
        console.log('总帧数:', totalFrames);

        // Create the output buffer with the calculated totalFrames
        const outputBuffer = audioContext.createBuffer(1, totalFrames, audioContext.sampleRate);
        const outputData = outputBuffer.getChannelData(0);

        let offset = 0;

        // Copy each decoded audio data to the output buffer
        for (const data of audioDataArray) {
            // Output some information about each data for debugging
            console.log('数据长度:', data.length);

            // Ensure the offset stays within bounds
            if (offset + data.length + (intersec * audioContext.sampleRate) > outputData.length) {
                console.warn('偏移量超出范围。正在调整。');
                const availableSpace = outputData.length - offset;
                outputData.set(data.getChannelData(0).subarray(0, availableSpace), offset);
            } else {
                outputData.set(data.getChannelData(0), offset);
            }

            offset += data.length + (intersec * audioContext.sampleRate); // Move offset by the length of the source data
        }

        return outputBuffer;
    }

    // Function to download the merged audio as WAV
    function downloadAudio(buffer) {
        const audioContext = new AudioContext(); // Add this line to declare audioContext

        // Prompt for a filename
        const filename = prompt('请输入文件名（不包括扩展名）:', 'merged_audio');

        if (filename === null) {
            // User pressed cancel
            return;
        }

        const blob = bufferToBlob(buffer, audioContext);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.wav`; // Add the filename and extension
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Helper function to convert an AudioBuffer to a Blob
    function bufferToBlob(buffer, audioContext) {
        const interleaved = interleaveChannels(buffer);
        const wavData = encodeWAV(interleaved, audioContext.sampleRate);

        return new Blob([wavData], { type: 'audio/wav' });
    }


    // Helper function to interleave audio data channels
    function interleaveChannels(buffer) {
        const channels = [];
        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        const interleaved = new Float32Array(buffer.length * buffer.numberOfChannels);
        let offset = 0;

        for (let i = 0; i < buffer.length; i++) {
            for (let j = 0; j < buffer.numberOfChannels; j++) {
                interleaved[offset++] = channels[j][i];
            }
        }

        return interleaved;
    }

    // Helper function to encode interleaved audio data as WAV
    function encodeWAV(samples, sampleRate) {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        // Write WAV header
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 4, true);
        view.setUint16(32, 4, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);

        // Write audio data
        const dataView = new Int16Array(buffer, 44);
        for (let i = 0; i < samples.length; i++) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            dataView[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        return buffer;
    }

    // Helper function to write a string to a DataView
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    // Use the downloadAudio function in your button click event

    // 创建并附加粘性按钮
    const button = document.createElement('button');
    button.innerHTML = '合并并下载音频';
    button.style.position = 'fixed';
    button.style.top = '65px'; // 根据需要调整顶部位置
    button.style.left = '10px'; // 根据需要调整左侧位置
    button.style.zIndex = '99999';
    button.style.padding = '0.5em';
    button.style.borderRadius = '0.5em 0px 0.5em 0px';
    button.style.background = '#fff039';
    button.addEventListener('click', async () => {
        try {
            // 从按钮元素中提取音频URL
            const audioUrls = Array.from(document.querySelectorAll('.audio-player-button audio')).map(audio => audio.src);

            console.log('音频URL:', audioUrls);

            // 确保至少有一个音频URL
            if (audioUrls.length === 0) {
                throw new Error('未找到音频URL。');
            }

            const mergedBuffer = await mergeAudio(audioUrls);
            downloadAudio(mergedBuffer);
        } catch (error) {
            console.error('合并音频时发生错误:', error.message);
        }
    });

    document.body.appendChild(button);
})();
