// ==UserScript==
// @name         教学立方作业助手
// @namespace    Flying-Tom/PedagogySquare-Helper
// @version      0.0.1
// @author       Flying-Tom
// @description  提供教学立方作业批改辅助功能
// @license      MIT
// @icon         https://s21.ax1x.com/2024/04/14/pFvFMHx.png
// @match        https://teaching.applysquare.com/Client/WeiXin/*
// @match        https://teaching.applysquare.com/T/Course/index/cid/*
// @grant        GM_info
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/492479/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492479/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  function teach_applysquare_handler() {
    const prefix = "https://teaching.applysquare.com/S/Course/index/cid";
    if (window.location.href.includes("announcement")) {
      window.stop();
      const matches = window.location.href.match(/___detail___(\d+)___(\d+)/);
      if (matches) {
        const url = `${prefix}/${matches[1]}#S-Announcement-view-id-${matches[2]}`;
        window.location.href = url;
      }
    } else if (window.location.href.includes("work")) {
      window.stop();
      const matches = window.location.href.match(/___detail___(\d+)___(\d+)/);
      if (matches) {
        const url = `${prefix}/${matches[2]}#S-Work-answer-id-${matches[1]}`;
        window.location.href = url;
      }
    }
  }
  function teach_applysquare_homework_handler() {
    if (window.location.href.includes("treviewinfo")) {
      waitForElm(".caozuo").then((data) => {
        const divElement = data;
        const review_elem = divElement.querySelector("a");
        if (review_elem && review_elem.innerText == "评阅" && review_elem.checkVisibility() == true) {
          review_elem.click();
          waitForElm(".playback-box1").then(() => {
            window.close();
          });
        }
      });
    } else {
      waitForElm("#tab-1").then((data) => {
        const placeholderText = "请输入学号或者姓名";
        const divElement = data;
        const clickedElementsMap = /* @__PURE__ */ new Map();
        setInterval(() => {
          const table_elem = divElement.querySelector("table");
          if (table_elem) {
            const trElements = table_elem.querySelectorAll("tr.tr-disabled");
            if (trElements.length === 1) {
              const tdElements = trElements[0].querySelectorAll("td");
              const lastTdElement = tdElements[tdElements.length - 1];
              lastTdElement.querySelectorAll("a").forEach((aElement) => {
                const studentid = tdElements[1].innerText;
                if (!aElement.innerText.includes("评阅") || clickedElementsMap.has(studentid)) {
                  return;
                }
                aElement.click();
                const search_elem = divElement.querySelector(`input[placeholder="${placeholderText}"]`);
                search_elem.value = "";
                clickedElementsMap.set(studentid, true);
              });
            }
          }
        }, 500);
      });
    }
  }
  (function() {
    (function() {
      let match_idx = _GM_info.script.matches.map((rule) => rule.replace(/\.|\*|\/|\?/g, (match) => ({ ".": "\\.", "*": ".*", "/": "\\/", "?": "\\?" })[match] || "")).map((rule) => new RegExp(rule)).map((regExp, index) => regExp.test(window.location.href) ? index : null).filter((index) => index != null).join().toString();
      const strategy_load = {};
      const strategy_instant = {
        "0": teach_applysquare_handler,
        // 教学立方 PC 微信跳转
        "1": teach_applysquare_homework_handler
        // 教学立方作业评阅
      };
      if (match_idx in strategy_instant) {
        let strategy_instant_func = strategy_instant[match_idx];
        strategy_instant_func();
      } else if (match_idx in strategy_load) {
        let strategy_load_func = strategy_load[match_idx];
        if (document.readyState == "complete") {
          strategy_load_func();
        } else {
          window.addEventListener("load", strategy_load_func);
        }
      }
    })();
  })();

})();