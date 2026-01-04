// ==UserScript==
// @name        meneame.net - Fix Permalinks
// @namespace   http://tampermonkey.net/
// @version     0.4
// @description Usa el estilo rancio y acortado de los Permalinks a comentarios.
// @author      ᵒᶜʰᵒᶜᵉʳᵒˢ
// @include     *.meneame.net/*
// @connect     meneame.net
// @icon        https://www.meneame.net/favicon.ico
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/442379/meneamenet%20-%20Fix%20Permalinks.user.js
// @updateURL https://update.greasyfork.org/scripts/442379/meneamenet%20-%20Fix%20Permalinks.meta.js
// ==/UserScript==

// ---- SCRIPT values ----
const Permalink_URL = 'https://www.meneame.net/c/';
const User_Comment_URLs = ['/commented','/conversation','/shaken_comments','/favorite_comments'];

(function() {
    var URL = window.location.href;
    if (link_id > 0
        || URL.includes('&w=comments')
        || URL.includes('meneame.net/c/')
        || (URL.includes('/user/') && (User_Comment_URLs.reduce((a,c) => a + URL.includes(c), 0) == 1))) {
        var comments = document.querySelectorAll('a[title="Permalink"]');
        for (var comment of comments) {
            var number = comment.parentNode.childNodes[1].id.lastIndexOf('-');
            if (number){
                comment.setAttribute('href', Permalink_URL + comment.parentNode.childNodes[1].id.substring(number + 1));
            }
        }
    }
})();