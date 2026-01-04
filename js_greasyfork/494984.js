// ==UserScript==
// @name         汉语拼音
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Translate selected text to pinyin and display it
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/494984/%E6%B1%89%E8%AF%AD%E6%8B%BC%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/494984/%E6%B1%89%E8%AF%AD%E6%8B%BC%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom style for the pinyin display
    GM_addStyle(`
        .pinyin-result {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background-color: #f1f1f1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            color: red;
        }
    `);

    $(document).on('mouseup', function() {
        var selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            translateToPinyin(selectedText);
        }
    });

    function translateToPinyin(text) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://pinyin.yingyuw.cn/ajax.php?action=pinyin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `kg=1&contents=${encodeURIComponent(text)}&yd=1`,
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                if (data.status === 1 && data.pinyin) {
                    showPinyinResult(data.pinyin);
                } else {
                    console.error('Error translating to pinyin:', data);
                }
            }
        });
    }

    function showPinyinResult(pinyin) {
        var resultDiv = $('<div>', {
            class: 'pinyin-result',
            text: `${pinyin}`
        });

        $('body').append(resultDiv);

        setTimeout(function() {
            resultDiv.fadeOut(500, function() {
                $(this).remove();
            });
        }, 2000);
    }
})();
