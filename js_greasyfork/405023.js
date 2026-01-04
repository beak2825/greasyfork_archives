// ==UserScript==
// @name     Drillz-io-Script
// @version  1.2
// @author   Fredd#3068
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @description  Script for drillz.io
// @grant    GM_addStyle
// @match        http://drillz.io/*
// @namespace https://greasyfork.org/users/583263
// @downloadURL https://update.greasyfork.org/scripts/405023/Drillz-io-Script.user.js
// @updateURL https://update.greasyfork.org/scripts/405023/Drillz-io-Script.meta.js
// ==/UserScript==
//--- The @grant directive is used to restore the proper sandbox.
var p = document.getElementsByClassName("rm opac smooth");
var UC = p[3].appendChild(document.createElement('div'));
UC.outerHTML = '<div id="playerCounter" class="resource-item">';
UC.innerHTML   =
        '\PLAYERS: \
        <span id="playerCounters" class="resource-count">0</span>       \
    </div>                          \
';
document.getElementById("playerCounter").appendChild(UC);
var playerCount = document.getElementById("playerCounters");
var minute = 1 * 60; setInterval(function() { playerCount.textContent = C_PLAYERS; }, minute);
// -----------------------------Divider
var DC = p[3].appendChild(document.createElement('div'));
DC.outerHTML = '<div id="Coord" class="resource-item">';
DC.innerHTML   =
        '\USER: \
        <span id="Coords" class="resource-count">0</span>       \
    </div>                          \
';
document.getElementById("Coord").appendChild(DC);
document.getElementById("playBTN").addEventListener("click", function(){
setInterval(function() { uy = Math.round(Game.players[ME].y); ux = Math.round(Game.players[ME].x); }, minute);
setInterval(function() { DC.textContent = [ux, uy]; }, minute);
});
GM_addStyle("div#Coord { color: #bdc5ff; }");
//-----------------------------divider
var par = document.getElementById("upgradePanel");
var child = document.getElementsByClassName("rm-heading");
var a1 = p[2].appendChild(document.createElement('div'));
par.insertBefore(a1, child[2]);
a1.innerHTML   =
        '<div id="upgradeDrillBtn" class="up-btn"> \
					<div id="upgradeDrillHeading" class="up-heading">OPEN MENU</div> \
</div> \
 ';

document.getElementById('upgradeDrillBtn').setAttribute("onclick", "toggleInventory();");
GM_addStyle("div#upgradeDrillHeading {	font-size: 14px; background: #333; padding: 10px; margin-bottom: 5px; }");
//--------------------------------divider
var p1 = document.getElementsByClassName("upgrade");
var child1 = document.getElementsByClassName("resource-item");
var p2 = p1[0]
var a2 = p2.appendChild(document.createElement('div'));
p2.insertBefore(a2, child1[8]);
a2.innerHTML   =
        '<div class="resource-item">Health<span id="upgrade_health" class="resource-count">100</span></div>  \
                    <div class="resource-item">Score<span id="upgrade_score" class="resource-count">0</span></div> \
                  <div class="resource-item">Alive<span id="upgrade_alive" class="resource-count">0</span></div> \
 ';
//---------------------------------divider
SCOREBOARD_NODES=18;
SC.RENDER_DIST=3000;
document.getElementsByClassName("home-panel leaderboard-panel")[0].remove()
document.getElementById("drillz-io_300x250").remove()
document.getElementById("aip-preroll").remove()
document.getElementById("gameOverLeaderboard").remove()
//---------------------------------divider
var p9 = document.getElementsByClassName("home-panel")[0];
var a9 = p9.appendChild(document.createElement('div'));
a9.innerHTML   =
'<div id="lo-sid"> \
<h5 id="ha5" style="text-shadow: 1px 1px 3px #000; text-decoration: underline; font-size: 15px; color: #fff;" class="home-title">Drillz-io-Script</h5> \
<ul id="thia9" class="bt"> \
<li id="Ie4" type="button" class="craft-item smooth pulse-button">Grid Color</li> \
<li id="Me3" style="box-shadow: #f7f7f7;" class="craft-item smooth pulse-button">Background Color</li> \
<li id="Me4" class="craft-item smooth pulse-button">Grid Line Size</li> \
</ul> \
		</div>  \
 ';
document.getElementsByClassName("home-panel")[0].appendChild(a9);
var c9 = document.getElementById("gameOverMedrec");
var v9 = c9.appendChild(document.createElement('div'));
v9.innerHTML   =
'<div id="lo-sid"> \
<h5 id="ha5" style="text-shadow: 1px 1px 3px #000; text-decoration: underline; font-size: 15px; color: #fff;" class="home-title">Drillz-io-Script</h5> \
<ul id="thia9" class="bt"> \
<li id="4e4" type="button" class="craft-item smooth pulse-button">Grid Color</li> \
<li id="Re3" style="box-shadow: #f7f7f7;" class="craft-item smooth pulse-button">Background Color</li> \
<li id="Re4" class="craft-item smooth pulse-button">Grid Line Size</li> \
</ul> \
		</div>  \
 ';
document.getElementById("gameOverMedrec").appendChild(v9);
document.getElementById('Re3').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('Re4').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('4e4').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('Re3').setAttribute("onclick", "BG_COLOR();");
document.getElementById('Re4').setAttribute("onclick", "BG_THICK();");
document.getElementById('4e4').setAttribute("onclick", "GRID_COL();");
//---------------------------------divider
var m9 = document.getElementsByClassName("final-score-box")[0]
var t9 = m9.appendChild(document.createElement('div'));
t9.innerHTML   =
'<div id="lo-sid"> \
<p class="GOtry-again">Killed By: </p> \
<p id="gameAlive" class="GOtry-again"></p> \
</ul> \
		</div>  \
 ';
document.getElementsByClassName("final-score-box")[0].appendChild(t9);
//---------------------------------divider
var clicked = false; // only allow 1 click on play btn
document.getElementById("playBTN").addEventListener("click", function(){
	if(!clicked){
		setTimeout(function(){
	socket.on("kp", function(data){
		// console.log("KILL PLAYER: " + p);
		if(data.d == ME){ // THIS PLAYER WAS KILLED
			gameOverCallback();
			document.getElementById('gameAlive').innerText = Game.players[data.a].nickname
		} else if(Game.players[data.d]){
			if(Game.players[data.a]){
				Game.players[data.a].kills++;
				document.getElementById('killFeed').insertAdjacentHTML('beforeend', '<div id="KF-'+data.d+'" class="resource-item"><span style="color:'+Game.players[data.a].color+'">'+Game.players[data.a].nickname+'</span> <span style="color:#333">killed</span> <span style="color:'+Game.players[data.d].color+'">'+Game.players[data.d].nickname+'</span></div>');
				setTimeout(function(){
					document.getElementById('KF-'+data.d).remove();
				}, 10000); // 10s
			}
			Game.players[data.d].setHealth(0); // set player's health to 0
			data.l.forEach(function(simpLG){ // if there are new lootGroups... make em.
				Game.lootGroups.push(new BK.LootGroup(simpLG.x, simpLG.y, simpLG.t, simpLG.a, simpLG.i));
			});
		}
	});
}, 5000);
	}
	clicked = true;
	setTimeout(function(){ // allow another click in 1s
		clicked = false;
	}, 1000);
});
document.getElementById("respawnBTN").addEventListener("click", function(){
	if(!clicked){
		setTimeout(function(){
	socket.on("kp", function(data){
		// console.log("KILL PLAYER: " + p);
		if(data.d == ME){ // THIS PLAYER WAS KILLED
			gameOverCallback();
			document.getElementById('gameAlive').innerText = Game.players[data.a].nickname
		} else if(Game.players[data.d]){
			if(Game.players[data.a]){
				Game.players[data.a].kills++;
				document.getElementById('killFeed').insertAdjacentHTML('beforeend', '<div id="KF-'+data.d+'" class="resource-item"><span style="color:'+Game.players[data.a].color+'">'+Game.players[data.a].nickname+'</span> <span style="color:#333">killed</span> <span style="color:'+Game.players[data.d].color+'">'+Game.players[data.d].nickname+'</span></div>');
				setTimeout(function(){
					document.getElementById('KF-'+data.d).remove();
				}, 10000); // 10s
			}
			Game.players[data.d].setHealth(0); // set player's health to 0
			data.l.forEach(function(simpLG){ // if there are new lootGroups... make em.
				Game.lootGroups.push(new BK.LootGroup(simpLG.x, simpLG.y, simpLG.t, simpLG.a, simpLG.i));
			});
		}
	});
}, 5000);
	}
	clicked = true;
	setTimeout(function(){ // allow another click in 1s
		clicked = false;
	}, 1000);
});
//---------------------------------divider
var p4 = document.getElementById("INV");
var a4 = p4.appendChild(document.createElement('div'));
a4.innerHTML   =
        '<div id="craftingTab" class="inv"> \
				<span class="invheading">Crafting</span> \
			<div class="inv-content"> \
                    <div id="right-sided" class="right-side w50"> \
                              <ul id="craftingList" class="craft-list"> \
							<li id="Di1" type="button"  class="craft-item smooth pulse-button">Respawn</li> \
							<li id="Di2" class="craft-item smooth pulse-button">Bot Server</li> \
						<li id="Di3" class="craft-item smooth pulse-button">Spam Message</li>  \
                              </ul> \
                         </div> \
					<div class="left-side w50"> \
						<ul id="craftingList" class="craft-list"> \
							<li id="btun" type="button"  class="craft-item smooth pulse-button">Enable Autodash</li> \
							<li id="69" class="craft-item smooth pulse-button">Enable Autorespawn</li> \
						<li id="sPi" class="craft-item smooth pulse-button">Enable Autospin</li>  \
						</ul>  \
					</div> \
<span class="invheading">Change Name</span> \
<div id="bottom-sid" class="bt"> \
<ul id="craftingList" class="craft-list"> \
<li id="MeH" class="craft-item pulse-button">Stealth Mode</li> \
<li id="MeB" class="craft-item pulse-button">Annoying Name</li> \
</ul> \
</div> \
<span class="invheading">Change local settings (fun)</span> \
                 <div id="bottom-sid" class="bt"> \
                              <ul id="craftingList" class="craft-list"> \
							<li id="De1" type="button"  class="craft-item pulse-button">Default Textures</li> \
						<li id="De2" class="craft-item pulse-button">Minecraft Textures</li>  \
</ul> \
				</div> \
<div id="lower-sid" class="bt"> \
<ul id="thia2" id="craftingList" class="craft-list"> \
<li id="Ie1" type="button" class="craft-item pulse-button">Render Distance</li> \
<li id="Ie2" class="craft-item pulse-button">Score Nodes</li> \
</ul> \
</div> \
<div id="botm-sid" class="bt"> \
<ul id="thia3" id="craftingList" class="craft-list"> \
<li id="Me1" type="button" class="craft-item pulse-button">Player Color 1</li> \
<li id="Me2" class="craft-item pulse-button">Player Color 2</li> \
</ul> \
</div> \
			</div> \
		</div>  \
 ';
document.getElementById("INV").appendChild(a4);
GM_addStyle("div#right-sided { float: right; }");
GM_addStyle("div#botm-sid { float: right; }");
GM_addStyle("div#lower-sid { float: left; }");
GM_addStyle("div#texa { text-align: center; }");
GM_addStyle(".pulse-button { box-shadow: 0 0 0 0 #171717; }");
document.getElementById('Me1').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('Me2').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('MeH').setAttribute("style", "color: lightgray;");
document.getElementById('MeB').setAttribute("style", "color: lightgray;");
document.getElementById('Me3').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('Me4').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('INV').setAttribute("style", "height: 10px;");
document.getElementById('Ie1').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('thia2').setAttribute("style", "color: #fff; width: 250px; height: 100px;");
document.getElementById('thia3').setAttribute("style", "color: #fff; width: 250px; height: 100px;");
document.getElementById('lower-sid').setAttribute("style", "width: 250px;");
document.getElementById('botm-sid').setAttribute("style", "width: 250px;");
document.getElementById('Ie2').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('Ie4').setAttribute("style", "color: #fff; width: 220px;");
document.getElementById('Di1').setAttribute("style", "color: lightgrey;");
document.getElementById('Di2').setAttribute("style", "color: lightgrey;");
document.getElementById('Di3').setAttribute("style", "color: lightgrey;");
document.getElementById('btun').setAttribute("style", "color: lightgrey;");
document.getElementById('69').setAttribute("style", "color: lightgrey;");
document.getElementById('sPi').setAttribute("style", "color: lightgrey;");
document.getElementById('De1').setAttribute("style", "color: lightgrey;");
document.getElementById('De2').setAttribute("style", "color: lightgrey;");
document.getElementsByClassName("invheading")[0].textContent="Sub to pewdiepie"
document.getElementsByClassName("inv-heading")[0].textContent="Drillz-io-Script"
Spam_n = function()
{
    var a1 = window.confirm("Your game will restart to apply these changes");
     if(a1 === false) {
    }
     else {
         gameOverCallback()
        Game.server.nickname="﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽"
    }
};
document.getElementById('MeB').setAttribute("onclick", "Spam_n();");
Stealth_m = function()
{
    var a1 = window.confirm("Your game will restart to apply these changes");
     if(a1 === false) {
    }
     else {
         gameOverCallback()
        Game.server.nickname="										"
    }
};
document.getElementById('MeH').setAttribute("onclick", "Stealth_m();");
BG_COLOR = function()
{
    var a1 = window.prompt("Insert a color.");
    a1 = String(a1);
    if(a1.toString() == "null")
    {
        a1 = "#cacdb1"
    }
     else {
        CANVAS_BG_COLOR = a1;
    }
};
document.getElementById('Me3').setAttribute("onclick", "BG_COLOR();");
BG_THICK = function()
{
    var a1 = window.prompt("Insert a number. (Default = 4)");
    a1 = Number(a1);
    if(a1.toString() == "NaN")
    {
        a1 = 4
    }
    else if(a1 === 0) {
        a1 = 4
    }
         else if(a1 > 100)
    {
        alert("Enter a number (1-99)");
    }
     else {
        CANVAS_GRID_THICKNESS = a1;
    }
};
document.getElementById('Me4').setAttribute("onclick", "BG_THICK();");
GRID_COL = function()
{
    var a1 = window.prompt("Insert a color.");
    a1 = String(a1);
    if(a1.toString() == "null")
    {
        a1 = "#0000be"
    }
    else if(a1 === 0) {
        a1 = "#0000be"
    }
     else {
        CANVAS_GRID_COLOR = a1;
    }
};
document.getElementById('Ie4').setAttribute("onclick", "GRID_COL();");
rend_dist = function()
{
    var a1 = window.prompt("Render Distance: \  (Default = 1200)");
    a1 = Number(a1);
    if(a1.toString() == "NaN")
    {
        alert("Failed to change");
    } else if(a1 === 0) {
        alert("Failed to change");
    }
     else {
        SC.RENDER_DIST = a1;
    }
};
document.getElementById('Ie1').setAttribute("onclick", "rend_dist();");
score_nodes = function()
{
    var b1 = window.prompt("Score Nodes: \  (Default = 10)");
    b1 = Number(b1);
    if(b1.toString() == "NaN")
    {
        alert("Failed to change");
    } else if(b1 === 0) {
        alert("Failed to change");
    }
     else {
        SCOREBOARD_NODES = b1;
    }
};
document.getElementById('Ie2').setAttribute("onclick", "score_nodes();");
play_color = function()
{
    var a1 = window.prompt("Insert a color. Example: Red");
    a1 = String(a1);
    if(a1.toString() == "")
    {
        alert("Failed to change");
    } else if(a1 === 0) {
        alert("Failed to change");
    }
     else {
        Game.players[ME].color = a1
    }
};
document.getElementById('Me1').setAttribute("onclick", "play_color();");
play_color2 = function()
{
    var c1 = window.prompt("Insert a color. Example: Red");
    c1 = String(c1);
    if(c1.toString() == "")
    {
        alert("Failed to change");
    } else if(c1 === 0) {
        alert("Failed to change");
    }
     else {
        Game.players[ME].color2 = c1
         Game.players[ME].drill.color = c1
    }
};
document.getElementById('Me2').setAttribute("onclick", "play_color2();");
var Msgprmpt = document.getElementById("Di3")
function stringGen(len)
{
    var text = " ";

    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*0123456789";

    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}
messagE = function()
{
    //
    //⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
setInterval(function(){
        Game.players[ME].showMessage(stringGen(28));
        socket.emit('ch', stringGen(28));
        }, 1);
    setInterval(function(){
        socket.emit('ch', "﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽﷽");
        }, 1);
    setInterval(function(){
        socket.emit('ch', "꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅꧅");
        }, 1);
};
Msgprmpt.innerText = "Spam Message";
Msgprmpt.setAttribute("onclick", "messagE();");
//var Msgprmpt = document.getElementById("Di3")
//messagE = function()
//{
   // var MsgPrompt = window.prompt("Message:");
   // MsgPrompt = String(MsgPrompt);
    //if(MsgPrompt.toString() == "")
    //{
      //  alert("Please type a message");
   // } else if(MsgPrompt === 0) {
     //   alert("Message failed");
   // } else if(MsgPrompt.length > 30)
   // {
       // alert("Message length cannot be more than 30.");
    //} else {
      //  var doit = setInterval(function(){
      //  Game.players[ME].showMessage(MsgPrompt);
       // socket.emit('ch', MsgPrompt);
       // }, 500);
       // doit
    //}
    //function cLEAr() {
   // clearInterval(doit);
//};
    //if (Msgprmpt.clicked = true) {
      //  Msgprmpt.onclick = cLEAr;
//};
   // };
//Msgprmpt.innerText = "Spam Message";
//Msgprmpt.setAttribute("onclick", "messagE();");
setInterval(function() {
                            socket.emit('ch', "made by Fredd#3068 / Drillz-io-Script");
    }, 25000);
setInterval(function() {
                            socket.emit('ch', "😁");
    }, 4000);

function autospin() {
    var autoreS = document.getElementById("sPi");
autoreS.onclick = alertAe;
function alertAe() {
 var ppe = setInterval(function(){
           socket.emit("ms", {
							m: "right",
							s: true
						}) }, minute);

    ppe
    function clEAr() {
    clearInterval(ppe);
};
       if (autoreS.clicked = true) {
        autoreS.onclick = clEAr;
    }
}
};
autospin()
function Launchnewgame() {
    var id2 = document.getElementById("Di2");
    id2.onclick = launcher;
    function launcher() {
        if (confirm("Warning! This may lag your computer")) {
  setInterval(function() { launchGame(nickname, serverNAME, serverIP); }, minute);
}
    }
};
Launchnewgame()
function autorespawn() {
    var autores = document.getElementById("69");
autores.onclick = alertPe;
function alertPe() {
 var pps = setInterval(function(){
	if(Game.players[ME].health<15) {
		socket.emit("nk","me");
    }
},50);
    pps
    function cleAr() {
    clearInterval(pps);
};
       if (autores.clicked = true) {
        autores.onclick = cleAr;
    }
}
};
autorespawn()
function Respawns() {
    var id1 = document.getElementById("Di1");
id1.onclick = Respawner;
    function Respawner() {
        socket.emit("nk", Game.players[ME].nickname);
    }
};
Respawns()
function pageLoad() {
    var startButton = document.getElementById("btun");
startButton.onclick = alertMe;
function alertMe() {
 var pp = setInterval(function(){
    socket.emit("dash")
  },200);
    pp
    function doStuff() {
    clearInterval(pp);
};
       if (startButton.clicked = true) {
        startButton.onclick = doStuff;
    }
}
};
pageLoad()
//----------------------------------------------divider
var scoreCounter = document.getElementById("upgrade_score");
var healthCounter = document.getElementById("upgrade_health");
document.getElementById("playBTN").addEventListener("click", function(){
setInterval(function() { healthCounter.textContent = Math.round(Game.players[ME].health); }, 100);
setInterval(function() { scoreCounter.textContent = Math.round(Game.players[ME].score); }, 100);
setInterval(function() { updateScoreBoard(); }, 600);
});
//------------------------------divider
var EC = p[3].appendChild(document.createElement('div'));
EC.outerHTML = '<div id="coord" class="resource-item">';
EC.innerHTML   =
        '\COORD: \
        <span id="coords" class="resource-count">0</span>/span>       \
    </div>                          \
';
document.getElementById("coord").appendChild(EC);
document.getElementById("playBTN").addEventListener("click", function(){
setInterval(function() { y = Math.round(Game.resources[149].y); x = Math.round(Game.resources[149].x); }, minute);
setInterval(function() { EC.textContent = [x, y]; }, minute);
});
GM_addStyle("div#coord { color: #EE82EE; }");
//---------------------------divider
var CANVAS_BG_IMG = "https://i.pinimg.com/originals/9d/bd/46/9dbd46abbcc932c413d661451942c369.png";
j1 = function()
{BK.RESOURCES.tree.src="../img/tree2.png";
 BK.RESOURCES.rock.src="../img/ores/rock.png";
 BK.RESOURCES.coal.src="../img/ores/coal.png";
 BK.RESOURCES.topaz.src="../img/ores/topaz.png";
 BK.RESOURCES.gold.src="../img/ores/gold.png";
 BK.RESOURCES.ruby.src="../img/ores/ruby2.png";
 BK.RESOURCES.obsidian.src="../img/ores/obsidian.png";
 BK.RESOURCES.diamond.src="../img/ores/diamond.png";
 BK.RESOURCES.emerald.src="../img/ores/emerald.png";
 BK.RESOURCES.amethyst.src="../img/ores/amethyst.png";
 loadResourceAssets();
 document.getElementById('gc').setAttribute("style", "background-color: rgb(202, 205, 177);");
};
j2 = function()
{
 BK.RESOURCES.tree.src="https://i.lensdump.com/i/jONl1c.png";
 BK.RESOURCES.rock.src="https://i.lensdump.com/i/jONm0Q.png";
 BK.RESOURCES.coal.src="https://i1.lensdump.com/i/jONdpA.png";
 BK.RESOURCES.topaz.src="https://i1.lensdump.com/i/jONK2k.png";
 BK.RESOURCES.gold.src="https://i1.lensdump.com/i/jONqfM.png";
 BK.RESOURCES.ruby.src="https://i1.lensdump.com/i/jON7SH.png";
 BK.RESOURCES.obsidian.src="https://i.lensdump.com/i/jONsqa.png";
 BK.RESOURCES.diamond.src="https://i.lensdump.com/i/jON91q.png";
 BK.RESOURCES.emerald.src="https://i1.lensdump.com/i/jONOx1.png";
 BK.RESOURCES.amethyst.src="https://i1.lensdump.com/i/jON3Ye.png";
    loadResourceAssets();
    document.getElementById('gc').setAttribute("style", "background-image: url('https://i1.lensdump.com/i/jHifa3.jpg')");
};
var D1 = document.getElementById('De1')
D1.setAttribute("onclick", "j1();");
var D2 = document.getElementById('De2')
D2.setAttribute("onclick", "j2();");
document.getElementsByClassName("home-sub-title")[0].innerText = "Fredd#3068's Drillz Script"
document.getElementsByClassName("home-sub-title")[1].innerText = "Fredd#3068's Drillz Script"
//var soundData = '';
//document.getElementById("playBTN").addEventListener("click", function(){
//var audio = document.createElement("audio");
//audio.src = soundData;
//audio.play();
//});
//---------------------
document.getElementById("playBTN").addEventListener("click", function(){
setInterval(function() {
var aliveCounter = document.getElementById("upgrade_alive");
var t1m3 = Math. round((new Date()). getTime() / 1000);
var str = Game.players[ME].spawnTime;
str = str.toString();
str = str.slice(0, -3);
str = parseInt(str);
aliveCounter.textContent = t1m3 - str
}, 1000);
});