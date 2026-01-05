// M3Board Script für hellere Schriftart
// version 0.1
// 2009-10-18
// Copyright 2009-2014 Marc Sluiter
// Licensed under the Apache License, Version 2.0
// https://github.com/slintes/userscripts/blob/master/LICENSE
//
// --------------------------------------------------------------------
//
// Dies ist ein Greasemonkey Userskript.
// Unter Firefox wird zur Installation das Greasemonkey Addon benötigt: https://addons.mozilla.org/de/firefox/addon/748
// Unter Chrome empfehle ich Tampermonkey (ist aber nicht zwingend notwendig): https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=de
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          M3Board
// @namespace     http://www.slintes.net/greasemonkey/
// @description   M3Board Script für hellere Schriftart
// @include       *m3.meganeboard.de/*
// @version 0.0.1.20140827084530
// @downloadURL https://update.greasyfork.org/scripts/4564/M3Board.user.js
// @updateURL https://update.greasyfork.org/scripts/4564/M3Board.meta.js
// ==/UserScript==

var color = "#DCDCDC";

GM_addStyle(".content { color:" + color + ";}");
GM_addStyle(".postbody { color:" + color + ";}");
GM_addStyle(".postprofile { color:" + color + ";}");
GM_addStyle(".postprofile strong { color:" + color + ";}");
GM_addStyle(".post:target .content { color:" + color + ";}");
