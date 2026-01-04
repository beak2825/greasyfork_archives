// ==UserScript==
// @name 自動開啟全部圖片並載入pixiv原始圖檔
// @name:zh-TW 自動開啟全部圖片並載入pixiv原始圖檔
// @name:ja 全ての畫像を自動的に展開し、pixiv元の畫像を読み込む
// @name:en Expand All Images and Load Original Images on pixiv
// @description 若作品有多張圖片，自動將其展開；將原始圖檔自動載入。
// @description:zh-TW 若作品有多張圖片，自動將其展開；將原始圖檔自動載入。
// @description:ja 作品に複數の畫像がある場合、自動的に展開し、元の畫像を読み込みます。
// @description:en Automatically expands all images if the artwork has multiple images and loads the original images.
// @namespace Violentmonkey Scripts
// @icon https://www.pixiv.net/favicon.ico
// @match https://www.pixiv.net/artworks/*
// @version 1.07
// @author Max
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469358/%E8%87%AA%E5%8B%95%E9%96%8B%E5%95%9F%E5%85%A8%E9%83%A8%E5%9C%96%E7%89%87%E4%B8%A6%E8%BC%89%E5%85%A5pixiv%E5%8E%9F%E5%A7%8B%E5%9C%96%E6%AA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/469358/%E8%87%AA%E5%8B%95%E9%96%8B%E5%95%9F%E5%85%A8%E9%83%A8%E5%9C%96%E7%89%87%E4%B8%A6%E8%BC%89%E5%85%A5pixiv%E5%8E%9F%E5%A7%8B%E5%9C%96%E6%AA%94.meta.js
// ==/UserScript==

function convertImages() {
  var images = document.querySelectorAll("img");

  if (images.length > 0) {
    convertImage(images, 0);
  } else {
    console.log("抓不到圖片");
  }
}

function convertImage(images, index) {
  if (index >= images.length) {
    console.log("所有圖片轉換完成");
    return;
  }

  var image = images[index];
  var originalUrl = image.src;

  if (!originalUrl.includes("img-master") || originalUrl.includes("square")) {
    index++;
    convertImage(images, index);
    return;
  }

  var parentLink = image.parentElement;
  if (parentLink.tagName === "A" && parentLink.href) {
    image.src = parentLink.href;
    var convertedUrl = parentLink.href;
  } else {
    convertedUrl = originalUrl.replace("img-master", "img-original").replace("_master1200.jpg", ".png");
    image.src = convertedUrl;
  }
  index++;
  convertImage(images, index);

  image.addEventListener("load", function() {
    console.log("圖片載入成功:", originalUrl, "=>", convertedUrl);
    index++;
    convertImage(images, index);
  });

  image.addEventListener("error", function() {
    var retryCount = parseInt(image.getAttribute("data-retry-count")) || 0;
    if (retryCount < 3) {
      image.setAttribute("data-retry-count", retryCount + 1);
      console.log("圖片載入失敗，進行重試:", originalUrl, "=>", convertedUrl);
      convertImage(images, index);
    } else {
      console.log("圖片載入失敗，重試次數已達上限:", convertedUrl);
      index++;
      convertImage(images, index);
    }
  });
}

function pressButtonAndWait() {
  var button = document.querySelector(".sc-emr523-0.guczbC");
  if (button) {
    console.log("找到按鈕:", button);
    button.click();
  }
}

function mutationCallback(mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList') {
        pressButtonAndWait();
      convertImages();
    }
  }
}
var observer = new MutationObserver(mutationCallback);

var observerConfig = {
  childList: true,
  subtree: true
};

observer.observe(document.documentElement, observerConfig);
convertImages();