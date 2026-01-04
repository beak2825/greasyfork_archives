// ==UserScript==
// @name         WJX Auto Fill
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  停止内卷
// @author       windowpain
// @match        *://*.wjx.cn/vm/*
// @match        *://*.wjx.top/vm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.cn
// @grant        none
// @license none
// @downloadURL https://update.greasyfork.org/scripts/480672/WJX%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/480672/WJX%20Auto%20Fill.meta.js
// ==/UserScript==

(function() {
    'use strict';
const sid="23333";
const name="windowpain";
const major="CS";
const tel="13333333333";

function FuckWJX(){
    var list = $('.fieldset[pg="1"]').children();
    // var llen=list.length;
    var success=0;
    list.each((i,e)=>{
        const title=$(e).children('.field-label').children('.topichtml').text();
        if(mapKey(title,e)){success++;}
        else {console.log($(e));$(e).attr('style','border:2px solid red!important');}
    })
    if(success==list.length){
        $('.voteDiv').append('<p class="autofill-failed" style="color:green;font-size:2em">正在提交...</p>');
        $('.submitbtn').click();
    }else{
        $('.voteDiv').append('<p class="autofill-failed" style="color:red;font-size:2em">部分自动填充失败（匹配失败或类型错误）</p>');
    }
}

function mapKey(key,e){
    if($(e).children('.ui-input-text').children('input').length<1) return false;
    if(key.includes("学号")){
        $(e).children('.ui-input-text').children('input').val(sid);
    }
    else if(key==="姓名"){
        $(e).children('.ui-input-text').children('input').val(name);
    }
    else if(key.includes("专业")){
        $(e).children('.ui-input-text').children('input').val(major);
    }
    else if(key.includes("电话")||key.includes("手机")){
        $(e).children('.ui-input-text').children('input').val(tel);
    }
    else return false;
    return true;
}

    // Your code here...
    //setTimeout(function (){
    //   FuckWJX();
    //}, 500);
    $(document).ready(function(){
        $('.vote-header').append('<p class="tip-banner" style="color:#ffb600;text-align:center;font-size:1.5em;font-weight:bold;"><i>*点击任意输入框完成自动填充*</i></p>');
        $('input').on('click',FuckWJX);
    });

})();