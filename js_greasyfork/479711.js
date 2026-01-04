// ==UserScript==
// @name         去掉哔哩哔哩推荐广告
// @namespace    https://greasyfork.org/zh-CN/users/1208108-%E8%BD%BB%E8%BD%BB%E8%AF%B4%E5%87%BA%E6%9D%A5?locale_override=1
// @version      0.6
// @description  去掉bilibili的推荐广告
// @author       轻轻说出来
// @license      轻轻说出来
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/index.html
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479711/%E5%8E%BB%E6%8E%89%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/479711/%E5%8E%BB%E6%8E%89%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let url = location.pathname
  if (url.includes("/index.html") || url == "/") {
    let initialHeight = window.innerHeight * 6.5
    Object.defineProperty(window, 'innerHeight', { value: initialHeight, writable: false });
    let addStyle = document.createElement("style")
    addStyle.innerText = ` 
.feed-card,.container>.bili-video-card.is-rcmd{margin-top:20px !important} .isMask { width: 100%; height: 300px; text-align: center; line-height: 300px;background: #f1f2f3;} .bili-header__bar.slide-down{backdrop-filter: blur(100px) !important;background: rgba(255,255,255,.6) !important} .header-channel, .flexible-roll-btn, .recommended-swipe.grid-anchor, .floor-single-card, .floor-single-card:has(> .floor-card.single-card .badge), .bili-video-card.is-rcmd:has(> .bili-video-card__wrap.__scale-wrap .bili-video-card__info--ad), .bili-video-card.is-rcmd:has(> .bili-video-card__wrap.__scale-wrap .bili-video-card__info--creative-ad), .bili-live-card.is-rcmd:has(> .bili-live-card__wrap .bili-live-card__info--living), .feed-card:has(> .bili-video-card .bili-video-card__info--ad), .feed-card:has(> .bili-video-card .bili-video-card__info--creative-ad), .desktop-download-tip {display:none !important} .bili-feed4-layout{display:none} body {overflow-y: hidden;}
   `
    document.head.appendChild(addStyle)

    let oldtime = new Date()
    let mask = document.createElement("div")
    mask.innerText = "加载中请稍候..."
    let time = setInterval(() => {
      if (!document.body) return
      window.scrollTo(0, document.body.scrollHeight)
      let boss = document.querySelector(".bili-feed4")
      let topHeight = document.querySelector(".bili-header.large-header")
      if (boss && topHeight && !document.querySelector(".isMask")) {
        let maskHeight = document.documentElement.clientHeight - topHeight.clientHeight - 25
        mask.classList.add("isMask")
        mask.style.height = maskHeight + "px"
        mask.style.lineHeight = maskHeight + "px"
        boss.appendChild(mask)
      }
    }, 1);

    findElements(".container.is-version8 >[data-report^='tianma']", () => {
      window.scrollTo(0, 0)
      let video = document.querySelector(".bili-feed4-layout")
      video && (video.style.display = "block")
      mask.style.display = "none"
      document.body.style.overflowY = "auto"
      clearInterval(time)
      console.log(new Date() - oldtime);
    })

    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (url.includes("rcmd") && options && options.method && options.method.toUpperCase() === 'GET') url = url.replace("ps=12", "ps=30");
      return originalFetch(url, options);
    };

  }
  function findElements(name, callback) {
    return new Promise((resolve, reject) => {
      function recursion(sum = 0) {
        let item = document?.querySelector(name);
        sum += 100;
        if (item) {
          callback && callback(item);
          resolve(item);
        } else if (sum <= 20000) {
          setTimeout(() => recursion(sum), 100);
        } else {
          reject(new Error(`${name} 找不到`));
        }
      }
      recursion();
    });
  }
})();