// ==UserScript==
// @name         课堂派下载助手
// @namespace    https://shiquda.link/
// @version      0.1.1
// @description  可用于下载被禁止的文件
// @author       shiquda
// @match        *://document.ketangpai.com/*
// @match        *://www.ketangpai.com/#/resource_detail*
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      AGPL-3.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/489551/%E8%AF%BE%E5%A0%82%E6%B4%BE%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/489551/%E8%AF%BE%E5%A0%82%E6%B4%BE%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function loadImages() {

    }

    function getImageLinks() {
        return Array.from(document.querySelectorAll('img')).map((img) => img.src).filter((src) => src.startsWith('http'));
    }

    function useMessageToDownloadPDF(imageLinksMessage) {
        const imageLinks = imageLinksMessage.imageLinks;
        const imgProps = imageLinksMessage.imgProps;
        console.log('转换为PDF接受到的links', imageLinks);

        console.log('图片属性', imgProps);
        const pdf = new jspdf.jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [imgProps.width, imgProps.height],
            hotfixes: ["px_scaling"]
        });

        let imageDownloadCache = {};
        // key是链接，value是base64编码的图片
        for (let link of imageLinks) {
            imageDownloadCache[link] = null;
        }

        let imageDownloadPromises = imageLinks.map(link => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: link,
                responseType: 'arraybuffer',
                onload: function (response) {
                    console.log('图片下载响应', response);
                    const blob = new Blob([response.response], { type: 'image/jpeg' });
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const base64 = e.target.result;
                        imageDownloadCache[link] = base64;
                        resolve(); // 图片加载完毕
                    }
                    reader.readAsDataURL(blob);
                },
                onerror: function (error) {
                    reject(error); // 处理下载错误
                }
            });
        }));

        // 当所有图片都加载完毕，再保存PDF
        Promise.all(imageDownloadPromises).then(() => {
            console.log('所有图片下载完毕');
            imageLinks.forEach((link, i) => {
                const base64 = imageDownloadCache[link];
                console.log('添加图片', base64);
                pdf.addImage(base64, 'JPEG', 0, 0, imgProps.width, imgProps.height);
                if (i !== imageLinks.length - 1) {
                    pdf.addPage();
                }
            });
            // 提供一个默认的PDF标题，以防无法获取页面元素的文本内容
            const title = document.querySelector('.mgr-16') ? document.querySelector('.mgr-16').textContent : "Downloaded_Images";
            pdf.save(title);
        }).catch(error => {
            console.error('图片下载或添加到PDF过程中出现错误: ', error);
        });
    }



    // 开始
    let pdf = new jspdf.jsPDF();

    // 判断是不是iframe
    if (window.parent === window) {
        GM_addValueChangeListener('imageLinks', function (imageLinks, old_value, new_value, remote) {
            console.log('imageLinks changed');
            useMessageToDownloadPDF(new_value);
        })
    } else {
        // 是iframe
        const donwloadButton = document.createElement('button');
        donwloadButton.innerText = '下载为PDF';
        donwloadButton.style.position = 'fixed';
        donwloadButton.style.top = '50px';
        donwloadButton.style.right = '30px';
        donwloadButton.style.zIndex = '9999';
        donwloadButton.addEventListener('click', () => {
            loadImages();
            setTimeout(() => {
                const imageLinks = getImageLinks();
                const imgProps = pdf.getImageProperties(imageLinks[0]);

                const imageLinksMessage = {
                    imageLinks: imageLinks,
                    imgProps: imgProps,
                    time: new Date().getTime()
                };
                GM_setValue('imageLinks', imageLinksMessage);
            }, 500);
        });
        document.body.appendChild(donwloadButton);
        loadImages();

    }

})();