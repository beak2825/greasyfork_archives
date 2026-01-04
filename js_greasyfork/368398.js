// ==UserScript==
// @name         Kiszamolo linkelt komment highlight
// @version      1.0
// @description  A linkelt komment köré köré rajzol egy piros szart hogy látható legyen mi van linkelve a kiszamolo.hu oldalon
// @author       Lajos Sánta
// @match        https://kiszamolo.hu/*
// @namespace https://greasyfork.org/users/187325
// @downloadURL https://update.greasyfork.org/scripts/368398/Kiszamolo%20linkelt%20komment%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/368398/Kiszamolo%20linkelt%20komment%20highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hash.startsWith("#comment-"))
        jQuery(window.location.hash).css({boxShadow: '0 0 4px #E91538'});

})();
