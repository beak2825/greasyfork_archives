// ==UserScript==
// @name         优化移动端知乎网页
// @version      1.5
// @description  自动展开，去除app下载，去除打开app
// @author       Zruiry
// @match        https://www.zhihu.com/question/*
// @grant        none
// @namespace    Zruiry
// @downloadURL https://update.greasyfork.org/scripts/414014/%E4%BC%98%E5%8C%96%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/414014/%E4%BC%98%E5%8C%96%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {

    // 知乎消除
    const ele = [
        // 头部下载app
        '.MobileAppHeader-downloadLink',
        // 底部悬浮的打开app
        '.OpenInAppButton',
        // 打开app查看更多评论
        '.CommentsForOia .Button',
        // 评论下方广告
        '.MBannerAd',
        // 相关推荐
        '.RelatedReadings',
        // 热门推荐
        '.HotQuestions'
    ];
    for (let e of ele) {
        document.querySelector('style').innerHTML += e + `{display: none !important;}`;
    }

    // 优化头部
    document.getElementsByClassName('MobileAppHeader-authLink')[0].innerText = '登录';
    document.getElementsByClassName('MobileAppHeader-searchBoxWithUnlogin')[0].style.width = 'calc(100vw - 170px)'

    try {
        // 消除遮屏弹窗
        var obj = document.querySelector('.ModalWrap').children[0];
        obj.children[0].setAttribute('class', '');
        obj.children[1].setAttribute('class', 'ModalExp-content');
        obj.setAttribute('data-stop-scroll-propagation', false);
    } catch (e) {
        console.log(e);
    }

    try {
        // 自动展开
        var open = document.querySelector('.RichContent');
        open.setAttribute('class', 'RichContent RichContent--unescapable');
        open.removeChild(open.childNodes[1]);
        document.querySelector('.RichContent-inner').setAttribute('style', 'max-height: auto !important;');
        document.querySelector('.ContentItem-actions').setAttribute('class', 'ContentItem-actions RichContent-actions');
    } catch (e) {
        console.log(e);
    }

    try {
        // 开启页面滚动
        document.querySelector('body').setAttribute('class', 'Body--Mobile Body--Android');
        document.querySelector('body').setAttribute('style', 'overflow: auto');
    } catch (e) {
        console.log(e);
    }

})();