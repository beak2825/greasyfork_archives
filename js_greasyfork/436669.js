// ==UserScript==
// @name         Clean Gitee
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Gitee a bit cleaner
// @author       You
// @match        https://gitee.com/
// @icon         https://www.google.com/s2/favicons?domain=gitee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436669/Clean%20Gitee.user.js
// @updateURL https://update.greasyfork.org/scripts/436669/Clean%20Gitee.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

(function () {
  'use strict';
  var css = `
  @import url(https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap);

  @import url(https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap);

  div.button.toolbar-help {
    display: none;
  }

  div.ui.two.column.grid.d-flex-centeris-en {
    display: none;
  }

  div.name-important {
    display: none;
  }

  a.udesk-client-btn {
    display: none;

  }

  a.charge-tip.d-flex.flex-center.ml-4 {
    display: none;
  }

  div.nav-item.udesk-wrap.cursor-pointer {
    display: none;
  }

  span.ui.red.label.new-label {
    display: none;
  }

  div.ui.two.column.grid.d-flex-center {
    display: none;
  }

  sup.ui.red.label {
    display: none;
  }

  i.iconfont.icon-logo_huawei {
    display: none;
  }

  span.app-name {
    display: none;
  }

  div.ui.yellow.message.recommend-notice.mt-0 {
    display: none;
  }

  div.four.wide.column.recommend-container {
    display: none;

  }

  div.explore-header {
    padding-top: 30px;
  }

  a span img {
    display: none;

  }

  i.iconfont.icon-recommended.js-popup-default {
    display: none;
  }

  div.explore-search__hot {
    display: none;
  }

  div.explore-search__container {
    padding-left: 275px;
  }

  div div pre {
    font-family: JetBrains Mono;
    font-size: 14px;
    line-height: 21px;

  }

  div p code {
    font-family: JetBrains Mono;
    font-size: 14px;
    line-height: 21px;
  }

  div.line {
    font-family: JetBrains Mono;
    font-size: 16px;
  }

  div.view-line {
      font-family: JetBrains Mono;
    font-size: 16px;
  }

  a.ui.small.label.git-project-gvp-badge.gvp-label.js-popup-default {
    display: none;

  }

  a.project-language.project-item-bottom__item {
    color: #039be5;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
  }

  i.iconfont.icon-tag-program {
    display: none;
  }

  div.ui.warning.message {
    display: none;
  }

  div.side-toolbar {
    display: none;

  }

  div.enterprise-form-sidebox {
    display: none;
  }

  div.ui.menu.header-menu.header-container {
    font-family: Segoe UI;
  }

  div.ui.git-user-content {
    font-family: Segoe UI;
  }

  div.three.wide.column {
    font-family: Segoe UI;
  }
`;
  addGlobalStyle(css);
})();