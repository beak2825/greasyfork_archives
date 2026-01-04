// ==UserScript==
// @name         blue-mdn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  blue mdn
// @author       ziyunfei
// @match        https://developer.mozilla.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31751/blue-mdn.user.js
// @updateURL https://update.greasyfork.org/scripts/31751/blue-mdn.meta.js
// ==/UserScript==

[...document.styleSheets].forEach(_ => _.href && (_.disabled = true));
GM_addStyle(`
@import "https://developer.cdn.mozilla.net/static/build/styles/mdn-blue.0d46c673f0ec.css";
@import "https://developer.cdn.mozilla.net/static/build/styles/wiki-blue.2a997a3502fe.css";
@import "https://developer.cdn.mozilla.net/static/build/styles/locales/zh-CN.f6594de96c23.css";

.nav-footer, .newsletter-box {
  display: none
}

#nav-sec {
  top: 150px;
  right: 20px;
}
`);