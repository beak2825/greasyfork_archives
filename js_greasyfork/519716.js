// ==UserScript==
// @name         颜色替换
// @namespace    replace
// @version      1.0
// @description  该脚本用于替换LeetCode讨论区帖子中的题目链接颜色
// @author       luvcodechen
// @match        https://leetcode.cn/circle/discuss/7cTwYz/
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/519716/%E9%A2%9C%E8%89%B2%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/519716/%E9%A2%9C%E8%89%B2%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

'use strict';

// 定义一个Map用于存储题目的状态
let statuMap = new Map(),
    buildMapComplete = false;

// getProblems函数用于获取所有题目的信息
const getProblems = () =>
    // 发送请求获取所有题目数据
    fetch("/api/problems/all/").then((response) =>
        response.text()).then((text) => buildMap(JSON.parse(text)))

// buildMap函数用于构建题目状态的映射关系
const buildMap = (picker) => {
    // 遍历题目数据，将题目ID和状态存储到statuMap中
    for (let pro of picker.stat_status_pairs) {
        statuMap.set(pro.stat.frontend_question_id, pro.status);
    }
    buildMapComplete = true; // 标记映射构建完成
};

// replace函数用于替换页面中题目链接的颜色
const replace = () => {
    // 遍历所有题目链接
    for (let problem of document.querySelectorAll("table tr td a")) {
        const id = problem.textContent; // 获取链接文本内容
        // 检查文本内容是否为数字，即题目ID
        if (!isNaN(parseInt(id))) {
            // 根据题目状态设置链接颜色
            problem.style.color = statuMap.get(id) === "ac" ? "green" : "red";
        }
    }
}

// 执行getProblems函数以获取题目信息
getProblems();

// 设置一个间隔检查映射构建是否完成，并执行颜色替换
const interval = setInterval(() => {
    if (buildMapComplete && document.querySelectorAll("table tr td a").length !== 0) {
        clearInterval(interval); // 停止间隔检查
        replace(); // 执行颜色替换
    }
}, 500);
