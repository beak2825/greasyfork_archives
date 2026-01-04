// ==UserScript==
// @name         TaoDouPDF
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  pdf download
// @author       MiaoMint
// @include      https://www.taodocs.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455421/TaoDouPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/455421/TaoDouPDF.meta.js
// ==/UserScript==
var taoPageCount = 0;
var taoLoadedPage = 3;
var taoPdfs;
var taoNextPageStr;
var nextButton = document.querySelector('#b_doc_zip');
var downloadBUtton = document.querySelector('#b_doc_zip3');
var downloadBUtton1 = document.querySelector('#top_doc_zip');
var title = document.querySelector("title");
(function () {
    'use strict';
    nextButton.innerHTML = "下一页"
    nextButton.setAttribute("href", "javascript:void(0)")
    nextButton.onclick = () => {
        getNextPaget()
    }

    downloadBUtton.innerHTML = "TaoDou下载"
    downloadBUtton.setAttribute("href", "javascript:void(0)")
    downloadBUtton.onclick = () => {
        download()
    }

    downloadBUtton1.innerHTML = "TaoDou下载"
    downloadBUtton1.setAttribute("href", "javascript:void(0)")
    downloadBUtton1.onclick = () => {
        download()
    }

})();


function getPdfFile() {
    let pdfs = []
    taoPdfs.forEach((e) => {
        pdfs.push(`data:application/pdf;base64,${btoa(e)}`)
    })
    mergeAllPDFs(pdfs)
}


async function mergeAllPDFs(urls) {

    const pdfDoc = await PDFLib.PDFDocument.create();
    const numDocs = urls.length;
    downloadBUtton.innerHTML = "合并文件中..."
    downloadBUtton1.innerHTML = "合并文件中..."
    for (var i = 0; i < numDocs; i++) {
        const donorPdfBytes = await fetch(urls[i]).then(res => res.arrayBuffer());
        const donorPdfDoc = await PDFLib.PDFDocument.load(donorPdfBytes);
        const docLength = donorPdfDoc.getPageCount();
        for (var k = 0; k < docLength; k++) {
            const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);
            //console.log("Doc " + i+ ", page " + k);
            pdfDoc.addPage(donorPage);
        }
    }

    const linkSource = await pdfDoc.saveAsBase64({ dataUri: true });
    const downloadLink = document.createElement("a");
    const fileName = `${title.innerHTML}.pdf`;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();

    downloadBUtton.innerHTML = "下载完成"
    downloadBUtton1.innerHTML = "下载完成"
}


function download() {
    taoPageCount = pageCount
    if (!taoPdfs) {
        taoPdfs = urls
    }
    if (!taoNextPageStr) {
        taoNextPageStr = nextPageStr
    }
    if (taoLoadedPage >= taoPageCount) {
        getPdfFile()
        return
    }
    jQuery.getJSON("//" + ajurl + "/home/IndexTaoDocpdf?from=pc_" + pid + "&trt=" + trt + "&furl=" + taoNextPageStr + "&callback=?", function (a) {
        console.log(a)
        if (a.msg == "等待") {
            download()
            return
        }
        if (taoPageCount == 0) {
            taoPageCount = a.pageNum
        }
        taoNextPageStr = a.next;
        if (a.PdfStatus == 2) {
            return
        }
        url = "https:" + EiePQRNA(a.imgs[0], a.s)
        var url2
        $.get({
            url: url,
            // async: false,
            success: function (res) {
                url2 = atob(res.file);
                taoPdfs.push(url2)
                taoLoadedPage += a.valid;
                downloadBUtton.innerHTML = "下载" + taoLoadedPage + "/" + taoPageCount
                downloadBUtton1.innerHTML = "下载" + taoLoadedPage + "/" + taoPageCount
                download()
            }
        })
    });
}
