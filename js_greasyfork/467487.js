// ==UserScript==
// @name         LZTCopyUniqButton
// @namespace    MeloniuM/LZT
// @version      1.1
// @description  Добавляет кнопку копирования уника на страницу профиля
// @license      MIT
// @author       MeloniuM
// @match        *://zelenka.guru/*
// @match        *://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467487/LZTCopyUniqButton.user.js
// @updateURL https://update.greasyfork.org/scripts/467487/LZTCopyUniqButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if($('#content.member_view .profilePage').length){
        let uniq = $('h1.username span')[0].style.cssText;
        if (uniq != '' && $('h1.username div .copyButton').length == 0){
            $('h1.username div').append($('<span data-phr="Уник скопирован" onclick="Clipboard.copy(encodeURI(`' + uniq + '`), this)" class="copyButton Tooltip" title="" data-cachedtitle="Скопировать уник" tabindex="0"><i class="far fa-clone" aria-hidden="true"></i></span>'));
            XenForo.Tooltip($('h1.username div span.copyButton.Tooltip'))
        }
    }
})();