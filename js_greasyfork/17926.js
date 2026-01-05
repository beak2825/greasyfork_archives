// ==UserScript==
// @name     Rename title on poe.trade
// @name:fr     Rename title on poe.trade
// @namespace   Malou
// @description:en  Very light script to change tab titles related to searches on poe.trade.
// @description:fr  Script tout simple pour changer le nom des onglets sur poe.trade
// @include     http*://poe.trade/search/*
// @version     1
// @grant       GM_log
// @require     https://code.jquery.com/jquery-2.1.4.min.js
// @description Very light script to change tab titles related to searches on poe.trade.
// @downloadURL https://update.greasyfork.org/scripts/17926/Rename%20title%20on%20poetrade.user.js
// @updateURL https://update.greasyfork.org/scripts/17926/Rename%20title%20on%20poetrade.meta.js
// ==/UserScript==

var reqname = $("#item-container-0 > tr:nth-child(1) > td:nth-child(2) > h5:nth-child(1) > a:nth-child(1)").eq(0).text().trim();
document.title = reqname;