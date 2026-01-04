// ==UserScript==
// @name         广东省国家工作人员学法考试平台-题库生成器
// @namespace    http://tampermonkey.net/
// @version      2024-08-14
// @description  辅助工具
// @author       You
// @match        http://xfks-study.gdsf.gov.cn/study/exercise/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503633/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0-%E9%A2%98%E5%BA%93%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/503633/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0-%E9%A2%98%E5%BA%93%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    console.log("load...");
    // 重写 confirm 函数
    unsafeWindow.confirm = function(message) {
        console.log("Confirm dialog shown: " + message);
        return true; // 或者返回 false 以模拟点击“取消”
    };
    // 重写 alert 函数
    unsafeWindow.alert = function(message) {
        console.log("Alert dialog shown: " + message);
        // 你可以在这里自定义其他行为，比如弹出自定义的通知
    };
    // 全部题库
    let all_out = "";
    // 使用正则表达式提取
    const regex = /(\d+\.) (.*) 正确答案：(.*)/;
    // 交卷
    function commit(){
        console.log("monkey", confirm, window.confirm, confirm === window.confirm);
        let btn = document.getElementById("JiaoJuan-test");
        if (btn) {
            btn.click();
        }
    }
    // 生成题库
    function generate_answer(){
        // 遍历题目
        let items = document.getElementsByClassName("item")
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let str = item.getElementsByClassName("question-title")[0].innerText;
            let match = str.match(regex);
            if (match) {
                let questionNumber = match[1]; // 1.
                let question = match[2];       // 题目内容
                let correctAnswer = match[3];  // 正确答案
                let out = `{"q": "${question}", "a": "${correctAnswer}"},`
                all_out = all_out + out + "\n";
                //console.log(out);
            } else {
                console.log('没有匹配的内容');
            }
        }
    }

    // 下载题库
    function download(){
        console.log(all_out);
        const exercise_num = window.location.pathname.split("/")[3];
        // 定义要写入文件的字符串和文件名
        const content = all_out;
        const filename = `题库-${exercise_num}.txt`;
        // 创建一个 Blob 对象
        const blob = new Blob([content], { type: 'text/plain' });
        // 创建一个 URL 对象
        const url = URL.createObjectURL(blob);
        // 创建一个链接元素
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        // 触发下载
        document.body.appendChild(link);
        link.click();
        // 清理
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // 释放 URL 对象
    }

    function main() {
        console.log("main...");
        setTimeout(commit, 1000)
        setTimeout(generate_answer, 2000);
        setTimeout(download, 3000);
    }

    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        // document.addEventListener("DOMContentLoaded", main);
        window.addEventListener("load", main);
    }

    document.addEventListener("keydown", function (event) {
        console.log("keydown", event.code);
        if (event.code === "KeyG") {
            // todo
        } else if (event.code === "KeyT"){
            let ms = 3000;
            Swal.fire({
                title: "学习强国",
                text: `自动学习中，【${ms}】【毫秒】后自动跳转！`,
                timer: ms,
                timerProgressBar: true
            });
        }
    });
})();
