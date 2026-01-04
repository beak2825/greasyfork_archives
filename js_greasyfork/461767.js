// ==UserScript==
// @name         字體美化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change font for all webpages except those with specified classes
// @match        http://*/*
// @match        https://*/*
// @exclude      *class1*
// @exclude      *class2*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/461767/%E5%AD%97%E9%AB%94%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461767/%E5%AD%97%E9%AB%94%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

GM_addStyle('*:not([class*=class1]):not([class*=class2]) {font-family: "Microsoft Yahei", "Microsoft Yahei" !important; font-weight: bold !important;}');
