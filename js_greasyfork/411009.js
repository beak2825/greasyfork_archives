// ==UserScript==
// @name         简书链接跳转修正
// @namespace    https://fansy.cloud/
// @version      0.1
// @description  阻止简书点击链接进入跳转中间页面
// @author       Cheney
// @match        https://www.jianshu.com/go-wild?*
// @match        https://www.jianshu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411009/%E7%AE%80%E4%B9%A6%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/411009/%E7%AE%80%E4%B9%A6%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==


// 处理内容页
function handle_page_link() {
    var link_prefix = 'https://link.jianshu.com/?t=';
    var tags = document.getElementsByTagName('a');
    for (var i = 0; i < tags.length; i++) {
        var url = tags[i].href;
        if (url.startsWith(link_prefix)) {
            console.log(url);
            url = url.replace(link_prefix, '');
            tags[i].href = url;
        }
    }
}

// 处理跳转页
function handle_go_page() {
    // 链接框
    var ta = document.getElementsByTagName('textarea')[0];
    var ta_cls = ta.className;
    var url = ta.value;
    var container = ta.parentNode;
    // 移除textarea
    container.removeChild(ta);
    // 增加a标签
    var link = document.createElement('a');
    link.href = url;
    link.innerText = url;
    link.className = ta_cls;
    // fix link aligin
    link.style = 'text-align: left;';
    container.appendChild(link);
}


(function() {
    'use strict';

    var cur_url = window.location.href;
    if (cur_url.startsWith('https://www.jianshu.com/go-wild')) {
        handle_go_page();
    } else {
        handle_page_link();
    }

})();