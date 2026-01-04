// ==UserScript==
// @name         更好访问gcc
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  一点小小hook
// @author       LinXingJun
// @match        *://*.gcc.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536816/%E6%9B%B4%E5%A5%BD%E8%AE%BF%E9%97%AEgcc.user.js
// @updateURL https://update.greasyfork.org/scripts/536816/%E6%9B%B4%E5%A5%BD%E8%AE%BF%E9%97%AEgcc.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (unsafeWindow.top !== unsafeWindow.self) {
        return;
    }
    const cookie_url = "http://127.0.0.1:1999";

    // 配置重定向规则
    const redirect_domain = {
        'nc.gcc.edu.cn': 'nic.gcc.edu.cn',
        'www-cnki-net.vpn.gcc.edu.cn': 'www-cnki-net-s.vpn.gcc.edu.cn',
        'navi-cnki-net-s.vpn.gcc.edu.cn:8118': 'navi.cnki.net',
        'id-elsevier-com-s.vpn.gcc.edu.cn': 'www-elsevier-com-s.vpn.gcc.edu.cn'
    };
    const redirect_url = {
        '/app/search/quick/': '/search/expert.url',
        'application/checksessionstatus?resourcetype=redirect&isIndividual=false': '/search/expert.url',
        '/portal/#!/vpn_openresource' : '',
        'home.url' : '/search/expert.url'
    };

    const blockblackkeyword = ["vpn", "mail"];

    if (unsafeWindow.location.protocol === 'https:') {
        redirect_domain['http:'] = 'https:';
    }

    // 当前页面URL替换与跳转
    function handlePageRedirect() {
        let newUrl = unsafeWindow.location.href;
        for (const [oldKey, newKey] of Object.entries(redirect_domain)) {
            if (newUrl.includes(oldKey)) {
                newUrl = newUrl.replace(oldKey, newKey);
                unsafeWindow.location.replace(newUrl);
                break;
            }
        }
        // 检查是否需要重定向
        for (const [keyword, redirectPath] of Object.entries(redirect_url)) {
            if (unsafeWindow.location.href.includes(keyword)) {
                // 清空URL参数并重定向
                window.location.href = redirectPath;
                break;
            }
        }
    }

    function webproxyurl(url){
        let protocol = '';
        if (url.startsWith('https://')) {
            protocol = 'https://';
            url = url.substring(8);
        } else if (url.startsWith('http://')) {
            protocol = 'http://';
            url = url.substring(7);
        }

        // 分离路径
        let path = '';
        if (url.includes('/')) {
            let urlParts = url.split('/');
            url = urlParts[0];
            path = '/' + urlParts.slice(1).join('/');
        }

        // 处理域名转换
        if (protocol === 'https://') {
            e.stopImmediatePropagation();
            // 处理带端口号的情况: http://A.B:C.com -> http://A-B-C-P.vpn.gcc.edu.cn:8118
            // 原有规则: https://A.B.com -> http://A-B-s.vpn.gcc.edu.cn:8118/
            return `http://${url.replace(/\./g, '-')}-s.vpn.gcc.edu.cn:8118${path}`;
        } else if (protocol === 'http://') {
            e.stopImmediatePropagation();
            // 处理带端口号的情况: http://A.B:C.com -> http://A-B-C-P.vpn.gcc.edu.cn:8118/
            if (url.includes(':')) {
                let [domain, port] = url.split(':');
                let convertedDomain = domain.replace(/\./g, '-');
                return `http://${convertedDomain}-${port}-P.vpn.gcc.edu.cn:8118${path}`;
            } else {
                // 原有规则: http://A.B.com -> http://A-B.vpn.gcc.edu.cn:8118/
                return `http://${url.replace(/\./g, '-')}.vpn.gcc.edu.cn:8118${path}`;
            }
        }
    }

    // 屏蔽原生跳转（通过代理 a 标签点击事件）
    function blockNativeRedirects() {
        unsafeWindow.document.addEventListener('click', (e) => {
            if (window.location.hostname == "vpn.gcc.edu.cn") {
                const targetLink = e.target.closest('a.rs-list__item__href'); // 查找最近的匹配祖先元素
                if (targetLink) {
                    var url = targetLink.querySelector('.rs-list__item__link')?.textContent.trim();
                    if (url) {
                        e.preventDefault();
                        window.open(webproxyurl(url), '_blank');
                    }
                }
            } else if (location.href.includes("engineering")) {
                const href = e.target.getAttribute('href');
                if (!href) return;
                const url = new URL(href, window.location.href);
                const path = url.pathname;
                if (
                    path.startsWith('/search/results/') ||
                    path.startsWith('/app/doc/')
                ) {
                    // 阻止默认行为
                    e.stopImmediatePropagation();

                    // 在新标签页中打开链接
                    window.open(webproxyurl(href), '_blank', 'noopener,noreferrer');
                }
                else if (e.target.tagName === 'A') {
                    if (location.href.includes(blockblackkeyword)) {
                        return;
                    } else {
                        const href = e.target.getAttribute('href');
                        if (href && !href.startsWith('#')) {
                            e.stopImmediatePropagation();
                            // 手动处理跳转
                            window.location.href = href;
                        }
                    }
                }
            }
        }, true);
    }



    unsafeWindow.document.addEventListener('DOMContentLoaded', function () {
        //vpn 503的时候重新刷新
        if (window.document.body.innerText.includes("Server is unable to process client's requests temporarily due to overload or system maintenance")) {
            location.reload();
        }
        handlePageRedirect();
        blockNativeRedirects();
        var observerfunc = [];
        if (window.location.href.includes("vpn")) {
            observerfunc.push(function () {
                // 需要处理的标签属性
                const targets = [
                    { selector: 'img', attr: 'src' },
                    { selector: 'script', attr: 'src' },
                ];
                targets.forEach(target => {
                    document.querySelectorAll(target.selector).forEach(el => {
                        const originalUrl = el.getAttribute(target.attr);
                        const isValidUrl = (originalUrl) => {
                            try {
                                new URL(originalUrl);
                                return true;
                            } catch (e) {
                                return false;
                            }
                        };
                        const isJavascriptProtocol = (url) => {
                            return url && url.trim().toLowerCase().startsWith('javascript:');
                        };
                        if (originalUrl && isValidUrl(originalUrl) && !el.complete && !isJavascriptProtocol(originalUrl)) {
                            // 使用 GM_xmlhttpRequest 下载资源
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: originalUrl,
                                responseType: 'blob',
                                onload: function (response) {
                                    if (response.status === 200 && response.response) {
                                        // 检查元素是否仍在文档中且资源未加载完成
                                        if (document.contains(el)) {
                                            // 创建 Blob URL
                                            const blobUrl = URL.createObjectURL(response.response);
                                            // 替换资源 URL
                                            el.setAttribute(target.attr, blobUrl);
                                        }
                                    }
                                },
                            });
                        }
                    });
                });
            })
        } else {
            observerfunc.push(function () {
                // 需要处理的标签属性
                const targets = [
                    { selector: 'a', attr: 'href' },
                    { selector: 'img', attr: 'src' },
                    { selector: 'script', attr: 'src' },
                    { selector: 'link', attr: 'href' }
                ];
                targets.forEach(target => {
                    unsafeWindow.document.querySelectorAll(target.selector).forEach(el => {
                        const attrValue = el.getAttribute(target.attr);
                        if (attrValue) {
                            for (const [oldKey, newKey] of Object.entries(redirect_url)) {
                                if (attrValue.includes(oldKey)) {
                                    el.setAttribute(
                                        target.attr,
                                        attrValue.replace(oldKey, newKey)
                                    );
                                    break;
                                }
                            }
                        }
                    });
                });
            });
        }
        if (window.location.href.includes("jy")) {
            observerfunc.push(function () {
                let jyxpaths = [
                    '/html/body/div[2]/div/div[2]/div',
                    '/html/body/div[2]/div/div[2]',
                    '/html/body/div[2]/div/div'
                ];

                // 遍历每个 XPath 表达式并删除对应的元素
                jyxpaths.forEach(xpath => {
                    let element = unsafeWindow.document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (element) {
                        element.parentNode.removeChild(element);
                    }
                });
            })
        }
        if (window.location.href.includes("cnki")) {
            observerfunc.push(function () {
                const cnkielements = unsafeWindow.document.querySelectorAll('div#aliyunCaptcha-common-errorTip');
                cnkielements.forEach(element => {
                    // 清空所有CSS样式
                    element.style.cssText = '';
                    // 设置为不可见
                    element.style.display = 'none';
                });
            })
        }
        if (window.location.href.includes("mail")) {
            // 获取所有<a>标签
            const allLinks = document.querySelectorAll('a');

            allLinks.forEach(link => {
                // 检查是否有href属性且以'A'开头
                if (link.href && link.href.startsWith('http://mail.xs.gcc.edu.cn/cgi-bin/login')) {
                    // 直接替换整个URL前缀
                    link.href = link.href.replace(
                        'http://mail.xs',
                        'https://mail'
                    );

                    // 自动点击该链接
                    link.click();
                }
            });

        }
        // 遍历每个函数并添加观察器
        observerfunc.forEach(function (func) {
            var observer = new MutationObserver(func);
            observer.observe(unsafeWindow.document.body, {
                childList: true,
                subtree: true
            });
        });
    });

    if (unsafeWindow.location.hostname == "vpn.gcc.edu.cn") {
        window.onload = function () {
            setInterval(() => {
                // 获取cookie中的TWFID
                const cookies = document.cookie.split(';');
                let twfid = null;

                for (let cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name === 'TWFID') {
                        twfid = value;
                        break;
                    }
                }

                // 如果找到了TWFID，则发送到指定地址
                if (twfid) {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: cookie_url,
                        data: JSON.stringify({ TWFID: twfid }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        onload: function (response) {
                            console.log('TWFID发送成功:', response.responseText);
                        },
                        onerror: function (error) {
                            console.error('发送TWFID失败:', error);
                        }
                    });
                } else {
                    console.log('未找到TWFID cookie');
                }
            }, 1000);
        };
    }
})();