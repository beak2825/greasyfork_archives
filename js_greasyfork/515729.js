// ==UserScript==
// @name         chinahrt继续教育获取答案(按G键)
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  try to take over the world!
// @author       You
// @match        http://*.chinahrt.com/*
// @match        https://*.chinahrt.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/515729/chinahrt%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%8E%B7%E5%8F%96%E7%AD%94%E6%A1%88%28%E6%8C%89G%E9%94%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515729/chinahrt%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%8E%B7%E5%8F%96%E7%AD%94%E6%A1%88%28%E6%8C%89G%E9%94%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var log = console.log;
    log("load...");

    var q_a = [
        {"q": "元宇宙第一股是（）。", "a": "B"},
        {"q": "数字经济时代是属于陌生人的时代，下列说法种不正确的是（）。", "a": "B"},
        {"q": "投资目标的最高层次是（）。", "a": "A"},
        {"q": "2020年10月，我国确定（）个县（市、区）为首批国家数字乡村试点地区。", "a": "D"},
        {"q":"我国法定数字货币运营模式为（）。","a":"B"},
        {"q":"下列选项中，关于长、短视频的描述错误的是（）。","a":"C"}
    ];

    window.onload = function () {
        // 定义一个函数来执行原来的代码
        function fetchData() {
            var q_s = document.getElementsByClassName('f14 fl');
            var a_ = document.getElementsByClassName('f14 dui tc');
            var results = []; // 用于保存问题和答案的数组

            // 遍历 a_ 中的每个元素
            for (var i = 0; i < a_.length; i++) {
                var a_s1 = a_[i].getElementsByTagName('span')[1];
                var a_s2 = a_[i].getElementsByTagName('span')[2];

                // 检查 a_s2 的文本内容是否为“回答正确”
                if (a_s2 && a_s2.textContent.includes("回答正确") && a_s1) {
                    // 获取对应的 q_s 文本
                    if (i < q_s.length) {
                        var question = q_s[i].textContent; // 获取问题文本
                        var answer = a_s1.textContent; // 获取答案文本
                        results.push({ q: question, a: answer });
                    }
                }
            }

            console.log("已经获取新的内容！");

            // 创建 q_a 的问题集合以提高查找效率
            var q_a_set = new Set(q_a.map(item => item.q));
            var results_new = [];

            // 对比 q_a 与 results 中的问题内容
            for (var j = 0; j < results.length; j++) {
                if (!q_a_set.has(results[j].q)) {
                    results_new.push(results[j]);
                } else {
                    console.log("没有新增的内容！");
                }
            }

            // 将数据转换成 JSON 字符串
            if (results_new.length > 0) {
                var jsonData_ = JSON.stringify(results_new);
                console.log("新增的内容：", jsonData_);
            }
        }

        // 添加键盘事件监听器
        document.addEventListener('keydown', function(event) {
            // 检查按下的键是否是字母G
            if (event.key === 'g' || event.key === 'G') {
                fetchData();
            }
        });


    };

})();
