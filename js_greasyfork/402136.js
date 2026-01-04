// ==UserScript==
// @name         SHARPマスクリロード
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://go.jp.sharp/mask/
// @match        https://go.jp.sharp/mask
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402136/SHARP%E3%83%9E%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/402136/SHARP%E3%83%9E%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const reloadFunc = function() {
        setTimeout(function() {
            try {
                const info = document.querySelector('.std > p').textContent.indexOf('アクセスが集中');
                if (info != -1) {
                    window.location.reload(true);
                    console.log('混雑中');
                    reloadFunc();
                }
            }
            catch (e) {
                console.log('読み込めた');
            }
            const sei = document.querySelector('#sei');
            if (sei) { sei.value = 'ふたば'; }
            const mei = document.querySelector('#mei');
            if (mei) { mei.value = 'としあき'; }
            const email = document.querySelector('#email');
            if (email) { email.value = '○○○@gmail.com'; }
            const tel = document.querySelector('#tel');
            if (tel) { tel.value = '09012345678'; }
            const check = document.querySelector('#check')
            if (check) { check.checked = true; }
        }, 5000);
    };
    reloadFunc();
})();