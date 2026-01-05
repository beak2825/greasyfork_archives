// ==UserScript==
// @name         Gigrawars Tastatur Skript
// @namespace    http://board.gigrawars.de
// @version      1.1
// @description  Tastenkombinationen
// @author       Magnum Mandel (lolofufu@bk.ru)
// @match        http://uni2.gigrawars.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27845/Gigrawars%20Tastatur%20Skript.user.js
// @updateURL https://update.greasyfork.org/scripts/27845/Gigrawars%20Tastatur%20Skript.meta.js
// ==/UserScript==

$(document).keypress(function(event) {
    if(document.activeElement.tagName == "TEXTAREA" || document.activeElement.tagName == "INPUT") {
        return;
    }
    if(event.charCode == 120) { // x Prev Plani
        $("#next_coord").click();
    } else if(event.charCode == 121) { // Y Next Plani
        $("#prev_coord").click();
    } else if(event.charCode == 97) { // A Renegade
        $("#content > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > span").click();
    } else if(event.charCode == 115) { // S Falcon
        $("#content > form > table > tbody > tr:nth-child(6) > td:nth-child(2) > span").click();
    } else if(event.charCode == 100) { // D Submit
        $("form").eq(0).submit();
    } else if(event.charCode == 113) { // Q Kolo
        $("#content > form > table > tbody > tr:nth-child(7) > td:nth-child(2) > span").click();
    } else if(event.charCode == 119) { // W Lex
        $("#content > form > table > tbody > tr:nth-child(14) > td:nth-child(2) > input").val("1");
    } else if(event.charCode == 106) { // j
        $("#navigation > ul:nth-child(2) > li:nth-child(2) > a").click();
    } else if(event.charCode == 107) { // k

    } else if(event.charCode == 108) { // L

    } else if(event.charCode == 114) { // R LeV
        $("#content > form > table > tbody > tr:nth-child(10) > td:nth-child(2) > span").click();
    } else if(event.charCode == 101) { // E GHS
        $("#content > form > table > tbody > tr:nth-child(12) > td:nth-child(2) > span").click();
    } else {
        console.log(event.charCode);
    }
    //
});