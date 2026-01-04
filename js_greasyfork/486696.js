// ==UserScript==
// @name         抢救本家直链
// @namespace    https://memo329.jimdofree.com
// @version      0.2.1
// @description  把B站视频简介sm号超链接使用的失效短链域名 acg.tv 替换为 nicovideo
// @author       永咲みつき
// @author       HIMlaoS_Misa
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/list/*
// @grant        none
// @run-at       document-start
// @license      GPLv3
// @supportURL   mailto:mit2uki@outlook.com
// @supportURL   mailto:misaliu@misaliu.top
// @downloadURL https://update.greasyfork.org/scripts/486696/%E6%8A%A2%E6%95%91%E6%9C%AC%E5%AE%B6%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/486696/%E6%8A%A2%E6%95%91%E6%9C%AC%E5%AE%B6%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 日志系统
    const jsName = '抢救本家直链';

    function asMethod(type) {
        const styleMap = {
            debug: '#28D',
            info: '#2A8',
            warn: '#DA0',
            error: '#E46'
        };

        if (!(type in styleMap)) {
            type = 'info';
        }

        const style = `
            background-color: ${styleMap[type]};
            color: #FFF;
            font-weight: bold;
            padding: 1px 6px;
            border-radius: 3px;
            margin-right: 3px;
        `;

        return function(...args) {
            const label = `【${jsName}】 %c${type.toUpperCase()}`;
            console[type](label, style, ...args);
        };
    };

    const logger = {
        debug: asMethod('debug'),
        info: asMethod('info'),
        warn: asMethod('warn'),
        error: asMethod('error')
    };

    // 编辑超链接的函数
    const replaceLinksInElement = (element) => {
        let newHTML = element.innerHTML;
        let count = 0;

        const oldUrlReg = /(<a\s+[^>]*?href\s*=\s*["'])((?:https?:)?\/\/acg\.tv(?:\/)?)([^"'\s>]*)(["'][^>]*>)/g;
        const otherIdReg = /\b(so|nm)([1-9]\d*)\b(?![^<]*<\/a>)/g;

        newHTML = newHTML.replace(oldUrlReg, (match, prefix, domain, id, suffix) => {
            count++;
            logger.info(`已替换 ${id} 的链接`);
            return `${prefix}//www.nicovideo.jp/watch/${id}${suffix}`;
        });

        newHTML = newHTML.replace(otherIdReg, (match) => {
            count++;
            logger.info(`已插入 ${match} 的链接`);
            return `<a href="https://www.nicovideo.jp/watch/${match}" target="_blank">${match}</a>`;
        });

        if (count > 0) {
            element.innerHTML = newHTML;
        }

        return count;
    };

    // 定义防抖
    const _ = {
        debounce: (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    };

    // 主替换逻辑（500ms防抖）
    const doDescLinkReplace = _.debounce(() => {
        try {
            const containers = document.querySelectorAll('#app .desc-info-text');
            if (containers.length === 0) {
                logger.error('未找到视频简介');
                return;
            }

            let Count = 0;
            containers.forEach(container => {
                Count += replaceLinksInElement(container);
            });

            if (Count > 0) {
                logger.info(`共处理 ${Count} 个链接`);
            } else {
                logger.info('目前无链接需处理');
            }
        } catch (error) {
            logger.error(`执行处理时出错 - ${error.message}`);
        }
    }, 500);

    // DOM变化观察者
    const initObserver = () => {
        const targetNode = document.querySelector('#app');
        if (!targetNode) {
            logger.error('未找到播放器');
            return null;
        }

        const observer = new MutationObserver(mutations => {
            const relevantChange = mutations.some(mutation => {
                return mutation.type === 'childList' &&
                    (mutation.target.matches?.('.desc-info-text, .desc-info-text *') ||
                     [...mutation.addedNodes].some(n => n.matches?.('.desc-info-text, .desc-info-text *')))
            });

            if (relevantChange) {
                doDescLinkReplace();
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        return observer;
    };

    // 脚本入口
    logger.info('脚本已激活，正在初始化...');
    let appObserver = null;

    // 脚本初始化
    const init = () => {
        if (appObserver) {
            appObserver.disconnect();
        }
        doDescLinkReplace();
        appObserver = initObserver();
    };

    // 页面加载检测（重试30次 超时15s）
    const checkPageLoad = () => {
        let attempts = 0;
        const maxAttempts = 30;

        const checkInterval = setInterval(() => {
            if (document.querySelector('#app')) {
                clearInterval(checkInterval);
                logger.info('页面已加载');
                init();
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkInterval);
                logger.warn('页面加载超时');
                init();
            }
        }, 500);
    };

    // 启动页面加载检测
    checkPageLoad();

})();