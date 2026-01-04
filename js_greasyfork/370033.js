// ==UserScript==
// @name         Kuronews24
// @description  Dark theme for SoraNews24
// @version      1.9
// @author       Matt Krins
// @namespace    https://gist.github.com/mattkrins
// @icon         https://user-images.githubusercontent.com/2367602/78975577-e4aeca00-7b03-11ea-8b33-e860d636b9ad.png
// @homepageURL  https://gist.github.com/mattkrins/d06c7504bf92efe933b50dc3b9308573
// @match        *://soranews24.com/*
// @grant        GM_addStyle
// @run-at         document-start
// @copyright 2018, mattkrins (https://gist.github.com/mattkrins/)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/370033/Kuronews24.user.js
// @updateURL https://update.greasyfork.org/scripts/370033/Kuronews24.meta.js
// ==/UserScript==

GM_addStyle("body { background: #181818; color: #fff; }");
GM_addStyle("a { color: #fff; }");
GM_addStyle("#container { background-image: url(https://user-images.githubusercontent.com/2367602/78979797-1b88de00-7b0c-11ea-8a58-e98a1607e621.png); }");
GM_addStyle("#content { background: #202020; }");
GM_addStyle("#main-page-nav li a { color: #aaaaaa; }");
GM_addStyle("#main-page-nav li a:hover { color: #fff; background: none; }");
GM_addStyle("#main-content .wp-paginate li span.current { background-color: #aaaaaa; }");
GM_addStyle("#main-content .post-header h2 a { color: #fff; }");
GM_addStyle("#footer { background-image: none; }");

GM_addStyle("#main-content .post-footer .post-meta .sprite { background: none; }");
GM_addStyle("#main-content .post-content .more-link { background: none; }");
GM_addStyle("#main-content .post-content .more-link::after { content: '\\21E2'; }");

GM_addStyle("#sub-content #widget_rankings .ranking ol { background: none; }");
GM_addStyle("#sub-content .widget_socio_ranking ol li::before { background: #aaaaaa; }");

// Comments
GM_addStyle("#responses #comments fb\:comments, #responses #trackbacks ol { background: #000; }");
GM_addStyle(".post-misc .ranking { background: none; }");

// Trackbacks Fix
(function() { 'use strict';
             if (document.querySelector("#trackbacks ol")){ document.querySelector("#trackbacks ol").style.background = "none"; }
             // Remove sharing buttons
             document.querySelector(".share-btns").remove();
             // Remove header
             document.querySelector("#header .description").remove();
             document.querySelector("#header .misc").remove();
})();

// Remove sharing buttons
GM_addStyle(".share-btns { display: none; }");