// ==UserScript==
// @name         gooboo自动做题
// @namespace    http://tampermonkey.net/
// @version      202410100002
// @description  gooboo自动做题!自用
// @author       moNAME
// @match        *://gooboo.g8hh.com.cn/*
// @icon         https://www.g8hh.com/static/images/game/gooboo/top.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512065/gooboo%E8%87%AA%E5%8A%A8%E5%81%9A%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/512065/gooboo%E8%87%AA%E5%8A%A8%E5%81%9A%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
//计时器毫秒数
const maxtimes=300;
// 检查是否已经加载了jQuery
    if (typeof jQuery === 'undefined') {
        var script = document.createElement('script');
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        script.onload = function() {
            initTimerSwitch();
        };
        document.head.appendChild(script);
    } else {
        initTimerSwitch();
    }

    function initTimerSwitch() {
        // 创建按钮
        var $switchButton = $(`<button>开关</button>`).appendTo('.v-toolbar__content');

        // 初始状态为关闭
        var isOn = false;

        // 定义计时器
        var timerId;

        // 设置按钮点击事件
        $switchButton.on('click', function() {
            isOn = !isOn;
            if (isOn) {
                var r=confirm("是否开始自动答题？");
                if (r==true){
                    // 开启时开始计时器
                    startTimer();
                }
            } else {
                // 关闭时停止计时器
                stopTimer();
                $(this).text('已关闭');
            }
        });
        // 启动计时器函数
        function startTimer() {
            stopTimer();// 首先停止已存在的定时器
            timerId = setInterval(function() {

                // 检查答题输入框是否存在
                var answerInput = $('#answer-input-math');
                if (!answerInput.length) {
                    window.alert('答题输入框不存在，停止计时器。');
                    $switchButton.click();
                    return;
                }

                var question=$('.text-center.question-text')[0].innerText.replace(/[^0-9+\-*/\s]/g,'');
                var questionanswer=eval(question);
                var answerinput1=Number($('#answer-input-math').data("_value"));
                var answerinput2=Number($('#answer-input-math').val());
                if(answerinput1==questionanswer && answerinput1==answerinput2){
                    //已填写答案
                    $('.d-flex.justify-center.align-center.flex-wrap').children('button.v-btn')[0].click();
                } else {
                    $('#answer-input-math').val(questionanswer);
                    $('#answer-input-math').data("_value", questionanswer);
                    //直接修改值并不会出发input事件，会导致后续模拟点击不能通过
                    var evt = document.createEvent('HTMLEvents');//createEvent=创建windows事件
                    var inputDom = document.querySelector('#answer-input-math');
                    evt.initEvent('input', true, true);
                    inputDom .dispatchEvent(evt);


                }
            }, maxtimes);
            console.log('自动刷题计时器运行中...');
        }
            // 停止计时器函数
        function stopTimer() {
            if (timerId) {
                clearInterval(timerId);

                timerId = null;
            }
        }
    }
})();