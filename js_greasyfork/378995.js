// ==UserScript==
// @name         课件学时
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *://jxwww2.edu-edu.com.cn/lesson*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378995/%E8%AF%BE%E4%BB%B6%E5%AD%A6%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/378995/%E8%AF%BE%E4%BB%B6%E5%AD%A6%E6%97%B6.meta.js
// ==/UserScript==

'use strict';
courseRTE.setValue=function(key,value){
    if(courseRTE.requireRTE){
        _player.setValue(key,100);
        console.info("已提交成绩");
    }
};
_know_question.popup=function(tagId){
    if(!_know_question.enable) return;
    _know_question.pause();
    var len=_knowList.length,content="";
    for(var i=0;i<len;i++){
        if(tagId==_knowList[i].id){
            content=_knowList[i].content;
            break;
        }
    }
    var popup=$('#ui-popup-window');
    popup.html(content);
    _know_question.submit();
    $(".answer",popup).each(function(){
        $(this).hide();
    });
};
_know_question.submit=function(){
    var popup=$('#ui-popup-window');
    var score=0;
    $(".question",popup).each(function(){
        var t=$(this);
        var type=t.attr("type");
        if(type=="true_false"||type=="single_choice"){
            if($(".options li.selected",t).attr("code") && t.attr("answer").toLowerCase()==$(".options li.selected",t).attr("code").toLowerCase()){
                score=score+parseInt(t.attr("score"));
            }
        }else if(type=="multi_choice"){
            var a="";
            $(".options li.selected",t).each(function(){
                a=a+$(this).attr("code");
            });
            if(t.attr("answer").toLowerCase()==a.toLowerCase()){
                score=score+parseInt(t.attr("score"));
            }
        }
    });
    $(".answer",popup).each(function(){
        $(this).show();
    });
    var questions=$(".popup-questions",popup);
    score=100;
    _know_question.saveScore(questions.attr("knowid"),score+"");
    var passScore=60;
    var status="uncomplete";
    var tt=$(".popup-questions-title",questions);
    if(score>=passScore){
        tt.after("回答正确");
        status="completed";
    }else{
        tt=$(".popup-questions-title",questions);
        tt.after('回答错误');
    }
    _know_question.resume();
};