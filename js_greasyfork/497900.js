// ==UserScript==
// @name         ニコニコ動画(Re:仮)コメントフィルター(仮)
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Filter out specific comments from JSON response
// @author       Velgail
// @match        https://www.nicovideo.jp/watch_tmp/*
// @grant        none
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/497900/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC%28%E4%BB%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497900/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%28Re%3A%E4%BB%AE%29%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC%28%E4%BB%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of NG comments
    const ngComments = [
        "んん～まかｧｧウｯｯ!!!!🤏😎",
        "にょ、にょまれ～～✋🐮🤚💦",
        // ここに他のNGコメントを追加
    ];

    // Intercept the fetch function
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.startsWith('https://nvapi.nicovideo.jp/v1/tmp/comments/')) {
            return originalFetch(url, options).then(response => {
                return response.json().then(data => {
                    // Filter the comments here
                    if (data.data && data.data.comments) {
                        data.data.comments = data.data.comments.filter(comment => !ngComments.includes(comment.message));
                    }
                    // Create a new Response object with the modified data
                    const modifiedResponse = new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                    return modifiedResponse;
                });
            });
        }
        return originalFetch(url, options);
    };

    // Intercept the XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && this._url.startsWith('https://nvapi.nicovideo.jp/v1/tmp/comments/')) {
                try {
                    const jsonResponse = JSON.parse(this.responseText);
                    // Filter the comments here
                    if (jsonResponse.data && jsonResponse.data.comments) {
                        jsonResponse.data.comments = jsonResponse.data.comments.filter(comment => !ngComments.includes(comment.message));
                    }
                    // Override the responseText property
                    Object.defineProperty(this, 'responseText', { value: JSON.stringify(jsonResponse) });
                } catch (e) {
                    console.error('Failed to modify JSON response', e);
                }
            }
        });
        return originalSend.apply(this, arguments);
    };
})();
