// ==UserScript==
// @name         KamePT大图预览
// @namespace    https://kamept.com
// @version      0.2
// @description  修改种子页面预览图尺寸
// @author       You
// @match        https://kamept.com/torrents.php*
// @grant        none
// @license      MIT
// @author       y1
// @downloadURL https://update.greasyfork.org/scripts/488989/KamePT%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/488989/KamePT%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('scroll', function() {
        var images = document.querySelectorAll('.nexus-lazy-load.preview');
        images.forEach(function(image) {
            image.style.maxHeight = '460px';
            image.style.maxWidth = '460px';
        });
    });
})();

