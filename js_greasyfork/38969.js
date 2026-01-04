// ==UserScript==
// @name         NameMC Link Script
// @namespace    https://www.cubecraft.net/
// @version      0.1
// @description  Landviz fan boi xd
// @author       _Oplex_
// @match        https://www.cubecraft.net/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38969/NameMC%20Link%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/38969/NameMC%20Link%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

var names = $(".playerUsername");

for(var i = 0; i < names.length; i++)
    $(names[i]).html("<a target='_blank' href='https://namemc.com/profile/" + $(names[i]).html() + "'>" + $(names[i]).html() + "</a>");

})();