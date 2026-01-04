// ==UserScript==
// @name         Anti Peep Screen 防窥屏
// @namespace    https://greasyfork.org/zh-CN/scripts/389727
// @version      0.3.1
// @description  当你发现有人窥屏，就按 F2。按 ESC 消除。
// @author       Phuker
// @match        *://*/*
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/389727/Anti%20Peep%20Screen%20%E9%98%B2%E7%AA%A5%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389727/Anti%20Peep%20Screen%20%E9%98%B2%E7%AA%A5%E5%B1%8F.meta.js
// ==/UserScript==

/*
Forked from jinyu121/ShameEyesdroper.user.js
https://gist.github.com/jinyu121/9e028686f35f330b52f60a30e7ef8ba3 
*/

(function() {
    'use strict';

    // - - - - - - - - - - 用户配置开始 Start User Config - - - - - - - - - -

    // 显示文本
    // display text
    var option_text = '有沙雕正在窥屏';

    // 不透明度，0.0 - 1.0，数值越大越不透明，建议 0.6 - 1.0
    // opacity, 0.0 - 1.0
    var option_opacity = '0.85';

    // 主题
    // color theme
    var option_theme = 'golden';

    // 触发和恢复按键
    // keys
    var option_key_activate = 'F2';
    var option_key_cancel = 'Escape';

    // - - - - - - - - - - 用户配置结束 End User config - - - - - - - - - -

    // background, text
    var option_themes = {
        'golden': ['#17254D', '#F0E360'],    // 土豪金
        'normal': ['#fff', '#666'],          // 普通 白底黑字
        'dark': ['#333', '#ccc'],            // 黑底白字 暗黑主题
        'slate': ['#19191f', '#ebebf4'],     // 蓝灰 暗色
    }
    var option_background_color = option_themes[option_theme][0];
    var option_text_color = option_themes[option_theme][1];

    function AntiPeepScreen(){
        var svg='<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
        <rect width="100%" height="100%" style="fill:' + option_background_color + ';" />\
        <text style="font-weight:bold; font-size:72px; fill:' + option_text_color + ';" transform="matrix(.70710678 -.70710678 .70710678 .70710678 -52.549041 262.010392)" x="26.015705" y="220.4375">'+ option_text +'</text>\
        </svg>';
        var bg_text="url(data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(svg)))+")";
        var div = document.createElement('div');
        div.className = 'phuker-anti-peep-screen';
        div.style.cssText = '\
            z-index:65535;\
            position:fixed;\
            top:0;\
            left:0;\
            bottom:0;\
            right:0;\
            opacity:' + option_opacity + ';\
            background-image:' + bg_text + ';\
            background-repeat:repeat;\
            background-position:center;\
            overflow":"hidden";\
        ';
        document.body.appendChild(div);
    };

    function ClearAntiPeepScreen(){
        document.getElementsByClassName('phuker-anti-peep-screen')[0].remove();
    }

    document.addEventListener("keydown", function(e){
        if(e.key === option_key_activate){
            AntiPeepScreen();
            document.phuker_anti_peep_level = (document.phuker_anti_peep_level | 0) + 1;
        }
        if(e.key === option_key_cancel){
            if(document.phuker_anti_peep_level){
                ClearAntiPeepScreen();
                e.preventDefault();
                document.phuker_anti_peep_level -= 1;
            }
        }
    });
})();

