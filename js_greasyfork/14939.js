// ==UserScript==
// @name         kissmanga arrow navigation
// @version      1.0
// @description  Use Left and Right Arrows to Navigate Chapters
// @author       Bandaras
// @include        http://kissmanga.com/manga/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js
// @run-at-document-end
// @namespace https://greasyfork.org/users/23321
// @downloadURL https://update.greasyfork.org/scripts/14939/kissmanga%20arrow%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/14939/kissmanga%20arrow%20navigation.meta.js
// ==/UserScript==
/* jshint -W097 */
document.addEventListener("keyup",keyup,false);
var next = $('a:has(img[title=Next chapter])').attr('href');
var prev = $('a:has(img[title=Prev chapter])').attr('href');

function keyup (key) {
    if (key.keyCode==39) {
        window.location.href = next;
    } else if (key.keyCode==37) {
        window.location.href = prev;
    }
}