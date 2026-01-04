// ==UserScript==
// @name         SH Auto Show Bookmark
// @namespace    ultrabenosaurus.ScribbleHub
// @version      0.3
// @description  Automatically change the Table of Contents page to show your bookmarked chapter when opening a series page on Scribble Hub.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.scribblehub.com/series/*
// @icon         https://www.google.com/s2/favicons?domain=scribblehub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415263/SH%20Auto%20Show%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/415263/SH%20Auto%20Show%20Bookmark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if( 0 == document.querySelectorAll('.toc_ol li.current').length && 0 == document.querySelectorAll('i#menu_icon_fic.fa-reply.isdisabled_color').length && "" == location.search ){
        goto_bookmarkchp();
    }
})();