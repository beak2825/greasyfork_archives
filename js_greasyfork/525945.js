// ==UserScript==
// @name         aio
// @namespace    http://tampermonkey.net/
// @version      2025-02-05
// @description  个人实用小插件
// @author       jiejiejie
// @match        http://www.juquge.com/*
// @match        https://geek-docs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juquge.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525945/aio.user.js
// @updateURL https://update.greasyfork.org/scripts/525945/aio.meta.js
// ==/UserScript==

// aio.ts
var aio = () => {
  const getCurrentUrl = () => window.location.href;
  const getWebSite = (url) => {
    let juqugeReg = /juquge/;
    let geekDocsReg = /geek-docs/;
    let coworkReg = /cowork/;
    if (juqugeReg.test(url)) {
      return "juquge";
    } else if (geekDocsReg.test(url)) {
      return "geekDocs";
    } else if (coworkReg.test(url)) {
      return "cowork";
    }
  };
  const DealJuquge = () => {
    const init = () => {
    };
    const main = () => {
    };
    init();
    main();
  };
  const DealGeekDocs = () => {
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
    const init = () => {
      let clearButton = document.createElement("button");
      clearButton.innerHTML = "清除广告";
      clearButton.setAttribute("style", "position: fixed; bottom: 100px; right: 0; z-index: 9999999999;");
      clearButton.onclick = main;
      document.body.appendChild(clearButton);
    };
    const main = () => {
      unlockScroll();
      deleteAds();
      fullContent();
    };
    init();
  };
  const DealWeixin110 = () => {
  };
  const DealCowork = () => {
    let fixButton = document.createElement("button");
    fixButton.innerHTML = "修复样式";
    fixButton.onclick = () => {
      let contentEle = document.querySelector(".box");
      contentEle.setAttribute("style", "width:-webkit-fill-available;height: 100%;");
    };
    let buttonForm = document.querySelector("form");
    buttonForm.appendChild(fixButton);
  };
  window.addEventListener("load", () => {
    let currentUrl = getCurrentUrl();
    let webSite = getWebSite(currentUrl);
    switch (webSite) {
      case "juquge":
        DealJuquge();
        break;
      case "geekDocs":
        DealGeekDocs();
        break;
      case "weixin110":
        break;
      case "cowork":
        DealCowork();
        break;
      default:
        console.log("当前页面无法处理");
    }
  });
};
aio();
