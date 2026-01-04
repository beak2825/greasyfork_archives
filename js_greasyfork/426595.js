// ==UserScript==
// @name                steam消费总额查看
// @name:en             steam total spending
// @namespace           http://tampermonkey.net/
// @version             1.3.1
// @description         一键查看steam消费总额
// @description:en      Used to view the total spending of steam consumption
// @author              liuyubing
// @match               *://steamcommunity.com/*
// @match               *://store.steampowered.com/*
// @match               *://help.steampowered.com/*
// @downloadURL https://update.greasyfork.org/scripts/426595/steam%E6%B6%88%E8%B4%B9%E6%80%BB%E9%A2%9D%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426595/steam%E6%B6%88%E8%B4%B9%E6%80%BB%E9%A2%9D%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

/** 获取元素 */
const dom = (n) => document.querySelector(n);
/** 使用 Id 获取元素 */
const domById = (id) => document.getElementById(id);
/** 获取所有元素 */
const domA = (n) => document.querySelectorAll(n);
/** 创建元素 */
const domC = (name, attrObjs) => {
  const element = document.createElement(name);
  Object.keys(attrObjs).forEach((key) => {
    element[key] = attrObjs[key];
  });
  return element;
};

(function () {
  "use strict";

  const ob = {
    hrefText: {
      "zh-CN": "消费记录",
      default: "Expenses record",
    },
    spending: {
      "zh-CN": "查看消费总额",
      default: "View total spending",
    },
    total: {
      "zh-CN": "总计消费：",
      default: "Total spending:",
    },
    buy: {
      "zh-CN": "购买：",
      default: "Buy:",
    },
    refund: {
      "zh-CN": "退款：",
      default: "Refund:",
    },
    choose: function (name) {
      const language = navigator.language || navigator.userLanguage;
      return this[name][language] || this[name]["default"];
    },
  };

  const globalActions = domById("global_actions");
  const globalActionMenu = domById("global_action_menu");
  if (globalActions) {
    const toAccountHistory = domC("a", {
      href: "https://store.steampowered.com/account/history/",
      target: "_self",
      style: "vertical-align: top;margin-right: 12px;",
      innerText: ob.choose("hrefText"),
    });
    globalActions.insertBefore(toAccountHistory, globalActionMenu);
  }

  if (/\/account\/history/.test(location.pathname)) {
    const accountManagement = dom(".account_management .page_content");
    if (accountManagement) {
      const totalSpending = domC("a", {
        href: "javascript:;",
        innerText: ob.choose("spending"),
      });
      totalSpending.onclick = onTotalSpending;
      accountManagement.appendChild(totalSpending);
    }
  }

  function onTotalSpending() {
    const haveLoadMore = domById("load_more_button");
    this.innerText = "loading...";
    if (haveLoadMore && haveLoadMore.style.display !== "none") {
      haveLoadMore.click();
      setTimeout(() => {
        onTotalSpending.call(this);
      }, 500);
      return;
    }
    this.innerText = ob.choose("spending");
    const { all, less, add } = addSpending();
    window.alert(`${ob.choose("total")}${all}\n${ob.choose("buy")}${add}\n${ob.choose("refund")}${less}`);
  }

  function addSpending() {
    let numAll = 0;
    let lessSpend = 0;
    let addSpend = 0;
    const nodesTotal = domA("tbody .wht_total");
    const dot = nodesTotal[0].innerText.replace(/(?<=\W)[\w\W]+/, "").trim();
    nodesTotal.forEach((item) => {
      let doll = +item.innerText.match(/[\d\.]+/)[0];
      if (!doll) return;
      if (item.className.indexOf("wht_refunded") >= 0) {
        numAll -= doll;
        lessSpend += doll;
      } else {
        numAll += doll;
        addSpend += doll;
      }
    });
    return {
      all: dot + floorMath(numAll),
      less: dot + floorMath(lessSpend),
      add: dot + floorMath(addSpend),
    };
  }

  function floorMath(num) {
    return Math.floor(num * 100) / 100;
  }
})();
