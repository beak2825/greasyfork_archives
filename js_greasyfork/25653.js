// ==UserScript==
// @name         KF_fastreply
// @namespace    https://greasyfork.org/users/14059
// @version      0.2
// @description  fastreply for Kf
// @author       setycyas
// @grant        none
// @include     http://*2dkf.com/*
// @include     http://*ddgal.com/*
// @include     http://*9moe.com/*
// @include     http://*kfgal.com/*
// @downloadURL https://update.greasyfork.org/scripts/25653/KF_fastreply.user.js
// @updateURL https://update.greasyfork.org/scripts/25653/KF_fastreply.meta.js
// ==/UserScript==

/*****************
重新绑定快速回复的方法
*****************/
postreply=function(txta,txtb){
    //找到快速回复的文本区域
    var replyArea=document.getElementsByTagName("textarea")[0];
    if(typeof document.FORM != "undefined"){
        //添加引用字符串
        replyArea.focus();
        replyArea.value+= '[quote]'+txta+'[/quote]\r\n';
        //添加关键词
        if(document.FORM.diy_guanjianci.value!==''){
            document.FORM.diy_guanjianci.value += ','+txtb;
        }else{
            document.FORM.diy_guanjianci.value = txtb;
        }
    }
};

/*****************
脚本运行提示
*****************/
console.log('fast reply script for KF by setycyas running!');
