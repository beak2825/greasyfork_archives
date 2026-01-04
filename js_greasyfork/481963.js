// ==UserScript==
// @name          残月vip视频解析
// @namespace    http://tampermonkey.net/
// @version        0.0.3
// @description    残月vip视频解析, 外嵌解析，体验腾讯、爱奇艺、优酷等vip视频网站
// @icon           https://gitee.com/Bsutss/gitee.vip/raw/master/vip.jpg
// @author        1771245847
// @match        *://*.v.qq.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @grant        none
// @charset	 UTF-8
// @license      GPL License
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481963/%E6%AE%8B%E6%9C%88vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/481963/%E6%AE%8B%E6%9C%88vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

/*
* 

本脚本完全由本人原创，禁止抄袭全部代码, 如发现有人抄袭，欢迎举报，谢谢

请勿用于任何商业用途，仅供学习交流

*/

(function() {
    'use strict';

    // 定义CSS变量
    const style = document.createElement('style');
    style.innerHTML = `
    .video-parser-container {
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        z-index: 1000;
        background: var(--container-bg, rgba(0, 0, 0, 0.8));
        padding: 10px 15px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid var(--container-border, rgba(255, 255, 255, 0.1));
    }
    .video-parser-button {
        padding: 12px 24px;
        background: var(--button-bg-color, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
        color: var(--button-text-color, #fff);
        border: var(--button-border, none);
        border-radius: var(--button-border-radius, 8px);
        cursor: pointer;
        font-size: var(--button-font-size, 16px);
        font-weight: 600;
        font-family: var(--button-font-family, 'Microsoft YaHei', Arial, sans-serif);
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: hidden;
    }
    .video-parser-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }
    .video-parser-button:hover {
        background: var(--button-hover-bg-color, linear-gradient(135deg, #764ba2 0%, #667eea 100%));
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .video-parser-button:hover::before {
        left: 100%;
    }
    .video-parser-button:active {
        transform: translateY(0);
    }
    .video-parser-dropdown {
        margin-left: 12px;
    }
    .video-parser-dropdown select {
        padding: 12px 20px;
        background: var(--dropdown-bg-color, linear-gradient(135deg, #2c3e50 0%, #3498db 100%));
        color: var(--dropdown-text-color, #fff);
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        opacity: 1;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23ffffff' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 12px;
        padding-right: 40px;
    }
    .video-parser-dropdown select:hover {
        background: var(--dropdown-hover-bg-color, linear-gradient(135deg, #3498db 0%, #2c3e50 100%));
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .video-parser-dropdown select:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--dropdown-focus-color, rgba(52, 152, 219, 0.5));
    }
    `;
    document.head.appendChild(style);

    // 创建一个容器元素
    const container = document.createElement('div');
    container.className = 'video-parser-container';

    // 创建一个按钮元素
    const button = document.createElement('button');
    button.innerText = '解析播放';
    button.className = 'video-parser-button';

    // 定义不同网站的CSS变量
    const cssVariables = {
        'v.qq.com': {
            '--container-bg': 'rgba(0, 123, 255, 0.1)',
            '--container-border': 'rgba(0, 123, 255, 0.3)',
            '--button-bg-color': 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
            '--button-text-color': '#fff',
            '--button-border-radius': '10px',
            '--button-font-size': '16px',
            '--button-hover-bg-color': 'linear-gradient(135deg, #0056b3 0%, #007bff 100%)',
            '--dropdown-bg-color': 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)',
            '--dropdown-text-color': '#fff',
            '--dropdown-hover-bg-color': 'linear-gradient(135deg, #003d82 0%, #0056b3 100%)',
            '--dropdown-focus-color': 'rgba(0, 123, 255, 0.5)'
        },
        'iqiyi.com': {
            '--container-bg': 'rgba(40, 167, 69, 0.1)',
            '--container-border': 'rgba(40, 167, 69, 0.3)',
            '--button-bg-color': 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
            '--button-text-color': '#fff',
            '--button-border-radius': '6px',
            '--button-font-size': '16px',
            '--button-hover-bg-color': 'linear-gradient(135deg, #1e7e34 0%, #28a745 100%)',
            '--dropdown-bg-color': 'linear-gradient(135deg, #1e7e34 0%, #145a21 100%)',
            '--dropdown-text-color': '#fff',
            '--dropdown-hover-bg-color': 'linear-gradient(135deg, #145a21 0%, #1e7e34 100%)',
            '--dropdown-focus-color': 'rgba(40, 167, 69, 0.5)'
        },
        'youku.com': {
            '--container-bg': 'rgba(128, 0, 128, 0.1)',
            '--container-border': 'rgba(128, 0, 128, 0.3)',
            '--button-bg-color': 'linear-gradient(135deg, #800080 0%, #4b0082 100%)',
            '--button-text-color': '#fff',
            '--button-border-radius': '8px',
            '--button-font-size': '16px',
            '--button-hover-bg-color': 'linear-gradient(135deg, #4b0082 0%, #800080 100%)',
            '--dropdown-bg-color': 'linear-gradient(135deg, #4b0082 0%, #2d004d 100%)',
            '--dropdown-text-color': '#fff',
            '--dropdown-hover-bg-color': 'linear-gradient(135deg, #2d004d 0%, #4b0082 100%)',
            '--dropdown-focus-color': 'rgba(128, 0, 128, 0.5)'
        }
    };

    // 应用相应的CSS变量
    const hostname = window.location.hostname;
    let siteVars = cssVariables[hostname];
    
    // 如果没有匹配到特定网站，使用默认样式
    if (!siteVars) {
        siteVars = {
            '--container-bg': 'rgba(0, 0, 0, 0.85)',
            '--container-border': 'rgba(255, 255, 255, 0.15)',
            '--button-bg-color': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '--button-text-color': '#fff',
            '--button-border-radius': '8px',
            '--button-font-size': '16px',
            '--button-hover-bg-color': 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            '--dropdown-bg-color': 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            '--dropdown-text-color': '#fff',
            '--dropdown-hover-bg-color': 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
            '--dropdown-focus-color': 'rgba(52, 152, 219, 0.5)'
        };
    }

    for (const [key, value] of Object.entries(siteVars)) {
        container.style.setProperty(key, value);
    }

    // 定义解析接口列表
    const parseInterfaces = [
        { name: '解析线路1', url: 'https://jx.xymp4.cc/?url=' }, 
        { name: '解析线路2', url: 'https://im1907.top/?jx=' },
        { name: '解析线路3', url: 'https://jx.xmflv.cc/?url=' }
    ];

    // 创建下拉菜单
    const dropdown = document.createElement('select');
    dropdown.className = 'video-parser-dropdown';

    parseInterfaces.forEach((interfaceItem, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = interfaceItem.name;
        dropdown.appendChild(option);
    });

    // 点击按钮时触发的事件
    button.addEventListener('click', () => {
        const selectedIndex = dropdown.value;
        const selectedInterface = parseInterfaces[selectedIndex];
        const currentUrl = window.location.href;

        if (!selectedInterface.url) {
            alert('当前选择的解析接口URL为空，请联系开发者更新');
            return;
        }

        const parseUrl = selectedInterface.url + encodeURIComponent(currentUrl);
        window.open(parseUrl, '_blank');
    });

    // 将按钮和下拉菜单添加到容器中
    container.appendChild(button);
    container.appendChild(dropdown);

    // 将容器添加到页面中
    document.body.appendChild(container);
})();