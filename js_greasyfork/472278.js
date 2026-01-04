// ==UserScript==
// @name         23.08.02旺销王商品模版下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  旺销王商品模版下载
// @author       menkeng
// @match        https://v3.wxwerp.com/goods/match/AliExpress*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wxwerp.com
// @run-at       context-menu
// @license      GPLv3
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472278/230802%E6%97%BA%E9%94%80%E7%8E%8B%E5%95%86%E5%93%81%E6%A8%A1%E7%89%88%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/472278/230802%E6%97%BA%E9%94%80%E7%8E%8B%E5%95%86%E5%93%81%E6%A8%A1%E7%89%88%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

const downloadCountElement = document.createElement("span");
downloadCountElement.id = "downloadCount";
downloadCountElement.style.fontSize = "14px";
downloadCountElement.style.fontWeight = "bold";
document.body.prepend(downloadCountElement);

// 保存已下载的ID到localStorage
function saveDownloadedIDToLocalStorage(id) {
  const downloadedIDs = getDownloadedIDsFromLocalStorage();
  downloadedIDs.push(id);
  localStorage.setItem("downloadedIDs", JSON.stringify(downloadedIDs));
}
function waitForElements(selector, callback) {
  const observer = new MutationObserver((mutationsList) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      observer.disconnect();
      callback(elements);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}


// 从localStorage读取已下载的ID
function getDownloadedIDsFromLocalStorage() {
  const downloadedIDsString = localStorage.getItem("downloadedIDs");
  if (downloadedIDsString) {
    return JSON.parse(downloadedIDsString);
  }
  return [];
}

let downloadCount = 0;
let currentIndex = 0;
let trElements = [];

function processTrElement(index) {
  if (index >= trElements.length) {
    console.log("全部商品下载完成");
    processNextPage(); // 自动点击下一页并继续下载
    return;
  }

  const tr = trElements[index];

  // 获取商品 ID
  const idElement = tr.querySelector(
    "div.match-caption > div:nth-child(2) > span:nth-child(3)"
  );
  const idtxt = idElement.textContent;
  const id = idtxt.match(/\d+/)[0];
  const downloadedIDs = getDownloadedIDsFromLocalStorage();
  if (!downloadedIDs.includes(id)) {
    // 执行自动化操作
    var CheckButton = tr.querySelector("td:first-child");
    const Outbutton = document.querySelector("div.btnGroup.pd-10px > button:nth-child(3)");
    const templateButton = "div.el-select-dropdown.el-popper > div > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > ul:nth-child(1) > li:nth-child(2) > ul > li"
    const LoadDiv = "div.loadingArea > div.loadingDown"
    const checkbox_L = "div.el-checkbox-group > label:nth-child(1)"
    const checkbox_R = "div.el-checkbox-group > div:nth-child(1) > label"
    const Loadtext = "div.el-dialog__body > div > div:nth-child(1) > div:nth-child(2) > div.dataexport > div.loadingArea > div.loadingDown > div.state > span"
    const StartButton = "button.el-button.dialogEnterBtn.el-button--primary"
    const CloseButton = "div.el-dialog__header > div > div > i.el-icon-close"
    const Loading = "div.el-dialog__body > div > div:nth-child(1) > div:nth-child(2) > div.success[style='']"

    CheckButton.click();
    console.log(`当前为第 ${index + 1} / ${trElements.length} 个商品`);
    Outbutton.click();
    waitForElements(checkbox_L, () => {
      document.querySelector(templateButton).click();
      waitForElements(checkbox_R, () => {
        document.querySelector(StartButton).click();
      })
    })
    waitForElements(LoadDiv, () => {
      console.log(`正在下载${id}`);
      console.log(document.querySelector(Loadtext).innerText);
      waitForElements(Loading, () => {
        CheckButton.click();
        document.querySelector(CloseButton).click();
        saveDownloadedIDToLocalStorage(id);
        console.log(`当前下载次数:${downloadCount}`);
        downloadCount++;
        downloadCountElement.textContent = `已下载次数: ${downloadCount}`;
        processTrElement(index + 1);
      })
    })
  } else {
    console.log(`ID ${id} 已经下载`);
    // 处理下一个 tr 元素
    processTrElement(index + 1);
  }
}
let waitForElementsTriggered = false;
function processNextPage() {
  var nextPageButton = document.querySelector(
    "div.bottom-menu.sticky-bottom.border-b > div.bottom-layout > div > button.btn-next"
  );
  if (nextPageButton) {
    nextPageButton.click();
      setTimeout(() => {
        trElements = document.querySelectorAll("tbody tr");
        if (trElements.length > 0) {
          currentIndex = 0;
          processTrElement(currentIndex);
        } else {
          console.log("下一页没有商品.");
        }
      }, 4000);
  }
}

// 等待商品列表加载完成
trElements = document.querySelectorAll("tbody tr");
processTrElement(currentIndex);