// ==UserScript==
// @name         [知乎] 屏蔽不想看到的答主
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在知乎,屏蔽掉你不想看到的答主
// @author       mingchen3398
// @match        https://www.zhihu.com/question/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      MIT
// @supportURL   https://space.bilibili.com/86906776
// @downloadURL https://update.greasyfork.org/scripts/477814/%5B%E7%9F%A5%E4%B9%8E%5D%20%E5%B1%8F%E8%94%BD%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E7%AD%94%E4%B8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/477814/%5B%E7%9F%A5%E4%B9%8E%5D%20%E5%B1%8F%E8%94%BD%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E7%9A%84%E7%AD%94%E4%B8%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 黑名单列表,引号内写入不想看见的答主,半角逗号(,) 引号('' | ""),例如:"知乎小管家","每日经济新闻",复制替换也行
    const blackList = ["每日经济新闻","知乎小管家"]

    function hideBlackUser(){
        const nodeList = document.querySelectorAll('.Question-main .AuthorInfo-content .UserLink-link')
        let blackNode = []
        nodeList.forEach(i=>{
            let res = blackList.includes(i.innerText)
            if(res){
                const item = parents(i,'.List-item')
                blackNode = [...blackNode,...item]
            }
        })
        blackNode.forEach(i=>{
            hide(i)
        })
    }

    function parents(el, selector) {
        const parents = [];
        while ((el = el.parentNode) && el !== document) {
            if (!selector || el.matches(selector)) parents.push(el);
        }
        return parents;
    }

    function hide(el){
        el.style.display = 'none';
    }

    hideBlackUser()

})();