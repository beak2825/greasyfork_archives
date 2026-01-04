// ==UserScript==
// @name         MyHG Thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Takes you back to the thumbnails view of a comic.
// @author       isvinc3s
// @match        https://myhentaigallery.com/gallery/show/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/371284/MyHG%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/371284/MyHG%20Thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cElem = $(".breadcrumbs.clear ul li:nth-child(3)");
    var cName = cElem.html();
    var cNum = window.location.href.split('/')[5];

    cElem.empty();
    cElem.html('<a href="https://myhentaigallery.com/gallery/thumbnails/' + cNum + '">' + cName + "</a>");
    console.log(cName);
})();