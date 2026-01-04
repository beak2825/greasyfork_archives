// ==UserScript==
// @name         Baidu Baike Chinese Font Fix on Edge Chromium
// @namespace    me.mikuzz.userscript.baidu-baike-chinese-font-fix
// @version      0.1
// @description  Fix Chinese font display on Windows Edge Chromium
// @author       MikuZZZ<princez.wzz@gmail.com>
// @match        https://baike.baidu.com/item/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402500/Baidu%20Baike%20Chinese%20Font%20Fix%20on%20Edge%20Chromium.user.js
// @updateURL https://update.greasyfork.org/scripts/402500/Baidu%20Baike%20Chinese%20Font%20Fix%20on%20Edge%20Chromium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('div.content').style.font = 'unset';
})();