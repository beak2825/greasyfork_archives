// ==UserScript==
// @name         微博增强
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在微博搜索页面添加额外的搜索按钮：热门、关注人、文章。扩大热搜板块的宽度。
// @author       coccvo
// @match        https://s.weibo.com/*
// @match        https://weibo.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAFFQTFRF////++/w9Kgx8psQ7nl7AAAA8ZCS4yUo50ZK5TE17GxvxcXFoqKi6Vlc9rhV4iMn6mFjPj4+d3d35j1B9KuthoaG6enpJiYm98Nw98PE+MzNdfhZdQAAAHlJREFUeNqVj0kSwjAMBMfryI7j2FmB/z+UiHJxhr5IrZo5CP/wsM59xY85LttCAWAdalXnjSDPQIVVX6iMFJCY/P56RuEMxbOZs6yTbkkPaTPnFUKYYPjJ0OPopYdDyw1AE9wFTewkFPFmvXoxcTgQJceYE/OPL74BBt8EQ5m+Pm0AAAAASUVORK5CYII=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497165/%E5%BE%AE%E5%8D%9A%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/497165/%E5%BE%AE%E5%8D%9A%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 侧边栏宽度设置
    [document.getElementById('pl_right_side'),
     document.getElementById('hot-band-container'),
     document.querySelector('.wbpro-side-main.SideIndex_sideMain_3jrwf'),
     document.querySelector('.rightSide'),
     document.querySelector('._sideBox_14sov_2')
    ].filter(el => el).forEach(el => el.style.width = '380px');


    // 获取主导航栏元素
    var mainNav = document.querySelector('.m-main-nav');

    // 如果主导航栏存在，添加按钮
    if (mainNav) {
        // 创建按钮的容器
        var btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.flexDirection = 'column';
        btnContainer.style.gap = '1px';
        btnContainer.style.marginLeft = '-30px';

        // 创建按钮
        var buttons = [
            { text: '热门', params: '&xsort=hot' },
            { text: '关注', params: '&atten=1' },
            { text: '文章', params: '%20发布了头条文章&haslink=1' },
        ];

        // 获取搜索关键词
        var query = new URLSearchParams(window.location.search).get('q');

        // 遍历按钮配置并创建按钮元素
        buttons.forEach(function(button) {
            var btn = document.createElement('button');
            btn.textContent = button.text;
            btn.style.padding = '8px 10px';
            btn.style.fontSize = '15px';
            btn.style.cursor = 'pointer';
            btn.style.backgroundColor = '#FFFFFF00';

            // 鼠标悬停样式
            btn.addEventListener('mouseover', function() {
                btn.style.backgroundColor = '#eee';
            });
            btn.addEventListener('mouseout', function() {
                btn.style.backgroundColor = '#FFFFFF00';
            });

            // 设置按钮点击事件
            btn.addEventListener('click', function() {
                window.location.href = `https://s.weibo.com/weibo?q=${encodeURIComponent(query)}${button.params}`;
            });

            // 将按钮添加到容器中
            btnContainer.appendChild(btn);
        });

        // 将按钮容器添加到主导航栏中
        mainNav.appendChild(btnContainer);
    }

})();
