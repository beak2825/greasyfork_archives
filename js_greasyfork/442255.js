// ==UserScript==
// @name         Remove ad for Reader Mode Pro in ReaderMode extension
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes bottom right block advertising "Reader Mode Pro", the paid version of readermode.io
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @match        https://*/*
// @match        http://*/*
// @icon         https://lh3.googleusercontent.com/enMBRM7MzaKfxzyEJpzH9KIlyxcs0T2kkqteBVvTF1ti1ESTgBb4Ox818fqhUM86J0JaNktU6wFvMSSUf9JhAwPWKg=w256-h256-e365-rj-sc0x00ffffff
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442255/Remove%20ad%20for%20Reader%20Mode%20Pro%20in%20ReaderMode%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/442255/Remove%20ad%20for%20Reader%20Mode%20Pro%20in%20ReaderMode%20extension.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    // Written by a Reader Mode user who's annoyed enough at the constant advertising to write a script to remove it.

    'use strict';

    var readerProTimer = null;
    readerProTimer = setInterval(function() {
        const ids = ['cr-pro-features-modal', 'cr-pro-features-tooltip'];
        const iframes = Array.from(document.getElementsByTagName('iframe')).filter(iframe => iframe.contentDocument);
        for (var iframe of iframes) {
            for (var id of ids) {
                const el = iframe.contentDocument.getElementById(id); // Reader Mode creates an iframe, so we have to look for this element in there.
                if (el) {
                    el.remove();
                    clearInterval(readerProTimer);
                }
            }
        }
    }, 1000);
})();