// ==UserScript==
// @name        Shopbop PageUp/PageDown shortcuts
// @namespace   https://github.com/gslin/shopbop-pageup-pagedown-shortcuts-userscript
// @match       https://www.shopbop.com/*
// @grant       none
// @version     0.20201027.0
// @author      Gea-Suan Lin <gslin@gslin.org>
// @description Use PageUp/PageDown shortcuts to navigate.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/414758/Shopbop%20PageUpPageDown%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/414758/Shopbop%20PageUpPageDown%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keyup', function(event) {
        let t = document.activeElement.tagName.toLowerCase();
        if (['input', 'textarea'].indexOf(t) !== -1) {
            return;
        }

        if ('<' === event.key) {
            let el = document.querySelector('i.arrow.left');
            if (el) {
                el.click();
            }
        }

        if ('>' === event.key) {
            let el = document.querySelector('i.arrow.right');
            if (el) {
                el.click();
            }
        }
    });
})();
