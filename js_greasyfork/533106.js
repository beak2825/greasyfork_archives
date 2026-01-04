// ==UserScript==
// @name         慕课快速互评
// @namespace    http://tampermonkey.net/
// @version      2025-04-30
// @description  一键快速互评慕课 designed by Hamster sama Pinging
// @author       Hamster sama
// @match        https://www.icourse163.org/*learn/*
// @icon         https://www.google.com/s3/favicons?sz=64&domain=icourse163.org
// @grant        unsafeWindow
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/533106/%E6%85%95%E8%AF%BE%E5%BF%AB%E9%80%9F%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/533106/%E6%85%95%E8%AF%BE%E5%BF%AB%E9%80%9F%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

(function () {
    "use strict";

    //互评部分
    const f = () => {
        //点分
        let score_elements = document.getElementsByClassName("s");
        for (let i = 0; i < score_elements.length; i++) {
            let child = score_elements[i].lastElementChild;
            if (!child) {
                return;
            }
            child.firstElementChild.click();
        }
        //点评论
        let comments = [
            //评语
            "好",
            "很好",
            "良好",
            "A",
            "不错",
            "棒",
            "很棒",
            "优秀",
            "赞",
            "可以",
        ];
        let text_elements = document.getElementsByClassName(
            "j-textarea inputtxt",
        );
        for (let i = 0; i < text_elements.length; i++) {
            // 随机选择一个评语
            let randomComment =
                comments[Math.floor(Math.random() * comments.length)];
            text_elements[i].value = randomComment;
        }
        //点提交
        let submit_element = document.getElementsByClassName(
            "u-btn u-btn-default f-fl j-submitbtn",
        );
        submit_element[0].click();
        //点下一个
        setTimeout(() => {
            let nextButton = document.getElementsByClassName("j-gotonext"); // 替换为目标按钮的类名
            nextButton[0].click();
        }, 700);
    };
    let btn = document.createElement("div");
    btn.addEventListener("click", f);
    btn.innerHTML =
        "<button type='button' style='margin:30px;padding:10px;background-color:green;color:black;position:fixed;top:100px;right:20%;z-index:10000'>一键互评</button>";
    document.body.appendChild(btn);
    let all_btn = document.createElement("div");
    all_btn.addEventListener("click", () => {
        for (let i = 1; i < 6; i++) {
            setTimeout(f, 2200 * i);
        }
    });
    all_btn.innerHTML =
        "<button type='button' style='margin:30px;padding:10px;background-color:green;color:black;position:fixed;top:150px;right:20%;z-index:10000'>一键互评5个</button>";
    document.body.appendChild(all_btn);

    //读取作业信息部分
})();
