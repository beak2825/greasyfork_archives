// ==UserScript==
// @name         Steam badge auto craft
// @version      0.1
// @description  Will craft all the badge that you can
// @author       You
// @match        https://steamcommunity.com/id/*/badges/?autocraft*
// @match        https://steamcommunity.com/id/*/badges?autocraft*
// @grant        none
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/369567/Steam%20badge%20auto%20craft.user.js
// @updateURL https://update.greasyfork.org/scripts/369567/Steam%20badge%20auto%20craft.meta.js
// ==/UserScript==

var craftbtn = document.getElementsByClassName("badge_craft_button");
var craft = [];
for(var i=0; i<craftbtn.length; i++){craft[i]=craftbtn[i].href.split( 'gamecards/' )[1].split( '/' );}
if (craft.length <= 0) {console.log("No more badge to craft !");window.location = window.location.origin+window.location.pathname;} else {
var profileUrl = window.location.href.split( 'badges/' )[0];
var series = 1;
var border_color = 0;
for(var i=0; i<craft.length; i++){
if (craft[i]["1"].length <= 0) {border_color = 0;} else {border_color = craft[i]["1"].replace(/[^0-9]+/, '');}
console.log("Profile_CraftGameBadge( "+profileUrl+", "+craft[i]["0"]+", "+series+", "+border_color+" )");
Profile_CraftGameBadge(profileUrl, craft[i]["0"], series, border_color);}
window.location.reload(true);
}