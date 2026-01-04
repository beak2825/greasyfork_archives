// ==UserScript==
// @name         eh阅读状态
// @namespace    com.xioxin.EhTagReadStatus
// @version      0.1
// @description  利用css ":visited" 特性在标题前增加阅读状态指示
// @author       xioxin
// @homepage     https://github.com/EhTagTranslation/UserScripts
// @supportURL   https://github.com/EhTagTranslation/UserScripts/issues
// @include     *://exhentai.org/*
// @include     *://e-hentai.org/*
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/415726/eh%E9%98%85%E8%AF%BB%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/415726/eh%E9%98%85%E8%AF%BB%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

GM_addStyle(`
.itg a .glink::before {
    content: "●";
    color: #1a9317;
    padding-right: 4px;
}
.itg a:visited .glink::before {
    color: #aaa;
}`);