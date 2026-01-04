// ==UserScript==
// @name         华南理工大学高校邦实用脚本
// @namespace    i-meto.com
// @version      0.1.1
// @description  关闭视频独占限制，自动勾选测验题答案
// @author       METO
// @match        *://*.class.gaoxiaobang.com/class/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33106/%E5%8D%8E%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E9%AB%98%E6%A0%A1%E9%82%A6%E5%AE%9E%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/33106/%E5%8D%8E%E5%8D%97%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E9%AB%98%E6%A0%A1%E9%82%A6%E5%AE%9E%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
'use strict';

(function(){
    var lock=false;
    function moocHacker(){
        // 解放视频
        var vid=document.getElementById("vjs_video_3_html5_api");
        if(vid!=undefined)vid.play();
        // 自动填写答案
        var chk=document.getElementById("quizSubmit");
        if(chk!=undefined&&!lock){
            questionList.forEach(function(item,index){
                item.answerList.forEach(function(item,index){
                    if(item.correct=="1"){
                        var answerId=item.answerId;
                        Array.prototype.forEach.call(document.getElementsByTagName('i'),function(item,index){
                            if(item.getAttribute('answer_id')==answerId)item.click();
                        });
                    }
                });
            });
            alert("答案填写完毕");
            lock=true;
        }
    }
    window.setInterval(moocHacker,1000);
})();
