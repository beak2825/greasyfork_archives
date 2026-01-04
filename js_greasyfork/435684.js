// ==UserScript==
// @name         Make Readcomiconline Great Again
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Comixes in full width, zoom panel hidden
// @author       You
// @match        https://readcomiconline.li/*
// @icon         https://www.google.com/s2/favicons?domain=readcomiconline.li
// @grant        none
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435684/Make%20Readcomiconline%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/435684/Make%20Readcomiconline%20Great%20Again.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(`<style type=text/css>
#containerRoot div:nth-child(4) { margin: 0 !important; width: 100% !important; }
#divImage img { max-width: 100% !important; }\
.btnZoom-container { display: none !important; }
</style>`).appendTo('head');
})();