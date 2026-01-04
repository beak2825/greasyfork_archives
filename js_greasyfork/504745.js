// ==UserScript==
// @name        zaixian100f.com 在线100分 自动答题,12倍速播放视频
// @namespace   www.miw.cn
// @description zaixian100f.com 在线100分 自动答题,12倍速播放视频, 因题库是加密原因,已对所加载过的题目进行了保存，已增加导出工具显示，要导出题库的请把所有题目(特别是：基础训练、专项训练)刷了显示一遍(你答不答题都行)，以便工具能够顺利保存题目。
// @match       *://*.zaixian100f.com/*
// @grant       GM.xmlHttpRequest
// @grant       GM.openInTab
// @grant       GM.listValues
// @grant       GM.notification
// @grant       GM.download
// @connect     *
// @require     https://update.greasyfork.org/scripts/511729/1460593/zaixian100fcom_libjs.js
// @version     1.3.3
// @author      hello@miw.cn
// @license     MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/504745/zaixian100fcom%20%E5%9C%A8%E7%BA%BF100%E5%88%86%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%2C12%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/504745/zaixian100fcom%20%E5%9C%A8%E7%BA%BF100%E5%88%86%20%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%2C12%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


setTimeout(async ()=>{
  __init();
  addFuncs();
  show_tool();
  refresh_names();
},1000);
