// ==UserScript==
// @name         清理直播导航栏
// @namespace    https://greasyfork.org/zh-CN/users/764555
// @version      1.0.1
// @description  清理B站直播导航栏
// @author       冰冻大西瓜
// @license      GPLv3
// @match        http(s?)://live.bilibili.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @note         更新 license 和 namespace
// @note         屏蔽直播导航栏热点推送
// @note         屏蔽直播导航栏不感兴趣的项目
// @downloadURL https://update.greasyfork.org/scripts/474641/%E6%B8%85%E7%90%86%E7%9B%B4%E6%92%AD%E5%AF%BC%E8%88%AA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/474641/%E6%B8%85%E7%90%86%E7%9B%B4%E6%92%AD%E5%AF%BC%E8%88%AA%E6%A0%8F.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
GM_addStyle(`
.nav-items-ctnr .vertical-middle a[name]:not(:is([name="网游"],[name="知识"],[name="生活"])) {
  display: none !important;
}
.search-pannel .trending{
  display: none !important;
}

`)
