// ==UserScript==
// @name         手机百度搜索结果去除重定向
// @version      3.1
// @description  解析百度搜索结果重定向链接并替换为目标链接
// @author       DeepSeek
// @match        https://m.baidu.com/*
// @match        https://www.baidu.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/474561/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/474561/%E6%89%8B%E6%9C%BA%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const processed = new WeakSet();
    const queue = [];
    let isProcessing = false;
    
    // 判断是否是包含from参数的重定向链接
    function isFromRedirect(url) {
        return url && 
               url.includes('baidu.com') && 
               url.includes('/from=');
    }

    // 发送GET请求解析重定向
    function resolveBaiduRedirect(redirectUrl, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: redirectUrl,
            timeout: 3000,
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36 ',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Referer': window.location.href
            },
            onload: function(response) {
                let finalUrl = response.finalUrl || response.responseURL;
                
                // 如果响应中有跳转，尝试提取
                if (response.status === 200 && response.responseText) {
                    const metaRefreshMatch = response.responseText.match(/<meta[^>]*http-equiv=["']?refresh["']?[^>]*url=["']?([^"'>]+)["']?/i);
                    if (metaRefreshMatch) {
                        finalUrl = metaRefreshMatch[1];
                    }
                    
                    const jsRedirectMatch = response.responseText.match(/window\.location\.(href|replace)\s*=\s*["']([^"']+)["']/);
                    if (jsRedirectMatch) {
                        finalUrl = jsRedirectMatch[2];
                    }
                }
                
                callback(finalUrl || redirectUrl);
            },
            onerror: function() {
                callback(redirectUrl);
            },
            ontimeout: function() {
                callback(redirectUrl);
            }
        });
    }

    // 处理单个元素
    function processElement(element) {
        if (processed.has(element)) return;
        
        const redirectUrl = element.getAttribute('rl-link-href');
        
        // 只处理包含/from=的链接
        if (!isFromRedirect(redirectUrl)) {
            processed.add(element); // 标记为已处理但不处理
            return;
        }
        
        console.log('处理百度/from=重定向:', redirectUrl);
        
        resolveBaiduRedirect(redirectUrl, function(finalUrl) {
            if (finalUrl && finalUrl !== redirectUrl) {
                // 预加载
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = finalUrl;
                document.head.appendChild(link);
                
                // 替换属性值
                element.setAttribute('rl-link-href', finalUrl);
                console.log('重定向解析完成:', finalUrl);
            }
            
            processed.add(element);
            
            // 处理队列中的下一个
            processQueue();
        });
        
        processed.add(element);
    }

    // 队列处理
    function processQueue() {
        if (queue.length === 0 || isProcessing) return;
        
        isProcessing = true;
        const element = queue.shift();
        
        processElement(element);
        
        // 延迟后处理下一个
        setTimeout(() => {
            isProcessing = false;
            if (queue.length > 0) {
                processQueue();
            }
        }, 500);
    }

    // 收集所有需要处理的元素
    function collectElements() {
        // 查找所有带有rl-link-href属性的元素
        const elements = document.querySelectorAll('article[rl-link-href], [rl-link-href]');
        let fromCount = 0;
        
        elements.forEach(element => {
            const redirectUrl = element.getAttribute('rl-link-href');
            
            // 只将包含/from=的链接加入队列
            if (!processed.has(element) && !queue.includes(element) && isFromRedirect(redirectUrl)) {
                queue.push(element);
                fromCount++;
            }
        });
        
        console.log(`找到 ${elements.length} 个元素，其中 ${fromCount} 个包含/from=重定向`);
        
        // 开始处理队列
        for (let i = 0; i < 2; i++) {
            processQueue();
        }
    }

    // 初始处理
    setTimeout(collectElements, 100);

    // 监听新元素
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                setTimeout(collectElements, 50);
                break;
            }
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

})();