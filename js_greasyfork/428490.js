// ==UserScript==
// @name         网易云音乐禁用扫码登录
// @version      0.1
// @description  描述不能与名称相同
// @match        *://music.163.com/*
// @include      *://music.163.com/*
// @grant        none
// @run-at       document-end
// @license      WTFPL
// @namespace https://greasyfork.org/users/141
// @downloadURL https://update.greasyfork.org/scripts/428490/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%A6%81%E7%94%A8%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/428490/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%A6%81%E7%94%A8%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

window.GDegradeConfig.degradeLogin = true;