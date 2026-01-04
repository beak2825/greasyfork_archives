// ==UserScript==
// @name         百度好看视频下载
// @namespace    https://haokan.baidu.com/
// @version      0.11
// @description  下载百度 sv.baidu.com 的视频
// @author       yxpxa
// @icon         https://sv.baidu.com/favicon.ico
// @match        *://sv.baidu.com/*
// @match        *://haokan.baidu.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377155/%E7%99%BE%E5%BA%A6%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/377155/%E7%99%BE%E5%BA%A6%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
/*在浏览器地址栏贴入视频链接，然后在新页面里右键下载*/
if(curVideoMeta){location.href=curVideoMeta.playurl}