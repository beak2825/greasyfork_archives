// ==UserScript==
// @name         微信公众平台获取token和cookie
// @namespace    https://www.iowen.cn/
// @version      1.0
// @description  获取微信公众平台的token和cookie，并添加复制按钮到页面上。
// @author       iowen
// @match        *://mp.weixin.qq.com/*
// @exclude      *://mp.weixin.qq.com/
// @exclude      *://mp.weixin.qq.com/s*
// @exclude      *://mp.weixin.qq.com/cgi-bin/appmsg?t=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weixin.qq.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @connect      mp.weixin.qq.com
// @downloadURL https://update.greasyfork.org/scripts/504049/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E8%8E%B7%E5%8F%96token%E5%92%8Ccookie.user.js
// @updateURL https://update.greasyfork.org/scripts/504049/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E8%8E%B7%E5%8F%96token%E5%92%8Ccookie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let toastInstance = null;

    // 获取token
    function getToken() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('token');
    }

    // 提取 Cookies 的通用函数
    function extractCookies(headersArray, headerPrefix) {
        const cookies = {};
        headersArray.forEach(header => {
            if (header.toLowerCase().startsWith(headerPrefix)) {
                const splitHeader = header.split(':');
                if (splitHeader.length > 1) { // 检查是否有足够的元素
                    const cookiePair = splitHeader[1].trim().split(';')[0];
                    const [cookieName, cookieValue] = cookiePair.split('=');
                    cookies[cookieName.trim()] = cookieValue.trim();
                }
            }
        });
        return cookies;
    }

    // 发送请求以获取 Cookie
    function fetchCookies() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: window.location.href,
                onload: function(response) {
                    // 检查响应状态码
                    if (response.status >= 200 && response.status < 300) {
                        const headersArray = response.responseHeaders.split('\n');

                        // 提取 Set-Cookie 和 tm-setcookiedhdg-n 头部
                        const setCookieCookies = extractCookies(headersArray, 'set-cookie:');
                        const tmSetCookieCookies = extractCookies(headersArray, 'tm-setcookiedhdg-');

                        // 合并所有 Cookies
                        const allCookies = { ...setCookieCookies, ...tmSetCookieCookies };

                        // 检查是否提取到了 Cookies
                        if (Object.keys(allCookies).length > 0) {
                            resolve(allCookies);
                        } else {
                            reject('无法获取 Set-Cookie 和 tm-setcookiedhdg-n 头信息！');
                        }
                    } else {
                        reject(`请求失败：响应状态 ${response.status}`);
                    }
                },
                onerror: function(error) {
                    reject('请求失败：' + error);
                }
            });
        });
    }

    // 复制token到剪贴板
    function copyToken() {
        const token = getToken();
        if (token) {
            GM_setClipboard(token);
            showToast("Token 已复制！", "success");
        } else {
            showToast("无法获取 Token！", "error");
        }
    }

    // 复制cookie到剪贴板
    function copyCookie() {
        showToast("查询 Cookie 中 ...", "warning");
        fetchCookies().then(cookies => {
            //判断cookies中有没有 bizuin、 slave_sid、 slave_user
            if (cookies.data_bizuin && cookies.slave_sid && cookies.slave_user) {
                const cookieString = Object.entries(cookies)
                .map(([name, value]) => `${name}=${value}`)
                .join('; ');
                GM_setClipboard(cookieString);
                showToast("Cookie 已复制！", "success");
            } else {
                showToast("无法获取所有 Cookie 信息！", "error");
            }
        }).catch(error => {
            showToast(error, "error");
        });
    }

    // 创建提示消息（Toast）
    function showToast(message, type="info") {
        if (toastInstance) {
            toastInstance.remove();
        }

        // 创建新的 toast
        const toast = document.createElement('div');

        const styles = {
            position: 'fixed',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            padding: '5px 50px',
            borderRadius: '0 0 5px 5px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: '9999',
            transition: 'opacity 0.5s ease',
        };
        // 根据 type 设置不同的背景颜色
        switch (type) {
            case 'success':
                styles.backgroundColor = '#4CAF50'; // 绿色
                break;
            case 'error':
                styles.backgroundColor = '#F44336'; // 红色
                break;
            case 'warning':
                styles.backgroundColor = '#FF9800'; // 橙色
                break;
            default:
                styles.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 默认灰黑色
        }
        Object.assign(toast.style, styles);

        toast.innerText = message;

        // 记录当前的 toast 实例
        toastInstance = toast;

        document.body.appendChild(toast);

        // 显示3秒后淡出并移除
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
                toastInstance = null;
            }, 500);
        }, 3000);
    }

    // 创建按钮元素
    function createButton(text, onClick) {
        const button = document.createElement('button');

        const styles = {
            marginRight: '5px',
            padding: '4px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
        };
        Object.assign(button.style, styles);

        button.innerText = text;
        button.addEventListener('click', onClick);
        return button;
    }

    // 创建按钮容器
    function createButtonContainer() {
        const container = document.createElement('div');

        const styles = {
            marginTop: '10px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        };
        Object.assign(container.style, styles);

        return container;
    }

    // 在 h1.weui-desktop-logo 内插入按钮
    function addButtons() {
        const appBanElement = document.querySelector('h1.weui-desktop-logo');
        if (appBanElement) {
            const buttonContainer = createButtonContainer();

            const tokenButton = createButton('复制 Token', copyToken);
            const cookieButton = createButton('复制 Cookie', copyCookie);

            buttonContainer.appendChild(tokenButton);
            buttonContainer.appendChild(cookieButton);

            appBanElement.appendChild(buttonContainer);
        }
    }

    // 页面加载完成后运行
    window.addEventListener('load', addButtons);

})();
