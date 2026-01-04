// ==UserScript==
// @name        笑一笑
// @namespace   greasyfork-cyc-story-j001
// @version     1.0.2
// @author	    青草笑笑
// @description 去除手机里面小说网页的广告，部分页面广告怎么都去不了
// @match       *://*.tianxibook.com/*
// @grant       none
// @license    GPLv3
// @description 2025/3/16 12:06:46
// @downloadURL https://update.greasyfork.org/scripts/529952/%E7%AC%91%E4%B8%80%E7%AC%91.user.js
// @updateURL https://update.greasyfork.org/scripts/529952/%E7%AC%91%E4%B8%80%E7%AC%91.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 选择所有 <ins> 标签
    const insTags = document.querySelectorAll('ins');

    insTags.forEach(tag => {
        tag.remove(); // 直接删除标签及其内部内容
    });

    // 定义正则表达式，匹配随机标签名（如 zxjwxp、ibdby 等）
    const tagPattern = /^[a-z]{5,10}$/; // 匹配5到10位的纯小写字母标签名

    // 定义常见HTML标签的白名单（不删除）
    const whitelist_tag = new Set([
        'html', 'head', 'body', 'title', 'meta', 'link', 'style',
        'script1', 'noscript', 'template', 'iframe', 'object', 'embed',
        'form', 'input', 'textarea', 'button', 'select', 'option',
        'table', 'tr', 'th', 'td', 'thead', 'tbody', 'tfoot',
        'ul', 'ol', 'li', 'div', 'span', 'a', 'p', 'h1', 'h2', 'h3',
        'h4', 'h5', 'h6', 'img', 'video', 'audio', 'source', 'track',
        'canvas', 'svg', 'path', 'g', 'circle', 'rect', 'line', 'polygon',
        'polyline', 'text', 'symbol', 'defs', 'use', 'filter', 'mask',
        'marker', 'clipPath', 'header' , 'article' , 'section','figure','footer'
    ]);

    // 定义删除规则
    function removeDynamicTags() {
        document.querySelectorAll('*').forEach(tag => {
            const tagName = tag.tagName.toLowerCase();

            // 匹配随机生成标签（用正则表达式）+ 不在白名单中
            if (tagPattern.test(tagName) && !whitelist_tag.has(tagName)) {
                console.log(`删除标签: <${tagName}>`);
                tag.remove();
            }
        });
    }

    // 初始执行一次，删除已有标签
    removeDynamicTags();

    // 监听 DOM 变化，自动删除新增标签
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // 1表示ELEMENT_NODE
                    const tagName = node.tagName.toLowerCase();

                    // 匹配随机生成标签 + 不在白名单中
                    if (tagPattern.test(tagName) && !whitelist_tag.has(tagName)) {
                        console.log(`删除新插入标签: <${tagName}>`);
                        node.remove();
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true, // 监听直接子节点的变化
        subtree: true    // 监听整个DOM树的变化
    });


    console.log('【脚本已启动】开始删除所有外部 JS 文件...');

    // 当前站点的域名（包括协议）
    const currentOrigin = window.location.origin;

    // 定义白名单（可以根据需要修改）
    const whitelist_js = [
        //'cdnjs.cloudflare.com',
        //'code.jquery.com',
        //'stackpath.bootstrapcdn.com',
        //'cdn.jsdelivr.net'
    ];

    // 删除非本站的 JS 文件
    function removeExternalScripts() {
        document.querySelectorAll('script').forEach(script => {
            if (
                script.src &&
                !script.src.startsWith(currentOrigin) &&
                !whitelist_js.some(domain => script.src.includes(domain))
            ) {
                console.log(`【删除外部 JS】: ${script.src}`);
                script.remove();
            }
        });
    }

    // 删除动态插入的 JS 文件（包括 head 和 body）
    const observer2 = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && node.src) {
                    if (
                        !node.src.startsWith(currentOrigin) &&
                        !whitelist_js.some(domain => node.src.includes(domain))
                    ) {
                        console.log(`【删除动态外部 JS】: ${node.src}`);
                        node.remove();
                    }
                }
            });
        });
    });

    // 监听 head 和 body 的变化
    observer2.observe(document.head, {
        childList: true,
        subtree: true
    });

    observer2.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始清理（清理已有的 JS 文件）
    removeExternalScripts();
    console.log('【脚本已执行完毕】非本站 JS 文件已删除');

    console.log('【脚本已启动】开始清除广告和劫持...');

    // ==========================
    // ✅ 1. 解除全局点击劫持
    // ==========================

    // 允许文本选择（移除 user-select: none）
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
       }
    `;
    document.head.appendChild(style);


    // 直接移除 body 上的 onclick 劫持
    document.body.removeAttribute('onclick');

    // 解除通过 addEventListener 绑定的点击劫持
    window.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡
        e.preventDefault(); // 阻止默认行为
        console.log('【已拦截全局点击事件】');
    }, true);

    // ==========================
    // ✅ 2. 删除覆盖广告层
    // ==========================

    function removeOverlayAds() {
        document.querySelectorAll('div, iframe').forEach(element => {
            const style = window.getComputedStyle(element);
            if (
                parseInt(style.zIndex) > 1000 || // 高 z-index
                style.position === 'fixed' ||    // 固定定位
                style.position === 'absolute' || // 绝对定位
                style.opacity === '0' ||         // 隐藏但可点击
                element.clientHeight < 10 ||     // 高度过小的隐藏元素
                element.clientWidth < 10
            ) {
                console.log(`【删除覆盖广告层】: `, element);
                //element.remove();
            }
        });
    }

    // 初始清理广告层
    removeOverlayAds();

    // ==========================
    // ✅ 3. 拦截动态注入广告
    // ==========================

    // 监听 DOM 变化，自动删除动态生成的广告标签
    const observer3 = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    // 删除动态插入的广告标签
                    if (node.tagName === 'SCRIPT' && node.src) {
                        console.log(`【删除动态广告脚本】: ${node.src}`);
                        node.remove();
                    }
                    if (node.tagName === 'IFRAME' || node.tagName === 'DIV') {
                        const style = window.getComputedStyle(node);
                        if (
                            parseInt(style.zIndex) > 1000 ||
                            style.position === 'fixed' ||
                            style.position === 'absolute' ||
                            style.opacity === '0'
                        ) {
                            console.log(`【删除动态广告层】: `, node);
                            node.remove();
                        }
                    }
                }
            });
        });
    });

    // 监听 <head> 和 <body> 里的动态加载
    observer3.observe(document.head, {
        childList: true,
        subtree: true
    });
    observer3.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ==========================
    // ✅ 4. 拦截 window.open 和 location.href 劫持
    // ==========================

    // 禁止 window.open 劫持
    window.open = function () {
        console.log('【已阻止 window.open 跳转】');
        return null;
    };

    // 拦截 location.href 劫持
    // Object.defineProperty(window, 'location', {
    //     get() {
    //         return window.location.href;
    //     },
    //     set(value) {
    //         console.log(`【拦截跳转】: ${value}`);
    //         return null;
    //     }
    // });

    // 使用 pushState 和 replaceState 来拦截跳转
    history.pushState = function () {};
    history.replaceState = function () {};

    // 禁止 hashchange 劫持（如通过 # 号跳转）
    window.addEventListener('hashchange', (e) => {
        e.stopImmediatePropagation();
        console.log(`【拦截 hashchange】: ${window.location.hash}`);
    });

    // 禁止 popstate 劫持（通过浏览器前进/后退劫持）
    window.addEventListener('popstate', (e) => {
        e.stopImmediatePropagation();
        console.log(`【拦截 popstate】`);
    });

    // ==========================
    // ✅ 5. 阻止 setTimeout 和 setInterval 劫持
    // ==========================

    window.setTimeout = (callback, time) => {
        console.log('【拦截 setTimeout】');
        return null;
    };

    window.setInterval = (callback, time) => {
        console.log('【拦截 setInterval】');
        return null;
    };

    // ==========================
    // ✅ 6. 定时清理广告层（防止再次插入）
    // ==========================

    setInterval(() => {
        removeOverlayAds();
    }, 1000);

    console.log('【脚本已执行完毕】广告和劫持已清除！');


})();