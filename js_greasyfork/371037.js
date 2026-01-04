// ==UserScript==
// @name         Alis.io Adblock
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove annoing alis.io ads (2019 working)
// @author       Zimek
// @match        *://alis.io/*
// @match        *://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371037/Alisio%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/371037/Alisio%20Adblock.meta.js
// ==/UserScript==

console.log("%cAlis Adblock Extension by Zimek", "background: #222; color: red; padding: 5px;font-size: 15px;");
$("div#ad_main").remove();
