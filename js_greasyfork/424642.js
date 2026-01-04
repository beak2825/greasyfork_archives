// ==UserScript==
// @name         NO KWIK
// @namespace    https://kwik.cx/
// @author       SakamotoDesu
// @grant        none
// @include      *://kwik.cx/*
// @description script to remove kwik logo from animepahe 
// @version 0.0.1.20210407150714
// @downloadURL https://update.greasyfork.org/scripts/424642/NO%20KWIK.user.js
// @updateURL https://update.greasyfork.org/scripts/424642/NO%20KWIK.meta.js
// ==/UserScript==

(function() {
    var css = document.createElement("style");
        css.setAttribute('type', 'text/css');
        css.innerText = '.plyr.plyr--paused::after,.plyr.plyr--playing::after{opacity:0 !important}';
        document.head.appendChild(css);
})();