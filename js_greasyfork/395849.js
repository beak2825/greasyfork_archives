// ==UserScript==
// @name         知乎手机页面优化
// @namespace    https://greasyfork.org/users/439775
// @version      0.3.5
// @description  知乎手机页面优化，自动展开，无APP提示
// @author       EricSong
// @include      http*://www.zhihu.com/question/*
// @include      http*://*.zhihu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395849/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/395849/%E7%9F%A5%E4%B9%8E%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getModalWrap = () => document.querySelector(".ModalWrap");

    const goAway = () => {
        // 移除遮罩层
        getModalWrap().remove();
        document.body.classList.remove("ModalWrap-body");
        document.body.style.overflow = "auto";

        // 展示所有内容
        const richContents = document.querySelectorAll('.RichContent');
        [...richContents].map(rc => {
            rc.classList.remove('is-collapsed');
            rc.querySelector('.RichContent-inner').style.maxHeight = 'unset';
        });

        // 回滚至页首
        window.scrollTo(0, 0);
    };

    const intervalId = setInterval(() => {
        // 移除App打开按钮
        const openInAppButton = document.querySelector('.OpenInAppButton')
        openInAppButton && openInAppButton.remove();

        const mw = getModalWrap();
        if (!mw) return;
        clearInterval(intervalId);
        goAway();
    }, 500);

    setTimeout(() => clearInterval(intervalId), 5000);

})();