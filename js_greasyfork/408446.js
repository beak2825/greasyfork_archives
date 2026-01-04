// ==UserScript==
// @name         蓝奏云访问修复工具
// @namespace    http://tampermonkey.net/
// @version      20.8.10.1
// @description  将域名从 www.lanzous.com 转换成 ww.lanzous.com ，一行代码解决一部分蓝奏云用户无法打开蓝奏云 www.lanzous.com 网站的问题。
// @AuThor       wxh
// @match        *://www.lanzous.com/*
// @downloadURL https://update.greasyfork.org/scripts/408446/%E8%93%9D%E5%A5%8F%E4%BA%91%E8%AE%BF%E9%97%AE%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/408446/%E8%93%9D%E5%A5%8F%E4%BA%91%E8%AE%BF%E9%97%AE%E4%BF%AE%E5%A4%8D%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
window.location.href = (window.location.href).replace("://www.lanzous.com/", "://ww.lanzous.com/");
