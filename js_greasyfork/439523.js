// ==UserScript==
// @name        线报酷扩展
// @namespace   线报酷扩展空间
// @match       https://www.xianbaoku.net/*
// @match       https://*.xianbao.fun/*
// @match       http://*.xianbao.fun/*
// @match       http://*.ixbk.fun/*
// @match       https://*.ixbk.fun/*
// @match       http://*.ixbk.net/*
// @match       https://*.ixbk.net/*
// @match       http://*.aixbk.fun/*
// @match       https://*.aixbk.fun/*
// @match       http://*.aixbk.net/*
// @match       https://*.aixbk.net/*
// @version     2.1
// @author      线报酷
// @description 用来开启用户中心高级函数，解决部分浏览器禁用通知权限问题，解决微信推送跨域问题
// @connect      weixin.qq.com
// @connect      dingtalk.com
// @connect      day.app
// @connect      127.0.0.1
// @homepageURL  http://new.xianbao.fun/jiaocheng/505211.html
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_info
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/439523/%E7%BA%BF%E6%8A%A5%E9%85%B7%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/439523/%E7%BA%BF%E6%8A%A5%E9%85%B7%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
unsafeWindow.GM_notification = GM_notification;
unsafeWindow.GM_info = GM_info;