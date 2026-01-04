// ==UserScript==
// @name         移除网站内容复制小尾巴
// @namespace    love_sagiri
// @version      1.0.2
// @description  支持 CSDN/哔哩哔哩（bilibili、b站）/知乎
// @description  知乎免登录、CSDN免登陆
// @author       六天°
// @match        *://www.bilibili.com/read/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://www.zhihu.com/question/*
// @match        *://zhuanlan.zhihu.com/*
// @require      https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @icon         https://lh1.hetaousercontent.com/img/e2f8995d845f666d.png
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449506/%E7%A7%BB%E9%99%A4%E7%BD%91%E7%AB%99%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/449506/%E7%A7%BB%E9%99%A4%E7%BD%91%E7%AB%99%E5%86%85%E5%AE%B9%E5%A4%8D%E5%88%B6%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==
let config = {
    zhihuRemoveLogin: true, // 知乎免登陆
    csdnRemoveLogin: true, // csdn免登陆
}

function onCopy(read) {
    read.bind('copy',function(e){
        // 获取选中内容
        let text = window.getSelection().toString();
        // 复制到剪切板
        GM_setClipboard(text);
        // 停止事件冒泡
        return false;
    })
}

function zhihuRemoveLogin() {
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const target of mutation.addedNodes) {
                if (1 != target.nodeType) return; // 不是element
                if (target.querySelector('.signFlowModal')) { // 登录大弹窗
                    const button = target.querySelector('.Modal-closeButton');
                    button.click(); // 大弹窗需要点击关闭按钮触发事件恢复页面样式
                } else if (target.querySelector('.css-1izy64v')) { // 登录小弹窗
                    target.remove(); // 小弹窗可以直接remvoe
                }
            }
        }
    }
    const observer = new MutationObserver(callback);
    observer.observe(document, {childList: true, subtree: true});
}

function csdnRemoveLogin() {
    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const target of mutation.addedNodes) {
                if (1 != target.nodeType) return; // 不是element
                if (target.querySelector('#passportbox')) {
                    target.remove();
                }
            }
        }
    }
    const observer = new MutationObserver(callback);
    observer.observe(document, {childList: true, subtree: true});
}

function csdnCopy() {
    $('.hljs-button.signin').attr('data-title', '复制');
    $('.hljs-button.signin').click(function(){
        GM_setClipboard($(this).parent().text());
        $(this).attr('data-title', ' √ ');
        $(this).css('background', 'rgb(255,184,184)');
    });
    $('.hljs-button.signin').mouseleave(function(){
        $(this).css('background', '#9999aa');
        $(this).attr('data-title', '复制');
    });
}

(function() {
    'use strict';
    $(document).ready(function(){
        let read;
        if (location.host.includes('blog.csdn.net')){
            read = $('#js_content');
            $('code').css('user-select', 'text');
            if (config.csdnRemoveLogin) {
                csdnRemoveLogin();
            }
            csdnCopy();
        } else if (location.host.includes('bilibili')) {
            read = $('#read-article-holder');
        } else if (location.host.includes('zhihu')){
            read = $('.List-item');
            if (config.zhihuRemoveLogin) {
                zhihuRemoveLogin();
            }
        }
        onCopy(read);
    })

})();