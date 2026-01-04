// ==UserScript==
// @name        Hattrick match history inverter 
// @namespace   hattrick.org
// @match       https://*.hattrick.org/Club/Matches/Archive.aspx?*
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version     1.1
// @author      LA-Alcedo
// @description This script inverts Hattrick.org match history table to be ordered from oldest to newest
// @downloadURL https://update.greasyfork.org/scripts/411885/Hattrick%20match%20history%20inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/411885/Hattrick%20match%20history%20inverter.meta.js
// ==/UserScript==

$(function(){
    $("tbody").each(function(elem,index){
      var arr = $.makeArray($("tr",this).detach());
      arr.reverse();
        $(this).append(arr);
    });
});