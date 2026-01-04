// ==UserScript==
// @name         QuickDownloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据不同的网站添加下载功能的按钮
// @match        *://*.amazon.com/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.de/*
// @match        *://*.amazon.fr/*
// @match        *://*.amazon.it/*
// @match        *://*.amazon.es/*
// @match        *://*.amazon.ca/*
// @match        *://*.amazon.co.jp/*
// @match        *://*.amazon.cn/*
// @match        *://*.amazon.in/*
// @match        *://*.amazon.com.br/*
// @match        *://*.amazon.com.mx/*
// @match        *://*.amazon.com.au/*
// @match        *://*.amazon.nl/*
// @match        *://*.amazon.sg/*
// @match        *://*.goodreads.com/*
// @match        *://*.douban.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js
// 添加 Font Awesome CSS
// @resource     fontawesome https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512202/QuickDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/512202/QuickDownloader.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 兼容性层
  const getValue = (key, defaultValue) => {
    if (typeof GM_getValue === "function") {
      return GM_getValue(key, defaultValue);
    }
    const value = localStorage.getItem(key);
    return value === null ? defaultValue : value;
  };

  const setValue = (key, value) => {
    if (typeof GM_setValue === "function") {
      GM_setValue(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  };

  // 检查当前URL并决定行为
  function checkUrlAndAct() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("amazon")) {
      return handleAmazonDownload();
    } else if (currentUrl.includes("goodreads.com")) {
      return handleGoodreadsDownload();
    } else if (currentUrl.includes("douban.com")) {
      return handleDoubanDownload();
    }
    // 可以继续添加其他网站的处理函数
  }

  // 处理亚马逊网站的下载
  function handleAmazonDownload() {
    const button = createButton("下载书籍", "fa-download");
    button.addEventListener("click", function () {
      const params = extractAmazonParams();
      const targetUrl = buildTargetUrl(params);
      window.open(targetUrl, "_blank");
    });
    insertButton(button);
  }

  // 处理Goodreads网站的下载
  function handleGoodreadsDownload() {
    const button = createButton("下载书籍", "fa-download");
    button.addEventListener("click", function () {
      const bookTitle = extractGoodreadsBookTitle();
      const params = encodeURIComponent(bookTitle);
      const targetUrl = buildTargetUrl(params);
      window.open(targetUrl, "_blank");
    });
    insertButton(button);
  }

  // 处理豆瓣网站的下载
  function handleDoubanDownload() {
    const button = createButton("下载书籍", "fa-download");
    button.addEventListener("click", function () {
      const bookTitle = extractDoubanBookTitle();
      const params = encodeURIComponent(bookTitle);
      const targetUrl = buildTargetUrl(params);
      window.open(targetUrl, "_blank");
    });
    insertButton(button);
  }

  // 创建按钮
  function createButton(title, iconClass) {
    const button = document.createElement("button");
    button.innerHTML = `<i class="fas ${iconClass}"></i>`;
    button.title = title;
    button.style.display = "inline-block";
    button.style.marginLeft = "10px";
    button.style.background = "none";
    button.style.border = "none";
    button.style.fontSize = "24px";
    button.style.color = "#0066c0";
    button.style.cursor = "pointer";
    button.style.verticalAlign = "middle";
    return button;
  }

  // 从亚马逊页面提取参数
  function extractAmazonParams() {
    const productTitle = document
      .querySelector("#productTitle")
      ?.textContent.trim();
    return encodeURIComponent(productTitle);
  }

  // 从Goodreads页面提取书名
  function extractGoodreadsBookTitle() {
    const bookTitle = document.querySelector("h1")?.textContent.trim();
    return bookTitle || "";
  }

  // 从豆瓣页面提取书名
  function extractDoubanBookTitle() {
    const bookTitle = document.querySelector("h1 span")?.textContent.trim();
    return bookTitle || "";
  }

  // 构建目标URL
  function buildTargetUrl(params) {
    const baseUrl = getValue("targetBaseUrl", "https://zh.singlelogin.re/s/");
    return `${baseUrl}${params}?`;
  }

  // 插入按钮到指定位置
  function insertButton(button) {
    let targetElement;
    if (window.location.href.includes("amazon")) {
      targetElement = document.querySelector("#productTitle");
    } else if (window.location.href.includes("goodreads.com")) {
      targetElement = document.querySelector("h1");
    } else if (window.location.href.includes("douban.com")) {
      targetElement = document.querySelector("h1 span");
    }

    if (targetElement) {
      targetElement.style.display = "inline-block";
      targetElement.style.marginRight = "10px";
      targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
    } else {
      console.error("未找到插入按钮的目标元素");
    }
  }

  // 设置配置的函数
  function setConfig() {
    const newBaseUrl = prompt(
      "请输入新的基础 URL：",
      getValue("targetBaseUrl", "https://zh.singlelogin.re/s/")
    );
    if (newBaseUrl !== null) {
      setValue("targetBaseUrl", newBaseUrl);
      alert("基础 URL 已更新！");
    }
  }

  // 主函数
  function main() {
    checkUrlAndAct();

    const configButton = createButton("设置下载地址", "fa-cog");
    configButton.addEventListener("click", setConfig);
    insertButton(configButton);
  }

  // 运行主函数
  main();
})();
