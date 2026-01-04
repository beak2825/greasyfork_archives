"use strict";
// ==UserScript==
// @name         清廉街 Bridge - UserScript
// @namespace    https://github.com/QingLianJie/Bridge
// @description  用于从学校网站上获取数据的一个插件。
// @version      0.2.1
// @author       QingLianJie
// @copyright    2022 © QingLianJie
// @homepage     https://github.com/QingLianJie/Bridge
// @license      MIT
// @match        https://qinglianjie.cn/*
// @match        https://dev.qinglianjie.cn/*
// @match        https://internal.qinglianjie.cn/*
// @match        https://qing-dev.dist.run/*
// @match        http://localhost:20080/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      hrbeu.edu.cn
// @icon         https://qinglianjie.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/441439/%E6%B8%85%E5%BB%89%E8%A1%97%20Bridge%20-%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/441439/%E6%B8%85%E5%BB%89%E8%A1%97%20Bridge%20-%20UserScript.meta.js
// ==/UserScript==


// package.json
var version = "0.2.1";

// src/index.ts
unsafeWindow.Fetcher = async (options) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: options.method || "GET",
      url: options.url,
      responseType: "text",
      headers: options.headers || {},
      data: options.form || void 0,
      onload: (res) => {
        resolve(res.responseText);
      },
      onerror: (res) => {
        reject({ status: res.status, message: res.statusText });
      }
    });
  });
};
unsafeWindow.FetcherInfo = {
  name: "userscript",
  version: `v${version}`
};
