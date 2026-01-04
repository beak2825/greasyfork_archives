// ==UserScript==
// @name         掘金小册暗黑主题 (coderQ)
// @namespace    http://tampermonkey.net/
// @description  自己用的油猴脚本，如果也感兴趣这个暗黑主题
// @author       PlayGuitar_Coder_Q
// @match        https://juejin.cn/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @grant        none
// @grant        GM_addStyle
// @version      2.0.1
// @downloadURL https://update.greasyfork.org/scripts/451378/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98%20%28coderQ%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451378/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98%20%28coderQ%29.meta.js
// ==/UserScript==

(function () {

  const THEME_COLOR = {
    font: '#fff !important',
    main: '#007FFF !important',
    dark: '#121212 !important',
    tagDone: 'rgba(5,109,232,.1) !important',
    tagFont: '#056dse8 !important',
    tagUnfinished: '#558eff !important',
    border: '#2e2e2e !important'
  }

  const CSS_KEY = {
    bg: 'background',
    co: 'color',
    fi: 'fill',
    bo: 'border'
  }

  // css 侵入
  let css = `
    .book-summary__header {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark};
      ${CSS_KEY.bo}: 1px solid ${THEME_COLOR.dark};
    }
    .book-summary__header a path {
      ${CSS_KEY.fi}: ${THEME_COLOR.main};
    }

    .book-content__header {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark};
      ${CSS_KEY.bo}: 1px solid ${THEME_COLOR.dark};
    }
    .book-content__header .title a {
      ${CSS_KEY.co}: ${THEME_COLOR.font}
    }
    .book-body {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark}
    }
    .section-page {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark};
    }
    .markdown-body {
      ${CSS_KEY.co}: ${THEME_COLOR.font}
    }

    .book-directory-comp {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark}
    }
    .book-directory-comp .section-list .route-active .center .title .title-text {
      ${CSS_KEY.co}: ${THEME_COLOR.main}
    }
    .book-directory-comp .section-list .section .title{
      ${CSS_KEY.co}: ${THEME_COLOR.font}
    }
    .book-directory-comp .section-list .section .center .sub-line .label {
      ${CSS_KEY.bg}: ${THEME_COLOR.tagDone};
      ${CSS_KEY.co}: ${THEME_COLOR.tagFont};
    }

    .book-summary {
      border-right: 1px solid ${THEME_COLOR.border};
    }
    .book-summary__footer {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark}
    }
    .book-summary__footer .qr-icon path {
      ${CSS_KEY.fi}: ${THEME_COLOR.main}
    }

    .logo path {
      fill: ${THEME_COLOR.main} !important;
    }

    .qr-icon path {
      fill: ${THEME_COLOR.main} !important;
    }

    .auth-card .input-box {
      ${CSS_KEY.bo}: 1px solid ${THEME_COLOR.border};
    }
    .auth-card .input-box .rich-input {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark};
      ${CSS_KEY.co}: ${THEME_COLOR.font};
    }
   .book-comments .form-box .action-box .submit .submit-btn {
      ${CSS_KEY.bg}: ${THEME_COLOR.main};
      ${CSS_KEY.co}: ${THEME_COLOR.font};
    }
    .book-comments .container .comment-list-wrapper .title {
      ${CSS_KEY.co}: ${THEME_COLOR.font};
    }
    .content-box .subcomment-wrapper .sub-comment-list {
      ${CSS_KEY.bg}: ${THEME_COLOR.dark};
    }
    .content-box .subcomment-wrapper .sub-comment-list .username .name {
      ${CSS_KEY.co}: ${THEME_COLOR.font};
    }
    .content-box .comment-main .user-box .popover-box .username .name {
      ${CSS_KEY.co}: ${THEME_COLOR.font};
    }
    .sub-comment-list .subcomment .content-box .content-wrapper .content {
      ${CSS_KEY.co}: ${THEME_COLOR.font};
    }

    .content-box .comment-main .content {
      ${CSS_KEY.co}: ${THEME_COLOR.font};
    }
  `;

  if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(css);
  } else {
    let styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(css));
    (document.querySelector("head") || document.documentElement).appendChild(
      styleNode
    );
  }
})();

