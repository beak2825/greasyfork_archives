// ==UserScript==
// @name         SCNU 教务系统 学生评价 辅助工具
// @namespace    https://github.com/FaterYU
// @version      1.1
// @description  SCNU教务系统学生评价辅助工具
// @author       FaterYU
// @match        https://jwxt.scnu.edu.cn/xspjgl/xspj_cxXspjIndex.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scnu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457394/SCNU%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%20%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%20%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/457394/SCNU%20%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%20%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%20%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function evaluateCourse() {
        const course=document.getElementsByClassName('ui-row-ltr');
        for(var i=0;i<course.length;i++){
            if(course[i].innerText[0]==='未'){
                course[i].click()
                setTimeout(()=>{
                    console.log(document.getElementsByClassName('radio-pjf').length)
                },3000)
                setTimeout(function() {
                    const RadioList = document.getElementsByClassName('radio-pjf');
                    for(var i=0;i<50;i+=5){
                        RadioList[i].checked=true;
                    }
                } , 3500);
                break;
            }
        }
    }
    // evaluateCourse()
    var check = setInterval(()=>{
        const success=document.getElementById('btn_ok');
        if(success){
            success.click();
        }
    },500);

    var evaluate= setInterval(()=>{
        if( document.getElementsByClassName('radio-pjf').length>49){
            setTimeout(()=>{
                evaluateCourse()
            },500)
        }
    },500)
})();