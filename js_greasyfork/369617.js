// ==UserScript==
// @name         Juejin max-width setter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make the sidebar no longer overlaps the article
// @author       You
// @match        https://juejin.im/post/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/369617/Juejin%20max-width%20setter.user.js
// @updateURL https://update.greasyfork.org/scripts/369617/Juejin%20max-width%20setter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function width_setter() {
        let main = document.getElementsByTagName("main")[0];
        main.style["max-width"] = "1024px";
    }

    window.addEventListener('load', width_setter);
})();