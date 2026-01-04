// ==UserScript==
// @name         雀魂 役種一覧 ショートカット [Shift + Enter]
// @version      0.1
// @description  Shift + Enter で役職一覧の表示・非表示を行います。
// @author       炎筆
// @namespace    https://greasyfork.org/users/803913
// @match        https://game.mahjongsoul.com/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mahjongsoul.com
// @downloadURL https://update.greasyfork.org/scripts/440972/%E9%9B%80%E9%AD%82%20%E5%BD%B9%E7%A8%AE%E4%B8%80%E8%A6%A7%20%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%20%5BShift%20%2B%20Enter%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/440972/%E9%9B%80%E9%AD%82%20%E5%BD%B9%E7%A8%AE%E4%B8%80%E8%A6%A7%20%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%20%5BShift%20%2B%20Enter%5D.meta.js
// ==/UserScript==

let UI_Rules = null;

document.addEventListener('keydown', evt => {
    if(!evt.repeat && evt.code === 'Enter' && evt.shiftKey && UI_Rules) {
        const inst = UI_Rules.Inst;

        if(!inst.enable) {
            inst.show();
        }
        else {
            inst.close();
        }
    }
});

Object.defineProperty(Object.prototype, 'UI_Rules', {
    set(obj) {
        this._UI_Rules = obj;
        UI_Rules = obj;
    },
    get() {
        return this._UI_Rules;
    }
});