// ==UserScript==
// @name         Ignore Slack User
// @namespace    https://greasyfork.org/ja/scripts/10042
// @version      1.0.0
// @description  Ignore a user in Slack
// @author       bigwheel
// @match        https://*.slack.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10042/Ignore%20Slack%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/10042/Ignore%20Slack%20User.meta.js
// ==/UserScript==

// ここに無視したいユーザー・ボットの名前を並べる
var usersToBeIgnored = new Array("user1", "user2");

if(document.body) {
    $("#msgs_div").on('DOMSubtreeModified propertychange', function() {
        usersToBeIgnored.forEach(function(user) {
            $("div.message > *.message_sender:contains(" + user + ")").parent().hide();
        });

        // ボットメッセージを一括無視したい場合はコメントイン
        // $(".bot_message").hide();
        
        // join/left メッセージを無視
        $(".joined").hide();
        $(".left").hide();
    });
};
