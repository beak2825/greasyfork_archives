// ==UserScript==
// @name         去除知乎外部链接拦截
// @namespace    http://tampermonkey.net/
// @version      v1.2
// @description  知乎所有外部链接在点击跳转时，会被拦截，并进行二次确认后才能跳转，这个脚本的就是清除所有针对外链的拦截
// @author       Buddha
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509799/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/509799/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%83%A8%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const prefixUrl = /^https?:\/\/link\.zhihu\.com\/\?target=/;
    const replaceUrl = (node)=>{
        if (prefixUrl.test(node.href)) {
            node.href = decodeURIComponent(node.href.replace(prefixUrl, ''));
        }
    };

    const mutationFun = (node)=>{
        if (!node) return;
		const observer = new MutationObserver(mutations=>{
			mutations.filter(m=>m.type==='childList').forEach(mutation=>{
				Array.from(mutation.addedNodes).forEach(item=>mutationFun(item));
				node.querySelectorAll('a[class]').forEach(m=>replaceUrl(m));
			});
		});
        const option = {childList: true, characterData: true, subtree: true};
		observer.observe(node, option);
    };

    /* 适用于知乎首页、个人主页、问题页 动态加载 */
    mutationFun(document.querySelector('.ListShortcut'));

    /* 针对文章详情页 */
    document.querySelectorAll('.RichText a').forEach(link =>replaceUrl(link));

    /* 针对文章详情页 评论区 延时加载 */
    mutationFun(document.querySelector('.Post-Sub'));
})();