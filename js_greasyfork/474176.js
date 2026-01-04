// ==UserScript==
// @name         河北工程大学-自动答题
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  考试自动获取答案
// @author       xiajie
// @match        https://*.edu-edu.com/*
// @match        https://*.edu-cj.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu-edu.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/474176/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/474176/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6-%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    if(window.location.pathname == '/MyOnlineCourseNew/OnlineLearningNew/StudentSiteNewExIndex'){
        console.log('课程作业')
        var examNum = $('.start_testing').length;
        if(examNum > 0){
            addhtml();
            GM_setValue('isLearn',0);
        }
        function addhtml(){
            var text = '开始考试';
            var css = "'background:red;cursor: pointer;padding: 5px 10px;color:#fff;display:inline-block;line-height: 30px;font-size:18px'";
            var html = "<a id='learnText' style="+css+">"+text+"</a>";
            $('.examination_top').append(html);
        }

        $('#learnText').click(function(){
            $('#learnText').text('考试中');
            GM_setValue('isLearn',1);
            for(let i=0;i<examNum;i++){
                setTimeout(function(){
                    $('.start_testing').eq(i).click();
                    if(i == examNum - 1){
                        setTimeout(function(){
                            $('#learnText').text('考试完成（重考）');
                            GM_setValue('isLearn',0);
                        },1000*10)
                    }
                },i*1000*15 + 1000)
            }

        })
    }

    if(window.location.pathname.indexOf('/exam-admin/student/exam/single/view/doresult') !== -1){
        console.log('考试记录')
        let isLearn = GM_getValue('isLearn');
        if(isLearn == 1){
            $('.ui-exam-btn')[0].click();
        }
    }

    if(window.location.pathname.indexOf('/exam/student/exam2/doexam') !== -1){
        console.log('答题页面');
        GM_setValue('isExam',1);
        GM_setValue('isView',0);
        let isLearn = GM_getValue('isLearn');
        if(isLearn == 1){
            setTimeout(function(){
                $('button[onclick="__ExamIns.Submit()"]').click();
                setTimeout(function(){
                    $('.ui-action-bar button').eq(0).click();
                },1000)
            },5000)
        }
    }

    if(window.location.pathname.indexOf('/exam/student/exam2/doview') !== -1){
        console.log('试卷结果页');
        GM_setValue('isExam',0);
        GM_setValue('isView',1);
        let isLearn = GM_getValue('isLearn');
        if(isLearn == 1){
            setTimeout(function(){
                $('button[onclick="myCloseWindow()"]').click();
            },5000)
        }
    }

    if(window.location.pathname.indexOf('/exam/student/exam/finished') !== -1){
        console.log('考试完成');
        GM_setValue('isExam',0);
        GM_setValue('isView',0);
        $('button[onclick="_view_user_exam_paper()"]').click();
        setTimeout(function(){
            $('button[onclick="myCloseWindow()"]').click();
        },5000)
    }

    if(window.location.pathname.indexOf('/exam/student/exam/resource') !== -1){
        console.log('试卷内容页');
        //GM_setValue('answerList',JSON.stringify([]));
        var isExam = GM_getValue('isExam');
        var isView = GM_getValue('isView');

        setTimeout(function(){
            if(isExam == 1){
                setAnswer();
            }
            if(isView == 1){
                getAnswer();
            }
        },3000)

        function setAnswer(){
            var quesLen = $('.ui-question-group .ui-question').length;
            console.log(quesLen)
            var answerList = GM_getValue('answerList');
            if(!answerList){
                answerList = [];
            }else{
                answerList = JSON.parse(answerList);
            }
            console.log(answerList.length);
            for(var i=0;i<quesLen;i++){
                var item = $('.ui-question-group .ui-question').eq(i).find('.ui-question-options');
                var title = $('.ui-question-group .ui-question').eq(i).find('.ui-question-title .ui-question-content-wrapper').text().trim();
                //console.log(title);
                var answer = 'a';
                for(var j=0;j<answerList.length;j++){
                    if(title == answerList[j].title){
                        answer = answerList[j].answer;
                        break;
                    }
                }
                console.log(answer);
                var arr = {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5};
                if(answer.length == 1){
                    item.find('li').eq(arr[answer]).find('span').click();
                }else{
                    var abcd = answer.split('');
                    for(var k=0;k<abcd.length;k++){
                        if(item.find('li').eq(arr[abcd[k]]).hasClass('ui-option-selected') == false){
                            item.find('li').eq(arr[abcd[k]]).find('span').click();
                        }
                    }
                }
            }
        }

        function getAnswer(){
            var answerList = GM_getValue('answerList');
            if(!answerList){
                GM_setValue('answerList',JSON.stringify([]));
                answerList = [];
            }else{
                answerList = JSON.parse(answerList);
            }
            console.log(answerList.length)

            var quesLen = $('.ui-question-group .ui-question').length;
            console.log(quesLen)
            var newAnswerList = answerList;
            for(var i=0;i<quesLen;i++){
                var item = $('.ui-question-group .ui-question').eq(i).find('.ui-question-options');
                var title = $('.ui-question-group .ui-question').eq(i).find('.ui-question-title .ui-question-content-wrapper').text().trim();
                var answer = $('.ui-question-group .ui-question').eq(i).find('.ui-correct-answer .ui-question-options-order').text().trim();
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