// ==UserScript==
// @name         linux.do 外部链接警告
// @version      1.0
// @description  烦人的外链跳转警告
// @author       endercat
// @match        https://linux.do/*
// @namespace https://greasyfork.org/users/1184905
// @downloadURL https://update.greasyfork.org/scripts/496808/linuxdo%20%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/496808/linuxdo%20%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断 URL 是否为外部链接的函数
    function isExternal(url) {
        const domain = (new URL(url)).hostname;
        return !domain.endsWith('linux.do');
    }

    // 处理链接点击事件的函数
    function handleLinkClick(event) {
        const target = event.currentTarget;
        if (isExternal(target.href)) {
            event.preventDefault();
            const userConfirmed = confirm("您即将离开 linux.do\n访问该链接，你将离开linux.do，网站安全性未知, 请注意您的账号和财产安全");
            if (userConfirmed) {
                window.open(target.href, '_blank');
            }
        }
    }

    // 为所有外部链接添加事件监听器的函数
    function addLinkListeners() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            if (isExternal(link.href)) {
                link.addEventListener('click', handleLinkClick);
            }
        });
    }

    // 初始化时运行
    addLinkListeners();

    // 使用 MutationObserver 监视新添加的链接
    const observer = new MutationObserver(addLinkListeners);
    observer.observe(document.body, { childList: true, subtree: true });

})();
