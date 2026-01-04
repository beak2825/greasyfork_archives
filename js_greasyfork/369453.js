// ==UserScript==
// @name                NMacDirectDownload
// @description         Skip NMac download page.
// @description:zh-CN   跳过 NMac 的多余下载引导页面
// @author              ladit
// @version             1.0.2
// @namespace           https://greasyfork.org/zh-CN/scripts/369453
// @homepageURL         https://github.com/ladit/Userscripts
// @supportURL          https://github.com/ladit/Userscripts
// @grant               none
// @run-at              document-end
// @match               https://nmac.to/dl/*
// @match               https://nxmac.com/dl/*
// @downloadURL https://update.greasyfork.org/scripts/369453/NMacDirectDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/369453/NMacDirectDownload.meta.js
// ==/UserScript==


window.location.replace(document.querySelector('a.btn.btn-medium.btn-block').href);
