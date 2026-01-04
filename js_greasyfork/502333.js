// ==UserScript==
// @name         切换登录系统主页
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Display a list of names from JSON and open URLs on click
// @author       Erick
// @match        https://passport.eteams.cn/*
// @grant        none
// @license Erick
// @downloadURL https://update.greasyfork.org/scripts/502333/%E5%88%87%E6%8D%A2%E7%99%BB%E5%BD%95%E7%B3%BB%E7%BB%9F%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/502333/%E5%88%87%E6%8D%A2%E7%99%BB%E5%BD%95%E7%B3%BB%E7%BB%9F%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const JSON_URL = `[
        {
            "name": "云端E10",
            "url": "https://weapp.eteams.cn"
        },
        {
            "name": "昌吉州文旅投",
            "url": "http://117.191.53.142:20600"
        },
        {
            "name": "鲲鹏本地demo2",
            "url": "http://39.104.75.218:9111/customlogin/demo2"
        },
        {
            "name": "仓颉科技",
            "url": "http://101.43.174.72:6041"
        }
    ]`;

    const data = JSON.parse(JSON_URL);
    const COLOR_LIST = [];

    // Function to generate a random color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        for(let item of COLOR_LIST){
            if(color === item){
                // 已经存在了相同的颜色
                getRandomColor();
            }
        }
        COLOR_LIST.push(color);
        return color;
    }

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '切换系统';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '10000';
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.backgroundColor = '#007BFF';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

    document.body.appendChild(toggleButton);

    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.right = '20px';
    container.style.width = '25%';
    container.style.height = '70%';
    container.style.overflowY = 'auto';
    container.style.border = '1px solid #ccc';
    container.style.backgroundColor = '#fff';
    container.style.zIndex = '9999';
    container.style.padding = '10px';
    container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    container.style.transform = 'translateY(-50%)'; // 垂直居中
    container.style.display = 'none'; // 初始隐藏

    // Create list
    const list = document.createElement('ul');
    list.style.listStyleType = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.style.display = 'flex';
        listItem.style.alignItems = 'center';
        listItem.style.padding = '10px 0';
        listItem.style.borderBottom = '1px solid #eee';
        listItem.style.cursor = 'pointer';
        listItem.style.minHeight = '50px';
        listItem.title = item.url; // 鼠标悬停提示URL

        const icon = document.createElement('span');
        icon.style.display = 'inline-block';
        icon.style.width = '30px';
        icon.style.height = '30px';
        icon.style.marginRight = '10px';
        icon.style.fontWeight = 'bold';
        icon.style.color = '#fff';
        icon.style.backgroundColor = getRandomColor(); // 随机颜色
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.borderRadius = '4px'; // 方形图标
        icon.textContent = item.name.charAt(0); // 文字图标

        const name = document.createElement('span');
        name.textContent = item.name;

        listItem.appendChild(icon);
        listItem.appendChild(name);

        listItem.addEventListener('click', () => {
            window.location.href = item.url;
        });

        list.appendChild(listItem);
    });

    container.appendChild(list);
    document.body.appendChild(container);

    // Toggle list visibility on button click
    toggleButton.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
})();
