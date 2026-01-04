// ==UserScript==
// @name         屏蔽视频播放互动引导
// @namespace    https://greasyfork.org/zh-CN/users/764555
// @version      1.0.1
// @description  遮挡画面,遮挡字幕,烦不胜烦,遂屏蔽之
// @author       冰冻大西瓜
// @license      GPLv3
// @match        http(s?)://www.bilibili.com/video/*
// @grant        GM_addStyle
// @note         更新 license 和 namespace
// @downloadURL https://update.greasyfork.org/scripts/474639/%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BA%92%E5%8A%A8%E5%BC%95%E5%AF%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/474639/%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BA%92%E5%8A%A8%E5%BC%95%E5%AF%BC.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
GM_addStyle(`.bpx-player-cmd-dm-wrap:has(.bpx-player-cmd-dm-inside){display:none !important;}`)
