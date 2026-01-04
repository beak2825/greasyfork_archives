// ==UserScript==
// @name         EasyPHP 面板助手
// @namespace    https://www.wdssmq.com/
// @author       沉冰浮水
// @description  新窗口打开站点；自动启用服务；书签功能；
// @version      0.1
// @match        http://127.0.0.1:1111/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/421520/EasyPHP%20%E9%9D%A2%E6%9D%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/421520/EasyPHP%20%E9%9D%A2%E6%9D%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/*jshint esversion:6 */
(function () {
  "use strict";
  let $ = typeof window.$ == "function" ? window.$ : unsafeWindow.jQuery;
  $("a.list_alias_name").attr("target", "_blank");

  // 自动启用
  $(".btn-success[type=submit]").each(function () {
    $(this).click();
  });

  // 书签
  const bookmarks = GM_getValue("bookmarks", []);
  if (bookmarks.length === 0) {
    GM_setValue("bookmarks", [
      {
        site: "zbp",
        name: "后台",
        url: "/zb_system/cmd.php?act=login",
      },
    ]);
  }

  // 站点列表
  const siteList = {};
  $(".list_alias_name").each(function () {
    const site = $(this).find("b").text();
    siteList[site] = $(this);
  });

  // 输出书签
  bookmarks.forEach((item) => {
    const site = item.site;
    if (!siteList[site]) {
      return;
    }
    const rootUrl = siteList[site].attr("href");
    siteList[site].after(
      ` | <a title="${item.name}" class="list_alias_name" target="_blank" href="${rootUrl}${item.url}">${item.name}</a>`
    );
  });
})();
