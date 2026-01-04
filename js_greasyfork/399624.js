// ==UserScript==
// @name         Anti-Grayscale
// @description  移除页面的灰色模式 (恢复页面的彩色模式). Remove grayscale of html page (Restore color mode of html page).
// @version      2.0
// @author       xcanwin
// @namespace    https://github.com/xcanwin/Anti-Grayscale/
// @supportURL   https://github.com/xcanwin/Anti-Grayscale/
// @icon         data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" stroke-width="2" fill="none" stroke="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
// @license      GPL-2.0-only
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399624/Anti-Grayscale.user.js
// @updateURL https://update.greasyfork.org/scripts/399624/Anti-Grayscale.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = (Selector, el) => (el || document).querySelector(Selector);
    const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

    const main = () => {
        $$("*").forEach(el => {
            [
                "filter", "-webkit-filter", "-moz-filter", "-ms-filter", "-o-filter",
            ].forEach(xcanwin => {
                const re = /grayscale\(.*?\)/gi;
                const style = document.defaultView.getComputedStyle(el, null)[xcanwin];
                if (style && style.match(re)) {
                    el.style.setProperty(xcanwin, style.replace(re, "grayscale(0)"), "important");
                }
            });
        });
    };

    main();

})();
