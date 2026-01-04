// ==UserScript==
// @name         wnacg-slide
// @namespace    npm/vite-plugin-monkey
// @version      0.1.0
// @author       hamasakin
// @description  为wnacg添加快捷下拉阅读按钮
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        https://www.wnacg.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533429/wnacg-slide.user.js
// @updateURL https://update.greasyfork.org/scripts/533429/wnacg-slide.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .pic_box{position:releative}.slide-btn{position:absolute;bottom:6px;left:0;right:0;flex-direction:column;align-items:center;display:none;transition:all .3s ease}.pic_box:hover .slide-btn{display:flex;cursor:pointer}.slide-btn p{width:80%;background-color:#0006;color:#fff;font-size:16px;font-weight:600;text-align:center;line-height:26px;border-radius:12px}.back-btn{position:fixed;left:40px;bottom:40px;border:none;background-color:transparent}.back-btn:hover{cursor:pointer}.back-btn svg{width:34px;height:34px} ");

(function () {
  'use strict';

  const isSlidePage = () => /\/photos-slide-aid-\d+\.html/.test(window.location.pathname);
  const forwardComicHomePage = (comicId) => window.location.href = `/photos-index-aid-${comicId}`;
  const homeBtnSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#74C0FC" d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>`;
  function createSlideBtn() {
    const slideBtnTemplate = `
    <div class="slide-btn">
      <p>slide view</p>
    </div>
  `;
    const slideBtn = new DOMParser().parseFromString(
      slideBtnTemplate,
      "text/html"
    );
    return slideBtn.querySelector(".slide-btn");
  }
  function createSlideLink(comicId) {
    const url = `/photos-slide-aid-${comicId}.html`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    return link;
  }
  function addSlideBtns() {
    const comicBoxs = document.querySelectorAll(".pic_box");
    const slideBtn = createSlideBtn();
    comicBoxs.forEach((box) => {
      const comicId = box.querySelector("a").href.replace(/\D/g, "");
      const link = createSlideLink(comicId);
      link.append(slideBtn);
      box.append(link.cloneNode(true));
    });
  }
  function addComicHomeBtn() {
    if (isSlidePage()) {
      const homeBtn = document.createElement("button");
      homeBtn.innerHTML = homeBtnSvg;
      homeBtn.className = "back-btn";
      homeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const comicId = window.location.pathname.replace(/\D+/g, "");
        forwardComicHomePage(comicId);
      });
      document.body.append(homeBtn);
    }
  }
  addSlideBtns();
  addComicHomeBtn();

})();