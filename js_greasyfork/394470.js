// ==UserScript==
// @name         保存GitChat专栏正文
// @namespace    https://github.com/LazyBug1E0CF
// @version      0.3.1
// @description  以markdown格式保存GitChat专栏正文（前提是你已经订阅了专栏）
// @author       L
// @match        *://gitbook.cn/gitchat/column/*/topic/*
// @grant        none
// @require      https://unpkg.com/showdown/dist/showdown.min.js
// @downloadURL https://update.greasyfork.org/scripts/394470/%E4%BF%9D%E5%AD%98GitChat%E4%B8%93%E6%A0%8F%E6%AD%A3%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/394470/%E4%BF%9D%E5%AD%98GitChat%E4%B8%93%E6%A0%8F%E6%AD%A3%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const mdService = new showdown.Converter();
    const style = {
        width: '48px',
        height: '48px',
        background: '#fff',
        boxShadow: '0 6px 12px 0 rgba(95,105,133,0.12)',
        borderRadius: '50%',
        color: '#575757',
        lineHeight: '48px',
        fontSize: '18px',
        textAlign: 'center',
        textDecoration: 'none'
    };
    let saveBtn;

    const article = document.querySelector("article");
    const title = article.querySelector("h2").textContent.toString();
    const contentDiv = article.querySelector("div.topic_content");
    const content = mdService.makeMarkdown(contentDiv.innerHTML);
    const profileBtn = document.querySelector("#customerProfile2");
    const fileType = "application/md";

    (function() {
        const styleContainer = document.createElement("div");
        styleContainer.innerHTML = `
            <style>
                a#save-article:hover {
                    color: #ff7000 !important;
                }
            </style>
        `;
        profileBtn.parentNode.insertBefore(styleContainer, profileBtn);

        genSaveBtn();
    })();

    function genSaveBtn() {
        saveBtn = document.createElement("a");
        saveBtn.id = "save-article";
        saveBtn.className = "topic_item_box";
        saveBtn.download = title + ".md";
        saveBtn.href = URL.createObjectURL(new Blob([content], {type: fileType}));
        saveBtn.textContent = "存";
        for (let k in style) {
            saveBtn.style[k] = style[k];
        }
        profileBtn.parentNode.insertBefore(saveBtn, profileBtn.nextSibling);
    }
})();