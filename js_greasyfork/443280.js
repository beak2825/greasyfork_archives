// ==UserScript==
// @name        形势与政策合格录入（广城版）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  本脚本只适合于形势与政策成绩的录入（广城版）
// @author       liphone
// @match      http://jwcjwxt.gcp.edu.cn/js_main.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gcp.edu.cn
// @grant        none
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443280/%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96%E5%90%88%E6%A0%BC%E5%BD%95%E5%85%A5%EF%BC%88%E5%B9%BF%E5%9F%8E%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/443280/%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96%E5%90%88%E6%A0%BC%E5%BD%95%E5%85%A5%EF%BC%88%E5%B9%BF%E5%9F%8E%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

$(document).ready(function(){
    'use strict';

    $(".nav").append("<button id='auto'>输入合格</button>");

    $("#auto") .bind("click",function(){
       if ($("#frame_content").contents().find("#kcmc").text()=="形势与政策"){
          $("#frame_content").contents().find("#psb").val(0)
          $("#frame_content").contents().find("#qmb").val(100)
         if($("#frame_content").contents().find("#jfz").find("option:selected").text()=="二级制"){

             var i=0
             for(i=0;i<500;i++){
            $("#frame_content").contents().find("#DataGrid1_Dqm_"+i).val("合格")
             }

         }
         else{
             alert("请设置为二级制")
         }
       }

else{

alert("只用于形势与政策成绩输入")
}

 });



   })