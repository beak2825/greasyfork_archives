// ==UserScript==
// @name         屏蔽知乎热门内容推荐
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  屏蔽知乎feed流的热门推荐
// @author       Yidadaa
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40709/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%83%AD%E9%97%A8%E5%86%85%E5%AE%B9%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/40709/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%83%AD%E9%97%A8%E5%86%85%E5%AE%B9%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastItemCount = 0;
    const selectItems = () => document.querySelectorAll('.TopstoryItem');
    const container = document.querySelector('.Topstory-mainColumn');
    const doRemove = () => {
        const newItems = selectItems();
        if (newItems.length !== lastItemCount) {
            Array.from(newItems)
                .filter(v => v.innerText.indexOf('热门内容') > -1)
                .forEach(v => v.style.display='none');
            lastItemCount = newItems.length;
        }
        const containerHeight = container.getBoundingClientRect().height;
        const windowHeight = window.innerHeight;
        if (containerHeight < windowHeight) {
            container.style.marginBottom = `${windowHeight - containerHeight + 100}px`;// 防止页面无法滚动，导致无法触发知乎刷新
        }
    };
    const oldListener = window.onscroll;
    window.onscroll = () => {
        if (!!oldListener) oldListener();
        doRemove();
    };
    const oldOnload = window.onload;
    window.onload = () => {
        if (!!oldOnload) oldOnload();
        doRemove();
    };
})();