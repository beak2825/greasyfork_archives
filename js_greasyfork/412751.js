// ==UserScript==
// @name         gitbook next chapter shortcut ->
// @namespace    dar-gitbook-nextChapter
// @version      0.1.1
// @description  use right arrowkeyUse to next chapter
// @author       dar <tboydar@gmail.com>
// @match        https://gitbook.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412751/gitbook%20next%20chapter%20shortcut%20-%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/412751/gitbook%20next%20chapter%20shortcut%20-%3E.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.addEventListener('keyup', function(event) {
        console.log(event.keyCode);
        if ('input' === document.activeElement.tagName.toLowerCase()) {
            return;
        }
        if (39 === event.keyCode) { // right arrowkey
            var el = document.querySelector('.art_topic_next');
            if (el) {
                el.click();
            }
            return;
        }
    });
})();
