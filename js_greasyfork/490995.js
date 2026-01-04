// ==UserScript==
// @name         搜索引擎一键切换
// @version      0.1
// @description  在搜索引擎页面添加 Google、Bing、Baidu、Github 搜索按钮，方便切换搜索引擎
// @author       Hooper
// @license      MIT
// @match        https://www.google.com/search?*
// @match        https://www.baidu.com/s?*
// @match        https://*.bing.com/search?*
// @match        https://github.com/search?*
// @grant        none
// @namespace https://greasyfork.org/users/744849
// @downloadURL https://update.greasyfork.org/scripts/490995/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/490995/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%80%E9%94%AE%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    // 获取搜索关键词
    const keyword = getKeyword();

    // 创建浮窗
    const div = document.createElement('div');
    div.innerHTML = `
    <span><a href="${getGoogleUrl(keyword)}">Google</a></span>
    <span><a href="${getBingUrl(keyword)}">Bing</a></span>
    <span><a href="${getBaiduUrl(keyword)}">Baidu</a></span>
    <span><a href="${getGithubUrl(keyword)}">Github</a></span>
`;
    div.id = "search-panel"; // 添加ID以便于CSS选择器引用
    div.style.position = 'fixed';
    div.style.top = '300px';
    div.style.left = '10px';
    div.style.padding = '4px';
    div.style.backgroundColor = '#fff';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '4px';
    div.style.zIndex = '9999';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'; // 增加阴影效果
    div.style.color = '#333';

    // 鼠标悬停样式
    const links = div.querySelectorAll('a'); // 获取所有的链接元素

    // 实体化按钮样式（仅针对示例，实际应用可能还需要更多定制）
    links.forEach(link => {
        link.style.display = 'inline-block';
        link.style.textDecoration = 'none'; // 去除下划线
        link.style.padding = '2px 4px';
        link.style.borderRadius = '4px';
        link.style.backgroundColor = 'transparent';
        link.style.marginTop = '8px';
        link.style.borderWidth = '1px';
        link.style.borderColor = '#ccc';

        link.addEventListener('mouseover', function () {
            this.style.backgroundColor = '#f5f5f5'; // 鼠标悬停时添加背景色
            this.style.borderColor = '#adadad'; // 边框颜色变化
        });

        link.addEventListener('mouseout', function () {
            this.style.backgroundColor = 'transparent'; // 恢复背景色
            this.style.borderColor = '#ccc'; // 边框颜色恢复
        });
    });

    let initialMousePosition = { x: 0, y: 0 };

    let isDragging = false;
    // Add a 'mousedown' event listener to the div to start dragging
    div.addEventListener('mousedown', function (event) {
        // Record the initial mouse position
        console.log('mousedown');
        console.log('event.clientX', event.clientX);
        initialMousePosition.x = event.clientX;
        initialMousePosition.y = event.clientY;
        isDragging = true;
        event.preventDefault(); // Prevent text selection while dragging
    });
    document.addEventListener('mousemove', function (event) {
        if (isDragging) {
            // Calculate the new position of the div
            var dx = event.clientX - initialMousePosition.x;
            var dy = event.clientY - initialMousePosition.y;
            var top = parseInt(div.style.top, 10) + dy;
            var left = parseInt(div.style.left, 10) + dx;

            // Update the div's position
            div.style.top = `${top}px`;
            div.style.left = `${left}px`;

            // Update the initial mouse position
            initialMousePosition.x = event.clientX;
            initialMousePosition.y = event.clientY;
        }
    });
    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    document.body.appendChild(div);
    // 获取 Google 搜索链接
    function getGoogleUrl(keyword) {
        return `https://www.google.com/search?q=${keyword}`;
    }

    // 获取百度搜索链接
    function getBaiduUrl(keyword) {
        return `https://www.baidu.com/s?wd=${keyword}`;
    }

    // 获取 Bing 搜索链接
    function getBingUrl(keyword) {
        return `https://cn.bing.com/search?q=${keyword}`;
    }

    // 获取 Github 搜索链接
    function getGithubUrl(keyword) {
        return `https://github.com/search?q=${keyword}`;
    }

    // 获取搜索关键词
    function getKeyword() {
        const url = new URL(location.href);
        const params = new URLSearchParams(url.search);
        return params.get('q') || params.get('wd') || ''
    }
})();
