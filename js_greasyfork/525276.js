// ==UserScript==
// @name         nhentai-infinite-scroll (Fixed) in 2026
// @version      1.0.0.fixed
// @description  It applies a very simple fix to make the original nhentai-infinite-scroll work again.
// @author       DyKx0V
// @namespace    Violentmonkey Scripts
// @icon         https://i.imgur.com/I5Muasr.png
// @match        *://*.nhentai.net/g/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525276/nhentai-infinite-scroll%20%28Fixed%29%20in%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/525276/nhentai-infinite-scroll%20%28Fixed%29%20in%202026.meta.js
// ==/UserScript==


(function () {
  "use strict";

  let thumbnailContainer = document.getElementById("thumbnail-container");
  let gallerythumb = document.getElementsByClassName("gallerythumb");

  if (
    thumbnailContainer === null ||
    gallerythumb === null ||
    gallerythumb.length === 0
  )
    return;

  let formats = [];

  let sheet = (function () {
    let style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
  })();

  sheet.insertRule("#thumbnail-container > img { width: 100%; }", 0);

  let mid = document
    .getElementById("cover")
    .getElementsByTagName("img")[0]
    .src.split("/")[4];

  for (let a of gallerythumb) {
    let s = a.firstElementChild.getAttribute("data-src").split("/");
    formats.push(s[5].split(".")[1]);
    mid = s[4];
  }

  while (thumbnailContainer.firstChild) {
    thumbnailContainer.removeChild(thumbnailContainer.firstChild);
  }

  let lastId = 0;
  let timerId = null;
  loadNextImage();

  function loadNextImage() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }

    let image = new Image();
    image.src =
      "https://i4.nhentai.net/galleries/" +
      mid +
      "/" +
      (lastId + 1) +
      "." +
      formats[lastId];
    thumbnailContainer.append(image);

    image.onload = function () {
      lastId++;
      if (lastId < formats.length) {
        loadNextImage();
      }
    };

    image.onerror = function () {
      thumbnailContainer.lastElementChild.remove();
      timerId = setTimeout(loadNextImage, 1000);
    };
  }
})();