// ==UserScript==
// @name         Alis.io privacy
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  You can hide your facebook name.
// @author       Zimek
// @match        http://alis.io/*
// @match        http://*.alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369459/Alisio%20privacy.user.js
// @updateURL https://update.greasyfork.org/scripts/369459/Alisio%20privacy.meta.js
// ==/UserScript==

console.log("%cAlis Privacy Extension by Zimek", "background: #222; color: #fff; padding: 5px;font-size: 15px;");
$("h3.uk-card-title").css("filter", "blur(8px)");