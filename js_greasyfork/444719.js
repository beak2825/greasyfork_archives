// ==UserScript==
// @name         水木保持登录
// @namespace    https://github.com/doggeddog
// @homepage     https://github.com/doggeddog/smth_scripts
// @version      1.2
// @description  水木社区经常掉线, 这个脚本通过自动刷新保持登陆状态.
// @author       doggeddog
// @match        *://www.newsmth.net/*
// @match        *://www.mysmth.net/*
// @match        *://m.mysmth.net/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/444719/%E6%B0%B4%E6%9C%A8%E4%BF%9D%E6%8C%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/444719/%E6%B0%B4%E6%9C%A8%E4%BF%9D%E6%8C%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
 
function refresh() {
    var refreshTime = GM_getValue('refreshTime');
    var now = Date.now();
    console.log("refresh", refreshTime, now);
    // 5分钟刷新状态一次
    if(now > refreshTime + 30000){
        SESSION.update(true);
        GM_setValue('refreshTime', now);
        console.log("session updated");
    }
}
 
GM_setValue('refreshTime', Date.now());
setInterval(refresh, 6000);