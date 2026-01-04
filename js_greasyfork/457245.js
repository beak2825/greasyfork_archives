// ==UserScript==
// @name         国家中小学智慧教育平台 2023年“寒假教师研修”专题 刷课脚本,4倍速
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      CC BY-NC-SA
// @description  支持4倍速的刷课脚本
// @author       panda8z
// @match        https://www.zxx.edu.cn/teacherTraining/*
// @match        https://basic.smartedu.cn/teacherTraining/*
// @match        https://smartedu.cn/special/TeacherTraining/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457245/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%202023%E5%B9%B4%E2%80%9C%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98%20%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%2C4%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/457245/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%202023%E5%B9%B4%E2%80%9C%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98%20%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%2C4%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(main, 5000);
    function main(){
        console.log(`刷课脚本开始运行`)
        var vid = document.getElementsByTagName("video")[0];
        vid.muted = true;
        // v0.3 新增四倍速支持
        vid.playbackRate = 4.0;
        vid.play();
        console.log('开始播放')

        var total_ep = document.getElementsByClassName('resource-item').length;
        console.log(`总共集数: ${total_ep}`);

        var current_index;
        document.getElementsByClassName('resource-item').forEach(function(element,index){ if (element.classList.length === 3) { current_index = index }});
        console.log(`当前集号: ${current_index}`);

        vid.addEventListener('ended', function() {
            console.log('当前记号：',current_index, ' 总记号:', total_ep);
            if (current_index <= total_ep) {
                console.log('播放结束，切换下一个视频');
                //document.getElementsByClassName('resource-item')[current_index].click();
                document.getElementsByClassName('resource-item')[current_index+=1].click();
                console.log(`已切换到视频${current_index}`);
                setTimeout(main, 5000);
                console.log(`开始刷视频${current_index}`)
                var vid = document.getElementsByTagName("video")[0];
                vid.muted = true;
                vid.play();
                console.log('开始播放')
            } else {
                console.log("该章节已挂机完成。");
            }
        }, false)
    }
})();