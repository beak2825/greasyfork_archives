// ==UserScript==
// @name         江苏开学第一课自动播放下一节视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当前课程结束后自动播放下一节直到课程结束
// @author       You
// @match        https://jste.lexiangla.com/classes/1ec7f224093e11ec9709226c543a40f4/courses/*
// @icon         https://www.google.com/s2/favicons?domain=lexiangla.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433622/%E6%B1%9F%E8%8B%8F%E5%BC%80%E5%AD%A6%E7%AC%AC%E4%B8%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/433622/%E6%B1%9F%E8%8B%8F%E5%BC%80%E5%AD%A6%E7%AC%AC%E4%B8%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

// $(".venom-btn-primary").click();
// $(".vjs-button-icon").click()

(function() {
    'use strict';
    //延迟3秒后开始
    setTimeout(function(){
        $(".vjs-button-icon").click();
        var nextVedio = setInterval(function() { // 每隔5秒一次检测
            if($(".venom-btn-primary").length === 1){ // 检测是否看完
                $(".venom-btn-primary").click();
            }
        },5000)

    }, 3000)

    // Your code here...
})();