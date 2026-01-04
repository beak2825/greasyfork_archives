// ==UserScript==
// @name        Redirect Userscripts.org to Userscripts-MIRROR.org
// @namespace   uso2usom
// @description On any web page it will check if the clicked links goes to userscripts.org. If so, the link will be rewritten to point to userscripts-mirror.org
// @include     http://*.*
// @include     https://*.*
// @exclude     http://shikimori.one/*
// @exclude     https://shikimori.one/*
// @exclude     http://shikimori.org/*
// @exclude     https://shikimori.org/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/383127/Redirect%20Userscriptsorg%20to%20Userscripts-MIRRORorg.user.js
// @updateURL https://update.greasyfork.org/scripts/383127/Redirect%20Userscriptsorg%20to%20Userscripts-MIRRORorg.meta.js
// ==/UserScript==
document.body.addEventListener('mousedown', function(e){
    var targ = e.target || e.srcElement;
    if ( targ && targ.href && targ.href.match(/https?:\/\/shikimori.one/) ) {
        targ.href = targ.href.replace(/https?:\/\/shikimori\.one/, 'http://shikimori.org');
    }
});
