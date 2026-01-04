// ==UserScript==
// @name         Gazelle : Open All Links
// @namespace    https://greasyfork.org/users/165243
// @version      0.1
// @description  Adds a button to open all links in a forum post
// @author       Quoph
// @include      http*://redacted.ch/forums.php?*action=viewthread*
// @include      http*://apollo.rip/forums.php?*action=viewthread*
// @include      http*://notwhat.cd/forums.php?*action=viewthread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38647/Gazelle%20%3A%20Open%20All%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/38647/Gazelle%20%3A%20Open%20All%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var post = $('.forum_post .body');
    $(post).each(function(i, b){
        var as = $(this).find('a');
        var links = [];
        $(as).each(function() {
            if (this.href.indexOf('user.php?id') == -1 && !this.href.endsWith("#") && this.href.indexOf('javascript:void(0);') == -1) {
                links.push(this);
            }
        });
        if (links.length > 1){
            var btn = document.createElement('button');
            btn.innerHTML = "Open All Links (" + links.length + ")";
            btn.setAttribute('style', 'float:right;');
            $(b).append(btn);
            btn.addEventListener ("click", function() {
                // Sarafi workaround
                var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                $(links).each(function(i, a) {
                    isSafari ? setTimeout(function() {
                        window.open(a, '_blank');
                    }, i * 1001) : window.open(a, '_blank');
                });
            });
        }
    });
})();