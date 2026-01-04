// ==UserScript==
// @name         Kekeke Highlight
// @name:zh-TW   Kekeke Highlight
// @namespace    https://greasyfork.org
// @version      0.0.1
// @description  Highlight same user in Kekeke chat
// @description:zh-tw 在kekeke聊天室中，嗨賴指定使用者的留言。
// @author       george7551858
// @icon         http://www.google.com/s2/favicons?domain=https://kekeke.cc/
// @include      https://kekeke.cc/*
// @include      https://www.kekeke.cc/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380948/Kekeke%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/380948/Kekeke%20Highlight.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';

    var highLightColor = 'yellow';
    var lastTargetColor;

    console.log('Kekeke Highlight: start');

    document.addEventListener('click', function (e) {
        if (e.originalTarget.classList.contains('SquareCssResource-message')
            || e.originalTarget.classList.contains('SquareCssResource-messageContainer')) {
            doHighLight(e.originalTarget);
        }
    });

    var doHighLight = function(target){
        var targetChatContent = target.closest('.SquareCssResource-chatContent');
        var targetColorNickname = targetChatContent.querySelector('.GlobalCssResource-colorNickname');
        var targetNameColor = targetColorNickname.style.color;
        console.log('Kekeke Highlight: %c' + targetColorNickname.innerText + ' ' + targetNameColor,
                    'color:' + targetNameColor);

        if (targetNameColor == lastTargetColor) {
            console.log('Kekeke Highlight: cancel');
            targetNameColor = '?';
        }

        document.querySelectorAll('.SquareCssResource-chatContent').forEach(function(item){
            item.style.backgroundColor = ''; // clear all highlight

            var chatNameColor = item.querySelector('.GlobalCssResource-colorNickname').style.color;
            if (chatNameColor == targetNameColor) {
                item.style.backgroundColor = highLightColor;
            }
        });

        lastTargetColor = targetNameColor;
    };
});