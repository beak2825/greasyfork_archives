// ==UserScript==
// @name         医疗
// @namespace    http://web.yuyehk.cn/
// @version      0.1
// @description  雨夜工作室实用系列!
// @author       YUYE
// @match        https://tcs.jiyunhudong.com/workprocess/*
// @icon         http://web.yuyehk.cn/static/upload/image/20181002/1538414702742948.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455027/%E5%8C%BB%E7%96%97.user.js
// @updateURL https://update.greasyfork.org/scripts/455027/%E5%8C%BB%E7%96%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(event){ //可出
        console.log("按下:"+event.key+"键:"+event.keyCode);
        var 可出,不可出,敏感词,低质词条,驳回
        if(event.keyCode == 49){
            可出 = document.querySelector("#mark_result_pass_pass")
            可出.click()
        }
        if(event.keyCode == 50){ //驳回+敏感
            不可出 = document.querySelector("#mark_result_fail_fail")
            敏感词 = document.querySelector("#fail_reason_l1_minganci")
            可出 = document.querySelector("#mark_result_pass_pass")
            if(可出.classList.length == 3){
            可出.click()
            }
            if(不可出.classList.length == 3 && 敏感词.classList.length == 2){
                敏感词.click()
            }else{
                不可出.click()
                敏感词.click()
            }
        }
        if(event.keyCode == 51){ //驳回+低质词条
            驳回 = document.querySelector("#mark_result_fail_fail")
            低质词条 = document.querySelector("#fail_reason_l1_dizhicitiao")

            if(驳回.classList.length == 3 && 低质词条.classList.length == 2){
                低质词条.click()
            }else{
                驳回.click()
                低质词条.click()
            }

        }
    }

    // Your code here...
})();