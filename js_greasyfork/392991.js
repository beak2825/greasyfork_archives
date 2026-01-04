// ==UserScript==
// @name         YouTube in compact
// @name:ja      YouTube in compact
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Show 6 video in row on YouTube top page!
// @description:ja  トップページ上で１段に６つのサムネを表示させるよ！
// @author       Alex.nfo
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392991/YouTube%20in%20compact.user.js
// @updateURL https://update.greasyfork.org/scripts/392991/YouTube%20in%20compact.meta.js
// ==/UserScript==


function YTcompact() {
    document.getElementsByTagName("ytd-rich-grid-renderer")[0].style = "--ytd-rich-grid-items-per-row:6; --ytd-rich-grid-posts-per-row:3; --ytd-rich-grid-movies-per-row:7";
    document.getElementsByTagName("html")[0].style = "font-size: 9px;font-family: Roboto, Arial, sans-serif; ";
    
}

(function() {
    'use strict';
    
    // action for once
    ( window.innerWidth >= window.parent.screen.width * 0.75 ) ? YTcompact() : document.getElementsByTagName("ytd-rich-grid-renderer")[0].style = "";

    // an event lister for detecting window size changing
    window.addEventListener( 'resize', function() {( window.innerWidth >= window.parent.screen.width * 0.75 ) ? YTcompact() : document.getElementsByTagName("ytd-rich-grid-renderer")[0].style = "";}, false );
})();