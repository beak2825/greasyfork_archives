// ==UserScript==
// @name         隐藏Bilibili侧边栏话题
// @version      0.0.4
// @namespace    http://tampermonkey.net/
// @description  隐藏Bilibili侧边栏话题,没找到这个功能的脚本，自己编着玩的
// @author       Xw
// @match           *://*.bilibili.com/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @exclude         *://message.bilibili.com/pages/nav/header_sync
// @exclude         *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude         *://open-live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518463/%E9%9A%90%E8%97%8FBilibili%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/518463/%E9%9A%90%E8%97%8FBilibili%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const interval = setInterval(() => {
        if (mainFunc()) {
            clearInterval(interval);
            console.log('执行隐藏侧边栏话题脚本完成');
        }
    }, 500);
})();

function mainFunc() {
    let isShow = 0;
    const elements = document.querySelectorAll('.trending-list');
    if (! elements || elements.length === 0) return false;
    showOrHideElements(elements, isShow);

    // 找到侧边栏标题所在位置
    const parent = document.querySelector('.bili-dyn-search-trendings');
    const title = parent.querySelector('.title');

    // 给标题增加style
    title.style.display = 'flex';
    title.style.justifyContent = 'space-between';
    title.style.alignItems = 'center';

    if(title) {
        // 添加开关按钮
        const button = document.createElement('button');
        button.textContent = '展开';
        button.style.border = 'none';
        button.style.backgroundColor = 'white';
        button.style.color = '#00aeec';
        button.style.fontSize = '16px';
        button.style.fontWeight = '600';

        button.addEventListener('click', () => {
            if(isShow === 0) {
                isShow = 1;
                button.textContent = '折叠';
            } else {
                isShow = 0;
                button.textContent = '展开';
            }
            showOrHideElements(elements, isShow);
        });

        title.appendChild(button);
    }

    return true;
}

/**
    显示或隐藏元素
    type:
        1: 显示
        0: 隐藏
**/
function showOrHideElements(elements, type) {
    if(elements) {
        elements.forEach(element => {
            if(type === 1) {
                element.style.display = 'block';
            } else if (type === 0) {
                element.style.display = 'none';
            }
        });
    }
}