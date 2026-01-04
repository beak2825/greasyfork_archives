// ==UserScript==
// @name         广东省教师继续教育公需课（2024）
// @namespace    http://tampermonkey.net/
// @version      2024.05.11
// @description  广东省2024年专用
// @author       jesse996
// @match        https://jsxx.gdedu.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdedu.gov.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510679/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882024%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/510679/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882024%EF%BC%89.meta.js
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
    // 显示弹出信息
    function showPopupMessage(message, duration) {
        var popup = document.createElement('div');
        popup.innerText = message;
        popup.style.display = 'block';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#f9f9f9';
        popup.style.padding = '20px'; // 增加内边距，防止字体超出边界
        popup.style.border = '1px solid #ccc';
        popup.style.color = 'red';
        popup.style.fontSize = '50px'; // 设置字体大小为50像素
        popup.style.maxWidth = '80%'; // 设置最大宽度，防止过长的文本导致元素过宽
        popup.style.textAlign = 'center'; // 文本居中显示
        document.body.appendChild(popup);
 
        // 删除弹出信息
        setTimeout(function() {
            popup.parentNode.removeChild(popup);
        }, duration);
    }
    // 考核
    function exam(){
        console.log("开始答题...")
        var grade = document.getElementsByClassName("m-studyTest-grade");
        if(grade.length > 0){
            grade = parseInt(grade[0].getElementsByTagName("strong")[0].innerText);
            if(grade >= 100){
                var msg = `你当前已经是${grade}分！！！`;
                console.log(msg);
                showPopupMessage(msg, 3000);
                return;
            }
        }
        // 百县千镇万村高质量发展工程与城乡区域协调发展
        var answer1 = ["C", "A", "C", "B", "A", "B", "D", "C", "D", "D", "ABC", "ABD", "ABC", "ABC", "ABCD", "ABCDE", "ABCDE", "ABCD", "ABC", "A", "A", "B", "A", "A", "A", "B", "B", "A", "A"];
        // 新质生产力与高质量发展
        var answer2 = ["B", "A", "D", "B", "B", "A", "C", "D", "A", "A", "B", "A", "ABC", "AB", "ABC", "ABC", "ABC", "ABC", "ABCDE", "ABCDE", "B", "B", "A", "A", "A", "B", "B", "A", "A", "B"];
        // 将答案ABCD转换成数组
        var map = {"a": 0, "A": 0, "b": 1, "B": 1, "c": 2, "C": 2, "d":3, "D": 3, "e": 4, "E": 4};
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
        if(course.textContent.includes("县域经济发展与乡村振兴")){
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
            var msg = `挂机中！已观看时长: ${vt}/${need_time}`;
            console.log(msg);
            showPopupMessage(msg, interval);
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
        if (event.code === 'KeyV') {
            console.log("视频可拖动...");
            player.changeConfig('config','timeScheduleAdjust',1); // 视频可拖动
        } else if (event.code === "KeyM") {
            main();
        } else if (event.code === "KeyE") {
            exam();
        }
    });
    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        window.onload = main;
    }
})();