// ==UserScript==
// @name         aio
// @namespace    http://tampermonkey.net/
// @version      2025-01-13
// @description  个人实用小插件
// @author       jiejiejie
// @match        http://www.juquge.com/*
// @match        https://geek-docs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juquge.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523625/aio.user.js
// @updateURL https://update.greasyfork.org/scripts/523625/aio.meta.js
// ==/UserScript==

// aio.ts
var aio = () => {
  const getCurrentUrl = () => window.location.href;
  const getWebSite = (url) => {
    let juqugeReg = /juquge/;
    let geekDocsReg = /geek-docs/;
    if (juqugeReg.test(url)) {
      return "juquge";
    } else if (geekDocsReg.test(url)) {
      return "geekDocs";
    }
  };
  const deal_juquge = () => {
  };
  const unlockScroll = () => {
    document.body.setAttribute("style", "overflow: auto");
    console.log("滚动条已解锁");
  };
  const deleteAds = () => {
    let viewAdEle = document.querySelector(".fc-message-root");
    viewAdEle?.parentElement?.removeChild(viewAdEle);
    let rightAds = document.querySelector(".tbrside");
    rightAds?.parentElement?.removeChild(rightAds);
    let bottomAds = document.querySelector(".adsbygoogle");
    bottomAds?.parentElement?.removeChild(bottomAds);
    let contentAds = document.querySelectorAll(".eaa_desktop");
    contentAds.forEach((item) => {
      item.parentElement?.removeChild(item);
    });
    console.log("广告已删除");
  };
  const fullContent = () => {
    let contentWrapEle = document.querySelector(".content-wrap");
    let contentEle = document.querySelector(".content");
    contentWrapEle.setAttribute("style", "margin-right: 0 !important");
    contentEle.setAttribute("style", "margin-right: 0 !important");
    console.log("文章已平铺");
  };
  const deal_geekDocs = () => {
    unlockScroll();
    deleteAds();
    fullContent();
  };
  window.addEventListener("load", () => {
    let currentUrl = getCurrentUrl();
    let webSite = getWebSite(currentUrl);
    if (webSite === "juquge") {
      deal_juquge();
    } else if (webSite === "geekDocs") {
      let clearButton = document.createElement("button");
      clearButton.innerHTML = "清除广告";
      clearButton.setAttribute("style", "position: fixed; bottom: 100px; right: 0; z-index: 9999999999;");
      clearButton.onclick = deal_geekDocs;
      document.body.appendChild(clearButton);
    }
  });
};
aio();
