// ==UserScript==
// @name         Youtube自动加载简体中文字幕
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Youtube 自动加载简体中文字幕
// @author       jono76 nebulabox
// @match        https://www.youtube.com/watch*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390046/Youtube%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/390046/Youtube%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function translateToSimpleChinese(){
        var sub = $('[role="menuitem"]:contains("字幕")');
        if(!sub.length) return;
        sub.click();
        var subc = $('[role="menuitemradio"]:contains("中文（简体）")');
        if (subc.length) {
            subc.click();
        } else {
            var autoTrans = $('[role="menuitemradio"]:contains("自动翻译")');
            if (!autoTrans.length) return;
            autoTrans.click();
            var autoTransC = $('[role="menuitemradio"]:contains("中文（简体）")');
            if (!autoTransC.length) return;
            autoTransC.click();
        }
       $('.ytp-settings-button').click();
    }

    function onLoadStart(){
        $('.ytp-subtitles-button[aria-pressed="false"]').click();
        $('.ytp-settings-button').click();
        translateToSimpleChinese();
        $('.ytp-settings-button').click();
    }
    $('video').on('loadstart', onLoadStart).trigger('loadstart');
})();

