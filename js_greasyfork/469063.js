// ==UserScript==
// @name            載入kemono.party與coomer.party原始圖檔
// @name:zh-TW          載入kemono.party與coomer.party原始圖檔
// @name:ja         kemono.partyとcoomer.partyの元画像を読み込む
// @name:en         Load Original Images on kemono.party and coomer.party
// @description            這個腳本將原始圖檔自動載入，取代你一張一張的用手點。
// @description:zh-TW           這個腳本將原始圖檔自動載入，取代你一張一張的用手點。
// @description:ja          このスクリプトは各画像を手動でクリックする代わりに、元の画像を自動的に読み込みます。
// @description:en          This script automatically loads the original images instead of clicking on each one manually.
// @namespace    Violentmonkey Scripts
// @icon         https://kemono.party/static/favicon.ico
// @match        https://kemono.party/*/user/*/post/*
// @match        https://kemono.su/*/user/*/post/*
// @match        https://coomer.party/*/user/*/post/*
// @version      1.07
// @author       Max
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469063/%E8%BC%89%E5%85%A5kemonoparty%E8%88%87coomerparty%E5%8E%9F%E5%A7%8B%E5%9C%96%E6%AA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/469063/%E8%BC%89%E5%85%A5kemonoparty%E8%88%87coomerparty%E5%8E%9F%E5%A7%8B%E5%9C%96%E6%AA%94.meta.js
// ==/UserScript==

function convertImages() {
  var images = document.querySelectorAll("img");

  if (images.length > 0) {
    convertImage(images, 0);
  }
}

function convertImage(images, index) {
  if (index >= images.length) {
    return;
  }

  var image = images[index];
  var originalUrl = image.src;

  if (originalUrl.includes("static") || originalUrl.includes("icon") || originalUrl.includes("icons") || originalUrl.includes("banners")) {
    index++;
    convertImage(images, index);
    return;
  }

  var convertedUrl = originalUrl.replace("/thumbnail/", "/").replace("img.", "");
  image.src = convertedUrl;

  image.addEventListener("load", function() {
    index++;
    convertImage(images, index);
  });

  image.addEventListener("error", function() {
    var retryCount = parseInt(image.getAttribute("data-retry-count")) || 0;
    if (retryCount < 3) {
      image.setAttribute("data-retry-count", retryCount + 1);
      convertImage(images, index);
    } else {
      index++;
      convertImage(images, index);
    }
  });
}

convertImages();