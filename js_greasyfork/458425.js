// ==UserScript==
// @name         Remove ads from Startpage search result.
// @name:de      Entfernt alle Anzeigen von den startpage.com Suchergebnissen.
// @license      GPL-3.0-or-later
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove ads.
// @description:de Entferne Anzeigen.
// @author       You
// @match        https://www.startpage.com/*
// @icon         https://www.startpage.com/sp/cdn/favicons/favicon-196x196--default.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458425/Remove%20ads%20from%20Startpage%20search%20result.user.js
// @updateURL https://update.greasyfork.org/scripts/458425/Remove%20ads%20from%20Startpage%20search%20result.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let iframes = Array.from(document.getElementsByTagName("iframe"));

    while (iframes.length > 0) {
        iframes.pop().remove();
    }
})();