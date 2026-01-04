// ==UserScript==
// @name         云展网PDF下载 YunZhanDownloader
// @namespace    https://github.com/lcandy2/YunZhanDownloader
// @version      1.2
// @author       lcandy2
// @description  从云展网下载PDF书籍
// @license      MIT
// @icon         https://book.yunzhan365.com/favicon.ico
// @match        *://book.yunzhan365.com/*/*/mobile/*
// @require      https://registry.npmmirror.com/jspdf/2.5.1/files/dist/jspdf.umd.min.js
// @require      https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483545/%E4%BA%91%E5%B1%95%E7%BD%91PDF%E4%B8%8B%E8%BD%BD%20YunZhanDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/483545/%E4%BA%91%E5%B1%95%E7%BD%91PDF%E4%B8%8B%E8%BD%BD%20YunZhanDownloader.meta.js
// ==/UserScript==

(function ($, jspdf) {
  'use strict';

  const getFliphtml5Pages = async () => {
    try {
      const scriptTag = document.querySelector('script[src*="javascript/config.js"]');
      if (!scriptTag) {
        throw new Error("Script tag not found");
      }
      const src = scriptTag.getAttribute("src");
      const response = await fetch(src);
      const scriptContent = await response.text();
      const configMatch = scriptContent.match(/var htmlConfig = ({.*});/);
      if (!configMatch || !configMatch[1]) {
        throw new Error("htmlConfig not found in the script");
      }
      const configObject = JSON.parse(configMatch[1]);
      const fliphtml5_pages = configObject.fliphtml5_pages;
      return fliphtml5_pages;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const getImageData = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const addDownloadBtn = (listener) => {
    let observer;
    const checkAndProcessButtonBar = () => {
      const $buttonBar = $("div.fbTopBar div.buttonBar");
      const buttonBarAvailable = $buttonBar.length;
      const $shareTitle = $("div.share_form p.form_title");
      const $shareCloseBtn = $("div.share_form img.close");
      const $shareContent = $("div.share_form div.share_content");
      const shareFormAvailable = $shareTitle.length && $shareCloseBtn.length && $shareContent.length;
      if (buttonBarAvailable && shareFormAvailable) {
        observer.disconnect();
        console.log("Found buttonBar:", $buttonBar);
        const shareElement = $buttonBar.children().eq(8);
        const $element = $(`<p id="dl-dialog-btn" style="pointer-events: none; font-size: 12px; color: rgb(255, 255, 255);">下载</p>`);
        shareElement.html($element);
        $shareTitle.html("下载");
        $shareCloseBtn.remove();
        const downloadHtml = $(`<h1>下载《${$("title").text()}》</h1
            <br><br>
            <h2 id="dl-progress">未开始下载</h1>
            <br><br>
            <button id="dl-btn" style="width: 100%; height: 50px; font-size: 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">下载</button>`);
        $shareContent.html(downloadHtml);
        $("#dl-btn").on("click", listener);
        return shareElement;
      }
    };
    const observeDOM = (execute) => {
      observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
          if (mutation.addedNodes.length) {
            execute();
            break;
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };
    observeDOM(checkAndProcessButtonBar);
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const pdf = new jspdf.jsPDF();
  const ConvertToPDF = async (imagePromises) => {
    const $dlprogress = $("#dl-progress");
    const $dlbtn = $("#dl-btn");
    $dlbtn.html("下载中...");
    $dlbtn.prop("disabled", true);
    $dlbtn.css("background-color", "#808080");
    $dlbtn.css("cursor", "not-allowed");
    $dlprogress.html("准备下载...");
    const title2 = $("title").text();
    try {
      const images = await Promise.all(imagePromises);
      for (let index = 0; index < images.length; index++) {
        const progress = `下载中：${index + 1} / ${images.length} 页`;
        $dlprogress.html(progress);
        console.log(`Downloading: ${progress}`);
        if (index > 0)
          pdf.addPage();
        pdf.addImage(images[index], "WEBP", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        await delay(1e3);
      }
    } catch (error) {
      console.error("Error processing images:", error);
    }
    $dlbtn.html("下载 PDF");
    $dlbtn.prop("disabled", false);
    $dlbtn.css("background-color", "#007bff");
    $dlbtn.css("cursor", "pointer");
    $dlprogress.html("下载完成");
    console.log(`Downloading: ${title2}.pdf`);
    DownloadConvertedPDF();
    $dlbtn.off("click").on("click", DownloadConvertedPDF);
  };
  const DownloadConvertedPDF = async () => {
    pdf.save(`${title}.pdf`);
  };
  $(async () => {
    const fliphtml5Pages = await getFliphtml5Pages();
    if (!fliphtml5Pages) {
      console.error("fliphtml5Pages not found");
      return;
    }
    const imagePromises = fliphtml5Pages.map((page) => getImageData(page.n[0]));
    const convertToPDF = () => ConvertToPDF(imagePromises);
    addDownloadBtn(convertToPDF);
  });

})(jQuery, jspdf);