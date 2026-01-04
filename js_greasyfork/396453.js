// ==UserScript==
// @name         随便看看电影直播房间关灯模式
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  关灯模式
// @author       xuyg
// @match        https://www.sbkk.me/3991.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396453/%E9%9A%8F%E4%BE%BF%E7%9C%8B%E7%9C%8B%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%92%AD%E6%88%BF%E9%97%B4%E5%85%B3%E7%81%AF%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/396453/%E9%9A%8F%E4%BE%BF%E7%9C%8B%E7%9C%8B%E7%94%B5%E5%BD%B1%E7%9B%B4%E6%92%AD%E6%88%BF%E9%97%B4%E5%85%B3%E7%81%AF%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
     // 屏蔽：顶部导航
    document.getElementsByClassName('site-header mg-b')[0].style.display="none";
    // 屏蔽：中部介绍
    document.getElementsByClassName('b2-single-content wrapper')[0].style.display="none";
     // 屏蔽：侧边外部推广
    document.getElementsByClassName('aside-container')[0].style.display="none";
    // 屏蔽：动图猜猜
    document.getElementsByClassName('mascot')[0].style.display="none";
    // 屏蔽：底部介绍
    document.getElementsByClassName('footer')[0].style.display="none";
    // 屏蔽：电影解析
    document.getElementsByClassName('tuyiyi_ywmaps')[0].style.display="none";
    // 优化尺寸
    document.getElementsByClassName('post-video-list')[0].style="width: 200px; margin-left: 16px; margin-top: 16px;"
})();