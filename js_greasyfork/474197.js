// ==UserScript==
// @name         読書メーターのステータスをMisskeyインスタンスに投稿する奴
// @namespace    @izumoti@submarin.online
// @version      0.1
// @description  読書メーターのステータスをMisskeyインスタンスに投稿する
// @author       izumochi
// @match        *://bookmeter.com/*
// @connect      bookmeter.com
// @connect      submarin.online
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/474197/%E8%AA%AD%E6%9B%B8%E3%83%A1%E3%83%BC%E3%82%BF%E3%83%BC%E3%81%AE%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%82%92Misskey%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AB%E6%8A%95%E7%A8%BF%E3%81%99%E3%82%8B%E5%A5%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/474197/%E8%AA%AD%E6%9B%B8%E3%83%A1%E3%83%BC%E3%82%BF%E3%83%BC%E3%81%AE%E3%82%B9%E3%83%86%E3%83%BC%E3%82%BF%E3%82%B9%E3%82%92Misskey%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AB%E6%8A%95%E7%A8%BF%E3%81%99%E3%82%8B%E5%A5%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration for Misskey
    const MISSKEY_INSTANCE = GM_getValue('misskey_instance', '');
    const MISSKEY_TOKEN = GM_getValue('misskey_token', '');
    const MISSKEY_VISIBILITY = GM_getValue('misskey_visibility', '');

    GM_registerMenuCommand('Set Misskey Instance', function() {
        const instance = prompt('Enter your Misskey instance (e.g., misskey.io):', MISSKEY_INSTANCE);
        if (instance) GM_setValue('misskey_instance', instance);
    });

    GM_registerMenuCommand('Set Misskey Token', function() {
        const token = prompt('Enter your Misskey token:', MISSKEY_TOKEN);
        if (token) GM_setValue('misskey_token', token);
    });

    GM_registerMenuCommand('Set Misskey Visibility', function() {
        const visibility = prompt('Enter your Misskey post visibility (public, home, followers):', MISSKEY_VISIBILITY);
        if (visibility) GM_setValue('misskey_visibility', visibility);
    });


    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this.url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        console.log('XMLHttpRequest send triggered with URL:', this.url); // Debug log

        if (this.url && this.url.includes('/users/') && (this.url.includes('/books/read') || this.url.includes('/books/wish') || this.url.includes('/books/stacked') || this.url.includes('/books/reading'))) {
            this.addEventListener('load', function() {
                try {
                    console.log('Response data:', this.responseText); // Debug log

                    const responseData = JSON.parse(this.responseText);
                    const path = "https://bookmeter.com" + responseData.path;
                    const title = responseData.book.title;

                    let status = "";

                    if (this.url.includes('/books/reading')) {
                        status = "読んでる";
                    } else if (this.url.includes('/books/wish')) {
                        status = "読みたい";
                    } else if (this.url.includes('/books/stacked')) {
                        status = "積んだ";
                    } else if (this.url.includes('/books/read')) {
                        status = "読んだ";
                    }

                    postToMisskey(`${title}\nステータスを${status}に設定しました\nURL: ${path}`);
                } catch (e) {
                    console.error('Error parsing response:', e);
                }
            });
        } else {
            console.log('Skipped due to URL not matching criteria.'); // Debug log
        }

        return originalSend.apply(this, args);
    };

    function postToMisskey(text) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `https://${MISSKEY_INSTANCE}/api/notes/create`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                text: text,
                i: MISSKEY_TOKEN,
                visibility: MISSKEY_VISIBILITY
            }),
            onload: function(response) {
                console.log('Posted to Misskey:', response);
            },
            onerror: function(error) {
                console.error('Error posting to Misskey:', error);
            }
        });
    }
})();
