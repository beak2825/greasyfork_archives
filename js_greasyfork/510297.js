// ==UserScript==
// @name         [银河奶牛]强化模拟网页助手
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  重定向 jQuery 库请求
// @match        https://doh-nuts.github.io/*
// @license      Truth_Light
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/510297/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BC%BA%E5%8C%96%E6%A8%A1%E6%8B%9F%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/510297/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BC%BA%E5%8C%96%E6%A8%A1%E6%8B%9F%E7%BD%91%E9%A1%B5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    const originalUrl = "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
    const newUrl = "https//code.jquery.com/jquery-3.7.1.min.js";
    GM_xmlhttpRequest({
        method: "GET",
        url: newUrl,
        onload: function(response) {
            if (response.status === 200) {
                const script = document.createElement('script');
                script.textContent = response.responseText;
                document.head.appendChild(script);
            } else {
                fallbackToOriginal();
            }
        },
        onerror: function() {
            fallbackToOriginal();
        }
    });

    function fallbackToOriginal() {
        GM_xmlhttpRequest({
            method: "GET",
            url: originalUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const script = document.createElement('script');
                    script.textContent = response.responseText;
                    document.head.appendChild(script);
                }
            }
        });
    }
})();
