// ==UserScript==
// @name              左键选中复制
// @description       左键选中
// @version           1.3
// @match             *://*/*
// @grant             unsafeWindow
// @run-at            document-body
// @namespace https://greasyfork.org/users/12375
// @downloadURL https://update.greasyfork.org/scripts/497535/%E5%B7%A6%E9%94%AE%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/497535/%E5%B7%A6%E9%94%AE%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function(uw) {
    'use strict';

    const CTRL_A_MASK = 0b10000001; // 复合位掩码
    const KEY_STATES = new Uint8Array(256);
    const CLIP_WRITE = uw.navigator.clipboard?.writeText ?
        t => uw.navigator.clipboard.writeText(t).catch(()=>GM_setClipboard(t)) :
        t => GM_setClipboard(t);

    let textCache = null, tid = 0;

    const memReadSelection = () => {
        const s = document.getSelection();
        return s && s.toString() || '';
    };

    uw.addEventListener('keydown', e => KEY_STATES[e.keyCode] = e.ctrlKey | (e.keyCode === 65) << 7);
    uw.addEventListener('keyup', () => KEY_STATES.fill(0));

    document.addEventListener('selectionchange', () => {
        if (KEY_STATES[65] & CTRL_A_MASK) return;
        const txt = memReadSelection();
        if (!txt || txt === textCache) return;
        textCache = txt;
        clearTimeout(tid);
        tid = setTimeout(() => CLIP_WRITE(txt), 8);
    }, 0x7FFFFFFF);

})(unsafeWindow);
