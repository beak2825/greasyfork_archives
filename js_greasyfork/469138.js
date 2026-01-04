// ==UserScript==
// @name         移除百度首页推荐
// @version      0.08
// @author       wangws
// @namespace    https://www.acfun.cn/u/955021
// @match        https://www.baidu.com/*
// @match        https://ipv6.baidu.com/*
// @description:zh-cn 百度首页推荐内容移除
// @description 百度首页推荐内容移除
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469138/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/469138/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==
function removeElementById(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.remove();
    } else {
        console.warn(`Element with ID "${elementId}" not found.`);
    }
}

function removeElementsByClassName(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].remove();
    }
}

// 删除搜索框下方热搜
removeElementById('s_new_search_guide');

// 删除搜索框下方热搜（重复代码，可以移除）
// document.getElementsByClassName('new_search_guide_bub').remove();

setTimeout(function () {
    // 点开我的关注
    let mine = document.getElementById('s_menu_mine');
    if (mine) {
        mine.click();
    } else {
        console.warn('Element with ID "s_menu_mine" not found.');
    }

    let s_wrap = document.getElementById('s_wrap');
    s_wrap.style.marginTop = '50px'
    // 删除搜索框下方热搜
    removeElementById('s-hotsearch-wrapper');

    // 删除推荐tab以及推荐内容
    removeElementsByClassName('s-menu-item');

    // 删除搜索框内新闻
    let kw = document.getElementById('kw');
    if (kw) {
        kw.setAttribute('placeholder', '');
    } else {
        console.warn('Element with ID "kw" not found.');
    }
    //removeElementsByClassName('san-card');
    //优化首页格式
   //删除ai应用
   const e6 = document.querySelector('.card_item_3ZXS3');
   if (e6) {
     e6.remove();
   }
    console.log('e6',e6)
   // 获取第一个匹配的元素
   const e1 = document.querySelector('.c-wrapper-hot-news-all');
   if (e1) {
     e1.style.width = '65%'; // 设置宽度为 60%
   }
   const e2 = document.querySelector('.destop_wrapper_small .cardWidth_gb31u');
   if (e2) {
     e2.style.width = '100%';
   }
   const e3 = document.querySelector('.destop_wrapper_small.destop_wrapper_3m2ep');
   if (e3) {
     e3.style.width = '100%';
   }
   const e4 = document.querySelector('.destop_wrapper_small .card_layout_11HoJ .content_2q4gZ');
   if (e4) {
     e4.style.width = '100%';
   }
   const e5 = document.querySelectorAll('.destop_wrapper_small .site-container_3QJpT .cate-site-container_ditOw');
   e5.forEach(e5 => {
     e5.style.width = '100%';
     //e5.style.marginRight = '-50px';
   });
    // 直接选择 tpl="ai-feed" 的 san-card 元素并删除
    const targetElement = document.querySelector('.san-card[tpl="ai-feed"]');
    if (targetElement) {
        targetElement.remove();
        console.log('已删除元素:', targetElement);
    }
}, 500);