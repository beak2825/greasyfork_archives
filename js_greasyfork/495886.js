// ==UserScript==
// @name         arXiv Download Rename
// @name:en    arXiv downloaded PDF files, automatically renames them to paper titles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It can directly modify the downloaded file name to the thesis name by default and conform to the Windows file naming standard. Will generate a hyperlink to download the paper on the search page as well as the individual paper screen, click on it. [modified version 2024-5-24].
// @author       TeruhaHirayama
// @match        https://arxiv.org/abs/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/495886/arXiv%20Download%20Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/495886/arXiv%20Download%20Rename.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查当前页面是否为论文摘要页面
    if (window.location.pathname.includes('/abs/')) {
        // 获取论文标题
        var papertitle = document.querySelector("#abs > h1").innerText.trim();
        // 获取论文发布时间
        var papertime = document.querySelector(".dateline").innerText.replace("[Submitted on ", "").replace("]", "").trim();
        // 获取作者列表
        var authors = document.querySelectorAll('.authors > a');
        var authorNames = Array.from(authors, author => author.innerText.trim());

        // 格式化作者名称，如果作者多于一个，则只保留第一个并添加 "et al."
        var formattedAuthors = authorNames.length > 1 ? authorNames[0] + ", et al." : authorNames.join(", ");

        var safeTitle = papertitle.replace(':', '：').replace('/', ' OR ').replace('"', '“');
        // 构建最终的文件名
        var downloadName = '[' + papertime + '] ' + formattedAuthors + ' - ' + safeTitle + '.pdf';

        // 获取PDF下载链接
        var downloadPath = document.querySelector(".download-pdf").href;

        // 添加一个下载按钮
        addDownloadButton(downloadPath, downloadName);
    }

    // 添加下载按钮的函数
    function addDownloadButton(downloadPath, downloadName) {
        var button = document.createElement("a");
        button.id = "downloadPaper";
        button.textContent = "下载论文（重命名）";
        button.style.display = 'block'; // 可选，为了确保按钮可见
        button.href = downloadPath;
        button.download = downloadName;
        button.addEventListener('click', function(event) {
            event.preventDefault();
            fetchPDF(downloadPath, downloadName);
        });
        document.querySelector("#abs-outer > div.extra-services > div.full-text").appendChild(button);
    }

    // 下载PDF文件的函数
    function fetchPDF(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const objUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(objUrl);
            })
            .catch(error => console.error('Error fetching PDF:', error));
    }
})();
