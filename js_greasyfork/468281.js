// ==UserScript==
// @name         Reload AMP
// @namespace    https://github.com/shajul/userscripts/raw/master/ReloadAMP.user.js
// @version      0.2
// @description  Reload AMP articles to redirect page to non-AMP'd site!
// @author       You
// @include      https://news.google.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468281/Reload%20AMP.user.js
// @updateURL https://update.greasyfork.org/scripts/468281/Reload%20AMP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var my_href = "";
    setInterval(function(){
        my_href = document.location.href;
        if ( my_href.includes("/articles/") ) {
            // console.log('Reloading news article..');
            window.location.reload();
        }
    }, 1000)
})();
