// ==UserScript==
// @name         Mangakakalot Image Seperator Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the separator line between images in Mangakakalot
// @author       Anonymous
// @match        https://ww.mangakakalot.tv/*
// @icon         https://i.postimg.cc/QxXtRD3F/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430700/Mangakakalot%20Image%20Seperator%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/430700/Mangakakalot%20Image%20Seperator%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.vung-doc img { max-width: 100%; display: block; margin: 0 auto 0px; z-index: 1 !important }';
    document.getElementsByTagName('head')[0].appendChild(style);

    document.getElementById('someElementId').className = 'cssClass';
})();