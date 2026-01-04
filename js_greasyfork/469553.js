// ==UserScript==
// @name         淘宝、京东、拼多多网页版，隐藏1天内的追加评价
// @namespace    your-namespace
// @version      1.14
// @description  购物党查看追加评论用。根据正则表达式隐藏无效数据：0-1天的追加评论。
// @author       weakestan
// @match        https://mobile.pinduoduo.com/goods_comments.html*
// @match        https://detail.tmall.com/item.htm*
// @match        https://detail.tmall.hk/hk/item.htm*
// @match        https://item.taobao.com/item.htm*
// @match        https://item.jd.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469553/%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E7%BD%91%E9%A1%B5%E7%89%88%EF%BC%8C%E9%9A%90%E8%97%8F1%E5%A4%A9%E5%86%85%E7%9A%84%E8%BF%BD%E5%8A%A0%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/469553/%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E7%BD%91%E9%A1%B5%E7%89%88%EF%BC%8C%E9%9A%90%E8%97%8F1%E5%A4%A9%E5%86%85%E7%9A%84%E8%BF%BD%E5%8A%A0%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==



(function() {
	'use strict';

	var targets;
	 var hostname = window.location.host
 switch( hostname) {
 case 'mobile.pinduoduo.com':
 	targets  = {
        targetDivClass: 'pdd-list-container',
        targetValueRegex: /用户1天/,
        hideclass:'_5u0xYxN0',
        hidep:1
    };
         break;
 case 'detail.tmall.com':
 case 'detail.tmall.hk':
  	targets  = {
        targetDivClass: 'Comments',
        targetValueRegex: /^([01])天后追评/,
        hideclass:'Comment--root',
        hidep:5
    };
 break;
 case 'item.taobao.com':
   	targets  = {
        targetDivClass: 'tb-revbd',
        //大于1天才显示
        targetValueRegex: /确认收货后\s([01])\s天追加/,
        hideclass:'ReviewItem',
        hidep:4
    };
 break;
 case 'item.jd.com':
   	targets  = {
        targetDivClass: 'comment-3',
        //大于1天才显示
        targetValueRegex: /购买([当1])天后?追评/,
        hideclass:'comment-item',
        hidep:3
    };
 break;
 default:
targets  = {};
}


    // 监听页面的变化，当目标 div 下的子元素发生变化时进行处理
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            switch( hostname) {
                 case 'item.jd.com':
                     if (mutation.type === 'childList' && mutation.target.id.includes(targets.targetDivClass)) {
                    // if (mutation.type === 'childList' && mutation.target.classList.contains(targets.targetDivClass)) {
                handleChildListChange(mutation.target);
                     }
                break;
                default:
            if (mutation.type === 'childList' && mutation.target.classList.toString().includes(targets.targetDivClass)) {
           // if (mutation.type === 'childList' && mutation.target.classList.contains(targets.targetDivClass)) {
                handleChildListChange(mutation.target);
            }
            }
        }
    });

    // 开始监听根节点的子节点变化
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 处理目标 div 下子元素的变化
    function handleChildListChange(targetDiv) {
        var childElements = targetDiv.querySelectorAll('*');

        childElements.forEach(function(element, index) {
            var content = element.textContent.trim();
            if (targets.targetValueRegex.test(content)) {
                //保留第一项，因为有可能全部隐藏后，无法加载刷新下一页的代码。
                if (index != 0) {
                hideParentDiv(element);};
            }
        });
    }

    // 隐藏上一级 div
    function hideParentDiv(element) {
//       var parentDiv = element.parentElement.('div');
        var parentDiv = element;
	var i=targets.hidep;
        while (i>0)
        {
            i--;
            if (parentDiv.classList.toString().includes(targets.hideclass)) {break;}
            parentDiv = parentDiv.parentElement;

        }

        if (parentDiv) {
            parentDiv.style.display = 'none';
        }
    }
})();