// ==UserScript==
// @name         弹琴吧曲谱免登录下载
// @namespace    https://greasyfork.org/zh-CN/users/1276860-nangua-pie
// @version      1.2
// @description  弹琴吧免登录下载曲谱，根据页面曲谱图片链接请求图片数据，转换为 PDF 文件并替换页面下载 PDF 按钮功能
// @author       Syed
// @license      GPL-3.0 License
// @match        *://www.tan8.com/yuepu*
// @match        *://www.tan8.com/jitapu*
// @match        *://www.tan8.com/keyboard*
// @match        *://www.tan8.com/violin*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @icon         https://www.tan8.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/535942/%E5%BC%B9%E7%90%B4%E5%90%A7%E6%9B%B2%E8%B0%B1%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/535942/%E5%BC%B9%E7%90%B4%E5%90%A7%E6%9B%B2%E8%B0%B1%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var titleElement = document.querySelector(".yuepu-text-info li:nth-child(2) p");
    var title = titleElement ? titleElement.textContent.trim() : ypid.toString();
    var filename = title.replace(/[/\\?%*:|"<>]/g, '-');

    // 函数：加载图片数据
    function fetchImageAsDataURL(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    if (response.status === 200) {
                        let blob = response.response;
                        let reader = new FileReader();
                        reader.onloadend = function() {
                            resolve(reader.result);
                        };
                        reader.onerror = function(err) {
                            reject(err);
                        };
                        reader.readAsDataURL(blob);
                    } else {
                        reject(new Error("Failed to load image: " + url));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // 获取页面的所有图片链接
    function getAllImageURLs() {
        let urls = [];

        if (yuepuXqImgArr == null) {return urls}

        urls = yuepuXqImgArr[0].img;

        return urls;
    }

    // 主函数：生成 PDF 并下载
    async function generateAndDownloadPDF() {
        const { jsPDF } = window.jspdf;

        let pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const urls = getAllImageURLs();

        for (let i = 0; i < urls.length; i++) {
            try {
                let dataUrl = await fetchImageAsDataURL(urls[i]);
                
                let img = new Image();
                img.src = dataUrl;
                
                await new Promise((res, rej) => {
                    img.onload = () => res();
                    img.onerror = () => rej(new Error("Load image error"));
                });
                const imgWidth = img.width;
                const imgHeight = img.height;
                
                const margin = 10;
                const availableWidth = pageWidth - margin * 2;
                const availableHeight = pageHeight - margin * 2;
                let ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
                let renderWidth = imgWidth * ratio;
                let renderHeight = imgHeight * ratio;
                
                let x = (pageWidth - renderWidth) / 2;
                let y = (pageHeight - renderHeight) / 2;
                
                let format = dataUrl.substring("data:image/".length, dataUrl.indexOf(";base64"));
                pdf.addImage(dataUrl, format, x, y, renderWidth, renderHeight);
                
                if(i < urls.length - 1) {
                    pdf.addPage();
                }
            } catch (error) {
                console.error("添加图片出错：", error);
            }
        }

        pdf.save(filename + "-" + yuepuImgType + ".pdf");
    }

    // 替换页面上下载 PDF 按钮功能
    function replaceDownloadButton() {
        const btn = document.getElementById("BtnDownloadImg");
        if(btn) {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener("click", function(e) {
                e.preventDefault();
                generateAndDownloadPDF();
            });
            console.log("PDF下载按钮功能已替换");
        } else {
            console.warn("页面上没有找到id为downloadPdf的按钮");
        }
    }

    // 延时执行，等待页面加载完成后进行替换
    window.addEventListener("load", () => {
        replaceDownloadButton();
    });
})();
