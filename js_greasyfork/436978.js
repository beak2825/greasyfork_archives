// ==UserScript==
// @name        提示文章时间 
// @namespace   xky1000.cn
// @match       https://blog.csdn.net/*
// @match       https://juejin.cn/*
// @match       https://segmentfault.com/*
// @match       https://www.jianshu.com/p/*
// @match       https://www.cnblogs.com/*/p/*
// @match       https://stackoverflow.com/questions/*
// @match       https://zhuanlan.zhihu.com/p/*
// @version     0.1.5
// @author      xky
// @grant       GM_addStyle
// @license     MIT
// @description 提示文章时间。支持csdn，掘金，思否，博客园，stackoverflow，知乎专栏,简书。有问题发邮件:xky1000@qq.com
// @downloadURL https://update.greasyfork.org/scripts/436978/%E6%8F%90%E7%A4%BA%E6%96%87%E7%AB%A0%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/436978/%E6%8F%90%E7%A4%BA%E6%96%87%E7%AB%A0%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==


GM_addStyle(`#display-date {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    background-color: #ff9999;
    padding: 0 13px 0 8px;
    color:#000;
    font-size: 10px;
}`)
{
    function display(text) {
        const date = new Date(text);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const div = document.createElement('div')
        div.id = 'display-date'
        div.innerText = `${year}/${month}/${day}`
        document.body.appendChild(div);
    }

    const siteHandlers = {
        'blog.csdn.net': () => display(document.querySelector('.time').innerText.match(/\d{4}-\d{2}-\d{2}/)),
        'juejin.cn': () => setTimeout(() => display(document.querySelector('.meta-box .time').dateTime), 500),
        'segmentfault.com': () => display(document.querySelector('time').dateTime),
        'www.jianshu.com': () => setTimeout(() => display(document.querySelector('time').dateTime), 500),
        'www.cnblogs.com': () => display(document.querySelector('#post-date').innerText),
        'stackoverflow.com': () => display(document.querySelector('.relativetime').title),
        'zhuanlan.zhihu.com': () => display(document.querySelector('.ContentItem-time').innerText.match(/\d{4}-\d{2}-\d{2}/))
    }

    siteHandlers[location.hostname]();
}
