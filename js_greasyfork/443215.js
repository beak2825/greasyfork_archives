// ==UserScript==
// @name         CSDN一键点赞收藏加评论
// @namespace    https://gitee.com/hanj-cn/selfUseOilMonkeyScript
// @license      GPL3.0
// @version      1.2
// @description  收藏好文章的同时用评论感谢和鼓励作者
// @author       hanj.cn@outlook.com
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @icon         https://favicon.yandex.net/favicon/v2/https://www.csdn.net/?size=32
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443215/CSDN%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E%E6%94%B6%E8%97%8F%E5%8A%A0%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/443215/CSDN%E4%B8%80%E9%94%AE%E7%82%B9%E8%B5%9E%E6%94%B6%E8%97%8F%E5%8A%A0%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
 
(function() {
 
    let button = document.createElement("button"); // 创建一个按钮
    button.textContent = "一键三连"; // 按钮内容
    button.style.width = "90px"; // 按钮宽度
    button.style.height = "28px"; // 按钮高度
    button.style.align = "center"; // 文本居中
    button.style.color = "white"; // 按钮文字颜色
    button.style.background = "#e33e33"; // 按钮底色
    button.style.border = "1px solid #e33e33"; // 边框属性
    button.style.borderRadius = "4px"; // 按钮四个角弧度
    button.addEventListener("click", clickBtn) // 监听按钮点击事件
 
    function clickBtn() {
        setTimeout(function() {
 
            let comment = ["针不戳呀，写的针不戳！", "学习了！b（￣▽￣）d", "本文不错(￣ˇ￣)，值得学习！(=￣ω￣=)", "感谢博主的分享！(^ ^)／▽▽＼(^ ^)", "感谢博主，你的文章让我得到一些收获！(￣ˇ￣)"];
            let min = 0;
            let max = comment.length - 1;
            let index = Math.floor(Math.random() * (max - min + 1)) + min; // 取一个随机的评论的索引
            document.getElementById("is-like").click() // 点赞
            document.getElementsByClassName("is-collection")[0].click(); // 打开收藏框
            setTimeout(function() { document.getElementsByClassName("csdn-collection-submit")[0].click(); }, 1000) // 延时500ms点击收藏按钮
            document.getElementsByClassName("tool-item-comment")[0].click(); // 打开评论区
            document.getElementById("comment_content").value = comment[index]; // 随机把一条预先写好的评论赋值到评论框里面
            document.getElementsByClassName("btn-comment")[0].click(); // 发表评论
        }, 100); // 100ms后执行
    }
 
    let toolbox = document.getElementsByClassName('toolbox-list')[0]; // getElementsByClassName 返回的是数组
    toolbox.appendChild(button); // 把按钮加入到toolbox-list的子节点中
})();