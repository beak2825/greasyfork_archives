// ==UserScript==
// @name         语雀样式
// @namespace    https://greasyfork.org/users/1268743-okoala
// @version      1.0.0
// @description  语雀样式修复
// @author       仙森
// @icon         https://www.google.com/s2/favicons?domain=yuque.com
// @match        *://*.yuque.com/*
// @match        *://yuque.antfin.com/*
// @match        *://yuque.antfin-inc.com/*
// @grant        none
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536959/%E8%AF%AD%E9%9B%80%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536959/%E8%AF%AD%E9%9B%80%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const style = document.createElement('style');
  style.id = 'yuque-tampermonkey-fix';
  style.type = 'text/css';

  const cssString = `
  .col-config-select-options .option-list {
    max-height: calc(80vh - 200px);
  }
  `;

  style.appendChild(document.createTextNode(cssString));
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
})();
