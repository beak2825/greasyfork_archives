// ==UserScript==
// @name         YT Open
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto forwarding to YouTube
// @author       Pelmen
// @match        https://lk.99ballov.ru/lesson/*
// @icon         https://www.google.com/s2/favicons?domain=99ballov.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429857/YT%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/429857/YT%20Open.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = document.location.pathname;
    if (a !== "/lesson/homeworks") {
        var btn = document.createElement('button');

        var textInBtn = document.createTextNode('Открыть на YouTube');

        btn.append(textInBtn);//добавляем текст в кнопку
        btn.setAttribute('class'," font-600")
        btn.setAttribute("style", 'background-color: #e92452!important; border-radius: 10px; color: #fff; \
            padding: 10px 15px;');

        var kyda_vkid = document.getElementsByTagName('nav').item(0).getElementsByClassName('bg-black d-flex flex-column justify-content-between').item(0).getElementsByClassName('d-flex flex-column').item(0)

        kyda_vkid.append(btn);

        btn.setAttribute('onclick'," Jump")

        function Jump() {
            var par = document.getElementsByClassName('plyr__video-wrapper plyr__video-embed')[0];
            var our_lesson_src = par.firstElementChild.getAttribute('src');
            our_lesson_src = our_lesson_src.split('?autoplay')[0];
            our_lesson_src = our_lesson_src.replace('embed/', 'watch?v=')
            window.open(our_lesson_src)
        }

        btn.addEventListener('click', Jump);

    }
}
)
();