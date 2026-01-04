// ==UserScript==
// @name         Doc Downloader
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  教习网
// @author       winus@qq.com
// @match        *://www.51jiaoxi.com/doc-*.html
// @require      https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-only
// @create       2021-11-22
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/467594/Doc%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/467594/Doc%20Downloader.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (!window.PDFLib) {
        const script = document.createElement("script");
        script.src = "https://cdn.staticfile.org/pdf-lib/1.17.1/pdf-lib.min.js";
        document.body.append(script);
    }
    const downloadPDF = async () => {
        const doc = await PDFLib.PDFDocument.create();

        let imgBox;

        const imgsWrapNoDisplay = document.querySelector("div.imgs-wrap:not([style*='display'])");
        const imgsWrapWithDisplay = document.querySelector("div.imgs-wrap[style*='display: block']");

        if (imgsWrapNoDisplay) {
          imgBox = imgsWrapNoDisplay.querySelectorAll("div.img-box");
        } else if (imgsWrapWithDisplay) {
          imgBox = imgsWrapWithDisplay.querySelectorAll("div.img-box");
        } else {
          imgBox = [];
        }

        // 获取页面总页数
        const loaded = imgBox.length;
        const remains = parseInt(document.querySelector(".remain-count").innerText);
        let pages = loaded + remains;

        // 获取标题
        // 查询是否有class为preview-file on的元素
        let branch = '';

        var previewElement = document.querySelector('.preview-file.on');

        if (previewElement) {
          // 查询class为file-title的子元素
          let fileTitleElement = previewElement.querySelector('.file-title');

          if (fileTitleElement) {
            // 取得file-title子元素的内容
            branch = fileTitleElement.innerText.split(".")[0];

          }
        }
        const title =document.querySelector(".tit").innerText + '-' + branch;

        // 获取参考src
       const url = "https:" + imgBox[0].querySelector('img').getAttribute('src');
        const img_urls = [];
        let startIndex = parseInt(url.match(/\/(\d+)\.jpg/)[1]);
        
        for (let i = 0; i < pages; i++) {
            const img_url = url.replace(/\/(\d+)\.jpg/, `/${startIndex + i}.jpg`);
            img_urls.push(img_url);
        }

        const imgs = await Promise.all(img_urls.map(async (url) => {
            const img = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: (response) => {
                        resolve(response.response);
                    }
                    ,
                    onerror: (error) => {
                        reject(error);
                    }
                    ,
                });
            }
            );

            if(img.type === 'application/xml'){
              pages -= 1;
              return;

            }

            // Convert webp to jpg
            const convertedImg = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const imgElement = new Image();
                    imgElement.src = reader.result;
                    imgElement.onload = function () {
                        const canvas = document.createElement("canvas");
                        canvas.width = imgElement.width;
                        canvas.height = imgElement.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(imgElement, 0, 0);
                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }
                            , "image/jpeg");
                    }
                        ;
                }
                    ;
                reader.onerror = function (error) {
                    reject(error);
                }
                    ;
                reader.readAsDataURL(img);
            }
            );

            // Convert the convertedImg blob to a Uint8Array
            const convertedImgArrayBuffer = await convertedImg.arrayBuffer();
            const convertedImgUint8Array = new Uint8Array(convertedImgArrayBuffer);

            return await doc.embedJpg(convertedImgUint8Array);

        }
        ));
        for (let i = 0; i < pages; i++) {
            const page = doc.addPage();
            const img = imgs[i];
            page.setSize(img.width, img.height);
            page.drawImage(img, {
                x: 0,
                y: 0,
                width: img.width,
                height: img.height,
            });
        }
        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], {
            type: "application/pdf",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = title + ".pdf";
        link.click();
    }
        ;

    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "下载 PDF";
    downloadBtn.style.position = "fixed";
    downloadBtn.style.top = "10px";
    downloadBtn.style.right = "10px";
    downloadBtn.style.zIndex = "9999";
    downloadBtn.style.padding = "10px";
    downloadBtn.style.borderRadius = "5px";
    downloadBtn.style.backgroundColor = "#007bff";
    downloadBtn.style.color = "#fff";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.addEventListener("click", downloadPDF);
    document.body.appendChild(downloadBtn);
}
)();