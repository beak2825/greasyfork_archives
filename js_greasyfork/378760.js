// ==UserScript==
// @name           AtCoder_submit_keyboard_shortcut
// @version        1.3
// @description    atcoderにおいてCtrl+Enterで提出ができるようになります
// @author         Osmium_1008
// @license        MIT
// @include        https://atcoder.jp/contests/*/tasks/*
// @include        https://atcoder.jp/contests/*/submit
// @supportURL     https://twitter.com/Osmium_1008
// @namespace https://greasyfork.org/users/251827
// @downloadURL https://update.greasyfork.org/scripts/378760/AtCoder_submit_keyboard_shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/378760/AtCoder_submit_keyboard_shortcut.meta.js
// ==/UserScript==
(function() {
    document.addEventListener('keydown', function (event) {
        if ((event.ctrlKey||event.metaKey)&&event.keyCode==13){
            $('#submit').click();
        }
    }, false);
})();