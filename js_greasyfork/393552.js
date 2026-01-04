// ==UserScript==
// @name         Google Books - center page on screen
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  This script will center book pages (in Google Books web-app)
// @author       patryk@strzelecki.info
// @match        https://books.googleusercontent.com/books/reader/display*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393552/Google%20Books%20-%20center%20page%20on%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/393552/Google%20Books%20-%20center%20page%20on%20screen.meta.js
// ==/UserScript==

var $ = window.jQuery;

$(document).ready(function() {
    setTimeout(doCenter, 1500);
});

$( window ).resize(function() {
  setTimeout(doCenter, 1500);
});

function doCenter() {
    var mainTable = document.querySelector("table.gb-two-page");
    mainTable.style="";
};