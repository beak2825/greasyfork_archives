// ==UserScript==
// @name         カスタムくん[EXT]
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @description  入力欄に文字列を改行で区切って入力して「投稿」ボタンを押すと文字列の中からランダムで一つ投稿してくれます。
// @author       You
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/*
// @match        http://drrrkari.com/room/
// @match        http://www.3751chat.com/ChatRoom*
// @match        https://pictsense.com/*
// @match        http://www.himachat.com/
// @match        https://discord.com/*
// @match        https://*.open2ch.net/*
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419945-global-managedextensions/code/Global_ManagedExtensions.js?version=889360
// @require      https://greasyfork.org/scripts/419888-antimatterx/code/antimatterx.js?version=889299
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/419953/%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%81%8F%E3%82%93%5BEXT%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/419953/%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%81%8F%E3%82%93%5BEXT%5D.meta.js
// ==/UserScript==

(function(unsafeWindow) {
    'use strict';
    var $ = window.$,
        amx = window.antimatterx;
    unsafeWindow.Global_ManagedExtensions["カスタムくん"] = {
        config: function(say) {
            var h = $("<div>"),
                isDiscord = (amx.parseURL().domainname === "discord.com");
            if (isDiscord) {
                var inputDiscordToken = $(amx.addInputText(h[0], {
                    title: "authorization",
                    placeholder: "発言に必要なキー",
                    width: "50%",
                    save: "authorization"
                })).after("<br><br>");
            };
            var inputMessages = $(amx.addInputText(h[0], {
                    textarea: true,
                    placeholder: "改行で区切って入力",
                    save: "messages"
                })),
                postBtn = amx.addButton(h[0], {
                    title: "投稿",
                    click: function() {
                        var messages = inputMessages.val().split("\n").filter(function(v) {
                            return v.length > 0;
                        });
                        if (messages.length === 0 || isDiscord && inputDiscordToken.val().length === 0) return;
                        say(amx.randArray(messages), inputDiscordToken === undefined ? undefined : inputDiscordToken.val());
                    }
                });
            return h;
        }
    };
})(this.unsafeWindow || window);