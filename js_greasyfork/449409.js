// ==UserScript==
// @name         Google Translate Audio Download
// @namespace    Quoyi
// @version      0.1
// @description  下载 Google 翻译的英语发音
// @author       iQuoyi
// @match        https://guides.rubyonrails.org/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        unsafeWindow
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449409/Google%20Translate%20Audio%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/449409/Google%20Translate%20Audio%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.jQuery;

    $(function() {
        document.addEventListener('mouseup', event => {
            // 获取选中文本
            const text = window.getSelection().toString();
            if (text.length) {
                // 获取发音文件并保存
                $('<button/>', {
                    id: 'download-button',
                    text: '下载',
                    style: `position: absolute; left: ${event.layerX}px; top: ${event.layerY - 20}px; z-index: 1024;`,
                    click: (e) => GM_download({
                        url: `https://translate.google.com/translate_tts?client=tw-ob&tl=en&q=${text}`,
                        name: `${text}.mp3`,
                        saveAs: false
                    }),
                }).appendTo('body');
            } else {
                // 清除已有按钮
                $('#download-button').remove();
            }
        });
    });
})();