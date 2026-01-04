// ==UserScript==
// @name        tap.io to taptap.com
// @namespace   com.jhdxr.scripts
// @match       *://www.tap.io/*
// @match       *://www.taptap.io/*
// @run-at       document-start
// @grant        unsafeWindow
// @version     0.0.2
// @author      jhdxr
// @description 自动从 tap.io & taptap.io 跳转回 taptap.com 的一个小脚本
// @downloadURL https://update.greasyfork.org/scripts/404561/tapio%20to%20taptapcom.user.js
// @updateURL https://update.greasyfork.org/scripts/404561/tapio%20to%20taptapcom.meta.js
// ==/UserScript==

unsafeWindow.location.href=unsafeWindow.location.href.replace('taptap.io', 'taptap.com').replace('tap.io', 'taptap.com');