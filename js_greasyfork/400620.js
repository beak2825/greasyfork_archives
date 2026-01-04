// ==UserScript==
// @name         cme_91huayi_auto_exam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_cc.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @require      https://cdn.bootcss.com/blueimp-md5/1.0.1/js/md5.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400620/cme_91huayi_auto_exam.user.js
// @updateURL https://update.greasyfork.org/scripts/400620/cme_91huayi_auto_exam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //http://cme3.91huayi.com/pages/exam.aspx?cwid=f0655634-01b1-4856-aabf-a4fe0187e4d8#
    //http://cme3.91huayi.com/pages/exam_result.aspx?cwid=f0655634-01b1-4856-aabf-a4fe0187e4d8
    //http://cme3.91huayi.com/course_ware/course_ware_cc.aspx

    console.log('91huayi_auto_exam');

    //问题分隔符
    var strSplitArryQuestion = "@&"
    //答案前缀
    var prefixAnswer = "ANS_";
    //自动开始考试
    var auto_start_exam = true;
    //自动提交
    var auto_submit = true;
    //自动重新考试
    var auto_replay_exam = true;
    //自动进入下一课程
    var auto_next_course = true;
    //考试通过判断字符
    var pass_exame_key = '通过';
    //课程完成判断字条
    var course_complete_key='完成';
    //答案列表
    var answer_key = ['A','B','C','D','E','F','G','H'];

    var currentURL = window.location.href;
    //正则获取cwid
    var cwid_regex=/(?<cwid>\d*)/

    //正则判断页面
    var course_ware = /[course_ware_cc.aspx|course_ware_polyv]/;
    var exam = /exam.aspx/;
    var exam_result = /exam_result.aspx/
    //获取参数
    var cwid = getParam(currentURL,'cwid');

    var course_question =[];
    var course_question_answer =[];
    //当前自动答题序号
    var question_answer_index =[];

    var course_complete =getCookie("course_complete_" + cwid);
    course_complete = course_complete? parseInt(course_complete):0;

    if(course_complete==1){
        return;
    }
    //console.log("cwid:" + cwid);
    //console.log(currentURL);

    if(exam.test(currentURL)){
       main();
    }else if(exam_result.test(currentURL)){
        handExamResult();
    }else if(course_ware.test(currentURL)){
        enableStartExam();
    }

    //启用考试按钮
    function enableStartExam(){
        var btn_exam = $("#jrks");
        btn_exam.attr('target','_blank')
        //custom_player_stop();
        // console.log("enableStartExam");
        showExam(true);
        if(auto_start_exam){
            var p = $("<p>   </p>");
            p.appendTo(btn_exam);
            setTimeout(() => {
                p.trigger('click');
            }, 1000);
        }
    }

    function getAnswerIndex(key){
        return $.inArray(key,answer_key);
    }

    // 答题
    function main(){
        var questionArray = getCourseQuestions();

        //console.log("questionArray:" + questionArray);

        var current_answer_index = getQuestionAnswerIndex();
        current_answer_index = current_answer_index ? current_answer_index :0;
        // switch(current_answer_index){
        //     case 0:
        //         fiveStar();
        //         first_step_auto_answer();
        //         break;
        //     default:
        //         next_step_auto_answer();
        //         break;
        // }
        if(current_answer_index ==0){
            fiveStar();
        }
        next_step_auto_answer();
    }

    function fiveStar(){
        $(".five-stars").click();
    }
    // function first_step_auto_answer(){
    //     var current_answer_index = question_answer_index[cwid];
    //     current_answer_index = current_answer_index ? current_answer_index:0;
    //     var count = getQuestionCount();
    //     for(var i=0;i<count;i++){
    //        selectAnwser(i,current_answer_index);
    //     }
    //     current_answer_index = current_answer_index + 1;
    //     setCookie('question_answer_index_'+cwid,current_answer_index);
    //     submitAnswer();
    // }

    function next_step_auto_answer(){
        var current_answer_index = getQuestionAnswerIndex();
        var questionArray = getCourseQuestions();
        var answer = getCourseQuestionAnswer();
        var md5_answer = getMD5CourseQuestionAnswer();
        var count = getQuestionCount();

        console.log(answer)
        console.log(md5_answer)

        if(current_answer_index>5) return;
         for(var i=0;i<count;i++){
             var question = questionArray[i];

             var md5_question =prefixAnswer + md5(question);
             var md5_ans = md5_answer[md5_question];
             if(!md5_ans){
                selectAnwser(i,current_answer_index);
             }else{
                selectAnwser(i,getAnswerIndex(md5_ans));
             }

            //  var ans = answer[question];
            //  if(!ans){
            //     selectAnwser(i,current_answer_index);
            //  }else{
            //     selectAnwser(i,getAnswerIndex(ans));
            //  }
        }
        current_answer_index +=1;
        setCookie('question_answer_index_'+cwid,current_answer_index);
        setTimeout(function(){
            submitAnswer();
        },1000);
    }

    //处理结果
    function handExamResult(){
        console.log("handExamResult");
        if( isPassExam() || isCourseComplete()){
            courseComplete();
            if(auto_next_course){
                next_course();
            }
            return;
        }


        var wrongArry = getWrongArray();
        var md5_wrongArray = wrongArry.map(function(v,i){
            return md5(v);
        })
        var current_answer_index = getQuestionAnswerIndex();
        var pre_current_answer_index = current_answer_index ? current_answer_index -1:0;
        var key = answer_key[pre_current_answer_index];
        //console.log("上一次测试值："+ key);
        var questionArray = getCourseQuestionsFromCookie();
        var answer = getCourseQuestionAnswer();
        var md5_answer = getMD5CourseQuestionAnswer();
        if(current_answer_index >5) {
            console.log("answer"+ JSON.stringify(answer));
            return;
        }

        for(var i =0; i< questionArray.length; i++){
         var question = questionArray[i];
            // if($.inArray(question,wrongArry) ==-1){

            var md5_key = md5(question)
            if($.inArray(md5_key,md5_wrongArray) ==-1){
               var  md5_question = prefixAnswer + md5_key;
               var hv = md5_answer[md5_question];
               hv = hv ? hv:key;
               md5_answer[md5_question] = hv;

                var v = answer[question];
                v = v ? v:key;
                answer[question] = v;
            }
        }
        var str_answer = JSON.stringify(answer);
        var str_md5_answer = JSON.stringify(md5_answer);

        setCookie("course_question_answer_" + cwid,str_answer);
        setCookie("course_question_answer_md5_" + cwid,str_md5_answer);
        console.log(answer);
        console.log(md5_answer);
        replay_exame();
        //console.log("wrongArry"+wrongArry);
    }

    function deleteAllCookie(){
        delCookie("course_question_"+cwid);
        delCookie("course_question_answer_"+cwid);
        delCookie("course_question_answer_md5"+cwid);
        delCookie("question_answer_index_"+cwid);
    }

    function printAnswer(){
        var answer = getCourseQuestionAnswer();
        console.log("answer" + JSON.stringify(answer));
    }

    function courseComplete(){
        setCookie("course_complete_" + cwid,1);
        printAnswer();
        deleteAllCookie();
        return;
    }

    function getCourseQuestions(){
        var arryQuestion=[];
        var count = getQuestionCount();
        for(var i = 0;i< count;i++){
            var qid = '#gvQuestion_question_'+i;
            arryQuestion.push($(qid).text().substring(2));
        }
        var strArryQuestion ='';
        $.each(arryQuestion,function(i,v){
            strArryQuestion += strArryQuestion.length ==0 ? v: strSplitArryQuestion + v;
        })

        setCookie("course_question_" + cwid,strArryQuestion);
        return arryQuestion;
    }
    function getCourseQuestionsFromCookie(){
        var arryQuestion = getCookie("course_question_" + cwid);
        if(arryQuestion){
            return arryQuestion.split(strSplitArryQuestion);
        }
    }

    function getQuestionAnswerIndex(){
        var index = getCookie('question_answer_index_'+cwid);
        return index ? parseInt(index):0;
    }

    function getCourseQuestionAnswer(){
        var arryAnswer = getCookie("course_question_answer_" + cwid);
        if(arryAnswer){
            return $.parseJSON(arryAnswer);
        }else{
            arryAnswer ={};
            return arryAnswer;
        }
    }

   function getHashCourseQuestionAnswer(){
        var arryAnswer = getCookie("course_question_answer_hash_" + cwid);
        if(arryAnswer){
            return $.parseJSON(arryAnswer);
        }else{
            arryAnswer ={};
            return arryAnswer;
        }
    }

    function getMD5CourseQuestionAnswer(){
        var arryAnswer = getCookie("course_question_answer_md5_" + cwid);
        if(arryAnswer){
            return $.parseJSON(arryAnswer);
        }else{
            arryAnswer ={};
            return arryAnswer;
        }
    }

    //获取问题
    function getQuestionCount(){
        return $("table[class='tablestyle']").length;
    }
    //获取答错题目
    function getWrongArray(){
        var arryWrong = [];
        var li_list = $("div[class='left']>dl>dd")
        var count =li_list.length;
        for(var i=0;i<count;i++){
           arryWrong.push($(li_list[i]).attr("title").trim());
        }
        return arryWrong;
    }

    //选择答案
    function selectAnwser(questionIndex,itemIndex){
        var anwser_list = $("table[class='tablestyle2']")[questionIndex];
        var anwser_item = $(anwser_list).find("input")[itemIndex];
        $(anwser_item).click();
    }

    //提交
    function submitAnswer(){
        if(!auto_submit) return;
        var btnSumbit = $("#btn_submit");
        $(btnSumbit).click();
    }

    //重新考试
    function replay_exame(){
        if(!auto_replay_exam) return ;
        var btn_relay_exame = $("body > div.case3 > div.left > div > input.bule");
        if(btn_relay_exame.length =1){
            btn_relay_exame.click();
        }else{
            console.log('btn_replay_exam not find');
        }
    }
    //判断考试通过
    function isPassExam(){
        var result_flag = false;
        var pass_exam_obj = $("body > div.case4 > b");
        if(pass_exam_obj){
            var pass_str = pass_exam_obj.html();
            if(pass_str){
                if(pass_str.indexOf(pass_exame_key) == -1){
                    result_flag = false;
                }else{
                    result_flag = true;
                }
            }
        }
        return result_flag;
    }

    function isCourseComplete(){
        var result_flag = false;
        var course_complete_obj =$("body > div.case2 > b");
        if(course_complete_obj){
            var complete_str = course_complete_obj.html();
            if(complete_str){
                if(complete_str.indexOf(course_complete_key) == -1){
                    result_flag = false;
                }else{
                    result_flag=true;
                }
            }
        }
        return result_flag;
    }

    //点击下一课程
    function next_course(){
        var inputs = $("body > div.case3 > div.left > dl > dd> input[class='one']");
        var undo_inputs = inputs.map(function(v,i){
            if($(v).value ==""){
                return v;
            }
        });
        if(undo_inputs.length >0){
            $(undo_inputs[0]).click();
        }
    }
    //==================================================基础方法==========================================================//

    function setCookie(key, value,day) {
       // var Days = 30;
       // var exp = new Date();
       // exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
       // //document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
       // document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";

        if(day){     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
            var expires = day * 24 * 60 * 60 * 1000;
            var date = new Date(+new Date()+expires);
            document.cookie = key + "=" + value + ";expires=" + date.toUTCString();
        }else{
            document.cookie = key + "=" + value;
        }
    }

    function getCookie(key) {
        var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg)){
            return unescape(arr[2]);
        } else{
            return "";
        }
    }

    function delCookie(key) {
        setCookie(key,'',-1);
       // var exp = new Date();
       // exp.setTime(exp.getTime() - 1);
       // var cval = getCookie(key);
       // if (cval != null){
       //     document.cookie = key + "=" + escape('') + ";expires=" + exp.toGMTString();
       // }
    }

    //获取字符串的哈希值
    function getHashCode(str,caseSensitive){
        if(!caseSensitive){
            str = str.toLowerCase();
        }
        // 1315423911=b'1001110011001111100011010100111'
        var hash  =   1315423911,i,ch;
        for (i = str.length - 1; i >= 0; i--) {
            ch = str.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }

        return  (hash & 0x7FFFFFFF);
    }

      //从url获取参数
    function getParam(url,key){
        var arry = url.split("?");
        var arry_params = arry[1].toString().split("&");
        var params=[];
        for(var i =0;i< arry_params.length ;i++){
            var key_value = arry_params[i].split("=");
            params[key_value[0]]= key_value[1];
        }
        return params[key];
    }

})();