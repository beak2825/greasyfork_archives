// ==UserScript==
// @name         LeetCode Copy Testcase
// @namespace    https://leetcode.cn/
// @version      0.2
// @description  自动将 LeetCode 测试用例转化为 SQL 和 Pandas 语句
// @author       wangxm
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode-cn.com/submissions/detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515960/LeetCode%20Copy%20Testcase.user.js
// @updateURL https://update.greasyfork.org/scripts/515960/LeetCode%20Copy%20Testcase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 MutationObserver 确保在页面加载完成后执行
    const observer = new MutationObserver((mutations, obs) => {
        const targetElement = document.querySelector("#details-summary");
        if (targetElement) {
            obs.disconnect();
            addButtons(targetElement);
        }
    });

    observer.observe(document, { childList: true, subtree: true });

    function addButtons(targetElement) {
        // 获取表的对象集合信息
        let createTableSQL = "";
        let insertSQL = "";
        let dropTableSQL = "";
        let pandasCode = "";

        const tableInfos = JSON.parse(pageData.submissionData.input).headers;
        const tableRows = JSON.parse(pageData.submissionData.input).rows;

        // 生成表创建和删除语句
        for (const name in tableInfos) {
            const columns = tableInfos[name].map(col => `${col} VARCHAR(200)`);
            createTableSQL += `CREATE TABLE IF NOT EXISTS ${name} (${columns.join(", ")});\n`;
            dropTableSQL += `DROP TABLE IF EXISTS ${name};\n`;

            // 生成 Pandas 代码
            const pandasColumns = tableInfos[name].map(col => `"${col}"`);
            const pandasData = tableRows[name].map(row => `[${row.map(value => value === null ? "None" : `"${value}"`).join(", ")}]`);
            pandasCode += `import pandas as pd\n${name}_df = pd.DataFrame(columns=[${pandasColumns.join(", ")}], data=[${pandasData.join(", ")}])\n\n`;
        }

        // 处理数据并生成插入语句
        for (const tableName in tableRows) {
            tableRows[tableName].forEach(row => {
                const values = row.map(value => value === null ? "NULL" : `"${value}"`);
                insertSQL += `INSERT INTO ${tableName} VALUES (${values.join(", ")});\n`;
            });
        }

        // 添加到页面上
        targetElement.insertAdjacentHTML('beforeend', `
            <input type="button" value="复制 SQL" id="copy-sql" class="btn btn-primary">
            <input type="button" value="复制 Pandas" id="copy-pandas" class="btn btn-primary" style="margin-left:10px">
            <input type="button" value="隐藏" id="toggle" style="margin-left:10px" class="btn btn-primary">
            <textarea style="margin-top:10px;height:200px;display:block" id="sql" class="form-control"></textarea>
            <textarea style="margin-top:10px;height:200px;display:none" id="pandas" class="form-control"></textarea>
        `);

        document.getElementById("sql").value = dropTableSQL + createTableSQL + insertSQL;
        document.getElementById("pandas").value = pandasCode;

        // 添加滑动及其处理
        document.getElementById("toggle").addEventListener('click', function() {
            const sqlTextarea = document.getElementById("sql");
            const pandasTextarea = document.getElementById("pandas");
            const isHidden = sqlTextarea.style.display === "none";
            sqlTextarea.style.display = isHidden ? "block" : "none";
            pandasTextarea.style.display = isHidden ? "none" : "block";
            this.value = isHidden ? "隐藏" : "查看";
        });

        document.getElementById("copy-sql").addEventListener('click', function() {
            const sqlTextarea = document.getElementById("sql");
            sqlTextarea.select();
            document.execCommand("Copy");
            alert("SQL 已复制好，可贴粘。");
        });

        document.getElementById("copy-pandas").addEventListener('click', function() {
            const pandasTextarea = document.getElementById("pandas");
            pandasTextarea.select();
            document.execCommand("Copy");
            alert("Pandas 代码已复制好，可贴粘。");
        });
    }
})();