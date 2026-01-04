// ==UserScript==
// @icon         https://cdn.discordapp.com/emojis/823513307712454727.png?v=1
// @name         developingCAMenu
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Dont not take over the world
// @author       naber
// @match        http://zombs.io/*
// @match   meadow-rocky-lan.glitch.me
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437610/developingCAMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/437610/developingCAMenu.meta.js
// ==/UserScript==
/*---------------------------------menu--------------------------------*/
/*scroll*/
var auto = 144120101162108118162105110108113106162113114114101162108105162107104162137104100110104103162119107108118167167167;
document.querySelector(".hud-chat-messages")
	.style.width = "900px";
let CAMenucss = `
.hud-CAMenu-grid3::-webkit-scrollbar-track {
	box-shadow: inset 0 0 5px white;
	border-radius: 10px;
  border: white solid 1px;
  background-color: rgba(0,0,0,0.8);
}
.hud-CAMenu-grid3::-webkit-scrollbar {
   background-color: blue;
    border-radius: 10px;
	width: 10px;
  }
 
.hud-CAMenu-grid3::-webkit-scrollbar-thumb {
   background: rgba(217, 217, 217, 1);
  border-radius: 10px;
  width: 3px;}
 
.hud-CAMenu-grid3::-webkit-scrollbar-thumb:hover {
    background: rgba(177, 177, 177, 1);
  border-radius: 10px;
   }
.hud-menu-CAMenu {
/*scroll bar*/
/**/
display: none;
position: fixed;
top: 48%;
left: 50%;
width: 600px;
height: 470px;
margin: -270px 0 0 -300px;
padding: 20px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
border-radius: 4px;
z-index: 100;
}
 
.hud-menu-CAMenu .hud-CAMenu-grid3 {
display: block;
height: 360px;
padding: 10px;
margin-top: 18px;
background: rgba(0, 0, 0, 0.3);
overflow: auto;
}
 
.hud-spell-icons .hud-spell-icon[data-type="CAMenu"]::before {
background-image: url("https://www.linkpicture.com/q/Icon.png");
}
 
.hud-spell-icon[data-type="CAMenu"]:hover{
}
 
/* BTN */
 
.CAbtn:hover {
cursor: pointer;
}
.CAbtn1 {
background-color: rgba(0, 0, 0, 0);
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtn1:hover{
opacity: 0.6;
cursor: pointor;
}
.CAbtn1-activated {
background-color: rgba(255, 255, 255, 0.5);
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtn1-activated:hover{
opacity: 0.6;
cursor: pointor
}
 
.CAbtnR {
background-color: #FF5964;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnR:hover{
opacity: 0.6;
cursor: pointor;
}
 
.CAbtnY {
background-color: #FFE74C;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnY:hover{
opacity: 0.6;
cursor: pointor;
}
 
.CAbtnG {
background-color: #6BF178;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnG:hover{
opacity: 0.6;
cursor: pointor;
}
 
.CAbtnB {
background-color: #35A7FF;
border: 2px solid white;
color: white;
height:40px;
margin: 5px;
border-radius: 10px;
padding: 7px;
width: 243px;
}
.CAbtnB:hover{
opacity: 0.6;
cursor: pointor;
}
 
 
.hud-CAMenuClose-icon{
position: relative;
transform: scale(2);
bottom: 460px;
float: right;
z-index:100;
 
opacity: 0.2;
}
 
.hud-CAMenuClose-icon:hover{
opacity: 0.5;
cursor: pointer;
}
 
.hud-CAMenuTitle{
position: relative;
bottom: 480px;
font-size: 30px;
color: white;
text-align: center;
left:10px;
font-weight: bold;
font-family: "Hammersmith One", sans-serif;
}
 
/*emm*/
 
.box {
display: block;
width: 100%;
height: 50px;
line-height: 34px;
padding: 8px 14px;
margin: 0 0 10px;
background: #eee;
border: 0;
font-size: 14px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
border-radius: 4px;
}
.codeIn, .joinOut {
height: 50px;
}
 
.hud-menu-zipp3 h3 {
display: block;
margin: 0;
line-height: 20px;
}
 
 
.hud-menu-zipp3 .hud-the-tab {
position: relative;
height: 40px;
line-height: 40px;
margin: 20px;
border: 0px solid rgb(0, 0, 0, 0);
}
.hud-menu-zipp3 .hud-the-tab {
display: block;
float: left;
padding: 0 14px;
margin: 0 1px 0 0;
font-size: 14px;
background: rgba(0, 0, 0, 0.4);
color: rgba(255, 255, 255, 0.4);
transition: all 0.15s ease-in-out;
}
.hud-menu-zipp3 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
cursor: pointer;
}
`;
console.log(auto);
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(CAMenucss));
document.head.appendChild(styles);
styles.type = "text/css";
 
// spell icon
let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "CAMenu");
spell.classList.add("hud-CAMenu-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);
 
//tiptool hover
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("mouseover", onMenuicon);
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("mouseout", offMenuicon);
 
function onMenuicon() {
	var caMenuTooltip = document.createElement('div');
	caMenuTooltip.classList.add("hud-tooltip");
	caMenuTooltip.classList.add("hud-tooltip-right");
	caMenuTooltip.classList.add("CaTooltip");
	caMenuTooltip.style = "left: 76px; top: 325px; font-size:15px;font-weight:bold; font-family:Hammersmith One;";
	caMenuTooltip.innerHTML = "!CAMenu!";
	document.body.appendChild(caMenuTooltip);
}
 
function offMenuicon() {
	document.getElementsByClassName("CaTooltip")[0].remove();
}
//Menu for spell icon
let modHTML = `
<div class="hud-menu-CAMenu">
<br />
<style>
.mt{
width: 15%;
background-color:rgba(0, 0, 0, 0);
border: 2px solid #fff;
border-radius: 5px;
margin: 5px;
color: white;
}
 
.SI{
width: 15%;
background-color:rgba(0, 0, 0, 0);
border: 2px solid #fff;
border-radius: 5px;
margin: 5px;
color: white;
padding: 1px;
}
 
.SI:hover
{
opacity: 0.6;
cursor: pointer;
}
.mt:hover{
opacity: 0.6;
cursor: pointer;
}
</style>
<div style="text-align:center">
<button class="SE mt">Normal</button>
<button class="AB mt">Auto Build</button>
<button class="PA mt">Party</button>
<button class="BS mt">Chat</button>
<button class="SI MT">How To Use</button>
<div class="hud-CAMenu-grid3">
</div>
<p class="hud-CAMenuClose-icon">&#x2715</p>
<p class="hud-CAMenuTitle">CAMenu</P>
</div>
`;
document.body.insertAdjacentHTML("afterbegin", modHTML);
let CaMenu = document.getElementsByClassName("hud-menu-CAMenu")[0];
 
//Onclick
//ca icon click
document.getElementsByClassName("hud-CAMenu-icon")[0].addEventListener("click", function () {
	if (CaMenu.style.display == "none" || CaMenu.style.display == "") {
		document.getElementById("hud-menu-shop")
			.style.display = "none";
		document.getElementById("hud-menu-party")
			.style.display = "none";
		document.getElementById("hud-menu-settings")
			.style.display = "none";
		CaMenu.style.display = "block";
	} else {
		CaMenu.style.display = "none";
	};
});
//close icon click
document.getElementsByClassName("hud-CAMenuClose-icon")[0].addEventListener("click", function () {
	if (CaMenu.style.display == "none" || CaMenu.style.display == "") {
		document.getElementById("hud-menu-shop")
			.style.display = "none";
		document.getElementById("hud-menu-party")
			.style.display = "none";
		document.getElementById("hud-menu-settings")
			.style.display = "none";
		CaMenu.style.display = "block";
	} else {
		CaMenu.style.display = "none";
	};
});
 
let _menu = document.getElementsByClassName("hud-menu-icon");
let _spell = document.getElementsByClassName("hud-spell-icon");
let allIcon = [
    _menu[0], _menu[1], _menu[2], _spell[0], _spell[1]
];
 
//emm
allIcon.forEach(function (elem) {
	elem.addEventListener("click", function () {
		if (CaMenu.style.display == "block") {
			CaMenu.style.display = "none";
		};
	});
});
 
document.getElementsByClassName("SE")[0].addEventListener("click", function () {
	displayAllToNone();
	document.getElementsByClassName("SE")[0].innerText = "- - -";
	document.getElementsByClassName("etc.Class")[0].innerText = "Normal";
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i")[0]) {
			document.getElementsByClassName(i + "i")[0].style.display = "";
		}
	}
})
 
document.getElementsByClassName("AB")[0].addEventListener("click", function () {
	displayAllToNone();
	document.getElementsByClassName("AB")[0].innerText = "- - -";
	document.getElementsByClassName("etc.Class")[0].innerText = "Auto Build";
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i2")[0]) {
			document.getElementsByClassName(i + "i2")[0].style.display = "";
		}
	}
})
 
document.getElementsByClassName("PA")[0].addEventListener("click", function () {
	displayAllToNone();
	document.getElementsByClassName("PA")[0].innerText = "- - -";
	document.getElementsByClassName("etc.Class")[0].innerText = "Party";
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i3")[0]) {
			document.getElementsByClassName(i + "i3")[0].style.display = "";
		}
	}
})
document.getElementsByClassName("BS")[0].addEventListener("click", function () {
	displayAllToNone();
	document.getElementsByClassName("BS")[0].innerText = "- - -";
	document.getElementsByClassName("etc.Class")[0].innerText = "Chat";
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i4")[0]) {
			document.getElementsByClassName(i + "i4")[0].style.display = "";
		}
	}
})
 
 
 
 
document.getElementsByClassName("SI")[0].addEventListener("click", function () {
	displayAllToNone();
	document.getElementsByClassName("SI")[0].innerText = "- - -";
	document.getElementsByClassName("etc.Class")[0].innerText = "How To Use";
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i5")[0]) {
			document.getElementsByClassName(i + "i5")[0].style.display = "";
		}
	}
})
 
function displayAllToNone() {
	document.getElementsByClassName("SE")[0].innerText = "Normal";
	document.getElementsByClassName("AB")[0].innerText = "Auto Build";
	document.getElementsByClassName("BS")[0].innerText = "Chat";
	document.getElementsByClassName("PA")[0].innerText = "Party";
	document.getElementsByClassName("SI")[0].innerText = "How To Use";
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i")[0]) {
			document.getElementsByClassName(i + "i")[0].style.display = "none";
		}
	}
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i2")[0]) {
			document.getElementsByClassName(i + "i2")[0].style.display = "none";
		}
	}
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i3")[0]) {
			document.getElementsByClassName(i + "i3")[0].style.display = "none";
		}
	}
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i4")[0]) {
			document.getElementsByClassName(i + "i4")[0].style.display = "none";
		}
	}
	for (let i = 0; i < 50; i++) {
		if (document.getElementsByClassName(i + "i5")[0]) {
			document.getElementsByClassName(i + "i5")[0].style.display = "none";
		}
	}
}
document.getElementsByClassName("hud-CAMenu-grid3")[0].innerHTML = `
<div style="text-align:center">
<!----------------------------first page--------------------------->
<div class="etc.Class">
<hr />
<h2>Casually Addicting aka Trash's Menu</h2>
<h3>Hope you like it!</h3>
</div>
<hr />
 
<!----------------------------normal--------------------------->
 
<button class="CAbtn1 1i"id = "SellAll">Sell All</button>
<button class="CAbtn1 2i"id = "SellWalls">Sell Walls</button>
<button class="CAbtn1 3i"id = "SellDoors">Sell Doors</button>
<button class="CAbtn1 4i"id = "SellSlowtraps">Sell Slow Traps</button>
<button class="CAbtn1 5i"id = "SellArrows">Sell Arrow Towers</button>
<button class="CAbtn1 6i"id = "SellCanons">Sell Canon Towers</button>
<button class="CAbtn1 7i"id = "SellMelees">Sell Melee Towers</button>
<button class="CAbtn1 8i"id = "SellBombs">Sell Bomb Towers</button>
<button class="CAbtn1 9i"id = "SellMages">Sell Mage Towers</button>
<button class="CAbtn1 10i"id = "SellGoldmines">Sell Gold Mines</button>
<button class="CAbtn1 11i"id = "SellHarvesters">Sell Resource Harvesters</button>
<hr class="12i">
<button class="CAbtn1 13i"id="AHRC">Enable AHRC</button>
<button class="CAbtn1-activated 14i"id="daynight">Disable Night Dark</button>
 
 
<!----------------------------Auto Build--------------------------->
 
<button class="CAbtn1 1i2"id ="auto3x3">Enable Auto 3x3</button>
<button class="CAbtn1 2i2"id ="autoHarvesterTrap">Enable Auto Harvester Trap</button>
 
<!--------------------------------Party------------------------------>
<label for="zombs.ioPartyKey" class="1i3">Party Code:</label>
<input type="text" id="partycodeinput" name="zombs.ioPartyKey" required maxlength="20" size="22" class="2i3" placeholder = "Party Share Key..."style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid white;">
<button class="CAbtn1 3i3"id="joinparty" style="width: 200px">Enable Auto Join Party</button>
<br class="4i3">
<button class="CAbtn1 5i3"id="leaveparty">Leave Party</button>
<hr class="6i3">
<!----------------------------Chat--------------------------->
 
<input type="text" id="spamtext" name="spamtext" required maxlength="60" size="40" placeholder="Things To Spam..."class="1i4" style="background-color:rgba(0,0,0,0);padding: 5px; border-radius:5px;color:rgba(255,255,255,0.7); border:2px solid white;">
<button class="CAbtn1 2i4"id="spambtn" style="width: 200px;">Enable Spam Chat</button>
<button class="CAbtn1 3i4"id="clearchatbtn">Clear Chat</button>
<!----------------------------How To Use--------------------------->
 
</div>
 
`;
displayAllToNone();
//<----end of menu stuff
/*------------------------------variables---------------------------------*/
var auto3x3 = false;
var CAshouldBuild3x3Walls = false;
var CAshouldBuild5x5Walls = false;
var CAshouldBuild7x7Walls = false;
var AHRC = false;
var nightdark = true;
var JoinParty = false;
var spamchat = false;
var joinedserver = false;
var v_autoharvestertrap = false;
var mapmousex;
var mapmousey;
var mapmovetox;
var mapmovetoy;
var shouldMapMove;
/*-----------------------------------------------simple functions----------------------------------------------*/
 
 
function CAchat(msg) {
	Game.currentGame.network.sendRpc({
		name: "SendChatMessage"
		, channel: "Local"
		, message: msg
	})
}
 
function placeWall(x, y) {
	game.network.sendRpc({
		name: 'MakeBuilding'
		, x: x
		, y: y
		, type: "Wall"
		, yaw: 0
	});
}
 
function placeHarvester(x, y) {
	game.network.sendRpc({
		name: 'MakeBuilding'
		, x: x
		, y: y
		, type: "Harvester"
		, yaw: 0
	});
}
 
function CAThree(gridPos) {
	placeWall(gridPos.x, gridPos.y);
	placeWall(gridPos.x + 48, gridPos.y);
	placeWall(gridPos.x, gridPos.y + 48);
	placeWall(gridPos.x - 48, gridPos.y);
	placeWall(gridPos.x, gridPos.y - 48);
	placeWall(gridPos.x - 48, gridPos.y + 48);
	placeWall(gridPos.x + 48, gridPos.y - 48);
	placeWall(gridPos.x + 48, gridPos.y + 48);
	placeWall(gridPos.x - 48, gridPos.y - 48);
}
 
function CAFive(gridPos) {
	//1 layer
	placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x, gridPos.y + 48 + 48);
	placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
	//2 layer
	placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
	placeWall(gridPos.x - 48, gridPos.y + 48);
	placeWall(gridPos.x, gridPos.y + 48);
	placeWall(gridPos.x + 48, gridPos.y + 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
	//3 layer
	placeWall(gridPos.x - 48 - 48, gridPos.y);
	placeWall(gridPos.x - 48, gridPos.y);
	placeWall(gridPos.x, gridPos.y);
	placeWall(gridPos.x + 48, gridPos.y);
	placeWall(gridPos.x + 48 + 48, gridPos.y);
	//4 layer
	placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
	placeWall(gridPos.x - 48, gridPos.y - 48);
	placeWall(gridPos.x, gridPos.y - 48);
	placeWall(gridPos.x + 48, gridPos.y - 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
	//5 layer
	placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x, gridPos.y - 48 - 48);
	placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
}
 
function CASeven(gridPos) {
	//1 layer
	placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48 + 48)
	placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48 + 48);
	placeWall(gridPos.x - 48, gridPos.y + 48 + 48 + 48);
	placeWall(gridPos.x, gridPos.y + 48 + 48 + 48);
	placeWall(gridPos.x + 48, gridPos.y + 48 + 48 + 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48 + 48);
	placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48 + 48);
	//2 layer
	placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x - 48 - 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x - 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x, gridPos.y + 48 + 48);
	placeWall(gridPos.x + 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y + 48 + 48);
	placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48 + 48);
	//3 layer
	placeWall(gridPos.x - 48 - 48 - 48, gridPos.y + 48);
	placeWall(gridPos.x - 48 - 48, gridPos.y + 48);
	placeWall(gridPos.x - 48, gridPos.y + 48);
	placeWall(gridPos.x, gridPos.y);
	placeWall(gridPos.x + 48, gridPos.y + 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y + 48);
	placeWall(gridPos.x + 48 + 48 + 48, gridPos.y + 48);
	//4 layer
	placeWall(gridPos.x - 48 - 48 - 48, gridPos.y);
	placeWall(gridPos.x - 48 - 48, gridPos.y);
	placeWall(gridPos.x - 48, gridPos.y);
	placeWall(gridPos.x, gridPos.y);
	placeWall(gridPos.x + 48, gridPos.y);
	placeWall(gridPos.x + 48 + 48, gridPos.y);
	placeWall(gridPos.x + 48 + 48 + 48, gridPos.y);
	//5 layer
	placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48);
	placeWall(gridPos.x - 48 - 48, gridPos.y - 48);
	placeWall(gridPos.x - 48, gridPos.y - 48);
	placeWall(gridPos.x, gridPos.y - 48);
	placeWall(gridPos.x + 48, gridPos.y - 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y - 48);
	placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48);
	//6 layer
	placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x - 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x, gridPos.y - 48 - 48);
	placeWall(gridPos.x + 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48);
	placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48);
	//7 layer
	placeWall(gridPos.x - 48 - 48 - 48, gridPos.y - 48 - 48 - 48);
	placeWall(gridPos.x - 48 - 48, gridPos.y - 48 - 48 - 48);
	placeWall(gridPos.x - 48, gridPos.y - 48 - 48 - 48);
	placeWall(gridPos.x, gridPos.y - 48 - 48 - 48);
	placeWall(gridPos.x + 48, gridPos.y - 48 - 48 - 48);
	placeWall(gridPos.x + 48 + 48, gridPos.y - 48 - 48 - 48);
	placeWall(gridPos.x + 48 + 48 + 48, gridPos.y - 48 - 48 - 48);
	//idk why x4, y5 ( 5 layer 4) is not working so i just make 3x3 again
	CAThree(gridPos);
}
/*---------------------------------------------------hacks--------------------------------------------------------*/
function joinserver() {
	joinedserver = true;
}
////////////introoooooooo
var newIntroFooter = `<div class="hud-intro-footer" style="text-align:center;">
            <span>© 2021 ZOMBS.io</span>
            <a href="/changelog" target="_blank">Changelog</a>
            <a href="/privacy" target="_blank">Privacy Policy</a>
        </div>`;
 
var SubToCA = `<div class="hud-intro-corner-top-left">
            <div class="hud-intro-youtuber">
                <h3>Subscribe to my YT channel:</h3>
                <a href="https://www.youtube.com/channel/UCnyYhAtCelWrTPwkZfX42AA" target="_blank">Casually Addicting</a>
            </div>
        </div>`;
//position bottom left
var mapcontainer = document.createElement('div');
mapcontainer.id = "hud-mapcontainer";
document.querySelector('.hud-bottom-left')
	.append(mapcontainer);
document.querySelector("#hud-mapcontainer")
	.appendChild(document.querySelector("#hud-map"));
var mapcontainercss = document.querySelector("#hud-mapcontainer")
	.style;
mapcontainercss.position = "relative";
mapcontainercss.top = "17px";
mapcontainercss.right = "17px";
mapcontainercss.margin = "0px";
mapcontainercss.width = "140px";
mapcontainercss.zIndex = "30";
 
document.querySelector(".hud-map")
	.style.border = "3px solid black";
 
var huddaynighttickerstyle = document.querySelector(".hud-day-night-ticker")
	.style;
huddaynighttickerstyle.position = "relative";
huddaynighttickerstyle.top = "17px";
huddaynighttickerstyle.right = "20px";
huddaynighttickerstyle.margin = "3px";
//change looking
document.querySelectorAll('.ad-unit')
	.forEach(function (a) {
		a.remove();
	});
 
document.getElementsByClassName("hud-intro-left")[0].remove();
document.getElementsByClassName("hud-intro-guide")[0].remove();
document.getElementsByClassName("hud-intro-footer")[0].innerHTML = newIntroFooter;
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
document.getElementsByClassName("hud-intro-corner-top-left")[0].innerHTML = SubToCA;
document.getElementsByClassName("hud-intro-wrapper")[0].getElementsByTagName("h2")[0].innerHTML = `<h2>Moded with CAMenu</h2>`;
document.getElementsByClassName("hud-intro-name")[0].placeholder = "Username.. cant join if name too long";
document.getElementsByClassName("hud-intro-name")[0].maxLength = "29";
// longest name generate
var horizontallongestnamebtn = document.createElement("button");
horizontallongestnamebtn.className = "btn hud-intro-horizontallongestnickbtn";
horizontallongestnamebtn.innerHTML = "Use horizontal longest username";
horizontallongestnamebtn.style = `margin-bottom: 10px;`;
document.querySelector(".hud-intro-server")
	.parentNode.insertBefore(horizontallongestnamebtn, document.querySelector(".hud-intro-server"));
var verticallongestnamebtn = document.createElement("button");
verticallongestnamebtn.className = "btn hud-intro-verticallongestnickbtn";
verticallongestnamebtn.innerHTML = "Use vertical longest username";
verticallongestnamebtn.style = `margin-bottom: 10px;`;
document.querySelector(".hud-intro-server")
	.parentNode.insertBefore(verticallongestnamebtn, document.querySelector(".hud-intro-server"));
//xy show
var xyshow = document.createElement("p");
xyshow.style = 'position: relative; top:17px; right:17px; text-shadow: 1px 1px white; font-weight: 900; font-family:Hammersmith One;';
xyshow.innerHTML = "loading x y coordinate";
xyshow.className = "xyshowcoordinate";
document.querySelector(".hud-bottom-left")
	.appendChild(xyshow);
//auto harvester trap
function autoharvestertrap() {
	v_autoharvestertrap = !v_autoharvestertrap;
	document.getElementById("autoHarvesterTrap")
		.innerHTML = v_autoharvestertrap ? "Disable Auto Harvester Trap" : "Enable Auto Harvester Trap";
	document.getElementById("autoHarvesterTrap")
		.classList.replace(v_autoharvestertrap ? "CAbtn1" : "CAbtn1-activated", v_autoharvestertrap ? "CAbtn1-activated" : "CAbtn1");
	if (v_autoharvestertrap) {
 
		game.ui.getComponent('PopupOverlay')
			.showHint("[Auto Harvester Trap] has enabled, if you want to trap people, make sure you've sold all harvesters!", 1e4);
		CAchat("🏗 Auto Harvester Trap enabled 🏗");
	} else {
		CAchat("❌🏗 Auto Harvester Trap disabled 🏗❌");
	}
}
 
document.addEventListener('mousedown', e => {
	let CAmousePs = {
		x: e.clientX
		, y: e.clientY
	};
	if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Harvester") {
		var CAbuildingSchema = game.ui.getBuildingSchema();
		var CAschemaData = CAbuildingSchema.Wall;
		var CAmousePosition = game.ui.getMousePosition();
		var CAworld = game.world;
		var CAworldPos = game.renderer.screenToWorld(CAmousePs.x, CAmousePs.y);
		var CAcellIndexes = CAworld.entityGrid.getCellIndexes(CAworldPos.x, CAworldPos.y, {
			width: CAschemaData.gridWidth
			, height: CAschemaData.gridHeight
		});
		var CAcellSize = CAworld.entityGrid.getCellSize();
		var CAcellAverages = {
			x: 0
			, y: 0
		};
		for (var i in CAcellIndexes) {
			if (!CAcellIndexes[i]) {
				return false;
			}
			var CAcellPos = CAworld.entityGrid.getCellCoords(CAcellIndexes[i]);
			var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(CAcellIndexes[i], CAcellPos);
			CAcellAverages.x += CAcellPos.x;
			CAcellAverages.y += CAcellPos.y;
		}
		CAcellAverages.x = CAcellAverages.x / CAcellIndexes.length;
		CAcellAverages.y = CAcellAverages.y / CAcellIndexes.length;
		var gridPos = {
			x: CAcellAverages.x * CAcellSize + CAcellSize / 2
			, y: CAcellAverages.y * CAcellSize + CAcellSize / 2
		};
		console.log("place harvester1");
		if (v_autoharvestertrap) {
			console.log("place harvester");
			placeHarvester(gridPos.x - 144, gridPos.y + 48);
			placeHarvester(gridPos.x - 144, gridPos.y - 48);
			//
			placeHarvester(gridPos.x - 48, gridPos.y + 144);
			placeHarvester(gridPos.x - 48, gridPos.y - 144);
			//
			placeHarvester(gridPos.x + 48, gridPos.y + 144);
			placeHarvester(gridPos.x + 48, gridPos.y - 144);
			//
			placeHarvester(gridPos.x + 144, gridPos.y - 48);
			placeHarvester(gridPos.x + 144, gridPos.y - 48);
		}
	}
})
 
 
//auto3x3 or zxc wall
 
function F_auto3x3() {
	auto3x3 = !auto3x3;
	document.getElementById("auto3x3")
		.innerHTML = auto3x3 ? "Disable Auto 3x3" : "Enable Auto 3x3";
	document.getElementById("auto3x3")
		.classList.replace(auto3x3 ? "CAbtn1" : "CAbtn1-activated", auto3x3 ? "CAbtn1-activated" : "CAbtn1");
	if (auto3x3) {
 
		game.ui.getComponent('PopupOverlay')
			.showHint("[Auto 3x3] has enabled, place wall carefully or u will make a mess!", 1e4);
		CAchat("🏢 Auto 3x3 enabled 🏢");
	} else {
		CAchat("❌🏢 Auto 3x3 disabled 🏢❌");
	}
}
document.addEventListener('mousemove', e => {
	let mousePs = {
		x: e.clientX
		, y: e.clientY
	};
	if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
		var buildingSchema = game.ui.getBuildingSchema();
		var schemaData = buildingSchema.Wall;
		var mousePosition = game.ui.getMousePosition();
		var world = game.world;
		var worldPos = game.renderer.screenToWorld(mousePs.x, mousePs.y);
		var cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {
			width: schemaData.gridWidth
			, height: schemaData.gridHeight
		});
		var cellSize = world.entityGrid.getCellSize();
		var cellAverages = {
			x: 0
			, y: 0
		};
		for (var i in cellIndexes) {
			if (!cellIndexes[i]) {
				return false;
			}
			var cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
			var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(cellIndexes[i], cellPos);
			cellAverages.x += cellPos.x;
			cellAverages.y += cellPos.y;
		}
		cellAverages.x = cellAverages.x / cellIndexes.length;
		cellAverages.y = cellAverages.y / cellIndexes.length;
		var gridPos = {
			x: cellAverages.x * cellSize + cellSize / 2
			, y: cellAverages.y * cellSize + cellSize / 2
		};
		if (auto3x3) {
			CAThree(gridPos);
		}
 
	}
})
 
addEventListener('keydown', function (e) {
	if (e.key == "z") {
		CAshouldBuild3x3Walls = true;
		CAshouldBuild5x5Walls = false;
		CAshouldBuild7x7Walls = false;
	} else if (e.key == "x") {
		CAshouldBuild5x5Walls = true;
		CAshouldBuild3x3Walls = false;
		CAshouldBuild7x7Walls = false;
	} else if (e.key == "c") {
		CAshouldBuild7x7Walls = true;
		CAshouldBuild3x3Walls = false;
		CAshouldBuild5x5Walls = false;
	}
})
 
addEventListener('keyup', function (e) {
	if (e.key == "z") {
		CAshouldBuild3x3Walls = false;
	} else if (e.key == "x") {
		CAshouldBuild5x5Walls = false;
	} else if (e.key == "c") {
		CAshouldBuild7x7Walls = false;
	}
})
 
document.addEventListener('mousedown', e => {
	let CAmousePs = {
		x: e.clientX
		, y: e.clientY
	};
	if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
		var CAbuildingSchema = game.ui.getBuildingSchema();
		var CAschemaData = CAbuildingSchema.Wall;
		var CAmousePosition = game.ui.getMousePosition();
		var CAworld = game.world;
		var CAworldPos = game.renderer.screenToWorld(CAmousePs.x, CAmousePs.y);
		var CAcellIndexes = CAworld.entityGrid.getCellIndexes(CAworldPos.x, CAworldPos.y, {
			width: CAschemaData.gridWidth
			, height: CAschemaData.gridHeight
		});
		var CAcellSize = CAworld.entityGrid.getCellSize();
		var CAcellAverages = {
			x: 0
			, y: 0
		};
		for (var i in CAcellIndexes) {
			if (!CAcellIndexes[i]) {
				return false;
			}
			var CAcellPos = CAworld.entityGrid.getCellCoords(CAcellIndexes[i]);
			var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(CAcellIndexes[i], CAcellPos);
			CAcellAverages.x += CAcellPos.x;
			CAcellAverages.y += CAcellPos.y;
		}
		CAcellAverages.x = CAcellAverages.x / CAcellIndexes.length;
		CAcellAverages.y = CAcellAverages.y / CAcellIndexes.length;
		var gridPos = {
			x: CAcellAverages.x * CAcellSize + CAcellSize / 2
			, y: CAcellAverages.y * CAcellSize + CAcellSize / 2
		};
		if (CAshouldBuild3x3Walls && !auto3x3) {
			CAThree(gridPos);
		} else if (CAshouldBuild5x5Walls && !auto3x3) {
			CAFive(gridPos);
		} else if (CAshouldBuild7x7Walls && !auto3x3) {
			CASeven(gridPos);
		}
	}
})
 
document.addEventListener('mousemove', e => {
		let CAmousePs = {
			x: e.clientX
			, y: e.clientY
		};
		if (game.inputManager.mouseDown && game.ui.components.PlacementOverlay.buildingId == "Wall") {
			var CAbuildingSchema = game.ui.getBuildingSchema();
			var CAschemaData = CAbuildingSchema.Wall;
			var CAmousePosition = game.ui.getMousePosition();
			var CAworld = game.world;
			var CAworldPos = game.renderer.screenToWorld(CAmousePs.x, CAmousePs.y);
			var CAcellIndexes = CAworld.entityGrid.getCellIndexes(CAworldPos.x, CAworldPos.y, {
				width: CAschemaData.gridWidth
				, height: CAschemaData.gridHeight
			});
			var CAcellSize = CAworld.entityGrid.getCellSize();
			var CAcellAverages = {
				x: 0
				, y: 0
			};
			for (var i in CAcellIndexes) {
				if (!CAcellIndexes[i]) {
					return false;
				}
				var CAcellPos = CAworld.entityGrid.getCellCoords(CAcellIndexes[i]);
				var isOccupied = game.ui.components.PlacementOverlay.checkIsOccupied(CAcellIndexes[i], CAcellPos);
				CAcellAverages.x += CAcellPos.x;
				CAcellAverages.y += CAcellPos.y;
			}
			CAcellAverages.x = CAcellAverages.x / CAcellIndexes.length;
			CAcellAverages.y = CAcellAverages.y / CAcellIndexes.length;
			var gridPos = {
				x: CAcellAverages.x * CAcellSize + CAcellSize / 2
				, y: CAcellAverages.y * CAcellSize + CAcellSize / 2
			};
			if (CAshouldBuild3x3Walls && !auto3x3) {
				CAThree(gridPos);
			} else if (CAshouldBuild5x5Walls && !auto3x3) {
				CAFive(gridPos);
			} else if (CAshouldBuild7x7Walls && !auto3x3) {
				CASeven(gridPos);
			}
		}
	})
	//sell all
function SellAll() {
	game.ui.getComponent('PopupOverlay')
		.showConfirmation('Are you sure you want to change default insults? This will reset all custom insults', 1e4, function () {
 
			var entities = Game.currentGame.world.entities;
			for (var uid in entities) {
				if (!entities.hasOwnProperty(uid)) continue;
				var obj = entities[uid];
				if (obj.fromTick.model !== "GoldStash") {
					Game.currentGame.network.sendRpc({
						name: "DeleteBuilding"
						, uid: obj.fromTick.uid
					});
				}
			}
			CAchat("🤑 Sold All 🤑");
 
		}, function () {
			game.ui.getComponent('PopupOverlay')
				.showHint('Fine...', 1e4)
		})
}
 
function SellWalls() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "Wall") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Walls 🤑');
}
 
function SellDoors() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "Door") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Doors 🤑');
}
 
function SellSlowtraps() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "SlowTrap") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Slow Traps 🤑');
}
 
function SellArrows() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "ArrowTower") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Arrow Towers 🤑');
}
 
function SellCanons() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "CanonTower") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Canon Towers 🤑');
}
 
function SellMelees() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "MeleeTower") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Melee Towers 🤑');
}
 
function SellBombs() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "BombTower") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Bomb Towers 🤑');
}
 
function SellMages() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "MageTower") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Mage Towers 🤑');
}
 
function SellGoldmines() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "GoldMine") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Gold Mine 🤑');
}
 
function SellHarvesters() {
	var entities = Game.currentGame.world.entities;
	for (var uid in entities) {
		if (!entities.hasOwnProperty(uid)) continue;
		var obj = entities[uid];
		if (obj.fromTick.model == "Harvester") {
			Game.currentGame.network.sendRpc({
				name: "DeleteBuilding"
				, uid: obj.fromTick.uid
			})
		}
	}
	CAchat('🤑 Sold Resource Harvesters 🤑');
}
 
function F_AHRC() {
	AHRC = !AHRC;
	document.getElementById("AHRC")
		.innerHTML = AHRC ? "Disable AHRC" : "Enable AHRC";
	document.getElementById("AHRC")
		.classList.replace(AHRC ? "CAbtn1" : "CAbtn1-activated", AHRC ? "CAbtn1-activated" : "CAbtn1");
	if (AHRC) {
		CAchat('🌳 AHRC enabled 🌳');
	} else {
		CAchat('❌🌳 AHRC disabled 🌳❌');
	}
}
 
function F_horizontallongestname() {
	document.getElementsByClassName('hud-intro-name')[0].value = '|⸻⸻⸻⸻⸻⸻⸻⸻⸻|';
}
 
function F_verticallongestname() {
	document.getElementsByClassName('hud-intro-name')[0].value = "Name will be changed...";
 
}
game.network.sendEnterWorld2 = game.network.sendEnterWorld;
game.network.sendEnterWorld = (data) => {
 
		data.displayName = document.getElementsByClassName('hud-intro-name')[0].value ==
			"Name will be changed..." ? `҉\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n҉` :
			document.getElementsByClassName('hud-intro-name')[0].value
 
 
		game.network.sendEnterWorld2(data);
	}
	//strong shield
function FixShield() {
	if (Game.currentGame.ui.playerTick.zombieShieldHealth < 8500) {
		Game.currentGame.network.sendRpc({
			name: "EquipItem"
			, itemName: "ZombieShield"
			, tier: Game.currentGame.ui.inventory.ZombieShield.tier
		});
	}
}
Game.currentGame.network.addRpcHandler("DayCycle", FixShield);
//leaveparty
function leaveparty() {
	Game.currentGame.network.sendRpc({
		name: "LeaveParty"
	})
}
//join party
function joinparty() {
	JoinParty = !JoinParty;
	document.getElementById("joinparty")
		.innerHTML = JoinParty ? "Disable Auto Join Party" : "Enable Auto Join Party";
	document.getElementById("joinparty")
		.classList.replace(JoinParty ? "CAbtn1" : "CAbtn1-activated", JoinParty ? "CAbtn1-activated" : "CAbtn1");
}
//daynight
function daynight() {
	nightdark = !nightdark;
	document.getElementById("daynight")
		.innerHTML = nightdark ? "Disable Night Dark" : "Enable Night Dark";
	document.getElementById("daynight")
		.classList.replace(nightdark ? "CAbtn1" : "CAbtn1-activated", nightdark ? "CAbtn1-activated" : "CAbtn1");
	if (nightdark) {
		document.getElementsByClassName("hud-day-night-overlay")[0].style.display = "block";
		CAchat("🌙 Night Dark Enabled 🌙");
 
	} else {
		document.getElementsByClassName("hud-day-night-overlay")[0].style.display = "none";
		CAchat("🌞 Night Dark Disabled 🌞");
	}
}
 
function F_spamchat() {
	spamchat = !spamchat;
	document.getElementById("spambtn")
		.innerHTML = spamchat ? "Disable Spam Chat" : "Enable Spam Chat";
	document.getElementById("spambtn")
		.classList.replace(spamchat ? "CAbtn1" : "CAbtn1-activated", spamchat ? "CAbtn1-activated" : "CAbtn1");
	if (spamchat) {
		CAchat("📢 Spam Chat Enabled 📢");
	} else {
		setTimeout(() => {
			CAchat("❌📢 Spam Chat Disabled 📢❌");
		}, 900);
	}
}
 
function clearchat() {
	document.querySelector('.hud-chat-messages')
		.innerHTML = ""
}
//mapmove
function mapmove(e) {
	mapmousex = e.pageX - 3;
	mapmousey = e.pageY - (document.getElementsByTagName('body')[0].clientHeight - 36 - 140);
	mapmovetox = Math.round(mapmousex / document.querySelector("#hud-mapcontainer")
		.clientWidth * 23973);
	mapmovetoy = Math.round(mapmousey / document.querySelector("#hud-mapcontainer")
		.clientHeight * 23973);
 
	game.ui.getComponent('PopupOverlay')
		.showConfirmation(`Are you sure u wanna move to X: ${mapmovetox}?, Y: ${mapmovetoy}`, 1e4, function () {
 
			shouldMapMove = true;
		}, function () {
			CAchat("huh... ok");
		});
 
}
 
document.addEventListener('keydown', function (e) { // when key is pressed
		if (e.key == "w" || e.key == "a" || e.key == "s" || e.key == "d" || e.keyCode == "37" || e.keyCode == "38" || e.keyCode == "39" || e.keyCode == "40") {
			shouldMapMove = false;
		}
	})
	/*----------------------------------------------------hacks that should call multiple times-------------------------------------*/
setInterval(function () {
 
	if (AHRC) {
		var entities = Game.currentGame.world.entities
		for (let uid in entities) {
			if (!entities.hasOwnProperty(uid)) continue;
			let obj = entities[uid];
			Game.currentGame.network.sendRpc({
				name: "CollectHarvester"
				, uid: obj.fromTick.uid
			});
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 1) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.07
				});
			}
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 2) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.11
				});
			}
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 3) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.17
				});
			}
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 4) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.22
				});
			}
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 5) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.25
				});
			}
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 6) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.28
				});
			}
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 7) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.42
				});
			}
			if (obj.fromTick.model == "Harvester" && obj.fromTick.tier == 8) {
				Game.currentGame.network.sendRpc({
					name: "AddDepositToHarvester"
					, uid: obj.fromTick.uid
					, deposit: 0.65
				});
			}
		}
	}
	//join party
	if (JoinParty) {
		Game.currentGame.network.sendRpc({
			name: "JoinPartyByShareKey"
			, partyShareKey: document.querySelector('#partycodeinput')
				.value
		});
	}
	//show xy
	if (joinedserver) {
		if (xyshow.innerHTML != `X: ${Math.round(game.world.localPlayer.entity.targetTick.position.x)-13}, Y: ${Math.round(game.world.localPlayer.entity.targetTick.position.y)-13}`) {
			xyshow.innerHTML = `X: ${Math.round(game.world.localPlayer.entity.targetTick.position.x - 13)}, Y: ${Math.round(game.world.localPlayer.entity.targetTick.position.y) - 13}`;
		}
	}
 
 
	//spam chat
	if (spamchat) {
		CAchat(document.querySelector('#spamtext')
			.value);
	}
 
	if (shouldMapMove) {
		var moving = [0, 0, 0, 0];
		if ((Math.round(game.world.localPlayer.entity.targetTick.position.y) - 13 /*current pos y*/ ) - mapmovetoy > 100) {
			game.network.sendInput({ down: 0 })
			moving[0] = 1;
		} else {
			game.network.sendInput({ down: 1 })
			moving[0] = 0;
		}
		if ((-(Math.round(game.world.localPlayer.entity.targetTick.position.y) - 13) /*current pos y*/ ) + mapmovetoy > 100) {
			game.network.sendInput({ up: 0 })
			moving[1] = 1;
		} else {
			game.network.sendInput({ up: 1 })
			moving[1] = 0;
		}
		if ((-(Math.round(game.world.localPlayer.entity.targetTick.position.x) - 13) /*current pos x*/ ) + mapmovetox > 100) {
			game.network.sendInput({ left: 0 })
			moving[2] = 1;
		} else {
			game.network.sendInput({ left: 1 })
			moving[2] = 0;
		}
		if ((Math.round(game.world.localPlayer.entity.targetTick.position.x) - 13 /*current pos x*/ ) - mapmovetox > 100) {
			game.network.sendInput({ right: 0 })
			moving[3] = 1;
		} else {
			game.network.sendInput({ right: 1 })
			moving[3] = 0;
		}
		if ((moving[0] + moving[1] + moving[2] + moving[3]) == 0) {
			shouldMapMove = false;
			CAchat("done");
		}
	}
}, 100);
/*--------------------------------------------------events--------------------------------------------------------*/
document.querySelector('#auto3x3')
	.addEventListener('click', F_auto3x3);
document.querySelector('#SellAll')
	.addEventListener('click', SellAll);
document.querySelector('#SellWalls')
	.addEventListener('click', SellWalls);
document.querySelector('#SellDoors')
	.addEventListener('click', SellDoors);
document.querySelector('#SellSlowtraps')
	.addEventListener('click', SellSlowtraps);
document.querySelector('#SellArrows')
	.addEventListener('click', SellArrows);
document.querySelector('#SellCanons')
	.addEventListener('click', SellCanons);
document.querySelector('#SellMelees')
	.addEventListener('click', SellMelees);
document.querySelector('#SellBombs')
	.addEventListener('click', SellBombs);
document.querySelector('#SellMages')
	.addEventListener('click', SellMages);
document.querySelector('#SellGoldmines')
	.addEventListener('click', SellGoldmines);
document.querySelector('#SellHarvesters')
	.addEventListener('click', SellHarvesters);
document.querySelector('#AHRC')
	.addEventListener('click', F_AHRC);
document.querySelector('.hud-intro-horizontallongestnickbtn')
	.addEventListener('click', F_horizontallongestname);
document.querySelector('.hud-intro-verticallongestnickbtn')
	.addEventListener('click', F_verticallongestname);
document.querySelector('#leaveparty')
	.addEventListener('click', leaveparty);
document.querySelector('#joinparty')
	.addEventListener('click', joinparty);
document.querySelector('#daynight')
	.addEventListener('click', daynight);
document.querySelector('#spambtn')
	.addEventListener('click', F_spamchat);
document.querySelector('#clearchatbtn')
	.addEventListener('click', clearchat);
document.querySelector('.hud-intro-play')
	.addEventListener('click', joinserver);
document.querySelector('#autoHarvesterTrap')
	.addEventListener('click', autoharvestertrap);
//mapclick
document.querySelector('#hud-mapcontainer')
	.addEventListener('click', function (e) {
		mapmove(e)
	});