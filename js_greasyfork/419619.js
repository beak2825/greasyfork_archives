// ==UserScript==
// @name         TTS for Selected Text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reading selected text - Google TTS / HTML5 Speech Synthesis
// @author       Chang4Tech
// @include      *
// @run-at document-end
// @connect      translate.google.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419619/TTS%20for%20Selected%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/419619/TTS%20for%20Selected%20Text.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    var googleUrl = "https://translate.google.com/translate_tts?ie=UTF-8&q=";
    var gt_tl = '&tl=en';
    var gt_cl = '&client=tw-ob';
    var icon = document.createElement('div');

    var style = '' +
        'width:24px;' +
        'height:24px;' +
        'margin:4px!important;' +
        '';
    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" '
        +'style="'+style+'-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512">'
        +'<path d="M256 16C159 16 80 95 80 192v206.57a97.59 97.59 0 0 0 28 68.49A94.51 94.51 0 0 0 176 496c36.86 0 67.18-15.62 90.12-46.42c4.48-6 9.55-14.74 15.42-24.85c15.32-26.37 36.29-62.47 63.17-80.74c25.77-17.51 47.23-39.54 62-63.72C423.51 252.94 432 223.24 432 192c0-97-78.95-176-176-176zm96 184a16 16 0 0 1-16-16c0-39.7-35.89-72-80-72s-80 32.3-80 72v30.42c27.19-7.84 58.4-6.72 64.28-6.42a48 48 0 0 1 38.6 75.9c-.3.41-.61.81-.95 1.2c-16.55 19-36 45.48-38.46 55a16 16 0 0 1-30.94-8.14c5.51-20.94 36.93-58.2 44.66-67.15A16 16 0 0 0 239.82 240h-.88c-16.6-.89-45.89.8-62.94 8.31V304a16 16 0 0 1-32 0V184c0-57.35 50.24-104 112-104s112 46.65 112 104a16 16 0 0 1-16 16z" fill="rebeccapurple"/></svg>'

    icon.setAttribute('id','style', 'container');

    icon.setAttribute('style', '' +
        'width:32px!important;' +
        'height:32px!important;' +
        'display:none!important;' +
        'background:#fff!important;' +
        'border-radius:16px!important;' +
        'box-shadow:4px 4px 8px #888!important;' +
        'position:absolute!important;' +
        'z-index:2147483647!important;' +
        '');
    //add icon to DOM
    document.documentElement.appendChild(icon);
    // 鼠标事件：防止选中的文本消失
    document.addEventListener('mousedown', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode.parentNode == icon)) {// 点击了翻译图标
            e.preventDefault();
        }
    });
    // 选中变化事件：当点击已经选中的文本的时候，隐藏翻译图标和翻译面板（此时浏览器动作是：选中的文本已经取消选中了）
    document.addEventListener("selectionchange", function () {
        if (!window.getSelection().toString().trim()) {
            icon.style.display = 'none';
        }
    });
    // 鼠标事件：防止选中的文本消失；显示、隐藏翻译图标
    document.addEventListener('mouseup', function (e) {
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode.parentNode == icon)) {// 点击了翻译图标
            e.preventDefault();
            return;
        }
        var text = window.getSelection().toString().trim();
        if (text && icon.style.display == 'none') {
            icon.style.top = e.pageY + 12 + 'px';
            icon.style.left = e.pageX + 'px';
            icon.style.display = 'block';
        } else if (!text) {
            icon.style.display = 'none';
        }
    });

       // Google TTS for selected text
//     icon.addEventListener('click', function (e) {
//         var text = window.getSelection().toString().trim();
//         if (text) {
//             icon.style.display = 'none';
//             var tts_url = googleUrl+text+gt_tl+gt_cl
//             +'';
//             var audio = new Audio(tts_url);
//             // need to remove referer in request headers
//             audio.rel = "noreferrer";
// //             audio.rel = 'preload';
//             audio.play();
//         }
//     });

    // HTML5 TTS for selected text
    icon.addEventListener('click', function (e) {
        var text = window.getSelection().toString().trim();
        if (text) {
            icon.style.display = 'none';
            var msg = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(msg);
        }
    });





})();