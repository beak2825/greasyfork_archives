// ==UserScript==
// @name         QQ空间批量删除说说
// @namespace    none
// @version      1.0.0
// @description  主要用于在QQ空间网页版的说说栏目下进行批量删除说说
// @author       thbelief
// @include      *://user.qzone.qq.com/*
// @downloadURL https://update.greasyfork.org/scripts/385701/QQ%E7%A9%BA%E9%97%B4%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E8%AF%B4%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/385701/QQ%E7%A9%BA%E9%97%B4%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E8%AF%B4%E8%AF%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //延迟时间定义1s
    let delayTime = 1000; 
    let isStart=false;
    //这个用来存setTimeout对象
    var timeoutTmp;
    function deleteShuoShuo() { 
       
            //执行删除的方法
            document.querySelector('.app_canvas_frame').contentDocument.querySelector('.del_btn').click(); 
            setTimeout(toSureDelete, delayTime); 
            console.log("删除说说+1");
    } 
    function toSureDelete() { 
        if(isStart){
            //确定删除的方法
            document.querySelector('.qz_dialog_layer_btn').click(); 
            timeoutTmp=setTimeout(deleteShuoShuo, delayTime); 
        }else{
            console.log("停止确定！");
            alert("已停止删除说说功能！");
        }
        
    } 
    //调用此函数即可
    document.onkeydown = function (e) {
        if (!e) e = window.event;
        //如果是空格的话就执行
        if ((e.keyCode || e.which) == 32) {
            console.log("检测到 按下了空格键");
            if(isStart){
                isStart=false;
                // clearTimeout(timeoutTmp);
                console.log("停止删除说说！");
                
            }else{
                var r = confirm("是否批量删除说说？");
                if (r == true) {
                    isStart=true;
                    console.log("开始删除说说！");
                    deleteShuoShuo();
                } else {
                    console.log("取消删除说说！");
                }
                
            }
            
        }
    }

})();
