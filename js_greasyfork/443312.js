// ==UserScript==
// @name         B站自动点赞脚本
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  b站动态内容自动点赞
// @author       zhaolaishuang
// @license      MIT
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443312/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443312/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(async function () {
  let IntervalList = [];
  const zanConfig = {
    innerText: "一键点赞",
    async onclick() {
      console.clear();
      console.time("自动点赞耗时");
      await autoZan();
      console.timeEnd("自动点赞耗时");
    },
    style: {
      width: "84px",
      height: "32px",
      position: "fixed",
      top: "50%",
      left: "1%",
      color: "#fff",
      cursor: "pointer",
      "background-color": "#f25d8e",
      "border-radius": "23px",
      "text-align": "center",
      "font-size": "14px",
      "z-index": "3"
    },
  };
  const stopConfig = {
    innerText: "停",
    onclick() {
      IntervalList.forEach((i) => clearInterval(i));
      IntervalList = [];
    },
    style: {
      width: "20px",
      height: "20px",
      position: "fixed",
      bottom: "20px",
      left: "1%",
      color: "#fff",
      cursor: "pointer",
      border: "none",
      padding: "0px",
      "border-bottom": "1px solid #ccc",
      "line-height": "20px",
      "background-color": "#f25d8e",
      "text-align": "center",
      "font-size": "14px",
      "font-weight": "bold",
      "z-index": "3"
    },
  };
  const bottomConfig = {
    innerText: ">",
    onclick() {
      goToBottom();
    },
    style: {
      width: "20px",
      height: "20px",
      position: "fixed",
      bottom: "0px",
      left: "1%",
      color: "#fff",
      cursor: "pointer",
      border: "none",
      transform: "rotate(90deg)",
      padding: "0px",
      "line-height": "20px",
      "background-color": "#f25d8e",
      "border-radius": "0 50% 50% 0",
      "text-align": "center",
      "font-size": "20px",
      "font-weight": "bold",
      "z-index": "3"
    },
  };

  async function sleep(interval) {
    return new Promise((resolve) => {
      setTimeout(resolve, interval);
    });
  }

  function getAllLike() {
    return document.querySelectorAll(".bili-dyn-action.like:not(.active)");
  }

  async function autoZan() {
    const sleepTime = 10000,
      intervalTime = 200,
      totalLike = getAllLike().length;
    let needLike = getAllLike(),
      count = needLike.length;
    while (true) {
      for (let zan of needLike) {
        zan.click();
        await sleep(intervalTime);
      }
      await sleep(sleepTime);
      needLike = getAllLike();
      if (needLike.length === 0) break;
      if (needLike.length === count) {
        // 点赞速度过快
        await sleep(sleepTime);
        needLike = getAllLike();
      }
      count = needLike.length;
      consoleStr(count, totalLike);
    }
  }

  function consoleStr(unDone, totalLike) {
    let str = "",
      finish = 100 - Math.round((unDone * 100) / totalLike);
    str = str.padEnd(finish, "=");
    str = str.padEnd(100, "-");
    const log = `点赞进度：%c[${str}] ${totalLike - unDone}/${totalLike}`;
    console.log(log, "color:red");
  }

  function formatConfig(config) {
    const result = {};
    for (const proto in config) {
      const value = config[proto];
      result[proto] =
        typeof value === "object"
          ? Object.keys(value)
              .map((k) => {
                const v = value[k];
                return `${k}: ${v}`;
              })
              .join(";")
          : value;
    }
    return result;
  }

  function createButton(config) {
    const button = document.createElement("button");
    Object.assign(button, formatConfig(config));
    document.body.appendChild(button);
  }

  function goToBottom() {
    const timeout = 1000;
    const noMoreElement = ".bili-dyn-list-no-more";
    const I = setInterval(() => {
      if (document.querySelector(noMoreElement)) clearInterval(I);
      else window.scrollTo(0, document.documentElement.scrollHeight);
    }, timeout);
    IntervalList.push(I);
  }

  [zanConfig, stopConfig, bottomConfig].forEach((config) =>
    createButton(config)
  );
})();