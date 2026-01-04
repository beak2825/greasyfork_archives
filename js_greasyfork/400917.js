// ==UserScript==
// @name         FT中文网自动加载全文
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      1.0
// @description  FT中文网自动加载全文，并修改所有FT中文网链接，增加全文参数
// @author       tmr
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400917/FT%E4%B8%AD%E6%96%87%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/400917/FT%E4%B8%AD%E6%96%87%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function fullft(link) {
    try {
      let u = new URL(link);
      if (
        (u.host == "chineseft.com" ||
          u.host == "www.chineseft.com" ||
          u.host == "ftchinese.com" ||
          u.host == "www.ftchinese.com" ||
          u.host == "m.ftchinese.com" ||
          u.host == "cn.ft.com") &&
        (u.pathname.startsWith("/story/") ||
          u.pathname.startsWith("/premium/") ||
          u.pathname.startsWith("/interactive/")) &&
        u.searchParams.get("full") == null
      ) {
        u.searchParams.set("full", "y");
        return u.toString();
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  // 替换页面ft链接
  function replace(u) {
    let n = fullft(location.href);
    if (n) {
      location.href = n;
      return;
    }
    let aTagList = document.querySelectorAll("a");
    aTagList.forEach(function (ele) {
      let n = fullft(ele.href);
      if (n) {
        ele.href = n;
      }
    });
  }
  replace();
})();
