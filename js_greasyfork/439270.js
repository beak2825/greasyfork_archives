// ==UserScript==
// @name         マクロミル TOPページのお知らせを強制的に閉じる
// @namespace    macromill_autoclose_notice
// @version      0.0.2
// @description  お知らせを閉じる。お知らせを強制的に閉じたことによって得た損害は補填しません。
// @author       monitor_support
// @include      https://monitor.macromill.com/airs/exec/showMonitorMyPageAction.do*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @license     新UI作ったやつはうんちでも食べてろ
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439270/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%20TOP%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E3%82%92%E5%BC%B7%E5%88%B6%E7%9A%84%E3%81%AB%E9%96%89%E3%81%98%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439270/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%20TOP%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B%E3%82%92%E5%BC%B7%E5%88%B6%E7%9A%84%E3%81%AB%E9%96%89%E3%81%98%E3%82%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(function() {
        clickModalDialogButton();
    }, 1000);
    setTimeout(function() {
        clickModalDialogButton();
    }, 2000);
    setTimeout(function() {
        clickModalDialogButton();
    }, 3000);
})();
