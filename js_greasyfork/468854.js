// ==UserScript==
// @name         Advertising Plus
// @namespace    http://your-namespace-here
// @version      2.0
// @description  Disable 301 redirects on web pages and block potential ads. 使用HttpCanary(移动端)抓包发现广告状态码为301, 故以此为基础一步步优化代码.如防误触, 黑白名单,长按加入黑名单等, 移动端火狐和via浏览器
// @match        *://www.脚本生效的网站.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468854/Advertising%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/468854/Advertising%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义允许访问的小说网站域名白名单
    var allowedDomains = [
        'https://www.脚本生效的网站.com'
    ];

    // 从 LocalStorage 中加载已保存的黑名单列表
    var blockedDomains = localStorage.getItem('blockedDomains');
    if (blockedDomains) {
        blockedDomains = JSON.parse(blockedDomains);
    } else {
        blockedDomains = []; // 默认为空列表
    }

    // 检查当前域名是否在允许访问的域名白名单中
    var currentDomain = window.location.hostname;
    if (isDomainAllowed(currentDomain)) {
        // 拦截所有请求
        window.addEventListener('beforeunload', function() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/', false);
            xhr.send(null);

            var url = xhr.responseURL;
            var domain = getDomainFromUrl(url);

            // 检查请求的域名是否在白名单中
            if (!isDomainAllowed(domain)) {
                // 在这里可以选择显示一个提示或执行其他自定义操作
                // 阻止301重定向
                window.stop();
            }
        });

        // 遍历页面上的所有链接和图片元素
        var links = document.getElementsByTagName('a');
        var images = document.getElementsByTagName('img');

        // 屏蔽链接中包含被列入黑名单的域名的广告
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (isPotentialAd(link.href) && !isDomainAllowed(getDomainFromUrl(link.href))) {
                link.addEventListener('click', function(event) {
                    if (event.detail === 1) {
                        event.preventDefault();
                        event.stopPropagation();
                        var domain = getDomainFromUrl(this.href);
                                                if (confirm('是否将 ' + domain + ' 标记为广告并加入黑名单？')) {
                            addToBlockedDomains(domain);
                            // 在这里可以选择显示一个成功提示或执行其他自定义操作
                        }
                    }
                });
            }
        }

        // 屏蔽图片中包含被列入黑名单的域名的广告
        for (var j = 0; j < images.length; j++) {
            var image = images[j];
            if (isPotentialAd(image.src) && !isDomainAllowed(getDomainFromUrl(image.src))) {
                var mouseDownTime = 0;
                var mouseUpTime = 0;
                image.addEventListener('mousedown', function(event) {
                    mouseDownTime = Date.now();
                });
                image.addEventListener('mouseup', function(event) {
                    mouseUpTime = Date.now();
                    var clickDuration = mouseUpTime - mouseDownTime;

                    if (clickDuration < 500) { // 假设点击持续时间少于500毫秒为误触
                        event.preventDefault();
                        event.stopPropagation();
                        var domain = getDomainFromUrl(this.src);
                        if (confirm('是否将 ' + domain + ' 标记为广告并加入黑名单？')) {
                            addToBlockedDomains(domain);
                            // 在这里可以选择显示一个成功提示或执行其他自定义操作
                        }
                    }
                });
            }
        }
    }
    
    // 将域名加入到黑名单
    function addToBlockedDomains(domain) {
        if (!blockedDomains.includes(domain)) {
            blockedDomains.push(domain);
            // 保存更新后的黑名单到 LocalStorage
            localStorage.setItem('blockedDomains', JSON.stringify(blockedDomains));
        }
    }

    // 检查域名是否在白名单中
    function isDomainAllowed(domain) {
        for (var i = 0; i < allowedDomains.length; i++) {
            if (matchWildcard(allowedDomains[i], domain)) {
                return true;
            }
        }
        return false;
    }

    // 检查链接的域名是否为潜在广告
    function isPotentialAd(url) {
        var domain = getDomainFromUrl(url);
        return domain !== '' && !isDomainAllowed(domain);
    }

    // 提取链接的域名
    function getDomainFromUrl(url) {
        var anchor = document.createElement('a');
        anchor.href = url;
        return anchor.hostname;
    }

    // 通配符匹配函数..
    function matchWildcard(pattern, string) {
        var regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return regex.test(string);
    }

})();