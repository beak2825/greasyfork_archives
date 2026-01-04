// ==UserScript==
// @name         LZTThreadsURLCopy
// @namespace    MeloniuM/LZT
// @version      0.1
// @description  Копирование ссылки на тему при клике на дату создания
// @author       MeloniuM
// @license      MIT
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.live/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477416/LZTThreadsURLCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/477416/LZTThreadsURLCopy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.titleBar #pageDescription a[href^="threads/"]').on('click', function(e){
        e.preventDefault();
        navigator.clipboard.writeText(location.href).then(function() {
            XenForo.alert("Ссылка скопирована", "", 5e3);
        });
    });
})();