// ==UserScript==
// @name         悬停预览
// @version      3.9
// @description  悬停链接打开小窗并优化资源管理。重用打开的小窗以节省资源，同时保留其位置和大小。包含悬停时间和窗口大小设置，并改进了链接预取功能和资源管理效率。修复了鼠标移动到小窗时意外关闭的问题。支持 URL 路径和链接属性的排除。
// @author       hiisme
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/217852
// @downloadURL https://update.greasyfork.org/scripts/506336/%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/506336/%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let hoverTimeoutId = null;
    let prefetchTimeoutId = null;
    let popupWindow = null;
    let popupWindowRect = null;
    let isMouseOverPopup = false;

    // 读取设置或设置默认值
    const hoverDelay = GM_getValue('hoverDelay', 1200);
    const windowWidth = GM_getValue('windowWidth', 690);
    const windowHeight = GM_getValue('windowHeight', 400);

    // 注册菜单命令以更改设置
    GM_registerMenuCommand('设置悬停延迟时间 (毫秒)', () => {
        const delay = prompt('请输入悬停延迟时间（毫秒）:', hoverDelay);
        if (delay !== null) {
            const parsedDelay = parseInt(delay, 10) || 1200;
            GM_setValue('hoverDelay', parsedDelay);
            alert(`悬停延迟时间设置为 ${parsedDelay} 毫秒。`);
        }
    });

    GM_registerMenuCommand('设置小窗大小', () => {
        const width = prompt('请输入窗口宽度:', windowWidth);
        const height = prompt('请输入窗口高度:', windowHeight);
        if (width !== null && height !== null) {
            const parsedWidth = parseInt(width, 10) || 690;
            const parsedHeight = parseInt(height, 10) || 400;
            GM_setValue('windowWidth', parsedWidth);
            GM_setValue('windowHeight', parsedHeight);
            alert(`窗口大小设置为 ${parsedWidth}x${parsedHeight}。`);
        }
    });

    // 排除链接类型配置
    const excludedLinkPatterns = GM_getValue('excludedLinkPatterns', [
        '/logout', '/download', '/pdf', '/doc', '/xls', '/zip', '/rar', // 文件路径
        '.pdf', '.doc', '.xls', '.zip', '.rar', '.7z', // 文件扩展名
        'mailto:', 'tel:', '#', 'javascript:', 'data:', 'blob:', // 链接协议
        '/login', '/register', '/search', '/settings', '/update', '/change-password', // 登录、注册、搜索、设置、更新、修改密码
        '/terms', '/privacy', '/about', '/contact', '/sitemap', '/faq', // 网站条款、隐私政策、关于我们、联系、站点地图、常见问题
        '/checkout', '/cart', '/order', '/confirmation', // 购物车、结账、订单、确认
        '/profile', '/dashboard', '/user', '/admin', '/management', // 用户、管理
        '/help', '/support', '/feedback', '/report', '/complaint', // 帮助、支持、反馈、报告、投诉
        '/affiliate', '/sponsored', '/promo', '/ad', '/campaign', // 关联、赞助、促销、广告、活动
        '/newsletter', '/subscription', '/unsub', '/unsubscribe', // 新闻订阅、订阅、取消订阅
        '/api', '/ajax', '/webhook', '/endpoint', '/graphql', // API、AJAX、Webhooks、端点、GraphQL
        '/static', '/assets', '/images', '/videos', '/css', '/js', // 静态资源、图片、视频、CSS、JS
        '/terms-of-service', '/cookie-policy', '/legal', '/cookies', '/privacy-policy', // 服务条款、Cookie 政策、法律声明、隐私政策
        '/resources', '/docs', '/guides', '/manual', '/tutorial', // 资源、文档、指南、手册、教程
        '/event', '/calendar', '/schedule', '/announcement', '/webinar', // 事件、日历、计划、公告、网络研讨会
        '/login', '/auth', '/oauth', '/signin', '/signup', '/social', // 登录、认证、OAuth、登录、注册、社交登录
        '/search-results', '/search/?q=', '/search?query=', '/search/?query=', // 搜索结果
        '/file', '/files', '/upload', '/downloads', '/saved', // 文件上传、下载、保存
        '/docs/', '/downloads/', '/web/', '/api/', '/service/', // 文件、服务、API 目录
        '/wp-admin', '/wp-login', '/wp-content', '/wp-includes', // WordPress 特有路径
        '/wp-json', '/index.php', '/cgi-bin', '/phpmyadmin', // PHP 和管理路径
        '/admin/', '/admin.php', '/admin_panel', '/admin_area' // 管理面板
    ]);

    const isExcludedLink = (href) => {
        return excludedLinkPatterns.some(pattern => href.includes(pattern));
    };

    // 预取链接
    const prefetchLink = async (url) => {
        // 清除之前的预取链接
        clearTimeout(prefetchTimeoutId);

        // 删除之前同样链接的预取
        document.querySelectorAll(`.tm-prefetch[href="${url}"]`).forEach(link => link.remove());

        return new Promise((resolve) => {
            const linkElement = document.createElement('link');
            linkElement.rel = 'prefetch';
            linkElement.href = url;
            linkElement.className = 'tm-prefetch';
            linkElement.onload = () => resolve(true);
            linkElement.onerror = () => resolve(false);
            document.head.appendChild(linkElement);
        });
    };

    // 创建或更新小窗
    const createOrUpdatePopupWindow = async (url, x, y) => {
        if (popupWindow && !popupWindow.closed) {
            if (popupWindow.location.href !== url) {
                popupWindow.location.href = url;
            }
            popupWindow.moveTo(x, y);
        } else {
            popupWindow = window.open(url, 'popupWindow', `width=${windowWidth},height=${windowHeight},top=${y},left=${x},scrollbars=yes,resizable=yes`);
        }

        if (popupWindow) {
            await new Promise((resolve) => {
                popupWindow.addEventListener('load', () => {
                    // 计算小窗的位置和大小
                    popupWindowRect = {
                        left: popupWindow.screenX,
                        top: popupWindow.screenY,
                        right: popupWindow.screenX + popupWindow.innerWidth,
                        bottom: popupWindow.screenY + popupWindow.innerHeight
                    };
                    resolve();
                });
            });

            // 确保当鼠标进入小窗时不关闭它
            popupWindow.addEventListener('focus', () => {
                isMouseOverPopup = true;
            });

            popupWindow.addEventListener('mousemove', () => {
                isMouseOverPopup = true;
            });
        }
    };

    // 关闭小窗
    const closePopupWindow = () => {
        if (popupWindow && !popupWindow.closed) {
            // 延迟关闭以确认鼠标真的在外面
            setTimeout(() => {
                if (!isMouseOverPopup) {
                    popupWindow.close();
                    popupWindow = null;
                    popupWindowRect = null;
                }
            }, 200); // 延迟时间，确保鼠标不会快速返回
        }
    };

    // 防抖动函数
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    // 节流函数
    const throttle = (fn, limit) => {
        let lastFn, lastRan;
        return (...args) => {
            if (!lastRan) {
                fn.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFn);
                lastFn = setTimeout(() => {
                    if (Date.now() - lastRan >= limit) {
                        fn.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // 处理鼠标悬停事件
    const handleMouseOver = async (event) => {
        // 检查事件是否发生在主窗口中
        if (window.name === 'popupWindow') return; // 防止在小窗中触发悬停行为

        const linkElement = event.target.closest('a');
        if (linkElement && linkElement.href && !isExcludedLink(linkElement.href)) {
            clearTimeout(hoverTimeoutId);
            clearTimeout(prefetchTimeoutId);

            // 1000ms 后预取链接
            prefetchTimeoutId = setTimeout(() => prefetchLink(linkElement.href), 1000);

            hoverTimeoutId = setTimeout(async () => {
                const { clientX: x, clientY: y } = event;
                await createOrUpdatePopupWindow(linkElement.href, x + 10, y + 10);
            }, hoverDelay);
        }
    };

    // 处理鼠标移出事件
    const handleMouseOut = (event) => {
        clearTimeout(hoverTimeoutId);
        clearTimeout(prefetchTimeoutId);

        // 移除预取链接
        document.querySelectorAll('.tm-prefetch').forEach(link => link.remove());

        if (popupWindow && !popupWindow.closed && popupWindowRect) {
            const { clientX: x, clientY: y } = event;
            const outsidePopupWindow = (
                x < popupWindowRect.left ||
                x > popupWindowRect.right ||
                y < popupWindowRect.top ||
                y > popupWindowRect.bottom
            );

            if (outsidePopupWindow) {
                isMouseOverPopup = false; // 更新状态为 false
                closePopupWindow();
            }
        }
    };

    // 处理窗口聚焦事件
    const handleWindowFocus = () => {
        closePopupWindow();
    };

    // 处理滚动和点击事件
    const handleDocumentScrollOrClick = throttle(closePopupWindow, 100);

    // 清理资源和事件监听器
    const cleanup = () => {
        clearTimeout(hoverTimeoutId);
        clearTimeout(prefetchTimeoutId);

        document.querySelectorAll('.tm-prefetch').forEach(link => link.remove());

        document.removeEventListener('mouseover', handleMouseOver, true);
        document.removeEventListener('mouseout', handleMouseOut, true);
        window.removeEventListener('focus', handleWindowFocus);
        document.removeEventListener('scroll', handleDocumentScrollOrClick, true);
        document.removeEventListener('click', handleDocumentScrollOrClick, true);

        closePopupWindow();
    };

    // 注册事件监听器
    const addEventListeners = () => {
        document.addEventListener('mouseover', handleMouseOver, { capture: true, passive: true });
        document.addEventListener('mouseout', handleMouseOut, { capture: true, passive: true });
        window.addEventListener('focus', handleWindowFocus);
        document.addEventListener('scroll', handleDocumentScrollOrClick, { capture: true, passive: true });
        document.addEventListener('click', handleDocumentScrollOrClick, true);
    };

    // 页面卸载时清理
    window.addEventListener('beforeunload', cleanup);

    // 初始事件监听器
    addEventListeners();

})();
