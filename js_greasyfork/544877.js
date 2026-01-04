// ==UserScript==
// @name         Apollo登录态辅助
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Appolo专用脚本 不对外
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      *://apollo-portal.prod.qima-inc.com/*
// @downloadURL https://update.greasyfork.org/scripts/544877/Apollo%E7%99%BB%E5%BD%95%E6%80%81%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/544877/Apollo%E7%99%BB%E5%BD%95%E6%80%81%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
(function () {
  "use strict";
  if (location.href.includes("default_sso_heartbeat")) return;
  const ENTRY_URL_KEY = "__MONKEY_apollo_redirect_url";
  const AUTH_TIME_KEY = "__MONKEY_apollo_redirect_auth_time";
  const apolloUrl = "https://apollo-portal.prod.qima-inc.com/";
  // 上次访问的url
  const lastEntryUrl = localStorage.getItem(ENTRY_URL_KEY);
  const lastAuthTime = localStorage.getItem(AUTH_TIME_KEY);
  const RE_AUTH_TIME = 10 * 60 * 1000;
  // 如果距离上次授权时间不足10分钟 不需要再次授权
  if (Date.now() - lastAuthTime < RE_AUTH_TIME) return;
  if (lastEntryUrl) {
    setTimeout(() => {
      // 授权完成记录授权时间
      localStorage.setItem(AUTH_TIME_KEY, Date.now());
      location.href = lastEntryUrl;
      // 用完需要删除
      localStorage.removeItem(ENTRY_URL_KEY);
    }, 1000);
  } else {
    console.log("存储的href", location.href);
    // 跳转授权中心
    location.href = apolloUrl;
    // 缓存上次进入的url
    localStorage.setItem(ENTRY_URL_KEY, location.href);
  }
})();
