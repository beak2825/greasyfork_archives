// ==UserScript==
// @name            Vistopia_Monkey
// @name:cn         理想猴
// @namespace       http://tampermonkey.net/
// @description     This userscript does wonderful things
// @description:cn  看理想网页界面自定义
// @author          Sherlock-V
// @match           https://www.vistopia.com.cn
// @match           https://www.vistopia.com.cn/*
// @grant           GM_addStyle
// @run-at          document-body
// @homepageURL     https://github.com/Ziyueqi-V/Vistopia_Monkey
// @supportURL      https://github.com/Ziyueqi-V/Vistopia_Monkey
// @license         MIT
// @version      0.0.9
// @downloadURL https://update.greasyfork.org/scripts/468138/Vistopia_Monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/468138/Vistopia_Monkey.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // Your code here...
  const cssText = `
  .page-home,
.page-home .home-content,
.page-article,
.page-detail .detail-content .tabs_wrap,
.page-detail .detail-content .tabs_wrap .el-tabs .el-tabs__header,
.page-detail {
  background: #1f1f1f !important;
}

.comment-list .item-wrap .articleTitle,
.audioList .part-area ul .li_item {
  background: #141414 !important;
}

#web-header {
  background: #1f1f1f !important;
}

.comment_children .child .name {
  color: rgba(255, 255, 255, 0.85) !important;
}

.page-article .article-content .article {
  color: rgba(255, 255, 255, 0.65) !important;
}

.comment_children .child .replied {
  color: rgba(255, 255, 255, 0.45) !important;
}

.page-article .article-content .article.article a {
  color: #f0dd71 !important;
}
  `;
  GM_addStyle(cssText);

  const style = document.createElement('style')
  const hides = [].filter(Boolean)

  style.innerHTML = [
    `${hides.join(',')}{ display: none !important; }`,
  ].join('')

  document.body.appendChild(style)
})();