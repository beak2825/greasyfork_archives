// ==UserScript==
// @name         BiliBiliLoudness
// @namespace    http://bi2nb9o3.xyz/
// @version      0.2.2
// @description  To show loudness when playing video
// @author       Bi2Nb9O3
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      LGPL v3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510624/BiliBiliLoudness.user.js
// @updateURL https://update.greasyfork.org/scripts/510624/BiliBiliLoudness.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var left=document.createElement("div");
    var right=document.createElement("div");
    var area=document.getElementsByClassName("bpx-player-video-area")[0];
    left.style.height='100%';
    left.style.width="1%";
    left.style.backgroundImage="linear-gradient(to bottom, #fa709a7f 0%, #fee1407f 100%)";
    left.style.zIndex="10"
    left.style.position="absolute"
    left.style.bottom="0"
    left.style.left="0"
    right.style.height='100%'
    right.style.width="1%"
    right.style.backgroundImage="linear-gradient(to bottom, #43e97b7f 0%, #38f9d77f 100%)"
    right.style.zIndex="10"
    right.style.position="absolute"
    right.style.bottom="0"
    right.style.right="0"
    area.appendChild(left)
    area.appendChild(right)

    const ac = new (window.AudioContext || window.webkitAudioContext)();

    // 从 video 或 audio 标签元素中拿到输入源
    const audio = document.querySelector("video");
    // const audio = document.querySelector("audio");

    // 创建并获取输入源
    const audioSource = ac.createMediaElementSource(audio);
    // 音频通道数 默认值是 2，最高能取 32
    const channelCount = 2 || audioSource.channelCount;
    // 缓冲区大小 取值为 2 的幂次方的一个常数
    const bufferSize = 256;

    // 创建音频处理器
    const processor = ac.createScriptProcessor(bufferSize, channelCount, channelCount);
    // 链接音频处理器
    audioSource.connect(processor).connect(ac.destination);
    // connect到扬声器
    audioSource.connect(ac.destination);
    function b(a){
        return a==Infinity || a==-Infinity;
    }
    function calcdB(buffer){
        let avgEnergy = 0; // 峰值
        // 我这里获取的是最新的buffers
        buffer.forEach(fragment => {
            avgEnergy += Math.abs(fragment)
        });
        // 计算分贝
        const db = 20 * Math.log10(avgEnergy / 32767);
        // 分贝可能会计算出无穷大或无穷小
        if (b(Math.abs(Math.ceil(db))==Infinity)) {
            // 添加数组
            return Math.abs(Math.ceil(db));
            // 最终可以算出平均分贝值
        }
        return db

    }
    // 监听音频处理器每次处理的样本帧
    processor.onaudioprocess = (evt) => {
        {
            //获取声轨1（左声道）输入的缓冲区数据
            const input =evt.inputBuffer.getChannelData(0);
            //获取声轨1（左声道）输出的缓冲区数据
            const output = evt.outputBuffer.getChannelData(0);
            //console.log(calcdB(input));
            if(100+(calcdB(input))!=-Infinity){
                left.style.height=(100+(calcdB(input)-5)+"%")
            }else{
                left.style.height="0%";
            }
        };
        {
            //获取声轨2（右声道）输入的缓冲区数据
            const input =evt.inputBuffer.getChannelData(1);
            //获取声轨2（右声道）输出的缓冲区数据
            const output = evt.outputBuffer.getChannelData(1);
            if(100+(calcdB(input)+63)!=-Infinity){
                right.style.height=(100+(calcdB(input)-5)+"%")
            }else{
                right.style.height="0%";
            }
        };
    };
})();