// ==UserScript==
// @name         剑灵怀旧服新闻中心新闻按时间重排序
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  剑灵怀旧服新闻中心新闻按时间重排序，更容易找到最新新闻
// @author       itning
// @match        https://bns.qq.com/webplat/info/news_version3/1298/61649/*.shtml
// @icon         https://bns.qq.com/favicon.ico
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/494286/%E5%89%91%E7%81%B5%E6%80%80%E6%97%A7%E6%9C%8D%E6%96%B0%E9%97%BB%E4%B8%AD%E5%BF%83%E6%96%B0%E9%97%BB%E6%8C%89%E6%97%B6%E9%97%B4%E9%87%8D%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494286/%E5%89%91%E7%81%B5%E6%80%80%E6%97%A7%E6%9C%8D%E6%96%B0%E9%97%BB%E4%B8%AD%E5%BF%83%E6%96%B0%E9%97%BB%E6%8C%89%E6%97%B6%E9%97%B4%E9%87%8D%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取ul元素
    let ul = document.querySelector('.pg1_box2 ul');

    // 获取所有的li元素
    let lis = Array.from(ul.querySelectorAll('li'));

    // 根据日期从近到远排序li元素
    lis.sort((a, b) => {
        let dateA = new Date(a.querySelector('.pg1_txt2').textContent);
        let dateB = new Date(b.querySelector('.pg1_txt2').textContent);
        return dateB - dateA;
    });

    // 清空ul元素
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    // 将排序后的li元素重新添加到ul元素中
    for (let li of lis) {
        ul.appendChild(li);
    }
    
    console.log('剑灵怀旧服新闻中心新闻按时间重排序-完成');
    
})();