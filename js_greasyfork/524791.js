// ==UserScript==
// @name        🌱通威新闻自动阅读脚本
// @namespace   Violentmonkey Scripts
// @match       *://fmi.tongwei.com:8016/mobileportal/*/home/newsList*
// @icon         https://21tb-file5.21tb.com/sf-server/file/getFile/faea6060ff41010e29235a87b176ff3e-N_1523333333333/60af80f6a3102fedcd26bc80_0100
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @version     1.2
// @author       leibing
// @author      -
// @license      MIT
// @description 2025/1/24 16:38:41
// @downloadURL https://update.greasyfork.org/scripts/524791/%F0%9F%8C%B1%E9%80%9A%E5%A8%81%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/524791/%F0%9F%8C%B1%E9%80%9A%E5%A8%81%E6%96%B0%E9%97%BB%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
javascript:"use strict";var script = document.createElement('script');
script.src = "https://gitee.com/leibingcn/browser-script/raw/master/tongweiNewAuto.js";
document.getElementsByTagName('head')[0].appendChild(script);