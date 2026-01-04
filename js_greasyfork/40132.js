// ==UserScript==
// @name         Remove bs on MAL
// @namespace    clean_mal
// @version      0.5
// @description  try to take over the world!
// @author       Samu
// @match        https://myanimelist.net/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/40132/Remove%20bs%20on%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/40132/Remove%20bs%20on%20MAL.meta.js
// ==/UserScript==

var query = [
    "a.button_add.on-hold, a.button_edit.on-hold",
    "a.button_add.watching, a.button_edit.watching",
    "a.button_add.completed, a.button_edit.completed",
    "a.button_add.plantowatch, a.button_edit.plantowatch",
    "a.button_add.dropped, a.button_edit.dropped",
    "a.button_add.reading, a.button_edit.reading",
    "a.button_add.plantoread, a.button_edit.plantoread"
].join(", ");

var toHide = [
    "a[href^='https://myanimelist.net/manga_translation_battle']",
    ".banner-header-anime-straming",
    "._unit",
    "#nav > li:nth-child(8)",
    "#nav > li:nth-child(6)",
    "#nav > li:nth-child(5)"
]. join(", ");

var css = [
    query + " {",
    "  color: #888888 !important;",
    "  background-color: #EFEFEF !important;",
    "}",
    toHide + " {",
    "  display: none;",
    "  visibility: hidden !important;",
    "  position: fixed !important;",
    "  width: 0 !important;",
    "}"
].join("\n");

GM_addStyle(css);


document.addEventListener("DOMContentLoaded", function() {
    $(".easter").removeClass("easter");
    $(".christmas").removeClass("christmas");
    $(".halloween").removeClass("halloween");

    var btns = document.querySelectorAll(query);
    for (var i = 0; i < btns.length; i++) {
        btns[i].innerHTML = "Edit";
    }
});