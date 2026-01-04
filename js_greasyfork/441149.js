// ==UserScript==
// @name         阿里云盘控制栏进度条透明虚化
// @namespace    http://tampermonkey.net/
// @description  非聚焦时完全透明，聚焦时透明度位0.8。本脚本内存基本0占用。失效了请通知我tangssst@qq.com
// @contributor  0
// @author       bronya0
// @match        https://www.aliyundrive.com/*
// @icon         https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @grant        GM_log
// @grant        GM_addStyle
// @license MIT
// @version 0.0.1.20220309033404
// @downloadURL https://update.greasyfork.org/scripts/441149/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%8E%A7%E5%88%B6%E6%A0%8F%E8%BF%9B%E5%BA%A6%E6%9D%A1%E9%80%8F%E6%98%8E%E8%99%9A%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/441149/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%8E%A7%E5%88%B6%E6%A0%8F%E8%BF%9B%E5%BA%A6%E6%9D%A1%E9%80%8F%E6%98%8E%E8%99%9A%E5%8C%96.meta.js
// ==/UserScript==

GM_addStyle(".video-player--29_72 {opacity: 0 !important;}");
GM_addStyle(".video-player--29_72.show--Zy5bU {opacity: .8 !important;}");