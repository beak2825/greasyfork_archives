// ==UserScript==
// @name         行业标准信息服务平台PDF下载
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  获取指定网站上的所有图片链接，并将其合成为 PDF 文件
// @author       笔墨纸砚
// @match        *://hbba.sacinfo.org.cn/attachment/onlineRead/*
// @grant        none
// @license MIT
// @require      https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/464387/%E8%A1%8C%E4%B8%9A%E6%A0%87%E5%87%86%E4%BF%A1%E6%81%AF%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/464387/%E8%A1%8C%E4%B8%9A%E6%A0%87%E5%87%86%E4%BF%A1%E6%81%AF%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(async () => {
    'use strict';


    async function fetchImage(pageNumber) {
    const url = `${window.location.href}/${pageNumber}.png`.replace('attachment/onlineRead','hbba_onlineRead_page');
    //https://hbba.sacinfo.org.cn/attachment/onlineRead/
    //https://hbba.sacinfo.org.cn/hbba_onlineRead_page/
    const headers = {
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': `${window.location.href}`,
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.48',
        'Cookie': document.cookie,
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch image ${url}`);
        }
        return response.url;
    } catch (error) {
        //console.error(`Image fetch error: ${url}`, error);
        return null;
    }
}


    async function fetchImagesBatch(startPage, batchSize) {
        const fetchPromises = Array.from({ length: batchSize }, (_, i) => fetchImage(startPage + i));
        const srcList = await Promise.all(fetchPromises);
        return srcList.filter(src => src !== null);
    }

    async function fetchAllImages() {
        const batchSize = 50;
        let currentPage = 0;
        let allSrcList = [];
        let maxPageNumber = 0;

        while (true) {
            const srcList = await fetchImagesBatch(currentPage, batchSize);
            if (srcList.length === 0) {
                break;
            }
            allSrcList = allSrcList.concat(srcList);
            const lastPageNumber = currentPage + srcList.length - 1;
            if (lastPageNumber > maxPageNumber) {
                maxPageNumber = lastPageNumber;
            }
            currentPage += batchSize;
        }

        console.log(`最大页码为：${maxPageNumber}`);
        return allSrcList;
    }


    async function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
        });
    }

    async function imagesToPDF(srcList) {
        const pdf = new jspdf.jsPDF({unit: 'px'});
        const length = srcList.length;
        for (let i = 0; i < length; i++) {
            const imgSrc = srcList[i];
            try {
                const img = await loadImage(imgSrc);
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgAspectRatio = img.width / img.height;
                let imgWidth = pageWidth;
                let imgHeight = pageWidth / imgAspectRatio;
                if (imgHeight > pageHeight) {
                    imgHeight = pageHeight;
                    imgWidth = pageHeight * imgAspectRatio;
                }
                pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
                if (i < length - 1) {
                    pdf.addPage();
                }
            } catch (error) {
                console.error(`图片加载失败：${imgSrc}`, error);
            }
        }
        pdf.save('ImagesToPDF.pdf');
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '合成PDF';
        btn.style.position = 'fixed';
        btn.style.top = '50%';
        btn.style.right = '20px';
        btn.style.transform = 'translateY(-50%)';
        btn.style.zIndex = '10000';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.color = 'white';
        btn.style.fontSize = '16px';
        btn.style.padding = '12px 24px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', async () => {
            const srcList = await fetchAllImages();
            imagesToPDF(srcList);
        });
        document.body.appendChild(btn);
    }


    createButton();

})();
