// ==UserScript==
// @name         vikacg去广告
// @namespace    https://github.com/fuyu2022
// @version      1.0.0
// @description  仅适用于vikacg的去广告插件
// @author       fuyu
// @match        https://www.vikacg.com
// @match        https://www.vikacg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vikacg.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519334/vikacg%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/519334/vikacg%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var new_style=document.createElement("style");
    document.head.appendChild(new_style);
    var PostCss=`
    /*首页/post*/
    div.card.mb-2[class="card mb-2"],
    div.card.mb-2[class="mb-2 card"],
    div.card[class="card"] > div > a > img,
    .card.my-2[class="card my-2"],
    div.three-column.my-2 > a > img
    {
        display:none;
    }
    `
    var PCss=`
    /*单个文章/p*/
    div.entry-header > div.post-title,
    div.post-title.card.mb-2,
    div.next-comment.card.mb-2
    {
        display:none;
    }
    `
    var CircleCss=`
    /*圈子/circle*/
    div.three-column-middle > div > div.card.mb-2.shadow-blur.blur-material > div.box,
    div.three-column-right > div.right-column-box > div.shadow-blur.blur-material > iframe
    {
        display:none;
    }
    `
    var WalletCss=`
   /*积分管理界面/wallet*/
    div.three-column > div.three-column-middle > div.position-relative.mb-2.card + div,
    div.three-column-middle > div.flex.flex-col > div > iframe
    {
        display:none;
    }
    `
    var ExternalCss=`
    /*外链检查/external*/
    div.container > div.row > div.col-lg-12.mx-auto > div.flex.flex-col.banner
    {
        display:none;
    }
    `
    var ResourcesCss=`
    /*外链检查/resources*/
    #__nuxt > div > div.container.mt-12 > div > div.card.mb-2
    {
        display:none;
    }
    `
    var MessageCss=`
    /*外链检查/message*/
    div.container.chat-windows.mt-12+div > div > a
    {
        display:none;
    }
    `

// 保存原始的 pushState 和 replaceState 方法
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

// 扩展 pushState 方法
history.pushState = function (...args) {
    const result = originalPushState.apply(this, args); // 调用原始方法
    window.dispatchEvent(new Event("locationchange")); // 触发自定义事件
    return result;
};

// 扩展 replaceState 方法
history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args); // 调用原始方法
    window.dispatchEvent(new Event("locationchange")); // 触发自定义事件
    return result;
};

// 监听 popstate 和自定义的 locationchange 事件
window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange")); // 保持统一事件
});


// 路由变化时更新样式
window.addEventListener("locationchange", updateStylesBasedOnRoute);

function updateStylesBasedOnRoute() {
    let cssRules;
    if (window.location.pathname === '/' || window.location.pathname.includes('/post')) {
        cssRules = PostCss; // 直接设置新的样式内容
    }
    else if (window.location.pathname.includes('/p/')) {
        cssRules = PCss;
    }
    else if (window.location.pathname.includes('/circle')) {
        cssRules = CircleCss;
    }
    else if (window.location.pathname.includes('/wallet')) {
        cssRules = WalletCss;
    }
    else if (window.location.pathname.includes('/external')) {
        cssRules = ExternalCss;
    }
    else if (window.location.pathname.includes('/resources') || window.location.pathname.includes('/study') || window.location.pathname.includes('/reads')) {
        cssRules = ResourcesCss;
    }
    else if (window.location.pathname.includes('/message')) {
        cssRules = MessageCss;
    }

    // 使用文本节点更新样式内容
    const textNode = document.createTextNode(cssRules); // 创建文本节点
    new_style.appendChild(textNode); // 将新的文本节点添加到 <style> 元素中
    // 清除除了最后一个节点外的所有节点
    setTimeout(()=>{
        while (new_style.childNodes.length > 1) {
            new_style.removeChild(new_style.firstChild); // 移除除最后一个节点外的所有子节点
        }
    },1000);

}

})();