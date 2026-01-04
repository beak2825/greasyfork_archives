// ==UserScript==
// @name         Add Link Button to Papers.cool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a [Link] button between [PDF] and [Copy] on papers.cool to open the arXiv page
// @match        *://papers.cool/*
// @author       WenDavid
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526310/Add%20Link%20Button%20to%20Paperscool.user.js
// @updateURL https://update.greasyfork.org/scripts/526310/Add%20Link%20Button%20to%20Paperscool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有论文条目
    document.querySelectorAll(".panel.paper").forEach(paper => {
        // 获取PDF按钮
        let pdfButton = paper.querySelector(".title-pdf");
        if (!pdfButton) return;

        // 获取arXiv链接
        let arxivId = paper.id;
        let arxivLink = `https://arxiv.org/abs/${arxivId}`;

        // 创建新的[Link]按钮
        let linkButton = document.createElement("a");
        linkButton.textContent = "[Link]";
        linkButton.href = arxivLink;
        linkButton.target = "_blank";
        linkButton.className = "title-link notranslate";
        linkButton.style.marginLeft = "5px"; // 调整按钮间距

        // 插入到[PDF]按钮后面，[Copy]按钮前面
        pdfButton.insertAdjacentElement("afterend", linkButton);
    });
})();
