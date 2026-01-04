// ==UserScript==
// @name         扇贝 单词小助手
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  空格进入下一个单词功能 拼写打卡更方便
// @author       光影
// @match        https://web.shanbay.com/wordsweb/#/study*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454196/%E6%89%87%E8%B4%9D%20%E5%8D%95%E8%AF%8D%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454196/%E6%89%87%E8%B4%9D%20%E5%8D%95%E8%AF%8D%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        GM_addStyle('.Layout_page__2Wedt{padding-bottom:0px;}')
        GM_addStyle('.index_btnBox__pXO_l{margin-bottom: 100px;}')
        const noList = ['Footer_footerWrap__L4iuD','Message_message__w-TNe','BayTrans_tag__I6e7V']
        for (var i of noList){
            GM_addStyle('.'+ i+'{display:none;}')

        }
        
        document.onkeydown = function(event){
                    if(event.keyCode==32){
                        // 事件 
                        var nextOne = document.querySelectorAll(".StudyPage_nextBtn__1ygGn")[0]
                        nextOne.click()
                        console.log("按下了空格键")
                    }
                }






    };
})();