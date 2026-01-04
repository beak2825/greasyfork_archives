// ==UserScript==
// @name        PeeJJK Homepage Rewrite
// @namespace   https://glb.warriorgeneral.com
// @include     https://glb.warriorgeneral.com/game/home.pl
// @include     https://glb.warriorgeneral.com/game/home.pl?user_id=*
// @description Custom Homepage setup for PeeJJK
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/538033/PeeJJK%20Homepage%20Rewrite.user.js
// @updateURL https://update.greasyfork.org/scripts/538033/PeeJJK%20Homepage%20Rewrite.meta.js
// ==/UserScript==

var elements = document.getElementsByClassName('list_name');

const rows = document.querySelectorAll("#playerTable > tbody > tr");
for(const row of rows){
    row.insertBefore(row.children[2], row.children[6]);
}
const rows2 = document.querySelectorAll("#playerTable > tbody > tr");
for(const row of rows2){
    row.insertBefore(row.children[2], row.children[0]);
}

var th = document.getElementsByTagName("th");
th[0].innerHTML = "TEAM";
th[1].innerHTML = "PIC";
th[2].innerHTML = "NAME";
th[3].innerHTML = "LVL";
th[4].innerHTML = "AGE";
th[5].innerHTML = "ARCH";
th[7].innerHTML = "HOF";
th[8].innerHTML = "MVP";
th[13].innerHTML = "ID";
th[14].innerHTML = "TEAM";

for (var i = 0; i < elements.length; i++) {
    document.getElementsByClassName('list_name')[i].style.textAlign = 'center';
    document.getElementsByClassName('list_nextgame')[i].style.textAlign = 'center';
    document.getElementsByClassName('list_nextgame')[i].style.maxWidth = "50px";
    document.getElementsByClassName('list_lastgame')[i].style.maxWidth = "150px";
    document.getElementsByClassName('list_trained')[i].style.textAlign = 'center';
    document.getElementsByClassName('list_name')[i].style.fontSize = "14px";;
    document.getElementsByClassName('list_lastgame')[i].style.fontSize = "12px";
    document.getElementsByClassName('list_name')[i].style.fontWeight = "bold";
    document.getElementsByClassName('list_lastgame')[i].style.fontWeight = "bold";
    document.getElementsByClassName('list_lastgame')[i].style.width = "190px";
    document.getElementsByClassName('list_team')[i].style.width = "47px";
    //document.getElementsByClassName('list_team')[i].style.width = "190px";
    //document.getElementsByClassName('list_trained')[i].style.display = "none";

    document.getElementsByClassName('list_team')[i].lastChild.lastChild.style.display = "none";
    var teamLink = document.getElementsByClassName('list_team')[i].innerHTML;
    var teamID = document.getElementsByClassName('list_team')[i].innerHTML.substr(74,5);
    if (teamID == "t_opt"){teamID = "Free Agent"}
    document.getElementsByClassName('list_nextgame')[i].innerHTML = teamID;
    document.getElementsByClassName('list_lastgame')[i].innerHTML = teamLink;

    var href = document.getElementsByClassName('list_name')[i].innerHTML;
    var href2 = document.getElementsByClassName('list_team')[i].innerHTML;
    document.getElementsByClassName('list_team')[i].innerHTML = '<img src="https://glb.warriorgeneral.com/game/team_pic.pl?team_id='+href2.substr(74,5)+'" width="45" height="45" style="border:1px solid #a03c19">';
    document.getElementsByClassName('list_number')[i].innerHTML = '<img src="/game/player_pic.pl?player_id='+href.substr(35,7)+'" width="45" height="45" style="border:1px solid #a03c19">';

}