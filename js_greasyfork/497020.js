// ==UserScript==
// @name         TikN学习通教师模式试卷导出工具
// @namespace    http://blmm.top/
// @version      0.1.0
// @description  将学习通教师模式试卷导出为TikN可识别的格式。
// @author       Fairytale_Store
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/exam/lookpaper*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497020/TikN%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E6%A8%A1%E5%BC%8F%E8%AF%95%E5%8D%B7%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/497020/TikN%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E6%A8%A1%E5%BC%8F%E8%AF%95%E5%8D%B7%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来导出题目
    function exportQuestions() {
        var questions = $('.stem_con');
        var output = '';
    
        questions.each(function(index) {
            var questionText = $(this).find('p').text().trim();
            var options = $(this).next('.stem_answer').find('.num_option, .answer_p');
            // 寻找紧接在当前题目的下一个.answerDiv作为答案部分
            var nextAnswerDiv = $(this).nextUntil('.stem_con').filter('.answerDiv');
            var answer = nextAnswerDiv.find('.answer_tit p').text().trim();
    
            output += (index + 1) + '. ' + questionText + '\r\n';
            options.each(function(optionIndex) {
                if (optionIndex % 2 === 0) { // 选项字母
                    var letter = $(this).text().trim();
                    output += letter + ' ';
                } else { // 选项文本
                    output += $(this).text().trim() + '\r\n';
                }
            });
            output += '#' + answer + '#\r\n';
        });

        saveStringToFile("<TikS><本试卷使用TikN学习通导出工具V1.0自动生成>" + output,"导出习题.tik")
    }

    function saveStringToFile(str, filename) {
        var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    // 当页面加载完成时执行导出函数
    $(document).ready(exportQuestions);
})();