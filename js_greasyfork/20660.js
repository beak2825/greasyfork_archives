"use strict";
// ==UserScript==
// @name           auto show more for YouTube
// @name:ja        YouTubeの「もっと見る」ボタンを自動で押す
// @description    this plugin will press "show more" button when it displayed by scrolling.
// @description:ja YouTube.comの「もっと見る」ボタンが、スクロールによって画面に表示された瞬間、自動で押されます。
// @namespace      https://twitter.com/sititou70
// @license        MIT
// @include        /https*:\/\/www\.youtube\.com\/.*/
// @version        2.2.4
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/20660/auto%20show%20more%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/20660/auto%20show%20more%20for%20YouTube.meta.js
// ==/UserScript==
// settings
var scroll_event_interval = 200;
var adjust_scroll_px = 0;
var target_infos = [
    {
        name: 'comment reply',
        selector: 'ytd-comment-thread-renderer > div > ytd-comment-replies-renderer > div > ytd-button-renderer',
        click_times: 1,
    },
    {
        name: 'more comment replies',
        selector: 'ytd-comment-thread-renderer > div > ytd-comment-replies-renderer > div > div > div > yt-next-continuation > tp-yt-paper-button',
        click_times: Infinity,
    },
    {
        name: 'comment read more',
        selector: 'ytd-comment-thread-renderer ytd-comment-renderer ytd-expander > tp-yt-paper-button',
        click_times: 1,
    },
    {
        name: 'video info',
        selector: 'ytd-expander.ytd-video-secondary-info-renderer > tp-yt-paper-button',
        click_times: 1,
    },
];
// global variables
var button_caches = {};
var initButtonCaches = function () {
    return target_infos.forEach(function (x) {
        button_caches[x.name] = [];
    });
};
initButtonCaches();
// utils
var user_agent = window.navigator.userAgent.toLowerCase();
var fireClickEvent = function (elem) {
    if (user_agent.match(/(msie|MSIE)/) || user_agent.match(/(T|t)rident/)) {
        elem.fireEvent('onclick');
    }
    else {
        var event_1 = document.createEvent('MouseEvents');
        event_1.initEvent('click', true, true);
        elem.dispatchEvent(event_1);
    }
};
// events
var scrollHandler = function () {
    return target_infos.forEach(function (target_info) {
        document.querySelectorAll(target_info.selector).forEach(function (elem) {
            var button_cahce = button_caches[target_info.name].find(function (y) { return y.elem === elem; });
            if (button_cahce === undefined) {
                button_cahce = {
                    elem: elem,
                    click_times: 0,
                };
                button_caches[target_info.name].push(button_cahce);
            }
            var click_times_flg = button_cahce.click_times < target_info.click_times;
            var button_position_flg = elem.getBoundingClientRect().y - window.innerHeight + adjust_scroll_px <
                0;
            if (click_times_flg && button_position_flg) {
                fireClickEvent(elem);
                button_cahce.click_times++;
                // highlight clicked button for debugging
                // (elem as any).style.border = '1px solid #f00';
            }
        });
    });
};
var waiting_for_scroll_event_interval = false;
document.addEventListener('scroll', function () {
    if (waiting_for_scroll_event_interval)
        return;
    waiting_for_scroll_event_interval = true;
    setTimeout(function () {
        waiting_for_scroll_event_interval = false;
    }, scroll_event_interval);
    scrollHandler();
});
document.addEventListener('click', function (e) {
    //let target = e.target;
    var event_target = e.target instanceof HTMLElement ? e.target : undefined;
    if (event_target === undefined)
        return;
    var current_target = event_target;
    while (current_target instanceof HTMLElement &&
        current_target !== document.body) {
        if (current_target.tagName === 'A') {
            initButtonCaches();
            return;
        }
        current_target = current_target.parentElement;
    }
});
