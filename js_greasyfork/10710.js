// ==UserScript==
// @name         FastDL fetcher
// @namespace    http://higherdimensionsgaming.com/
// @version      1.4
// @description  Gets FastDL Lua lines to add to your GMOD server
// @author       [HDG] Mr DeeJayy
// @match        http://steamcommunity.com/sharedfiles/filedetails/?id=*
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10710/FastDL%20fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/10710/FastDL%20fetcher.meta.js
// ==/UserScript==
var GMOD = $(/Garry\'s Mod/i.test (document.body.innerHTML) );
var ADDON = $(/Subscribe/i.test (document.body.innerHTML) );
var _URL = window.location.href;
var Regex = /\d{5,}/;
var ID = Regex.exec(_URL);
var x = document.getElementsByClassName("example");
if (GMOD) {
    if (ADDON) {
       document.getElementsByClassName("game_area_purchase_margin")[0].innerHTML = document.getElementsByClassName("game_area_purchase_margin")[0].innerHTML + "<div class=\"game_area_purchase_game\"><h1><span>Add to FastDL</span><br><input type=\"text\" value=\"resource.AddWorkshop('" + ID + "')\" style=\"height: 25px;width: 300px;\"></span></h1></div>";
    }
}