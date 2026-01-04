// ==UserScript==
// @name         企管宝-tedc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wilson
// @match        http://qgb.tedc-atc.com:82/SystemFrameWorkV3/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406791/%E4%BC%81%E7%AE%A1%E5%AE%9D-tedc.user.js
// @updateURL https://update.greasyfork.org/scripts/406791/%E4%BC%81%E7%AE%A1%E5%AE%9D-tedc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //---------------修改工时时可以修改日期-------------------------------//
    let dateDiv = document.getElementById("项目工时记录表_日期");
    if(dateDiv){
        dateDiv.removeAttribute("readonly");
        console.log("已经可以修改日期");
    }
    //---------------轮寻检查填工时时可以自动填6.5小时-------------------------//
    let temp = setInterval(() => {
        let workTimeDiv = document.getElementsByName("项目工时记录表_工时");
        console.log(workTimeDiv);
        if(workTimeDiv&&workTimeDiv.length>0){
            let v = workTimeDiv[0].value;
            //取消轮寻
            if(v!=""){
                clearInterval(temp);
                return;
            }
            workTimeDiv[0].value=6.5;
        }
     }, 3000);
})();