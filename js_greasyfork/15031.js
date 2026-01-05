// ==UserScript==
// @name        Purple Wanikani
// @namespace   ffao
// @description Don't worry anymore about feeling left out by purple banners!
// @include     http://www.wanikani.com/chat/*
// @include     https://www.wanikani.com/chat/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15031/Purple%20Wanikani.user.js
// @updateURL https://update.greasyfork.org/scripts/15031/Purple%20Wanikani.meta.js
// ==/UserScript==

function main() {  
    $('.forum-post-author-says').removeClass('premium').addClass('lifetime')
}

//-------------------------------------------------------------------
// Copied shamelessly from rfindley's scripts
//-------------------------------------------------------------------
if (document.readyState === 'complete')
    main();
else
    window.addEventListener("load", main, false);