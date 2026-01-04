// ==UserScript==
// @name         阻止中转页
// @description  替换中转页跳转链接
// @version      1.0.1
// @match        https://*.zhihu.com/*
// @match        https://juejin.cn/post/*
// @match        https://www.nodeseek.com/*
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/1363215
// @downloadURL https://update.greasyfork.org/scripts/544068/%E9%98%BB%E6%AD%A2%E4%B8%AD%E8%BD%AC%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/544068/%E9%98%BB%E6%AD%A2%E4%B8%AD%E8%BD%AC%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const queryMatch = {
        'zhihu.com': {
            key: 'link.zhihu.com',
            params: 'target'
        },
        'juejin.cn': {
            key: 'link.juejin.cn',
            params: 'target'
        },
        'nodeseek.com': {
            key: 'www.nodeseek.com',
            params: 'to'
        },
    }
    const matchDomain = (host) => {
        return queryMatch[Object.keys(queryMatch).find(it => host.includes(it))]
    }

     const replaceLink = (url) => {
        const matchLink = matchDomain(location.host)
        if(matchLink && url.includes(matchLink.key)){
            const params = new URL(url).searchParams;
            const target = params.get(matchLink.params);
            return decodeURIComponent(target)
        }
        return url
    }
     function debounce(fn, delay) {
         let timer = null;
         return function (...args) {
             clearTimeout(timer);
             timer = setTimeout(() => {
                 fn.apply(this, args);
             }, delay);
         };
     }

    const debouncedFn = debounce(() => {
        const allANode = document.querySelectorAll('a[target]')
        allANode.forEach(node => {
            node.href = replaceLink(node.href)
        })
        console.log('link replace completed')
    }, 300);

    function bootstrap() {
        const targetNode = document.body;

        const config = {
            childList: true,// 监听子节点增删
            subtree: true,// 监听所有后代节点（不是只限于 body 直接子节点）
            attributes: true,// 监听属性变化（比如 class、style 等）
            characterData: true// 监听文本内容变化
        };

        const callback = function (mutationsList, observer) {
            let needReplace = false
            for (const mutation of mutationsList) {
                if(!needReplace && mutation.type === 'childList') {
                    needReplace = true
                }
            }
            if(needReplace){
                debouncedFn()
            }
        };

        const observer = new MutationObserver(callback);

        // 开始监听
        observer.observe(targetNode, config);
    }

    if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
        bootstrap()
    } else {
        document.addEventListener('DOMContentLoaded', bootstrap, false)
    }
})();