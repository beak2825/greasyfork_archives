// ==UserScript==
// @name         Remove blur blocks on mangaUP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes blur block on mangaUP
// @author       KnewOne
// @license      MIT
// @match        https://global.manga-up.com/manga/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525574/Remove%20blur%20blocks%20on%20mangaUP.user.js
// @updateURL https://update.greasyfork.org/scripts/525574/Remove%20blur%20blocks%20on%20mangaUP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        document.querySelectorAll('.ChapterSection_overlay__50Tuo, .ChapterSection_overlay__description__8InWk')
            .forEach(el => el.remove());
    }

    removeElements();

    const observer = new MutationObserver(() => removeElements());
    observer.observe(document.body, { childList: true, subtree: true });
})();
