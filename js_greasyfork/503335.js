// ==UserScript==
// @name                2048 重定向
// @description         重定向2048我为人人社区临时地址至永久地址hjd2048.com，如存在误杀，复制@exclude行并将地址改为需要解除误杀的地址即可
// @namespace        2048-redirector
// @version             2024.08.12
// @author              雪豹闭嘴
// @license             MIT License
// @run-at              document-start
// @match               *://*/2048/*
// @exclude             *://hjd2048.com/*
// @downloadURL https://update.greasyfork.org/scripts/503335/2048%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/503335/2048%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

"use strict";

window.location.replace(location.href.replace(location.hostname, "hjd2048.com"));
