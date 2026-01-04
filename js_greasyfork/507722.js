// ==UserScript==
// @name         tradingview market assistant
// @namespace    http://tampermonkey.net/
// @version      2024-10-31
// @description  insert a similar style button in tradingview market page
// @author       goodzhuwang
// @match        https://*.tradingview.com/markets/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507722/tradingview%20market%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/507722/tradingview%20market%20assistant.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ext_name = "tradingview market assistant";

  console.debug(`${ext_name} running`);

  let batch_button_id = "__batch_copybtn";
  let item_class_selector = ".tickerNameBox-GrtoTeat.tickerName-GrtoTeat";

  function getItems() {
    return document.querySelectorAll(item_class_selector);
  }

  function copyToClipboard(text) {
    // 将文本复制到剪贴板
    navigator.clipboard
      .writeText(text)
      .then(function () {
        console.log("Text copied to clipboard");
      })
      .catch(function (err) {
        console.error("Failed to copy text to clipboard: ", err);
      });
  }

  function findElementsByClassRegex(classNameRegex) {
    const selector = `*[class^="${classNameRegex.source}"]`;
    return document.querySelectorAll(selector);
  }

  // 显示Toast消息
  function showToast(message) {
    // 创建一个div元素作为Toast消息容器
    var toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.top = "5%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";
    toast.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    toast.style.color = "#fff";
    toast.style.padding = "10px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";

    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      document.body.removeChild(toast);
    }, 2000);
  }

  function insertStyleNode() {
    let style_node_id = "_my_button_style";

    // 获取具有ID为myDiv的节点
    var el = document.getElementById(style_node_id);

    // 从body中删除myDiv节点
    if (el) {
      document.body.removeChild(el);
    }

    // 创建一个style元素
    var style = document.createElement("style");

    style.id = style_node_id;
    // 设置style元素的内容为CSS代码
    style.innerHTML = `
      ._LC-button {
        border: none;
        padding: 3px 5px;
        background-color: #007bff4f;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        font-size: 10px;
      }
      ._LC-batch-copy-button{
        border-radius: 6px;
        font-size: 12px;
        min-width: 34px;
        --ui-lib-light-button-default-color-bg: #0000;
        --ui-lib-light-button-default-color-content: #131722;
        --ui-lib-light-button-default-color-border: #e0e3eb;
        align-items: center;
        background-color: var(--ui-lib-light-button-color-bg, var(--ui-lib-light-button-default-color-bg));
        border-color: var(--ui-lib-light-button-color-border, var(--ui-lib-light-button-default-color-border));
        border-style: solid;
        border-width: 1px;
        box-sizing: border-box;
        color: var(--ui-lib-light-button-color-content, var(--ui-lib-light-button-default-color-content));
        cursor: default;
        display: flex;
        justify-content: center;
        min-width: 36px;
        outline: none;
        padding: 0;
        margin-right: 0;
      }

      ._LC-chart-link,._LC-copy-button{
        font-family: -apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif;
        font-feature-settings: "tnum" on, "lnum" on;
        --ui-lib-typography-line-height: 16px;
        line-height: var(--ui-lib-typography-line-height);
        --ui-lib-typography-font-size: 12px;
        background-color: #f0f3fa;
        border:none;
        border-radius: 6px;
        margin-left:3px;
        box-sizing: border-box;
        color: #131722;
        display: block;
        font-size: var(--ui-lib-typography-font-size);
        font-style: normal;
        font-weight: 600;
        max-width: 96px;
        min-width: 36px;
        overflow: hidden;
        padding: 4px 8px;
        text-align: center;
        text-overflow: ellipsis;
        text-transform: uppercase;
        white-space: nowrap;
        cursor:pointer;
      }
      ._LC-fixed{
        position: fixed;
        right: 0;
        top: 20%;
        z-index: 1024;
      }
      ._LC-button:hover {
        background-color: #f0f3fa;
      }

      ._LC-button:active {
        background-color: #0033664f;
      }
    `;

    // 将style元素添加到body中
    document.body.appendChild(style);
  }

  // 插入“复制全部”按钮到页面
  function insertCopyAllButton() {
    // 代码元素列表
    const symbol_elements = getItems();
    if (!symbol_elements || symbol_elements.length == 0) {
      console.warn('没有找到股票代码')
      return;
    }

    let buttonWrapper = document.querySelector(
      "#market-screener-header-columnset-tabs"
    );
    if (!buttonWrapper) {
      console.warn('#market-screener-header-columnset-tabs元素没找到，退化')
      buttonWrapper = document.getElementById("js-screener-container");
    }
    if (!buttonWrapper) {
      console.warn('#js-screener-container元素没找到，退化，使用body吧')
      buttonWrapper = document.body;
    }

    // 获取具有ID为myDiv的节点
    var copybtn = document.getElementById(batch_button_id);

    // 从body中删除myDiv节点
    if (copybtn) {
      buttonWrapper.removeChild(copybtn);
    }

    // 创建一个div元素
    copybtn = document.createElement("button");

    // 设置div元素的属性和样式
    copybtn.id = batch_button_id;
    copybtn.classList.add("_LC-button");
    copybtn.classList.add("_LC-batch-copy-button");
    // copybtn.innerText = "复制代码";
    copybtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none"><rect x="11.13" y="17.72" width="33.92" height="36.85" rx="2.5"/><path d="M19.35,14.23V13.09a3.51,3.51,0,0,1,3.33-3.66H49.54a3.51,3.51,0,0,1,3.33,3.66V42.62a3.51,3.51,0,0,1-3.33,3.66H48.39"/></svg>`;
    // 将div元素插入到body中

    copybtn.title = "批量复制股票代码";

    buttonWrapper.appendChild(copybtn);

    copybtn.addEventListener("click", function (event) {
      const texts = [];
      symbol_elements.forEach((el) => {
        texts.push(el.innerText);
      });

      if (texts.length === 0) {
        showToast("页面中没有找到代码，请检查脚本选择器");
      } else {
        const res = texts.join(", ");
        copyToClipboard(res);
        // alert('复制成功')
        // 示例用法
        showToast(`已复制 ${texts.length} 个代码到剪贴板`);
      }
    });
  }

  insertStyleNode();

  insertCopyAllButton();
})();
