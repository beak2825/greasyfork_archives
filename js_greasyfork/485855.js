// ==UserScript==
// @name         青少年普法小助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  教育部全国青少年普法网自动答题
// @author       Memory
// @match        https://static.qspfw.moe.gov.cn/*
// @icon         https://static.qspfw.moe.gov.cn/user/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485855/%E9%9D%92%E5%B0%91%E5%B9%B4%E6%99%AE%E6%B3%95%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/485855/%E9%9D%92%E5%B0%91%E5%B9%B4%E6%99%AE%E6%B3%95%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var currentUrl = window.location.href;

        if (currentUrl === 'https://static.qspfw.moe.gov.cn/user/#/activity'){
            var button = document.querySelector('button[class="ant-btn ant-btn-primary ant-btn-lg ant-btn-block"]');
            if (button) {
                button.click();
            }
        } else if (currentUrl === 'https://static.qspfw.moe.gov.cn/xf2023/learn_practice_list.html') {
            var div = document.querySelector('div[class="red"]');
            if (div) {
                div.click();
            }
        } else if (currentUrl === 'https://static.qspfw.moe.gov.cn/xf2023/learning-page.html'){
            var afterClassPractice = document.querySelector('div[id="afterClassPractice"]');
            if (afterClassPractice) {
                afterClassPractice.click();
            }
        } else if (currentUrl === 'https://static.qspfw.moe.gov.cn/xf2023/learn_exam.html'){
            var questionBank = {
                "习近平法治思想的核心要义集中体现为习近平总书记在中央全面依法治国工作会议上提出的“（）”。": "C",
                "我国将“实行依法治国，建设社会主义法治国家”写入宪法是在（）年。": "B",
            	"关于依法治国，下列说法错误的是（）。": "A",
            	"全面推进依法治国，要坚持全面推进（）立法、（）执法、（）司法、全民守法。": "A",
            	"下列说法错误的是（）。": "D",
            	"我国的政体即政权组织形式是（）。": "C",
            	"我国国家的一切权力属于人民，人民行使国家权力的机关是（）。": "D",
            	"我国的国家机构实行（）的原则。": "A",
            	"在我国，各民族一律平等，各少数民族聚居的地方实行区域自治，维护和发展各民族的（）关系。": "B",
                "在我国，全国人民代表大会和地方各级人民代表大会都由（）产生。": "A",
            	"（）是国家一切法律法规的总依据、总源头，具有最高的法律地位、法律权威、法律效力。": "A",
            	"在我国，（）行使国家立法权。": "D",
            	"下列哪一部法律属于我国七个法律部门中的民商法律部门？（）": "B",
                "下列哪一项不属于我国以宪法为核心的中国特色社会主义法律体系的内容？（）": "C",
            	"以宪法为核心的中国特色社会主义法律体系的形成并完善发展，是伴随（）和社会主义现代化建设的发展而取得的重要法治成就。": "B"
                // 添加更多题目和答案
            };
            var sum = document.querySelector('span[id="totalTopic"]').innerText;

            function executeQuestion(index) {
                setTimeout(function() {
                    var question = document.querySelector('div.cont_text').innerText.trim();
                    var answer = questionBank[question];
                    if (answer) {
                        var options = document.querySelectorAll('span');
                        options.forEach(function(option) {
                            if (option.innerText === answer) {
                                option.click();
                                console.log("点击答案");
                                var nextquestion = document.querySelector('div[id="next_question"]');
                                if (index === sum - 1) {
                                    submit();
                                    console.log("综合评价");
                                } else {
                                    nextquestion.click();
                                    console.log("下一题");
                                    console.log(index);
                                }
                            }
                        });
                    }
                }, index * 100);
            }

            for (var i = 0; i < sum; i++) {
                executeQuestion(i);
            }
        }
    });
})();
