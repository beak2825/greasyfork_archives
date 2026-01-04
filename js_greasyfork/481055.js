// ==UserScript==
// @name         净化评论区
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  PEACE AND LOVE，跟恶臭言论说拜拜。
// @author       Young2fun
// @match        *://*/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAppJREFUaEPVmdFxwjAMhhU6QbmukDkK45QOARmidBxgjqzQoxMU95REnBG2JTsxODxCsPVJ+iXZqWDmnyqn/W/f7ernoz7m3CMLABp+MXC4Gm6gOX/WuxwgWQBe9+2hAljNFmC5bw339nlTZ3FWlkWLBFh+tbvFAo4aURYFkCLIogDQ81DB1s5pKZ+LBwChLBYFcJdCGIo5AaC9Lo+GIIqKQAfg0MH8AQDAJ+biIhCbRhJATE+R5id1J3amkScKIQA+J0klOTuASws+gJSKNhmAL40MwPF3U6/tjcYAxJ4h1CmEBt6NyWQ16wspACkjC24fBeDTAU+jFIDUM0QUgDOHhyjYYkwBkCqXTwtRAN5yysaLsgFcXXlwDwr65ihpuQ0jFKpCj4tAACBU8ooBCKaRRdBFw8AJv6KTXBER4OXUZWgoEnepMpTgh6UQGic1m87Tl/5axVTwjrqgKsUNXVSwxnP2QwHIwy5Dfd73GeoDw3U0c1J8GU0UMQEg9J+BLerDvuXgTdI1oricowYINTFp4CJjXKmHhuO1IwcgYGnt/ACDSMkBCNPNMAZOpA97FJH0xYHUAN5BzuEiqkx0oeudoVjZfamgQUGTtjQXwmoA58GeG2+gCeW1lA7890lFLEaA6jmKvJ9zby7DYo2fvApJaYCiw01v3gukWG3NVfygNKoKSQAkRFWqKcCeUkYxZ0VQhfFdB3ccVUdFQDXEBeYapd3XxybvAx2ApgsbaKYQ8PMAYl3t6SMaAffFLvKjikLkmvxxrfeTAFRaGAMQ+Uo2OgJo25jBLsSmrTz2GkkAWSAiPU8QyQC0gDhiaNIp0fhkDXCbrocU++28YDifWDWcoxuZZhOEoefoXGz/T/uuWbPXZBHQbpbjuX/rEk9PZCmOXwAAAABJRU5ErkJggg==
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/481055/%E5%87%80%E5%8C%96%E8%AF%84%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481055/%E5%87%80%E5%8C%96%E8%AF%84%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 规则：domain 可以是正则，selectors 为数组（一个站点可能多个选择器）
    const RULES = [
        { domain: /baijiahao\.baidu\.com/, selectors: ['#commentModule', '.comment-module'] },
        { domain: /baidu\.com\/s/, selectors: ['#danmuWrapper'] },
        { domain: /qq\.com/, selectors: ['#qqcom-comment', '.comment'] },
        { domain: /haokan\.baidu\.com/, selectors: ['#commentnum'] },
        { domain: /mbd\.baidu\.com\/newspage\//, selectors: ['#commentModule'] },
        { domain: /mbd\.baidu\.com/, selectors: ['#page-comment'] },
        // 你可以在这里继续添加规则：{ domain: /example\.com/, selectors: ['#c1', '.c2'] }
    ];

    const rule = RULES.find(r => r.domain.test(location.href));
    if (!rule) {
        // 没匹配到站点规则则退出（若想在所有站点尝试，可注释掉此 return）
        // return;
        console.log('[隐藏评论区] 本页面未匹配到规则，仍将尝试泛匹配常见选择器。');
    } else {
        console.log('[隐藏评论区] 匹配站点规则：', rule.domain, 'selectors:', rule.selectors);
    }

    // 如果没有匹配规则，使用一组常见的选择器作泛匹配
    const fallbackSelectors = [
        '#comments', '#comment', '.comments', '.comment-list', '.comment-area',
        '.reply-area', '.comment-module', '#commentModule', '#page-comment', '#commentnum',
        '#qqcom-comment', '#danmuWrapper'
    ];
    const selectors = (rule && rule.selectors && rule.selectors.length) ? rule.selectors.concat(fallbackSelectors) : fallbackSelectors;

    // 注入全局 CSS（尽可能立即生效）
    function injectGlobalStyle(selArr) {
        try {
            const sheet = document.createElement('style');
            sheet.setAttribute('data-name', 'hide-comments-style');
            const rulesText = selArr.map(s => `${s} { display: none !important; visibility: hidden !important; height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; }`).join('\n');
            sheet.textContent = rulesText;
            (document.head || document.documentElement).appendChild(sheet);
            console.log('[隐藏评论区] 已注入全局 CSS（主文档）');
        } catch (e) {
            console.warn('[隐藏评论区] 注入全局 CSS 失败：', e);
        }
    }

    // 在给定根节点（document 或 shadow/root）中查找并隐藏选择器
    function hideInRoot(root, selArr) {
        try {
            selArr.forEach(sel => {
                const list = (root || document).querySelectorAll(sel);
                list.forEach(el => {
                    if (el) {
                        if (el.style) {
                            el.style.setProperty('display', 'none', 'important');
                            el.style.setProperty('visibility', 'hidden', 'important');
                        } else {
                            // 对于一些非元素节点（保险）
                            el.setAttribute && el.setAttribute('hidden', 'true');
                        }
                        console.log('[隐藏评论区] 隐藏元素：', sel, el);
                    }
                });
            });
        } catch (e) {
            console.warn('[隐藏评论区] hideInRoot 错误: ', e);
        }
    }

    // 递归遍历 open shadow roots，尝试在 shadowRoot 中 hide
    function traverseShadowAndHide(rootNode, selArr) {
        if (!rootNode) return;
        const treeWalker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        const visited = new Set();
        while ((node = treeWalker.nextNode())) {
            // 防止死循环
            if (visited.has(node)) break;
            visited.add(node);

            // 如果节点有 shadowRoot（open），在其中执行 hide
            try {
                const sr = node.shadowRoot;
                if (sr) {
                    hideInRoot(sr, selArr);
                    // 继续递归遍历 shadow root 的子节点
                    traverseShadowAndHide(sr, selArr);
                }
            } catch (e) {
                // 有些 shadowRoot 可能不可访问或 closed
            }
        }
    }

    // 处理同源 iframe：注入 CSS 并隐藏其中匹配元素；对跨域 iframe：若 iframe.src 匹配规则域则直接隐藏 iframe 元素
    function handleIframes(selArr, domainPatterns) {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const doc = iframe.contentDocument;
                if (doc && doc.head) {
                    // 在 iframe 中注入样式
                    const style = doc.createElement('style');
                    style.textContent = selArr.map(s => `${s} { display: none !important; visibility: hidden !important; height: 0 !important; overflow: hidden !important; }`).join('\n');
                    doc.head.appendChild(style);
                    // 直接尝试隐藏
                    selArr.forEach(s => {
                        doc.querySelectorAll(s).forEach(el => {
                            el.style && el.style.setProperty('display', 'none', 'important');
                            console.log('[隐藏评论区] 在同源 iframe 中隐藏：', s, el, iframe.src);
                        });
                    });
                } else {
                    // contentDocument 不可访问 -> 跨域 iframe
                    const src = iframe.getAttribute('src') || '';
                    if (domainPatterns && domainPatterns.some(p => p.test(src) || p.test(location.href))) {
                        // 如果 iframe 的 src 含有目标域名，直接隐藏 iframe 元素本身
                        iframe.style.setProperty('display', 'none', 'important');
                        console.log('[隐藏评论区] 隐藏跨域 iframe 元素（通过 src 匹配）:', src);
                    } else {
                        // 若没有明确匹配，也可以选择隐藏 iframe（注释掉以避免误伤）
                        // iframe.style.display = 'none';
                    }
                }
            } catch (e) {
                // 访问跨域 iframe 会抛错
                const src = iframe.getAttribute('src') || '';
                if (domainPatterns && domainPatterns.some(p => p.test(src) || p.test(location.href))) {
                    iframe.style.setProperty('display', 'none', 'important');
                    console.log('[隐藏评论区] 跨域 iframe，已根据 src 隐藏：', src);
                } else {
                    // 无法访问也未匹配，跳过
                }
            }
        });
    }

    // 主运行逻辑：注入样式 -> 首次隐藏 -> 观察 DOM -> 处理 shadow & iframe -> 周期重试（小次数）
    function start() {
        injectGlobalStyle(selectors);
        hideInRoot(document, selectors);
        traverseShadowAndHide(document, selectors);
        handleIframes(selectors, RULES.map(r => r.domain));

        // MutationObserver 监听后续插入
        const observer = new MutationObserver(mutations => {
            // 当 DOM 变化时再次尝试隐藏
            hideInRoot(document, selectors);
            traverseShadowAndHide(document, selectors);
            handleIframes(selectors, RULES.map(r => r.domain));
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('[隐藏评论区] 已启动 MutationObserver');
        } else {
            console.warn('[隐藏评论区] document.body 尚未就绪，稍后建立 observer');
            window.addEventListener('load', () => {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }

        // 周期性尝试（兼容某些站点在页面运行后很久才加载评论）
        let attempts = 0;
        const maxAttempts = 12; // 总共尝试约 12 次（每 2s -> 24s）
        const intervalId = setInterval(() => {
            attempts++;
            hideInRoot(document, selectors);
            traverseShadowAndHide(document, selectors);
            handleIframes(selectors, RULES.map(r => r.domain));
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('[隐藏评论区] 周期重试结束，共尝试次数：', attempts);
            }
        }, 2000);
    }

    // 等待页面 load 更稳妥
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        start();
    } else {
        window.addEventListener('DOMContentLoaded', start);
        // 以及保险的 load
        window.addEventListener('load', start);
    }

})();