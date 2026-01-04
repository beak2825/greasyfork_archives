// ==UserScript==
// @name       XJT登录跳转HTTPS
// @namespace   XTJUloginHTTPS
// @description    XJT登录跳转HTTPS,解决有时候打开登陆页面乱序的问题
// @include     http://*xjtu.edu.cn*login*
// @version     1.0
// @author     Lfg
// @grant       none
// @icon        https://cdn.colorhub.me/CyiSW2apzNgc6o_fqfsL_iQQ0U2ieJMFI4xAqyGmowM/auto/0/500/ce/0/bG9jYWw6Ly8vODEv/MzQvMzc2NGJlMjE5/MTBhODQyOWJlYjdh/N2E0ZjMzYzU4NDE2/ZWUyODEzNC5qcGVn.jpg

// @downloadURL https://update.greasyfork.org/scripts/430952/XJT%E7%99%BB%E5%BD%95%E8%B7%B3%E8%BD%ACHTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/430952/XJT%E7%99%BB%E5%BD%95%E8%B7%B3%E8%BD%ACHTTPS.meta.js
// ==/UserScript==



location.replace(
	location.href.replace('http://', 'https://')
)