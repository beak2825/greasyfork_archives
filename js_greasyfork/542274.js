// ==UserScript==
// @name         B站影视跳转豆瓣搜索
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在B站影视播放页增加跳转豆瓣的按钮
// @author       精风
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542274/B%E7%AB%99%E5%BD%B1%E8%A7%86%E8%B7%B3%E8%BD%AC%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/542274/B%E7%AB%99%E5%BD%B1%E8%A7%86%E8%B7%B3%E8%BD%AC%E8%B1%86%E7%93%A3%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createDoubanButton(title) {
    const btn = document.createElement('a');
    btn.href = `https://movie.douban.com/subject_search?search_text=${encodeURIComponent(title)}`;
    btn.target = '_blank';
    btn.innerText = '查豆瓣';
    btn.style.position = 'fixed';
    btn.style.zIndex = 9999;
    btn.style.padding = '5px 10px';
    btn.style.background = '#007722';
    btn.style.color = '#fff';
    btn.style.borderRadius = '5px';
    btn.style.textDecoration = 'none';
    btn.style.fontSize = '14px';
    btn.style.cursor = 'move';

    // 从 localStorage 读取位置，默认右上角
    const savedPos = localStorage.getItem('doubanBtnPos');
    if (savedPos) {
        const pos = JSON.parse(savedPos);
        btn.style.top = pos.top + 'px';
        btn.style.left = pos.left + 'px';
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
    } else {
        btn.style.top = '10px';
        btn.style.right = '10px';
    }

    document.body.appendChild(btn);

    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let moved = false;  // 标记是否拖动过

    btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = btn.offsetLeft;
        startTop = btn.offsetTop;
        btn.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;

        // 只有拖动超过一定距离才算拖动，防止点一下误触发
        if (!moved && Math.sqrt(dx*dx + dy*dy) > 5) {
            moved = true;
        }

        if (moved) {
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            const maxLeft = window.innerWidth - btn.offsetWidth;
            const maxTop = window.innerHeight - btn.offsetHeight;
            newLeft = Math.min(Math.max(0, newLeft), maxLeft);
            newTop = Math.min(Math.max(0, newTop), maxTop);

            btn.style.left = newLeft + 'px';
            btn.style.top = newTop + 'px';
            btn.style.right = 'auto';
            btn.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            btn.style.transition = '';
            if (moved) {
                // 保存位置
                localStorage.setItem('doubanBtnPos', JSON.stringify({
                    left: btn.offsetLeft,
                    top: btn.offsetTop
                }));
            }
        }
    });

    // 阻止拖动时点击跳转
    btn.addEventListener('click', (e) => {
        if (moved) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}



    function tryAddButton() {
    let rawTitle = document.title;

    // 去除网页后缀
    rawTitle = rawTitle.replace(/[-_].*$/, '').trim();

    // 去除常见的多余描述（“第x季”“全集”“在线观看”等）
    rawTitle = rawTitle.replace(/第[\d一二三四五六七八九十]+[季部集].*$/, '');
    rawTitle = rawTitle.replace(/[\s【】（）\[\]\(\)]+/g, ''); // 去除中英文括号等
    rawTitle = rawTitle.replace(/(电视剧|电影|全集|在线观看|高清|哔哩哔哩|bilibili)/gi, '');
    rawTitle = rawTitle.trim();

    if (!document.querySelector('a[href^="https://www.douban.com/search"]')) {
        createDoubanButton(rawTitle);
    }
}

    setTimeout(tryAddButton, 2000); // 页面加载后延迟2秒执行
})();