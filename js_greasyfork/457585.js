// ==UserScript==
// @name         Remove Deletion
// @namespace    https://almedawaterwell.com/
// @version      0.1
// @description  Completely removes the ability for a user to delete any Events within Google Calendar. This includes Events on their personal calendar.
// @author       Luke Pyburn
// @match        *://calendar.google.com/calendar/u/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @license      MIT
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/457585/Remove%20Deletion.user.js
// @updateURL https://update.greasyfork.org/scripts/457585/Remove%20Deletion.meta.js
// ==/UserScript==

var $ = window.jQuery;

//Removes trash/delete icon from all Events in quick edit.
window.addEventListener("focusin", function(event) {
    var todelete = document.querySelector('#xDetDlgDelBu');
    todelete.remove();
    console.log("Delete button removed.");
});

//Removes "Delete" as a selectable option in Event Edit's "More Options" drop-down menu.
window.addEventListener("focusin", function(event) {
    var todelete = document.querySelector("#YPCqFe > div > div.JPdR6b.Q3pIde.qjTEB > div > div > span:nth-child(2) > div.uyYuVb.oJeWuf");
    todelete.remove();
    console.log("Delete button removed.");
});

//Junk
// #YPCqFe > div > div.JPdR6b.Q3pIde.qjTEB > div > div > span:nth-child(2)
// z80M1 taKRZe
//  > div > div.JPdR6b.Q3pIde.qjTEB > div > div > span:nth-child(2)
// xDetDlg
// $('uArJ5e Y5FYJe cjq2Db d29e1c M9Bg4d').remove();
// Junk