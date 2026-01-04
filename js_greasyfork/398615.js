// ==UserScript==
// @name         AtCoder Language Filter (mini)
// @namespace    https://github.com/morioprog
// @version      0.0.2
// @description  デバッグがんばります
// @author       morio_prog
// @match        *://atcoder.jp/contests/*/tasks/*
// @match        *://atcoder.jp/contests/*/submit*
// @match        *://atcoder.jp/contests/*/custom_test*
// @downloadURL https://update.greasyfork.org/scripts/398615/AtCoder%20Language%20Filter%20%28mini%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398615/AtCoder%20Language%20Filter%20%28mini%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const deflang = localStorage.getItem('defaultLang').replace(/[^0-9]/g, '');
    const $select_language = $('#select-lang select');

    /* Languages */
    const language = ['Python3 (3.4.3)', 'PyPy3 (2.4.0)'];

    /* Build language-map */
    const optmap = new Map(); // {lang: [value, data-mime]}
    $select_language.children('option').each(function(i, e) {
        const $opt = $(e);
        optmap.set(
            $opt.text(),
            [
                $opt.attr('value'),
                $opt.attr('data-mime'),
            ]
        );
        $(this).remove();
    });

    console.log(optmap);

    let selected = [];
    $.each(language, function(i, lang) {
        const val = optmap.get(lang)[0];
        const mim = optmap.get(lang)[1];
        $select_language.append(
            $('<option>', {
                'value':     val,
                'data-mime': mim,
                'text':      lang,
                'selected':  val == deflang,
            })
        );
        selected.push(lang);
    });

})();
