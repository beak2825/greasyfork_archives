// ==UserScript==
// @name         VK: Friend Requests Bulk Operations
// @description  Manage your friend requests. Add all friends or cancel all subscriptions with just one button click. Very handy if you are a public person or a YouTube star with VK account for publicity, like my wife :3
// @version      0.3
// @date         2016-05-19
// @author       vipaware
// @namespace    https://greasyfork.org/en/users/9103-vipaware
// @match        *vk.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @require      https://greasyfork.org/scripts/386-waituntilexists/code/waitUntilExists.js?version=5026
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/19800/VK%3A%20Friend%20Requests%20Bulk%20Operations.user.js
// @updateURL https://update.greasyfork.org/scripts/19800/VK%3A%20Friend%20Requests%20Bulk%20Operations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var friendstab,
        hideall,
        addall,
        cancelall;

    $("#friends").waitUntilExists(function () {
        friendstab = $("#friends_req_tabs");
        if (!friendstab.length) return;

        hideall = $("#friends_hide_all");
        if (!hideall.length) return;

        hideall.text("Оставить всех");

        addall = $('<button class="flat_button fl_r" style="display: none; margin: 5px; background-color: #639EA8;">Добавить всех</button>').appendTo(friendstab);
        cancelall = $('<button class="flat_button fl_r" style="display: none; margin: 5px; background-color: #A1A863;">Отменить все заявки</button>').appendTo(friendstab);

        friendstab.find(".summary_tab_sel a, .summary_tab a").click(onTabClick);
        onTabClick();

        $(addall).click(buttonClick);
        $(cancelall).click(buttonClick);
    });

    function onTabClick() {
        var curtab = friendstab.find(".summary_tab_sel a").attr("id");
        if ("sum_tab_out_requests" == curtab) {
            addall.hide();
            cancelall.show();
        }
        else {
            addall.show();
            cancelall.hide();
        }
    }

    function buttonClick() {
        $(".user_block .flat_button").click();
    }

})();