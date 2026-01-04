// ==UserScript==
// @name         哔哩哔哩音频4声道上混
// @namespace    AudioChannelUpmix
// @version      0.4
// @description  将双声道上混到4声道，模拟环绕输出（适配4扬声器系统）
// @copyright    2025, SylviaKaslana(https://space.bilibili.com/35762009)
// @license      MIT
// @author       SylviaKaslana
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://www.bilibili.com/list/*
// @match         *://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://live.bilibili.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539488/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9F%B3%E9%A2%914%E5%A3%B0%E9%81%93%E4%B8%8A%E6%B7%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/539488/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%9F%B3%E9%A2%914%E5%A3%B0%E9%81%93%E4%B8%8A%E6%B7%B7.meta.js
// ==/UserScript==

"use strict";

class StereoToQuadUpmixer {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.setupNodes();
        this.connectNodes();
    }

    setupNodes() {
        // 输入分离器
        this.inputSplitter = this.audioContext.createChannelSplitter(2);
        
        // 基础信号处理
        this.leftGain = this.audioContext.createGain();
        this.rightGain = this.audioContext.createGain();
        this.sumGain = this.audioContext.createGain();
        this.diffGain = this.audioContext.createGain();
        
        // 中央信号生成 (L+R)
        this.centerMixer = this.audioContext.createGain();
        this.centerGain = this.audioContext.createGain();
        this.centerGain.gain.value = 0.707; // -3dB
        
        // 环绕信号生成 (L-R)
        this.surroundMixer = this.audioContext.createGain();
        this.surroundGain = this.audioContext.createGain();
        this.surroundGain.gain.value = 0.5;
        
        // 相位处理 - 使用All-pass滤波器模拟90度相移
        this.phaseShifterL = this.audioContext.createBiquadFilter();
        this.phaseShifterL.type = 'allpass';
        this.phaseShifterL.frequency.value = 1000; // 中心频率
        this.phaseShifterL.Q.value = 0.707;
        
        this.phaseShifterR = this.audioContext.createBiquadFilter();
        this.phaseShifterR.type = 'allpass';
        this.phaseShifterR.frequency.value = 1000;
        this.phaseShifterR.Q.value = 0.707;
        
        // 反相器
        this.inverter = this.audioContext.createGain();
        this.inverter.gain.value = -1;
        
        // 频率处理 - 环绕声道低通滤波 (7kHz)
        this.surroundLPF_L = this.audioContext.createBiquadFilter();
        this.surroundLPF_L.type = 'lowpass';
        this.surroundLPF_L.frequency.value = 7000;
        this.surroundLPF_L.Q.value = 0.707;
        
        this.surroundLPF_R = this.audioContext.createBiquadFilter();
        this.surroundLPF_R.type = 'lowpass';
        this.surroundLPF_R.frequency.value = 7000;
        this.surroundLPF_R.Q.value = 0.707;
        
        // 高通滤波器 - 低频管理 (80Hz)
        this.surroundHPF_L = this.audioContext.createBiquadFilter();
        this.surroundHPF_L.type = 'highpass';
        this.surroundHPF_L.frequency.value = 80;
        this.surroundHPF_L.Q.value = 0.707;
        
        this.surroundHPF_R = this.audioContext.createBiquadFilter();
        this.surroundHPF_R.type = 'highpass';
        this.surroundHPF_R.frequency.value = 80;
        this.surroundHPF_R.Q.value = 0.707;
        
        // 延迟处理 - 后置声道延迟
        this.delayL = this.audioContext.createDelay(0.1);
        this.delayL.delayTime.value = 0.02; // 20ms
        
        this.delayR = this.audioContext.createDelay(0.1);
        this.delayR.delayTime.value = 0.02; // 20ms
        
        // 动态处理 - 压缩器
        this.compressorFL = this.audioContext.createDynamicsCompressor();
        this.compressorFR = this.audioContext.createDynamicsCompressor();
        this.compressorRL = this.audioContext.createDynamicsCompressor();
        this.compressorRR = this.audioContext.createDynamicsCompressor();
        
        // 设置压缩器参数
        [this.compressorFL, this.compressorFR, this.compressorRL, this.compressorRR].forEach(comp => {
            comp.threshold.value = -20;
            comp.knee.value = 5;
            comp.ratio.value = 3;
            comp.attack.value = 0.005;
            comp.release.value = 0.05;
        });
        
        // 输出增益控制
        this.frontLeftGain = this.audioContext.createGain();
        this.frontRightGain = this.audioContext.createGain();
        this.rearLeftGain = this.audioContext.createGain();
        this.rearRightGain = this.audioContext.createGain();
        
        // 设置输出电平
        this.frontLeftGain.gain.value = 1.0;   // 0dB
        this.frontRightGain.gain.value = 1.0;  // 0dB
        this.rearLeftGain.gain.value = 0.866;  // -1.25dB
        this.rearRightGain.gain.value = 0.866; // -1.25dB
        
        // 最终输出合并器
        this.outputMixer = this.audioContext.createChannelMerger(4);
        
        // 输入输出节点
        this.input = this.inputSplitter;
        this.output = this.outputMixer;
    }

    connectNodes() {
        // 输入分离
        this.inputSplitter.connect(this.leftGain, 0);   // 左声道
        this.inputSplitter.connect(this.rightGain, 1);  // 右声道
        
        // 中央信号路径 (L+R)
        this.leftGain.connect(this.centerMixer);
        this.rightGain.connect(this.centerMixer);
        this.centerMixer.connect(this.centerGain);
        
        // 环绕信号路径 (L-R)
        this.leftGain.connect(this.surroundMixer);
        this.rightGain.connect(this.surroundMixer);
        // 右声道反相后进入环绕混音器
        this.rightGain.connect(this.inverter);
        this.inverter.connect(this.surroundMixer);
        this.surroundMixer.connect(this.surroundGain);
        
        // 相位处理
        this.surroundGain.connect(this.phaseShifterL);
        this.surroundGain.connect(this.phaseShifterR);
        
        // 频率处理链
        this.phaseShifterL.connect(this.surroundLPF_L);
        this.surroundLPF_L.connect(this.surroundHPF_L);
        this.surroundHPF_L.connect(this.delayL);
        
        this.phaseShifterR.connect(this.surroundLPF_R);
        this.surroundLPF_R.connect(this.surroundHPF_R);
        this.surroundHPF_R.connect(this.delayR);
        
        // 前置声道路径
        // Front Left = Left + Center
        this.leftGain.connect(this.frontLeftGain);
        this.centerGain.connect(this.frontLeftGain);
        this.frontLeftGain.connect(this.compressorFL);
        
        // Front Right = Right + Center
        this.rightGain.connect(this.frontRightGain);
        this.centerGain.connect(this.frontRightGain);
        this.frontRightGain.connect(this.compressorFR);
        
        // 后置声道路径
        this.delayL.connect(this.rearLeftGain);
        this.rearLeftGain.connect(this.compressorRL);
        
        this.delayR.connect(this.rearRightGain);
        this.rearRightGain.connect(this.compressorRR);
        
        // 最终输出
        this.compressorFL.connect(this.outputMixer, 0, 0); // Front Left
        this.compressorFR.connect(this.outputMixer, 0, 1); // Front Right
        this.compressorRL.connect(this.outputMixer, 0, 2); // Rear Left
        this.compressorRR.connect(this.outputMixer, 0, 3); // Rear Right
    }

    // 动态参数调整方法
    setRearLevel(level) {
        // level: 0.0 - 1.0
        this.rearLeftGain.gain.value = level * 0.866;
        this.rearRightGain.gain.value = level * 0.866;
    }

    setCenterLevel(level) {
        // level: 0.0 - 1.0
        this.centerGain.gain.value = level * 0.707;
    }

    setSurroundDelay(delayTime) {
        // delayTime: 0.0 - 0.1 seconds
        this.delayL.delayTime.value = delayTime;
        this.delayR.delayTime.value = delayTime;
    }

    setSurroundCutoff(frequency) {
        // frequency: 1000 - 20000 Hz
        this.surroundLPF_L.frequency.value = frequency;
        this.surroundLPF_R.frequency.value = frequency;
    }

    // 获取输入输出节点
    getInput() {
        return this.input;
    }

    getOutput() {
        return this.output;
    }
}

setTimeout(function () {
    let video = null;
    let audioContext = new AudioContext();

    let mediaSource = null;
    let dest = audioContext.destination;
    dest.channelCount = 4;

    const upmixer = new StereoToQuadUpmixer(audioContext);

    upmixer.output.connect(dest);

    setInterval(() => {
        let nowVideoHolder = document.getElementsByClassName("bilibili-player-video")[0] ||
            document.getElementsByClassName("bpx-player-video-wrap")[0] ||
            document.getElementById("live-player") ||
            document.getElementsByClassName("container-video")[0];

        if (!nowVideoHolder)
            return;

        let nowVideo = nowVideoHolder.getElementsByTagName("video")[0];
        if (!nowVideo || nowVideo === video) return;

        video = nowVideo;
        try {
            mediaSource = audioContext.createMediaElementSource(video);
            mediaSource.connect(upmixer.input);
            console.log("[4声道填充脚本]", "已连接 B站视频音频并复制声道");
        } catch (e) {
            console.warn("连接音频源失败，可能是重复连接或跨域限制", e);
        }
    }, 1000);
}, 100);
