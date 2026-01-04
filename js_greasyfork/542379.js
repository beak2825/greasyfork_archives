// ==UserScript==
// @name         CSUFT 平时分查询 - 手动执行表格处理
// @namespace    http://tampermonkey.net/
// @version      2025-07-12
// @description  点击分数查看平时分
// @author       crdddd
// @match        http://jwgl.webvpn.csuft.edu.cn/jsxsd/kscj/cjcx_frm
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542379/CSUFT%20%E5%B9%B3%E6%97%B6%E5%88%86%E6%9F%A5%E8%AF%A2%20-%20%E6%89%8B%E5%8A%A8%E6%89%A7%E8%A1%8C%E8%A1%A8%E6%A0%BC%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/542379/CSUFT%20%E5%B9%B3%E6%97%B6%E5%88%86%E6%9F%A5%E8%AF%A2%20-%20%E6%89%8B%E5%8A%A8%E6%89%A7%E8%A1%8C%E8%A1%A8%E6%A0%BC%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮并插入到页面中
    const button = document.createElement('button');
    button.textContent = '点击分数查看平时分';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

    // 将按钮插入页面
    document.body.appendChild(button);

    // 主处理函数
    function processTable() {
        try {
            console.log("🔍 正在尝试获取 iframe 和表格...");

            // 查找 iframe
            const iframe = document.getElementById("cjcx_list_frm");
            if (!iframe || !iframe.contentDocument) {
                console.warn("⚠️ iframe 尚未加载完成");
                return;
            }

            // 查找表格
            const table = iframe.contentDocument.getElementById("dataList");
            if (!table) {
                console.warn("⚠️ 未找到 id='dataList' 的表格");
                return;
            }

            console.log("✅ 成功获取到表格", table);

            // 获取 tbody
            const tbody = table.querySelector("tbody");
            if (!tbody) {
                console.warn("⚠️ 表格中未找到 tbody");
                return;
            }

            // 获取所有行
            const rows = tbody.querySelectorAll("tr");
            if (rows.length === 0) {
                console.warn("⚠️ 表格中没有数据行");
                return;
            }

            // 遍历每一行
            rows.forEach(row => {
                const comments = getCommentsFromElement(row);
                if (comments.length < 1) {
                    console.debug("🛈 当前行无注释内容");
                    return;
                }

                const Comment = comments[1] || "无注释";
                const newTdHtml = `<td>${Comment}</td>`;
                const newTd = htmlToElement(newTdHtml);

                const tds = row.querySelectorAll("td");
                if (tds.length > 4 && newTd) {
                    row.replaceChild(newTd, tds[4]); // 替换第五个 td
                    console.debug("🔁 已替换一行的第五列内容为：", Comment);
                }
            });

        } catch (error) {
            console.error("❌ 执行过程中发生错误：", error);
        }
    }

    // 从元素中提取注释节点
    function getCommentsFromElement(element) {
        const comments = [];
        const children = element.childNodes;

        children.forEach(node => {
            if (node.nodeType === Node.COMMENT_NODE) {
                comments.push(node.textContent.trim());
            }
        });

        return comments;
    }

    // HTML 字符串转 DOM 元素
    function htmlToElement(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.firstChild;
    }

    // 绑定按钮点击事件
    button.addEventListener('click', () => {
        console.log("🖱️ 按钮被点击，开始处理表格...");
        processTable();
    });

})();