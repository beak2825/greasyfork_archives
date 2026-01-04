// ==UserScript==
// @name         哔哩哔哩 评论区隐藏（适配B站UI）
// @namespace    https://www.bilibili.com/
// @version      1.0
// @description  隐藏b站的评论区 创作于2024年4月22日
// @author       云销雨霁
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/493155/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E9%9A%90%E8%97%8F%EF%BC%88%E9%80%82%E9%85%8DB%E7%AB%99UI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/493155/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E9%9A%90%E8%97%8F%EF%BC%88%E9%80%82%E9%85%8DB%E7%AB%99UI%EF%BC%89.meta.js
// ==/UserScript==

// 按钮背景颜色
const bgcolor = "rgb(255,255,255)";

// 按钮字体颜色
const fontColor = "black";

// 变量来跟踪按钮是否已经被创建
let buttonCreated = false;

// 获取评论区
function getComment() {
    return document.querySelector("div.comment-container");
}

// 显示评论区
function showComment(commentElement) {
    commentElement.style.display = "block";
}

// 隐藏评论区
function hideComment(commentElement) {
    commentElement.style.display = "none";
}

// 创建 显示/隐藏 评论区按钮
function createButtonDisplayComment(commentElement) {
    if (buttonCreated) return; // 如果按钮已经创建，直接返回

    let button = document.createElement("button");
    button.innerText = "显示"; // 修改按钮文本为“显示”，表示显示评论

    // 给按钮添加样式
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "5.9px";
    button.style.padding = "10px 7px";
    button.style.backgroundColor = bgcolor;
    button.style.color = fontColor;
    button.style.border = "1px solid #E3E5E7";
    button.style.borderRadius = "8px";
    button.style.cursor = "pointer";

    // 给按钮添加监听事件
    button.addEventListener("click", function() {
        // 切换评论区的显示状态
        if (commentElement.style.display === "none") {
            showComment(commentElement);
            button.innerText = "显示"; // 设置为显示评论
            button.style.color = "black"; // 字体颜色设置为黑色
        } else {
            hideComment(commentElement);
            button.innerText = "隐藏"; // 设置为隐藏评论
            button.style.color = "#00A1D6"; // 字体颜色设置回B站蓝
        }
    });

    // 将按钮添加到页面中
    document.body.appendChild(button);

    buttonCreated = true; // 标记按钮已创建
}

function CloseCommentOfBilibili() {
    // 获取评论区
    let comment = getComment();

    // 如果成功获取到评论区元素
    if (comment) {
        clearInterval(intervalId); // 停止定时检查

        // 默认将评论区显示
        showComment(comment);

        // 创建 显示/隐藏 评论区按钮
        createButtonDisplayComment(comment);
    }
}

// 评论区变量
let comment;

// 每隔0.1秒执行一次tryToGetElement函数
let intervalId = setInterval(CloseCommentOfBilibili, 100);