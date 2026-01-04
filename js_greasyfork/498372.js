// ==UserScript==
// @name         中小学教材电子版 jc.pep.com.cn 下载器
// @namespace    http://tampermonkey.net/
// @version      2024-06-19
// @description  Textbook Downloader
// @author       Molecule <mol.synaiv.com>
// @match        https://book.pep.com.cn/**/mobile/index.html
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/498372/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E6%9D%90%E7%94%B5%E5%AD%90%E7%89%88%20jcpepcomcn%20%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/498372/%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E6%9D%90%E7%94%B5%E5%AD%90%E7%89%88%20jcpepcomcn%20%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
    加载 jspdf.js
    */
    var jsimport = document.createElement("script")
    jsimport.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    document.head.appendChild(jsimport)

    /**
    添加下载按钮
    */
    var btn = document.createElement("button")
    btn.className="button"
    btn.innerHTML="下载教科书"
    btn.style.fontSize="64px"
    btn.style.zIndex="1000"
    btn.onclick=download2PDF
    document.body.innerHTML=""
    document.body.appendChild(btn)

    var progressbar = document.createElement("div")
    progressbar.style.position="fixed"
    progressbar.style.top="50%"
    progressbar.style.left="50%"
    progressbar.style.transform="translate(-50%, -50%)"
    progressbar.style.zIndex="1000"
    progressbar.style.width="200px"
    progressbar.style.height="200px"
    progressbar.style.color="red"
    progressbar.style.fontSize="48px"
    progressbar.style.display="none"
    document.body.appendChild(progressbar)





    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            //img.crossOrigin = 'Anonymous'; // This is important to avoid cross-origin issues
            img.onload = function() {
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    async function download2PDF(){

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const pageCount = BookInfo.getPageCount()
        const bookNumber = jsLoadingBar.instance.baseURI.split("/").filter((e)=>Number.isInteger(Number.parseInt(e)))
        const title = jsLoadingBar.loadingCaption
        const baseUrl = `https://book.pep.com.cn/${bookNumber}/files/mobile/`;


        // progress bar

        progressbar.style.display="block"

        for (let i = 1; i <= pageCount; i++) {
            const imageUrl = `${baseUrl}${i}.jpg`;
            const img = await loadImage(imageUrl);
            const imgProps = pdf.getImageProperties(img);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Add image to PDF
            pdf.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            progressbar.innerHTML=`目前下载进度：${(i/pageCount*100).toFixed(2)}%`

            // If not the last image, add a new page
            if (i < pageCount) {
                pdf.addPage();
            }
        }
        pdf.save(`${title}.pdf`);
        progressbar.style.display="none"

        console.log(`downloaded ${title}`)
    }
})();