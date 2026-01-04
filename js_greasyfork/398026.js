// ==UserScript==
// @name         Sorry, Yandex docviewer
// @namespace    docviewer.yandex.ru
// @version      1.000
// @description  Remove Ads from Yandex docviewer page
// @author       Anton
// @match        https://docviewer.yandex.ru/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398026/Sorry%2C%20Yandex%20docviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/398026/Sorry%2C%20Yandex%20docviewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let f = function(clname) {
        let el = document.querySelector('.' + clname);
        if (el) {
            let p = el.parentElement;
            let cs = p.children;
            for (let i = 0; i < cs.length; i++) { if (cs[i].className.indexOf(clname) < 0) p.removeChild(cs[i]) }
        }
    }

    let clear = function() {
        f('js-doc-html'); f('js-doc-page');
    };

    setInterval(clear, 500);
    clear();
})();