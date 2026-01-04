// ==UserScript==
// @name h5微博浏览跟评
// @namespace https://greasyfork.org/
// @version 1.0
// @description h5微博点开详情时经常不显示跟评，特别在跟评数量较多时出现，此脚本用于解决此问题。
// @author fortutoste
// @license MIT
// @match https://m.weibo.cn/*
// @downloadURL https://update.greasyfork.org/scripts/481356/h5%E5%BE%AE%E5%8D%9A%E6%B5%8F%E8%A7%88%E8%B7%9F%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/481356/h5%E5%BE%AE%E5%8D%9A%E6%B5%8F%E8%A7%88%E8%B7%9F%E8%AF%84.meta.js
// ==/UserScript==

let timer = null;

function insertLink() {
    const url = window.location.href;
    const match = url.match(/https:\/\/m\.weibo\.cn\/compose\/reply\?id=(\d+)&reply=(\d+)/);
    if (match) {
        const weiboId = match[1];
        const commentId = match[2];
        const targetUrl = `https://m.weibo.cn/detail/${weiboId}?cid=${commentId}`;
        const element = document.querySelector('#app > div.m-wrapper.m-wbox > div > header > div:nth-child(2) > h1');
        if (element && !document.querySelector(`a[href="${targetUrl}"]`)) {
            element.insertAdjacentHTML('afterend', `<a href="${targetUrl}">评论详情</a>`);
        }
    }
}

window.addEventListener('load', function() {
    'use strict';
    insertLink();

    const observer = new MutationObserver(function(mutations) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            insertLink();
        }, 1000);
    });

    observer.observe(document.body, { childList: true, subtree: true });
});