// ==UserScript==
// @name         zujuan Downloader
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  组卷网
// @author       winus@qq.com
// @match        *://zujuan.xkw.com/*
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-only
// @create       2021-11-22
// @require https://greasyfork.org/scripts/457525-html2canvas-1-4-1/code/html2canvas%20141.js?version=1134363
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
// @downloadURL https://update.greasyfork.org/scripts/469790/zujuan%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/469790/zujuan%20Downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (!window.jsPDF) {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js";
    document.body.append(script);
  }

  const downloadPDF = async () => {
    let ele = document.querySelectorAll("article")[0];
    let title = document.getElementById("pui_maintitle").innerText;
    document.getElementsByClassName("deleted-box")[0].style.display = "none";
    let eleW = ele.offsetWidth; // 获得该容器的宽
    let eleH = ele.offsetHeight; // 获得该容器的高
    let eleOffsetTop = ele.offsetTop; // 获得该容器到文档顶部的距离
    let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离
    var canvas = document.createElement("canvas");
    var abs = 0;
    let win_in =
      document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
    let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
    if (win_out > win_in) {
      // abs = (win_o - win_i)/2;    // 获得滚动条长度的一半
      abs = (win_out - win_in) / 2; // 获得滚动条宽度的一半
      // console.log(a, '新abs');
    }
    canvas.width = eleW * 2; // 将画布宽&&高放大两倍
    canvas.height = eleH * 2;
    var context = canvas.getContext("2d");
    context.scale(4, 4);
    context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
    // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
    // translate的时候，要把这个差值去掉
    // html2canvas(element).then( (canvas)=>{ //报错
    // html2canvas(element[0]).then( (canvas)=>{
    html2canvas(ele, {
      dpi: 720,
      allowTaint: false, //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
      useCORS: true, //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
    }).then((canvas) => {
      var contentWidth = canvas.width;
      var contentHeight = canvas.height;
      //一页pdf显示html页面生成的canvas高度;
      var pageHeight = (contentWidth / 592.28) * 841.89;
      //未生成pdf的html页面高度
      var leftHeight = contentHeight;
      //页面偏移
      var position = 0;
      //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = 595.28;
      var imgHeight = (595.28 / contentWidth) * contentHeight;
      var pageData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jspdf.jsPDF("", "pt", "a4");
      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < pageHeight) {
        //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
        pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
      } else {
        // 分页
        while (leftHeight > 0) {
          pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          //避免添加空白页
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }
      //可动态生成
      pdf.save(title + ".pdf");
    });
  };

  // 解决图片被分页的问题
  const downloadPDF2 = async () => {
  const A4_SIZE = [595.28, 841.89]; // A4 paper width and height in points
  const node = document.getElementsByClassName("paper-body")[0];
  const title = document.getElementById("pui_maintitle").innerText;
  let absoluteOffset = node.getBoundingClientRect().top; // Absolute offset, used when crossing part boundaries

  const nodeWidth = node.clientWidth;
  const pageHeight = (nodeWidth / A4_SIZE[0]) * A4_SIZE[1];

  // Collect elements to be printed
  const elementsToPrint = [];
  const partNum = node.children.length;
  for (let i = 0; i < partNum; i++) {
    const partHead = node.children[i].children[0];
    if (!partHead.hidden) {
      elementsToPrint.push(partHead); // part-head
    }

    const partBody = node.children[i].children[1];
    for (let j = 0; j < partBody.children.length; j++) {
      const questionHead = partBody.children[j].children[0];
      elementsToPrint.push(questionHead);
      const questionBody = partBody.children[j].children[1];
      const questionNum = questionBody.children.length;
      for (let k = 0; k < questionNum; k++) {
        elementsToPrint.push(questionBody.children[k]);
      }
    }
  }

  // Add page footers if needed
  if (document.getElementsByClassName("c-page-foot").length === 0) {
    for (let i = 0, len = elementsToPrint.length; i < len; i++) {
      len = elementsToPrint.length; // Update len to consider new elements after adding page footers
      const item = elementsToPrint[i];
      if (typeof item.clientHeight === "undefined") {
        // Filter out empty elements
        continue;
      }
        const beforeH = item.getBoundingClientRect().top - absoluteOffset;
        const marginBottom = parseInt(window.getComputedStyle(item).marginBottom);
        const afterH = beforeH + item.clientHeight + marginBottom;
        const currentPage = parseInt(beforeH / pageHeight);
        if (currentPage !== parseInt(afterH / pageHeight)) {
          const diff = pageHeight - (beforeH % pageHeight);
          addPageFooter(item, currentPage + 1, diff);
        }
      
    }
  }

  const eleWidth = node.offsetWidth;
  const eleHeight = node.offsetHeight;
  const eleOffsetTop = node.offsetTop;
  const eleOffsetLeft = node.offsetLeft;
  const canvas = document.createElement("canvas");
  let abs = 0;
  const winIn = document.documentElement.clientWidth || document.body.clientWidth; // Current viewport width (excluding scrollbar)
  const winOut = window.innerWidth; // Current window width (including scrollbar)
  if (winOut > winIn) {
    abs = (winOut - winIn) / 2; // Get half of the scrollbar width
  }
  canvas.width = eleWidth * 2;
  canvas.height = eleHeight * 2;
  const context = canvas.getContext("2d");
  context.scale(4, 4);
  context.translate(-eleOffsetLeft - abs, -eleOffsetTop);

  // Generate PDF using html2canvas
  html2canvas(node, {
    dpi: 720,
    allowTaint: false,
    useCORS: true,
  }).then((canvas) => {
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    const pageHeight = (contentWidth / A4_SIZE[0]) * A4_SIZE[1];
    let leftHeight = contentHeight;
    let position = 0;
    const imgWidth = A4_SIZE[0];
    const imgHeight = (A4_SIZE[0] / contentWidth) * contentHeight;
    const pageData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jspdf.jsPDF("", "pt", "a4");
    if (leftHeight < pageHeight) {
      pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
    } else {
      while (leftHeight > 0) {
        pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= A4_SIZE[1];
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    pdf.save(title + ".pdf");
  });
};


  const addPageFooter = (item, currentPage, diff) => {
    console.log(item.offsetTop, diff);
    let pageFooter = document.createElement("div");
    pageFooter.className = "c-page-foot"
    // pageFooter.innerHTML = "第" + currentPage + " 页"
    let parent = item.parentNode;
    parent.insertBefore(pageFooter, item);
    pageFooter.style.height = diff + "px";
  };

  const addPageHeader = (node, item) => {
    let pageHeader = document.createElement("div");
    pageHeader.className = "c-page-head";
    pageHeader.innerHTML = "页头内容";
    node.insertBefore(pageHeader, item);
  };

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
  downloadBtn.addEventListener("click", downloadPDF2);
  document.body.appendChild(downloadBtn);
})();
