// ==UserScript==
// @name         洛谷自动签到
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  只要登陆过洛谷,下一次打开chrome即可自动签到(仅支持最新版chrome:登陆过洛谷重启浏览器可以保持登陆状态的)
// @author       spicy_chicken(bossbaby)
// @match        *://*
// @match        *://www.luogu.org/*
// @match        *://www.luogu.com.cn/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393551/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/393551/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
GM_xmlhttpRequest({
  method: "GET",
  url: "https://www.luogu.com.cn/index/ajax_punch",
  onload: function(response) {
      console.log(JSON.parse(response["response"])["message"]);
  }
});