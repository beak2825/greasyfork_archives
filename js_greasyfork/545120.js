// ==UserScript==
// @name         B站收藏夹收藏时间显示
// @namespace    https://github.com/Nouchi-Kousu/BiliFavDate
// @version      0.1.1
// @author       Nouchi
// @description  将B站收藏夹中被隐藏为“收藏于2年前”的视频还原为具体日期。
// @license      MIT
// @icon         http://bilibili.com/favicon.ico
// @match        *://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545120/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%94%B6%E8%97%8F%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545120/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%94%B6%E8%97%8F%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log("hello world");
  const favSpanSelector = ".items .items__item .bili-video-card__text span[title]";
  const followDivSelector = ".items .item div.relation-card-info-option";
  const waitForElement = (selector, callback) => {
    const targetNode = document.body;
    const observer = new MutationObserver(() => {
      const el = Array.from(
        document.querySelectorAll(selector)
      );
      if (el.length) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(targetNode, { childList: true, subtree: true });
  };
  const favElementModification = (medias, elements) => {
    if (medias.length !== elements.length) return;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].title.includes("2年前")) {
        const favTime = new Date(medias[i].fav_time * 1e3);
        const yyyy = favTime.getFullYear();
        const mm = String(favTime.getMonth() + 1).padStart(2, "0");
        const dd = String(favTime.getDate()).padStart(2, "0");
        elements[i].title = elements[i].title.replace(
          "2年前",
          `${yyyy}-${mm}-${dd}`
        );
        elements[i].innerHTML = elements[i].innerHTML.replace(
          "2年前",
          `${yyyy}-${mm}-${dd}`
        );
      }
    }
  };
  const createFollowDateChild = (followTime) => {
    const followDate = new Date(followTime * 1e3);
    const yyyy = followDate.getFullYear();
    const mm = String(followDate.getMonth() + 1).padStart(2, "0");
    const dd = String(followDate.getDate()).padStart(2, "0");
    const followDateStr = yyyy === (/* @__PURE__ */ new Date()).getFullYear() ? `${mm}-${dd}` : `${yyyy}-${mm}-${dd}`;
    const followDateChild = document.createElement("div");
    followDateChild.style.color = "rgb(97,102,109)";
    followDateChild.style.fontSize = "12px";
    followDateChild.style.marginLeft = "12px";
    followDateChild.title = `关注于${followDateStr}`;
    followDateChild.setAttribute("data-follow-time", followTime.toString());
    followDateChild.innerHTML = `关注于${followDateStr}`;
    return followDateChild;
  };
  const followElementModification = (followList, elements) => {
    if (followList.length !== elements.length) return;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].querySelector("div[data-follow-time]")) {
        continue;
      }
      const followDateChild = createFollowDateChild(followList[i].mtime);
      elements[i].appendChild(followDateChild);
    }
  };
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const clone = response.clone();
    const url = args[0] instanceof Request ? args[0].url : args[0];
    if (clone.headers.get("content-type") === "application/json; charset=utf-8") {
      if (String(url).includes("fav/resource/list")) {
        const data = await clone.json();
        if (data.data.medias) {
          waitForElement(favSpanSelector, (elements) => {
            favElementModification(data.data.medias, elements);
          });
        }
      } else if (String(url).includes("x/relation/followings") || String(url).includes("x/relation/fans")) {
        const data = await clone.json();
        if (data.data.list) {
          waitForElement(followDivSelector, (elements) => {
            followElementModification(data.data.list, elements);
          });
        }
      }
    }
    return response;
  };

})();