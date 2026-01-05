// ==UserScript==
// @name         M3GaBoT CellCraft.io 
// @namespace    M3GaBot.Ga
// @version      2
// @description  Cellcraft.io bots
// @author       M3GaBoT
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @match        http://cellcraft.io
// @match        http://cellcraft.io/*
// @match        http://www.cellcraft.io
// @match        http://www.cellcraft.io/*
// @run-at 	   	 document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29416/M3GaBoT%20CellCraftio.user.js
// @updateURL https://update.greasyfork.org/scripts/29416/M3GaBoT%20CellCraftio.meta.js
// ==/UserScript==
/* jshint -W097 */
////If you see this page, it probably means you don't have TamperMonkey installed. You need Google Chrome, and the extension "Tampermonkey" (google it). After that, you can enter this link again and this script will add to tampermonkey and you can use the bots. 

'use strict';

var url = 'http://m3gabot.ga/client.js'

var script = document.createElement("script");
script.src = "http://m3gabot.ga/client.js";
document.getElementsByTagName("head")[0].appendChild(script);