// ==UserScript==
// @name         广东省华医网继续教育公需课（2023）
// @namespace    http://tampermonkey.net/
// @version      2023.5.24
// @description  广东省2023年专用
// @author       kris2600
// @match        https://cme45.91huayi.com/*
// @match        *://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        *://*.91huayi.com/pages/exam.aspx?*
// @match        *://*.91huayi.com/pages/exam_result.aspx?*
// @match        *://*.91huayi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdedu.gov.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469200/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%8D%8E%E5%8C%BB%E7%BD%91%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882023%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469200/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%8D%8E%E5%8C%BB%E7%BD%91%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882023%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var interval = 1000;
    var choice = 0;
    var event = new MouseEvent("mousemove", {
        "view": window,
        "bubbles": true,
        "cancelable": true
    });
    // 考核
    function exam(){
        var grade = document.getElementsByClassName("m-studyTest-grade");
        if(grade.length > 0){
            grade = parseInt(grade[0].getElementsByTagName("strong")[0].innerText);
            if(grade >= 100){
                console.log(`你当前已经是${grade}分！！！`);
                return;
            }
        }
        // 中国式现代化
        var answer1 = ["C", "C", "A", "A", "D", "A", "C", "A", "C", "A", "ABCD", "ABCD", "AB", "ABCD", "ABCD", "ABCD", "ABCD", "ACD", "ABC", "BCD", "B", "A", "B", "A", "A", "A", "A", "B", "A", "A"];
        // 高质量发展
        var answer2 = ["D", "A", "B", "B", "C", "C", "D", "B", "C", "D", "B", "C", "ABCD", "ABCD", "ABCD", "ABC", "ABCD", "ABCD", "B", "A", "A", "A", "A", "A", "A", "B", "A", "B", "A", "B"];
        // 将答案ABCD转换成数组
        var map = {"a": 0, "A": 0, "b": 1, "B": 1, "c": 2, "C": 2, "d":3, "D": 3};
        function abcd_to_index(answer_in){
            var answer_out = [];
            for(var i = 0; i < answer_in.length; i++){
                answer_out[i] = []
                var s = answer_in[i];
                for (var j = 0; j < s.length; j++) {
                    answer_out[i].push(map[s[j]]);
                }
            }
            return answer_out;
        }
        // 判断启用哪套答案
        var answer = null;
        var course = document.getElementById("courseCatalog");
        if(course.textContent.includes("中国式现代化")){
            answer = abcd_to_index(answer1);
        } else {
            answer = abcd_to_index(answer2);
        }
        var btn = document.getElementsByClassName("btn u-main-btn");
        if(btn[0].innerText == "重新测验"){
            btn[0].click();
        } else {
            var ql = document.getElementsByClassName("m-topic-item");
            for(var i = 0; i < ql.length; i++){
                var q = ql[i]
                var c = q.getElementsByClassName("m-radio-tick");
                if(c.length <= 0){
                    c = q.getElementsByClassName("m-checkbox-tick");
                }
                // 选答案
                var a = answer[i]
                for(var j = 0; j < a.length; j++){
                    c[a[j]].click();
                }
            }
            // 交卷
            btn[0].click();
            finishTest();
        }
    }
    function main(){
        // 当前播放
        var current_index = 0;
        var txt = document.getElementsByClassName("txt");
        for(let i = 0; i < txt.length; i++){
            if(txt[txt.length - 1].innerText.includes(txt[i].innerText)){
                console.log(txt[i].innerText, txt[txt.length - 1].innerText);
                current_index = i;
                break;
            }
        }
        // 需要观看时长
        var s = document.getElementsByClassName("g-study-prompt");
        var need_time = -1;
        if(s && s[0] && s[0].firstElementChild && s[0].firstElementChild.firstElementChild){
            need_time = s[0].firstElementChild.firstElementChild.textContent;
        }
        need_time = parseInt(need_time);
        // 每秒检测
        function tick(){
            if(current_index == (txt.length - 2)){
                exam();
                return;
            }
            var v = document.getElementsByTagName("video")[0];
            v.play();
            // 已观看时长
            var vt = document.getElementById("viewTimeTxt");
            if(vt){
                vt = parseInt(vt.textContent);
            }
            console.log(`已观看时长: ${vt}/${need_time}`);
            // 模拟用户操作，防止检测挂机
            v.dispatchEvent(event);
            // 答题
            var c = document.getElementsByClassName("m-radio-tick");
            if(c.length <= 0){
                c = document.getElementsByClassName("m-checkbox-tick");
            }
            if(c.length > 0){
                console.log("答题检测", c, choice);
                if (choice >= c.length){
                    choice = 0;
                }
                // 选一个
                c[choice++].click();
                // 提交按钮
                var b = document.getElementsByClassName("btn u-main-btn");
                b[0].click();
            }
            // 切换视频
            if (vt === null || (vt >= need_time)){
                console.log("视频已经看完，切换下一个...");
                txt[current_index + 1].click();
                current_index++;
            }
            setTimeout(tick, interval);
        }
        tick();
    }
    document.addEventListener('keydown', function(event) {
        console.log("keydown", event.code);
        if (event.code === 'Enter') {
            main();
        } else if (event.code === "KeyG") {
            console.log("视频可拖动...");
            player.changeConfig('config','timeScheduleAdjust',1); // 视频可拖动
        } else if (event.code === "KeyT") {
            console.log("开始答题...")
            exam();
        }
    });
    window.onload = main;
})();