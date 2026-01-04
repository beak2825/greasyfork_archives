// ==UserScript==
// @name                Trello Only see Subscribed
// @name:zh-CN          Trello 只看关注
// @namespace           http://www.qs5.org/?trello_only_see
// @version             0.1
// @description         Add watch-only features to Trello kanbans
// @description:zh-CN   给 Trello 看板添加只看关注功能
// @author              ImDong
// @match               https://trello.com/b/*
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/368786/Trello%20Only%20see%20Subscribed.user.js
// @updateURL https://update.greasyfork.org/scripts/368786/Trello%20Only%20see%20Subscribed.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加只看关注按钮
    $('.board-header-btns .js-board-header-subscribed').before('<a class="board-header-btn sub-btn js-board-header-only-subscribed" href="#"><span class="icon-sm icon-subscribe board-header-btn-icon"></span><span class="board-header-btn-text u-text-underline">只看关注</span></a>');

    // 绑定事件
    $('.board-header-btns').on('click', '.js-board-header-only-subscribed', function (e) {
        // 判断查看状态 为 true 则只看关注
        var subscribedStatus = GM_getValue('subscribedStatus', false);
        $(this).find('.board-header-btn-text').text(subscribedStatus ? '只看关注' : '查看全部');
        GM_setValue('subscribedStatus', !subscribedStatus);

        if (subscribedStatus) {
            $('#board .js-list').each(function (key, item) {
                item.classList.remove('hide');
            });
        } else {
            $('#board .js-list').each(function (key, item) {
                var subscribed = $(item).find('.list-header-extras .js-list-subscribed');
                if (subscribed.hasClass('hide')) {
                    item.classList.add('hide');
                }
            });
        }
    });

    // 打开时页面判断
    if (GM_getValue('subscribedStatus', false)) {
        GM_setValue('subscribedStatus', false);
        $('.board-header-btns .js-board-header-only-subscribed').click();
    }
})();