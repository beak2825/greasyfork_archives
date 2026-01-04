// ==UserScript==
// @name         云展网PDF下载 YunZhanDownloader
// @namespace    https://github.com/lcandy2/YunZhanDownloader
// @version      1.4
// @author       lcandy2 kuku
// @description  从云展网下载PDF书籍
// @license      MIT
// @icon         https://book.yunzhan365.com/favicon.ico
// @match        https://*.yunzhan365.com/*
// @require      https://registry.npmmirror.com/jspdf/2.5.1/files/dist/jspdf.umd.min.js
// @require      https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539563/%E4%BA%91%E5%B1%95%E7%BD%91PDF%E4%B8%8B%E8%BD%BD%20YunZhanDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/539563/%E4%BA%91%E5%B1%95%E7%BD%91PDF%E4%B8%8B%E8%BD%BD%20YunZhanDownloader.meta.js
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
    console.log(url);
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
   const $phoneBottomBar = $("div.phoneBottomBar");
  const phoneBarAvailable = $phoneBottomBar.length;

  if (phoneBarAvailable && $("#dl-btn").length === 0) {
    observer.disconnect();
    console.log("Found phoneBottomBar:", $phoneBottomBar);

    // 创建“下载”按钮
    const $btnWrapper = $(`
      <div id="dl-dialog-btn" class="button" style="width: auto;">
        <p id="dl-btn" style="font-size: 14px; color: white; margin: 8px 0; cursor: pointer;">下载</p>
      </div>
    `);

    // 添加到底部栏
    $phoneBottomBar.append($btnWrapper);

    // 绑定点击事件
    $("#dl-btn").on("click", listener);

    return $btnWrapper;
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
    $dlbtn.html("下载中");
    $dlbtn.prop("disabled", true);
    $dlbtn.css("background-color", "#808080");
    $dlbtn.css("cursor", "not-allowed");
    $dlprogress.html("准备下载");
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
    const imagePromises = fliphtml5Pages.map((page) => getImageData("../files/large/" + page.n[0]));
    const convertToPDF = () => ConvertToPDF(imagePromises);
    addDownloadBtn(convertToPDF);
  });

})(jQuery, jspdf);