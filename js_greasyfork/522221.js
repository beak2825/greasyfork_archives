// ==UserScript==
// @name         高考直通车 下载助手 (PDF)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  高考直通车添加直接下载PDF的按钮（修复提取链接和按钮显示问题），并删除特定元素
// @description  原脚本：高考直通车PDF下载优化 by braveteen
// @author       braveteen & SeaSurgeX
// @match        https://app.gaokaozhitongche.com/newsexam/h/*
// @icon         https://app.gaokaozhitongche.com/css/sharewb/img/head-img.png
// @license      MIT
// @compatible   chrome
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522221/%E9%AB%98%E8%80%83%E7%9B%B4%E9%80%9A%E8%BD%A6%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28PDF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522221/%E9%AB%98%E8%80%83%E7%9B%B4%E9%80%9A%E8%BD%A6%20%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%28PDF%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
     
    // 判断是否为试题页面
    // 误判试卷页面会导致弹出获取PDF失败
    const checkText = "本车将第一时间公布试题答案";
    if (document.body.innerText.includes(checkText)) {
        console.log("页面包含‘本车将第一时间公布试题答案’，脚本不生效。");
        return;  // 如果包含该文本，则不执行后续代码
    }

    // 删除APP跳转提示
    const mkmask = document.getElementById("mkmask");
    if (mkmask) {
        mkmask.remove();  // 删除 mkmask
    }

    const mkmaskout = document.getElementById("mkmaskout");
    if (mkmaskout) {
        mkmaskout.remove();  // 删除 mkmaskout
    }


    const popupBox = document.getElementById("popupBox");
    if (popupBox) {
        popupBox.remove();  // 删除 mkmaskout
    }

    // 模拟点击关闭按钮
    const closeButton = document.querySelector('.popupClose');
    if (closeButton) {
        closeButton.click();  // 如果找到关闭按钮，模拟点击
    }

    
    // 定义按钮样式
    const styles = `
        background-color: DodgerBlue;
        border: none;
        color: white;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 18px;
        margin-top: 10px;
    `;

    try {
        // 尝试从页面脚本中提取 `auto_pdf_url`
        const scriptTags = document.getElementsByTagName('script');
        let pdfUrl = null;

        for (let i = 0; i < scriptTags.length; i++) {
            const scriptContent = scriptTags[i].textContent;
            const match = scriptContent.match(/auto_pdf_url\s*:\s*['"]([^'"]+)['"]/);
            if (match) {
                pdfUrl = match[1];
                break;
            }
        }

        if (!pdfUrl) {
            console.error("未找到PDF下载链接");
            alert("未能提取PDF下载链接。如需帮助，请联系脚本作者。");
            return;
        }

        // 确保链接为HTTPS
        pdfUrl = pdfUrl.replace(/^http:/, 'https:');

        // 创建按钮
        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = "下载PDF";
        downloadButton.style.cssText = styles;

        // 按钮点击事件
        downloadButton.onclick = () => {
            if (pdfUrl) {
                // 下载逻辑
                const xhr = new XMLHttpRequest();
                xhr.open('GET', pdfUrl, true);
                xhr.responseType = 'blob';

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const blob = new Blob([xhr.response], { type: 'application/pdf' });
                        const downloadLink = document.createElement('a');
                        downloadLink.href = window.URL.createObjectURL(blob);
                        downloadLink.download = document.title.concat(".pdf");
                        downloadLink.click();
                        alert("成功开始下载！");
                    } else {
                        alert("下载失败，请检查网络连接或联系脚本作者。");
                    }
                };

                xhr.onerror = function () {
                    alert("下载请求失败，请重试。");
                };

                xhr.send();
            } else {
                alert("无效的PDF链接。如需帮助，请联系脚本作者。");
            }
        };

        // 插入按钮到页面
        const vipDiv = document.querySelector(".vip_icon");
        if (vipDiv && vipDiv.parentNode) {
            vipDiv.parentNode.replaceChild(downloadButton, vipDiv);
        } else {
            // 如果找不到 `vip_icon` 元素，直接插入到页面顶部
            document.body.insertBefore(downloadButton, document.body.firstChild);
        }
    } catch (e) {
        console.error("脚本运行错误：", e);
        alert("脚本运行时出现错误。如需帮助，请联系脚本作者。");
    }
})();
