// ==UserScript==
// @name         aio
// @namespace    http://tampermonkey.net/
// @version      2025-02-20
// @description  个人实用小插件
// @author       jiejiejie
// @match        *://*.juquge.com/*
// @match        *://geek-docs.com/*
// @match        *://weixin110.qq.com/*
// @match        *://cowork.apexsoft.com.cn/*
// @match        *://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juquge.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527497/aio.user.js
// @updateURL https://update.greasyfork.org/scripts/527497/aio.meta.js
// ==/UserScript==
var timer = null;
var aio = () => {
  // 等待页面加载完成
  // 获取当前用户 url
  const getCurrentUrl = () => window.location.href;
  const getWebSite = (url) => {
    let juqugeReg = /juquge/;
    let geekDocsReg = /geek-docs/;
    let coworkReg = /cowork/;
    let bilibili = /bilibili/;
    if (juqugeReg.test(url)) {
      return "juquge";
    } else if (geekDocsReg.test(url)) {
      return "geekDocs";
    } else if (coworkReg.test(url)) {
      return "cowork";
    } else if (bilibili.test(url)) {
      return "bilibili";
    }
  };
  // 处理笔趣阁样式
  const DealJuquge = () => {
    const init = () => {
    };
    const main = () => {
    };
    init();
    main();
  };
  // 处理极客文档
  const DealGeekDocs = () => {
    // 解锁无法滚动
    const unlockScroll = () => {
      document.body.setAttribute("style", "overflow: auto");
      console.log("滚动条已解锁");
    };
    // 删除广告
    const deleteAds = () => {
      // 删除开屏广告
      let viewAdEle = document.querySelector(".fc-message-root");
      viewAdEle?.parentElement?.removeChild(viewAdEle);
      // 删除右侧广告
      let rightAds = document.querySelector(".tbrside");
      rightAds?.parentElement?.removeChild(rightAds);
      // 删除底部广告
      let bottomAds = document.querySelector(".adsbygoogle");
      bottomAds?.parentElement?.removeChild(bottomAds);
      // 去除文章中广告
      let contentAds = document.querySelectorAll(".eaa_desktop");
      contentAds.forEach((item) => {
        item.parentElement?.removeChild(item);
      });
      console.log("广告已删除");
    };
    // 平铺文章
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
      // deal_geekDocs()
    };
    const main = () => {
      unlockScroll();
      deleteAds();
      fullContent();
    };
    init();
  };
  // 处理系统浏览器打开微信 110 页面
  const DealWeixin110 = () => {
  };
  // 处理 cowork 在 firefox 上的样式问题
  const DealCowork = () => {
    let iframeEle = document.querySelector("iframe").contentWindow;
    const dealAlert = () => {
      iframeEle.alert = () => {
      };
      window.alert = () => {
      };
    };
    const dealStyle = () => {
      let fixButton = document.createElement("button");
      fixButton.innerHTML = "修复样式";
      fixButton.onclick = () => {
        let contentEle = iframeEle.document.querySelector(".mainContainer");
        contentEle.setAttribute("style", "width:-webkit-fill-available;height: 100%;");
      };
      let mountNodeLength = iframeEle.document.querySelectorAll(".left_menu").length;
      let buttonForm = iframeEle.document.querySelectorAll(".left_menu")[mountNodeLength - 1 > 0 ? mountNodeLength - 1 : 0];
      buttonForm.appendChild(fixButton);
    };
    dealAlert();
    dealStyle();
  };
  // 添加 bilibili 控件
  const DealBilibili = () => {
    console.log("bilibili-aio-loaded");
    let toolboxLeft = document.querySelector(".video-toolbar-left");
    let playbackRateBtnPlus = document.createElement("button");
    let playbackRateBtnMinus = document.createElement("button");
    playbackRateBtnPlus.innerHTML = ">>+";
    playbackRateBtnMinus.innerHTML = "<<-";
    playbackRateBtnPlus.setAttribute("style", "padding: 0px 12px;font-size:14px;");
    playbackRateBtnMinus.setAttribute("style", "padding: 0px 12px;font-size:14px;");
    playbackRateBtnPlus.onclick = () => {
      let video = document.querySelector("video");
      let currentRate = video.playbackRate;
      video.playbackRate = currentRate + 0.5;
    };
    playbackRateBtnMinus.onclick = () => {
      let video = document.querySelector("video");
      let currentRate = video.playbackRate;
      video.playbackRate = currentRate - 0.5;
    };
    toolboxLeft.appendChild(playbackRateBtnPlus);
    toolboxLeft.appendChild(playbackRateBtnMinus);
  };
  if (!window || !window.addEventListener) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      aio();
    }, 2000);
  } else {
    if (timer) {
      clearTimeout(timer);
    }
    window.addEventListener("load", () => {
      console.log("页面加载完成");
      let currentUrl = getCurrentUrl();
      let webSite = getWebSite(currentUrl);
      console.log(webSite);
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
        case "bilibili":
          DealBilibili();
          break;
        default:
          console.log("当前页面无法处理");
      }
      // DealWeixin110()
    });
  }
};
aio();
