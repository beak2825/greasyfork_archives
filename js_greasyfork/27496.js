// ==UserScript==
// @name         Code Copier for V3rm 4.0
// @namespace    http://tampermonkey.net/
// @version      1
// @description  This extension to V3rmillion allows you to easily copy code from a thread on V3rmillion, with the click of a button.
// @author       Vibe[UID=5230]
// @match        https://v3rmillion.net/showthread.php?tid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27496/Code%20Copier%20for%20V3rm%2040.user.js
// @updateURL https://update.greasyfork.org/scripts/27496/Code%20Copier%20for%20V3rm%2040.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("code").each(function(yes){
        var a = $('<button>Copy This Snippet</button>').click(function() {
            if (window.getSelection && window.document.createRange) {
                var sel = window.getSelection();
                var range = window.document.createRange();
                range.selectNodeContents($("code")[yes]);
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (window.document.body.createTextRange) {
                var range = window.document.body.createTextRange();
                range.moveToElementText($("code")[yes]);
                range.select();
            }
            var copied = document.execCommand('copy');
            sel.removeAllRanges();
            if (copied === true) {
                a[0].innerText = 'Copied snippet successfully';
                setTimeout(function(){a[0].innerText = 'Copy This Snippet';},5000);
            } else {
                a[0].innerText = 'Error copying snippet. Please try again or contact Vibe#9073 on Discord.';
            }
        });
        $("div.codeblock")[yes].prepend(a[0]);
    });

})();