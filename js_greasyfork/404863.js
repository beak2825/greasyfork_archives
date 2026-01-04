// ==UserScript==
// @name         百度翻译快捷键发音
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百度翻译快捷键发音esc 快捷键聚焦文本框alt+a、alt+s
// @author       SUNSHINE
// @match        https://fanyi.baidu.com/*
// @grant        none
// @icon         https://www.baidu.com/favicon.ico
// @license MIT
// @copyright 2020, SUNbrightness (https://openuserjs.org/users/SUNbrightness)
// @downloadURL https://update.greasyfork.org/scripts/404863/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8F%91%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/404863/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8F%91%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    $(document).keydown(function (event){
        console.log(event);
        var metaKeyPressed = event.metaKey;
        var altKeyPressed = event.altKey;
        var shiftKey = event.shiftKey;

        if(altKeyPressed&&event.keyCode==65){
            $("#baidu_translate_input")[0].focus();
            $("#baidu_translate_input").val('');
        }
        if(altKeyPressed&&event.keyCode==83){
            $("#baidu_translate_input")[0].focus();
        }

        if (event.keyCode == 27 ) {
            $($(".operate-btn.op-sound.data-hover-tip")[0]).click();
        }
    });

})();