// ==UserScript==
// @name         陕西继续教育自动答题
// @namespace    http://jxjy.xidian.edu.cn
// @version      0.1
// @description  通过自动填写答案后提取答案最终获取问题所有答案
// @license MIT
// @author       gf2024
// @noframes
// @match        http*://jxjy01.xidian.edu.cn/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at document-end
// @connect      www.sxzjpx.cn
// @downloadURL https://update.greasyfork.org/scripts/509291/%E9%99%95%E8%A5%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/509291/%E9%99%95%E8%A5%BF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 旧的
    // Your code here...

    function notify(msg, title){
        GM_notification(msg,title);
    }

    var examIDs = [['党史党纪专题学习','■'],['2024年工程发展与应用','◆'],['专业技术人员能力素质提升','●']];// 用考试标题取考试类型符号
    var examID = ''; // 当前的考试类型符号,用在key前边，好区分不同考试

    class Question {
        constructor(body, answerType, rightAnswer, answerIdx ) {
            this.body = body;
            this.answerType = answerType; // 0判断，1单选，2多选4项，3多选5项
            this.rightAnswer = rightAnswer;
            this.answerIdx = answerIdx;
        }
    }

    var answers = {
        rightWrong:[['T'],['F']],
        single:[['A'],['B'],['C'],['D']],
        multi4:[['A','B','C','D'],['B','C','D'],['A','C','D'],['A','B','D'],['A','B','C'],['A','B'],['B','C'],['A','C'],['A','D'],['B','D'],['C','D']],
        multi5:[['A','B','C','D','E'],['A','B','C','D'],['A','B','C','E'],['A','B','D','E'],['A','C','D','E'],['B','C','D','E'],
                ['B','C','D'],['A','C','D'],['A','B','D'],['A','B','C'],['A','B','E'],['A','C','E'],['A','D','E'],['B','C','E'],['B','D','E'],['C','D','E'],
                ['A','B'],['B','C'],['A','C'],['A','D'],['B','D'],['C','D'],['A','E'],['B','E'],['C','E'],['D','E']]
    };

    var currentQuestions = [];

    console.log('添加填写试卷菜单');

    GM_registerMenuCommand('填写试卷', startQuestions);
    GM_registerMenuCommand('复制已回答题目', answerdQuestion);
    GM_registerMenuCommand('清除保存试题', clearQuestion);

    function getExamID(name){
        var examTitle = name ?? $('.s_coursetit').text();
        console.log('title:'+examTitle);

        examIDs.forEach(function(arr){
            if(examTitle.indexOf(arr[0])>=0){
                examID = arr[1];
                return;
            }
        });
    }

    function clearQuestion(){
        var keys = GM_listValues();
        //console.log(keys);
        keys.forEach(function(key){
            GM_deleteValue(key);
        });
    }

    // 查看已有答案的题
    function answerdQuestion(){
        getExamID()
        if(examID.length === 0){
            let cname = prompt('课程名？');
            if(cname){
                getExamID(cname);
            }
        }

        if(examID.length === 0){
            notify('请先填写试卷');
            return;
        }
        var keys = GM_listValues();
        //console.log(keys);
        var ansArr = [];
        keys.forEach(function(key){
            if(key.indexOf(examID) !== 0){
                return;
            }
            var q = GM_getValue(key);
            var a = q.rightAnswer;
            if(a && a.length>0){
                //console.log(q);
                ansArr.push(q);
            }
        });
        console.log(ansArr);

        // 整理格式拷贝到剪贴板
        if(ansArr.length===0){
            return;
        }

        ansArr.sort(function(a,b){
            if(a.answerType == b.answerType){
                return 0;
            }else if(a.answerType < b.answerType){
                return -1;
            }else{
                return 1;
            }
        });

        var copyTxt = '';
        ansArr.forEach(function(ans){
            copyTxt += $.trim(ans.body) +'\r\n';
            if(ans.answerType === 0){
                copyTxt += '【'+ (ans.rightAnswer[0] == 'T' ? '对':'错') +'】';
            }else{
                copyTxt += '【'+ ans.rightAnswer.join(',') +'】';
            }
            copyTxt += '\r\n\r\n';
        });
        //console.log(copyTxt);

        GM_setClipboard(copyTxt, 'text');
        GM_notification({title:'通知',text:'有答案试题已复制到剪贴板'});

    }

    // 保存试题答案并设置为正确答案或测试下一个答案
    function startQuestions(){
        console.log('开始填试卷');
        var $frm = $('#mainCont').contents();
        console.log($frm);
        $frm = $frm.find('#mainFrame').contents();
        console.log($frm);
        var $doc = $('#mainCont').contents().find('#mainFrame').contents();
        if($doc.find('.bank_test').length != 1){
            notify('当前不是试卷页');
            return;
        }

        getExamID();

        if(examID.length < 1){
            notify('不能处理当前试卷');
            return;
        }

        var q = getQuestions();
        currentQuestions = q;
        //console.log(GM_listValues());

        GM_registerMenuCommand('提取答案', startSaveAnswers);
    }

    // 提取当前试卷试题保存，返回试题key Array
    function getQuestions(){
        var $doc = $('#mainCont').contents().find('#mainFrame').contents();
        $doc.find('.tipNodo').remove();
        var q = [];
        var $tables = $doc.find('.test_item');
        $tables.each(function(i,ele){
            q.push(addQuestion($(ele)));
        });

        answerQuestion($tables, q);

        console.log(q);
        return q;
    }

    // 存储试题，返回key,eq:answer7567
    function addQuestion($table){
        console.log($table.html());
        var $r = $(':radio,:checkbox', $table);
        var answerType = 1;
        var $r0 = $r.first();

        if($r0.attr('type') == 'checkbox'){
            if($r.length === 5){
                answerType = 3;
            }else{
                answerType = 2;
            }
        }else if($r.length === 2){
            answerType = 0;
        }

        var question = $('.test_item_tit', $table).text().trim().replace(/^\s*\d+\s*\.\s*/,'');
        //console.log(question);
        var name = examID + question;

        var item = GM_getValue(name);
        console.log(item);
        if(item === undefined){
            item = new Question(question,answerType,[],0);
            console.log(item);
            GM_setValue(name, item);
        }

        return name;
    }

    // 利用已有答案答题
    function answerQuestion($tables, keys){
        keys.forEach(function(key, i){
            var q = GM_getValue(key);
            var $table = $tables.eq(i);
            var answer = [];
            if(q.rightAnswer.length > 0){
                answer = q.rightAnswer;
            }else{
                var answerArr = getAnswerArr(q.answerType);
                answer = answerArr[q.answerIdx];
            }
            for(var j = 0; j < answer.length; j++){
                $table.find('[value="'+ answer[j] +'"]').click();
            }

        });
    }

    function getAnswerArr(answerType){
        switch(answerType){
            case 0:
                return answers.rightWrong;
            case 1:
                return answers.single;
            case 2:
                return answers.multi4;
            case 3:
                return answers.multi5;
        }
    }

    function startSaveAnswers(){
        var $doc = $('#mainCont').contents().find('#mainFrame').contents();

        if($doc.find('.test_right').length < 1){
            notify('当前不是成绩页');
            return;
        }
        if(examID.length < 1){
            notify('需要先填写试卷');
            return;
        }
        var ans = getRightAnswers();

        var qs = currentQuestions;

        qs.forEach(function(key, i){
            var q = GM_getValue(key);
            if(q.rightAnswer.length > 0){
                return;
            }
            q.rightAnswer = ans[i];
            GM_setValue(key, q);

            console.log(q);
        });

        notify('已提取正确答案'+ ans.length +'个');

        /* 逐条测试的方法
        var ans = getAnswersRight();
        qs.forEach(function(key, i){
            var q = GM_getValue(key);
            if(q.rightAnswer.length > 0){
                return;
            }
            var right = ans[i];
            var answerArr = getAnswerArr(q.answerType);
            if(right){
                // 保存正确答案
                q.rightAnswer = answerArr[q.answerIdx];
            }else{
                q.answerIdx ++;
                if(q.answerIdx === answerArr.length-1){
                    q.rightAnswer = answerArr[q.answerIdx];
                }
            }
            GM_setValue(key, q);

            console.log(q);
        });
        */
    }
    // 取所有题的正确答案
    function getRightAnswers(){
        var $doc = $('#mainCont').contents().find('#mainFrame').contents();
        var $answerEles = $doc.find('.test_item .test_item_key_tit');
        var arr = [];
        $answerEles.each(function(i,ele){
            var answer = $.trim($(ele).text().replace('参考答案：',''));
            if(answer === '对'){
                arr.push(['T']);
            }else if(answer === '错'){
                arr.push(['F']);
            }else{
                arr.push(answer.split(''));
            }
        });
        console.log('正确答案');
        console.log(arr);
        return arr;
    }
    // 放弃，取currentQuestions所有答案是否正确,返回[true,false,...]
    function getAnswersRight(){
        var $trs = $('#iframe-win-test').contents().find('table:first').find('tr:gt(0)');
        var rightArr = [];
        $trs.each(function(){
            //console.log($(this).find('td:last').text());
            rightArr.push($(this).find('td:last').text().indexOf('×') < 0);
        });
        console.log(rightArr);
        return rightArr;
    }

})();