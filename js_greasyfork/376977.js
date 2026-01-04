// ==UserScript==
// @name         计蒜客助手
// @namespace    http://tampermonkey.net/
// @homepage     https://gist.github.com/inkedawn/12b82ba385666853a00c3725d6c04d27
// @version      0.2.0
// @description  [计蒜客]
// @description  [jisuanke]
// @author       inkedawn
// @license      MIT
// @date         22/01/2019
// @modified     22/01/2019
// @match        http://www.jisuanke.com/course/*
// @match        https://www.jisuanke.com/course/*
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/376977/%E8%AE%A1%E8%92%9C%E5%AE%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/376977/%E8%AE%A1%E8%92%9C%E5%AE%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeLimit(selector) {
        document.querySelectorAll(selector).forEach(function(elem) {
            elem.onselect = '';
            elem.oncut = '';
            elem.oncopy = '';
            elem.oncut = '';
        });
    }
    var fsbtn =document.querySelector('#full-screen');
    if (fsbtn) {
        fsbtn.click();
    }
    removeLimit('.hint-content');
    removeLimit('.guide-content');
    removeLimit('.read-text');
    removeLimit('.options-content');

})();