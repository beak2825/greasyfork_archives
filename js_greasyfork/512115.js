// ==UserScript==
// @name         电子科技大学安全教育与管理平台/安全手册挂机
// @namespace    https://github.com/FoxSuzuran
// @version      1.1
// @description  电子科技大学安全手册挂机，4分钟刷新一次
// @author       Suzuran
// @match        https://labsafetest.uestc.edu.cn/*
// @license MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512115/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E4%B8%8E%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%AE%89%E5%85%A8%E6%89%8B%E5%86%8C%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/512115/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E4%B8%8E%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%AE%89%E5%85%A8%E6%89%8B%E5%86%8C%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

function checkForTextAndRefresh() {
    const hasLearningText = document.body.innerText.includes("你正在进行在线学习");
    if (hasLearningText) {
        setInterval(function () {
            location.reload();
        }, 4 * 60 * 1000);
    }
}

checkForTextAndRefresh();
