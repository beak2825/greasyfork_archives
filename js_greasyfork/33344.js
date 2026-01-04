// ==UserScript==
// @name         百度网盘直接下载助手 生成链接到 Aria2 WebUI， 包含--out filename
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @require      https://code.jquery.com/jquery-latest.js
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/link*
// @match        *://yun.baidu.com/share/link*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/33344/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%E7%94%9F%E6%88%90%E9%93%BE%E6%8E%A5%E5%88%B0%20Aria2%20WebUI%EF%BC%8C%20%E5%8C%85%E5%90%AB--out%20filename.user.js
// @updateURL https://update.greasyfork.org/scripts/33344/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20%E7%94%9F%E6%88%90%E9%93%BE%E6%8E%A5%E5%88%B0%20Aria2%20WebUI%EF%BC%8C%20%E5%8C%85%E5%90%AB--out%20filename.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document.body).on('click', '.g-dropdown-button', function() {
        let id = 'dialog-copy-button-with-out';
        for (let i=0; i < 5; ++i) {
            setTimeout(() => {
                if (! document.getElementById(id)) {
                    $('.dialog').each(function() {
                        let $this = $(this);
                        if ($this.find('.dialog-header h3').text() === '批量链接') {
                            var $button = $this.find('.dialog-button > div').append(`<button id="${id}">复制为url --out filename</button>`);
                            $button.on('click', function() {
                                copyUrls($this);
                            });
                        }
                    });
                }
            }, 200 * i);
        }
    });

    function copyUrls($this) {
        let urls = [];
        $this.find('.dialog-body > div').each(function() {
            urls.push(`${$(this).find('a').attr('href')} --out=${$(this).find('div').text()}`);
        });
        urls = urls.join('\n');
        GM_setClipboard(urls, 'text');
        alert('已将链接复制到剪贴板！');
    }
})();