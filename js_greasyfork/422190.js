// ==UserScript==
// @name         SurfEarner (Bot)
// @icon         https://icons.duckduckgo.com/ip2/surfearner.com.ico
// @version      0.5.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para SurfEarner, oculta la publicidad.
// @author       wuniversales
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422190/SurfEarner%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422190/SurfEarner%20%28Bot%29.meta.js
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
    addGlobalStyle("div#surfearner{display:none;}");
})();