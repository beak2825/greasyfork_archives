// ==UserScript==
// @name         搜索引擎快捷跳转
// @namespace    https://greasyfork.org/users/812563
// @icon         https://www.google.com/favicon.ico
// @version      1.1.0
// @description  在百度和谷歌搜索结果页的搜索按钮旁边添加隐藏的切换按钮，鼠标悬停在搜索按钮上时显示，方便在两个搜索引擎之间快速切换。
// @author       chilinha
// @match        *://www.baidu.com/s?*
// @match        *://www.google.com/search?*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520999/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520999/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const baiduButtonSelector = '#chat-submit-button';
    const googleButtonSelector = '.HZVG1b.Tg7LZd';
    let searchButton = document.querySelector(baiduButtonSelector) || document.querySelector(googleButtonSelector);
    if (!searchButton) return;
    let q = '';
    let input = document.createElement('input');
    input.style.display = 'none';
    input.style.position = 'absolute';
    input.style.marginLeft = '10px';
    let hideTimeout;
    searchButton.addEventListener('mouseenter', function(event) {
        const rect = searchButton.getBoundingClientRect();
        const x = event.clientX - rect.left;
        if (window.location.hostname === 'www.google.com') {
            if (rect.width - x <= 44) {
                setupSwitchButton('https://www.baidu.com/s?wd=', '百度一下', '#4e6ef2');
            }
        } else if (window.location.hostname === 'www.baidu.com') {
            setupSwitchButton('https://www.google.com/search?q=', 'Google', '#4285f4');
        }
    });
    function setupSwitchButton(baseUrl, buttonText, backgroundColor) {
        let searchInput = document.querySelector(window.location.hostname === 'www.baidu.com' ? 'input[name="wd"]' : 'input[name="q"]');
        if (searchInput) {
            let searchQuery = searchInput.value;
            q = baseUrl + encodeURIComponent(searchQuery);
            input.setAttribute('value', buttonText);
            input.setAttribute('type', 'button');
            input.style.color = 'white';
            input.style.background = backgroundColor;
            input.style.width = '110px';
            input.style.height = searchButton.offsetHeight + 'px';
            input.style.border = '1px solid';
            input.style.borderRadius = '30px';
            input.style.cursor = 'pointer';
            input.style.display = 'inline';
        }
        input.style.top = searchButton.offsetTop + 'px';
        input.style.left = (searchButton.offsetLeft + searchButton.offsetWidth) + 'px';
        clearTimeout(hideTimeout);
    }
    searchButton.addEventListener('mouseleave', function() {
        hideTimeout = setTimeout(() => {
            input.style.display = 'none';
        }, 500);
    });
    input.addEventListener('mouseenter', function() {
        clearTimeout(hideTimeout);
    });
    input.addEventListener('mouseleave', function() {
        hideTimeout = setTimeout(() => {
            input.style.display = 'none';
        }, 500);
    });
    input.addEventListener('click', function() {
        window.open(q);
    });
    searchButton.parentNode.appendChild(input);
})();