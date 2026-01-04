// ==UserScript==
// @name         Find All Magnet Text and Copy to Clipboard on Double Click
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  find all text starting with magnet and ending with a letter or number in the current page, and copy to clipboard when double clicked on the page
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/479239/Find%20All%20Magnet%20Text%20and%20Copy%20to%20Clipboard%20on%20Double%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/479239/Find%20All%20Magnet%20Text%20and%20Copy%20to%20Clipboard%20on%20Double%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用正则表达式查找所有以'magnet:'开头并以英文字母或者数字字符结束的字符串
    let regex = /magnet:\S*[a-zA-Z0-9]/g;
    let bodyText = document.body.innerText;
    let matchArray = bodyText.match(regex);

    if (matchArray) {
        // 当页面被双击时，复制所有匹配项到剪贴板
        document.body.addEventListener('dblclick', function() {
            let matches = matchArray.join('\n');
            GM_setClipboard(matches);
            alert('Magnet links copied to clipboard!');
        });
    }

})();
