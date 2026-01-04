// ==UserScript==
// @name         职业提升
// @namespace    https://www.bjjnts.cn/
// @version      0.5.1
// @description  用于职业技能提升
// @author       嘿嘿嘿
// @match        https://www.bjjnts.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406315/%E8%81%8C%E4%B8%9A%E6%8F%90%E5%8D%87.user.js
// @updateURL https://update.greasyfork.org/scripts/406315/%E8%81%8C%E4%B8%9A%E6%8F%90%E5%8D%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 修改监控级别
    monitor=1;
    console.log("修改监控级别为："+monitor);
    //修改进度条可拖动，直接发送完成信息
    setTimeout(function () {
        currentTime = duration-5;
        maxTime = duration-5;
        console.log()
        $.post("/addstudentTaskVer2/" + courseid + "/" + lessonid,
            { "learnTime": duration },
            function(result){
                console.log(result);
                alert("success");
        });
    }, 1000);
})();