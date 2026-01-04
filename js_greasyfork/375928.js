// ==UserScript==
// @name         广铁集团团体订票Chrome支持
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  支持批量导入消息，支持录入或修改
// @author       Echowxsy
// @match        http://eticket.gzrailway.com.cn/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/375928/%E5%B9%BF%E9%93%81%E9%9B%86%E5%9B%A2%E5%9B%A2%E4%BD%93%E8%AE%A2%E7%A5%A8Chrome%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/375928/%E5%B9%BF%E9%93%81%E9%9B%86%E5%9B%A2%E5%9B%A2%E4%BD%93%E8%AE%A2%E7%A5%A8Chrome%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function checkStr(str) {
        var newStr=""
        var index=0;
        while (str!=""){
            if (str.indexOf("\n")>=0){
                var str1=str.substring(0,str.indexOf("\n"));
                str=str.substring(str.indexOf("\n")+1);
            }else{
                str1=str;
                str="";
            }
            if (str1.indexOf("\r")==str1.length-1) str1=str1.substring(0,str1.length-1);
            index++;
            var name=str1.split(/\s+|,/)[0];
            var idn=str1.split(/\s+|,/)[1];

            if (index>1) newStr+="\n";
            newStr+="2,"+name+","+idn;
        }
        return newStr;
    }
    function hook_check(str){
        cert_cmt.ct.value=checkStr(str);
        cert_cmt.submit();
    }
    unsafeWindow.check = function () {
        var tx=$('textarea[name="tx"]')[0];
        hook_check(tx.value);
    }
    let inputObjs=[]
    function hook_commit(in_seq,name,cert){
        if(update_cert(in_seq,name,cert)){
            var commitStr = 'input[name="commit'+in_seq+'"]';
            var commitObj = $(commitStr)[0];
            commitObj.value = '更新成功';
            setTimeout(function () {
                commitObj.value= '提交';
            }, 3000);
        };
    }
    function cleanOnclick(){
        var index=1
        while (index<100){
            var nameStr='input[name="name'+index+'"]';
            var idStr='input[name="cert_no'+index+'"]';
            var commitStr = 'input[name="commit'+index+'"]';
            var nameObj = $(nameStr)[0];
            var idObj = $(idStr)[0];
            var commitObj = $(commitStr)[0];
            if(!nameObj||!idObj||!commitObj) return;
            nameObj.setAttribute('onkeypress','');
            nameObj.setAttribute('onkeyup','');
            idObj.setAttribute('onkeypress','');
            idObj.setAttribute('onkeyup','');
            commitObj.setAttribute('onclick','commit('+index+')');
            index++;
        }

    }
    cleanOnclick()
    unsafeWindow.commit = function (index) {
        var nameStr='input[name="name'+index+'"]';
        var idStr='input[name="cert_no'+index+'"]';
        var nameObj = $(nameStr)[0];
        var idObj = $(idStr)[0];
        hook_commit(index,nameObj.value,idObj.value);
    }
})();