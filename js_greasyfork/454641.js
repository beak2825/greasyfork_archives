// ==UserScript==
// @name         一键复制HTML表格/网页代码/latex公式
// @namespace    https://greasyfork.org/zh-CN/scripts/454641
// @version      0.8.3
// @description  在指定网站的表格上方添加按钮，点击将表格以Markdown格式复制到剪贴板
// @author       John Granger
// @icon         data:image/x-icon;base64,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
// @match        https://blog.csdn.net/*
// @match        https://www.cnblogs.com/*
// @match        https://www.runoob.com/*
// @match        https://www.jianshu.com/*
// @match        https://*.zhihu.com/*
// @match        https://www.quanxiaoha.com/*
// @match        https://www.geeksforgeeks.org/*
// @match        https://online.stat.psu.edu/stat800/*
// @match        https://www.javatpoint.com/*
// @match        https://cloud.tencent.com/*
// @match        https://scikit-learn.org/*
// @match        https://www.w3school.com.cn/*
// @match        https://www.w3cschool.cn/*
// @match        https://c.biancheng.net/*
// @match        https://juejin.cn/*
// @match        https://www.statology.org/*
// @match        https://*.stackexchange.com/*
// @match        https://*.stackoverflow.com/*
// @match        https://rstudio-pubs-static.s3.amazonaws.com/*
// @match        https://bookdown.org/*
// @match        https://*.github.io/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454641/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6HTML%E8%A1%A8%E6%A0%BC%E7%BD%91%E9%A1%B5%E4%BB%A3%E7%A0%81latex%E5%85%AC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/454641/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6HTML%E8%A1%A8%E6%A0%BC%E7%BD%91%E9%A1%B5%E4%BB%A3%E7%A0%81latex%E5%85%AC%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const NL = "\n";

    // 存放Markdown表格
    let processor = document.createElement("processor");
    // 获取<table>
    let table = document.getElementsByTagName("table");
    // 大多数网站块代码在<pre>里
    let pre = document.getElementsByTagName("pre");

    // 设置延迟，防止elements还未创建
    setTimeout(init, 1000);


    function convertTableElementToMarkdown(tableEl) {
        const rows = [];
        const trEls = tableEl.getElementsByTagName('tr');
        for (let i = 0; i < trEls.length; i++) {
            const tableRow = trEls[i];
            const markdownRow = convertTableRowElementToMarkdown(tableRow, i);
            rows.push(markdownRow);
        }
        return rows.join(NL);
    }

    function convertTableRowElementToMarkdown(tableRowEl, rowNumber) {
        const cells = [];
        const cellEls = tableRowEl.children;
        for (let i = 0; i < cellEls.length; i++) {
            const cell = cellEls[i];
            cells.push(cell.innerText + ' |');
        }
        let row = '| ' + cells.join(" ");

        if (rowNumber === 0) {
            row = row + NL + createMarkdownDividerRow(cellEls.length);
        }

        return row;
    }

    function createMarkdownDividerRow(cellCount) {
        const dividerCells = [];
        for (let i = 0; i < cellCount; i++) {
            dividerCells.push('--- |');
        }
        return '| ' + dividerCells.join(" ");
    }


    function convertTable(x) {
        const content = "<table>" + x.innerHTML + "</table>";
        processor.innerHTML = content.replace(/\s+/g, ' ');

        const tables = processor.getElementsByTagName('table');
        let markdownResults = '';
        if (tables) {
            for (let e of tables) {
                const markdownTable = convertTableElementToMarkdown(e);
                markdownResults += markdownTable + NL + NL;
            }
            let p = document.createElement("p");
            p.innerHTML = "复制成功";
            navigator.clipboard.writeText(markdownResults)
                .then(() => {
                    console.log('文本已经成功复制到剪切板');
                })
                .catch(err => {
                    // 如果用户没有授权，则抛出异常
                    console.error('无法复制此文本：', err);
                });
            // GM.setClipboard(markdownResults);
            x.parentNode.insertBefore(p, x);
        } else {
            console.log('No table found');
        }
    }

    function copyCode(x) {
        let text = window.location.href.includes("juejin") ? x.innerText.replace(/^.*\n.*复制代码/g, "") : x.innerText;
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('文本已经成功复制到剪切板');
            })
            .catch(err => {
                // 如果用户没有授权，则抛出异常
                console.error('无法复制此文本：', err);
            });
    }

    function copyMathFormula(x) {
        navigator.clipboard.writeText(x.innerText)
            .then(() => {
                console.log('文本已经成功复制到剪切板');
            })
            .catch(err => {
                // 如果用户没有授权，则抛出异常
                console.error('无法复制此文本：', err);
            });
    }

    function createButtons(x, type) {
        [...x].forEach((value, index) => {
            let button = document.createElement("button");
            button.innerText = `Copy ${type}`;
            // button.style.zIndex = '999';
            button.addEventListener('click',
                () => (type === "Table")
                    ? convertTable(x[index])
                    : (type === "Code")
                        ? copyCode(x[index])
                        : copyMathFormula(x[index])
            )
            x[index].parentNode.insertBefore(button, x[index]);
        })
    }

    function init() {
        createButtons(table, "Table");
        createButtons(pre, "Code");
        // 获取使用MathJax渲染的latex公式
        createButtons(document.querySelectorAll('script[type^="math/tex"]'), "Math");

        let url = window.location.href
        if (url.includes("runoob")) {
            // 菜鸟教程的代码块
            let example_code = document.getElementsByClassName("example_code");
            createButtons(example_code, "Code");
        } else if (url.includes("cnblogs") || url.includes("www.geeksforgeeks.org")) {
            let cn_blogs = document.getElementsByClassName("code");
            createButtons(cn_blogs, "Code");
        }
    }
})();

