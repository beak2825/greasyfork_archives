// ==UserScript==
// @name         Remove img title
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove every image title of a page
// @author       Texugo
// @include      *chan.org*
// @include      *chan.net*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/422678/Remove%20img%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/422678/Remove%20img%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('DOMNodeInserted', function() {
        $('img').hover(
            function () {
                $(this).data('title',$(this).attr('title')).removeAttr('title');
            },
            function () {
                $(this).attr('title',$(this).data('title'));
            }
        );
    }, false);
})();
