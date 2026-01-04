// ==UserScript==
// @name         厦门大学图书馆荐购填写助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从豆瓣图书页面提取书籍信息并存储到 Greasemonkey 存储，在厦门大学图书馆荐购页面自动填写
// @match        https://book.douban.com/subject/*
// @match        https://catalog.xmu.edu.cn/asord/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516363/%E5%8E%A6%E9%97%A8%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%8D%90%E8%B4%AD%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/516363/%E5%8E%A6%E9%97%A8%E5%A4%A7%E5%AD%A6%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%8D%90%E8%B4%AD%E5%A1%AB%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前网址来判断执行的功能
    if (window.location.href.includes("https://book.douban.com/subject/")) {
        // 获取书籍信息
        let title = document.querySelector("span[property='v:itemreviewed']")?.innerText || "书籍题名error";
        let author = document.querySelector("#info a[href*='/search']")?.innerText || "作者error";

        // 使用 Array.from 找到包含特定文本的元素，并获取后续的节点内容
        let publisher = Array.from(document.querySelectorAll("#info .pl")).find(el => el.textContent.includes('出版社'))?.nextElementSibling?.innerText || "出版社error";
        let publishYear = Array.from(document.querySelectorAll("#info .pl")).find(el => el.textContent.includes('出版年'))?.nextSibling?.textContent.trim() || "年份error";
        let isbn = Array.from(document.querySelectorAll("#info .pl")).find(el => el.textContent.includes('ISBN'))?.nextSibling?.textContent.trim() || "ISBNerror";
        let remark = Array.from(document.querySelectorAll("#link-report .intro p"))
        .map(p => p.textContent.trim()) // 提取每个 <p> 标签的文本内容
        .filter(text => text && text !== "·" && text !== "展开全部") // 过滤掉无效或无意义的文本
        .join(" "); // 将所有段落的文本连接成一个字符串
        remark = remark.replace(/\(展开全部\)/g, "").trim();
        remark = remark ? remark.slice(0, 490) : "推荐理由error"; // 截取前450个字符，如果为空则赋默认值

        // 使用 GM_setValue 存储书籍信息
        try {
            GM_setValue('bookInfo', JSON.stringify({
                title: title,
                author: author,
                publisher: publisher,
                publishYear: publishYear,
                isbn: isbn,
                remark: remark,
            }));
            //alert("书籍信息已提取并存储，可以在荐购页面上自动填写。");
        } catch (error) {
            console.error("无法存储到 GM_setValue：", error);
            alert("存储失败，可能是浏览器限制了存储操作。");
        }
    } else if (window.location.href.includes("https://catalog.xmu.edu.cn/asord/")) {
        // 从 GM_getValue 读取书籍信息
        let bookInfo = JSON.parse(GM_getValue('bookInfo', '{}'));
        if (!bookInfo || Object.keys(bookInfo).length === 0) {
            alert("没有找到书籍信息，请先在书籍页面运行提取脚本。");
            return;
        }

        // 填写表单
        function fillForm() {
            // 题名
            let title = document.getElementById('title');
            if (title) title.value = bookInfo.title;

            // 责任者
            let a_name = document.getElementById('a_name');
            if (a_name) a_name.value = bookInfo.author;

            // 出版社
            let b_pub = document.getElementById('b_pub');
            if (b_pub) b_pub.value = bookInfo.publisher;

            // 出版年
            let b_date = document.getElementById('b_date');
            if (b_date) b_date.value = bookInfo.publishYear;

            // 语种 (中文)
            let b_type_cn = document.querySelector("input[name='b_type'][value='C']");
            if (b_type_cn) b_type_cn.checked = true;

            // ISBN
            let b_isbn = document.getElementById('b_isbn');
            if (b_isbn) b_isbn.value = bookInfo.isbn;

            // 推荐理由
            let b_remark = document.getElementById('b_remark');
            if (b_remark) b_remark.value = bookInfo.remark;

            // 提交表单（如不需要自动提交，请注释掉此行）
            // let submitButton = document.querySelector("input[type='submit']");
            // if (submitButton) submitButton.click();
        }

        // 等待页面加载完成后执行填表
        window.addEventListener('load', fillForm);
    }
})();
