// ==UserScript==
// @name         【灰度测试】B站直播 主播一键停播
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  需配合推流软件的串流延迟功能使用。若有人恶意发送违规弹幕导致回显违规弹幕，或者在直播某些网游的公屏发送违规内容时，可切换到开播设置页面通过快捷键一键关闭直播。
// @license      BSD-3-Clause
// @author       别问我是谁请叫我雷锋
// @match        https://link.bilibili.com/p/center/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427102/%E3%80%90%E7%81%B0%E5%BA%A6%E6%B5%8B%E8%AF%95%E3%80%91B%E7%AB%99%E7%9B%B4%E6%92%AD%20%E4%B8%BB%E6%92%AD%E4%B8%80%E9%94%AE%E5%81%9C%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/427102/%E3%80%90%E7%81%B0%E5%BA%A6%E6%B5%8B%E8%AF%95%E3%80%91B%E7%AB%99%E7%9B%B4%E6%92%AD%20%E4%B8%BB%E6%92%AD%E4%B8%80%E9%94%AE%E5%81%9C%E6%92%AD.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    document.onkeyup = function (e) { console.log(e) ; if (e.key == 'z' && location.href == 'https://link.bilibili.com/p/center/index#/my-room/start-live') { document.querySelector(".live-btn").click() } }
})();