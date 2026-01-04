// ==UserScript==
// @name         CSDN 简化
// @namespace    https://huanfei.top/
// @version      0.0.2
// @description  去除 CSDN 博客多余杂项，保持页面简洁
// @author       huanfei
// @match        *://blog.csdn.net/*
// @icon         https://www.csdn.net/favicon.ico
// @grant        GM_addStyle
// @license      MIT License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/468655/CSDN%20%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/468655/CSDN%20%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    const style = [
        'aside.blog_container_aside{display:none}',
        'main{width:100%}',
        '#mainBox{width:70%}',
        '.recommend-box{display:none}',
        '#recommendNps{display:none !important}',
        '.option-box[data-type="guide"]{display:none !important}',
        '.option-box[data-type="cs"]{display:none !important}',
        '.hide-article-box.hide-article-pos{display:none !important}',
        '.passport-login-container{display:none !important}',
        '#articleSearchTip{display:none !important}',
        '.tool-active-list{display:none !important}',
        '.toolbar-btn-vip{display:none !important}',
        'li:has(a[href*="gitcode"]){display:none !important}',
        'li:has(a[href*="inscode"]){display:none !important}',
        'li:has(a[href*="summit"]){display:none !important}',
        'li:has(a[href*="so.csdn.net"]){display:none !important}',
    ];
    GM_addStyle(style.join(''));

    // 自由复制
    window.addEventListener('copy', e => e.stopPropagation(), true);

    document.onreadystatechange = () => {
        document.querySelector('.option-box[data-type="gotop"]').remove();
        const top = document.createElement('a');
        top.addEventListener('click', () => {
            window.scrollTo({ left: 0, top: 0 });
        });
        top.className = 'option-box';
        top.innerHTML = `<img src="https://g.csdnimg.cn/side-toolbar/3.4/images/fanhuidingbucopy.png" alt="" srcset="">
            <span class="show-txt">返回<br>顶部</span>`;
        document.querySelector('.csdn-side-toolbar ').appendChild(top);
    };
})();
