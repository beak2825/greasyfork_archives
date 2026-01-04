// ==UserScript==
// @name         精進開始ボタン！
// @namespace    https://greasyfork.org/
// @version      2.6
// @description  精進開始するときに，Discord に問題のリンクを送ります。
// @author       achapi
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/527226/%E7%B2%BE%E9%80%B2%E9%96%8B%E5%A7%8B%E3%83%9C%E3%82%BF%E3%83%B3%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/527226/%E7%B2%BE%E9%80%B2%E9%96%8B%E5%A7%8B%E3%83%9C%E3%82%BF%E3%83%B3%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sendMessage() {
        const link = document.querySelector('a[href^="/users/"]');
        const username = link ? link.getAttribute('href').split('/').pop() : null;

        if (!username) return;

        const url = window.location.href;
        const title = document.title;
        const message = `${title}\n<${url}>`;
        const finalMessage = `${username}さんが精進を開始します！\n${message}`;


        GM_xmlhttpRequest({
            method: "POST",
            url: "https://script.google.com/macros/s/AKfycbyQAlMqNsDX1j0cjAmF8DczzUh9855CMs65aVdlAgoSM6SFl0pT8WwC-6dQCKg7iWR5/exec",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ message: finalMessage }),
            onload: function(response) {
                console.log("送信に成功しました");
            },
            onerror: function() {
                console.error("送信に失敗しました");
            }
        });
    }

    const observer = new MutationObserver(() => {
        const link = document.querySelector('a[href^="/users/"]');
        if (link) {
            observer.disconnect();
            sendMessage();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

