// ==UserScript==
// @name Accessibility for Bilibili Web
// @namespace https://www.viyf.org
// @version 0.1.4
// @description Bilibili 可访问性优化。
// @author ABitGlow
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421761/Accessibility%20for%20Bilibili%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/421761/Accessibility%20for%20Bilibili%20Web.meta.js
// ==/UserScript==

/** 被扫除的障碍清单
 * “点赞”、“投币”、“收藏”、“分享” 按钮缺乏键盘操作能力；
 * “搜索” 按钮无可访问性文字描述；
 * 弹幕、 CC 字幕没有添加 ARIA Live Region 相关属性；
 * “弹幕” 开关无可访问性文字描述；
 * “发送” 弹幕按钮无键盘聚焦能力；
 * 当播放器组件加载完成后 “播放”/“暂停” 按钮没有获取焦点；
 */

(function () {
    'use strict';

    /* 给选择器指定的元素添加属性值。 */
    function setElementAttribute(selector, name, value) {
        var list = document.querySelectorAll(selector);
        Array.prototype.forEach.call(list, function (e) {
            e.setAttribute(name, value);
        });
        return list.length;
    }

    /* 用于 KeyboardEvent 的回调函数。 当回车键和空格键按下引发该元素的 click 事件。 */
    function keySpaceOrEnterToClick(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.click();
        }
    }

    /* 页面加载完成后对一些元素进行处理。 */
    function processLoadedHTML() {
        setElementAttribute('#arc_toolbar_report > div.ops > span', 'tabindex', '0');
        setElementAttribute('#arc_toolbar_report > div.ops > span', 'role', 'button');

        var list = document.querySelectorAll('#arc_toolbar_report > div.ops > span');
        Array.prototype.forEach.call(list, function (e) {
            e.addEventListener('keydown', keySpaceOrEnterToClick, null);
        });
    }

    setTimeout(processLoadedHTML, 1000);

    /* 处理搜索按钮。 */
    (function () {
        var countdown = 10;
        var intervalID = setInterval(function () {
            if (setElementAttribute('#nav_searchform > div > button', 'aria-label', '搜索') > 0) {
                clearInterval(intervalID);
            }
            if (countdown < 1) {
                clearInterval(intervalID);
            }
            countdown--;
        }, 1000);
    })();

    /* 处理播放器组件。 */
    function processPlayer() {
        setElementAttribute('div.subtitle-wrap, div.bilibili-player-video-danmaku', 'aria-live', 'polite');
        setElementAttribute('div.bilibili-player-video-danmaku', 'aria-live', 'polite');
        setElementAttribute('div.bui-button', 'role', 'button');
        setElementAttribute('div.bui-button', 'tabindex', '0');
        setElementAttribute('div.bilibili-player-video-danmaku-switch > input', 'aria-label', '弹幕');

        /* 播放器加载完成后让 “播放/暂停” 按钮获取焦点。 */
        var btnElement = document.querySelector('div.bilibili-player-video-btn.bilibili-player-video-btn-start > button');
        if (btnElement) {
            btnElement.focus();
        }
    }

    /* 给播放器组件添加观察器。 */
    var elementToObserve = document.getElementById('bilibili-player');
    var config = {
        childList: true,
        subtree: true
    };
    var callback = function (mutationsList, observer) {
        mutationsList.forEach(function (record) {
            if (record.target.classList.contains('bilibili-player-video-wrap')) {
                processPlayer();
            }
        });
    };
    var observer = new MutationObserver(callback);
    observer.observe(elementToObserve, config);
})();
