// ==UserScript==
// @name         take it
// @namespace    http://tampermonkey.net/
// @version      2024-02.0.2
// @description  try
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496342/take%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/496342/take%20it.meta.js
// ==/UserScript==

const source = window.localStorage.getItem("source");

const clickEvent = new MouseEvent("click", {
  view: window,
  bubbles: true,
  cancelable: false,
});

const createModal = () => {
  const modalNode = document.createElement("div");
  modalNode.style.position = "absolute";
  modalNode.style.left = 0;
  modalNode.style.top = 0;
  modalNode.style.right = 0;
  modalNode.style.bottom = 0;
  modalNode.style.zIndex = 9999;
  document.body.appendChild(modalNode);
};

const fn = function () {
  // 创建模态层，禁止真实鼠标点击
  createModal();

  setTimeout(() => {
    const bodyNode = document.querySelector(".g-table-tbody")?.childNodes?.[0];
    if (!bodyNode) {
      return window.location.reload();
    }
    // 获取时间
    const lastTime = bodyNode.childNodes[1].firstChild.firstChild.innerText;
    if (lastTime.includes("min") && parseInt(lastTime) > 2) {
      return window.location.reload();
    }
    // 获取名称，买完缓存
    const nameNode =
      bodyNode.firstChild.firstChild.lastChild.lastChild.firstChild.lastChild.firstChild.innerText.slice(
        0,
        5
      );
    console.log("nameNode====>", nameNode);
    if (!nameNode) return window.location.reload();
    // 处理缓存
    if (source) {
      const temp = source.split(",");
      if (temp.includes(nameNode)) return window.location.reload();
    } else {
      window.localStorage.setItem("source", "");
    }
    // 获取安全检测节点
    const needListNode =
      bodyNode.childNodes[bodyNode.childNodes.length - 2].firstChild.firstChild;
    // mint权限丢弃
    const firstParam = needListNode.childNodes[0].firstChild.innerText;
    // 是否top10持仓
    const secondParam = needListNode.childNodes[1].firstChild.innerText;
    // 是否黑名单
    const thirdParam = needListNode.childNodes[2].firstChild.innerText;
    // 第一层校验
    console.log("第一层校验=====》", firstParam, secondParam, thirdParam);
    if (firstParam === "是" && secondParam === "是" && thirdParam === "否") {
      bodyNode.dispatchEvent(clickEvent);
    } else return window.location.reload();
  }, 3000);
};

const second = () => {
  createModal();
  setTimeout(() => {
    // top10占比
    const topParam =
      document.querySelector(".css-ro10ha").childNodes[1].lastChild.innerText;
    // 跑路概率
    const dangerText =
      document.querySelector(".css-1qizzmy")?.firstChild?.innerText;
    // 如果是貔貅，就会出现
    const piXiuNode = document.querySelector(".css-1xp1kc6");
    // 老鼠仓
    const mouseParam = document.querySelector(".css-r2hvuq")?.innerText;
    // 网站数量
    const siteNumber = document.querySelector(".css-n6fhzv").childNodes.length;
    if (mouseParam && parseInt(mouseParam) > 40) {
      return window.history.back();
    }
    if (
      parseInt(topParam) > 40 ||
      !dangerText?.includes("未知") ||
      piXiuNode ||
      siteNumber < 3
    ) {
      return window.history.back();
    }
    // 点击价格
    const priceBtn = document.querySelector(".css-t6otnl").firstChild;
    priceBtn.dispatchEvent(clickEvent);
    // 设置优先费
    const setPriceBtn =
      document.querySelector(".css-20js0w").lastChild.lastChild;
    setPriceBtn.click();

    setTimeout(() => {
      const confiromBtn = document.querySelector(".css-ygdiie");
      const finalBuyBtn = document.querySelector(".css-1pcwga9");
      // 获取下优先费焦点
      const focusInput = document.querySelector(".css-uq0uks");
      focusInput.click();

      setTimeout(() => {
        // 点击设置确认按钮
        confiromBtn.dispatchEvent(clickEvent);

        // 点击买入按钮
        setTimeout(() => {
          finalBuyBtn.dispatchEvent(clickEvent);
          // 缓存处理然后刷新页面开始下一循环
          setTimeout(() => {
            let temp = source.split(",");
            const tempName = document
              .querySelector(".css-1r86r03")
              .innerText.slice(0, 5);
            temp[0] ? temp.push(tempName) : (temp[0] = tempName);
            window.localStorage.setItem("source", temp.join(","));
            return window.history.back();
          }, 5000);
        }, 500);
      }, 500);
    }, 500);
  }, 3000);
};

window.location.href.includes("token") ? second() : fn();






































