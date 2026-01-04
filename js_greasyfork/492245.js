// ==UserScript==
// @name         环球网校_免登录
// @namespace    http://tampermonkey.net/
// @version      2024-04-19
// @description  环球网校部分功能免登录使用
// @author       SilvioDe
// @match        https://www.hqwx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hqwx.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492245/%E7%8E%AF%E7%90%83%E7%BD%91%E6%A0%A1_%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/492245/%E7%8E%AF%E7%90%83%E7%BD%91%E6%A0%A1_%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    
   function show_ans(item) {
    if (item) {
        item.style.display = "block";
        let answers = item.querySelector(".answer>span")
        if (answers) {
            answers = answers.innerText.split(",")
            console.log(answers)
            let pp = item.parentElement.querySelectorAll(".q-option--seq")
            pp.forEach(o => {
                console.log(o)
                if (answers.includes(o.textContent)) {
                    o.parentElement.style.background = "#4ac7ac"
                    o.parentElement.style.fontWeight = "bolder"
                } else {
                    console.warn("not in")
                }
            })
        }

    }
}

function incrementUrlIndex(incrementValue = 1) {
    // 获取当前页面的完整 URL
    let currentUrl = window.location.href;

    // 使用 URL 构造函数来解析 URL
    let url = new URL(currentUrl);

    // 获取路径部分，例如 "/tiku/6026/2925573.html"
    let path = url.pathname;

    // 将路径拆分成多个部分
    let pathParts = path.split("/");

    // 假设路径的最后一部分是数字（索引）加上 ".html"
    let lastPart = pathParts[pathParts.length - 1];

    // 去掉 ".html" 后缀，获取数字部分
    let lastIndex = parseInt(lastPart.replace(".html", ""));

    // 将数字部分增加给定的 incrementValue
    let newIndex = lastIndex + incrementValue;

    // 生成新的路径，将新索引部分插回路径数组
    pathParts[pathParts.length - 1] = newIndex + ".html";

    // 将路径数组重新组合成一个新的路径
    let newPath = pathParts.join("/");

    // 设置新路径到 URL 的路径部分
    url.pathname = newPath;

    // 获取新的 URL
    let newUrl = url.toString();

    // 使用 window.location.href 重定向到新的 URL
    window.location.href = newUrl;
}

function hidden_item(item) {
    document.querySelectorAll(item).forEach(e => {
        e.style.display = "none"
    })
}

let qanda = [
    [".public_question", ".public_answer", false],
    [".q-button", ".q-footer", true]
]

let hidden_items = [".q-analysis-bottom"]

hidden_items.forEach(e => {
    hidden_item(e)
})

qanda.forEach(([question, answer, next_q]) => {
    let q_items = document.querySelectorAll(question)
    if (q_items) {
        q_items.forEach(q_item => {
            q_item.style.display = "none"
            let b = document.createElement("div")
            let class_name = question.replace(".", "")
            b.className = class_name
            q_item.parentElement.appendChild(b)
            b.addEventListener("click", () => {
                let ans = b.parentElement.querySelector(answer)
                show_ans(ans)
            })
            b.innerText = "!显示答案"

            if (next_q) {
                let q = document.createElement("div")
                q.className = class_name
                q.style.background = "red"
                q_item.parentElement.appendChild(q)
                q.addEventListener("click", () => {
                    incrementUrlIndex(-1);
                })
                q.innerText = "下一题"
            }
        })
    }
});


})();