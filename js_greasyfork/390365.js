// ==UserScript==
// @name         「Z-Blog」插件工具 For 视频云点播
// @namespace    https://www.wdssmq.com/
// @version      0.3
// @author       沉冰浮水
// @description  用于快捷得到`[cloudVideo:tencent:${strID}]${strTitle}[/cloudVideo]`格式的代码；
// @null     ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null     ----------------------------
// @link     https://github.com/wdssmq/userscript
// @link     https://afdian.net/@wdssmq
// @link     https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null     ----------------------------
// @match        https://console.cloud.tencent.com/vod/media*
// @match        https://vod.console.aliyun.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/390365/%E3%80%8CZ-Blog%E3%80%8D%E6%8F%92%E4%BB%B6%E5%B7%A5%E5%85%B7%20For%20%E8%A7%86%E9%A2%91%E4%BA%91%E7%82%B9%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/390365/%E3%80%8CZ-Blog%E3%80%8D%E6%8F%92%E4%BB%B6%E5%B7%A5%E5%85%B7%20For%20%E8%A7%86%E9%A2%91%E4%BA%91%E7%82%B9%E6%92%AD.meta.js
// ==/UserScript==

/* jshint esversion:6 */
(function () {
  "use strict";
  "esversion: 6";
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }
  // 直觉应该用 mouseenter，然而并不是
  $n("body").addEventListener(
    "mouseover",
    function (e) {
      // console.log(e.target);
      // console.log(e.target.nodeName);
      // console.log(e.target.className || "class为空");

      // 实际代码
      let elThis = e.target;
      if (location.host.indexOf("aliyun.com") > -1) {
        fnAliyun(elThis);
      } else {
        fnTencent(elThis);
      }
    },
    false,
  );
  // 阿里
  function fnAliyun(elThis) {
    if (elThis.nodeName !== "TD") {
      return;
    }
    if (elThis.dataset.done === "1") {
      return;
    }
    if (!elThis.querySelector(".mod-component-video-item")) {
      return;
    }
    const elInfo = elThis.querySelector(".video-info");
    let strTitle = elInfo.querySelector(".video-info-title").innerHTML.trim();
    let strID = elInfo
    .querySelector("dd:nth-of-type(2)")
    .innerHTML.replace(/ID：/, "")
    .trim();
    let strCode = `[cloudVideo:aliyun:${strID}]${strTitle}[/cloudVideo]`;
    console.log(strCode);

    // 复制按钮
    let elA = document.createElement("a");
    elA.style.paddingLeft = "1em";
    elA.href = "javascript:;";
    elA.innerHTML = "「cvp-复制代码」";
    elA.addEventListener("click", function (e) {
      elA.innerHTML = "「cvp-复制成功」";
      GM_setClipboard(strCode);
    });
    elThis.querySelector(".video-info-title").appendChild(elA);
    elThis.dataset.done = "1";
  }
  // 腾讯
  function fnTencent(elThis) {
    if (elThis.nodeName !== "TD") {
      return;
    }
    if (elThis.dataset.done === "1") {
      return;
    }
    if (!elThis.querySelector(".app-vod-media")) {
      return;
    }
    let strTitle = elThis.querySelector(".media-name").innerHTML.trim();
    let strID = elThis
      .querySelector(".app-vod-media__body p")
      .innerHTML.replace(/ID:/, "")
      .trim();
    let strCode = `[cloudVideo:tencent:${strID}]${strTitle}[/cloudVideo]`;
    console.log(strCode);

    // 复制按钮
    let elA = document.createElement("a");
    // elA.style.paddingLeft = "1em";
    elA.href = "javascript:;";
    elA.innerHTML = "「cvp-复制代码」";
    elA.setAttribute("class", "text-vm");
    elA.addEventListener("click", function (e) {
      elA.innerHTML = "「cvp-复制成功」";
      GM_setClipboard(strCode);
    });
    elThis.querySelector(".app-vod-media__body").appendChild(elA);
    elThis.dataset.done = "1";
  }
})();
