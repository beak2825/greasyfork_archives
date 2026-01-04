// ==UserScript==
// @name            Alt+S to Speak from TTS engines
// @name:zh         Alt+S 翻译TTS自动发声
// @name:ja         Alt+S Alt + SでTTSエンジンから読み上げる
// @description     Supports bing translator，Can be used to pretend to be a robot in online classes. (Alt+Shift+S to speak translated text)
// @description:zh  现支持：必应翻译，可用于在网课中假装机器人讲话（Alt + Shift + S 读翻译后的声音）
// @description:ja  Bingトランスレータをサポートします。オンラインクラスのロボットのふりをするために使用できます。（Alt + Shift + Sで翻訳されたテキストを読み上げる）
// @namespace       https://userscript.snomiao.com/
// @version         0.1
// @author          snomiao@gmail.com
// @run-at          document-start
// @match           https://*.bing.com/translator*
// @match           https://translate.google.com*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/401756/Alt%2BS%20to%20Speak%20from%20TTS%20engines.user.js
// @updateURL https://update.greasyfork.org/scripts/401756/Alt%2BS%20to%20Speak%20from%20TTS%20engines.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var clickNode = (e) => {
        ['mouseover', 'mousedown', 'mouseup', 'click'].map((eventType) => {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(eventType, true, true);
            e.dispatchEvent(clickEvent);
        });
    };
    var ClickAndSelectAll = (selBTN, selINPUT) => {
        var btnTTS = document.querySelector(selBTN);
        var textArea = document.querySelector(selINPUT);
        clickNode(btnTTS);
        textArea.focus();
        textArea.select();
    };
    // Bing
    location.href.match(/^https\:\/\/\w*\.bing\.com\/translator/) &&
        window.addEventListener('keydown', (e) => {
            if (e.altKey && !e.shiftKey && !e.ctrlKey && e.code == 'KeyS')
                ClickAndSelectAll('#tta_playiconsrc', '#tta_input_ta');
            if (e.altKey && e.shiftKey && !e.ctrlKey && e.code == 'KeyS')
                ClickAndSelectAll('#tta_playicontgt', '#tta_input_ta');
        });
    // Google
    location.href.startsWith('https://translate.google.com') &&
        window.addEventListener('keydown', (e) => {
            if (e.altKey && !e.shiftKey && !e.ctrlKey && e.code == 'KeyS')
                ClickAndSelectAll('.ttsbutton', '#source');
            if (e.altKey && e.shiftKey && !e.ctrlKey && e.code == 'KeyS')
                ClickAndSelectAll('.ttsbutton-res', '#source');
        });
})();
