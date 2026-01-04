// ==UserScript==
// @name         m-team 馒头 列表缩略图
// @namespace    https://github.com/xianSheng-yo/m-team-image-thumbnail/edit/main/image-thumbnail.user.js
// @author       xianSheng-yo
// @version      1.0.04-2025-05-19
// @description  馒头站列表显示缩略图，鼠标移入放大预览。
// @copyright    2025, xianSheng-yo (https://github.com/xianSheng-yo)
// @match        https://*.m-team.cc/browse/*
// @icon         https://static.m-team.cc/static/media/logo.80b63235eaf702e44a8d.png
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/536506/m-team%20%E9%A6%92%E5%A4%B4%20%E5%88%97%E8%A1%A8%E7%BC%A9%E7%95%A5%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/536506/m-team%20%E9%A6%92%E5%A4%B4%20%E5%88%97%E8%A1%A8%E7%BC%A9%E7%95%A5%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const targetKeyword = "api/torrent/search";
  const thumbnailImgClassName = "m-team-img-thumbnail";
  const previewImgId = "m-team-img-preview";

  const appendImageElement = (data) => {
    const timer = setTimeout(() => {
      const tbody = document.querySelector("tbody");
      const trs = tbody.childNodes;
      document
        .querySelectorAll(`.${thumbnailImgClassName}`)
        .forEach((el) => el.remove());
      trs.forEach((tr, i) => {
        const td = tr.childNodes[1];
        td.childNodes[0].style.flex = "1";
        const div = document.createElement("div");
        div.style.display = "flex";
        const img = document.createElement("img");
        img.setAttribute("src", data[i].imageList[0]);
        img.setAttribute("alt", data[i].name);
        img.setAttribute("class", thumbnailImgClassName);
        img.style.height = "46px";
        img.style.marginRight = "8px";
        img.onerror = function () {
          if (!this.dataset.errorHandled) {
            this.dataset.errorHandled = "true";
            this.src =
              "https://static.m-team.cc/static/media/logo.80b63235eaf702e44a8d.png";
            img.style.width = "46px";
            this.style.objectFit = "cover";
            this.style.objectPosition = "left";
          }
        };
        div.appendChild(img);
        div.appendChild(td.childNodes[0]);
        td.insertBefore(div, td.firstElementChild);
      });
      clearTimeout(timer);
    }, 600);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url;
    return originalOpen.call(this, method, url, ...rest);
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener("load", function () {
      if (this._url && this._url.includes(targetKeyword)) {
        const responseText = this.responseText;
        try {
          const json = JSON.parse(responseText);
          appendImageElement(json.data.data || []);
        } catch (e) {
          console.error(e);
        }
      }
    });
    return originalSend.apply(this, args);
  };

  const appendPreviewImgElement = () => {
    if (!document.getElementById(previewImgId)) {
      const img = document.createElement("img");
      img.setAttribute("id", previewImgId);
      document.body.append(img);
    }
  };

  const mouseoverHandler = (e) => {
    const target = e.target;
    if (
      target.tagName === "IMG" &&
      target.src &&
      target.className === "m-team-img-thumbnail"
    ) {
      const previewImg = document.getElementById(previewImgId);
      const display = window.getComputedStyle(previewImg).display;
      if (display === "block") {
        return;
      }
      const imgNaturalWidth = target.naturalWidth;
      const imgNaturalHeight = target.naturalHeight;
      const ratio = imgNaturalWidth / imgNaturalHeight;
      const imgMaxHeight = 220;
      previewImg.src = target.src;
      previewImg.style.display = "block";
      previewImg.style.position = "absolute";
      previewImg.style.height = `${imgMaxHeight}px`;
      previewImg.style.width = `${imgMaxHeight * ratio}px`;
      previewImg.style.left = `${e.pageX + 8}px`;
      previewImg.style.top = `${e.pageY + 8}px`;
    }
  };

  const mouseoutHandler = () => {
    const previewImg = document.getElementById(previewImgId);
    if (previewImg) {
      previewImg.style.display = "none";
    }
  };

  window.addEventListener("load", appendPreviewImgElement);

  window.addEventListener("mouseover", mouseoverHandler);

  window.addEventListener("mouseout", mouseoutHandler);
})();


