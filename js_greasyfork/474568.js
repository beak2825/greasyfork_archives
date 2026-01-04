// ==UserScript==
// @name         B站PK倒计时30秒提醒（蜂鸣）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  B站PK倒计时30秒提醒，使用蜂鸣器声音
// @author       simon
// @match        https://live.bilibili.com/*
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474568/B%E7%AB%99PK%E5%80%92%E8%AE%A1%E6%97%B630%E7%A7%92%E6%8F%90%E9%86%92%EF%BC%88%E8%9C%82%E9%B8%A3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474568/B%E7%AB%99PK%E5%80%92%E8%AE%A1%E6%97%B630%E7%A7%92%E6%8F%90%E9%86%92%EF%BC%88%E8%9C%82%E9%B8%A3%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 初始启动5秒的循环
    var fiveSecondInterval = setInterval(checkAndToggle, 5000);

    // 启动每秒一次的循环
    var oneSecondInterval = null;
    function checkAndToggle() {
        // 检查是否存在指定的元素
        var pkInfoDisplayBoardTimer = document.querySelector(".pk-info-display-board-timer");
        
        if (pkInfoDisplayBoardTimer && pkInfoDisplayBoardTimer.textContent.trim() !== "0S") {
            // 如果元素存在且textContent不是0，则暂停5秒的循环，执行每秒一次的循环
            if (fiveSecondInterval) {
                clearInterval(fiveSecondInterval);
                fiveSecondInterval = null;
                oneSecondInterval = setInterval(checkAndToggle, 1000);
            } else {
                var sec = calculateSeconds(pkInfoDisplayBoardTimer.textContent.trim());

                if (sec <= 30 && sec > 0 && sec %5 == 0) {
                    var finalHit = document.querySelector(".final-hit-icon");
                    if(finalHit)
                    {
                        //绝杀时刻不响起提示
                        return;
                    }
                    console.log("倒计时内容："+ pkInfoDisplayBoardTimer.textContent);
                    // 提醒
                    var beep = Beep(4000,0.3);
                    beep.start();
                    setTimeout(function() {
                        beep.stop();
                    }, 60);
                }
            }

        } else {
            // 如果元素不存在或者textContent为0，则继续5秒的循环
            if (oneSecondInterval) {
                clearInterval(oneSecondInterval);
                oneSecondInterval = null;
                fiveSecondInterval = setInterval(checkAndToggle, 5000);
            }
            //onsole.log("五秒计时器");
        }
    }

    // 定义一个函数来计算总秒数
    function calculateSeconds(timeString) {
        // 定义正则表达式来匹配01:36和30s两种显示方式
        var timePattern1 = /^\d{1,2}:\d{2}$/; // 01:36
        var timePattern2 = /^(\d+)s$/; // 30s
        if (timePattern1.test(timeString)) {
            // 匹配01:36格式
            var parts = timeString.split(':');
            var minutes = parseInt(parts[0], 10);
            var seconds = parseInt(parts[1], 10);
            return minutes * 60 + seconds;
        } else if (timePattern2.test(timeString)) {
            // 匹配30s格式
            return parseInt(RegExp.$1, 10);
        } else {
            // 未匹配任何格式
            return NaN; // 或者可以返回一个错误值或抛出异常
        }
    }

    function Beep(hz, volume) {
        // 创建一个新的AudioContext
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
        // 创建一个OscillatorNode，它会生成声音
        var oscillator = audioContext.createOscillator();
        if (hz == undefined || hz == null) {
            hz = 4000;
        }
    
        // 设置声音参数
        oscillator.type = 'sine'; // 设置波形类型（正弦波）
    
        // 创建一个GainNode来控制音量
        var gainNode = audioContext.createGain();
        if (volume == undefined || volume == null) {
            volume = 1.0; // 默认音量为1.0
        }
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
        oscillator.frequency.setValueAtTime(hz, audioContext.currentTime); // 设置频率
    
        // 连接OscillatorNode到GainNode，然后将GainNode连接到音频输出
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination); // 连接到音频输出
    
        return oscillator;
    }
    
})();