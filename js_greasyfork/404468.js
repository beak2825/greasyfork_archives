// ==UserScript==
// @name         Tapd2md
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  修改复制tapd的链接符合markdown格式
// @author       CrazyHuiLiang
// @match        https://www.tapd.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404468/Tapd2md.user.js
// @updateURL https://update.greasyfork.org/scripts/404468/Tapd2md.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // tapd复制出的文本转变为markdown link格式
    function tapd2md(text) {
        if (text.startsWith('[')) {
            return text;
        }
        return text.replace(/(?<title>.*?)[\n\r]*(?<url>https?:\/\/www\.tapd\.cn.*)/, "[$<title>]($<url>)")
    }
    // 转换
    function translate() {
        const copyBt = $('#title-copy-btn');
        const text = copyBt.data('clipboard-text');
        if (!text || text.startsWith('[')) {
            return;
        }
        const mdText= tapd2md(text);
        $('#title-copy-btn').attr('data-clipboard-text', mdText);
    }
    translate();
    setInterval(translate, 500);
})();