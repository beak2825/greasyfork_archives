// ==UserScript==
// @name         PUBG网页兑换代码优化
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  使PUBG网页兑换代码错误不会出现倒计时，并添加详细信息
// @author       L
// @icon         https://wstatic-prod.pubg.com/web/live/static/favicons/apple-icon-57x57.png
// @match        https://pubg.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513136/PUBG%E7%BD%91%E9%A1%B5%E5%85%91%E6%8D%A2%E4%BB%A3%E7%A0%81%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/513136/PUBG%E7%BD%91%E9%A1%B5%E5%85%91%E6%8D%A2%E4%BB%A3%E7%A0%81%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            if (args[0].includes('https://api-foc.krafton.com/redeem/v3/register') && args[1]?.method === 'POST') {
                return originalFetch(...args).then(response => {
                    if (response.status !== 200) {
                        return response.json().then(data => {
                            const errorCode = data.code || '未知错误';
                            const errorMessage = data.message || '发生未知错误';

                            const reason = getErrorReason(errorCode);

                            modifyAlertContent(`兑换失败，${reason}。原始信息: ${errorCode}; ${errorMessage}`);

                            return response;
                        });
                    }
                    return response;
                });
            }
            return originalFetch(...args);
        };

        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalXhrOpen.apply(this, arguments);
        };

        const originalXhrSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            const xhr = this;
            const checkResponse = function() {
                if (xhr.readyState === 4 && xhr.status !== 200) {
                    const responseData = JSON.parse(xhr.responseText);
                    const errorCode = responseData.code || '未知错误';
                    const errorMessage = responseData.message || '发生未知错误';

                    const reason = getErrorReason(errorCode);

                    Object.defineProperty(xhr, 'status', { value: 200 });
                    Object.defineProperty(xhr, 'responseText', { value: JSON.stringify({ message: '发生错误，请查看详细信息' }) });

                    modifyAlertContent(`${reason}! 原始信息: ${errorCode}; ${errorMessage}`);
                }
            };

            this.addEventListener('readystatechange', checkResponse);
            return originalXhrSend.apply(this, arguments);
        };
    });

    function getErrorReason(errorCode) {
        switch (errorCode) {
            case 'INVALID_CODE':
                return '无效兑换码';
            case 'EXPIRED':
                return '代码已过期';
            case 'LIMIT_OVER':
                return '超过兑换次数';
            case 'LIMIT_OVER_EXCLUSIVE':
                return '超过兑换限制';
            case 'ALREADY_ACTIVATED':
                return '代码已被使用';
            case 'SERVER_NETWORK_ERROR':
                return '服务器网络错误';
            case 'INVALID_USER':
                return '玩家信息无效';
            case 'UNAUTHENTICATED_CONSOLE':
                return '请先登录账号';
            case 'JWT_INVALID_SIGNATURE':
                return '签名无效，请重新登录';
            case 'JWT_INVALID_TOKEN':
                return '令牌无效，请重新登录';
            case 'JWT_EXPIRED_TOKEN':
                return '登录已过期，请重新登录';
            case 'JWT_UNSUPPORTED_TOKEN':
                return '不支持的令牌类型';
            case 'JWT_ARGUMENT_EXCEPTION':
                return '参数错误，请重试';
            case 'JWT_TOKEN_NOT_FOUND':
                return '未找到令牌，请重新登录';
            case 'REDEEMCODE_ERROR':
                return '兑换失败，请检查兑换码';
            case 'BEFORE_VALID_FROM':
                return '未到兑换开始时间';
            case 'BEFORE_START_TIME':
                return '未到兑换开始时间';
            case 'BLOCKED':
                return '已被封禁';
            case 'UNUSABLE_PLATFORM':
                return '当前平台不支持此兑换码';
            case 'UNKNOWN_ERROR':
                return '发生未知错误';
            case 'PASS_ALREADY_PREMIUM':
                return '您已拥有高级版通行证';
            case 'PASS_INVALID_PERIOD':
                return '通行证时间段无效';
            default:
                return '未知错误';
        }
    }

    function modifyAlertContent(message) {
        const alertModal = document.querySelector('.alert.modal__component.only-title');
        if (alertModal) {
            const titleElement = alertModal.querySelector('.alert__title span');
            if (titleElement) {
                titleElement.textContent = message;
            }
        } else {
            const observer = new MutationObserver(() => {
                const newAlertModal = document.querySelector('.alert.modal__component.only-title');
                if (newAlertModal) {
                    modifyAlertContent(message);
                    observer.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
})();
