// ==UserScript==
// @name              修复微博图片跨域展示
// @namespace         https://github.com/itorr/fix-sinaimg.user.js
// @version           0.11
// @description       修复微博图片在第三方网站上无法正常显示的问题
// @author            itorr
// @license           MIT
// @match             *://*/*
// @exclude           *://weibo.com/*
// @exclude           *://*.weibo.com/*
// @exclude           *://t.cn/*
// @icon              https://weibo.com/favicon.ico
// @run-at            document-end
// @grant             GM_xmlhttpRequest
// @supportURL        https://github.com/itorr/fix-sinaimg.user.js/issues
// @downloadURL https://update.greasyfork.org/scripts/462883/%E4%BF%AE%E5%A4%8D%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E8%B7%A8%E5%9F%9F%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/462883/%E4%BF%AE%E5%A4%8D%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E8%B7%A8%E5%9F%9F%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

const blobUrlSet = new Set();
const isSinaImageRegex = /^https?:\/\/([^/]+\.|)sinaimg\.cn\//;

const fixSinaImages = () => {
    [...document.images].forEach(fixSinaImage);
};
const fixSinaImage = el => {
    if (!isSinaImageRegex.test(el.src)) return;
    GM_xmlhttpRequest({
        method: 'GET',
        url: el.src,
        responseType: 'blob',
        headers: {
            referer: 'https://weibo.com/mygroups',
        },
        onload(res) {
            const url = URL.createObjectURL(res.response);
            blobUrlSet.add(url);
            el.src = url;
        },
    });
    el.removeAttribute('src');
};

const fixSinaImagesForObserver = mutationList => {
    mutationList.forEach(({ type, target, attributeName, oldValue, addedNodes, removedNodes }) => {
        // 有节点新增时，处理 url，不用去完整遍历 document.images
        if (addedNodes.length) {
            addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                // 节点本身是 img
                if (node.tagName === 'IMG') {
                    fixSinaImage(node);
                    return;
                }
                // 子节点有 img
                node.querySelectorAll('img').forEach(fixSinaImage);
            });
        }
        // 有节点被删除时，释放 blob url
        if (removedNodes.length) {
            removedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                // 节点本身是 img
                if (node.tagName === 'IMG') {
                    revokeBlobUrlFromImage(node);
                    return;
                }
                // 子节点有 img
                node.querySelectorAll('img').forEach(revokeBlobUrlFromImage);
            });
        }
        // 当 src 被修改时
        if (type === 'attributes' && attributeName === 'src') {
            // 旧 src 是 blob url，需要释放
            if (blobUrlSet.has(oldValue)) revokeBlobUrl(oldValue);
            // 处理新 src
            fixSinaImage(target);
        }
    });
};

const revokeBlobUrlFromImage = img => {
    if (!blobUrlSet.has(img.src)) return;
    revokeBlobUrl(img.url);
};
const revokeBlobUrl = url => {
    URL.revokeObjectURL(url);
    blobUrlSet.delete(url);
};

if (window.MutationObserver) {
    new MutationObserver(fixSinaImagesForObserver).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['src'],
    });
} else {
    document.addEventListener('DOMNodeInserted', fixSinaImages);
}

window.addEventListener('load', fixSinaImages);
