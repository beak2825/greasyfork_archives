// ==UserScript==
// @name         钉钉直播重定向
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解决钉钉直播打不开的问题
// @author       share121
// @match        https://h5.dingtalk.com/group-live-share/index.htm?*
// @icon         https://g.alicdn.com/dingding/web/0.2.6/img/oldIcon.ico
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/456091/%E9%92%89%E9%92%89%E7%9B%B4%E6%92%AD%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456091/%E9%92%89%E9%92%89%E7%9B%B4%E6%92%AD%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
/https?:\/\/h5.dingtalk.com\/group-live-share\/index.htm\?(?=.*(liveUuid=|uuid=))(?!.*type=2).*/g.test(location.href)&&(location.href=location.href.replace(/.*(liveUuid=[a-zA-Z0-9-]+|uuid=[a-zA-Z0-9-]+).*/g,"https://h5.dingtalk.com/group-live-share/index.htm?type=2&$1#/union"))