// ==UserScript==
// @name         Bangumi 条目多字幕组搜索
// @namespace    https://bgm.tv/
// @version      1.2
// @description  在 Bangumi 条目页创建按钮，点击后列出多个字幕组以供选择搜索资源，包括 Assrt 和 Anime 字幕论坛
// @author       dantaKing
// @match        https://bgm.tv/subject/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520757/Bangumi%20%E6%9D%A1%E7%9B%AE%E5%A4%9A%E5%AD%97%E5%B9%95%E7%BB%84%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/520757/Bangumi%20%E6%9D%A1%E7%9B%AE%E5%A4%9A%E5%AD%97%E5%B9%95%E7%BB%84%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取条目标题
    let title = document.querySelector('#headerSubject h1 a');
    if (!title) return; // 如果无法获取标题则终止脚本
    let searchQuery = title.textContent.trim();

    // 字幕组列表
    const subtitleSites = [
        { name: "Bangumi.moe", url: "https://bangumi.moe/search?keyword=" },
        { name: "ACG.RIP", url: "https://acg.rip/search?keyword=" },
        { name: "Mikan Project", url: "https://mikanime.tv/Search/?searchstr=" },
        { name: "动漫花园", url: "https://www.dmhy.org/topics/list?keyword=" },
        { name: "VCB-Studio", url: "https://vcb-s.com/archives/search?search=" },
        { name: "Nyaa.land", url: "https://nyaa.land/?f=0&c=0_0&q=" },
        { name: "Assrt 字幕组", url: "https://assrt.net/sub/?searchword=" }
    ];

    // 创建按钮
    let btn = document.createElement('button');
    btn.textContent = '搜索字幕组';
    btn.style.marginLeft = '10px';
    btn.style.padding = '5px 10px';
    btn.style.cursor = 'pointer';
    btn.style.backgroundColor = '#f09199';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';

    // 添加按钮到标题旁
    let header = document.querySelector('#headerSubject h1');
    if (header) header.appendChild(btn);

    // 创建菜单容器
    let menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.backgroundColor = '#fff';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    menu.style.padding = '10px';
    menu.style.display = 'none';
    menu.style.zIndex = '9999';

    // 插入列表项
    subtitleSites.forEach(site => {
        let link = document.createElement('a');
        link.href = site.url + encodeURIComponent(searchQuery);
        link.textContent = site.name;
        link.target = '_blank';
        link.style.display = 'block';
        link.style.marginBottom = '5px';
        link.style.color = '#007bff';
        link.style.textDecoration = 'none';
        link.addEventListener('mouseover', () => (link.style.textDecoration = 'underline'));
        link.addEventListener('mouseout', () => (link.style.textDecoration = 'none'));
        menu.appendChild(link);
    });

    // 按钮点击显示/隐藏菜单
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        menu.style.left = `${btn.offsetLeft}px`;
        menu.style.top = `${btn.offsetTop + btn.offsetHeight}px`;
    });

    // 点击页面其他区域关闭菜单
    document.body.addEventListener('click', () => {
        menu.style.display = 'none';
    });

    // 将菜单插入页面
    document.body.appendChild(menu);
})();
