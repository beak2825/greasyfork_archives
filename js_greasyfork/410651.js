// ==UserScript==
// @name         TeaserFast (Bot)
// @icon         https://icons.duckduckgo.com/ip2/teaserfast.ru.ico
// @namespace    https://greasyfork.org/users/592063
// @version      0.5.2.1
// @description  ¡Bot para TeasterFast!
// @author       wuniversales
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410651/TeaserFast%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/410651/TeaserFast%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        let head, style;
        let escape_HTML_Policy = window.trustedTypes.createPolicy("TeaserFast_Policy", {createHTML: (to_escape) => to_escape});
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = escape_HTML_Policy.createHTML(css.replace(/;/g, ' !important;'));
        head.appendChild(style);
    }
    addGlobalStyle("div#teaserfast.teaserfast_index{display:none;}");
})();