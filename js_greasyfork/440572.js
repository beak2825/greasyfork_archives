// ==UserScript==
// @name                 Replace smth fonts
// @name:zh-CN           替换和美化smth字体
// @namespace            https://*
// @version              1.0.1
// @author               starload
// @match                https://www.mysmth.net/nForum/*
// @description          Replace smth fonts to Microsoft YaHei
// @include              https://www.mysmth.net/nForum/*
// @supportURL           https://*
// @run-at               document-start
// @grant                GM_addStyle
// @license              MIT
// @downloadURL https://update.greasyfork.org/scripts/440572/Replace%20smth%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/440572/Replace%20smth%20fonts.meta.js
// ==/UserScript==

GM_addStyle(`
    body :not(:-webkit-any(em,i)){font-family:"Microsoft YaHei"}
    * {font-size : 14px!important}
    * {text-shadow : 0.00em 0.00em 0.00em #999999}
    * {text-decoration:none!important;font-weight:500!important;}
`);
