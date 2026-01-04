// ==UserScript==
// @name         清爽知乎
// @namespace    https://huanfei.top/
// @version      2.0.2
// @author       huanfei
// @description  将网页主体部分变宽，去除杂冗部分，并添加一些实用的功能
// @license      MIT
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @match        *://*.zhihu.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/443919/%E6%B8%85%E7%88%BD%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/443919/%E6%B8%85%E7%88%BD%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const t=document.createElement("style");t.textContent=n,document.head.append(t)})(' @charset "UTF-8";.RichText{font-size:var(--font-size)}html[data-privacy=true] .QuestionHeader-title{opacity:0}html[data-privacy=true] [aria-label=\u77E5\u4E4E]{visibility:hidden}ul.AppHeader-Tabs li:has(a[href*=zhida]){display:none}.Topstory-mainColumn{width:inherit}.Topstory-mainColumn .Pc-Business-Card-PcTopFeedBanner,.Topstory-mainColumn .Pc-feedAd-new,.Topstory-mainColumn .WriteArea,.Topstory-mainColumn+div{display:none}.Question-main .Question-mainColumn,.Question-main .ListShortcut{width:inherit}.Question-main .Question-mainColumn+div,.Question-main .ListShortcut+div{display:none}.Question-main .AuthorInfo.AnswerItem-authorInfo .FollowButton,.Question-main .Pc-word-new{display:none}.Question-main .RichContent--unescapable.is-collapsed .RichContent-inner{min-height:125px}.QuestionHeader .QuestionHeader-content{width:var(--app-width)}.QuestionHeader .QuestionHeader-content .QuestionHeader-main{width:inherit}.QuestionHeader .QuestionHeader-content .QuestionHeader-side{transform:translate(-100%)}.QuestionHeader .QuestionHeader-content .QuestionHeader-side *{font-size:14px}.QuestionHeader .QuestionHeader-content .QuestionHeader-side div.NumberBoard-item .NumberBoard-itemInner{padding-left:20px}.Profile-main .Profile-mainColumn{width:inherit}.Profile-main .Profile-mainColumn+div,.Profile-main .Profile-mainColumn .AuthorInfo-Widget{display:none}.CollectionsDetailPage .CollectionsDetailPage-mainColumn{width:inherit}.CollectionsDetailPage .CollectionsDetailPage-mainColumn+div{min-width:20%}.QuestionWaiting .QuestionWaiting-mainColumn{width:inherit}.QuestionWaiting .QuestionWaiting-mainColumn+div{display:none}.Search-container .SearchMain{width:inherit}.Search-container .SearchMain+div{display:none}.Notifications-Layout .Notifications-Main{width:inherit}.Notifications-Layout .Notifications-Main+div{display:none}.Post-Row-Content-left{width:inherit!important}.Post-Row-Content-left .Post-Author{justify-content:space-between}.Post-Row-Content-right{display:none!important}.CornerAnimayedFlex{height:130px}.CornerAnimayedFlex>button:nth-child(2){margin-top:10px;transform:rotate(90deg)}html[data-theme=dark] body{color:#cecece}html[data-theme=dark] body h2.ContentItem-title{color:#cbcbcb}span:has(>.RichContent-EntityWord) a{cursor:auto;color:inherit}span:has(>.RichContent-EntityWord) a:active{background:none}span:has(>.RichContent-EntityWord) svg{display:none} ');

(function () {
  'use strict';

  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  window.onload = () => {
    var _a, _b;
    const button = (_a = document.querySelector("button.CornerButton")) == null ? void 0 : _a.cloneNode(true);
    if (!button) return;
    button.setAttribute("aria-label", "全部折叠");
    button.setAttribute("data-tooltip", "全部折叠");
    button.addEventListener("click", () => {
      var _a2;
      const topElement = (_a2 = [...document.querySelectorAll(".Topstory-recommend .Card.TopstoryItem")].reverse().find((el) => el.getBoundingClientRect().y < 0)) == null ? void 0 : _a2.nextElementSibling;
      const cards = document.querySelectorAll(".RichContent:not(.is-collapsed) .ContentItem-action:has(.RichContent-collapsedText)");
      const comments = document.querySelectorAll(".Card.TopstoryItem:has(.Comments-container) button.ContentItem-action:has(.Zi--Comment)");
      const toFoldItems = [...comments, ...cards];
      if (toFoldItems.length > 0) {
        toFoldItems.forEach((el) => el.click());
        requestAnimationFrame(() => topElement == null ? void 0 : topElement.scrollIntoView());
      }
    });
    (_b = document.querySelector(".CornerAnimayedFlex")) == null ? void 0 : _b.append(button);
  };
  window.addEventListener("copy", (e) => e.stopPropagation(), true);
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target.closest("a.external")) {
      e.preventDefault();
      const raw = new URL(e.target.href).searchParams.get("target");
      raw && window.open(raw, "_blank");
    }
    if (e.target.closest(".RichContent-EntityWord")) {
      e.preventDefault();
    }
  });
  _GM_registerMenuCommand("深浅主题切换（将刷新页面）", () => {
    const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    const url = new URL(location.href);
    const params = new URLSearchParams(url.search);
    params.set("theme", theme);
    url.search = params.toLocaleString();
    location.href = url.href;
  });
  const savedFontSize = localStorage.getItem("custom-font-size");
  if (savedFontSize) {
    document.documentElement.style.setProperty("--font-size", `${savedFontSize}px`);
  }
  _GM_registerMenuCommand("修改字体大小", () => {
    const currentFontSize = localStorage.getItem("custom-font-size") || "15";
    const fontSize = prompt("请输入字体大小（默认15px）", currentFontSize);
    if (fontSize) {
      const root = document.documentElement;
      root.style.setProperty("--font-size", `${fontSize}px`);
      localStorage.setItem("custom-font-size", fontSize);
    }
  });
  _GM_registerMenuCommand("隐私模式", () => {
    if (document.documentElement.dataset.privacy === "true") {
      document.documentElement.dataset.privacy = "false";
    } else {
      document.documentElement.dataset.privacy = "true";
    }
  });

})();