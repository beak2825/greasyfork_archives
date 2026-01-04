// ==UserScript==
// @name         HpoiGalleryDownload
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为Hpoi概览页面图片和相册添加下载按钮
// @author       ZtyanCrany
// @license      MIT
// @match        https://www.hpoi.net/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/523867/HpoiGalleryDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/523867/HpoiGalleryDownload.meta.js
// ==/UserScript==

let strecth = document.createElement("style");
strecth.textContent = `
@keyframes strecth {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
`;
document.head.appendChild(strecth);

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function createButton(imgSrc) {
  let downloadButton = document.createElement("download");
  downloadButton.innerText = "▼";
  downloadButton.style.position = "absolute";
  downloadButton.style.bottom = "10px";
  downloadButton.style.right = "10px";
  downloadButton.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
  downloadButton.style.color = "#39C5BB";
  downloadButton.style.border = "2px solid #39C5BB";
  downloadButton.style.padding = "3px 6.5px";
  downloadButton.style.borderRadius = "5px";
  downloadButton.style.cursor = "pointer";
  downloadButton.style.zIndex = "9999";
  downloadButton.style.fontSize = "16px";

  downloadButton.addEventListener("click", () => {
    downloadButton.style.animation = "strecth 0.3s";

    const a = document.createElement("a");
    a.href = imgSrc;
    a.click();
  });
  return downloadButton;
}

function addButton() {
  const swiperSlides = document.querySelectorAll(
    ".swiper-slide.hpoi-auto-width.hpoi-set-height"
  );
  swiperSlides.forEach((slide) => {
    const img = slide.querySelector("img");
    if (img) {
      let imgSrc = img.src.replace("/s/", "/raw/");
      if (!slide.querySelector(".download-button")) {
        let downloadButton = createButton(imgSrc);
        slide.style.position = "relative";
        downloadButton.classList.add("download-button");
        slide.appendChild(downloadButton);
      }
    }
  });

  const waterfallIbox = document.querySelectorAll(".waterfall-ibox");
  waterfallIbox.forEach((ibox) => {
    const img = ibox.querySelector("img");
    if (img) {
      let imgSrc = img.src.replace("/n/", "/raw/");
      if (!ibox.querySelector(".download-button")) {
        let downloadButton = createButton(imgSrc);
        ibox.style.position = "absolute";
        downloadButton.classList.add("download-button");
        ibox.appendChild(downloadButton);
      }
    }
  });
}

(function () {
  "use strict";
  window.addEventListener("load", () => {
    addButton();

    const observer = new MutationObserver(
      debounce(() => {
        addButton();
      }, 500)
    );
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  });
})();