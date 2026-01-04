// ==UserScript==
// @name         搜索引擎净化
// @namespace    https://github.com/QingJ01/Search_clear
// @version      1.1.0
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFU0lEQVRoQ81aTWhUVxQ+902cMdVJMthV6SLubEFrwFKoCGZTBKE6nVgqdWHcaNyYLLrUart00XHjRBc1m9LSJHVSKBQLTUAsLS0YuxC7yhTEVcs8Z2x+NHNvz7nz3jh58967P2+CHhjIZO7P9533nXvOvfcx6IKN36wOrK7DXhzqIHN6+oEJ/FsMgIBBOTyDCghWYQAu542/8T8Lk8dyC12YGoe2NAK91kDALHVEgDiKwwyYD8XKAhpzk4XclHnfZg9jAp63x5njnLMDHQXVKZYK2QlTItoEfI8Dc77ASZrS6L65AviEyRPRIiDB89QN1DVJZfONwWKG8eFiPueqJlMSOPttda9IOTc30etRGF3W4MNXP8wtxpGIJTA2Uz2KkkHP2wSoyneavwueL43kylGtIwmcma2eZCD1brG6aILTbRZDIpSAJ5v5lwK8RxLlNBQmpw4CzYB17r4AzauehyscPjSZz1XaG3YQGJutYcBu3mpTZw/hQXoGKumfYPfqKOx6NqIC/vx3XJ1KH/QPRRLwdE9B21VbYzX4N3Uf7vR+DkSAvpO9yt+EY/UfjObCPDHanidaT0BKRzjzWL9QTdM1W9pyC/7YegX+ce6Hjnmidhuy4nWT+dxSoT/nd2gRODNdvYjlwacmI8W1fdTzq/R4FHC/7/6V87Dn6SmjaQXnl7AYvEidJAEvcJfwz8RLJsmDPP7XlpmWVOLQ7Xz2HhxavmZEABu3AloS8BIWZdtE9gBB/4Je9zWuM1hG9MGp2j2dpoE2fKJUyBWbBBKuPL7X/0x/aQEEZCBTQJsZK5cKfXmWdN0n8PO9nwAFq63ZxAHJiIKZJZUPBaqt533ClnGACyYfZWOz1XFo1jzGRsCJQFJ7bf0dOPLfN8bD0GrEzs7WbuCW8KRpb0pI09nDRgEbNYd9ILMyPgG70qEb0mknRCsRETEyxhaQwGNa/wdNOlKS+vGV013xvj+vFQEMZCsCc9s+gkc9v2lzJs+qckMSAlVEop2BqTQg7esalQlLPbeg7jyM7WJJANjYd4/vmhRwv2eKslTQMfL8+0++VhK2D2KoIIEaVqDioA4gakPeVxVo/lh+jUPxEmc2ZbUcD/cHGAN1zAEcc4HaTORD0qEMS+BVWXrX0xEYXrmsBhBowYBNGRHQTVwE6N3V83K6r7IHlAFsWUrg6E7RqJSgmoe2gyo5kO5J1zrxQu0+rt82zwEEAk8r/GJOay+gkgOVBIeWr0swtGzqeH/f6jl4e01LwUG/uRmH75TltG45EfcESPMExs+mut6nUtpwS+kR8cpp+qa7mQ8rHwgwAW/fFlKwf7/9uFL7w8uXzU4lNjyDtg2NtyeghBZrVELMbTveakOS2b9yYcNmhKQzvf2wMnH5q5RqzojfN24p5VPQ3NRTHkjzrPQ41fHtpru5CcrNlETHpp4G0N2Z+TVNsHLUAR8mN1Pw2F4Gr3/0vuFkTjcWgpOStH7GJTau3gmTmwV4XDmfH6lQ/86jRcPaiAL2Tu9nodUpeXxH442OOLEBLvuEXHxEHe5q5YUgEL9kIOBp3ieXR+NNSjS70AuPuON1OqF+WcxF7YyGXXREXnAkPa3oLvPmmh82ps4VU+ITuwRk8JKPX4oCHxrEwcle4G1NpGzaMSpvKVs5YhOO3iOfDK42gvF88DbGWELBDt4hGB3Ba++hDeUjJZNxYErnjlhLQmEAkpzmRRAyBu6PoyWhKC9KIviyh8meum0sFxhbBNGYEw6UdeSSWEJxcqBlV+D1FHNSb2HGxFdtxCC2pw+9LoBg8YOv3GA6rQhYv7cVQevKJG7e/wGC2pwVj9Yh6QAAAABJRU5ErkJggg==
// @description  一个轻量级的搜索引擎优化脚本。自动净化百度、谷歌、必应等搜索结果页面，支持移除广告、优化重定向链接、清理URL、隐藏弹窗等功能，让搜索体验更简洁高效
// @author       QingJ
// @license      Apache Licence 2.0
// @match        *://*.google.com/*
// @match        *://*.google.com.hk/*
// @match        *://*.google.co.jp/*
// @match        *://*.baidu.com/*
// @match        *://*.bing.com/*
// @match        *://*.cn.bing.com/*
// @match        *://*.s.cn.bing.net/*
// @match        *://*.sogou.com/*
// @match        *://*.m.sogou.com/*
// @match        *://*.wap.sogou.com/*
// @match        *://*.so.com/*
// @match        *://*.m.so.com/*
// @match        *://*.sm.cn/*
// @match        *://*.m.sm.cn/*
// @match        *://*.yz.m.sm.cn/*
// @match        *://*.so.toutiao.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @connect      api.staticj.top
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/520018/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520018/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function (cat) {
    "use strict";

    const userConfig = {
        css: " {display: none !important;width: 0 !important;height: 0 !important;} ",
        timeout: 10000,
        tryCount: 5,
        tryTimeout: 500,
    };

    const commonFunctionObject = {
        GMgetValue(key, defaultValue) {
            return GM_getValue(key, defaultValue);
        },
        GMsetValue(key, value) {
            GM_setValue(key, value);
        },
        GMopenInTab(url) {
            GM_openInTab(url, { active: true });
        },
        randomNumber() {
            return Math.floor(Math.random() * 100000000);
        },
        webToast(config) {
            const message = config.message || '';
            const background = config.background || '#333';
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 10px 20px;
                background: ${background};
                color: #fff;
                border-radius: 4px;
                z-index: 999999;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        },
        request(method, url, data) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    data: data,
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (error) {
                        reject(error);
                    }
                });
            });
        }
    };

    /**
     * 常量定义
     */
    const HOSTS = {
        BAIDU: 'baidu.com',
        GOOGLE: 'google.com',
        BING: 'bing.com',
        SOGOU: 'sogou.com',
        SO: 'so.com',
        SM: 'sm.cn'
    };

    /**
     * 工具函数:移除元素
     */
    function removeElements(selector) {
        try {
            document.querySelectorAll(selector).forEach(el => el.remove());
        } catch (e) {
            console.error('移除元素失败:', selector, e);
        }
    }

    /**
     * 检查当前域名是否匹配
     */
    function isMatchHost(host) {
        return location.host.includes(host);
    }

    /**
     * 添加样式
     */
    function addStyle(css, pass = 0) {
        let el;
        if (pass >= userConfig.tryCount) return;
        if (typeof cat.GM_addStyle == "function") {
            el = cat.GM_addStyle(css);
        } else {
            el = document.createElement("style");
            el.textContent = css;
            document.documentElement.appendChild(el);
        }
        if (typeof el == "object") {
            if (!el || !document.documentElement.contains(el)) {
                setTimeout(() => {
                    addStyle(css, pass + 1);
                }, userConfig.tryTimeout);
            }
        }
    }

    /**
     * 搜索引擎广告过滤
     */
    function removeAds() {
        // 百度广告过滤
        if (isMatchHost(HOSTS.BAIDU)) {
            // 移除顶部和右侧广告
            removeElements('.ec_wise_ad');
            removeElements('#content_right');

            // 移除带有广告标记的内容 - 更精确的选择器
            document.querySelectorAll('#content_left > div').forEach(container => {
                // 检查是否包含广告标记
                if (container.querySelector('.f13 > span')?.textContent?.includes('广告') ||
                    container.querySelector('a[data-landurl]') ||
                    container.querySelector('span.tuiguang')?.textContent?.includes('广告') ||
                    container.querySelector('span.brand')?.textContent?.includes('广告') ||
                    container.querySelector('span[data-tuiguang]')) {
                    container.remove();
                }
            });

            // 移除多余元素 - 更精确的选择器
            removeElements('#content_right > br');
            removeElements('#content_right > div:not([id])');
            removeElements('#content_left > div.result-op');
            removeElements('#content_left > div[class*="recommend"]');

            // 移除劫持和推荐
            removeElements('.res_top_banner');
            removeElements('#content_left div[class*="_rs"]');

            // 移除手机版广告
            if (location.host.includes('m.baidu.com')) {
                // 基础广告元素
                removeElements([
                    '.ec_wise_ad',
                    '.ec-result-inner',
                    '.c-result.result-op',
                    '.download-tip',
                    '.float-ball',
                    '.ball-wrapper',
                    '.na-like-container'
                ].join(','));

                // 移除带有广告标记的内容
                document.querySelectorAll('.c-container').forEach(container => {
                    if (container.querySelector('.c-icons-outer')?.textContent?.includes('广告') ||
                        container.hasAttribute('data-tuiguang') ||
                        container.querySelector('[data-tuiguang]')) {
                        container.remove();
                    }
                });

                // 移除底部推广
                removeElements([
                    '.c-recommends',
                    '.c-flex-recommend',
                    '.c-recommend-tip',
                    '[data-module="recommend"]'
                ].join(','));
            }
        }

        // 谷歌广告过滤
        if (isMatchHost(HOSTS.GOOGLE)) {
            removeElements([
                '.commercial-unit',
                '#tads',
                '#bottomads',
                'div[aria-label="广告"]',
                'div[aria-label="Ads"]'
            ].join(','));
        }

        // 必应广告过滤
        if (isMatchHost(HOSTS.BING)) {
            removeElements([
                'li.b_ad',
                '.pa_sb',
                '.adsMvC',
                'a[h$=",Ads"]',
                'a[href*="/aclick?ld="]',
                'DIV#bnp_container',
                '.ad_sc'
            ].join(','));

            // 移除特定图片的广告
            document.querySelectorAll('.b_algo').forEach(algo => {
                const img = algo.querySelector('.rms_img');
                if (img && (img.src.includes('/th?id=OADD2.') ||
                    img.src.includes('=AdsPlus'))) {
                    algo.remove();
                }
            });
        }

        // 搜狗广告过滤
        if (isMatchHost(HOSTS.SOGOU)) {
            removeElements([
                '#so_kw-ad',
                '#m-spread-left',
                '#m-spread-bottom'
            ].join(','));

            // 移除带有广告标记的内容
            document.querySelectorAll('#righttop_box li').forEach(li => {
                if (li.querySelector('span')?.textContent.includes('广告')) {
                    li.remove();
                }
            });
        }

        // 360搜索广告过滤
        if (isMatchHost(HOSTS.SO)) {
            removeElements([
                '.res-mediav',
                '.e_result',
                '.c-title-tag',
                'DIV.res-mediav-right',
                'DIV.inner_left',
                '#so-activity-entry',
                'DIV.tg-wrap'
            ].join(','));
        }

        // 神马搜索广告过滤
        if (isMatchHost(HOSTS.SM)) {
            removeElements([
                '.ad-wrapper',
                '.ec_wise_ad',
                '.qb-download-banner-non-share',
                'DIV[data-text-ad]',
                '.ad-block'
            ].join(','));

            // 移除手机版广告
            if (location.host.includes('m.sm.cn')) {
                removeElements([
                    'DIV.ad-alert-info',
                    '.se-recommend-word-list-container',
                    '#se-recommend-word-list-container',
                    '[class*="ball-wrapper"]',
                    'DIV#page-copyright.se-page-copyright[style*="margin-bottom: 50px"]',
                    'DIV[style*="position: fixed; bottom: 0px"]',
                    '[ad_dot_url*="http"]',
                    '.dl-banner-without-logo',
                    '.ad_result',
                    '.biz_sponsor'
                ].join(','));
            }
        }
    }

    /**
     * 搜索引擎重定向优化
     */
    function redirectOptimize() {
        // 处理百度重定向
        if (isMatchHost(HOSTS.BAIDU)) {
            document.querySelectorAll('a[href*="baidu.com/link"]:not([ac-redirect-processed])').forEach(link => {
                try {
                    // 标记已处理,避免重复
                    link.setAttribute('ac-redirect-processed', '1');

                    // 保存原始链接
                    const originalHref = link.href;

                    // 移除原有的点击事件
                    link.removeAttribute('onclick');
                    link.removeAttribute('onmousedown');

                    // 使用GM_xmlhttpRequest处理重定向
                    link.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: originalHref,
                            headers: {
                                "Accept": "*/*",
                                "Referer": originalHref
                            },
                            timeout: 5000,
                            onload: function (response) {
                                let directUrl = response.finalUrl;
                                if (!directUrl) {
                                    // 尝试从响应文本中提取URL
                                    const matches = /URL='([^']+)'/.exec(response.responseText);
                                    directUrl = matches ? matches[1] : null;
                                }
                                if (directUrl && !directUrl.includes('baidu.com/link')) {
                                    window.open(directUrl, '_blank');
                                } else {
                                    window.open(originalHref, '_blank');
                                }
                            },
                            onerror: function () {
                                window.open(originalHref, '_blank');
                            }
                        });
                    }, { once: true }); // 确保事件只触发一次

                } catch (e) {
                    console.error('百度重定向处理失败:', e);
                }
            });
        }

        // 处理谷歌重定向
        if (isMatchHost(HOSTS.GOOGLE)) {
            document.querySelectorAll('a[onmousedown]:not([ac-redirect-processed]), a[data-jsarwt]:not([ac-redirect-processed])').forEach(link => {
                try {
                    // 标记已处理
                    link.setAttribute('ac-redirect-processed', '1');

                    // 移除Google的重定向属性
                    link.removeAttribute('onmousedown');
                    link.removeAttribute('data-jsarwt');
                    link.removeAttribute('ping');

                    // 新标签页打开
                    link.setAttribute('target', '_blank');

                } catch (e) {
                    console.error('谷歌重定向处理失败:', e);
                }
            });
        }

        // 处理必应重定向
        if (isMatchHost(HOSTS.BING)) {
            document.querySelectorAll('a[href*="/click?"]:not([ac-redirect-processed]), a[href*="go.microsoft.com"]:not([ac-redirect-processed])').forEach(link => {
                try {
                    // 标记已处理
                    link.setAttribute('ac-redirect-processed', '1');

                    // 尝试从href中提取目标URL
                    const url = new URL(link.href);
                    let targetUrl = url.searchParams.get('u') || url.searchParams.get('r');

                    if (targetUrl) {
                        // 设置解码后的URL
                        link.href = decodeURIComponent(targetUrl);
                        link.setAttribute('target', '_blank');

                        // 移除原有的点击事件
                        link.removeAttribute('onclick');
                        link.removeAttribute('onmousedown');
                    }
                } catch (e) {
                    console.error('必应重定向处理失败:', e);
                }
            });
        }
    }

    /**
     * 隐藏必应APP弹窗
     */
    function hideBingPopup() {
        if (isMatchHost(HOSTS.BING)) {
            addStyle('div#bnp_container {display: none !important;}');

            const observer = new MutationObserver(() => {
                const closeBtn = document.querySelector('div#sacs_close');
                if (closeBtn) {
                    closeBtn.click();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    /**
     * URL参数清理
     */
    function shortenUrl() {
        sturl();
        window.addEventListener('locationchange', sturl);
    }

    function sturl() {
        try {
            let url = new URL(window.location.href);
            let changed = false;

            // 需要移除的查询参数
            const params = [
                // 百度参数 - 完整列表
                'rsp', 'prefixsug', 'fr', 'bsst', 'f', 'inputT', 'usm', 'rsv_page',
                'rqlang', 'rsv_t', 'oq', 'rsv_pq', 'rsv_spt', 'ie', 'rsv_enter',
                'rsv_sug1', 'rsv_sug7', 'rsv_sug2', 'rsv_sug3', 'rsv_iqid',
                'rsv_bp', 'rsv_btype', 'rsv_idx', 'rsv_dl', 'issp', 'cshid',
                'tn', 'rsv_sug4', 'rtt', 'bsst', 'rsv_sid', 'rsv_tn', '_ss',
                'rsv_jmp', 'rsv_bl', 'rsv_sug5', 'rsv_sug6', 'rsv_sug8', 'rsv_sug9', 'bar',

                // 谷歌参数 - 完整列表
                'tbas', 'ved', 'uact', 'ei', 'ie', 'oq', 'sclient', 'cshid', 'dpr',
                'iflsig', 'aqs', 'gs_lcp', 'source', 'sourceid', 'sxsrf', 'pccc',
                'sa', 'biw', 'bih', 'hl', 'newwindow', 'stick', 'gws_rd', 'client',
                'gs_rn', 'tbo', 'dcr', 'safe', 'ssui', 'psi',

                // 必应参数 - 完整列表
                'tsc', 'sp', 'FORM', 'form', 'pq', 'sc', 'qs', 'sk', 'cvid', 'lq',
                'ghsh', 'ghacc', 'ghpl', 'ghc', 'ubireng', 'FPIG', 'PC', 'setmkt',
                'setlang', 'mkt', 'qpvt', 'ensearch', 'first'
            ];

            // 移除参数
            params.forEach(param => {
                if (url.searchParams.has(param)) {
                    url.searchParams.delete(param);
                    changed = true;
                }
            });

            // 特殊参数处理
            const specialParams = [
                ['start', '0'],
                ['page', '1'],
                ['offset', '0'],
                ['first', '1']
            ];

            if (url.searchParams.get('start') === '0') {
                url.searchParams.delete('start');
                changed = true;
            }

            // 如果有改变则更新URL
            if (changed) {
                window.history.replaceState(null, null, url.toString());
            }

        } catch (e) {
            console.error('URL参数清理失败:', e);
        }
    }

    // 添加 locationchange 事件支持
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('locationchange'));
    };

    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('locationchange'));
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });

    // SearchEnginesNavigation 类定义
    class SearchEnginesNavigation {
        constructor() {
            this.navigationDataCache = "navigation_data_cache";
            this.customNavigationkey = "custom-navigation-key-8898";
            this.searchEnginesData = [
                { "host": "www.baidu.com", "element": "#content_right", "elementInput": "#kw" },
                { "host": "www.so.com", "element": "#side", "elementInput": "#keyword" },
                { "host": "www.sogou.com", "element": "#right", "elementInput": "#upquery" },
                { "host": "cn.bing.com", "element": "#b_context", "elementInput": "#sb_form_q" },
                { "host": "www.bing.com", "element": "#b_context", "elementInput": "#sb_form_q" },
                { "host": "www4.bing.com", "element": "#b_context", "elementInput": "#sb_form_q" },
                { "host": "so.toutiao.com", "element": ".s-side-list", "elementInput": "input[type='search']" },
                { "host": "www.google.com", "element": "#rhs", "elementInput": "input[name='q']" }
            ];
        }

        getNavigationData(element, elementInput) {
            const defaultNavigationData = [
                {
                    "name": "搜索引擎", "list": [
                        { "name": "百度", "url": "https://www.baidu.com/s?wd=@@" },
                        { "name": "必应", "url": "https://cn.bing.com/search?q=@@" },
                        { "name": "Google", "url": "https://www.google.com/search?q=@@" },
                        { "name": "360搜索", "url": "https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&nlpv=basest&q=@@" },
                        { "name": "搜狗", "url": "https://www.sogou.com/web?query=@@" },
                        { "name": "头条搜索", "url": "https://so.toutiao.com/search?dvpf=pc&source=input&keyword=@@" }
                    ]
                },
                {
                    "name": "资源搜索", "list": [
                        { "name": "财经搜索", "url": "https://www.shaduizi.com/s/search?q=@@&currentPage=1" },
                        { "name": "百度百科", "url": "https://baike.baidu.com/item/@@" },
                        { "name": "知乎搜索", "url": "https://www.zhihu.com/search?type=content&q=@@" },
                        { "name": "B站搜索", "url": "https://search.bilibili.com/all?keyword=@@&from_source=webtop_search&spm_id_from=333.851" },
                        { "name": "抖音搜索", "url": "https://www.douyin.com/search/@@?aid=0a9fc74b-01e8-4fb0-9509-307c5c07fda1&publish_time=0&sort_type=0&source=normal_search&type=general" },
                        { "name": "搜狗|公众号", "url": "https://weixin.sogou.com/weixin?type=2&query=@@" },
                        { "name": "搜狗|知乎", "url": "https://www.sogou.com/sogou?pid=sogou-wsse-ff111e4a5406ed40&insite=zhihu.com&ie=utf8&p=73351201&query=@@&ie=utf8&p=73351201&query=@@" },
                        { "name": "豆瓣搜索", "url": "https://www.douban.com/search?q=@@" },
                        { "name": "电影搜索", "url": "https://www.cupfox.com/search?key=@@" },
                        { "name": "维基百科", "url": "https://en.wikipedia.org/w/index.php?search=@@" },
                        { "name": "法律法规", "url": "https://www.pkulaw.com/law/chl?Keywords=@@" },
                        { "name": "icon搜索", "url": "https://www.iconfont.cn/search/index?searchType=icon&q=@@" },
                        { "name": "github", "url": "https://github.com/search?q=@@" },
                        { "name": "csdn", "url": "https://so.csdn.net/so/search?q=@@&t=&u=" },
                        { "name": "stackoverflow", "url": "https://stackoverflow.com/" }
                    ]
                }
            ];

            let cacheNavigationData = commonFunctionObject.GMgetValue(this.navigationDataCache, null);
            if (!cacheNavigationData) {
                cacheNavigationData = defaultNavigationData;
            }

            let finalNavigationData = null;
            try {
                let customNavigationData = commonFunctionObject.GMgetValue(this.customNavigationkey, null);
                finalNavigationData = customNavigationData ? cacheNavigationData.concat(customNavigationData) : cacheNavigationData;
            } catch (e) {
                finalNavigationData = cacheNavigationData;
            }

            this.createHtml(element, elementInput, finalNavigationData);

            // 更新缓存数据
            commonFunctionObject.request("get", "http://api.staticj.top/script/api/get/navigation_json_url?t=" + new Date().getTime(), null)
                .then(resultData => {
                    let dataJson = JSON.parse(resultData.data);
                    if (dataJson?.url) {
                        commonFunctionObject.request("get", dataJson.url, null)
                            .then(resultData2 => {
                                let serverNavigationData = resultData2.data;
                                if (!cacheNavigationData ||
                                    (cacheNavigationData && serverNavigationData.length != JSON.stringify(cacheNavigationData).length)) {
                                    commonFunctionObject.GMsetValue(this.navigationDataCache, JSON.parse(serverNavigationData));
                                }
                            })
                            .catch(() => { });
                    }
                })
                .catch(() => { });
        }

        createCss(elementNum) {
            const cssContent = `
        /* 导航容器样式 */
        #QingjByeBug {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 15px;
            margin-bottom: 20px;
        }

        /* 分类样式 */
        .ddfdfd${elementNum}dffssqa {
            margin-top: 13px;
        }

        .ddfdfd${elementNum}dffssqa:first-child {
            margin-top: 0;
        }

        /* 标题样式 */
        .ddfdfd${elementNum}dffssqa>.title {
            font-size: 15px;
            color: #333;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
        }

        .ddfdfd${elementNum}dffssqa>.title b {
            position: relative;
            padding-left: 10px;
        }

        .ddfdfd${elementNum}dffssqa>.title b:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 16px;
            background: #4e6ef2;
            border-radius: 2px;
        }

        /* 链接列表样式 */
        .ddfdfd${elementNum}dffssqa>.content-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        /* 链接样式 */
        .ddfdfd${elementNum}dffssqa>.content-list>a {
            flex: 0 0 calc(31% - 4px);
            text-decoration: none;
            color: #333;
            background: #f5f5f5;
            border: 1px solid transparent;
            border-radius: 4px;
            padding: 6px 2px;
            text-align: center;
            font-size: 13px;
            line-height: 1.5;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            transition: all 0.3s ease;
        }

        .ddfdfd${elementNum}dffssqa>.content-list>a:hover {
            background: #4e6ef2;
            color: #fff;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(78,110,242,0.3);
        }

        /* 底部信息样式 */
        #QingjByeBug > div:last-child {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            color: #999;
            font-size: 12px;
        }

        #QingjByeBug > div:last-child a {
            color: #666;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        #QingjByeBug > div:last-child a:hover {
            color: #4e6ef2;
        }

        /* 自定义按钮样式 */
        a[name="customNavigation"] {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        a[name="customNavigation"]:before {
            content: '🔧';
            font-size: 14px;
        }
    `;

            if ($("#plugin_css_style_dddsoo").length == 0) {
                $("body").prepend(`<style id='plugin_css_style_dddsoo'>${cssContent}</style>`);
            }
        }

        createHtml(element, elementInput, navigationData) {
            $("#QingjByeBug").remove(); // 保持原有ID

            const elementNum = commonFunctionObject.randomNumber();
            let isComplete = true;

            // 添加这一行,确保CSS样式被添加
            this.createCss(elementNum);

            const elementInterval = setInterval(() => {
                if (isComplete) {
                    const $element = $(element);
                    const $box = $("#QingjByeBug");
                    isComplete = false;

                    if ($element.length != 0 && $box.length == 0) {
                        let html = "<div id='QingjByeBug'>";

                        // 遍历导航分类
                        navigationData.forEach(category => {
                            html += `
                                <div class='ddfdfd${elementNum}dffssqa'>
                                    <div class='title'><b>${category.name}</b></div>
                                    <div class='content-list'>
                            `;

                            // 遍历分类下的链接
                            category.list.forEach(item => {
                                html += `<a target='_blank' name='navigation' data-url='${item.url}' href='javascript:void(0);'>${item.name}</a>`;
                            });

                            html += "</div></div>";
                        });

                        html += `
                            <div style='margin-bottom:10px;margin-top:5px;font-size:12px;'>
                                <a target='_blank' href='https://greasyfork.org/zh-CN/scripts/520018'>*该数据由 搜索引擎净化 提供</a>
                                &nbsp;&nbsp;
                                <a href="javascript:void(0);" name="customNavigation">自定义网址</a>
                            </div>
                        </div>`;

                        // 插入导航面板
                        $element.prepend(html);

                        // 绑定链接点击事件
                        $("#QingjByeBug a[name='navigation']").on("click", function (e) {
                            e.preventDefault();
                            const url = $(this).data("url").replace("@@", $(elementInput).val());
                            commonFunctionObject.GMopenInTab(url);
                        });

                        // 绑定自定义导航事件
                        $("#QingjByeBug a[name='customNavigation']").on("click", function (e) {
                            e.preventDefault();
                            self.showSetingDialog();
                        });
                    }
                    isComplete = true;
                }
            }, 100);
        }

        showSetingDialog() {
            const customNavigation = commonFunctionObject.GMgetValue(this.customNavigationkey, null);
            const customNavigationData = customNavigation ? JSON.stringify(customNavigation, null, 4) : "";

            const content = `
        <div class="custom-navigation-dialog">
            <div class="notice-section">
                <h3>注意事项：</h3>
                <ol>
                    <li>请严格按照格式添加，否则不生效</li>
                    <li>数据为json格式，请确保json格式正确，必要时请到 <a target="_blank" href="https://www.json.cn/">json.cn</a> 校验</li>
                    <li>点击下面"示例"按钮，查看具体格式情况</li>
                    <li>链接中的搜索关键词请用"@@"代替，脚本会自动替换成当前搜索词</li>
                    <li>清空 -> 保存，则取消自定义的导航网址</li>
                </ol>
            </div>
            <div class="textarea-section">
                <textarea 
                    placeholder="请严格按照格式填写，否则不生效"
                    class="navigation-textarea"
                >${customNavigationData}</textarea>
            </div>
            <div class="button-section">
                <button class="navigation-example">示例</button>
                <button class="navigation-clear">清空</button>
                <button class="navigation-save">保存自定义导航</button>
            </div>
        </div>
    `;

            // 创建弹窗样式
            const style = document.createElement('style');
            style.textContent = `
        .custom-navigation-dialog {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #333;
            padding: 20px;
        }

        .custom-navigation-dialog .notice-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 20px;
        }

        .custom-navigation-dialog .notice-section h3 {
            color: #e74c3c;
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
        }

        .custom-navigation-dialog .notice-section ol {
            margin: 0;
            padding-left: 20px;
        }

        .custom-navigation-dialog .notice-section li {
            line-height: 1.6;
            margin-bottom: 5px;
            color: #666;
            font-size: 14px;
        }

        .custom-navigation-dialog .notice-section a {
            color: #2196f3;
            text-decoration: none;
            transition: color 0.3s;
        }

        .custom-navigation-dialog .notice-section a:hover {
            color: #1976d2;
            text-decoration: underline;
        }

        .custom-navigation-dialog .textarea-section {
            margin: 20px 0;
        }

        .custom-navigation-dialog .navigation-textarea {
            width: 100%;
            height: 200px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: Consolas, Monaco, 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            resize: none;
            background-color: #fff;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        .custom-navigation-dialog .navigation-textarea:focus {
            outline: none;
            border-color: #4e6ef2;
            box-shadow: 0 0 0 3px rgba(78,110,242,0.1);
        }

        .custom-navigation-dialog .button-section {
            text-align: center;
            margin-top: 20px;
        }

        .custom-navigation-dialog button {
            padding: 8px 20px;
            margin: 0 8px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .custom-navigation-dialog button:hover {
            transform: translateY(-1px);
        }

        .custom-navigation-dialog .navigation-example {
            background: #f5f5f5;
            color: #333;
        }

        .custom-navigation-dialog .navigation-example:hover {
            background: #e0e0e0;
        }

        .custom-navigation-dialog .navigation-clear {
            background: #ff4d4f;
            color: white;
        }

        .custom-navigation-dialog .navigation-clear:hover {
            background: #ff7875;
        }

        .custom-navigation-dialog .navigation-save {
            background: #4e6ef2;
            color: white;
        }

        .custom-navigation-dialog .navigation-save:hover {
            background: #6c87f5;
        }

        .custom-navigation-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999998;
            animation: fadeIn 0.3s ease;
        }

        .custom-navigation-dialog-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
            z-index: 999999;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow: auto;
            animation: slideIn 0.3s ease;
        }

        .custom-navigation-dialog-close {
            position: absolute;
            right: 16px;
            top: 16px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: none;
            background: #f5f5f5;
            color: #666;
            font-size: 20px;
            line-height: 28px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .custom-navigation-dialog-close:hover {
            background: #ff4d4f;
            color: white;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -48%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
    `;

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'custom-navigation-dialog-overlay';

            // 创建弹窗容器
            const dialogContainer = document.createElement('div');
            dialogContainer.className = 'custom-navigation-dialog-container';
            dialogContainer.innerHTML = content;

            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.className = 'custom-navigation-dialog-close';
            closeBtn.innerHTML = '×';
            dialogContainer.appendChild(closeBtn);

            // 添加样式和元素到页面
            document.head.appendChild(style);
            document.body.appendChild(overlay);
            document.body.appendChild(dialogContainer);

            // 绑定事件
            const textarea = dialogContainer.querySelector('.navigation-textarea');
            const exampleJson = [{
                "name": "我的导航",
                "list": [
                    { "name": "百度", "url": "https://www.baidu.com/s?wd=@@" },
                    { "name": "必应", "url": "https://cn.bing.com/search?q=@@" }
                ]
            }];

            // 示例按钮事件
            dialogContainer.querySelector('.navigation-example').onclick = () => {
                textarea.value = JSON.stringify(exampleJson, null, 4);
            };

            // 清空按钮事件
            dialogContainer.querySelector('.navigation-clear').onclick = () => {
                textarea.value = '';
            };

            // 保存按钮事件
            dialogContainer.querySelector('.navigation-save').onclick = () => {
                const content = textarea.value;
                if (!content) {
                    commonFunctionObject.GMsetValue(this.customNavigationkey, null);
                    commonFunctionObject.webToast({ "message": "保存成功：数据为空", "background": "#4e6ef2" });
                    closeDialog();
                    return;
                }

                try {
                    const contentJson = JSON.parse(content);
                    if (this.validateNavigationFormat(contentJson)) {
                        commonFunctionObject.GMsetValue(this.customNavigationkey, contentJson);
                        commonFunctionObject.webToast({ "message": "保存成功", "background": "#4e6ef2" });
                        closeDialog();
                        // 刷新导航显示
                        this.show();
                    } else {
                        commonFunctionObject.webToast({ "message": "格式错误，请更正", "background": "#ff4d4f" });
                    }
                } catch (e) {
                    commonFunctionObject.webToast({ "message": "格式错误，请更正", "background": "#ff4d4f" });
                }
            };

            // 关闭弹窗函数
            const closeDialog = () => {
                overlay.remove();
                dialogContainer.remove();
                style.remove();
            };

            // 关闭按钮事件
            closeBtn.onclick = closeDialog;
            // 点击遮罩层关闭
            overlay.onclick = closeDialog;
            // 阻止弹窗点击事件冒泡到遮罩
            dialogContainer.onclick = (e) => e.stopPropagation();
        }

        validateNavigationFormat(data) {
            if (!Array.isArray(data)) return false;

            return data.every(category => {
                if (typeof category !== 'object' || !category.name || !Array.isArray(category.list)) {
                    return false;
                }
                return category.list.every(item => {
                    return typeof item === 'object' &&
                        typeof item.name === 'string' &&
                        typeof item.url === 'string';
                });
            });
        }

        show() {
            const host = window.location.host;
            const href = window.location.href;

            if ((host === "www.baidu.com") ||
                (host === "www.so.com" && href.includes("www.so.com/s")) ||
                (host === "www.sogou.com" && (href.includes("www.sogou.com/web") || href.includes("www.sogou.com/sogou"))) ||
                (host === "cn.bing.com" && href.includes("cn.bing.com/search")) ||
                (host === "www.bing.com" && href.includes("www.bing.com/search")) ||
                (host === "www4.bing.com" && href.includes("www4.bing.com/search")) ||
                (host === "so.toutiao.com" && href.includes("so.toutiao.com/search")) ||
                (host === "www.google.com" && href.includes("www.google.com/search"))) {

                const currentSearchEnginesData = this.searchEnginesData.find(item => host === item.host);
                if (currentSearchEnginesData) {
                    this.getNavigationData(currentSearchEnginesData.element, currentSearchEnginesData.elementInput);
                }
            }
        }

        start() {
            this.show();
        }
    }

    /**
     * 初始化函数
     */
    function init() {
        removeAds();
        redirectOptimize();
        hideBingPopup();
        shortenUrl();
        new SearchEnginesNavigation().start();
    }

    // 使用 MutationObserver 监听DOM变化
    const observer = new MutationObserver(() => {
        removeAds();
        redirectOptimize();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["id", "class"]
    });

    // 初始化执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})({
    GM_info: typeof GM_info == "object" ? GM_info : {},
    unsafeWindow: typeof unsafeWindow == "object" ? unsafeWindow : window,
    GM_addStyle: typeof GM_addStyle == "function" ? GM_addStyle : undefined,
});
