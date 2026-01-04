// ==UserScript==
// @name         FlatIcon解锁右键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Flaticon解锁右键菜单，可直接复制图片
// @author       jklujklu
// @match        https://www.flaticon.com/*
// @match        http://www.flaticon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flaticon.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465554/FlatIcon%E8%A7%A3%E9%94%81%E5%8F%B3%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/465554/FlatIcon%E8%A7%A3%E9%94%81%E5%8F%B3%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nativeListener = document.addEventListener;
    document.addEventListener = (...args) => {
        const type = args[0];
        if (type === 'selectstart' || type === 'contextmenu') return;
        nativeListener.apply(document, args);
    }

    // left click listener works normally
    // document.addEventListener('click', () => console.log('click'));

    // right click listener is never attached:
    // document.addEventListener('contextmenu', () => console.log('contextmenu'));

})();