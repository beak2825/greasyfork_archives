// ==UserScript==
// @name         番组补完计划
// @version      0.1.1
// @namespace    http://www.youkuohao.com/
// @description  bgm.tv助手
// @author       heineiuo
// @match        https://bgm.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455225/%E7%95%AA%E7%BB%84%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/455225/%E7%95%AA%E7%BB%84%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...

  function docReady(fn) {
    // see if DOM is already available
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      // call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function getSeasonUrl(options) {
    return new Promise((resolve, reject) => {
      const url = `https://www.agemys.cc/search?query=${encodeURIComponent(options.title.replace(/\s/g, '|'))}&page=1`
      console.log(url);
      GM.xmlHttpRequest({
        method: "GET",
        url,
        onerror: reject,
        onload: function (response) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            response.responseText,
            "text/html"
          );
          const blockdiff2 = doc.querySelectorAll(".blockdiff2");
          console.log({ blockdiff2 });
          if (blockdiff2.length === 0) {
            reject(new Error("没有找到资源"));
            return;
          }
          const cell = blockdiff2[0];
          const nameEl = cell.querySelector(".cell_imform_name");
          const href = nameEl.getAttribute("href");
          const detailUrl = new URL(`https://www.agemys.cc${href}`);
          console.log({ nameEl, href });
          resolve({
            detailUrl: `https://www.agemys.cc${href}`,
          });
        },
      });
    });
  }

  function getEpUrl(options) {
    const { season, ep } = options;
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: options.url,
        onerror: reject,
        onload: function (response) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            response.responseText,
            "text/html"
          );
          const list = doc.querySelector("#main0 > div:nth-child(2) > ul");
          if (!list) {
            reject(new Error("没有找到ep"));
            return;
          }
          const epEl = list.querySelectorAll("li>a")[ep - 1];
          if (!epEl) {
            reject(new Error("还是没有找到ep"));
          }
          const href = epEl.getAttribute("href");
          console.log({ epEl });
          resolve({
            epUrl: `https://www.agemys.cc${href}`,
          });
        },
      });
    });
  }

  docReady(async () => {
    const onlineWatchList = document.createElement("div");
    onlineWatchList.style.paddingTop = "2px";
    onlineWatchList.style.paddingBottom = "2px";
    const span = document.createElement("span");
    span.innerText = "播放地址: ";
    span.classList.add("tip");

    onlineWatchList.appendChild(span);



    try {
      const titleEl = document.querySelector("#headerSubject > h1 > a");
      if (!titleEl) {
        return;
      }
      const title = titleEl.innerText;

      const epEl = document.querySelector(
        `#columnEpB > div.SimpleSidePanel.png_bg > ul > li.odd.cur > a > small`
      );
      if (!epEl) {
        return;
      }

      const parentNode = document.querySelector("#columnEpA");

      parentNode.insertBefore(
        onlineWatchList,
        document.querySelector(`#columnEpA > div.clear`)
      );


      const ep = parseInt(epEl.innerText.slice(3), 10);

      console.log(`正在从agemys搜索${title}S01E${ep}...`);

      const result = await getSeasonUrl({ title });
      const { epUrl } = await getEpUrl({ url: result.detailUrl, ep });
      console.log("找到了！", epUrl);

      const link = document.createElement("a");
      link.href = epUrl;
      link.innerText = `agemys`;
      link.target = "_blank";
      link.style.color = "#02A3FB";
      onlineWatchList.appendChild(link);
    } catch (e) {
      console.error(e);
      const error = document.createElement("span");
      error.innerText = e.message;
      error.style.color = "red";
      onlineWatchList.appendChild(error);
    }
  });
})();
