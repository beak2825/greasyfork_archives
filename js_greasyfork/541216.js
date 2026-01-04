// ==UserScript==
// @name         madou+
// @namespace    http://tampermonkey.net/
// @version      2025-06-30
// @description  显示缩略图
// @author       TT
// @match        https://madou.club/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=madou.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541216/madou%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/541216/madou%2B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const iframe = document.querySelector("iframe");
  if (!iframe) return;

  const videoId = iframe.src.split("/").at(-1);
  const imgurl = `https://dash.madou.club/videos/${videoId}/thumbnails.jpg`;

  const article = document.querySelector(".article-tags");
  if (!article) return;

  const thumbnailCount = 100;
  const thumbWidth = 160;
  const thumbHeight = 90;
  const thumbsPerRow = 5;

  const box = document.createElement("div");
  box.id = "abc";
  box.style.display = "flex";
  box.style.flexWrap = "wrap";
  box.style.gap = "0px";
  box.style.marginBottom = "1rem";

  for (let i = 0; i < thumbnailCount; i++) {
    const div = document.createElement("div");
    div.style.width = `${thumbWidth}px`;
    div.style.height = `${thumbHeight}px`;
    div.style.overflow = "hidden";
    div.style.flex = `0 0 auto`;

    const image = new Image();
    image.src = imgurl;
    image.style.maxWidth = "none";
    image.style.height = "100%";
    image.style.position = "relative";
    image.style.left = `-${thumbWidth * i}px`;

    div.appendChild(image);
    box.appendChild(div);
  }

  article.parentNode.insertBefore(box, article);
})();
