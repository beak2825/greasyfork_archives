// ==UserScript==
// @name         红绿色弱用Google
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  让已访问链接和未访问链接颜色区分更明显(V1.0:增加谷歌学术支持，优化实现方式)
// @author       nicolas
// @match        https://www.google.com/search?*
// @match        https://www.google.com.hk/search?*
// @match        https://scholar.google.com/scholar?*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/387441/%E7%BA%A2%E7%BB%BF%E8%89%B2%E5%BC%B1%E7%94%A8Google.user.js
// @updateURL https://update.greasyfork.org/scripts/387441/%E7%BA%A2%E7%BB%BF%E8%89%B2%E5%BC%B1%E7%94%A8Google.meta.js
// ==/UserScript==

GM_addStyle(".mblink:visited, a:visited {color: #14c87f;}");
GM_addStyle(".gs_rt a:visited, .gs_rt a:visited b, .gs_rt2 a:visited, .gs_rt2 a:visited b {color: #14c87f;}");