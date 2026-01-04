// ==UserScript==
// @name        [GC] - Popout Shop Wiz
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/*
// @exclude     https://www.grundos.cafe/itemview/*
// @license     MIT
// @version     86
// @author      Cupkait
// @icon        https://i.imgur.com/4Hm2e6z.png
// @grant       none
// @require     https://update.greasyfork.org/scripts/512407/1582200/GC%20-%20Virtupets%20API%20library.js

// @description   Shop Wiz searches default to appearing in a pop-out window within your current page instead of having to go between new tabs or windows. Note: Reviewed and greenlit via staff ticket #5830.

// Report any bugs, comments, question, etc. to user Cupkait, or on Discord @kaitlin. (with the period).


// @downloadURL https://update.greasyfork.org/scripts/535932/%5BGC%5D%20-%20Popout%20Shop%20Wiz.user.js
// @updateURL https://update.greasyfork.org/scripts/535932/%5BGC%5D%20-%20Popout%20Shop%20Wiz.meta.js
// ==/UserScript==

if (!localStorage.getItem('scriptAlert-535932')) {
    alert("Popout Shop Wiz script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-535932', 'true');
}