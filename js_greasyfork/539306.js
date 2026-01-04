// ==UserScript==
// @name         OpenAllSubmissions
// @namespace    http://tampermonkey.net/
// @version      2025-06-14
// @description  open all submissions
// @author       snuke
// @match        https://atcoder.jp/contests/*/submissions?f.User=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539306/OpenAllSubmissions.user.js
// @updateURL https://update.greasyfork.org/scripts/539306/OpenAllSubmissions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('thead th:last-child').append('<a id="all_detail">一括</a>');
    let links = [];
    function open_link() {
        if (links.length === 0) return;
        window.open(links.pop(), '_blank', 'noopener');
        open_link();
        // setTimeout(open_link, 10);
    }
    $('#all_detail').click(function() {
        $('tbody td:last-child a').each(function() { links.push($(this).attr('href'));});
        links.push('/users/' + location.href.split('=')[1]);
        open_link();
    });
})();