// ==UserScript==
// @name         雨课堂网页版操作
// @namespace    https://userscript.snomiao.com/
// @version      0.1
// @description  启用Enter发送弹幕
// @author       snomiao@gmail.com
// @match        https://www.yuketang.cn/lesson/fullscreen/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398493/%E9%9B%A8%E8%AF%BE%E5%A0%82%E7%BD%91%E9%A1%B5%E7%89%88%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/398493/%E9%9B%A8%E8%AF%BE%E5%A0%82%E7%BD%91%E9%A1%B5%E7%89%88%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var main = () => {
        var [box, btn] = ['.send__input', '.send__btn'].map((e) =>
            document.querySelector(e)
        );
        if (!box || !btn) return;
        box.addEventListener(
            'keydown',
            (e) => e.code == 'Enter' && btn.click()
        );
        console.log('启用: Enter发送');
        document.removeEventListener('mouseup', main);
    };
    document.addEventListener('mouseup', main);
})();
