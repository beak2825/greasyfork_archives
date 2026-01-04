// ==UserScript==
// @name         Misskey 自動プレビュー
// @namespace    kanade
// @version      1.1.1
// @description  ノート投稿ダイアログを開いたとき、自動でプレビューモードをONにします
// @author       kanade
// @license      MIT
// @match        https://misskey.io/
// @match        https://misskey.noellabo.jp/
// @match        https://mfmf.club/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=misskey.io
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/461787/Misskey%20%E8%87%AA%E5%8B%95%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/461787/Misskey%20%E8%87%AA%E5%8B%95%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC.meta.js
// ==/UserScript==

const ms = 3000;

(function() {
    'use strict';
    document.addEventListener('keydown', detectShortcutKey);

    setTimeout(() => {
        /*
            ._button.xplJN 新規投稿ボタン
        */
        let btn = document.querySelectorAll('._button.xplJN');

        for(let i = 0; i < btn.length; i++) {
            btn[i].addEventListener('click', function() {
                clickPreview();
            }, false);
        }
    }, ms);

    function detectShortcutKey(e){
        let keyCodeN = 78;
        let keyCodeP = 80;
        let keyCodeEsc = 27;

        let obj = document.activeElement;
        if(obj.tagName.toLowerCase() == 'input' || obj.tagName.toLowerCase() == 'textarea') {
            return;
        }

        if((e.keyCode == keyCodeN || e.keyCode == keyCodeP)) {
            clickPreview();
            preventEvent(e);
            return;
        }

        return;
    }

    function clickPreview() {
            setTimeout(() => {
                let element = document.querySelector(".xpDI4.xxtDg._popup");
                if(element != null) {
                    document.querySelector('.xizQe ._button.xjAub').click();
                }
            }, 100);
    }

    function preventEvent(key_event) {
        if (key_event.stopPropagation) {
            key_event.stopPropagation();
            key_event.preventDefault();
        }
    }
})();
