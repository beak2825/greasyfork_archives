// ==UserScript==
// @name         Steam badge craft button
// @version      0.1111
// @description  Will transform the useless blue button "Ready" to an actual working carft button.
// @author       Zeper
// @match        https://steamcommunity.com/id/*/badges*
// @grant        none
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/370058/Steam%20badge%20craft%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/370058/Steam%20badge%20craft%20button.meta.js
// ==/UserScript==

var craftbtn = document.getElementsByClassName("badge_craft_button");
var craft = [];
for(var i=0; i<craftbtn.length; i++){craft[i]=craftbtn[i].href.split( 'gamecards/' )[1].split( '/' );}
if (craft.length <= 0) {console.log("No craft button to do !");}
else {
    var profileUrl = window.location.href.split( 'badges/' )[0];
    var series = 1;
    var border_color = 0;
    var jshref;
    var hidebtn;
    ShowDialog = function(){};
    for( i=0; i<craft.length; i++){
        if (craft[i]["1"].length <= 0) {border_color = 0;} else {border_color = craft[i]["1"].replace(/[^0-9]+/, '');}
        jshref = "Profile_CraftGameBadge( "+"'"+profileUrl+"'"+", "+craft[i]["0"]+", "+series+", "+border_color+" );";
        hidebtn = "document.getElementsByClassName('badge_craft_button')["+i+"].hide();"
        craftbtn[i].href = "javascript:"+jshref;
        craftbtn[i].innerText = "CRAFT";
        craftbtn[i].setAttribute("Onclick", hidebtn);
        console.log("javascript:"+jshref);
    }
}