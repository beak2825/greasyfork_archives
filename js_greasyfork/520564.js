// ==UserScript==
// @name         批量下载种子
// @namespace    batch_download
// @version      1.0
// @description  u3d架构批量下载年以上的种子
// @author       X
// @match        https://blutopia.cc/torrents*
// @match        https://aither.cc/torrents*
// @match        https://fearnopeer.com/torrents*
// @match        https://www.torrentleech.cc/torrents/browse*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520564/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/520564/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==
var site_url = decodeURI(location.href);

(function() {
    'use strict';

    // 创建一个“下载年以上的种子”按钮
    function createDownloadButton() {
        const downloadButton = document.createElement("button");
        downloadButton.innerHTML = "下载种子";
        downloadButton.style.position = "fixed";
        downloadButton.style.bottom = "10px";
        downloadButton.style.right = "10px";
        downloadButton.style.zIndex = 1000;
        downloadButton.style.padding = "10px 20px";
        downloadButton.style.backgroundColor = "#28a745";
        downloadButton.style.color = "white";
        downloadButton.style.border = "none";
        downloadButton.style.borderRadius = "5px";
        downloadButton.style.cursor = "pointer";

        document.body.appendChild(downloadButton);

        // 添加按钮的点击事件
        downloadButton.addEventListener("click", function() {
            console.log("按钮已点击，开始查找符合条件的元素并执行点击操作...");
            executeDownloadLogic();  // 执行查找与点击逻辑
        });
    }

    // 查找符合条件的 time 元素并点击对应的按钮
    function executeDownloadLogic() {
        // 用于保存符合条件的按钮元素
        let buttonsToClick = [];
        if (site_url.match(/^https?:\/\/www.torrentleech.cc\//)) {
            debugger;
            let rows = document.querySelectorAll("a.download");
            if (rows.length > 0) {
                console.log(`Found ${rows.length} rows.`);
                rows.forEach(function(row, index) {
                    buttonsToClick.push(row);  // 将符合条件的按钮元素添加到列表中
                })
            }
        } else {
            // 查找页面上所有的 tr 元素
            let rows = document.querySelectorAll("body > main > article > div > section.panelV2.torrent-search__results > div > table > tbody > tr");
            let totalRows = rows.length; // 总的 tr 元素数量
            let matchingRows = 0; // 包含 "year" 或 "years" 的 tr 元素数量
            let seedingRows = 0; // 已经做种的种子数
            let noseederRows = 0; // 少于等于1人做种的种子数
            let yearLowRows = 0; // 一年以内的种子数

            if (rows.length > 0) {
                console.log(`Found ${rows.length} rows.`);

                debugger;
                // 遍历所有 tr 元素
                rows.forEach(function(row, index) {
                    // 在当前 tr 中查找 time 元素
                    let timeElement = row.querySelector("td.torrent-search--list__age > time");

                    if (timeElement) {
                        let content = timeElement.textContent.trim();  // 获取 time 元素内容并去掉前后的空白
                        console.log(`Row ${index + 1} time element content: `, content);

                        // 检查 time 内容是否包含 "year" 或 "年"
                        if (content.includes('year') || content.includes('年')) {
                            console.log(`Row ${index + 1} contains "year" or "年": `, content);
                            // 已经做种的不下载
                            let seeding = row.querySelector("i.fas.fa-arrow-circle-up.text-success.torrent-icons");
                            if(seeding){
                                seedingRows++;
                                return;
                            }
                            // 少于等于1人做种的种子数
                            let noseeder = row.querySelector("td.torrent-search--list__seeders > a > span");
                            if(noseeder && noseeder.textContent.trim() <= 1){
                                noseederRows++;
                                return;
                            }
                            matchingRows++;
                            // 查找同一行的按钮链接元素
                            let buttonElement = row.querySelector("td.torrent-search--list__buttons > div > a");

                            if (buttonElement) {
                                console.log(`Row ${index + 1} button element found: `, buttonElement.href);
                                buttonsToClick.push(buttonElement);  // 将符合条件的按钮元素添加到列表中
                            } else {
                                console.log(`Row ${index + 1} button element not found.`);
                            }
                        } else {
                            yearLowRows++;
                            console.log(`Row ${index + 1} does not contain "year" or "years".`);
                        }
                    } else {
                        console.log(`Row ${index + 1} time element not found.`);
                    }
                });
                alert(`总共有 ${totalRows} 个种子\n一年以内的种子数${yearLowRows}个\n少于等于1人做种的种子数${noseederRows}个\n已经做种的有${seedingRows}个\n符合下载条件的有 ${matchingRows} 个\n点击确认开始下载，若想取消下载请关闭整个页面.`);
            } else {
                console.log("No rows found.");
            }
        }
        // 按顺序点击找到的按钮元素，每隔 100 毫秒点击一次
        buttonsToClick.forEach(function(button, i) {
            setTimeout(function() {
                console.log(`Clicking button ${i + 1}: `, button.href);
                button.click();  // 点击按钮
                // 如果是最后一个按钮点击后，弹出提示框
                if (i === buttonsToClick.length - 1) {
                    setTimeout(function() {
                        alert(`全部下载完成`);
                    }, 2000); // 确保在最后一个按钮点击后弹出提示框
                }
            }, i * 2000);  // 设置延迟，每次延迟 2000 毫秒  TL3000
        });
    }

    // 等待页面加载完成后，创建按钮
    window.onload = function() {
        createDownloadButton();  // 创建下载按钮
    };

})();
