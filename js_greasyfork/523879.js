// ==UserScript==
// @name         哔哩哔哩自动打开字幕.v1.0
// @namespace    http://tampermonkey.net/
// @version      2025-01-16
// @description  bilibili b站 哔哩哔哩 自动打开网站字幕
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523879/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95v10.user.js
// @updateURL https://update.greasyfork.org/scripts/523879/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let queryValue = '';
    // 定时检测URL是否发生变化
    let timer = setInterval(function() {
        // 获取URL中的查询字符串部分
        //const queryString = window.location.search;
        // 解析查询字符串，将参数以对象的形式存储
        //const params = new URLSearchParams(queryString);
        // 获取特定参数的值
        //const value = params.get('p');

        const queryString = window.location.pathname.trim();
        let params = queryString.split('/');
        let value = '';
        // list                      vedio
        // bvid在参数                bvid在路径
        // bvid相同，p存在；         bvid相同，p存在；
        // bvid不同，p不存在；       bvid不同，p不存在；
        const qs = window.location.search;
        const p = new URLSearchParams(qs);
        if (params[1] == 'list') {
            if(p.has('p')){
                value = p.get('bvid') + p.get('p');
            }else{
                value = p.get('bvid') + '0';
            }
        // vedio
        }else {
            if(p.has('p')){
                value = params[2] + p.get('p');
            }else{
                value = params[2] + '0';
            }
        }
        if (queryValue !== value) {
                openSubtitle();
                queryValue = value;
            }
    }, 2000);

    window.addEventListener('unload', function(_event) {
        clearInterval(timer)
    });

    function openSubtitle(){
        setTimeout(() => { document.querySelector('.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon').click(); }, 500)
    }
    // Your code here...
})();