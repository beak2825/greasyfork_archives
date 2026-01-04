

// ==UserScript==
// @name          control2
// @namespace
// @description   脚本描述
// @include       https://www.bix23ia.org/*
// @include       https://bix333ia.org/*
// @version 0.0.1.20210207163219
// @namespace https://greasyfork.org/users/175883
// @downloadURL https://update.greasyfork.org/scripts/421374/control2.user.js
// @updateURL https://update.greasyfork.org/scripts/421374/control2.meta.js
// ==/UserScript==

 
(function() {
    //后台版本头{yy}后台版本尾
    
    //更新地址头{}更新地址尾
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