// ==UserScript==
// @name         飞客茶馆网址重定向助手
// @version      0.4
// @description  重定向飞客的各种不同域名，避免重复登录。
// @match        *://47.100.65.202/*
// @match        *://www.flyerpoints.cn/*
// @match        *://www.flyert.com/*

// @author       Eric Qian
// @namespace    https://greasyfork.org/users/1240870
// @grant        none
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/483401/%E9%A3%9E%E5%AE%A2%E8%8C%B6%E9%A6%86%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483401/%E9%A3%9E%E5%AE%A2%E8%8C%B6%E9%A6%86%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// forked from https://greasyfork.org/zh-CN/scripts/453395-nga%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91%E5%8A%A9%E6%89%8B
const flyert_destination = "www.flyert.com.cn"

if (location.hostname!=flyert_destination) {
window.location.replace(location.href.replace(location.hostname, flyert_destination));
}
