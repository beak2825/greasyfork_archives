// ==UserScript==
// @name         高教社文档阅读器 PDF下载
// @version      1.0.1
// @description  为高教社文档阅读器添加PDF下载功能。该脚本在高教社文档阅读器页面上添加一个下载按钮，允许用户将文档以PDF格式下载到本地。
// @namespace    https://github.com/lcandy2
// @match        *://hep-urc-file.hep.com.cn/*
// @author       Lcandy
// @grant        none
// @license      MPL-2.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/469759/%E9%AB%98%E6%95%99%E7%A4%BE%E6%96%87%E6%A1%A3%E9%98%85%E8%AF%BB%E5%99%A8%20PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/469759/%E9%AB%98%E6%95%99%E7%A4%BE%E6%96%87%E6%A1%A3%E9%98%85%E8%AF%BB%E5%99%A8%20PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function generateDownloadButton() {
    // 添加下载按钮
    let downloadBtn = document.createElement('a');
    downloadBtn.className = 'activePage';
    downloadBtn.textContent = '下载';

    // 将按钮添加到页面
    let changePageDiv = document.querySelector('.changePage');
    if (changePageDiv) {
      changePageDiv.appendChild(downloadBtn);
    }

    // 绑定点击事件处理程序
    downloadBtn.addEventListener('click', function() {
      // 调用生成 PDF 的函数
        if(a.fileType == "pdf"){
      generatePDFFromImages(basePath, widthlist);
        } else {alert('暂不支持本文档下载'+a.fileType)}
    });
  }

  generateDownloadButton();

  // 生成 PDF 的函数
  function generatePDFFromImages(basePath, widthlist) {
    // 创建一个 jsPDF 实例
    const pdf = new jspdf.jsPDF();
    let loadPageNum = datas.length <= initialPage ? datas.length : initialPage;
    // 循环获取所有图片并添加到 PDF 中
    for (let i = 0; i < loadPageNum; i++) {
      let imageUrl = basePath+'/'+(i+1)+'.png'
console.log('正在下载：',imageUrl)
      // 将图片添加到 PDF
      pdf.addImage(imageUrl, 'PNG', 0, 0);

      // 添加新的页面，用于容纳下一张图片
      if (i + 1 < loadPageNum) {
        pdf.addPage();
      }
    }
console.log('合成保存至文件',basePath.substring(basePath.indexOf("/") + 1, basePath.indexOf(".files"))+'.pdf')
    // 保存 PDF 文件
    pdf.save(basePath.substring(basePath.indexOf("/") + 1, basePath.indexOf(".files"))+'.pdf');
  }
})();
