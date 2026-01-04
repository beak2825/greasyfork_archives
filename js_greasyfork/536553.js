// ==UserScript==
// @name         精简链接的跟踪代码
// @version      1.1
// @description  自用的链接精简
// @author       jkfujr
// @include      *.taobao.com/*
// @include      *.tmall.com/*
// @include      *.tmall.hk/*
// @include      *.goofish.com/*
// @include      *www.baidu.com/*
// @license      GNU GPLv3
// @namespace none
// @downloadURL https://update.greasyfork.org/scripts/536553/%E7%B2%BE%E7%AE%80%E9%93%BE%E6%8E%A5%E7%9A%84%E8%B7%9F%E8%B8%AA%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/536553/%E7%B2%BE%E7%AE%80%E9%93%BE%E6%8E%A5%E7%9A%84%E8%B7%9F%E8%B8%AA%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 获取URL中的指定参数值
     * @param {string} name 参数名
     * @param {string} url URL字符串，默认为当前页面URL
     * @return {string|null} 参数值，没有则返回null
     */
    function getQueryString(name, url) {
        url = url || window.location.search;
        var search = url.indexOf('?') > -1 ? url.substring(url.indexOf('?') + 1) : '';
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = search.match(reg);
        if (r != null) return r[2];
        return null;
    }

    /**
     * 保留URL中指定的参数，移除其他参数
     * @param {string} url 原始URL
     * @param {Array<string>} paramsToKeep 要保留的参数名数组
     * @return {string} 处理后的URL
     */
    function keepOnlyParams(url, paramsToKeep) {
        var urlObj = new URL(url);
        var baseUrl = urlObj.origin + urlObj.pathname;
        var params = new URLSearchParams();
        
        // 只保留指定的参数
        for (var i = 0; i < paramsToKeep.length; i++) {
            var paramName = paramsToKeep[i];
            var paramValue = getQueryString(paramName, urlObj.search);
            if (paramValue) {
                params.append(paramName, paramValue);
            }
        }
        
        var queryString = params.toString();
        return queryString ? baseUrl + '?' + queryString : baseUrl;
    }



    // 站点处理器对象
    var siteHandlers = {
        // 通用商品详情页处理
        'item.taobao.com': function(url) {
            return keepOnlyParams(url, ['id', 'skuId']);
        },

        'detail.tmall.com': function(url) {
            return keepOnlyParams(url, ['id', 'skuId']);
        },

        'detail.tmall.hk': function(url) {
            return keepOnlyParams(url, ['id', 'skuId']);
        },

        // 淘宝订单页面
        'buyertrade.taobao.com': function(url) {
            return keepOnlyParams(url, ['route_to']);
        },

        // 天猫页面处理
        'tmall.com': function(url) {
            var urlObj = new URL(url);
            var site = url.match(/^http(s)?:\/\/[^?]*/);
            
            if ((urlObj.hostname === "www.tmall.com" || urlObj.hostname === "tmall.com") && 
                (urlObj.pathname === "/" || urlObj.pathname === "")) {
                return site[0];
            }
            // 天猫店铺页面
            else if (urlObj.hostname.endsWith("tmall.com") && urlObj.hostname !== "www.tmall.com" && 
                (urlObj.pathname === "/" || urlObj.pathname === "")) {
                return urlObj.protocol + "//" + urlObj.hostname;
            }
            return url;
        },



        // 闲鱼商品页面处理
        'www.goofish.com': function(url) {
            var urlObj = new URL(url);
            if (urlObj.pathname === '/item') {
                return keepOnlyParams(url, ['id']);
            }
            return url;
        },

        // 百度搜索页面处理
        'www.baidu.com': function(url) {
            var urlObj = new URL(url);
            var site = url.match(/^http(s)?:\/\/[^?]*/);
            var paramValue = getQueryString("wd", urlObj.search);
            
            if (paramValue) {
                return site[0] + "?wd=" + paramValue;
            } else {
                paramValue = getQueryString("q", urlObj.search);
                if (paramValue) {
                    return site[0] + "?q=" + paramValue;
                }
            }
            return url;
        }

    };

    /**
     * 清理URL，移除不必要的参数
     * @param {string} url 需要清理的URL
     * @return {string} 清理后的URL
     */
    function cleanUrl(url) {
        try {
            var urlObj = new URL(url);
            var hostname = urlObj.hostname;
            var pureUrl = url;
            var matched = false;
            
            // 先尝试精确匹配子域名
            for (var siteDomain in siteHandlers) {
                if (siteDomain !== 'taobao.com' && hostname.includes(siteDomain)) {
                    pureUrl = siteHandlers[siteDomain](url);
                    matched = true;
                    break;
                }
            }

            // 对于没有匹配到特定处理器的淘宝域名，移除所有参数
            if (!matched && hostname.includes('taobao.com')) {
                var site = url.match(/^http(s)?:\/\/[^?]*/);
                pureUrl = site ? site[0] : urlObj.origin + urlObj.pathname;
            }

            return pureUrl;
        } catch (e) {
            console.error('清理URL时出错:', e);
            return url;
        }
    }

    /**
     * 处理页面上所有链接的点击事件
     */
    function handleLinkClicks() {
        document.addEventListener('click', function(event) {
            var target = event.target;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }
            if (!target || !target.href || target.getAttribute('data-cleaned') === 'true') {
                return;
            }
            var originalHref = target.href;
            var cleanedHref = cleanUrl(originalHref);
            if (cleanedHref !== originalHref) {
                target.href = cleanedHref;
                target.setAttribute('data-cleaned', 'true');
            }
        }, true);
    }

    /**
     * 处理表单提交事件（主要用于搜索表单）
     */
    function handleFormSubmits() {
        document.addEventListener('submit', function(event) {
            var form = event.target;
            
            // 检查是否是搜索表单
            if (form.action && (form.action.includes('search') || form.action.includes('s?'))) {
            }
        }, true);
    }

    /**
     * 使用MutationObserver监听DOM变化，清理动态添加的链接
     */
    function observeDOMChanges() {
        var config = { 
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        };

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            var links = node.getElementsByTagName('a');
                            for (var i = 0; i < links.length; i++) {
                                var link = links[i];
                                if (link.href && !link.getAttribute('data-cleaned')) {
                                    var cleanedHref = cleanUrl(link.href);
                                    if (cleanedHref !== link.href) {
                                        link.href = cleanedHref;
                                        link.setAttribute('data-cleaned', 'true');
                                    }
                                }
                            }
                        }
                    });
                }
                else if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                    var link = mutation.target;
                    if (link.href && !link.getAttribute('data-cleaned')) {
                        var cleanedHref = cleanUrl(link.href);
                        if (cleanedHref !== link.href) {
                            link.href = cleanedHref;
                            link.setAttribute('data-cleaned', 'true');
                        }
                    }
                }
            });
        });

        observer.observe(document.body, config);
    }

    // 清理页面URL
    function cleanCurrentPageUrl() {
        var currentUrl = window.location.href;
        var pureUrl = cleanUrl(currentUrl);
        if (currentUrl !== pureUrl) {
            history.replaceState(null, document.title, pureUrl);
        }
    }

    // 初始化
    function init() {
        cleanCurrentPageUrl();
        handleLinkClicks();
        handleFormSubmits();
        observeDOMChanges();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
