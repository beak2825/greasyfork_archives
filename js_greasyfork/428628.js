// ==UserScript==
// @name         简书一键净化脚本
// @namespace    http://tampermonkey.net/
// @description  清除广告 评论 推荐等,只保留文章和作者.
// @author       艾尔蓝德
// @version      1.0.2
// @match        www.jianshu.com/*
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/428628/%E7%AE%80%E4%B9%A6%E4%B8%80%E9%94%AE%E5%87%80%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428628/%E7%AE%80%E4%B9%A6%E4%B8%80%E9%94%AE%E5%87%80%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    'use strict';
    const style=document.createElement("style");
	style.setAttribute("type", "text/css")
    style.innerHTML=`
section[aria-label],div[aria-label]:not([aria-label~=给文章点赞]),footer+div {
  display:none
}
`
    document.head.appendChild(style)
    const jian_clear = function(){
        const removeList = [
            'header',
            // 右侧栏
            'div[role*=main] aside',
            // 底部广告
            'div[role*=main] ._gp-ck>section:first-of-type~*',
            // 二维码 关注之类的
            'div[role*=main] article~*',
            // 左侧栏
            '#__next>footer~div',
            // 评论
            '#__next>footer'
        ]
        for(const item of removeList){
            for(const _node of document.querySelectorAll(item)){
                _node.remove()
            }
        }
    }
    GM_registerMenuCommand('一键净化', jian_clear)
})();