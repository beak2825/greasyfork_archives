// ==UserScript==
// @name         Steam 指南图片ID和标题导出器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  导出Steam指南图片的img id和对应的title为CSV文件
// @match        https://steamcommunity.com/sharedfiles/editguidesubsection/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542467/Steam%20%E6%8C%87%E5%8D%97%E5%9B%BE%E7%89%87ID%E5%92%8C%E6%A0%87%E9%A2%98%E5%AF%BC%E5%87%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542467/Steam%20%E6%8C%87%E5%8D%97%E5%9B%BE%E7%89%87ID%E5%92%8C%E6%A0%87%E9%A2%98%E5%AF%BC%E5%87%BA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForPreviewImages(callback) {
        const interval = setInterval(() => {
            const container = document.querySelector("#PreviewImages");
            const titleEl = document.querySelector("#BG_bottom > div.editGuidePageTitle");

            if (container && container.querySelector("img") && titleEl) {
                clearInterval(interval);
                const guideTitle = sanitizeFilename(titleEl.innerText.trim());
                callback(container,guideTitle);
            }
        }, 500);
    }
        function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]/g, "_");
    }

    function extractImageData(container) {
        const images = container.querySelectorAll("img");
        const data = [["id", "title"]];

        images.forEach(img => {
            const id = img.id || "";
            const title = img.title || "";
            data.push([id, title]);
        });

        return data;
    }


    function exportToCSV(data, filename) {
        const csvContent = data.map(row =>
            row.map(v => `"${v.replace(/"/g, '""')}"`).join(",")
        ).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function addExportButton(container,guideTitle) {
        const btn = document.createElement("button");
        btn.innerText = "导出图片CSV";
        btn.style.margin = "10px";
        btn.style.padding = "5px 10px";
        btn.style.backgroundColor = "#5c7e10";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "14px";

        btn.onclick = () => {
            const data = extractImageData(container);
            const filename = `${guideTitle}_steam_guide_images.csv`;
            exportToCSV(data, filename);
        };

        container.parentElement.insertBefore(btn, container);
    }

    waitForPreviewImages((container, guideTitle) => {
        addExportButton(container, guideTitle);
    });
})();
