// ==UserScript==
// @name         天津工业大学新评教系统
// @version      1.0
// @description  烦死了
// @author       zly
// @match        https://tiangong.mycospxk.com/*
// @namespace    https://greasyfork.org/users/780254
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446653/%E5%A4%A9%E6%B4%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%96%B0%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/446653/%E5%A4%A9%E6%B4%A5%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%96%B0%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // // document.getElementById("main-layout-inner-content-main-inner-3jeur").$(style.z-index).val(0);
    // $('#main-layout-inner-content-main-inner-3jeur').attr('style','height: 100%; overflow-y: auto; position: relative; z-index: 0');
    // // console.log($('#main-layout-inner-content-main-inner-3jeur').attr('z-index'));
    var checkDiv = document.createElement("div");
    checkDiv.setAttribute("id","test");
    document.body.appendChild(checkDiv);
    var testBlock = document.getElementById("test");
    testBlock.style.height="150px";
    testBlock.style.width="150px";
    testBlock.style.position="absolute";
    testBlock.style.top="300px";
    testBlock.style.left="0px";
    testBlock.style.background="#020633";
    testBlock.style.zindex='1000';
    testBlock.innerHTML+='<div style="margin:10px;"></b></li><button id="start" onClick="AutoFill()" >开始快速教评！</button></div>'


   window.AutoFill=function(){
    alert("按下空格之后再提交")
    let radios = document.getElementsByClassName("ant-radio-input");
    console.log(radios.length);
    for(var j=0;j<radios.length;j=j+5){
            radios[j].click();
    }

    var textareas = document.getElementsByClassName("ant-input index_UEditoTextarea-3MlcS");
    console.log(textareas.length);
    for(var h=0;h<textareas.length;h++){
        var content="没有";
        console.log(textareas.length);
        if(h==1){
            content="该节课很有创意，对教材把握透彻、挖掘深入、处理新颖，针对学生基础和学生发展性目标，设计各种教学活动，引导学生自主学习，有条理地将旧知识综合进行运用。";
        }else if(h==0){
            content="该节课很有创意，对教材把握透彻、挖掘深入、处理新颖，针对学生基础和学生发展性目标，设计各种教学活动，引导学生自主学习，有条理地将旧知识综合进行运用。";
        }else if(h==2){
            content="该节课很有创意，对教材把握透彻、挖掘深入、处理新颖，针对学生基础和学生发展性目标，设计各种教学活动，引导学生自主学习，有条理地将旧知识综合进行运用。";
        }
      textareas[0].select();
      textareas[h].value=content;
    }
}
}

)();