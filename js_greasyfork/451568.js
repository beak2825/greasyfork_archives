// ==UserScript==
// @name         Bilibili 部分功能优化
// @author       saplf
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自用
// @author       You
// @match        *://*.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451568/Bilibili%20%E9%83%A8%E5%88%86%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451568/Bilibili%20%E9%83%A8%E5%88%86%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 是否移除 bilibili 刷新页面后、重新定位上一次滚动条位置的功能
var removeHistoryRestoration = true;
// hover 延时，ms，该时间以内不触发鼠标移入事件
var delayTimeout = 1000;
// 鼠标移入事件对应 element 的 className
var delayClassNames = [
    'bili-dyn-avatar',
    'dyn-orig-author__face',
    'dyn-orig-author__name',
    'bili-dyn-live-users__item__face-container',
    'bili-dyn-live-users__item__uname',
];

function delayEvent() {
    var placeToReplace;
    if (window.EventTarget && EventTarget.prototype.addEventListener) {
        placeToReplace = EventTarget;
    } else {
        placeToReplace = Element;
    }

    placeToReplace.prototype.oldAddEventListener = placeToReplace.prototype.addEventListener;
    placeToReplace.prototype.addEventListener = function (type, handler, options) {
        if (type === 'mouseenter' && detectDelayElement(this)) {
            var flag;
            this.oldAddEventListener(type, function(event) {
                flag = setTimeout(function() {
                    handler(event);
                }, delayTimeout)
            }, options);
            this.addEventListener('mouseleave', function(e) {
                if (flag) {
                    clearTimeout(flag);
                    flag = undefined;
                }
            });
        } else {
            this.oldAddEventListener(type, handler, options);
        }
    }
}

function detectDelayElement(ele) {
    return ele && delayClassNames.some(function (it) { return ele.classList.contains(it) });
}

(function() {
    'use strict';

    if (removeHistoryRestoration && history.scrollRestoration) {
        history.scrollRestoration = "manual";
    }

    window.addEventListener('load', delayEvent);
})();