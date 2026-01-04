// ==UserScript==
// @name         北京市公共必修课
// @namespace    https://www.ttcdw.cn/p/course/v
// @version      0.1
// @description  北京市公共必修课网看课自动辅助
// @license MIT
// @author       Oldyuan
// @match        *://www.ttcdw.cn/*
// @run-at       document-idle
// @grant GM_xmlhttpRequest
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/487455/%E5%8C%97%E4%BA%AC%E5%B8%82%E5%85%AC%E5%85%B1%E5%BF%85%E4%BF%AE%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/487455/%E5%8C%97%E4%BA%AC%E5%B8%82%E5%85%AC%E5%85%B1%E5%BF%85%E4%BF%AE%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    //'use strict';



    function kanke() {

       if (document.querySelector("#comfirmClock")) {
         //处理各种突发事件
            console.log('有按钮');
        if (document.querySelector("#comfirmClock").innerText == "确定打卡") {

            document.querySelector("#comfirmClock").click();
 console.log('确定打卡');
        }
       if (document.querySelector("#comfirmClock").innerText == "继续学习") {

                document.querySelector("#comfirmClock").click();

        }
     }else{
      console.log('无按钮');
     }


   }


    console.log("脚本加载正常");
    setInterval(kanke, 3000);

})();