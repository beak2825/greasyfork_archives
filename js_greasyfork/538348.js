// ==UserScript==
// @name        Koowahn Homepage Buttons
// @namespace   https://glb.warriorgeneral.com
// @include     https://glb.warriorgeneral.com/game/home.pl
// @include     https://glb.warriorgeneral.com/game/home.pl?user_id=*
// @description Custom Homepage setup for Koowahn
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/538348/Koowahn%20Homepage%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/538348/Koowahn%20Homepage%20Buttons.meta.js
// ==/UserScript==
 
var elements = document.getElementsByClassName('list_name');
 
 
// add button to show one team onclick
const newNode1 = document.createElement("div");
newNode1.innerHTML = '<input id="clickMe1" class="button-1" type="button" value="TEAM FILTER" onclick="showTeam();" style="float: left; margin-left: 5px; margin-right: 5px; margin-bottom: 5px; height: 25px; width: 130px; font-weight: bold; background-color: #0095ff;  border: 1px solid transparent;  border-radius: 3px;  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;  box-sizing: border-box;  color: #fff;  cursor: pointer;  display: inline-block;  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;  font-size: 13px;  font-weight: 400;  line-height: 1.15385;  margin: 0;  outline: none;  padding: 8px .8em;  position: relative;  text-align: center;  text-decoration: none;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  white-space: nowrap;" />';
const parentDiv1 = document.getElementById("sort_players").parentNode;
let sp1 = document.getElementById("sort_players");
parentDiv1.insertBefore(newNode1, sp1);
// add event listeners to the button
var el1 = document.getElementById("clickMe1");
if (el1.addEventListener) {
    el1.addEventListener("click", showTeam, false);
} else if (el1.attachEvent) {
    el1.attachEvent('onclick', showTeam);
}
 
function showTeam(){
    let team = prompt("Please Enter Team Name", "All");
    var trArray = document.getElementById("sort_players").getElementsByTagName("tr");
    for (var i = 0; i < elements.length; i++) {
        if (document.getElementsByClassName('list_lastgame')[i].firstChild.firstChild.innerHTML != team){
            trArray[i+1].style.display = "none";
        }
    }
}
 
// add button to run MVP numbers onclick
const newNode2 = document.createElement("div");
newNode2.innerHTML = '<input id="clickMe2" class="button-1" type="button" value="SHOW MVP RANKINGS" onclick="getMVPs();" style="float: left; margin-left: 5px; margin-right: 5px; margin-bottom: 5px; height: 25px; width: 130px; font-weight: bold; background-color: #0095ff;  border: 1px solid transparent;  border-radius: 3px;  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;  box-sizing: border-box;  color: #fff;  cursor: pointer;  display: inline-block;  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;  font-size: 13px;  font-weight: 400;  line-height: 1.15385;  margin: 0;  outline: none;  padding: 8px .8em;  position: relative;  text-align: center;  text-decoration: none;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  white-space: nowrap;" />';
const parentDiv2 = document.getElementById("sort_players").parentNode;
let sp2 = document.getElementById("sort_players");
parentDiv2.insertBefore(newNode2, sp2);
// add event listeners to the button
var el2 = document.getElementById("clickMe2");
if (el2.addEventListener) {
    el2.addEventListener("click", getMVPs, false);
} else if (el2.attachEvent) {
    el2.attachEvent('onclick', getMVPs);
}
 
function getMVPs(){
    for (var i = 0; i < elements.length; i++) {
        var href = document.getElementsByClassName('list_name')[i].innerHTML;
        getInetPage("https://glb.warriorgeneral.com/game/player_awards.pl?player_id="+document.getElementsByClassName('list_name')[i].innerHTML.substr(35,7),handlePlayer,i);
    }
}
 
// add button to open temp boosts
const newNode3 = document.createElement("div");
newNode3.innerHTML = '<input id="clickMe3" class="button-1" type="button" value="TEMP BOOSTS" onclick="tempBoostLink();" style="float: left; margin-left: 5px; margin-right: 5px; margin-bottom: 5px; height: 25px; width: 130px; font-weight: bold; background-color: #0095ff;  border: 1px solid transparent;  border-radius: 3px;  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;  box-sizing: border-box;  color: #fff;  cursor: pointer;  display: inline-block;  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;  font-size: 13px;  font-weight: 400;  line-height: 1.15385;  margin: 0;  outline: none;  padding: 8px .8em;  position: relative;  text-align: center;  text-decoration: none;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  white-space: nowrap;" />';
const parentDiv3 = document.getElementById("sort_players").parentNode;
let sp3 = document.getElementById("sort_players");
parentDiv3.insertBefore(newNode3, sp3);
// add event listeners to the button
var el3 = document.getElementById("clickMe3");
if (el3.addEventListener) {
    el3.addEventListener("click", tempBoostLink, false);
} else if (el3.attachEvent) {
    el3.attachEvent('onclick', tempBoostLink);
}
 
function tempBoostLink(){
    window.open("https://glb.warriorgeneral.com/game/bonus_tokens.pl?player_id=4875644", "_blank");
}
 
// add button to open The Mob 4AEQ
const newNode4 = document.createElement("div");
newNode4.innerHTML = '<input id="clickMe4" class="button-1" type="button" value="THE MOB 4AEQ" onclick="mobEquip();" style="float: left; margin-left: 5px; margin-right: 5px; margin-bottom: 5px; height: 25px; width: 130px; font-weight: bold; background-color: #0095ff;  border: 1px solid transparent;  border-radius: 3px;  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;  box-sizing: border-box;  color: #fff;  cursor: pointer;  display: inline-block;  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;  font-size: 13px;  font-weight: 400;  line-height: 1.15385;  margin: 0;  outline: none;  padding: 8px .8em;  position: relative;  text-align: center;  text-decoration: none;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  white-space: nowrap;" />';
const parentDiv4 = document.getElementById("sort_players").parentNode;
let sp4 = document.getElementById("sort_players");
parentDiv4.insertBefore(newNode4, sp4);
// add event listeners to the button
var el4 = document.getElementById("clickMe4");
if (el4.addEventListener) {
    el4.addEventListener("click", mobEquip, false);
} else if (el4.attachEvent) {
    el4.attachEvent('onclick', mobEquip);
}
 
function mobEquip(){
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4879826&equip=324046', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4869947&equip=319899', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4869960&equip=319903', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4869962&equip=319699', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875651&equip=319943', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875655&equip=318721', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875656&equip=318714', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875659&equip=318686', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875661&equip=318692', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875662&equip=318696', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875668&equip=318707', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4876011&equip=318567', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4876623&equip=319338', '_blank');

}
 
// add button to open The Mob 3AEQ
const newNode5 = document.createElement("div");
newNode5.innerHTML = '<input id="clickMe5" class="button-1" type="button" value="THE MOB 3AEQ" onclick="mobUnequip();" style="float: left; margin-left: 5px; margin-right: 5px; margin-bottom: 5px; height: 25px; width: 130px; font-weight: bold; background-color: #0095ff;  border: 1px solid transparent;  border-radius: 3px;  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;  box-sizing: border-box;  color: #fff;  cursor: pointer;  display: inline-block;  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;  font-size: 13px;  font-weight: 400;  line-height: 1.15385;  margin: 0;  outline: none;  padding: 8px .8em;  position: relative;  text-align: center;  text-decoration: none;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  white-space: nowrap;" />';
const parentDiv5 = document.getElementById("sort_players").parentNode;
let sp5 = document.getElementById("sort_players");
parentDiv4.insertBefore(newNode5, sp5);
// add event listeners to the button
var el5 = document.getElementById("clickMe5");
if (el5.addEventListener) {
    el5.addEventListener("click", mobUnequip, false);
} else if (el5.attachEvent) {
    el5.attachEvent('onclick', mobUnequip);
}
 
function mobUnequip(){
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4879826&equip=252407', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4869947&equip=188487', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4869960&equip=188491', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4869962&equip=188496', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875651&equip=227444', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875655&equip=227455', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875656&equip=227463', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875659&equip=227472', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875661&equip=227479', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875662&equip=227488', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4875668&equip=227509', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4876011&equip=229057', '_blank');
window.open('https://glb.warriorgeneral.com/game/equipment.pl?player_id=4876623&equip=231549', '_blank');

}
 
// add button to show current temp boosts
const newNode8 = document.createElement("div");
newNode8.innerHTML = '<input id="clickMe8" class="button-1" type="button" value="SHOW TEMPS" onclick="showTemps();" style="float: left; margin-left: 5px; margin-right: 5px; margin-bottom: 5px; height: 25px; width: 130px; font-weight: bold; background-color: #0095ff;  border: 1px solid transparent;  border-radius: 3px;  box-shadow: rgba(255, 255, 255, .4) 0 1px 0 0 inset;  box-sizing: border-box;  color: #fff;  cursor: pointer;  display: inline-block;  font-family: -apple-system,system-ui,"Segoe UI","Liberation Sans",sans-serif;  font-size: 13px;  font-weight: 400;  line-height: 1.15385;  margin: 0;  outline: none;  padding: 8px .8em;  position: relative;  text-align: center;  text-decoration: none;  user-select: none;  -webkit-user-select: none;  touch-action: manipulation;  vertical-align: baseline;  white-space: nowrap;" />';
const parentDiv8 = document.getElementById("sort_players").parentNode;
let sp8 = document.getElementById("sort_players");
parentDiv8.insertBefore(newNode8, sp8);
// add event listeners to the button
var el8 = document.getElementById("clickMe8");
if (el8.addEventListener) {
    el8.addEventListener("click", showTemps, false);
} else if (el8.attachEvent) {
    el8.attachEvent('onclick', showTemps);
}
// Show Temp Boosts on Home Page
function showTemps(){
    for (var i = 0; i < elements.length; i++) {
        getTemps("https://glb.warriorgeneral.com/game/bonus_tokens.pl?player_id="+document.getElementsByClassName('list_name')[i].innerHTML.substr(35,7),i);
    }
}
function getTemps(address, index) {
    //console.log("getInetPage : "+address);
    var req = new XMLHttpRequest();
	req.open( 'GET', address, true );
	req.onload = function() {
		if (this.status != 200) {
			alert("pbr gm script: Error "+this.status+" loading "+address);
		}
		else {
            var div = document.createElement("div");
            div.innerHTML = this.responseText;
            var temp1 = div.getElementsByClassName("upgrade_icon")[28].innerHTML;
            var temp2 = div.getElementsByClassName("upgrade_icon")[29].innerHTML;
            //console.log(div.getElementsByClassName("upgrade_icon")[28].firstChild.src);
            if (div.getElementsByClassName("upgrade_icon")[28].firstChild.src != 'https://glb.warriorgeneral.com/images/game/bonus_tokens/skill_point.png'){
                document.getElementsByClassName('list_vp')[index].innerHTML = temp1;
                document.getElementsByClassName('list_tp')[index].innerHTML = temp2;
            }
		}
	};
 
	req.send(null);
	return req;
}
 
 
// fetch archetype images after a delay
setTimeout(function(){
    for (var i = 0; i < elements.length; i++) {
        var href = document.getElementsByClassName('list_name')[i].innerHTML;
        getArchetype("https://glb.warriorgeneral.com/game/player.pl?player_id="+document.getElementsByClassName('list_name')[i].innerHTML.substr(35,7),i);
    }
},2000); //delay is in milliseconds
 
function handlePlayer(address, page, index) {
    var div = document.createElement("div");
    div.innerHTML = page.responseText;
 
	var atO = parseInt(div.getElementsByClassName("large_info")[0].lastChild.innerHTML);
	var atD = parseInt(div.getElementsByClassName("large_info")[1].lastChild.innerHTML);
	//var csO = parseInt(div.getElementsByClassName("large_info")[12].lastChild.innerHTML);
	//var csD = parseInt(div.getElementsByClassName("large_info")[13].lastChild.innerHTML);
	var oMVP = parseInt(div.getElementsByClassName("large_info")[6].innerHTML);
	var dMVP = parseInt(div.getElementsByClassName("large_info")[7].innerHTML);
    //console.log("index: "+index+" CSO: "+csO+" CSD: "+csD);
    var atRank = "";
    if(atO<atD){atRank=atO;}else{atRank=atD;}
    if(parseInt(atRank)>199){atRank="-";}
    if(isNaN(atRank)){atRank="-";}
    //var csRank = "";
    //if(csO<csD){csRank=csO}else{csRank=csD};
    //if(parseInt(csRank)>99){csRank="-"};
    //if(isNaN(csRank)){csRank="-"};
    var MVP = "";
    if(oMVP<dMVP){MVP=oMVP;}else{MVP=dMVP;}
    if(parseInt(MVP)>20){MVP="-";}
    if(isNaN(MVP)){MVP="-";}
    document.getElementsByClassName('list_xp')[index].innerHTML = atRank;
    //document.getElementsByClassName('list_vxp')[index].innerHTML = csRank; current season HOF rank, replacing with MVP standings for now
    //document.getElementsByClassName('list_bt')[index].lastChild.href = address;
    //document.getElementsByClassName('list_bt')[index].lastChild.innerHTML = MVP; show in BT column, changed to trained column below
    document.getElementsByClassName('list_vxp')[index].innerHTML = MVP;
 
}
 
function getInetPage(address, func, index) {
    //console.log("getInetPage : "+address);
    var req = new XMLHttpRequest();
	req.open( 'GET', address, true );
	req.onload = function() {
		if (this.status != 200) {
			alert("pbr gm script: Error "+this.status+" loading "+address);
		}
		else {
			//console.log("loaded: "+address)
			func(address,this,index);
		}
	};
 
	req.send(null);
	return req;
}
 
function getArchetype(address, index) {
    //console.log("getInetPage : "+address);
    var req = new XMLHttpRequest();
	req.open( 'GET', address, true );
	req.onload = function() {
		if (this.status != 200) {
			alert("pbr gm script: Error "+this.status+" loading "+address);
		}
		else {
            var div2 = document.createElement("div");
            div2.innerHTML = this.responseText;
 
            var archImg = parseInt(div2.getElementsByClassName("large_title_bar")[0].nextSibling);
            var all_images = div2.querySelectorAll('img');
            var image_i_want = all_images[9].src;
            if(image_i_want == "https://glb.warriorgeneral.com/images/game/design/forum_icon.gif"){image_i_want = all_images[8].src}
            //console.log("index: "+index+" CSO: "+csO+" CSD: "+csD);
            document.getElementsByClassName('list_trained')[index].innerHTML = '<img src="'+image_i_want+'" />';
		}
	};
 
	req.send(null);
	return req;
}