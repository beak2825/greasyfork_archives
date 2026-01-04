// ==UserScript==
// @name        kknowcc-imgur-proxy
// @namespace   Violentmonkey Scripts
// @match       https://kk.now.cc/**/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      Mesimpler
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @description kk.now.cc使用的是imgur图床，这个图床将大多数IP列入了黑名单导致图片无法正常加载，本脚本将论坛中所有imgur的图片链接替换成其镜像网站noobzone的链接以解决图片显示问题。
// @downloadURL https://update.greasyfork.org/scripts/546682/kknowcc-imgur-proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/546682/kknowcc-imgur-proxy.meta.js
// ==/UserScript==

// 代理URL
const PROXY_URL = "https://img.noobzone.ru/getimg.php?url=";

// 处理单个图片元素
function processImage(img) {
  const originalSrc = img.src;

  // 检查是否是Imgur图片
  if (originalSrc.startsWith("https://i.imgur.com/")) {
    // 创建代理URL
    const proxySrc = PROXY_URL + encodeURIComponent(originalSrc);

    // 使用GM_xmlhttpRequest绕过CORS和防盗链
    GM_xmlhttpRequest({
      method: "GET",
      url: proxySrc,
      responseType: "blob",
      onload: function (response) {
        if (response.status === 200) {
          // 创建对象URL并设置给img元素
          const blob = response.response;
          const objectUrl = URL.createObjectURL(blob);
          img.src = objectUrl;

          // 清理内存（可选）
          img.onload = function () {
            URL.revokeObjectURL(objectUrl);
          };
        } else {
          console.error("图片加载失败:", response.status, response.statusText);
        }
      },
      onerror: function (error) {
        console.error("请求错误:", error);
      },
    });
  }
}

// 处理所有现有图片
function processAllImages() {
  const images = document.querySelectorAll('img[src^="https://i.imgur.com/"]');
  images.forEach(processImage);
}

// 使用MutationObserver监听动态加载的图片
VM.observe(document.body, () => processAllImages());

// 初始处理
processAllImages();
