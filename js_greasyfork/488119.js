// ==UserScript==
// @name        原创力文档下载
// @namespace   Violentmonkey Scripts
// @match       https://max.book118.com/*
// @require     https://cdn.bootcdn.net/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js
// @grant       none
// @version     1.0
// @author      -
// @description 2024/2/20 14:56:29
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488119/%E5%8E%9F%E5%88%9B%E5%8A%9B%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/488119/%E5%8E%9F%E5%88%9B%E5%8A%9B%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
 
;(function () {
 
  function pdfDownloadHelper() {
    let interval = setInterval(function() {
        if (typeof PdfReader !== 'undefined') {
            console.log('PdfReader loaded');
            // 停止定时检查
            clearInterval(interval);
 
            // 保存原始的 PdfReader 构造函数
            let OriginalPdfReader = PdfReader;
 
            // 创建一个代理对象
            let PdfReaderProxy = new Proxy(OriginalPdfReader, {
                construct: function(target, args) {
                    console.log('PDFViewer instance created');
 
                    // 创建原始 PdfReader 的实例
                    let instance = new target(...args);
 
                    // 在这里可以添加任何你想要的自定义逻辑
                    // 例如：修改实例的行为，添加属性等
 
                    // 返回修改后的 PdfReader 实例
                    unsafeWindow.pdfReaderInstance = instance
                    return instance;
                }
            });
 
            // 替换 PdfReader 构造函数以进行拦截
            PdfReader = PdfReaderProxy;
 
        }
    }, 10);
 
  }
 
  async function mergePdfs(allData) {
    const mergedPdf = await PDFLib.PDFDocument.create();
 
    for (const data of allData) {
      const pdf = await PDFLib.PDFDocument.load(data);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
 
    return await mergedPdf.save();
  }
 
  async function downloadPdf() {
    let pageIndex = 0;
    let allData = [];
 
    // 定义递归函数，用于获取所有页面数据
    async function getAllPages() {
      try {
                console.log('获取第' + (pageIndex+1) + '页数据中...')
        const data = await pdfReaderInstance.getData(pageIndex);
        allData.push(data);
        pageIndex++;
        // 继续递归直到getData()返回报错
        await getAllPages();
      } catch (error) {
        console.log(error)
        // 当getData()返回报错时，表示所有页面数据获取完毕
        const mergedPdfData = await mergePdfs(allData);
        const blob = new Blob([mergedPdfData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
 
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = $('.other-toolbar .other-title').text() || 'document.pdf'; // 设置文件名
        document.body.appendChild(a);
        a.click();
 
        window.URL.revokeObjectURL(url);
      }
    }
 
    // 启动获取所有页面数据的过程
    await getAllPages();
  }
 
 
  unsafeWindow.downloadPdf = downloadPdf;
  pdfDownloadHelper()
})()