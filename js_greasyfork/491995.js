// ==UserScript==
// @name         Overleaf New Tabs
// @namespace    http://tampermonkey.net/
// @version      2024-04-08
// @description  Make links on the Overleaf "Your Projects" page open in a new tab
// @author       Kilian Evang
// @match        https://www.overleaf.com/project
// @match        https://www.overleaf.com/project/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=overleaf.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491995/Overleaf%20New%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/491995/Overleaf%20New%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const head = document.querySelector('head')
    const base = document.createElement('base')
    base.setAttribute('target', '_blank')
    head.appendChild(base)
})();