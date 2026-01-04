// ==UserScript==
// @name 付流量费吧
// @description 屏蔽首次alert弹窗
// @namespace caonimahuojiujian
// @match *://bbs.saraba1st.com/*
// @grant none
// @run-at document-start
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/378266/%E4%BB%98%E6%B5%81%E9%87%8F%E8%B4%B9%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/378266/%E4%BB%98%E6%B5%81%E9%87%8F%E8%B4%B9%E5%90%A7.meta.js
// ==/UserScript==

const realAlert = alert;
window.alert = () => window.alert = realAlert;