// ==UserScript==
// @name         海西教育网研修平台自动刷验证码
// @namespace    tai
// @version      0.3
// @description  海西教育网研修平台自动刷验证码123
// @author       nickTWO
// @license GPLv3
// @match        *://hxfd2022.stu.t-px.cn/*
// @icon         http://hxha2022.stu.t-px.cn/resources/images/student/courseThemeS.png
// @grant        none
// @connect  hxfd2022.stu.t-px.cn/
// @downloadURL https://update.greasyfork.org/scripts/456316/%E6%B5%B7%E8%A5%BF%E6%95%99%E8%82%B2%E7%BD%91%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/456316/%E6%B5%B7%E8%A5%BF%E6%95%99%E8%82%B2%E7%BD%91%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function inputCode(){
        var codespan = document.getElementById("codespan")
       if(codespan !== null ){
           var code = document.getElementById("codespan").textContent;
           console.log(code);
           document.getElementById("code").value = code;
           document.querySelector("a.layui-layer-btn0").click();
       }
    }
    setInterval(inputCode,3000);
})();