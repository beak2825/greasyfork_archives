// ==UserScript==
// @name         南京市继续教育自动答题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  AutoDo
// @author       Hui
// @match        http*://m.mynj.cn:11188/zxpx/auc/courseExam?exid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @require      https://greasyfork.org/scripts/467486-%E5%8D%97%E4%BA%AC%E9%A2%98%E5%BA%93/code/%E5%8D%97%E4%BA%AC%E9%A2%98%E5%BA%93.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467649/%E5%8D%97%E4%BA%AC%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/467649/%E5%8D%97%E4%BA%AC%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    // 题库列表
const no_answer_choose=0
    setTimeout(function(){
        // 计算字符串相似度
        function similarity(str1, str2) {
            const len1 = str1.length;
            const len2 = str2.length;
            const distance = new Array(len1 + 1).fill(null).map(() => new Array(len2 + 1).fill(null));
            for (let i = 0; i <= len1; i++) {
                distance[i][0] = i;
            }
            for (let j = 0; j <= len2; j++) {
                distance[0][j] = j;
            }
            for (let i = 1; i <= len1; i++) {
                for (let j = 1; j <= len2; j++) {
                    const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    distance[i][j] = Math.min(
                        distance[i - 1][j] + 1, // 删除操作
                        distance[i][j - 1] + 1, // 插入操作
                        distance[i - 1][j - 1] + cost // 替换操作或者匹配操作
                    );
                }
            }
            return 1 - distance[len1][len2] / Math.max(len1, len2);
        }

        'use strict';
        // 定义题目及答案列表
        //const quizList = quizList

        // 搜索题目并选择对应答案
        var as_Title
        var no_answer
        const searchText = document.getElementsByClassName('exam-subject-text-que-title');
        for(let x = 0; x<searchText.length; x++){
            as_Title=$('.exam-subject-text-que-title')[x].innerText

            // 目标匹配字符串
            const targetStr =  as_Title;
            const threshold = 0.6; // 最低匹配度阈值
            let maxScore = 0; // 匹配度分数
            let maxIndex = -1; // 最匹配元素的索引
            for (let i = 0; i < quizList.length; i++) {
                const quizTitle = quizList[i].title;
                const similarityScore = similarity(targetStr, quizTitle);
                if (similarityScore > maxScore) {
                    maxScore = similarityScore;
                    maxIndex = i;
                }
            }
            if (maxScore >= threshold) {
                const answer = quizList[maxIndex].answer;
                const valuesArr = answer.split('');

                for (let y = 0; y < valuesArr.length; y++) {
                    const value = valuesArr[y];
                    console.log(`第${x}题匹配度最高的答案是 ${value}`);
                    if(value=="E"){
                        if($(`input[value='${value}']`)[x-7]){$(`input[value='${value}']`)[x-7].click();}
                    }else if(value=="1" || value=="0"){
                        if($(`input[value='${value}']`)[x-13]){
                            $(`input[value='${value}']`)[x-13].click()};
                    }else{
                        if($(`input[value='${value}']`)[x]){
                            $(`input[value='${value}']`)[x].click()};
                    }
                }

            } else {
                console.log('无答案');
                
                const no_answer_choose=1
                no_answer=[no_answer,x]
            }
        }
    },3000)
    setTimeout(function(){
        document.querySelector('#exam_sub').click()
        var question=''
                for(var i=0;i<20;i++){
                    // 获取文本框元素
                    var text = document.getElementsByClassName('exam-subject-text-que-title')[i].innerText;
                    question= question + text + '\r'; }
                    console.log(question)
    },4000)
    // Your code here...
})();