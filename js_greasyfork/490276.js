// ==UserScript==
// @name         97代发网快速按图搜索
// @namespace    your-namespace
// @version      1.0.2
// @description  按Ctrl+鼠标右键自动跳转到当前图片的97代发网搜索，移除97代发网主图遮罩
// @match        *://*.97daifa.com/*
// @match        *://*.jinritemai.com/*
// @match        *://*.taobao.com/*
// @match        *://*.jd.com/*

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490276/97%E4%BB%A3%E5%8F%91%E7%BD%91%E5%BF%AB%E9%80%9F%E6%8C%89%E5%9B%BE%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/490276/97%E4%BB%A3%E5%8F%91%E7%BD%91%E5%BF%AB%E9%80%9F%E6%8C%89%E5%9B%BE%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

document.addEventListener('contextmenu', function(event) {
    var imageUrl = null;
    var target = event.target;

    if (target.tagName === 'IMG') {
        imageUrl = target.src;
    } else if (target.parentNode.tagName === 'IMG') {
        imageUrl = target.parentNode.src;
    }

    if (imageUrl && event.ctrlKey) {
        event.preventDefault();
        var urlToOpen = 'https://97daifa.com/searchSame/dsySearch?img_path=' + encodeURIComponent(imageUrl) + '&site_code=www';
        console.log('搜索地址：', urlToOpen);
        window.open(urlToOpen, '_blank');
    }
});

if (window.location.href.includes('97daifa.com')) {
    // 找到所有带有鼠标移动效果的元素
    var elements = document.querySelectorAll('*');

    // 遍历所有元素，检查是否有鼠标移动效果并移除它们
    elements.forEach(function(element) {
        var styles = getComputedStyle(element);
        if (styles.position === 'fixed' || styles.position === 'sticky') {
            element.remove();
        }
    });

    // 停止事件传播，以防止其他脚本重新添加遮罩效果
    document.addEventListener('mousemove', function(event) {
        event.stopPropagation();
    }, true);
}

