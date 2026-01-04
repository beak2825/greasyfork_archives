// ==UserScript==
// @name        整合打印
// @namespace   Violentmonkey Scripts
// @match       http://172.16.8.7:9000/
// @require     https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @require     https://cdn.jsdelivr.net/npm/print-js@1.6.0/dist/print.min.js
// @grant       none
// @version     1.0
// @author      -
// @license    MIT
// @description 2023/2/13 上午11:55:22
// @downloadURL https://update.greasyfork.org/scripts/490984/%E6%95%B4%E5%90%88%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490984/%E6%95%B4%E5%90%88%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
  'use strict'

  async function mergeAllPDFs(bytes) {
       const mergedPdf = await PDFLib.PDFDocument.create();
       for (const pdfBytes of bytes) {
         const pdf = await PDFLib.PDFDocument.load(pdfBytes);
         const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
         copiedPages.forEach((page) => {
           mergedPdf.addPage(page);
         });
       }
      const mergedPdfFile = await mergedPdf.save();
    return mergedPdfFile;
  }

  const fetchUrlByte = async (url) => {
    return await fetch(url).then(res => res.arrayBuffer());
  }

  let workIng = false;
  const work = async () => {
    if (workIng){
      alert('工作中！！！！');
      return;
    }

    let urls = getUrlList();
    if (!urls.length) return;

    workIng = true;
    let byteArr = await Promise.all(urls.map((url) => fetchUrlByte(url)));
    let pdf = await mergeAllPDFs(byteArr)

    const blob = new Blob([pdf], { type: 'application/pdf' });
    const url= window.URL.createObjectURL(blob);
    printJS({
     printable: url,
     type:'pdf'
    });

    workIng = false;
  }

  const checkHasList = () => {
    return !!$(".page-table-list-data tbody tr a[title=打印]").length;
  }

  const getUrlList = () => {
    let list = $(".page-table-list-data tbody tr a[title=打印]");
    let result  = [];
    if (list.length) {
      for (let item of list) {
        let matches = /'(.*?)'/.exec($(item).attr("onclick"));
        let match = matches?.[1];
        if (match)
          result.push(match);
      }
    }
    return result;
  }

  const makeButton = () =>{
    if ($('.print_btn_class').length) return;

    let btn = $("<button class='print_btn_class' style='position:fixed;right:20px;bottom:50px;'>Print</button>")
    btn.on('click',() => work());
    $('body').append(btn)
  }

  const removeBtn = () => {
    $(".print_btn_class").remove()
  }
  const isShowBtn = () => {
    if(checkHasList())
      makeButton();
    else
      removeBtn()

    setTimeout(() => {
      isShowBtn();
    },1000)
  }

  const loadStyles = (arr) => {
    for (let style of arr) {
      $("head").append($(`<link rel="stylesheet" href="${style}">`));
    }
  }

  loadStyles([
    'https://cdn.jsdelivr.net/npm/print-js@1.6.0/dist/print.min.css'
  ])
  isShowBtn();


})();