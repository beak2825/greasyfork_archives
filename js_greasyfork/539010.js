// ==UserScript==
// @name         攔截B站快捷鍵w.a.s.d.e.r但不影響其他腳本或擴充功能，並新增逐幀進退功能與開關彈幕
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  攔截B站快捷鍵w.a.s.d.e.r，新增「,」(後退1幀)「.」(前進1幀)「T」（開關彈幕）
// @author       shanlan(grok-4-fast-reasoning)
// @match        *://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539010/%E6%94%94%E6%88%AAB%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%8D%B5wasder%E4%BD%86%E4%B8%8D%E5%BD%B1%E9%9F%BF%E5%85%B6%E4%BB%96%E8%85%B3%E6%9C%AC%E6%88%96%E6%93%B4%E5%85%85%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%B8%A6%E6%96%B0%E5%A2%9E%E9%80%90%E5%B9%80%E9%80%B2%E9%80%80%E5%8A%9F%E8%83%BD%E8%88%87%E9%96%8B%E9%97%9C%E5%BD%88%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539010/%E6%94%94%E6%88%AAB%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%8D%B5wasder%E4%BD%86%E4%B8%8D%E5%BD%B1%E9%9F%BF%E5%85%B6%E4%BB%96%E8%85%B3%E6%9C%AC%E6%88%96%E6%93%B4%E5%85%85%E5%8A%9F%E8%83%BD%EF%BC%8C%E4%B8%A6%E6%96%B0%E5%A2%9E%E9%80%90%E5%B9%80%E9%80%B2%E9%80%80%E5%8A%9F%E8%83%BD%E8%88%87%E9%96%8B%E9%97%9C%E5%BD%88%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rawAddEventListener = window.addEventListener;

    window.addEventListener = function(type, listener, options) {
        if (type === 'keydown' && typeof listener === 'function') {
            const wrapped = function(e) {
                if (['w','a','s','d','e','r'].includes(e.key.toLowerCase())) {
                    return;
                }
                return listener.apply(this, arguments);
            };
            return rawAddEventListener.call(this, type, wrapped, options);
        }
        return rawAddEventListener.call(this, type, listener, options);
    };

    let video = null;
    let frameTime = 1 / 60;

    function init() {
        if (window.__playinfo__?.data?.dash?.video?.[0]?.frame_rate) {
            frameTime = 1 / parseFloat(window.__playinfo__.data.dash.video[0].frame_rate);
        }

        video = document.querySelector('video');
        if (!video) {
            new MutationObserver(() => {
                video = document.querySelector('video');
                if (video) bindEvents();
            }).observe(document.body, { childList: true, subtree: true });
            return setTimeout(init, 500);
        }
        bindEvents();
    }

    function bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.target !== document.body || !video || (e.key !== ',' && e.key !== '.' && e.key !== 't')) return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (e.key === 't') {
                const dmSwitch = document.querySelector('.bui-danmaku-switch-input');
                if (dmSwitch) {
                    dmSwitch.checked = !dmSwitch.checked;
                    dmSwitch.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } else if (e.key === ',') {
                video.currentTime = Math.max(0, video.currentTime - frameTime);
                video.pause();
            } else {
                video.currentTime += frameTime;
                video.pause();
            }
        }, {capture: true});
    }

    setTimeout(init, 1000);

})();