// ==UserScript==
// @name         右键快搜
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  精简右键菜单搜索功能（当前页打开）添加id #ks
// @author       AI助手
// @match        *://*/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/528374/%E5%8F%B3%E9%94%AE%E5%BF%AB%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/528374/%E5%8F%B3%E9%94%AE%E5%BF%AB%E6%90%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let menu = null;
    const ENGINE = [
        {name: '百度', url: 'https://www.baidu.com/s?wd='},
        {name: '谷歌', url: 'https://www.google.com/search?q='},
        {name: '必应', url: 'https://cn.bing.com/search?q='}
    ];

    // 创建搜索菜单
    const createMenu = (e, text) => {
        removeMenu();

        menu = document.createElement('div');
        menu.id = `ks`;
        menu.style = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;`
                   + `background:#fff;border:1px solid #ddd;border-radius:4px;`
                   + `box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:99999;`;

        ENGINE.forEach(engine => {
            const link = document.createElement('a');
            link.textContent = engine.name;
            link.style = 'display:block;padding:8px 12px;color:#06c;cursor:pointer;';
            link.onclick = () => window.location.href = engine.url + encodeURIComponent(text);
            menu.appendChild(link);
        });

        document.body.appendChild(menu);
        document.addEventListener('click', removeMenu, {once: true});
    };

    // 移除菜单
    const removeMenu = () => {
        if (menu) {
            menu.remove();
            menu = null;
        }
    };

    // 右键监听
    document.addEventListener('contextmenu', e => {
        const text = window.getSelection().toString().trim();
        if (text) {
            e.preventDefault();
            createMenu(e, text);
        }
    }, true);
})();