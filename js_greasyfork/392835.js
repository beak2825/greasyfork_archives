// ==UserScript==
// @name         AniScroll
// @namespace    http://tampermonkey.net/
// @version      0.1.0-alpha
// @description  An attempt to prettify the scrollbars in AniList
// @author       dr.dialup <https://anilist.co/user/drdialup/>
// @match        anilist.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392835/AniScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/392835/AniScroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '/* Dimensions */ ::-webkit-scrollbar { width: 10px; height: 10px; } /* Track */ ::-webkit-scrollbar-track {  } /* Handle */ ::-webkit-scrollbar-thumb { background: #1f232d; border-radius: 8px; } /* Handle */ .text[data-v-6994d971] ::-webkit-scrollbar-thumb { background: #272c38; border-radius: 10px; } /* Handle on hover */ ::-webkit-scrollbar-thumb:hover { background: #13171d; } /* Handle */ .text[data-v-6994d971] ::-webkit-scrollbar-thumb:hover { background: #13171d; } .text[data-v-6994d971] .markdown:hover { overflow-y: overlay } .text[data-v-6994d971] .markdown { margin-bottom: 14px; margin-top: 14px; max-height: 560px; overflow: hidden; } ';
    document.getElementsByTagName('head')[0].appendChild(style);
})();