// ==UserScript==
// @name         枫雪下载辅助
// @version      1.2
// @description  微博/Bing/知乎/t.cn自动跳转，城通自动填写密码下载（需安装客户端）
// @author       ashcarbide
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @match        *://link.zhihu.com/?target=*
// @match        *://t.cn/*
// @match        *://weibo.cn/sinaurl?*
// @match        *://*.ctfile.com/f/*
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.notification
// @license      GNU GPLv3
// @namespace    https://greasyfork.org/zh-CN/users/821
// @downloadURL https://update.greasyfork.org/scripts/532406/%E6%9E%AB%E9%9B%AA%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/532406/%E6%9E%AB%E9%9B%AA%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const handleBingRedirect = () => {
        const searchInput = document.querySelector('#sb_form_q');
        if (!searchInput) return;

        const targetURL = searchInput.value.trim();
        if (/^https?:\/\//i.test(targetURL)) {
            window.stop();
            window.location.href = targetURL;
        }
    };

    const handleZhihuRedirect = () => {
        const encodedURL = new URLSearchParams(window.location.search).get('target');
        if (!encodedURL) return;
        window.stop();
        window.location.replace(encodedURL);

    };

    const handleWeiboRedirect = () => {
        const encodedURL = new URLSearchParams(window.location.search).get('u');
        if (!encodedURL) return;
        window.stop();
        window.location.replace(encodedURL);
    };

    const handleShortLinkRedirect = () => {
        const createStatusMessage = (text) => {
            const div = document.createElement('div');
            div.style.cssText = 'padding:20px;font-size:18px;color:#666;';
            div.textContent = text;
            document.body.innerHTML = '';
            document.body.appendChild(div);
        };

        const targetElement = document.querySelector('.desc');
        if (targetElement?.textContent?.includes('http')) {
            createStatusMessage('🚀 检测到有效链接，正在安全跳转...');
            setTimeout(() => {
                window.location.replace(targetElement.textContent.trim());
            }, 800);
            return true;
        }
        return false;
    };


    const mainController = () => {
        const { hostname } = window.location;

        if (/bing\.com$/i.test(hostname)) {
            handleBingRedirect();
        } else if (/zhihu\.com$/i.test(hostname)) {
            handleZhihuRedirect();
        } else if (/t\.cn$/i.test(hostname)) {
            handleShortLinkRedirect();
        } else if (/weibo\.cn$/i.test(hostname)) {
            handleWeiboRedirect();
        } else if (/ctfile\.com$/i.test(hostname)) {
            setTimeout(() => {
                load_passcode();
                verify_passcode();
                setTimeout(() => {
                    file_down( 0, 1)
                }, 1000);
            }, 1000)
        }
    };


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mainController);
    } else {
        mainController();
    }


    GM.registerMenuCommand('显示当前URL信息', () => {
        GM.notification({
            text: `当前URL: ${window.location.href}`,
            title: '调试信息',
            timeout: 3000
        });
    });
})();