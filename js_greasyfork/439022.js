// ==UserScript==
// @name         coloredmanga.com zoom enabler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables browser zooming on coloredmanga.com
// @author       Your mom
// @include      https://coloredmanga.com/*
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/439022/coloredmangacom%20zoom%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/439022/coloredmangacom%20zoom%20enabler.meta.js
// ==/UserScript==

'use strict';

window.addEventListener('load', function(){
    const panelClass = 'wp-manga-chapter-img';

    $('.wp-manga-chapter-img').attr('style', 'max-width: 100%; max-height: 100%');
}, false);
