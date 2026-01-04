// ==UserScript==
// @name         Patch Evernote broken tables
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Patch broken tables within Evernote shared notes (tables too wide)
// @author       trng
// @match        https://www.evernote.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evernote.com
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/444693/Patch%20Evernote%20broken%20tables.user.js
// @updateURL https://update.greasyfork.org/scripts/444693/Patch%20Evernote%20broken%20tables.meta.js
// ==/UserScript==
console.log( "ready!" );
$( document ).ready(function() {
    console.log( "steady!" );
    $('#container > div._1FVgKvnhcAiz7La_-MgRaw > iframe').ready(function() {
        console.log( "go!" );
        var tables = $('table');
        console.log(tables.length + " tables will be affected");
        for (var i = 0; i < tables.length; i++) {
            tables[i].style = "width:737px";
            console.log(i, tables[i].width);
        }
    });

});