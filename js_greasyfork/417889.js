// ==UserScript==
// @name         sendMessage
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @license      MIT
// @description  各チャットサイトでメッセージを送信するライブラリです。
// @author       You
// @grant        none
// ==/UserScript==

(function(window) {
    'use strict';
    // エクスポート
    window.sendMessage = function(str, discord_token) {
        if (!str) return;
        // サイト別処理
        switch (location.href.replace(/^.+?\/\/|\/.*$/g, "").replace(/^(www)[0-9]+(\.x-feeder\.info)$/, "$1$2").replace(/^[^\.]*\.(open2ch\.net)$/, "$1")) {
            case "www.x-feeder.info":
                if (str.length > 1000) return;
                var xhr = new XMLHttpRequest(),
                    fd = new FormData();
                xhr.open("POST", location.href + "post_feed.php");
                fd.append("name", document.querySelector("#post_form_name").value);
                fd.append("comment", str);
                fd.append("is_special", 0);
                fd.append("category_id", 0);
                xhr.send(fd);
                break;
            case "pictsense.com":
                if (str.length > 200) return;
                document.querySelector("#chatText").value = str;
                document.querySelector("#chatSubmitButton").click();
                break;
            case "drrrkari.com":
                document.querySelector("textarea[name='message']").value = str;
                document.querySelector("input[name='post']").click();
                break;
            case "himachat.jp":
                if (str.length > 150) return;
                document.querySelector(".frombar").value = str;
                document.querySelector(".formbtn").click();
                break;
            case "www.3751chat.com":
                if (str.length > 1000) return;
                document.querySelector("#chat").value = str;
                document.querySelector("#say").click();
                break;
            case "discord.com":
                if (str.length > 2000 || !discord_token) return;
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://discord.com/api/v8/channels/" + location.href.match(/^https:\/\/discord\.com\/channels\/[0-9]+\/([0-9]+)$/)[1] + "/messages");
                xhr.setRequestHeader("authorization", discord_token);
                xhr.setRequestHeader("content-type", "application/json");
                xhr.send(JSON.stringify({
                    content: str,
                    tts: false
                }));
                break;
            case "open2ch.net":
                document.querySelector("#MESSAGE").value = str;
                document.querySelector("#submit_button").click();
                break;
        };
    };
})(window);