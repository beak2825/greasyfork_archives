// ==UserScript==
// @name Material-CC98
// @namespace github.com/CoolSpring8/userscript
// @version 0.1.2
// @description Material Design风格的样式微调，借鉴了Material UI组件库
// @author CoolSpring
// @supportURL https://github.com/CoolSpring8/userscript/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.cc98.org/*
// @downloadURL https://update.greasyfork.org/scripts/420879/Material-CC98.user.js
// @updateURL https://update.greasyfork.org/scripts/420879/Material-CC98.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "www.cc98.org" || location.hostname.endsWith(".www.cc98.org"))) {
  css += `
    #root {
      --color-main: rgb(98, 150, 211);
      --color-main-transparent: rgba(235, 249, 251, 0.8);
      --color-divider: rgba(0, 0, 0, 0.12);
      --box-shadow-card: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
        0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
      --box-shadow-card-light: 0px 1px 0.5px -0.5px rgba(0, 0, 0, 0.2),
        0px 0.5px 0.5px 0px rgba(0, 0, 0, 0.14),
        0px 0.5px 1.5px 0px rgba(0, 0, 0, 0.12);
      --box-shadow-floating-action-button-light: 0px 1.5px 2.5px -0.5px rgba(0, 0, 0, 0.2),
        0px 3px 5px 0px rgba(0, 0, 0, 0.14), 0px 0.5px 9px 0px rgba(0, 0, 0, 0.12);
    }

    #root {
      font-size: 15px;
    }

    button,
    .button {
      cursor: pointer;
      border-radius: 4px;
    }

    button:hover,
    .button:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .ubb-editor,
    .react-mde {
      border: none;
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }

    .react-mde > .grip {
      border-top: none;
    }

    /* 参考自https://vercel.com/blog */
    .topBar {
      position: fixed;
      top: 0;
      background-color: var(--color-main-transparent);
      backdrop-filter: saturate(180%) blur(5px);
    }

    .topBarMessageDetails > ul,
    .topBarUserCenter > ul {
      border-radius: 0 0 4px 4px;
      box-shadow: var(--box-shadow-card);
    }

    .page-link {
      margin: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 42px;
      box-sizing: border-box;
      transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .page-item:not(:last-child) > .page-link {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .page-item:not(:first-child) > .page-link {
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .topBarLogo,
    .topBarCC98,
    .topBarText,
    .topBarUserName {
      filter: invert(1);
    }

    .topBarUserImg {
      display: none;
    }

    .topBarUserName {
      font-size: 0;
    }

    .topBarUserName::after {
      font-size: 1rem;
      content: "My CC98";
    }

    .topBarUserCenter {
      margin-left: 3rem;
    }

    .topBarBell {
      color: #000;
      background-color: #fff;
    }
  `;
}
if (location.href === "https://www.cc98.org/") {
  css += `
    .topBar-mainPage {
      position: fixed;
      top: 0;
      background-color: var(--color-main-transparent);
      backdrop-filter: saturate(180%) blur(5px);
    }

    .announcementContent,
    .recommendedReadingContent,
    .mainPageListContent1,
    .mainPageListContent2 {
      border-width: 8px 0 0 0;
    }

    .announcementContent,
    .recommendedReadingContent,
    .mainPageListContent1,
    .mainPageListContent2,
    .recommendedFunctionContent,
    .schoolNewsContent,
    .mainPageCountContent,
    .ubb-editor,
    .user-center-navigation,
    .user-center-router {
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }

    /* 粗略对齐“推荐阅读”与“推荐功能”底部高度 */
    .recommendedFunctionContent {
      height: 20.5rem;
    }

    /* 对齐“学习园地”与“论坛统计”底部高度 */
    .mainPageCountContent {
      height: 11.25rem;
    }

    /* 左对齐标题与卡片 */
    .mainPageTitle1,
    .mainPageTitle2 {
      padding-left: 0;
    }

    .topBarMessageDetails-mainPage > ul,
    .topBarUserCenter-mainPage > ul {
      border-radius: 0 0 4px 4px;
      box-shadow: var(--box-shadow-card);
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/newTopics") || location.href.startsWith("https://www.cc98.org/focus") || location.href.startsWith("https://www.cc98.org/search")) {
  css += `
    .focus-topic .focus-topic-left .focus-topic-userName {
      font-size: 15px;
    }

    .focus-topic-topicArea {
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }

    .focus-topic {
      margin-top: 0;
      border-top: var(--color-divider) solid 1px;
      border-bottom: none;
      border-left: none;
      border-right: none;
    }

    .focus-topic:first-child {
      border-radius: 4px 4px 0 0;
    }

    /* 重置“回到顶部”按钮大小 */
    #scrollToTop {
      width: unset;
      height: unset;
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/topic/")) {
  css += `
    .topicInfo-info {
      border: none;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: var(--box-shadow-card);
    }

    .topicInfo-title {
      border-radius: 4px;
    }

    /* 让广告占满卡片右边小半部分 */
    .topicInfo-ads img {
      width: 19rem !important;
      height: 6.5rem !important;
      border-radius: 0 4px 4px 0;
    }

    .page-goto > div > a {
      border-radius: 4px;
    }
    .page-goto > div > a:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    /* 对齐分页与面包屑导航的高度 */
    ul.page-nav,
    .page-goto {
      margin-bottom: 1em;
    }

    .followTopic,
    .operation1,
    .replierBtn {
      border-radius: 4px;
    }

    .followTopic:hover,
    .operation1:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    /* 为了避免页面内容覆盖顶端栏的一个dirty hack。然而没有解决.ubb-image-toolbox的问题 */
    .userMessage-right div[style="z-index: 100;"],
    .photoFrame > img {
      z-index: auto !important;
    }
    .userGender {
      z-index: auto;
    }

    .userMessage {
      border-radius: 4px 0 0 4px;
    }

    .userMessage-userName,
    .userMessage-left > div:not(.column) > div:first-child {
      font-weight: normal !important;
    }

    .reply {
      margin-top: 12px;
      border: none;
      border-radius: 4px;
      box-shadow: var(--box-shadow-card-light);
    }

    .reply .reply-floor,
    .reply .reply-floor-lz {
      box-shadow: var(--box-shadow-floating-action-button-light);
    }

    img[src^="/static/images/ac/"],
    img[src^="/static/images/ms/"],
    img[src^="/static/images/em/"],
    img[src^="/static/images/CC98/"] {
      width: 3rem;
      height: auto;
      margin-bottom: 1rem;
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/boardList")) {
  css += `
    .anArea > .column {
      border: none !important;
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }

    .boardListHead {
      border-radius: 4px 4px 0 0;
    }

    .expendBoardList {
      border-radius: 4px;
    }

    .expendBoardList:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/board/")) {
  css += `
    .board-list-body {
      border: none;
    }

    .board-list-body,
    .ant-collapse-item {
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }

    .ant-pagination-item {
      margin: 0;
      min-width: 48px;
      box-sizing: border-box;
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/usercenter") || location.href.startsWith("https://www.cc98.org/user/")) {
  css += `
    .user-center-navigation,
    .user-center-router {
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }

    .user-center-body .user-center-navigation,
    .user-center-body .user-center-router {
      border: none;
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/message/")) {
  css += `
    .message-nav,
    .message-response,
    .message-system,
    .message-message,
    .message-setting {
      border: none;
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }

    .message-message-pList {
      border-radius: 4px 0 0 4px;
    }

    .message-message-window {
      border-radius: 0 4px 4px 0;
    }

    .message-message-people {
      border-top: none;
      border-bottom: none;
      border-left: none;
    }

    .message-message-window .message-message-wContent {
      border-right: none;
    }

    .message-message-window .message-message-wHeader,
    .message-message-window .message-message-wPost {
      border: none;
    }

    .message-message-people .message-message-pTitle {
      border-radius: 4px 0 0 0;
    }

    .message-message-wReport {
      border-radius: 0 4px 0 0;
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/signin")) {
  css += `
    .sign-in {
      border-radius: 4px;
      box-shadow: var(--box-shadow-card);
    }
    .ubb-editor {
      border: 1px solid #ccc;
    }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
