// ==UserScript==
// @name         Garoon download all
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Garoonで一括ダウンロード
// @author       yhara
// @match        http://garoon.ybm.jp/scripts/cbgrn/grn.exe/space/*
// @match        http://garoon.ybm.jp/scripts/cbgrn/grn.exe/message/*
// @grant        window.jQuery
// @downloadURL https://update.greasyfork.org/scripts/426993/Garoon%20download%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/426993/Garoon%20download%20all.meta.js
// ==/UserScript==

jQuery(function ($) {
    const $button = $('<button>一括ダウンロード</button>');
    $button.on('click', function () {
        jQuery('a.with_lang').each(function () { window.open(this.href) });
    });
    $('#info_area').append($button);
});
