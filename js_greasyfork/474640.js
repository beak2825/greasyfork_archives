// ==UserScript==
// @name         清理导航栏
// @namespace    https://greasyfork.org/zh-CN/users/764555
// @version      1.0.9
// @description  清理B站导航栏
// @author       冰冻大西瓜
// @license      GPLv3
// @match        http(s?)://(www|search|space|message|t).bilibili.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @note         2025年2月25日 隐藏搜索栏下的热点
// @note         新增了在个人动态页面的导航栏清理
// @note         屏蔽 eslint 报错
// @note         更新 license 和 namespace
// @note         屏蔽自动悬浮的促销大会员卡片广告
// @note         屏蔽导航栏左侧多余的推荐栏目
// @note         屏蔽导航栏右侧多余的推荐栏目
// @note         修复因屏蔽导致的导航栏错位
// @note         清除导航栏右侧的动态红点
// @downloadURL https://update.greasyfork.org/scripts/474640/%E6%B8%85%E7%90%86%E5%AF%BC%E8%88%AA%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/474640/%E6%B8%85%E7%90%86%E5%AF%BC%E8%88%AA%E6%A0%8F.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
GM_addStyle(`
.adblock-tips,.left-entry .v-popover-wrap:nth-child(n+4),.trending,.right-entry :is(.right-entry-item,.v-popover-wrap:nth-child(2)),.renew-bubble,.v-popover-wrap>.red-num--dynamic {
  display:none !important;
}

.nav-link-item:nth-child(2),
.nav-link-item:nth-child(3),
.nav-link-item:nth-child(n+5){
  display:none !important;
}
.right-entry .v-popover-wrap:nth-child(6)>div{
  left:-150%;
}
.right-entry .v-popover-wrap:nth-child(5)>div{
  left:-100%;
}
.right-entry .v-popover-wrap:nth-child(4)>div{
  left:-50%;
}
.search-pannel .trending{
  display: none !important;
}r
`)

document.onwheel = console.log('清理导航栏')
