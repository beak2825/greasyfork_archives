// ==UserScript==
// @name         manhuagui autoresize
// @namespace    https://www.wtako.net
// @version      0.1
// @description  Autoresize manhuagui to fit 100vh, also scroll to center
// @author       Saren
// @match        http*://www.manhuagui.com/comic/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372011/manhuagui%20autoresize.user.js
// @updateURL https://update.greasyfork.org/scripts/372011/manhuagui%20autoresize.meta.js
// ==/UserScript==

$(() => {
    $('body').append('<style>#mangaFile { height: 100vh; }</style>');
    let blockUntil = 0;
    $(window).scroll(() => {
        if (Date.now() < blockUntil) {
            $(window).scrollTop($("#mangaFile").offset().top);
        }
    });
    document.body.addEventListener('DOMSubtreeModified', function () {
        blockUntil = Date.now() + 500;
    }, false);
    $(window).scrollTop($("#mangaFile").offset().top);
});