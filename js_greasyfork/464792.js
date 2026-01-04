// ==UserScript==
// @name         Remove Bilibili WebP Suffix
// @namespace    ACGMN
// @version      0.1.1
// @description  Remove gift panel from bilibili live page 去除b站图片webp后缀
// @author       ACGMN
// @license      MIT
// @match        *://i0.hdslb.com/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://i0.hdslb.com&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464792/Remove%20Bilibili%20WebP%20Suffix.user.js
// @updateURL https://update.greasyfork.org/scripts/464792/Remove%20Bilibili%20WebP%20Suffix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function () {
        if(location.href.endsWith('webp')){
            location.href = location.href.substring(0,location.href.lastIndexOf('@'))
        }
    }, 1000)
})();
