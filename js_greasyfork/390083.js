// ==UserScript==
// @name         周口
// @namespace    http://www.zkjxjy.com
// @version      1.8
// @description  周口-刷课
// @match        *://*.zkjxjy.com/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/390083/%E5%91%A8%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/390083/%E5%91%A8%E5%8F%A3.meta.js
// ==/UserScript==
setInterval(function(){    console.log('播放检测中。。。。。');
    var exam = $('.m-exam-dialog');
    if (exam[0] != -1) {
        console.log('出现题目。。。。');
        // 计算题目结果
       
            var topic = $('.d-qus-body', exam)[0].innerText;
            // topic = topic.replace(/\s+/g, '');
            var value = topic.match(/\d/g);
            $.each(value, function(i, n) {
                value[i] = parseInt(n);
            })
            var operator = topic.match(/[\+\-x]/)[0];
            console.log(topic + " 取运算符:" + operator);
            var result = 0;
            switch (operator) {
                case '+':
                    result = value[0] + value[1];
                    break;
                case '-':
                    result = value[0] - value[1];
                    break;
                case 'x':
                    result = value[0] * value[1];
                    break;
                case '/':
                    result = value[0] / value[1];
                    break;
                default:
                    console.log('continueLearning计算错误。。。。。');
            }
       
        console.log("运算数" + value + " 运算符:" + operator + " 结果：" + result);
        // 选择正确选项，模拟提交
        var options = $.trim($('.ipt-txt-content', exam).text());
        options = options.split(/\s+/);
        console.log("选项有" + options.length + "个")
        var correct = undefined;
        $.each(options, function(i, n) {
            if (parseInt(options[i]) - result == 0) {
                correct = i
            }
        })
        console.log("正解是第" + correct + "个，准备继续播放。。。");
        if (correct != undefined) {
            $('input', exam)[correct].click();
            setTimeout(function() {
                $('button', exam)[0].click();
            }, 3000);
            setTimeout(function() {
                $('button', exam)[0].click();
            }, 1000);
        }

    }}, 1000);


