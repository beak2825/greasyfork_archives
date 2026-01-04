// ==UserScript==
// @name         通用链接重定向
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过URL参数匹配和DOM特征匹配规则实现灵活链接跳转，支持多个网站链接重定向
// @author       sjx01
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529215/%E9%80%9A%E7%94%A8%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/529215/%E9%80%9A%E7%94%A8%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 工具函数 =================
    const utils = {
        // 解码工具函数
        decodeTwice: encodedStr => {
            try {
                return decodeURIComponent(decodeURIComponent(encodedStr));
            } catch {
                return encodedStr;
            }
        },

        // URL合法验证
        isValidUrl: urlString => {
            try {
                return new URL(urlString);
            } catch {
                return false;
            }
        },

        // 日志工具函数
        logRedirect: (ruleName, originalUrl, newUrl) => {
            console.groupCollapsed(`🚀 触发规则：${ruleName}`);
            console.log('原始地址:', originalUrl);
            console.log('目标地址:', newUrl);
            console.groupEnd();
        },

        // 规范化URL路径
        normalizePath: pathname => {
            return pathname.replace(/\/+/g, '/');
        }
    };

    // ================= 配置中心 =================
    // URL匹配规则
    const urlRules = [
        {
            name: '百度百科原图无水印跳转',
            // 检测当前URL是否符合规则
            test: ({ hostname, search }) =>
                hostname === 'bkimg.cdn.bcebos.com' && search.includes('?'),
            // 重定向到新的URL
            redirect: url => url.origin + url.pathname
        },
        {
            name: '小黑盒帖子API转网页版',
            test: ({ pathname, searchParams }) =>
                pathname.includes('/v3/bbs/app/api/web/share') && searchParams.has('link_id'),
            redirect: ({ searchParams }) =>
                `https://www.xiaoheihe.cn/app/bbs/link/${searchParams.get('link_id')}`
        },
        {
            name: '小黑盒游戏详情API转网页版',
            test: ({ hostname, pathname, searchParams }) =>
                hostname === 'api.xiaoheihe.cn' &&
                pathname === '/game/share_game_detail' &&
                searchParams.has('appid') &&
                searchParams.has('game_type'),
            redirect: ({ searchParams }) => {
                const appId = searchParams.get('appid');
                const gameType = searchParams.get('game_type');
                return `https://www.xiaoheihe.cn/app/topic/game/${gameType}/${appId}`;
            }
        },
        {
            name: 'Steampy首页转CDKey',
            test: ({ host, pathname }) => host === 'steampy.com' && pathname === '/',
            redirect: () => 'https://steampy.com/cdKey/cdKey'
        },
        {
            name: '南+论坛简洁版转标准版',
            // 匹配形如 ?t123.html 的查询参数
            test: ({ host, pathname, search }) =>
                pathname === '/simple/index.php' && /[?&]t\d+\.html/.test(search),
            redirect: url => {
                // 提取数字ID并构建新URL
                const tid = url.search.match(/t(\d+)\.html/)[1];
                return `${url.origin}/read.php?tid-${tid}.html`;
            }
        },
        {
            name: 'UC网盘直连加速',
            // 绕过UC网盘强制到客户端下载的限制，直接生成直链下载地址
            test: ({ host, pathname }) =>
                host === 'drive.uc.cn' && pathname.startsWith('/s/'),
            redirect: url => {
                const newUrl = new URL(url);
                newUrl.host = newUrl.host.replace('drive', 'fast');
                return newUrl.href;
            }
        },
        {
            name: 'QQ外链跳转',
            // 匹配 c.pc.qq.com 域名&确保存在目标参数url
            test: ({ host, searchParams }) =>
                host === 'c.pc.qq.com' && searchParams.has('url'),
            redirect: ({ searchParams }) => {
                let targetUrl = utils.decodeTwice(searchParams.get('url'));
                // QQ跳转页总是在原链接末尾添加一个斜杠
                // 去除这个被添加的斜杠，但确保不会影响协议部分（://）
                if (targetUrl.endsWith('/') && !targetUrl.endsWith(':///')) {
                    targetUrl = targetUrl.slice(0, -1);
                }
                return targetUrl;
            }
        },
        {
            name: '微博外链跳转',
            test: ({ host, pathname, searchParams }) =>
                host === 'weibo.cn' && pathname === '/sinaurl' && searchParams.has('u'),
            redirect: url => {
                const targetUrl = new URL(utils.decodeTwice(url.searchParams.get('u')));
                // 删除跟踪参数 utm_source
                targetUrl.searchParams.delete('utm_source');
                targetUrl.pathname = utils.normalizePath(targetUrl.pathname);
                return targetUrl.href;
            }
        },
        {
            name: '腾讯文档外链跳转',
            test: ({ hostname, pathname, searchParams }) =>
                hostname === 'docs.qq.com' &&
                pathname.toLowerCase() === '/scenario/link.html' &&
                searchParams.has('url'),
            redirect: ({ searchParams }) => {
                const targetUrl = utils.decodeTwice(searchParams.get('url'));
                try {
                    const urlObj = new URL(targetUrl);
                    urlObj.pathname = utils.normalizePath(urlObj.pathname);
                    return urlObj.href;
                } catch {
                    return targetUrl;
                }
            }
        },
        {
            name: 'Steam社区外链跳转',
            test: ({ host, pathname, searchParams }) =>
                host === 'steamcommunity.com' &&
                /^\/linkfilter\/?$/.test(pathname) &&
                searchParams.has('u'),
            redirect: ({ searchParams }) => {
                const targetUrl = utils.decodeTwice(searchParams.get('u'));
                try {
                    const urlObj = new URL(targetUrl);
                    urlObj.pathname = utils.normalizePath(urlObj.pathname);
                    return urlObj.href;
                } catch {
                    return targetUrl;
                }
            }
        },
        {
            name: 'QQ邮箱外链跳转',
            test: ({ host, pathname, searchParams }) =>
                host === 'wx.mail.qq.com' &&
                pathname === '/xmspamcheck/xmsafejump' &&
                searchParams.has('url'),
            redirect: ({ searchParams }) => {
                const targetUrl = utils.decodeTwice(searchParams.get('url'));
                try {
                    const urlObj = new URL(targetUrl);
                    urlObj.pathname = utils.normalizePath(urlObj.pathname);
                    return urlObj.href;
                } catch {
                    return targetUrl;
                }
            }
        },
        {
            name: '腾讯云开发者社区外链跳转',
            test: ({ host, pathname, searchParams }) =>
                host === 'cloud.tencent.com' &&
                pathname === '/developer/tools/blog-entry' &&
                searchParams.has('target'),
            redirect: ({ searchParams }) => {
                const targetUrl = utils.decodeTwice(searchParams.get('target'));
                try {
                    const urlObj = new URL(targetUrl);
                    urlObj.pathname = utils.normalizePath(urlObj.pathname);
                    return urlObj.href;
                } catch {
                    return targetUrl;
                }
            }
        },
        {
            name: 'Gitee外链跳转',
            test: ({ host, pathname, searchParams }) =>
                host === 'gitee.com' &&
                pathname === '/link' &&
                searchParams.has('target'),
            redirect: ({ searchParams }) => {
                const targetUrl = utils.decodeTwice(searchParams.get('target'));
                try {
                    const urlObj = new URL(targetUrl);
                    urlObj.pathname = utils.normalizePath(urlObj.pathname);
                    return urlObj.href;
                } catch {
                    return targetUrl;
                }
            }
        },
        {
            name: '凤凰商城商品页跳转',
            // 提取shopid参数作为跳转到香港站的商品id
            test: ({ hostname, pathname, searchParams }) =>
                hostname === 'www.fhyx.com' &&
                pathname === '/jump' &&
                searchParams.has('shopid'),
            redirect: ({ searchParams }) => {
                const shopId = searchParams.get('shopid');
                return `https://www.fhyx.hk/item/${shopId}.html`;
            }
        }
        // 可在此继续添加其他平台URL规则...
    ];

    // DOM特征规则（用于跳转页目标链接参数被加密的情况）
    const domRules = [
        {
            name: '微信外链跳转',
             //元素定位
            selector: '.weui-msg__text-area .ui-ellpisis-content p',
            validate: () => {
                const isWeixinPage = location.host === 'weixin110.qq.com' &&
                    location.pathname.includes('/newredirectconfirmcgi');
                const hasWarningIcon = document.querySelector('.weui-icon-info') !== null;
                return isWeixinPage && hasWarningIcon;
            },
            // 执行动作
            action: (rule) => {
                // 传入规则对象作为参数
                const targetElement = document.querySelector(rule.selector);
                if (!targetElement) return null;
                const targetUrl = targetElement.textContent.trim();
                return utils.isValidUrl(targetUrl) ? targetUrl : null;
            }
        },
        {
            name: '百度贴吧外链跳转',
            // 选择器定位到包含目标链接的p标签
            selector: '.warning_wrap .link',
            validate: () => {
                // 验证是否为百度贴吧跳转页面
                const isTiebaJumpPage = location.host === 'jump2.bdimg.com' &&
                    location.pathname === '/safecheck/index' &&
                    location.search.includes('url=');
                // 检查页面中是否有警告信息
                const hasWarningInfo = document.querySelector('.warning_info .content') !== null;
                return isTiebaJumpPage && hasWarningInfo;
            },
            // 执行动作
            action: (rule) => {
                const targetElement = document.querySelector(rule.selector);
                if (!targetElement) return null;

                const targetUrl = targetElement.textContent.trim();

                // 验证URL是否合法
                if (utils.isValidUrl(targetUrl)) {
                    return targetUrl;
                }

                return null;
            }
        }
        // 可在此继续添加其他平台DOM规则...
    ];

    // ================= 核心逻辑 =================
    const processRules = {
        // URL规则处理器
        url: () => {
            const currentUrl = new URL(location.href);

            for (const rule of urlRules) {
                if (rule.test(currentUrl)) {
                    const newUrl = rule.redirect(currentUrl);
                    if (newUrl && newUrl !== location.href) {
                        utils.logRedirect(rule.name, location.href, newUrl);
                        return newUrl;
                    }
                }
            }
            return null;
        },

        // DOM规则处理器
        dom: () => {
            for (const rule of domRules) {
                if (!rule.validate()) continue;

                const checkDom = () => {
                    const url = rule.action(rule);
                    if (url && utils.isValidUrl(url) && url !== location.href) {
                        return url;
                    }
                    return null;
                };

                const result = checkDom();
                if (result) {
                    utils.logRedirect(rule.name, location.href, result);
                    return result;
                }
            }
            return null;
        }
    };

    // ================= 执行控制 =================
    (() => {
        // 过滤iframe嵌套
        if (window.self !== window.top) return;

        // 统一错误处理
        const safeExecute = (processor, type) => {
            try {
                return processor();
            } catch (error) {
                console.error(`⚠️ ${type}规则执行异常:`, error);
                return null;
            }
        };

        // 主处理流程
        const executeRedirect = () => {
            const urlResult = safeExecute(processRules.url, 'URL');
            if (urlResult) return location.replace(urlResult);

            const domResult = safeExecute(processRules.dom, 'DOM');
            if (domResult) return location.replace(domResult);
        };

        // DOM监听器
        const startObserving = () => {
            if (!window.MutationObserver) return;

            const observer = new MutationObserver(mutations => {
                // 快速过滤无节点变化的mutation
                if (!mutations.some(m => m.addedNodes.length > 0)) return;
                executeRedirect();
            });

            // 限制监听范围，提高性能
            observer.observe(document, {
                childList: true,
                subtree: true,
                attributes: false
            });
        };

        // 启动执行 - 优化执行时机
        const init = () => {
            // 立即执行一次
            executeRedirect();

            // 延迟执行以兼容SPA和动态加载
            setTimeout(executeRedirect, 100);

            // 启动DOM监听
            startObserving();
        };

        // 根据文档状态选择执行时机
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
})();

// 当需要新增跳转规则时，只需在 urlRules 或 domRules 数组中按格式添加：
// {
//     name: '规则描述',
//     test: (currentURL) => {
//         // 返回布尔值判断是否满足条件
//         return currentURL.host === '目标域名'
//             && 其他条件
//     },
//     redirect: (currentURL) => {
//         // 返回新的完整URL字符串
//         return 'https://新域名/新路径'
//     }
// }
