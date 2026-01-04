// ==UserScript==
// @name         评教助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Zjm
// @match        http://zhjw.scu.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://zhjw.scu.edu.cn/student/teachingEvaluation/evaluation/index
// @grant unsafeWindow
// @run-at document-end
//
// @downloadURL https://update.greasyfork.org/scripts/375628/%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/375628/%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';
    function evaluateTeacher(){
        for(var i=5;i<document.StDaForm.elements.length;i+=5){
            document.StDaForm.elements[i].checked=true;
        }
        document.StDaForm.elements[document.StDaForm.elements.length-1].value="很好的老师";
        unsafeWindow.toEvaluation();
    }
    function clickBtn(){
        for(var i=6;i<document.WjList.length;i++){
            if(document.WjList.elements[i].innerText=="查看"){
                continue;
            }
            console.log('Pressing btn '+i);
            document.WjList.elements[i].onclick();
            return;
        }
        delCookie('evaluationFlag');
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function setCookie(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?"" :";expires="+exdate.toUTCString() + ";path=/");
    }
    function delete_cookie( name ) {
      document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    function init(){
        var start=false;
        if(getCookie('evaluationFlag')==null){
            start=confirm('是否启用自动评教?');
        }else{
            start=true;
        }
        if(start){
            setCookie('evaluationFlag','1',1);
            if(window.location.href=='http://zhjw.scu.edu.cn/student/teachingEvaluation/evaluation/index'){
                //alert('开始评教!');
                clickBtn();
                setTimeout(clickBtn,1000*60*2);
    }else if(window.location.href=='http://zhjw.scu.edu.cn/student/teachingEvaluation/teachingEvaluation/evaluationPage'){
             setInterval(evaluateTeacher,2*61*1000);
    }}
    }
    setTimeout(init,2000);
})();