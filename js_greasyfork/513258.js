// ==UserScript==
// @name         狐蒂云
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  双11，抢香港-111元的云主机！
// @author       You
// @match        https://www.szhdy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szhdy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513258/%E7%8B%90%E8%92%82%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/513258/%E7%8B%90%E8%92%82%E4%BA%91.meta.js
// ==/UserScript==

const doIt = () => {
  if (location.href.indexOf("activities/default.html?method=activity") > -1) {
    // 获取香港云主机card
    const xgService = document.querySelector("[data-id='191']");
    // 获取提交按钮
    const submit = xgService.querySelector(".form-footer-butt");
    // 获取提交按钮是否 包含商品已售罄
    const isMonKey = submit.hasAttribute("onclick");
    // 如果没有，就一直刷新页面，反正耗费网站流量无所畏
    if (isMonKey) {
      location.reload();
      return false;
    }
    // 否则进入购物车页面
    submit.click();
  }

  if (location.href.indexOf("action=configureproduct") > -1) {
    // 点击 加入购物车按钮, 并跳转到支付页面
    const handle = (addShopCar) => {
      if (addShopCar) {
        addShopCar.click();
      } else {
        setTimeout(() => {
          handle(document.querySelector(".btn-buyNow"));
        }, 500);
      }
    };
    const addShopCar = document.querySelector(".btn-buyNow");
    handle(addShopCar);
  }

  if (location.href.indexOf("action=viewcart") > -1) {
    // 进入支付页面之后，点击确认支付
    const nextStep = document.querySelector(".nextStep");
    nextStep.click();

    // 此时会进入结账状态：立刻勾选同意 服务条款
    const paymentCheckbox = document.querySelector(".payment-checkbox");
    const imsure = document.querySelector(".sky-viewcart-terms-checkbox");
    paymentCheckbox.checked = true;
    imsure.checked = true;

    // 最后点击立即结账
    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.click();
  }
};

// 等待网页完成加载
window.addEventListener("load", doIt, false);
