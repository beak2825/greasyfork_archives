// ==UserScript==
// @name         自动翻译－>字幕中文简体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  translate to Chinese automatically.
// @author       qwertyuiop6
// @match        https://www.youtube.com/watch*
// @require      https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392604/%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%EF%BC%8D%3E%E5%AD%97%E5%B9%95%E4%B8%AD%E6%96%87%E7%AE%80%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/392604/%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%EF%BC%8D%3E%E5%AD%97%E5%B9%95%E4%B8%AD%E6%96%87%E7%AE%80%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function translateToChinese(){
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
    }

    function onLoadStart(){
        $('.ytp-subtitles-button[aria-pressed="false"]').click();
        $('.ytp-settings-button').click();
        translateToChinese();
        $('.ytp-settings-button').click();
    }
    $('video').on('loadstart', onLoadStart).trigger('loadstart');
})();