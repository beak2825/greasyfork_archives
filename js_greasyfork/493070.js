// ==UserScript==
// @name         Convert LF to CRLF
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Automatically convert line feed (LF) to carriage return + line feed (CRLF) when copying text from web pages. 可以让复制的greasy fork代码支持在via直接新建，也可以让系统菜单复制的通义千问移动端网页的代码在便签APP正常换行。UserScript完全由通义千问生成。
// @author       幸福的赢得
// @match        *://greasyfork.org/*/scripts/*/code*
// @match        *://update.greasyfork.org/*
// @match        *://tongyi.aliyun.com/*
// @match        *://www.doubao.com/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493070/Convert%20LF%20to%20CRLF.user.js
// @updateURL https://update.greasyfork.org/scripts/493070/Convert%20LF%20to%20CRLF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(event) {
        var selection = window.getSelection().toString();
        if (!selection.includes('\n')) return;

        event.preventDefault();

        // Replace LF with CRLF
        var modifiedSelection = selection.replace(/\n/g, '\r\n');


//进一步优化通义千问移动版网页
if (/:\/\/tongyi/.test (location.href) ) {
    // Remove the leading whitespace + newline
    modifiedSelection = modifiedSelection.replace(/^\r\n/, '');

    // Find and remove the pattern "space newline space newline" and everything following it
    var patternMatch = modifiedSelection.match(/\r\n0\/1000\r\n(.*)/);
    if (patternMatch) {
        modifiedSelection = modifiedSelection.slice(0, -patternMatch[0].length -2);
    }
}


        // Put the modified text on the clipboard
        event.clipboardData.setData('text/plain', modifiedSelection);
    });
})();