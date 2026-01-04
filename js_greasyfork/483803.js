// ==UserScript==
// @name         石之家自动签到
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动完成石之家迎新庆典每日活动
// @author       mephisto
// @match        https://ff14risingstones.web.sdo.com/*
// @icon         https://ff14risingstones.web.sdo.com/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483803/%E7%9F%B3%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/483803/%E7%9F%B3%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  var currentHref = location.href;
  console.log("currentHref==>", currentHref);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const corsFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      mode: "cors",
      credentials: "include",
    }).then((res) => res.json());

  /** 签到 */
  const signin = () =>
    corsFetch("https://apiff14risingstones.web.sdo.com/api/home/sign/signIn", {
      method: "POST",
    }).then((res) => {
      console.log(res.msg);
    });

  await wait(1000);
  const qiandao = document.querySelector(".signin");
  const checkText = qiandao.innerText;
  console.log("checkText==>", checkText);
  if (checkText != null && checkText !== "已签到") {
    await signin();
  }
})();