// ==UserScript==
// @name         block icode feedback icon
// @namespace    https://hk1229.cn
// @version      0.1
// @description  try to take over the world!
// @author       Kyle
// @match        https://console.cloud.baidu-int.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420805/block%20icode%20feedback%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/420805/block%20icode%20feedback%20icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let count = 20
    function run() {
        if (count-- && remove() === false) {
            setTimeout(run, 500);
        }
    }

    function remove() {
        let a = document.querySelector('.framework-helper-container-drag-wrapper');
        if (!a) return false;
        a.parentNode.removeChild(a);
    }

    run();
})();