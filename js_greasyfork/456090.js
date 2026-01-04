// ==UserScript==
// @name         钉钉刷赞
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  钉钉直播刷赞
// @author       share121
// @match        https://h5.dingtalk.com/group-live-share/index.htm?*type=2*
// @icon         https://g.alicdn.com/dingding/web/0.2.6/img/oldIcon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456090/%E9%92%89%E9%92%89%E5%88%B7%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/456090/%E9%92%89%E9%92%89%E5%88%B7%E8%B5%9E.meta.js
// ==/UserScript==
/https?:\/\/h5.dingtalk.com\/group-live-share\/index.htm\?(?=.*(liveUuid=|uuid=))(?=.*type=2).*#\/union/g.test(location.href)&&setInterval(()=>{document.querySelector('.BIj0yxQ_')&&document.querySelector('.BIj0yxQ_').click()},0)