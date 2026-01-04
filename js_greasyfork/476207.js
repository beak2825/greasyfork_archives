// ==UserScript==
// @name         河北软件职业技术学院-自动答题
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  考试自动获取答案
// @author       xiajie
// @match        http://*.cj-edu.com/*
// @match        https://*.cj-edu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cj-edu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/476207/%E6%B2%B3%E5%8C%97%E8%BD%AF%E4%BB%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/476207/%E6%B2%B3%E5%8C%97%E8%BD%AF%E4%BB%B6%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    if(window.location.pathname == '/Examination'){
        console.log('进入答题页面');
        //GM_setValue('answerList',JSON.stringify([]));

        setTimeout(function(){
            setAnswer();
        },3000)

        function setAnswer(){
            var quesLen = $('.all_subject>div').length;
            console.log(quesLen)
            var answerList = GM_getValue('answerList');
            if(!answerList){
                answerList = [];
            }else{
                answerList = JSON.parse(answerList);
            }
            console.log(answerList.length);
            for(var i=0;i<quesLen;i++){
                var item = $('.all_subject>div').eq(i).find('ul');
                var title = $('.all_subject>div').eq(i).find('.stem').find('div').eq(1).text();
                //console.log(title);
                var answer = 'A';
                for(var j=0;j<answerList.length;j++){
                    if(title == answerList[j].title){
                        answer = answerList[j].answer;
                        break;
                    }
                }
                //console.log(answer);
                var html = "<span style='color:red;'>答案："+answer+"</span>";
                $('.all_subject>div').eq(i).find('.stem').find('div').eq(1).append(html);
                
                var arr = {'A':0,'B':1,'C':2,'D':3,'E':4};
                if(answer.length == 1){
                    item.find('li').eq(arr[answer]).find('label').click();
                }else{
                    var abcd = answer.split(',');
                    for(var k=0;k<abcd.length;k++){
                        if(item.find('li').eq(arr[abcd[k]]).find('label').hasClass('is-checked') == false){
                            item.find('li').eq(arr[abcd[k]]).find('label').click();
                        }
                    }
                }
            }
        }
    }

    if(window.location.pathname == '/ViewAnswerSheet'){
        console.log('试卷结果页');
        var answerList = GM_getValue('answerList');
        if(!answerList){
            GM_setValue('answerList',JSON.stringify([]));
            answerList = [];
        }else{
            answerList = JSON.parse(answerList);
        }
        console.log(answerList.length)
        setTimeout(function(){
            getAnswer();
        },3000)

        function getAnswer(){
            var quesLen = $('.all_subject>div').length;
            console.log(quesLen)
            var newAnswerList = answerList;
            for(var i=0;i<quesLen;i++){
                var item = $('.all_subject>div').eq(i).find('ul');
                var title = $('.all_subject>div').eq(i).find('.stem').find('div').eq(1).text();
                var answer = $('.all_subject>div').eq(i).find('.seeStudentAnswer .answer').text().replace('参考答案：', '').trim();
                if(answer == '对'){ answer = 'A'}
                if(answer == '错'){ answer = 'B'}
                //console.log(title);
                //console.log(answer);
                var add = true;
                for(var j=0;j<answerList.length;j++){
                    if(answerList[j].title == title){
                        add = false;
                        break;
                    }
                }
                var arr = {
                    'title':title,
                    'answer':answer,
                }
                add && newAnswerList.push(arr);
            }
            newAnswerList = JSON.stringify(newAnswerList);
            GM_setValue('answerList',newAnswerList);
        }
    }

})();