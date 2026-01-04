// ==UserScript==
// @name         自动跳过QQ网址拦截
// @version      1.0.0
// @description  a gift for department leader -- nono
// @author       kc
// @namespace    kc
// @match        *://c.pc.qq.com/middlem.html*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452959/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E7%BD%91%E5%9D%80%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/452959/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E7%BD%91%E5%9D%80%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

location.href=new URLSearchParams(location.search).get('pfurl')