// ==UserScript==
// @name         atcoder-virtual-quick-vst
// @namespace    https://github.com/ilplrr
// @version      1.0
// @description  AtCoderバーチャル参加ページの開始時刻入力の簡略化。
// @author       ilplrr
// @match        https://atcoder.jp/contests/*/virtual
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455165/atcoder-virtual-quick-vst.user.js
// @updateURL https://update.greasyfork.org/scripts/455165/atcoder-virtual-quick-vst.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const vstInputTag = document.querySelector('#vst-tmp');
    if (!vstInputTag) return;

    const div = document.createElement('div');
    div.style.textAlign = 'center';
    div.style.marginBottom = '15px';
    document.querySelector('#form-register').insertBefore(div, document.querySelectorAll('.form-group')[1]);

    const createBtn = (text, sec) => {
        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = text;
        btn.style.marginRight = '1rem';
        btn.addEventListener('click',() => {
            const vst = new Date();
            vst.setSeconds(vst.getSeconds() + sec);
            let s = '';
            s += [vst.getFullYear(), vst.getMonth()+1, vst.getDate()].map((x) => x.toString().padStart(2, '0')).join('-'); // yyyy-mm-dd
            s += ' ';
            s += [vst.getHours(), vst.getMinutes(), vst.getSeconds()].map((x) => x.toString().padStart(2, '0')).join(':'); // hh:mm:ss
            vstInputTag.value = s;
        });
        return btn;
    };

    div.appendChild(createBtn('10秒後', 10));
    div.appendChild(createBtn('1分後', 1*60));
    div.appendChild(createBtn('3分後', 3*60));
    div.appendChild(createBtn('5分後', 5*60));
})();