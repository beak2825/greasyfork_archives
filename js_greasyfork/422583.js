// ==UserScript==
// @name         LamaTop (Bot)
// @icon         https://icons.duckduckgo.com/ip2/lamatop.com.ico
// @version      0.5.6
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para LamaTop, oculta la publicidad.
// @author       wuniversales
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422583/LamaTop%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422583/LamaTop%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }
    addGlobalStyle("iframe[id^=ad], iframe[scrolling=no][sandbox='allow-same-origin allow-scripts allow-popups'], div#clos,div#bannerTopLama, span.LamaCloseBannerRight, div#ee898be37a {display:none;}");
})();