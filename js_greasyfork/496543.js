// ==UserScript==
// @name         JsonExportExcel
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496543/JsonExportExcel.user.js
// @updateURL https://update.greasyfork.org/scripts/496543/JsonExportExcel.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);
  Qmsg.success("excel导出工具已加载！");
  var starBaseUrl = "http://starapi.yinlimedia.com/admin/yuntu_plugins_datas"
  if (localStorage.getItem("statBaseUrl")) {
    localStorage.removeItem("statBaseUrl");
  }
  localStorage.setItem("statBaseUrl", starBaseUrl);
})();
