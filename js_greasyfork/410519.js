// ==UserScript==
// @name         吾爱破解论坛验证问答自动填充
// @namespace    http://xiaozhu.site/
// @version      0.2
// @description  吾爱破解论坛验证问答自动填充.
// @author       xiaozhu
// @match        https://www.52pojie.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410519/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E9%AA%8C%E8%AF%81%E9%97%AE%E7%AD%94%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/410519/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E9%AA%8C%E8%AF%81%E9%97%AE%E7%AD%94%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let times = 0;
    var intervalId = setInterval(function(){
        let tipObj = document.getElementById("seccodeqS0_menu");
        let inputObj = document.getElementById("secqaaverify_qS0");
        if(tipObj && inputObj){
            let text = tipObj.innerHTML;
            inputObj.value=text.substr(text.indexOf("答案：")+3);
        }
        //console.log('第'+(times+1)+'次执行');
        times++;
        if(times>=3){
           clearInterval(intervalId);
       }
    }, 3000);
})();