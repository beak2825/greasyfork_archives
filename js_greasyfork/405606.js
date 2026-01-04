// ==UserScript==
// @name         Chrome 不翻译代码
// @namespace    https://github.com/wuuashen/UserScript
// @version      0.1
// @description  在 Chrome中不翻译代码
// @author       wuuashen
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405606/Chrome%20%E4%B8%8D%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/405606/Chrome%20%E4%B8%8D%E7%BF%BB%E8%AF%91%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ['code', 'pre']
        .reduce((acc, cur) => {
        const nodeList = document.querySelectorAll(cur);
        return [...acc, ...nodeList];
    }, [])
        .forEach(elm => {
        elm.classList.add('notranslate');
        elm.setAttribute('translate', 'no');
    });

    console.log('😃 No translate class inject success.');
})();