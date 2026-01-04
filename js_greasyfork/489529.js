// ==UserScript==
// @name            Video Audio Compressor
// @namespace       https://github.com/tjxwork
// @version         0.0.1
// @description     视频音量压缩器，防止耳聋，避免响度战争，懒得写UI了，直接改脚本文件里面的数值吧。
// @author          tjxwork
// @license         CC-BY-NC-SA
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAmVBMVEVHcExEW4EAe/8Jc+Y6ZKBDZ6JDZqFERUQsWqREaKVDY5ZFVGxEaKYFdfBFZaYAfP8AfP9DaKZEaKZEY5xEX48Sa8pDZ6YBdP3sAAQWaL/qAAQOa9U+R05GXItEaKcAbP/kBAYAevtIYZoAfP8Aev+LJiYgNNMAfP8AfP8Aev8AevtEaKdEaKVEaKPsAATpAAQLePAcc9o2bLfeB5giAAAAKHRSTlMAHfowNbXHBAjrZDz0wXGX2afcTaCalpnomeiaDi35mU7ZQ9DZUgKbuVNHxAAAA0xJREFUWMPdV9lyozAQ5BZgm8O3HZskrlqtECJx9v8/bmcQl0CQZFPZh7jKU0iop1staQDDgB/5QvgqnvwAvPFteOJEqRdkIgu8NLp9ehKLbVAUohBClAIuymDvfAZ/88oMUEL0QuEtyAfxpluWFbVQkpSFa37IhHAppOo0Wpi+4ZuLKA2kiGX4Pp7ss4rP3aBgahi0krlxwY+yLPfknUn4boHyvUXVpG0ghuNiYuFiewafotZliE0qA60D8cNlARpcMmfiHvHra6VT4a+urmu4m+1nTAgBn61NlbpTYphrXI1wEm+i/2uTUi0/ZjLXQBGYdGISYJNYXrX8TbguYTXdCfwN8EXoG33W+qprhrBFxE1vogcr7fnN+BF/rckTZeFpTVjAsSnH66/wQ3DwdDkaPN3i/lNAGn644wLPVmMCCSDB5j1+CBs8J2M8dbCf1Ft/TgQJYBLO2MQIDkE6JhyLwLmKyKcDE2gKecOOcCCivzARrOR2bKJXFMVN3XqGtkkdXG4yMIFWHpqq6AkRJuyEYGwi1JHSH3DpRfgw2axu9kzEgkO1/GS4ElhYBjsJ+rESdDRPx9cX+PXC+anZSRQr7thE0CW6uR5fEdYG/B9bEVinxzsJ0opurc8Kvgrn9i5U/WK0CAaW4m7CT8cB/OX8qy1MWHbpgN+J74zfY3vk+qCIQ599ujN2Pzl9Ey4PjDEOf7bzEd5UggEU+f1DNQ7Cb7/Dr6DNedW/8ikxpvih7q8Ya8hWl2YSLT+Gg5a/2QkHljNJxjk/1Hi748dgtyZo5s/zdhxEWw6LodXrj7X8MuxgXC7J4IrvpAUJ501/DleJfv5VeJZDmsGJTGDJriZYM68zVm9czpklb6h4xmdehxQ8BGmi0gXiZl6nBvhcmsgGeWfe6QZ4Lj3Q6tKHAT6XCXS6JpLoxep0fcXE/P+baKl4a8ZES8VbzVZW8j7PmJioOzGRN3ZMyXuaMTFWxcb1cVZ12TMm2gqe18fZOPTxBz10E2DZLt/6ZA+kLWktHkqanl/ihbh3/FVJkw+Wy6PFZP+jP1FOAokXxRtv+C/9wu6cEst6PtnGVDnaVG/8+AD983bnVhI7yoOBqKXzuz/7aJ/xXz/76A/6dv4LijTPhWxnXM0AAAAASUVORK5CYII=
// @match           https://*.bilibili.com/*
// @match           https://*.youtube.com/*
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/489529/Video%20Audio%20Compressor.user.js
// @updateURL https://update.greasyfork.org/scripts/489529/Video%20Audio%20Compressor.meta.js
// ==/UserScript==

"use strict";

function AudioCompressor() {
    // 音频元素
    const audioElement = document.querySelector("video");

    // 设置音频上下文
    let audioContext = new AudioContext();

    // 创建 音频来源节点 MediaElementAudioSourceNode，将 音频元素 输入其中
    const source = new MediaElementAudioSourceNode(audioContext, {
        mediaElement: audioElement,
    });

    // 创建压缩器节点
    const compressor = new DynamicsCompressorNode(audioContext, {

        //----------修改数值处----------

        // 阈值(dB)
        threshold: -24,
        // 拐点过渡(dB)
        knee: 5,
        // 压缩比例
        ratio: 18,
        // 启动时间(S)
        attack: 0,
        // 释放时间(S)
        release: 0.25,

        //----------修改数值处----------
    });

    // 音频来源节点 -x-> 音频目标
    //source.disconnect(audioContext.destination);
    // 音频来源节点 -> 压缩器节点 -> 音频目标
    source.connect(compressor);
    compressor.connect(audioContext.destination);
}

// 页面加载完成后运行脚本
window.addEventListener("load", AudioCompressor);
