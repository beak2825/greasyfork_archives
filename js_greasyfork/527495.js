// ==UserScript==
// @name         华文慕课课件下载助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在页面上增加按钮，直接下载课件原文件，一键合并下载章节所有课件
// @author       goudanZ1
// @license      MIT
// @match        https://www.chinesemooc.org/student/term_section_list.php*
// @match        https://www.chinesemooc.org/student/term_courseware_preview.php*
// @icon         https://www.chinesemooc.org/favicon.ico
// @require      https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527495/%E5%8D%8E%E6%96%87%E6%85%95%E8%AF%BE%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527495/%E5%8D%8E%E6%96%87%E6%85%95%E8%AF%BE%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const { PDFDocument } = PDFLib;

    // Create a temporary element and download the file from url
    function downloadFile(fileUrl, fileName) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    }

    /* PREVIEW NODE: (term_courseware_preview.php)
        <h2 class="pagecont-header-title">  --- node
            【课件】***.pdf
        </h2>
    */

    function getFileName_pr(node) {
        return node.textContent.split("【课件】").pop().trim();
    }

    function getFileUrl_pr(previewDoc) {
        return previewDoc.querySelector("#iframeViewPdf").src.split("file=").pop();
    }

    function downloadFunc_pr(node, downloadBtn) {
        downloadBtn.textContent = "正在获取下载链接……";
        downloadFile(getFileUrl_pr(document), getFileName_pr(node));
    }

    /* COURSEWARE NODE: (term_section_list.php)
        <li class="second-list">
            <div class="list-left">  --- node
                <a target="_blank" href="****">  --- previewUrl
                    <div class="icon-file"><img></div>
                    <div class="type">课件</div>
                    <div class="title-name">****.pdf</div>  --- fileName
                </a>
            </div>
            <div class="list-right"><a>下载</a></div>
        </li>
    */

    function getFileName_cw(node) {
        return node.querySelector("a div.title-name").textContent.trim();
    }

    // Get the source url of the file
    async function getFileUrl_cw(node) {
        const previewUrl = node.querySelector("a").href;
        try {
            const previewResponse = await fetch(previewUrl);
            const previewHtml = await previewResponse.text();
            const parser = new DOMParser();
            const previewDoc = parser.parseFromString(previewHtml, "text/html");
            return getFileUrl_pr(previewDoc);
        } catch (error) {
            alert("获取 " + getFileName_cw(node) + " 链接失败：" + error);
            return null;
        }
    }

    async function downloadFunc_cw(node, downloadBtn) {
        downloadBtn.textContent = "正在获取下载链接……";
        const fileUrl = await getFileUrl_cw(node);
        if (!fileUrl) {
            return;
        }
        downloadFile(fileUrl, getFileName_cw(node));
    }

    /* CHAPTER NODE: (term_section_list.php)
        <dl class="first-card">
            <dt class="first-head active">
                <div class="tag-wrap">  --- node
                    <p class="num">*</p>
                    <p class="tag">***</p>
                </div>
                <div class="first-retract"><img><span>收起</span></div>
            </dt>
            <dd class="second-card">
            ...
        </dl>
    */

    // Get courseware nodes from the descendants of a chapter node
    function getCoursewareChildren_ch(node) {
        const entryNodes = node.parentNode.parentNode.querySelectorAll("li.second-list div.list-left");
        // fix (2025.09.11): 有些标着“课件”的其实是作业，不是 pdf，也没有预览链接和 <a> 标签
        return Array.from(entryNodes).filter((node) => node.querySelector("a") && node.querySelector("div.type").textContent.trim() === "课件");
    }

    // Use the chapter name as the name of the merged PDF file
    function getFileName_ch(node) {
        return node.querySelector("p.num").textContent.trim() + "-" + node.querySelector("p.tag").textContent.trim() + ".pdf";
    }

    // Get an array of the source urls of all files in this chapter
    async function getFileUrls_ch(node) {
        const coursewareChildren = getCoursewareChildren_ch(node);
        const fileUrls = [];
        for (const coursewareNode of coursewareChildren) {
            // Don't use forEach, forEach isn't compatible with 'await'
            const url = await getFileUrl_cw(coursewareNode);
            if (url) {
                fileUrls.push(url);
            }
        }
        return fileUrls;
    }

    // For PDFs in one chapter, merge them into one (reference: https://pdf-lib.js.org/#copy-pages)
    async function mergePDFsAndDownload(fileUrls, fileName, downloadBtn) {
        if (fileUrls.length === 0) {
            return;
        }
        const mergedDoc = await PDFDocument.create();
        for (const [index, url] of fileUrls.entries()) {
            downloadBtn.textContent = `正在合并第 ${index + 1} 份文件……`;
            const pdfResponse = await fetch(url);
            const pdfBytes = await pdfResponse.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = await mergedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            pages.forEach((page) => mergedDoc.addPage(page));
        }
        downloadBtn.textContent = "合并完成，正在生成下载链接……";
        const mergedBytes = await mergedDoc.save();
        const blob = new Blob([mergedBytes], { type: "application/pdf" });
        const objectUrl = URL.createObjectURL(blob);
        downloadFile(objectUrl, fileName);
        URL.revokeObjectURL(objectUrl);
    }

    async function downloadFunc_ch(node, downloadBtn) {
        downloadBtn.textContent = "正在获取所有文件地址，请耐心等待……";
        const fileUrls = await getFileUrls_ch(node);
        await mergePDFsAndDownload(fileUrls, getFileName_ch(node), downloadBtn);
    }

    // Create a download button as the last child of node and trigger downloadFunc when clicking it
    function createDownloadBtn(node, text, downloadFunc) {
        const downloadBtn = document.createElement("button");
        downloadBtn.textContent = text;
        downloadBtn.style.cssText = "margin-left: 15px; padding: 3px 8px; border: 1.5px solid #707070; border-radius: 5px; background-color:e9e9e9; cursor: pointer";
        downloadBtn.onclick = async function () {
            downloadBtn.disabled = true;
            downloadBtn.style.cursor = "default";
            // downloadBtn.textContent = '正在获取下载链接……';
            await downloadFunc(node, downloadBtn);
            downloadBtn.disabled = false;
            downloadBtn.style.cursor = "pointer";
            downloadBtn.textContent = text;
        };
        node.appendChild(downloadBtn);
    }

    const url = window.location.href;

    if (url.startsWith("https://www.chinesemooc.org/student/term_courseware_preview.php")) {
        const node = document.querySelector("h2.pagecont-header-title");
        createDownloadBtn(node, "下载原文件", downloadFunc_pr);
    } else if (url.startsWith("https://www.chinesemooc.org/student/term_section_list.php")) {
        const chapterNodes = document.querySelectorAll("dt.first-head div.tag-wrap");
        var coursewareNodes = [];
        chapterNodes.forEach((node) => {
            const coursewareChildren = getCoursewareChildren_ch(node);
            if (coursewareChildren.length > 0) {
                coursewareNodes = coursewareNodes.concat(coursewareChildren);
                createDownloadBtn(node, "下载本章所有课件的合并文件", downloadFunc_ch);
            }
        });
        coursewareNodes.forEach((node) => {
            createDownloadBtn(node, "下载原文件", downloadFunc_cw);
        });
    }
})();