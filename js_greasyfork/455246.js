// ==UserScript==
// @name         zzu评教
// @namespace    Coca
// @version      0.1
// @description  郑州大学研究生教育支撑平台评教自动填充
// @author       coca
// @match        http://gs2.zzu.edu.cn/stu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @require      https://code.jquery.com/jquery-3.x-git.min.js
// @downloadURL https://update.greasyfork.org/scripts/455246/zzu%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/455246/zzu%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cnt = 0
    var flag = true;
    alert("选择评教老师or批量提交本学期评教（推荐）");
    setInterval(function(){
        var model = document.querySelectorAll("div[class='ant-modal-content']");

        console.log(model);
        if(model.length > 0){
               
               //var inputs = document.getElementsByClassName("evaluate ant-input");
               var inputs =  $('.evaluate.ant-input');
           
               var score = "100";
               var proposal = "没有意见"
               for (var i = 0; i < inputs.length-1; i++) {
                  var evt = new UIEvent('input', {
                      bubbles: false,
                      cancelable: false
                  });

                   var inputbox = inputs[i];

                   //inputbox.setAttribute('value', score);
                   inputbox.value = score;
                   inputbox.dispatchEvent(evt);

               }
               inputs[inputs.length-1].focus();
               inputs[inputs.length-1].value = proposal;

               if(flag){
                   alert("当前老师已完成，点击下一个（后续不再提示，当输入框填充完成点击下一个）");
                   flag = false;
              }

               // 自动切换下一个老师 （慎用）
               //var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
               //for (var j = 0; j < inputs.length; j++) {
                   //if (btns[j].innerText = "下一个"){
                      // btns[j].click()
                   //}
               //}
             cnt = model.length;

        }




    }, 3000);









    // Your code here...
})();