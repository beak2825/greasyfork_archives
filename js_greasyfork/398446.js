// ==UserScript==
// @name         平滑滾動
// @version      0.1
// @description  讓頁面滾動更加平滑，看起來更流暢
// @author       vincent9579
// @include *
// @run-at       document-start
// @resource smoothscroll     https://cdnjs.cloudflare.com/ajax/libs/smoothscroll/1.4.10/SmoothScroll.min.js
// @grant        GM_getResourceText
// @namespace https://greasyfork.org/users/467135
// @downloadURL https://update.greasyfork.org/scripts/398446/%E5%B9%B3%E6%BB%91%E6%BB%BE%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/398446/%E5%B9%B3%E6%BB%91%E6%BB%BE%E5%8B%95.meta.js
// ==/UserScript==
(function() {
    var scr = document.createElement('script');
    scr.type = 'text/javascript';
    scr.textContent = GM_getResourceText('smoothscroll')
    document.head.appendChild(scr);

})();