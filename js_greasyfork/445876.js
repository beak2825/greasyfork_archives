// ==UserScript==
// @name         ULTRONSCRIPTV3 (Modificado)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  UltronScript V3.0
// @author       NeutroX
// @developer    ᎥᎮs̶n̶i̶p̶e̶r̶
// @match        http://bloble.io/*
// @grant        none
// @icon         data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/445876/ULTRONSCRIPTV3%20%28Modificado%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445876/ULTRONSCRIPTV3%20%28Modificado%29.meta.js
// ==/UserScript==

window.renderPlayer=function(a,d,c,b,g)
{b.save();if(a.skin&&0<a.skin&&a.skin<=playerSkins&&!skinSprites[a.skin]){var e=new Image;e.onload=function(){this.readyToDraw=!0;this.onload=null;g==currentSkin&&changeSkin(0)};e.src=".././img/skins/skin_"+(a.skin-1)+".png";skinSprites[a.skin]=e}a.skin&&skinSprites[a.skin]&&skinSprites[a.skin].readyToDraw?(e=a.size-b.lineWidth/4,b.lineWidth/=2,renderCircle(d,c,a.size,b,!1,!0)):g||(b.fillStyle="rgba(255, 247, 0, 0.2)",renderCircle(d,
c,a.size,b));b.restore()}
outlineWidth = 5,
backgroundColor = "#000000",
indicatorColor = "#e0e0e0",
turretColor = "#e0e0e0",
bulletColor = "#333333",
redColor = "#2c9299",
targetColor = "#e7ee55",
playerColors = "#0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457 #0d2457".split(" ")
renderText = function(a, d) {
var c = document.createElement("canvas"),
        b = c.getContext("2d");
    b.font = d + "px regularF";
    var g = b.measureText(a);
    c.width = g.width + 20;
    c.height = 2 * d;
    b.translate(c.width / 2, c.height / 2);
    b.font = d + "px regularF";
    b.fillStyle = "#ffffff";
    b.textBaseline = "middle";
    b.textAlign = "center";
    b.strokeStyle = redColor;
    b.lineWidth = outlineWidth;
    b.strokeText(a, 0, 0);
    b.fillText(a, 0, 0);
    return c
}
window.renderPlayer = function(a, d, c, b, g) {
    b.save();
    if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
        var e = new Image;
        e.onload = function() {
            this.readyToDraw = !0;
            this.onload = null;
            g == currentSkin && changeSkin(0);
        };
        e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
        skinSprites[a.skin] = e;
    }
    a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));
    b.restore();
};

setInterval(function(){if(window.socket){window.socket.emit("2",window.camX,window.camY)}},20000)

instructionsIndex = 0;
instructionsSpeed = 0;
insturctionsCountdown = 0;
instructionsList = " ".split(";");
instructionsIndex = UTILS.randInt(0, instructionsList.length - 1);
document.getElementById("gameTitle").innerHTML = "𝑼𝒍𝒕𝒓𝒐𝒏𝑺𝒄𝒓𝒊𝒑𝒕 𝑽𝟑";
document.getElementById("lobbyKey").innerHTML = " ";
document.getElementById("youtubeContainer").innerHTML = '';
document.getElementById("youtuberOf").innerHTML = '';
document.getElementById("smallAdContainer").innerHTML = '';
document.getElementById("infoLinks").innerHTML = '';
document.getElementById("creatorLink").innerHTML = '';
document.getElementById("adContainer").innerHTML = ''
var randomLoadingTexts = ["Loading ..."]
var css = document.createElement("style")
document.getElementById("darkener").innerHTML += `<img id="foto" src="https://files.passeidireto.com/7e779325-3209-47c3-8a9e-257e285e5ae1/7e779325-3209-47c3-8a9e-257e285e5ae1.jpeg"><style>
img#foto {

    overflow: hidden;
    margin-left: 0px;
     width: 100%; /* com isso imagem ocupará toda a largura da tela. Se colocarmos height: 100% também, a imagem irá distorcer */
    position: absolute;
}
</style>
`
css.innerText = `
html, body {
	width: 100%; height: 100%; cursor: Crosshair; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }

body {
	background-color: #ffffff; margin: 0; overflow: hidden; cursor: Crosshair; }

canvas {
    image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor; }

.grecaptcha-badge {
    visibility: hidden !important;
}

.material-icons {

}

a:link {
	color: #009bff;text-decoration: none;
}

a:visited {
	color: #009bff;
}

a:hover {
	color: #010b1a;
}

.spanLink {
	cursor: pointer;color: #67676b;
}

.allert {
color: #850000;
}

.botao {
color: #58f761;
}

.spanLink:hover {
	color: #010b1a;
}

.deadLink {
	cursor: auto;
	color: #ffffff;
}

.deadLink:hover {
	color: #ffffff;
}

.horizontalCWrapper {
	width: 100%;text-align: center;
}

.centerContent {
	text-align: center;width: 100%;
}

#twitterFollBt {
	z-index: 200;
}

#shareContainer {
	padding: 5px; width: 100%; position: absolute; top: 10px; left: 10px; position: absolute; z-index: 200; }

#darkener {
	display: block; position: absolute; width: 100%; height: 100%; background-color: #000000;
}

#menuContainer {
	width: 100%; height: 100%; display: flex; position: absolute; top: 10px; z-index: 100; align-items: center; text-align: center;
}
#optionsContainer {
    padding: 10px; position: absolute; right: 1200px; top: 0px; font-family: 'regularF'; text-align: right; color: #009bff; z-index: 100; font-size: 20px; }
#lobbyKey {
	font-size: 20px;

}

#smallAdContainer {
	position: absolute; right: 14px; bottom: 44px; z-index: 100; border: dashed 6px rgba(35, 35, 35, 0.0); }

#twitterFollBt {
	position: absolute;left: 15px;bottom: 40px;
}

#followText {
	position: absolute; left: 15px; bottom: 75px; color: #fff; font-size: 28px; font-family: 'regularF'; }

#youtuberOf {
	z-index: 100; position: absolute; top: 10px; left: 10px; color: #fff; font-size: 20px; font-family: 'regularF'; }

#youtubeContainer {
	margin-top: 5px;
}

#mainCanvas {
	position: absolute;width: 100%;height: 100%;
}

#gameUiContainer {
	position: absolute; width: 100%; height: 100%; display: none; pointer-events: none; }

#adContainer {
	width: 100%; text-align: center; margin-top: 20px; display: inline-block; }

#adHolder {
	display: inline-block;border: dashed 6px rgba(35, 35, 35, 0.0);
}

#leaderboardContainer {
	position: absolute; top: 10px; right: 10px; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 30px; border-radius: 4px; color: #fff;border: 1px solid #67676b; }

.leaderboardItem {
	margin-top: 2px; color: rgba(255, 255, 255); font-family: 'regularF'; font-size: 17px; }

.leaderYou {
	color: #009bff; display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }

.leader {
	color: rgba(255, 255, 255); display: inline-block; max-width: 150px; margin-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -o-text-overflow: ellipsis; }

.scoreText {
	color: #c9c9c9; text-align: left; float: right; margin-left: 10px; display: inline-block; }

#statContainer {
	position: absolute;bottom: 10px;left: 10px;
}

#scoreContainer {
	display: inline-block; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #67676b;}

#unitList {
	text-align: center; width: 100%; position: absolute; bottom: 6px; }

.unitItem {
	pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }

.unitItemA {
	pointer-events: all; margin-left: 10px; position: relative; display: inline-block; width: 65px; height: 65px; background-color: #00000000; border-radius: 4px; cursor: pointer; }

.unitItem:hover {
	background-color: #00000060;
}

#unitInfoContainer {
	padding: 10px;display: none;
}

.upgradeInfo {
	margin-top: 5px; padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto; cursor: pointer; pointer-events: all;border: 0.5px solid #67676b; }

.upgradeInfo:hover {
	background-color: #000000;
}

.unitInfo {
	padding: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; max-width: 200px; overflow: auto;border: 0.5px solid #67676b; }

.unitInfoName {
	font-size: 22px;color: #fff;
}

.unitInfoCost {
	font-size: 16px;color: #fff;
}

.unitInfoDesc {
	font-size: 16px;color: #d1d1d1;
}

.unitInfoType {
	padding-top: 5px; font-size: 16px; color: #b2b2b2; float: left; }

.unitInfoLimit {
	display: inline-block; float: right; text-align: right; padding-top: 5px; font-size: 16px; color: #b2b2b2; }

#chatBox {
    position: absolute; bottom: 10px; right: 10px; width: 250px; overflow: hidden; }

#chatListWrapper {
	background-color: #000000;border-radius: 4px 4px 0px 0px;height: 215px;border: 1px solid #67676b;
}

.chatText {
	color: rgba(255, 255, 255);
}

#chatList {
	width: 100%; font-family: 'regularF'; padding: 8px; margin: 0; list-style: none; box-sizing: border-box; color: #fff; overflow: hidden; word-wrap: break-word; position: absolute; bottom: 30px; font-size: 16px; line-height: 23px;
}

#chatInput {
	background-color: #000000; font-family: 'regularF'; font-size: 16px; padding: 5px; color: #fff; width: 100%; pointer-events: all; outline: none; border: 0; box-sizing: border-box; border-radius: 0px 0px 4px 4px;border: 1px solid #67676b; }

#sellButton {
	display: none; position: absolute; bottom: 65px; left: 10px; background-color: #000000; border-radius: 4px; font-family: 'regularF'; font-size: 20px; color: #fff; cursor: pointer; padding: 2px; pointer-events: all;border: 0.5px solid #67676b; }

#sellButton:hover {
	background-color: #000000;

}

.greyMenuText {
color:#010409
}

.whiteText {
	color: #fff;
}

#userNameInput {
	font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 12px; border: none; border-radius: 4px; margin-left: 10px; background-color: #010409; color: #f9f9f9; border: 2px solid #67676b; border-radius: 10px;
}

#enterGameButton {
	font-family: 'regularF'; font-size: 26px; padding: 5px; color: #20912b; background-color: #010409; border: none; cursor: pointer; margin-left: 10px; border-radius: 4px; border: 2px solid #2e6e34; border-radius: 10px; }

#enterGameButton:hover {
	background-color: #010b1a;
}

#loadingContainer {
	display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; color: #FFFFFF; }

#gameTitle {
	color: #ededed; font-size:60px; width: 100%; text-align: center; font-family: 'regularF';text-shadow: 1px 0px 0px #ededed, -1px 0px 0px #ededed, 0px 1px 0px #ededed, 0px -1px 0px #ededed; }

#instructionsText {
	font-size: 30px; width: 400px; text-align: center; font-family: 'regularF'; margin-top: 20px; display: inline-block;text-shadow: 1px 0px 0px #67676b, -1px 0px 0px #67676b, 0px 1px 0px #67676b, 0px -1px 0px #67676b; }

#creatorLink {
	z-index: 1000; position: absolute; bottom: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-left: 10px; margin-bottom: 5px; padding: 5px; }

#infoLinks {
	z-index: 1000; position: absolute; bottom: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-right: 10px; margin-bottom: 5px; }

#infoLinks2 {
	z-index: 1000; position: absolute; top: 0; right: 0; text-align: center; font-size: 20px; font-family: 'regularF'; color: #009bff; padding: 5px; margin-right: 10px; margin-bottom: 5px; }

#skinInfo {
	position: absolute; display: none; text-align: left; width: 110px; margin-left: -145px; padding: 6px; padding-top: 13px; padding-left: 16px; color:#ffffff; border-radius: 4px;  font-family: 'regularF'; font-size: 26px; background-color: #00000000 }

#skinName {
	padding: 4px;padding-left: 0px;color: #ffffff;font-size: 22px;
}

#skinIcon {
width: 100px;height: 100px
}

#joinTroopContainer {
    display: inline-block; padding: 10px; background-color:#000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #c4c4c4;}

#skinSelector {
	display: none; font-family: 'regularF'; font-size: 26px; padding: 6px; padding-left: 10px; padding-right: 10px; border: none; border-radius: 4px; background-color: #010409; color: #ffffff; cursor: pointer; border: 2px solid #67676b; border-radius: 10px; }

#skinSelector:hover {
    background-color: #010b1a;color: #ffffff;
}
`
document.head.appendChild(css)
var loadedBase = null;
var defendInterval = null;
var joinEnabled = true
var joinTroopsDiv = document.createElement("div")
joinTroopsDiv.id = "joinTroopContainer"
document.getElementById("statContainer").appendChild(joinTroopsDiv)
joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")

function buildLoadedBase(){
    for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,building.uPath[0]);console.log("socket.emit('1'," + building.dir + "," + building.dst + "," + building.uPath[0] + ")");
}};
function startDefend1(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,1);
}}
function startDefend(){
    if(defendInterval!=null){return}defendInterval = setInterval(function(){for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,1);
}},175)}
function startDefend2(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,2);
}}
function startDefend3(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,3);
}}
function startDefend4(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,4);
}}
function startDefend5(){
    if(defendInterval!=null){return}for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,5);
}}
function saveBase(userSid){
    var user = users[getUserBySID(userSid)];
    var base = [];
    for(var i=0;i<units.length;i++){
    if(units[i].owner == userSid && units[i].type!=1){
    var unit = units[i];
    base.push({
        dir:UTILS.getDirection(unit.x,unit.y,user.x,user.y),
        dst:UTILS.getDistance(user.x,user.y,unit.x,unit.y),
        uPath:unit.uPath,
});
}}
    localStorage.setItem("base_"+prompt("Type the base name:"),JSON.stringify(base))
};
function loadBase(){
    loadedBase = JSON.parse(localStorage.getItem("base_"+prompt("Type the base name:")))
}
addEventListener("keydown", function(a){
    if (a.keyCode===76){buildLoadedBase();}
    if (a.keyCode===192){startDefend1();}
    if (a.keyCode===50){startDefend2();}
    if (a.keyCode===51){startDefend3();}
    if (a.keyCode===52){startDefend4();}
    if (a.keyCode===53){startDefend5();}
else if(event.key == "p"){
    startDefend()
}
if(event.key == "j"){
     joinEnabled = !joinEnabled
     joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")
}
})
window.addEventListener("keyup",function(event){
    if(event.key == "o"){
    if(defendInterval!=null){
         stopDefend()
     function stopDefend(){
    clearInterval(defendInterval)
    defendInterval = null
}
}}
})

window.unlockSkins()
window.share.getBaseUpgrades=function(){
    return [
        {
            name: "Commander",
            desc: "Powerful commander unit",
            lockMaxBuy: true,
            cost: 1500,
            unitSpawn: 9
        },
        {
            name:"Save base",
            desc:"Save base, so you can load it later"},
         {
            name:"Load base",
            desc:"Load a base, press L to build and P to defend",
         }
]}
function upgradeSelUnits(firstUnit,upgrade){
    var firstUnitName = window.getUnitFromPath(firstUnit.uPath).name
    for(var i=0;i<window.selUnits.length;i++){
        var unit = window.selUnits[i]
        if(window.getUnitFromPath(unit.uPath).name==firstUnitName){
            window.socket.emit("4",unit.id,upgrade)
        }
    }
}
function handleActiveBaseUpgrade(sid,upgradeName){
    if(upgradeName=="Save base"){
        saveBase(sid)
    }
    else if(upgradeName == "Load base"){
        loadBase()
    }
}

moveSelUnits=function(){if(selUnits.length){var a=player.x+targetDst*MathCOS(targetDir)+camX,d=player.y+targetDst*MathSIN(targetDir)+camY,c=1;if(c&&1<selUnits.length)for(var b=0;b<users.length;++b)if(UTILS.pointInCircle(a,d,users[b].x,users[b].y,users[b].size)){c=0;break}var g=-1;if(c)for(b=0;b<units.length;++b)if(units[b].onScreen&&units[b].owner!=player.sid&&UTILS.pointInCircle(a,d,units[b].x,units[b].y,units[b].size)){c=0;g=units[b].id;break}1==selUnits.length&&(c=0);for(var e=[],b=0;b<selUnits.length;++b)e.push(selUnits[b].id);
socket.emit("5",UTILS.roundToTwo(a),UTILS.roundToTwo(d),e,joinEnabled?(0):(c),g)}}

setupSocket=function(){socket.on("connect_error",function(){lobbyURLIP?kickPlayer("Connection failed. Please check your lobby ID"):kickPlayer("Connection failed. Check your internet and firewall settings")});socket.on("disconnect",function(a){kickPlayer("Disconnected.")});socket.on("error",function(a){kickPlayer("Disconnected. The server may have updated.")});socket.on("kick",function(a){kickPlayer(a)});socket.on("lk",function(a){partyKey=a});socket.on("spawn",function(){gameState=1;unitList=share.getUnitList();
resetCamera();toggleMenuUI(!1);toggleGameUI(!0);updateUnitList();player.upgrades=share.getBaseUpgrades();mainCanvas.focus()});socket.on("gd",function(a){gameData=a});socket.on("mpd",function(a){mapBounds=a});socket.on("ch",function(a,d,c){addChatLine(a,d,c)});socket.on("setUser",function(a,d){if(a&&a[0]){var c=getUserBySID(a[0]),b={sid:a[0],name:a[1],iName:"Headquarters",upgrades:[window.share.getBaseUpgrades()[1]],dead:!1,color:a[2],size:a[3],startSize:a[4],x:a[5],y:a[6],buildRange:a[7],gridIndex:a[8],spawnProt:a[9],skin:a[10],desc:"Base of operations of "+
a[1] + " ID: " + a[0],kills:0,typeName:"Base"};null!=c?(users[c]=b,d&&(player=users[c])):(users.push(b),d&&(player=users[users.length-1]))}});socket.on("klUser",function(a){var d=getUserBySID(a);null!=d&&(users[d].dead=!0);player&&player.sid==a&&(hideMainMenuText(),leaveGame())});socket.on("delUser",function(a){a=getUserBySID(a);null!=a&&users.splice(a,1)});socket.on("au",function(a){a&&(units.push({id:a[0],owner:a[1],uPath:a[2]||0,type:a[3]||0,color:a[4]||0,paths:a[5],x:a[6]||0,sX:a[6]||0,y:a[7]||0,sY:a[7]||0,dir:a[8]||
0,turRot:a[8]||0,speed:a[9]||0,renderIndex:a[10]||0,turretIndex:a[11]||0,range:a[12]||0,cloak:a[13]||0}),units[units.length-1].speed&&(units[units.length-1].startTime=window.performance.now()),a=getUnitFromPath(units[units.length-1].uPath))&&(units[units.length-1].size=a.size,units[units.length-1].shape=a.shape,units[units.length-1].layer=a.layer,units[units.length-1].renderIndex||(units[units.length-1].renderIndex=a.renderIndex),units[units.length-1].range||(units[units.length-1].range=a.range),
units[units.length-1].turretIndex||(units[units.length-1].turretIndex=a.turretIndex),units[units.length-1].iSize=a.iSize)});socket.on("spa",function(a,d,c,b){a=getUnitById(a);if(null!=a){var g=UTILS.getDistance(d,c,units[a].x||d,units[a].y||c);300>g&&g?(units[a].interpDst=g,units[a].interpDstS=g,units[a].interpDir=UTILS.getDirection(d,c,units[a].x||d,units[a].y||c)):(units[a].interpDst=0,units[a].interpDstS=0,units[a].interpDir=0,units[a].x=d,units[a].y=c);units[a].interX=0;units[a].interY=0;units[a].sX=
units[a].x||d;units[a].sY=units[a].y||c;b[0]&&(units[a].dir=b[0],units[a].turRot=b[0]);units[a].paths=b;units[a].startTime=window.performance.now()}});socket.on("uc",function(a,d){unitList&&(unitList[a].count=d);forceUnitInfoUpdate=!0});socket.on("uul",function(a,d){unitList&&(unitList[a].limit+=d)});socket.on("rpu",function(a,d){var c=getUnitFromPath(a);c&&(c.dontShow=d,forceUnitInfoUpdate=!0)});socket.on("sp",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].spawnProt=d)});socket.on("ab",function(a){a&&
bullets.push({x:a[0],sX:a[0],y:a[1],sY:a[1],dir:a[2],speed:a[3],size:a[4],range:a[5]})});socket.on("uu",function(a,d){if(void 0!=a&&d){var c=getUnitById(a);if(null!=c)for(var b=0;b<d.length;)units[c][d[b]]=d[b+1],"dir"==d[b]&&(units[c].turRot=d[b+1]),b+=2}});socket.on("du",function(a){a=getUnitById(a);null!=a&&units.splice(a,1)});socket.on("sz",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].size=d)});socket.on("pt",function(a){scoreContainer.innerHTML="Power: <span class='spanLink'>"+a+
"</span>",player.power = a});socket.on("l",function(a){for(var d="",c=1,b=0;b<a.length;)d+="<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>"+c+".</div> <div class='"+(player&&a[b]==player.sid?"leaderYou":"leader")+"'>"+a[b+1]+"</div><div class='scoreText'>"+a[b+2]+"</div></div>",c++,b+=3;leaderboardList.innerHTML=d})}


upgradeUnit=function(a){socket&&gameState&&(1==selUnits.length?socket.emit("4",selUnits[0].id,a):(activeBase)?(a==0&&activeBase.sid==player.sid?(socket.emit("4",0,a,1)):(handleActiveBaseUpgrade(activeBase.sid,activeBase.upgrades[a].name))):(upgradeSelUnits(selUnits[0],a)))}

window.toggleUnitInfo=function(a,d){var c="";a&&a.uPath&&(c=void 0!=a.group?a.group:a.uPath[0],c=unitList[c].limit?(unitList[c].count||0)+"/"+unitList[c].limit:"");if(a&&(forceUnitInfoUpdate||"block"!=unitInfoContainer.style.display||unitInfoName.innerHTML!=(a.iName||a.name)||lastCount!=c)){forceUnitInfoUpdate=!1;unitInfoContainer.style.display="block";unitInfoName.innerHTML=a.iName||a.name;a.cost?(unitInfoCost.innerHTML="Cost "+a.cost,unitInfoCost.style.display="block"):unitInfoCost.style.display="none";
unitInfoDesc.innerHTML=a.desc;unitInfoType.innerHTML=a.typeName;var b=a.space;lastCount=c;c='<span style="color:#fff">'+c+"</span>";unitInfoLimit.innerHTML=b?'<span><i class="material-icons" style="vertical-align: top; font-size: 20px;">&#xE7FD;</i>'+b+"</span> "+c:c;unitInfoUpgrades.innerHTML="";if(d&&a.upgrades){for(var g,e,h,f,k,c=0;c<a.upgrades.length;++c)(function(b){g=a.upgrades[b];var c=!0;g.lockMaxBuy&&void 0!=g.unitSpawn&&(unitList[g.unitSpawn].count||0)>=(unitList[g.unitSpawn].limit||0)?
c=!1:g.dontShow&&(c=!1);c&&(e=document.createElement("div"),e.className="upgradeInfo",h=document.createElement("div"),h.className="unitInfoName",h.innerHTML=g.name,e.appendChild(h),f=document.createElement("div"),f.className="unitInfoCost",g.cost?(f.innerHTML="Cost "+g.cost,e.appendChild(f)):(null),k=document.createElement("div"),k.id="upgrDesc"+b,k.className="unitInfoDesc",k.innerHTML=g.desc,k.style.display="none",e.appendChild(k),e.onmouseover=function(){document.getElementById("upgrDesc"+b).style.display="block"},
e.onmouseout=function(){document.getElementById("upgrDesc"+b).style.display="none"},e.onclick=function(){upgradeUnit(b);mainCanvas.focus()},unitInfoUpgrades.appendChild(e))})(c);g=e=h=f=k=null}}else a||(unitInfoContainer.style.display="none")}

updateGameLoop=function(a){if(player&&gameData){updateTarget();if(gameState&&mapBounds){if(camXS||camYS)camX+=camXS*cameraSpd*a,camY+=camYS*cameraSpd*a;player.x+camX<mapBounds[0]?camX=mapBounds[0]-player.x:player.x+camX>mapBounds[0]+mapBounds[2]&&(camX=mapBounds[0]+mapBounds[2]-player.x);player.y+camY<mapBounds[1]?camY=mapBounds[1]-player.y:player.y+camY>mapBounds[1]+mapBounds[3]&&(camY=mapBounds[1]+mapBounds[3]-player.y);
currentTime-lastCamSend>=sendFrequency&&(lastCamX!=camX||lastCamY!=camY)&&(lastCamX=camX,lastCamY=camY,lastCamSend=currentTime,socket.emit("2",Math.round(camX),Math.round(camY)))}renderBackground(outerColor);var d=(player.x||0)-maxScreenWidth/2+camX,c=(player.y||0)-maxScreenHeight/2+camY;mapBounds&&(mainContext.fillStyle=backgroundColor,mainContext.fillRect(mapBounds[0]-d,mapBounds[1]-c,mapBounds[2],mapBounds[3]));for(var b,g,e=0;e<units.length;++e)b=units[e],b.interpDst&&(g=b.interpDst*a*.015,b.interX+=
g*MathCOS(b.interpDir),b.interY+=g*MathSIN(b.interpDir),b.interpDst-=g,.1>=b.interpDst&&(b.interpDst=0,b.interX=b.interpDstS*MathCOS(b.interpDir),b.interY=b.interpDstS*MathSIN(b.interpDir))),b.speed&&(updateUnitPosition(b),b.x+=b.interX||0,b.y+=b.interY||0);var h,f;if(gameState)if(activeUnit){h=player.x-d+targetDst*MathCOS(targetDir)+camX;f=player.y-c+targetDst*MathSIN(targetDir)+camY;var k=UTILS.getDirection(h,f,player.x-d,player.y-c);0==activeUnit.type?(b=UTILS.getDistance(h,f,player.x-d,player.y-
c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange-.15&&(h=player.x-d+(player.buildRange-activeUnit.size-.15)*MathCOS(k),f=player.y-c+(player.buildRange-activeUnit.size-.15)*MathSIN(k))):1==activeUnit.type||2==activeUnit.type?(h=player.x-d+(activeUnit.size+player.buildRange)*MathCOS(k),f=player.y-c+(activeUnit.size+player.buildRange)*MathSIN(k)):3==activeUnit.type&&
(b=UTILS.getDistance(h,f,player.x-d,player.y-c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange+2*activeUnit.size&&(h=player.x-d+(player.buildRange+activeUnit.size)*MathCOS(k),f=player.y-c+(player.buildRange+activeUnit.size)*MathSIN(k)));activeUnitDir=k;activeUnitDst=UTILS.getDistance(h,f,player.x-d,player.y-c);activeUnit.dontPlace=!1;mainContext.fillStyle=
outerColor;if(0==activeUnit.type||2==activeUnit.type||3==activeUnit.type)for(e=0;e<units.length;++e)if(1!=units[e].type&&units[e].owner==player.sid&&0<=activeUnit.size+units[e].size-UTILS.getDistance(h,f,units[e].x-d,units[e].y-c)){mainContext.fillStyle=redColor;activeUnit.dontPlace=!0;break}renderCircle(h,f,activeUnit.range?activeUnit.range:activeUnit.size+30,mainContext,!0)}else if(selUnits.length)for(e=0;e<selUnits.length;++e)mainContext.fillStyle=outerColor,1<selUnits.length?renderCircle(selUnits[e].x-
d,selUnits[e].y-c,selUnits[e].size+25,mainContext,!0):renderCircle(selUnits[e].x-d,selUnits[e].y-c,selUnits[e].range?selUnits[e].range:selUnits[e].size+25,mainContext,!0);else activeBase&&(mainContext.fillStyle=outerColor,renderCircle(activeBase.x-d,activeBase.y-c,activeBase.size+50,mainContext,!0));if(selUnits.length)for(mainContext.strokeStyle=targetColor,e=0;e<selUnits.length;++e)selUnits[e].gatherPoint&&renderDottedCircle(selUnits[e].gatherPoint[0]-d,selUnits[e].gatherPoint[1]-c,30,mainContext);
for(e=0;e<users.length;++e)if(b=users[e],!b.dead){mainContext.lineWidth=1.2*outlineWidth;mainContext.strokeStyle=indicatorColor;isOnScreen(b.x-d,b.y-c,b.buildRange)&&(mainContext.save(),mainContext.translate(b.x-d,b.y-c),mainContext.rotate(playerBorderRot),renderDottedCircle(0,0,b.buildRange,mainContext),renderDottedCircle(0,0,b.startSize,mainContext),mainContext.restore());b.spawnProt&&(mainContext.strokeStyle=redColor,mainContext.save(),mainContext.translate(b.x-d,b.y-c),mainContext.rotate(playerBorderRot),
renderDottedCircle(0,0,b.buildRange+140,mainContext),mainContext.restore());for(var m=0;m<users.length;++m)e<m&&!users[m].dead&&(mainContext.strokeStyle=b.spawnProt||users[m].spawnProt?redColor:indicatorColor,playersLinked(b,users[m])&&(isOnScreen(b.x-d,b.y-c,0)||isOnScreen(users[m].x-d,users[m].y-c,0)||isOnScreen((b.x+users[m].x)/2-d,(b.y+users[m].y)/2-c,0))&&(g=UTILS.getDirection(b.x,b.y,users[m].x,users[m].y),renderDottedLine(b.x-(b.buildRange+lanePad+(b.spawnProt?140:0))*MathCOS(g)-d,b.y-(b.buildRange+
lanePad+(b.spawnProt?140:0))*MathSIN(g)-c,users[m].x+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathCOS(g)-d,users[m].y+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathSIN(g)-c,mainContext)))}mainContext.strokeStyle=darkColor;mainContext.lineWidth=1.2*outlineWidth;for(e=0;e<units.length;++e)b=units[e],b.layer||(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));for(e=0;e<units.length;++e)b=units[e],
1==b.layer&&(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));mainContext.fillStyle=bulletColor;for(e=bullets.length-1;0<=e;--e){b=bullets[e];if(b.speed&&(b.x+=b.speed*a*MathCOS(b.dir),b.y+=b.speed*a*MathSIN(b.dir),UTILS.getDistance(b.sX,b.sY,b.x,b.y)>=b.range)){bullets.splice(e,1);continue}isOnScreen(b.x-d,b.y-c,b.size)&&renderCircle(b.x-d,b.y-c,b.size,mainContext)}mainContext.strokeStyle=darkColor;mainContext.lineWidth=
1.2*outlineWidth;for(e=0;e<users.length;++e)b=users[e],!b.dead&&isOnScreen(b.x-d,b.y-c,b.size)&&(renderPlayer(b,b.x-d,b.y-c,mainContext),"unknown"!=b.name&&(tmpIndx=b.name+"-"+b.size,20<=b.size&&b.nameSpriteIndx!=tmpIndx&&(b.nameSpriteIndx=tmpIndx,b.nameSprite=renderText(b.name,b.size/4)),b.nameSprite&&mainContext.drawImage(b.nameSprite,b.x-d-b.nameSprite.width/2,b.y-c-b.nameSprite.height/2,b.nameSprite.width,b.nameSprite.height)));if(selUnits.length)for(e=selUnits.length-1;0<=e;--e)selUnits[e]&&
0>units.indexOf(selUnits[e])&&disableSelUnit(e);activeUnit&&renderUnit(h,f,k,activeUnit,playerColors[player.color],mainContext);showSelector&&(mainContext.fillStyle="rgba(255, 255, 255, 0.1)",h=player.x-d+targetDst*MathCOS(targetDir)+camX,f=player.y-c+targetDst*MathSIN(targetDir)+camY,mainContext.fillRect(mouseStartX,mouseStartY,h-mouseStartX,f-mouseStartY));playerBorderRot+=a/5600;hoverUnit?toggleUnitInfo(hoverUnit):activeBase?toggleUnitInfo(activeBase,true):activeUnit?toggleUnitInfo(activeUnit):
0<selUnits.length?toggleUnitInfo(selUnits[0].info,!0):toggleUnitInfo()}};

function renderUnit(a,d,c,b,g,e,k){
var f=b.size*(k?iconSizeMult:1),h=f+":"+b.cloak+":"+b.renderIndex+":"+b.iSize+":"+b.turretIndex+":"+b.shape+":"+g;
if(!unitSprites[h]){var m=document.createElement("canvas"),l=m.getContext("2d");
m.width=2*f+30;m.height=m.width;m.style.width=m.width+"px";
m.style.height=m.height+"px";l.translate(m.width/2,m.height/2);
l.lineWidth=outlineWidth*(k?.9:1.2);l.strokeStyle=darkColor;
l.fillStyle=g;
4==b.renderIndex?l.fillStyle=turretColor:5==b.renderIndex&&(l.fillStyle=turretColor,renderRect(0,.76*f,1.3*f,f/2.4,l),l.fillStyle=g);b.cloak&&(l.fillStyle=backgroundColor);
"circle"==b.shape?(renderCircle(0,0,f,l),
b.iSize&&(l.fillStyle=turretColor,renderCircle(0,0,f*b.iSize,l))):"triangle"==b.shape?(renderTriangle(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderTriangle(0,2,f*b.iSize,l))):"hexagon"==b.shape?(renderAgon(0,0,f,l,6),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,f*b.iSize,l,6))):"octagon"==b.shape?(l.rotate(MathPI/8),renderAgon(0,0,.96*f,l,8),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,.96*f*b.iSize,l,8))):"pentagon"==b.shape?(l.rotate(-MathPI/2),renderAgon(0,0,1.065*f,l,5),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,1.065*f*b.iSize,l,5))):"square"==b.shape?(renderSquare(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderSquare(0,0,f*b.iSize,l))):"spike"==b.shape?renderStar(0,0,f,.7*f,l,8):"star"==b.shape&&(f*=1.2,renderStar(0,0,f,.7*f,l,6));
if(1==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.8,0,f/4,f/1,l),renderRect(-f/2.8,0,f/4,f/1,l);
else if(2==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(f/2.5,-f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,-f/2.5,f/2.5,f/2.5,l);
else if(3==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.75*f,f/2.85,3,l),renderCircle(0,0,.5*f,l),l.fillStyle=g;
else if(6==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.7*f,f/4,5,l),l.rotate(-MathPI/2),renderAgon(0,0,.4*f,l,6);
else if(7==b.renderIndex)for(g=0;3>g;++g)l.fillStyle=g?1==g?"#93e86500":"#a2ff6f00":"#89d95f00",renderStar(0,0,f,.9*f,l,100),f*=.75;
else 8==b.renderIndex&&(l.fillStyle=turretColor,renderRectCircle(0,0,.75*f,f/2.85,3,l),renderSquare(0,0,.5*f,l));1!=b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,-(MathPI/2),l);
unitSprites[h]=m}f=unitSprites[h];e.save();e.translate(a,d);e.rotate(c+MathPI/2);
e.drawImage(f,-(f.width/2),-(f.height/2),f.width,f.height);
1==b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,b.turRot-MathPI/2-c,e);e.restore()};
console.log
renderText=function(a, d) { var c = document.createElement("canvas") , b = c.getContext("2d"); b.font = d + "px regularF"; var g = b.measureText(a); c.width = g.width + 20; c.height = 2 * d; b.translate(c.width / 2, c.height / 2); b.font = d + "px regularF"; b.fillStyle = "#000000"; b.textBaseline = "middle"; b.textAlign = "center"; b.strokeStyle = darkColor; b.lineWidth = outlineWidth; b.strokeText(a, 0, 0); b.fillText(a, 0, 0); return c }

/*HOTBAR*/

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoos = false;
window.auto3 = false;
window.auto4 = false;
window.auto5 = false;
window.auto6 = false;
window.traço2 = true;
window.auto7 = false;
window.auto8 = false;
window.auto9 = false;
window.auto11 = false;
window.themeSelect = 0;
window.useTheme = false;
window.skins1 = true;
window.material = false;
window.teste = true;
window.build = false;
window.bt = false;
var ThemeSelect = document.createElement('ThemeSelect');
window.UIList.push({
    level:0,x:0,html:'<div onclick=menu()>Menu</div>'},{
    level:0,x:1,html:'<div onclick=menu2()>Menu-Defenses</div>'},{
    level:0,x:2,html:'<div onclick=menu3()>Menu-Bases</div>'},{
    level:0,x:3,html:'<div onclick=party()>Server Invitation</div>'}, {
    level:0,x:4,html:'<div id=skin onclick=skin()>Skins: <span><span class="botao"> Off</span></div>'},{
    level:0,x:5,html:'<div </div><span id="ThemeSelect" onclick=SelectTheme()>Theme:<span><span class="botao"> Dark</span></div>'},{
    level:1,x:0,html:'<div onclick=b01()>Hyb. 6 AT</div>'},{
    level:1,x:1,html:'<div onclick=b02()>Hyb. 7 AT</div>'},{
    level:1,x:2,html:'<div onclick=b03()>Houses 5 AT</div>'},{
    level:1,x:3,html:'<div onclick=b04()>Houses 8 AT</div>'},{
    level:1,x:4,html:'<div onclick=b05()>Gens US</div>'},{
    level:1,x:5,html:'<div onclick=b06()>Gens Popular</div>'},{
    level:6,x:4,html:'<div onclick=b07()>DPK</div>'},{
    level:2,x:0,html:'<div id=auto1 onclick=traço()>Trace: <span><span class="botao"> On</span></div>'},{
    level:2,x:1,html:'<div id="res" onclick=setRes()>Resolução(1)</div>'}, {
    level:2,x:2,html:'<div id="fps" onclick=setFPS()>Normal</div>'}, {
    level:2,x:3,html:'<div onclick=BOT2()>+Bot:-</div>'},{
    level:2,x:4,html:'<div onclick=centralizar()>Centralizer Sieges</div>'},{
    level:2,x:5,html:'<div onclick=b08()>Base Defend</div>'},{
    level:3,x:0,html:'<div id=auto2 onclick=autogens()>Auto Generators: <span><span class="botao"> Off</span></div>'},{
    level:3,x:1,html:'<div id=auto8 onclick=autodefense2()>Auto House:<span><span class="botao"> Off</span></div>'},{
    level:3,x:2,html:'<div id=auto4 onclick=autopower()>Auto Power Plants: <span><span class="botao"> Off</span></div>'},{
    level:3,x:3,html:'<div id=auto3 onclick=materiais()>Auto Spikes: <span><span class="botao"> Off</span></div>'},{
    level:4,x:0,html:'<div onclick=upar()>Up Objects</div>'},{
    level:4,x:1,html:'<div onclick=vender()>Sell Objects</div>'},{
    level:4,x:2,html:'<div id=auto9 onclick=autodefense4()>UP-Hybrid: <span><span class="botao"> Off</span></div>'},{
    level:4,x:3,html:'<div id=auto7 onclick=autodefense1()>UP-Defense: <span><span class="botao"> Off</span></div>'},{
    level:4,x:4,html:'<div id=auto10 onclick=autodefense7()>Auto Defend: <span><span class="botao"> Off</span></div>'},{
    level:5,x:0,html:'<div id=auto onclick=autocommander()>Auto Commander:<span><span class="botao"> Off</span></div>'},{
    level:5,x:1,html:'<div id=floo onclick=floodao()>Auto Flood:<span><span class="botao"> Off</span></div>'},{
    level:5,x:2,html:'<div onclick=inverter2()>Invert Base</div>'},{
//    level:5,x:3,html:'<div onclick=inverter()>Invert Barracks</div>'},{
    level:5,x:4,html:'<div id=build onclick=autobuild()>Auto Base: <span><span class="botao"> Off</span></div>'},{
    level:6,x:0,html:'<div id="demo" ()>Living Time:</div>'},{
    level:6,x:1,html:'<div id="player4" ()>Selected Units:</div>'},{
//    level:6,x:2,html:'<div onclick=basesautomaticas()>Automatic Bases</div>'},{
    level:6,x:3,html:'<div onclick=CE()>Centralizer</div>'},{
    level:5,x:3,html:'<div id=bugT onclick=bugtanks()>Auto Bug: <span><span class="botao"> Off</span></div>'},{
    level:6,x:7,html:'<div onclick=musicas()>Musics</div>'},{
    level:6,x:7,html:'<div onclick=bug()>Bug Guide</div>'},{
    level:6,x:7,html:'<div onclick=unitStyle()>Build Style: <span><span id="UnitStyle" class="botao">Simple</span></div>'},{
});
function playersLinked(a, d) {
    if (a.sid == player.sid && d.name.startsWith(player.name)) {
        return true;
    }
}
function players4() {
    var plss = document.createElement('player4');
    var plss2 = setInterval(function() {
    document.getElementById("player4").innerHTML = "Selected Units: <span class='botao'>" + selUnits.length + "</span>";
}, 1000)
};
setTimeout(players4, 1000);

window.menu = function () {
    alert("Tecla: J - TroopJoin.\nTecla: Q - Selecionar Soldados.\nTecla: C - Selecionar Commander/Comprar Commander.\nTecla: E - Selecionar Soldados e Commander.\nTecla: + - Visão Maior.\nTecla: - - Visão Menor.");
};

window.menu2 = function () {
    alert("Tecla: L - Carrega a Base Atual do Save Base.\nTecla: P - Ativa o Defend Automático da Base Carregada.\nTecla: O - Desativa o Defend da Base Carregada.\nTecla: ' - Defesa Manual da Base Salva.\nTecla: 2 - Substituir Itens da Base Salva por Simple Turrets.\nTecla: 3 - Substituir Itens da Base Salva por Generators.\nTecla: 4 - Substituir Itens da Base Salva por Houses.\nTecla: 5 - Substituir Itens da Base Salva por Sniper Turrets.\n(Obs: Os itens apenas serão substituidos se houver espaço para eles)");
};

window.menu3 = function () {
    alert("Tecla Z - Base Full Atk.\nTecla X - Defesa Base Full Atk.\nTecla: Numpad 1- Remontar Base Full Atk.\nTecla: PageUp - Base Atk com 5 AntiTanks.\nTecla: PageDown - Defesa Base Atk com 5 AntiTanks.\nTecla: F9 - Full Generators.\nTecla: F10 - Defesa Full Generators.\nTecla: Numpad 2 - Up Micro.\nTecla: Numpad 0 - Sell Walls.\nTecla: * - Circle Troops.\nTecla: / - Square Troops.\nTecla: Shift - Oto Lag");
};

/*BASES*/
window.b01 = function () {
socket.emit("1",-1.029981069065158,130.00279766220393,4); socket.emit("1",-1.5581532402252236,140.0011892806627,7); socket.emit("1",-2.0799718731183336,130.00106538025,4); socket.emit("1",-2.22001282329931,186.51504630994276,4); socket.emit("1",-0.5599855192715101,129.99508490708408,4); socket.emit("1",-2.5400062659482847,190.29913846363024,4); socket.emit("1",-2.5500059124657732,130.0031465003827,4); socket.emit("1",-2.859996061699241,187.4844526887495,4); socket.emit("1",0.5100119705827428,189.02565778221742,4); socket.emit("1",0.3999627324295431,130.0001999998459,4); socket.emit("1",2.7600149554480073,129.99980999986118,4); socket.emit("1",2.3300064486886476,189.56961834640066,4); socket.emit("1",2.280023344776488,129.99668495773264,4); socket.emit("1",1.8100189720265183,132.3078006014762,4); socket.emit("1",1.5800271739950331,180.917707812143,4); socket.emit("1",1.350029718682639,131.33758068428105,4); socket.emit("1",0.8300027953539185,190.61344443663967,4); socket.emit("1",0.8800172557935131,130.00326495899998,4); socket.emit("1",2.6500197356626956,191.88025041676377,4); socket.emit("1",2.7800083883328384,245.84707319795345,4); socket.emit("1",0.4000101287536772,245.84796358725444,4); socket.emit("1",-1.8900261929989046,185.67056040201953,4); socket.emit("1",-1.7800061609210787,245.85069391807681,4); socket.emit("1",0.16997778317304116,183.4944252559188,3); socket.emit("1",-2.3399840834473435,243.84952757797168,3); socket.emit("1",-3.0399791675425565,132.0008882545873,3); socket.emit("1",-2.0399825212769445,243.85142525726613,3); socket.emit("1",2.9799924558729827,182.53827680790664,3); socket.emit("1",-0.08000820113957931,132.00226854111253,3); socket.emit("1",-0.11000057487462135,243.85384413619576,3); socket.emit("1",-2.9900158813652826,243.84588350021434,3); socket.emit("1",1.9900202670034008,187.9122393565675,3); socket.emit("1",1.8400156195617396,243.85389990730124,3); socket.emit("1",1.2999943584973332,243.84657984068593,3); socket.emit("1",1.1600326380389694,186.7222796026227,3); socket.emit("1",1.5700171594315573,243.85007402090318,5); socket.emit("1",-2.6899763044002447,243.84744493227737,5); socket.emit("1",0.6600037242670697,243.85120401589165,5); socket.emit("1",2.479981208977897,243.85198871446607,5); socket.emit("1",-1.5499875782200248,212.42598899381412,5); socket.emit("1",-1.2199992447927401,185.5395246301983,4); socket.emit("1",-0.8899891427417109,188.9674818586522,4);
socket.emit("1",-0.5700269467765231,191.64104988232575,4); socket.emit("1",-0.24999497873866444,189.04677146145613,4); socket.emit("1",-1.320016909908535,245.85037258462708,4); socket.emit("1",-0.750013681451305,243.84992269836783,3); socket.emit("1",-1.059997425435585,243.84589908382696,3); socket.emit("1",-0.40999653010618003,243.84972749625928,5); socket.emit("1",3.0299921466464235,245.84939861630755,1); socket.emit("1",0.1500021711564089,245.85071832313213,1); socket.emit("1",-2.8699950543696473,305.99675896976447,1); socket.emit("1",-2.6699945529662017,306.00215750873383,1); socket.emit("1",2.7900128568563245,305.99794574473884,1); socket.emit("1",-2.470016015501195,306.00059231968834,1); socket.emit("1",2.5899976161685827,306.00345422886977,1); socket.emit("1",0.74998936573476,306.00135032381803,1); socket.emit("1",-2.26998664270148,305.9983718910935,1); socket.emit("1",-2.0699943864344963,306.00247662396436,1); socket.emit("1",-1.870016065560421,305.99640520764297,1); socket.emit("1",0.5499978909804838,305.9966674655133,1); socket.emit("1",-1.6700097406586398,306.00481385102427,1); socket.emit("1",1.57001201323023,306.00009411763256,1); socket.emit("1",1.370003953798923,305.9978486852481,1); socket.emit("1",1.169989618325742,306.0016905182061,1); socket.emit("1",1.769986411412046,306.0004983656071,1); socket.emit("1",1.9700067461273425,306.00144966976876,1); socket.emit("1",2.1799902314087785,244.3697955967552,1); socket.emit("1",0.9600037510265641,245.97356544962315,1); socket.emit("1",2.3899850917674166,305.9983614335214,1); socket.emit("1",0.3500078561529565,306.00295325372247,1); socket.emit("1",-3.0699964789961585,306.0039550397999,1); socket.emit("1",-0.27000396268680665,305.9962949122095,1); socket.emit("1",-0.0699919517952906,305.9992197702471,1); socket.emit("1",-0.4699905130330266,305.99864182705136,1); socket.emit("1",-0.6699944573743298,305.99938382290895,1); socket.emit("1",-0.8699825064937456,305.9984261397436,1); socket.emit("1",-1.069989043941217,305.9980111046476,1); socket.emit("1",-1.4700058293549059,306.00298462596714,1); socket.emit("1",-1.2700052430104114,305.9985999967975,1); socket.emit("1",2.999992125059829,310.00269756890833,8); socket.emit("1",0.14000385187528874,310.0032394992025,8); socket.emit("1",2.180013319091887,310.0001693547924,8); socket.emit("1",0.9600042952762949,309.99981709672005,8);}

window.b02 = function () {
socket.emit("1",1.5700120132302293,306.00009411763256,1); socket.emit("1",1.7699864114120452,306.00049836560726,1); socket.emit("1",1.9700067461273425,306.00144966976876,1); socket.emit("1",1.370003953798924,305.997848685248,1); socket.emit("1",1.1699896183257414,306.00169051820615,1); socket.emit("1",2.3899850917674166,305.9983614335214,1); socket.emit("1",2.5899976161685836,306.0034542288697,1); socket.emit("1",0.74998936573476,306.00135032381803,1); socket.emit("1",0.5499978909804838,305.9966674655133,1); socket.emit("1",0.350007856152957,306.0029532537228,1); socket.emit("1",-0.0699919517952906,305.9992197702471,1); socket.emit("1",-0.27000396268680643,305.99629491220975,1); socket.emit("1",-0.46999051303302697,305.9986418270512,1); socket.emit("1",2.7900128568563245,305.9979457447386,1); socket.emit("1",-3.0699964789961576,306.00395503980013,1); socket.emit("1",-2.8699950543696477,305.9967589697642,1); socket.emit("1",-2.669994552966202,306.0021575087339,1); socket.emit("1",-2.470016015501195,306.0005923196881,1); socket.emit("1",-2.2699866427014794,305.99837189109365,1); socket.emit("1",-0.6699944573743298,305.99938382290895,1); socket.emit("1",-0.8699825064937459,305.99842613974334,1); socket.emit("1",-1.0699890439412167,305.99801110464756,1); socket.emit("1",-1.6700097406586398,306.00481385102427,1); socket.emit("1",-1.2700052430104105,305.9985999967974,1); socket.emit("1",-1.470005829354906,306.0029846259674,1); socket.emit("1",0.9600042952762954,309.9998170967203,8); socket.emit("1",2.1800133190918873,310.00016935479243,8); socket.emit("1",0.1400038518752879,310.00323949920266,8); socket.emit("1",2.999992125059829,310.0026975689082,8); socket.emit("1",-1.5581532402252236,140.0011892806629,7); socket.emit("1",-2.089961523372134,129.9995649992721,4); socket.emit("1",-1.900015194565953,184.19199901190055,4); socket.emit("1",-2.0699943864344967,306.0024766239646,1); socket.emit("1",-1.8700160655604219,305.9964052076429,1); socket.emit("1",0.11999451305359526,245.767240290483,1); socket.emit("1",2.1700182063415716,242.26946402714478,1); socket.emit("1",3.039980628631685,245.76768481637288,1); socket.emit("1",0.9899892450074849,242.0635645858334,1); socket.emit("1",1.8400303001017062,130.00337995606105,4); socket.emit("1",1.3200152734711854,129.9964326433615,4); socket.emit("1",1.580025643599934,180.94770653423606,4); socket.emit("1",1.840015619561739,243.85389990730096,3);
socket.emit("1",1.2999943584973332,243.84657984068593,3); socket.emit("1",1.9999985224394905,188.68400912636974,3); socket.emit("1",1.1599994981707493,187.00856905500353,3); socket.emit("1",2.7799859160506273,129.99695457971305,4); socket.emit("1",2.650004238565621,186.8114249718149,4); socket.emit("1",0.5100306509151978,186.82763874759,4); socket.emit("1",2.3099981404518664,129.9988511487697,4); socket.emit("1",0.8500053467351406,130.00411108884214,4); socket.emit("1",2.3299992877938283,191.6775552849107,4); socket.emit("1",0.8299693021267396,190.2804890155584,4); socket.emit("1",2.7799805500869352,243.85036251767193,3); socket.emit("1",0.3800113841969229,243.8458632005063,3); socket.emit("1",-3.029975519697537,129.99894807266716,4); socket.emit("1",-2.869981213285706,185.25134709361768,4); socket.emit("1",0.37999215755735155,130.003466492244,4); socket.emit("1",-0.0899704002465926,129.9957818546433,4); socket.emit("1",-0.2499764089539633,186.3521494375634,4); socket.emit("1",-2.230001842487972,188.99930581883103,4); socket.emit("1",-2.5599902357301723,130.00497413560774,4); socket.emit("1",-0.5599855192715077,129.99508490708416,4); socket.emit("1",-0.570013277966789,190.570352363635,4); socket.emit("1",-2.5499929432546815,191.21748873991632,4); socket.emit("1",-0.740002534218726,243.8565793658231,3); socket.emit("1",-2.390012034342774,243.85084703564183,3); socket.emit("1",-1.0299810690651576,130.00279766220424,4); socket.emit("1",-1.2199839901517864,184.57154114326505,4); socket.emit("1",-0.8899883283407355,187.14021614821337,4); socket.emit("1",-1.810016266208821,243.85421156912582,3); socket.emit("1",-1.309982603450287,243.84678468251334,3); socket.emit("1",-1.5599823481235278,210.84232805582474,1); socket.emit("1",-1.0200171631078678,243.85148861550948,5); socket.emit("1",-2.079997961276873,243.8457401719373,5); socket.emit("1",-0.14001217935336982,243.84620665493244,5); socket.emit("1",-2.980010453553088,243.846348752652,5); socket.emit("1",-0.41998560953810266,243.85200532290082,3); socket.emit("1",-2.7099897056667457,243.8521277331818,3); socket.emit("1",1.5700171594315573,243.85007402090318,5); socket.emit("1",0.6799990964957563,243.84839757521462,5); socket.emit("1",2.490012652325368,243.8479577523667,5); socket.emit("1",3.020017533923341,183.3835829620525,3); socket.emit("1",0.1300234447471032,182.71230117318328,3); }

window.b03 = function () {
socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,183,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,246,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8);
socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}

window.b04 = function () {
socket.emit("1",-1.5581532402252236,140.0011892806629,7); socket.emit("1",-1.0381869001827224,129.99646225955547,4); socket.emit("1",-0.5681806124404523,129.9945668095403,4); socket.emit("1",-0.09816073899580904,129.99578647017745,4); socket.emit("1",0.37180734219734096,130.00279727759695,4); socket.emit("1",0.8467923001546747,129.9990161501233,4); socket.emit("1",1.3168436891180217,129.99947884510917,4); socket.emit("1",1.8500152100114902,130.00496067458346,4); socket.emit("1",2.320015867387845,130.00179883370842,4); socket.emit("1",2.790015456127193,130.00213613629603,4);socket.emit("1",-3.018201325640385,129.99838498996846,4); socket.emit("1",-2.548235091841052,130.001401915518,4); socket.emit("1",-2.0782161031141975,129.99982038449136,4); socket.emit("1",-1.7899946882768452,245.85274556124037,4); socket.emit("1",-2.0400102472512085,245.8505385391702,4); socket.emit("1",-1.3300004601132198,245.85323772527386,4); socket.emit("1",-1.0799872221808795,245.85244212738672,4); socket.emit("1",-1.2400140198675755,188.371914042407,4); socket.emit("1",-1.8800127653569898,188.7205812835473,4); socket.emit("1",-0.9199733607247844,189.57108139165103,4); socket.emit("1",-0.6000022027571448,189.99572232026694,4);socket.emit("1",-0.26000833860255956,185.42245009706895,4); socket.emit("1",0.7400227835782683,187.68962038429288,4); socket.emit("1",0.4200072120007803,189.64259674450767,4); socket.emit("1",0.08998151164314264,182.83969727605646,4); socket.emit("1",-2.8700055449282584,185.60302826193345,4); socket.emit("1",-2.5199990495474385,190.26965706596505,4); socket.emit("1",-2.200018923992461,187.98116208811993,4); socket.emit("1",2.750010022774966,190.12097858994943,4); socket.emit("1",2.429991660994673,187.7812583832583,4); socket.emit("1",1.740024011703479,188.21867840360582,4); socket.emit("1",1.4199736166367345,188.5504627414104,4); socket.emit("1",1.0800082958012371,181.27770960600756,4); socket.emit("1",2.0800085392656555,181.0500317591799,4); socket.emit("1",3.0800199912016377,182.82645568954186,4); socket.emit("1",2.349981960822945,245.85163005357535,4); socket.emit("1",1.82998124233891,245.85164164593252,4); socket.emit("1",1.5799890388779119,245.85038783780675,4); socket.emit("1",1.3300004601132198,245.85323772527386,4); socket.emit("1",0.8100206101845786,245.85069656195827,4); socket.emit("1",0.27998695906212073,245.85378174842074,4); socket.emit("1",0.5399939832232659,245.8518189885931,4);
socket.emit("1",-0.24000652462927047,245.84684988829954,4); socket.emit("1",-0.4899908238849546,245.8470589614609,4); socket.emit("1",-2.8800103503481607,245.85344516601734,4); socket.emit("1",-2.629994213153246,245.8475676105012,4); socket.emit("1",2.619994624090542,245.85246714238997,4); socket.emit("1",2.8800103503481607,245.85344516601734,4); socket.emit("1",-3.139993311094516,243.85031187185297,5); socket.emit("1",2.0900238258029606,243.84856796790913,5); socket.emit("1",-0.779975569019775,243.84935862126036,5); socket.emit("1",-1.5600004612898983,212.12236138606417,5); socket.emit("1",1.0700030296336063,243.854904605177,5); socket.emit("1",-2.339984083447343,243.84952757797183,5); socket.emit("1",0.020013734298531503,243.84883514177403,5); socket.emit("1",0.5736269735967944,305.998699343641,1); socket.emit("1",0.7736127967018078,306.0004970584197,1); socket.emit("1",0.9736391260161129,305.99654442493295,1); socket.emit("1",-1.2663771910429726,305.9994825159023,1); socket.emit("1",-2.4963625254163935,310.0024633773092,8); socket.emit("1",-1.0563755382818671,310.0009924177664,8); socket.emit("1",-0.6363785107379634,310.0018633814966,8); socket.emit("1",-2.286373725497947,305.996480535316,1); socket.emit("1",2.976830792176504,306.00407791400437,1); socket.emit("1",-3.106356597799549,305.9999419934585,1); socket.emit("1",-2.90635528029621,305.9974628979791,1); socket.emit("1",-2.706375133680289,305.9953937561804,1); socket.emit("1",1.9768295377351097,305.99933660058815,1); socket.emit("1",2.176818427826517,306.0028923065925,1); socket.emit("1",2.376808220414558,306.0018316938642,1); socket.emit("1",2.576813435349161,305.99967124165346,1); socket.emit("1",1.173637163577343,305.99778103770626,1); socket.emit("1",1.3736379023448866,305.99805309838166,1); socket.emit("1",-2.076378389598482,310.00372255829444,8); socket.emit("1",-0.8463712232226996,306.00341452343304,1); socket.emit("1",-0.4263705523506191,305.9948733230672,1); socket.emit("1",-1.86635678278889,305.9983820218663,1); socket.emit("1",-1.6663677077291326,305.9964052076429,1); socket.emit("1",-1.4663572890539367,305.99731845230275,1); socket.emit("1",2.776828419740493,306.0025530939243,1); socket.emit("1",1.5768095227252141,305.99553215692544,1); socket.emit("1",1.7768249040222337,306.0016027735802,1); socket.emit("1",-0.22637508916622923,305.99708903844174,1); socket.emit("1",-0.026375914577593883,305.9964329857456,1);
socket.emit("1",0.17361585737350216,306.00022810449025,1); socket.emit("1",0.3736307761937506,306.0015820220541,1);}

window.b05 = function () {
socket.emit("1",1.5700171594315573,243.85007402090326,3); socket.emit("1",2.4400100710526793,196.79985467474305,3); socket.emit("1",2.2400039007898447,243.85656849877958,3); socket.emit("1",-2.7800023458624703,194.6788252481507,3); socket.emit("1",1.9699911201667188,243.85313366860794,3); socket.emit("1",2.0999878201715214,185.58517209087591,3); socket.emit("1",1.8700025978863808,132.00487756139935,3); socket.emit("1",1.2599938029024704,132.00454272486235,3); socket.emit("1",1.3800278697318928,194.13178049974198,3); socket.emit("1",1.7600061169825598,194.06341746965091,3); socket.emit("1",-2.4400027616849433,185.75130282181078,3); socket.emit("1",-2.1999936469647867,131.99750300668575,3); socket.emit("1",-2.5899833434664847,243.84680949317334,3); socket.emit("1",3.0599865137335724,131.9992848465475,3); socket.emit("1",2.3700155322992322,132.00115908582003,3); socket.emit("1",2.7699990995853443,180.63860107961412,3); socket.emit("1",2.910001829109119,243.8501927413633,3); socket.emit("1",2.6399909192202835,243.84888476267423,3); socket.emit("1",3.1100150743706907,196.05774072961268,3); socket.emit("1",-2.9699920613329622,243.85151732150447,3); socket.emit("1",-2.690040409174835,132.00027613607475,3); socket.emit("1",-2.3099851374683826,243.85151732150447,3); socket.emit("1",-2.0399825212769436,243.85142525726602,3); socket.emit("1",-1.7700175093099535,243.85316996094184,3); socket.emit("1",0.7600044161827382,132.00282572733062,3); socket.emit("1",0.35996640663856383,180.10304605974878,3); socket.emit("1",0.029980358323314006,197.1585985951411,3); socket.emit("1",-0.439963547142766,132.00080795207285,3); socket.emit("1",0.0800082011395776,132.0022685411125,3); socket.emit("1",0.22998938484625386,243.85088271318605,3); socket.emit("1",0.5000045603394669,243.85230796529285,3); socket.emit("1",0.7000201471114224,196.1091423162112,3); socket.emit("1",0.8999878082444033,243.84691201653544,3); socket.emit("1",1.0399986494012126,186.08457861950842,3); socket.emit("1",1.170002238251199,243.8551629553904,3); socket.emit("1",-0.170023102819992,243.84605081895415,3); socket.emit("1",-0.36001357695289626,194.92632916053194,3); socket.emit("1",-0.7000068138510656,183.7252296229344,3); socket.emit("1",-1.3600094643934062,243.84717119540267,3); socket.emit("1",-1.0899817628353876,243.84783862072678,3); socket.emit("1",-0.5500054440958607,243.85303709406625,3);
socket.emit("1",-0.8199991749608286,243.85031002645857,3); socket.emit("1",-1.9300228177358634,182.30682104627905,3); socket.emit("1",-1.199997990229862,183.82290662482725,3); socket.emit("1",-0.9500096278543927,131.99805036438974,3); socket.emit("1",-1.5699815385655684,196.37006518306183,3); socket.emit("1",-1.5699629936544652,132.00004583332537,3);}

window.b06 = function () {
socket.emit("1", 4.73, 245, 3); socket.emit("1", 5.0025, 245, 3); socket.emit("1", 5.275, 245, 3); socket.emit("1", 5.5475, 245, 3); socket.emit("1", 5.82, 245, 3); socket.emit("1", 6.0925, 245, 3); socket.emit("1", 6.365, 245, 3); socket.emit("1", 6.6375, 245, 3); socket.emit("1", 6.91, 245, 3); socket.emit("1", 7.1825, 245, 3); socket.emit("1", 7.455, 245, 3); socket.emit("1", 7.7275, 245, 3); socket.emit("1", 8.0025, 245, 3); socket.emit("1", 8.275, 245, 3); socket.emit("1", 8.5475, 245, 3); socket.emit("1", 8.82, 245, 3); socket.emit("1", 9.0925, 245, 3); socket.emit("1", 9.3675, 245, 3); socket.emit("1", 9.64, 245, 3); socket.emit("1", 9.9125, 245, 3); socket.emit("1", 10.1875, 245, 3); socket.emit("1", 10.4625, 245, 3); socket.emit("1", 10.7375, 245, 3); socket.emit("1", 5.999, 180, 3); socket.emit("1", 6.275, 130, 3); socket.emit("1", 6.51, 185, 3); socket.emit("1", 6.775, 130, 3); socket.emit("1", 7.05, 185, 3); socket.emit("1", 7.3, 130, 3); socket.emit("1", 7.6, 185, 3); socket.emit("1", 7.85, 130, 3); socket.emit("1", 8.15, 185, 3); socket.emit("1", 8.4, 130, 3); socket.emit("1", 8.675, 185, 3); socket.emit("1", 8.925, 130, 3); socket.emit("1", 9.225, 185, 3); socket.emit("1", 9.5, 130, 3); socket.emit("1", 9.78, 185, 3); socket.emit("1", 10.05, 130, 3); socket.emit("1", 10.325, 185, 3); socket.emit("1", 10.6, 130, 3); socket.emit("1", 4.5889, 186.5, 3); socket.emit("1", 4.81, 130, 3); socket.emit("1", 5.085, 180.5, 3); socket.emit("1", 5.36, 130, 3); socket.emit("1", 5.64, 180, 3);}

window.b07 = function () {
for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}
for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}
for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}
for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}
}

window.b08 = function () {
socket.emit('1',-3.1400017458410745,132.00016704534883,3); socket.emit('1',-2.616686461722192,132.00119469156337,3); socket.emit('1',-2.093428548209907,132.00104734432992,3); socket.emit('1',2.616310321066522,131.99528817347993,3); socket.emit('1',2.0929868863115724,132.0020973318228,3); socket.emit('1',1.569735721131977,132.00007424240337,3); socket.emit('1',1.0463973901061698,131.99710489249375,3); socket.emit('1',0.5230738902535457,132.00002310605862,3); socket.emit('1',-1.570114508718732,132.00003068181462,3); socket.emit('1',-0.5235155658601256,131.99902461760846,3); socket.emit('1',-1.0467734858480613,132.00305526767173,3); socket.emit('1',-0.00022727272335942278,132.00000340909085,3); socket.emit('1',-2.96499625621234,243.85255627120253,3); socket.emit('1',-2.267403818578474,243.8517853123081,3); socket.emit('1',-1.9185898204332987,243.85002481033297,3); socket.emit('1',-1.220991744522507,243.8474754841641,3); socket.emit('1',-0.8722093510197582,243.85188496298323,3); socket.emit('1',-0.17460093095972665,243.84747117819367,3); socket.emit('1',0.17418282976354182,243.8498168955638,3); socket.emit('1',0.8717735101819609,243.84975640750602,3); socket.emit('1',1.9182009046799133,243.84757288109304,3); socket.emit('1',1.2206028540475353,243.85015501327857,3); socket.emit('1',2.266994302663708,243.84649761684082,3); socket.emit('1',2.9646185061452104,243.84869591613565,3); socket.emit('1',-2.616210354214119,243.8471070158512,5); socket.emit('1',-1.5698121155071942,243.8501181053641,5); socket.emit('1',-0.5233985505654213,243.84457016714566,5); socket.emit('1',0.5230119104981388,243.84790854136926,5); socket.emit('1',1.5694020279239838,243.85023703084636,5); socket.emit('1',2.615788211448416,243.8490110703753,5); socket.emit('1',-3.139991347768931,306.00039232000995,1); socket.emit('1',-2.923994196541792,305.99577121261,1); socket.emit('1',-2.7079979891398973,305.99649671197216,1); socket.emit('1',-2.492000077058938,306.0036772654865,1); socket.emit('1',-2.2760162239680466,306.00062516276006,1); socket.emit('1',-2.060007793381665,306.0030262922248,1); socket.emit('1',-1.8439875536674653,305.9980001568637,1); socket.emit('1',-1.6279843105192338,306.0002452613396,1); socket.emit('1',-1.4119926259902453,306.0003506533938,1); socket.emit('1',-1.1960064618373836,306.0012058799769,1); socket.emit('1',-0.9799930163427819,305.9987898668882,1); socket.emit('1',-0.7640215518210056,305.9996609475246,1); socket.emit('1',-0.5480025429968127,305.9982883939059,1); socket.emit('1',-0.3320125932586848,306.00126094511444,1); socket.emit('1',-0.11601286924045084,305.9968954090875,1); socket.emit('1',0.10000358459797759,305.99882908272707,1); socket.emit('1',0.31598401089984723,305.9997232024892,1); socket.emit('1',0.5319958032307894,306.0003472220252,1); socket.emit('1',0.7480000132173786,305.99521728288505,1); socket.emit('1',0.964003270834421,305.99613886452875,1); socket.emit('1',1.1800097508428804,305.999376633352,1); socket.emit('1',1.3959878271385584,306.003535927283,1); socket.emit('1',1.611984506412355,305.99952222184925,1); socket.emit('1',1.8280052688256239,305.99612824347963,1); socket.emit('1',2.0440168675640136,305.9975628987916,1); socket.emit('1',2.259986333836035,306.001329572275,1); socket.emit('1',2.4759978600339494,305.994679692311,1); socket.emit('1',2.691990337526868,306.00030751618533,1); socket.emit('1',2.908003886220855,306.00036764683796,1); socket.emit('1',-2.791214196322064,193.99668089944217,1); socket.emit('1',-2.442392890871587,194.0008505135995,1); socket.emit('1',-2.093605849859661,194.00527054696212,1); socket.emit('1',-1.7448175775409633,194.0000850515278,1); socket.emit('1',-1.3959867692518821,193.99657007277213,1); socket.emit('1',-0.6983945911642699,194.00021649472455,1); socket.emit('1',-0.34961216850931265,193.995644538737,1); socket.emit('1',-0.0008247420810452244,194.00006597937022,1); socket.emit('1',0.34801353139633523,193.99990335049142,1); socket.emit('1',0.6967842348778635,193.99932577202426,1); socket.emit('1',1.3944191174201557,193.99974664931912,1); socket.emit('1',1.7431991142527825,193.99590923522064,1); socket.emit('1',2.4407825661619134,194.00249586023367,1); socket.emit('1',2.7895848737881193,194.00599011370764,1); socket.emit('1',3.1383967881815615,194.00099071911978,1); socket.emit('1',1.050026515650753,194.03151213140606,1); socket.emit('1',2.089967987414468,194.21110678846347,1); socket.emit('1',-1.0500206127639005,194.0898103971457,1);
}

window.traço = function () {
    var abc = document.getElementById('auto1');
    if (traço2) {
        traço2 = false
        renderDottedCircle=function(a, d, c, b) {
            b.setLineDash([5500, 1200]); b.beginPath(); b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI); b.stroke(); b.setLineDash([]) }
        renderDottedLine=function(a, d, c, b, g) {
            g.setLineDash([5500, 1200]); g.beginPath(); g.moveTo(a, d); g.lineTo(c, b); g.stroke(); g.setLineDash([]) }
        abc.innerHTML = 'Trace: <span class="botao">Off</span>';
    } else {
        traço2 = true
        renderDottedCircle=function(a, d, c, b) {
            b.setLineDash([55, 12]); b.beginPath(); b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI); b.stroke(); b.setLineDash([]) }
        renderDottedLine=function(a, d, c, b, g) {
            g.setLineDash([55, 12]); g.beginPath(); g.moveTo(a, d); g.lineTo(c, b); g.stroke(); g.setLineDash([]) }
        abc.innerHTML = 'Trace: <span class="botao">On</span>';
    }
    window.statusBar();
    return traço2;
}
window.bugtanks = function () {
   var bugg = document.getElementById('bugT');
   if (bt) {
   bt = false;
   bugg.innerHTML = 'Auto Bug: <span class="botao">Off</span>';
   clearInterval(tank);
   } else {
   bt = true;
   bugg.innerHTML = 'Auto Bug: <span class="botao">On</span>';
   window.tank = setInterval(autobug, 1000);
   function autobug() {
function coordenada() {for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+12)*1, ((player.y)-1050)*1, e, 0, -1);}
function SelecionarT(){selUnits = [];units.every((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Tank') {selUnits.push(unit);return false;};};return true;});selUnitType = "Unit";};
setTimeout(function() {SelecionarT();}, 50);
setTimeout(function() {coordenada();}, 100);
   }};
   window.statusBar();
   return bt;
}
/*UP-Hibrida*/
window.autodefense4 = function () {
   var abcu = document.getElementById('auto9');
   if (auto9) {
   auto9 = false;
   abcu.innerHTML = 'UP-Hybrid: <span class="botao">Off</span>';
   clearInterval(teste9);
   } else {
   auto9 = true;
   abcu.innerHTML = 'UP-Hybrid: <span class="botao">On</span>';
   window.teste9 = setInterval(autodefesa4, 1000);
   function autodefesa4() {
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}};
   window.statusBar();
   return auto9;
}
/*AutoHouse1*/
window.autodefense2 = function () {
   var abco = document.getElementById('auto8');
   if (auto8) {
   auto8 = false;
   abco.innerHTML = 'Auto House: <span class="botao">Off</span>';
   clearInterval(teste8);
   } else {
   auto8 = true;
   abco.innerHTML = 'Auto House: <span class="botao">On</span>';
   window.teste8 = setInterval(autodefesa2, 1000);
   function autodefesa2() {
         socket.emit("1",4.725,130,7); socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);
}};
   window.statusBar();
   return auto8;
}
/*UP Defesa*/
window.autodefense1 = function () {
   var abcp = document.getElementById('auto7');
   if (auto7) {
   auto7 = false;
   abcp.innerHTML = 'UP-Defense: <span class="botao">Off</span>';
   clearInterval(teste7);
   } else {
   auto7 = true;
   abcp.innerHTML = 'UP-Defense: <span class="botao">On</span>';
   window.teste7 = setInterval(autodefesa1, 1000);
   function autodefesa1() {
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)
for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)
}};
   window.statusBar();
   return auto7;
}
addEventListener("keydown", function(a) {
    if (a.keyCode == 16) {
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 1); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 10);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 2); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 50);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 3); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 4); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 150);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 5); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 200);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 6); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 250);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 7); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 300);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 8); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 350);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 9); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 400);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 10); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 450);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 12); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 500);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 13); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 550);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 14); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 600);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 15); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 650);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 16); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 700);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 17); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 750);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 18); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 800);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 19); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 850);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 21); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 900);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 22); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 950);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 23); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1000);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 24); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1050);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 25); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 26); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1150);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 27); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1200);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 28); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1250);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 29); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1300);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 30); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1350);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 31); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1400);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 32); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1450);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 33); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1500);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 34); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1550);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 35); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1600);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 36); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1650);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 37); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1700);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 38); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1750);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 39); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1800);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 40); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1850);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 41); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1900);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 42); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 1950);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 43); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2000);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 44); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2050);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 45); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 46); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2150);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 47); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2200);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 48); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2250);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 49); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2300);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 50); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2350);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 51); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2400);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 52); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2450);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 53); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2500);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 54); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2550);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 55); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2600);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 56); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2650);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 57); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2700);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 58); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2750);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 59); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2800);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 60); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2850);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 61); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2900);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 62); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 2950);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 63); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3000);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 64); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3050);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 65); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 66); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3150);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 67); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3200);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 68); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3250);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 69); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3300);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 70); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3350);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 71); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3400);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 72); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3450);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 73); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3500);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 74); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3550);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 75); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3600);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 76); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3650);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 77); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3700);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 78); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3750);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 79); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3800);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 80); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3850);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 81); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3900);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 82); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 3950);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 83); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4000);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 84); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4050);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 85); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 86); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4150);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 87); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4200);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 88); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4250);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 89); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4300);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 90); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4350);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 91); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4400);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 92); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4450);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 93); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4500);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 94); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4550);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 95); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4600);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 96); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4650);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 97); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4700);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 98); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4750);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 99); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4800);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 100); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4850);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 101); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4900);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 102); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 4950);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 103); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5000);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 104); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5050);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 105); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 106); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5150);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 107); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5200);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 108); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5250);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 110); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5300);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 111); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5350);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 112); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5400);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 113); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5450);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 114); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5500);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 115); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5550);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 116); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5600);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 117); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5650);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 118); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5700);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 119); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5750);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 120); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5800);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 121); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5850);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 122); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5900);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 123); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 5950);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 124); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 6000);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 125); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 6050);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 126); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 1, d, e, 0, -1)
        }, 6100)
    }
});


setInterval(function() {
    if (window.socket) {
        window.socket.emit("2", window.camX, window.camY)
    }
}, 200000);

/*AfkFpsRes*/
var resolution = 1;
var rate = 0;

window.removeEventListener("mousemove", gameInput);

window.gameInput = function (a) {
a.preventDefault();
a.stopPropagation();
mouseX = a.clientX * resolution;
mouseY = a.clientY * resolution;
};
window.addEventListener("mousemove", gameInput, false);
window.removeEventListener("resize", resize);
window.resize = function (n) {
screenWidth = window.innerWidth * resolution;
screenHeight = window.innerHeight * resolution;
scaleFillNative = MathMAX(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
if (n !== true) {
mainCanvas.width = screenWidth;
mainCanvas.height = screenHeight;
mainCanvas.style.width = (screenWidth / resolution) + "px";
mainCanvas.style.height = (screenHeight / resolution) + "px";
};

mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, Math.floor((screenWidth - maxScreenWidth * scaleFillNative) / 2), Math.floor((screenHeight - maxScreenHeight * scaleFillNative) / 2));
player || renderBackground();
};

window.setRes = function () {
var el = document.getElementById('res');
if (resolution === 2) {
    resolution = .1;
    el.textContent = 'Resolução(.1)';
} else if (resolution === .1) {
    resolution = .2;
    el.textContent = 'Resolução(.2)';
} else if (resolution === .2) {
    resolution = .3;
    el.textContent = 'Resolução(.3)';
} else if (resolution === .3) {
    resolution = .4;
    el.textContent = 'Resolução(.4)';
} else if (resolution === .4) {
    resolution = .5;
    el.textContent = 'Resolução(.5)';
} else if (resolution === .5) {
    resolution = .6;
    el.textContent = 'Resolução(.6)';
} else if (resolution === .6) {
    resolution = .7;
    el.textContent = 'Resolução(.7)';
} else if (resolution === .7) {
    resolution = .8;
    el.textContent = 'Resolução(.8)';
} else if (resolution === .8) {
    resolution = .9;
    el.textContent = 'Resolução(.9)';
} else if (resolution === .9) {
    resolution = 1;
    el.textContent = 'Resolução(1)';
} else if (resolution === 1) {
    resolution = 1.1;
    el.textContent = 'Resolução(1.1)';
} else if (resolution === 1.1) {
    resolution = 1.2;
    el.textContent = 'Resolução(1.2)';
} else if (resolution === 1.2) {
    resolution = 1.3;
    el.textContent = 'Resolução(1.3)';
} else if (resolution === 1.3) {
    resolution = 1.4;
    el.textContent = 'Resolução(1.4)';
} else if (resolution === 1.4) {
    resolution = 1.5;
    el.textContent = 'Resolução(1.5)';
} else if (resolution === 1.5) {
    resolution = 1.6;
    el.textContent = 'Resolução(1.6)';
} else if (resolution === 1.6) {
    resolution = 1.7;
    el.textContent = 'Resolução(1.7)';
} else if (resolution === 1.7) {
    resolution = 1.8;
    el.textContent = 'Resolução(1.8)';
} else if (resolution === 1.8) {
    resolution = 1.9;
    el.textContent = 'Resolução(1.9)';
} else if (resolution === 1.9) {
    resolution = 2;
    el.textContent = 'Resolução(2)';
} else if (resolution === 2) {
    resolution = 2.1;
    el.textContent = 'Resolução(2.1)';
} else if (resolution === 2.1) {
    resolution = 2.2;
    el.textContent = 'Resolução(2.2)';
} else if (resolution === 2.2) {
    resolution = 2.3;
    el.textContent = 'Resolução(2.3)';
} else if (resolution === 2.3) {
    resolution = 2.4;
    el.textContent = 'Resolução(2.4)';
} else {
    resolution = 2.5;
    el.textContent = 'Resolução(2.5)';
}

 unitSprites = {};
resize();
window.statusBar();
};

window.setFPS = function () {
var el = document.getElementById('fps');
if (rate === 0) {
    el.textContent = 'Anti-Lag';
    rate = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
} else {
    el.textContent = 'Normal';
    rate = 0;
}
unitSprites = {};
resize();
window.statusBar();
};

window.UIList = window.UIList || []; /*flood bots*/
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.floodtop12 = false;
window.UIList.push({
    level: 6,
    x: 7,
    html: '<div id=floo12 onclick=floodao12()>Lag Troops: Off</div>'
});
window.floodao12 = function() {
    var elaa = document.getElementById('floo12');
    if (floodtop12) {
        floodtop12 = false;
        elaa.textContent = 'Lag Troops: Off';
        clearInterval(flood12);
    } else {
        floodtop12 = true;
        elaa.textContent = 'Lag Troops: On';
        window.flood12 = setInterval(floodon12, 280)

        function floodon12() {
juntar23();
juntar3();
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-3); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-4); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-5); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-6); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-7); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-8); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-9); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-10); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-12); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-13); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-14); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-15); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-16); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-17); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-18); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-19); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-21); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-22); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-23); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-24); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-25); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-26); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-27); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-28); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-29); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-30); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-31); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-32); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-33); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-34); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-35); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-36); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-37); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-38); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-39); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-40); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-41); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-42); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-43); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-44); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-45); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-46); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-47); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-48); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-49); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-50); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-51); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-52); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-53); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-54); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-55); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-56); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-57); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-58); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-59); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-60); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-61); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-62); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-63); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-64); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-65); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-66); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-67); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-68); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-69); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-70); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6800)

        }

        window.statusBar();
        return floodtop12()
    }
}
window.mode = 0;
window.unitStyle = function(){
    var Active = document.getElementById("UnitStyle");
    if(mode==0){
        mode = 1;
        Active.innerText = 'Duplicate';
        window.sendUnit = function(a) {
            socket && gameState && activeUnit && !activeUnit.dontPlace;
            socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            socket.emit("1", (Math.PI / 2) - (UTILS.roundToTwo(activeUnitDir) - (Math.PI / 2)), UTILS.roundToTwo(activeUnitDst), a);
            for (var i = 0; i < window.sockets.length; i++) {
                sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
                sockets[i].emit("1", (Math.PI / 2) - (UTILS.roundToTwo(activeUnitDir) - (Math.PI / 2)), UTILS.roundToTwo(activeUnitDst), a);
            }
        }
    } else if(mode==1){
        mode = 2;
        Active.innerText = 'Adjust';
        function sendUnit(a) {
            socket && gameState && activeUnit && !activeUnit.dontPlace;
            socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            for (var i = 0; i < window.sockets.length; i++) {
                sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            }
        }
    } else if(mode==2){
        mode = 0;
        Active.innerText = 'Simple';
        window.sendUnit = function(a) {
            socket && gameState && activeUnit && !activeUnit.dontPlace;
            socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            for (var i = 0; i < window.sockets.length; i++) {
                sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            }
        }
    };
};
function ChangeUnit(){
    var Active = document.getElementById("UnitStyle");
    if(Active.innerText == 'Duplicate'){
        window.sendUnit = function(a) {
            socket && gameState && activeUnit && !activeUnit.dontPlace;
            socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            socket.emit("1", (Math.PI / 2) - (UTILS.roundToTwo(activeUnitDir) - (Math.PI / 2)), UTILS.roundToTwo(activeUnitDst), a);
            for (var i = 0; i < window.sockets.length; i++) {
                sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
                sockets[i].emit("1", (Math.PI / 2) - (UTILS.roundToTwo(activeUnitDir) - (Math.PI / 2)), UTILS.roundToTwo(activeUnitDst), a);
                console.log(sendUnit(a));
            }
        }
        console.log(function sendUnit(a) {
            socket && gameState && activeUnit && !activeUnit.dontPlace;
            socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            socket.emit("1", (Math.PI / 2) - (UTILS.roundToTwo(activeUnitDir) - (Math.PI / 2)), UTILS.roundToTwo(activeUnitDst), a);
            for (var i = 0; i < window.sockets.length; i++) {
                sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
                sockets[i].emit("1", (Math.PI / 2) - (UTILS.roundToTwo(activeUnitDir) - (Math.PI / 2)), UTILS.roundToTwo(activeUnitDst), a);
                console.log(sendUnit(a));
            }
        });
        sendUnit();
    } else if(Active.innerText == 'Simple'){
        function sendUnit(a) {
            socket && gameState && activeUnit && !activeUnit.dontPlace;
            socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            for (var i = 0; i < window.sockets.length; i++) {
                sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            }
        }
        console.log(function sendUnit(a) {
            socket && gameState && activeUnit && !activeUnit.dontPlace;
            socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            for (var i = 0; i < window.sockets.length; i++) {
                sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
            }
        });
        sendUnit();
    };
};
function juntar3(){
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -1)
}
    function juntar23(){
     var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);
        socket.emit("5", c*1, d*1, e, 0, -1)
    }
   addEventListener("keydown", function(ev) {
        if (ev.keyCode == 16) {
juntar23();
juntar3();
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-3); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-4); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-5); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-6); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-7); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-8); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-9); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-10); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-12); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-13); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-14); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-15); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-16); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-17); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-18); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-19); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-21); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},1900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-22); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-23); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-24); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-25); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-26); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-27); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-28); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-29); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-30); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-31); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},2900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-32); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-33); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-34); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-35); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-36); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-37); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-38); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-39); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-40); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-41); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},3900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-42); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-43); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-44); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-45); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-46); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-47); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-48); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-49); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-50); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-51); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},4900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-52); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-53); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-54); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-55); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-56); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-57); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-58); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-59); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-60); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5800)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-61); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},5900)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-62); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6000)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-63); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6100)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-64); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6200)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-65); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6300)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-66); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6400)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-67); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6500)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-68); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6600)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-69); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6700)
        setTimeout(function(){var c = player.x + targetDst * MathCOS(targetDir) + camX,
    d = player.y + targetDst * MathSIN(targetDir) + camY
        for (var e = [], b = 0; b < Math.floor(selUnits.length-70); ++b) e.push(selUnits[b].id);
        socket.emit("5", c-1, d, e, 0, -1)},6800)
        }
   });




function Timer() {
    var xd = document.createElement('demo');
    var countDownDate = new Date().getTime();
    var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = now - countDownDate;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("demo").innerHTML = "Living Time: <span class='botao'>" + hours + "h " + minutes + "m " + seconds + "s " + "</span>";
    if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "Living Time: Expired, you survived for:" + hours + "h" + minutes + "m" + seconds + "s"
}
}, 1000)
};
iniciarTimer();

function iniciarTimer() {
setTimeout(Timer, 100)
};
window.timelive = function() {
    var xd = document.createElement('demo');
    var countDownDate = new Date().getTime();
    var x = setInterval(function() {
    var now = new Date().getTime();
    var distance = now - countDownDate;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("demo").innerHTML = "Living Time: <span class='botao'>" + hours + "h " + minutes + "m " + seconds + "s " + "</span>";
    if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "Living Time: Expired, you survived for:" + hours + "h" + minutes + "m" + seconds + "s"
}
}, 1000)
};

window.upar = function () {
    var chat = prompt("Oque Deseja Upar?\n1 - Power Plants\n2 - Micro Generators\n3 - Boulders\n4 - Spikes\n5 - AntiTanks\n6 - Greater Barracks\n7 - SemiAuto\n8 - Ranged Turret\n9 - Spotter Turret\n10 - Rapid Turret\n11 - Gatlin Turret");

    if (chat == "1") {/*power plants*/
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

    if (chat == "2"){/*micro generators*/
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

    if (chat == "3") {/*boulders*/
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

    if (chat == "4") {/*spikes*/
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

    if (chat == "5") {/*antitanks*/
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

    if (chat == "6") {/*greater barracks*/
    for(i=0;i<units.length;++i){ if(2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0);}}}

    if (chat == "7") {/*semiauto*/
    for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

    if (chat == "8") {/*ranged turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)}

    if (chat == "9") {/*spotter turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

    if (chat == "10") {/*rapid turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}

    if (chat == "11") {/*gatlin turret*/
    for(i=0;i<units.length;++i)0==units[i].type&&2==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}
};

window.vender = function () {
    var chat = prompt("O que deseja vender?\n1 - Walls\n2 - Generators\n3 - Houses\n4 - Micro Generators\n5 - Boulders\n6 - Spikes\n7 - Sniper Turrets\n8 - Simple Turret\n9 - Barracks\n10 - All");

    if (chat == "1") {/*sell walls*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "2") {/*sell generators*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Generator' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Power Plant' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "3") {/*sell houses*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "4") {/*sell micro generators*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Micro Generator' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "5") {/*sell boulder*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Boulder' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "6") {/*sell spikes*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Spikes' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "7") {/*sell sniper turrets*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Sniper Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Semi-Auto Sniper' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Anti Tank Gun' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "8") {/*sell simple turrets*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Rapid Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Gatlin Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Ranged Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Spotter Turret' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Simple Turret' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "9") {/*sell barracks*/
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Barracks' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Greater Barracks' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Tank Factory' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Siege Factory' && a.push(units[d].id);socket.emit("3", a)
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 2 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Blitz Factory' && a.push(units[d].id);socket.emit("3", a)}

    if (chat == "10") {/*sell all*/
    for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);socket.emit("3", a)
    }
};
window.CE = function () {
    if(player.x==null){player.x==0}
    if(player.y==null){player.y==0}
    for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);
}

window.centralizar = function () {
selecionar1234()
if (selUnits.length == 1) {
        setTimeout(function() {centralizar11();}, 50);
        setTimeout(function() {centralizar1234();}, 18000);
    }

if (selUnits.length == 2) {
        setTimeout(function() {centralizar2();}, 50);
        setTimeout(function() {centralizar1234();}, 24000);
    }
if (selUnits.length == 3) {
        setTimeout(function() {centralizar3();}, 50);
        setTimeout(function() {centralizar31();}, 24000);
    }

if (selUnits.length == 4 || selUnits.length > 4) {
        setTimeout(function() {centralizar1234();}, 50);
        setTimeout(function() {centralizar4();}, 21000);
    }

    function selecionar1234() {
        selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Siege Ram') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }

    function centralizar1234() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);
    }

    function centralizar2() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+40)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-40)*1, e, 0, -1)
    }

    function centralizar3() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)-25)*1, ((player.y)-25)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+25)*1, ((player.y)-25)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+33)*1, e, 0, -1);
    }


    function centralizar31() {
        if(player.x==null){player.x==0}
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)-25)*1, ((player.y)-13)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+25)*1, ((player.y)-13)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+17)*1, e, 0, -1);
    }

    function centralizar4() {
        if(player.x==null){player.x==0 }
        if(player.y==null){player.y==0}
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+40)*1, ((player.y))*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+40)*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id); socket.emit("5", ((player.x)-40)*1, ((player.y))*1, e, 0, -1);
        for (var e = [], b = 0; b < Math.floor(selUnits.length-3); ++b) e.push(selUnits[b].id); socket.emit("5", ((player.x))*1, ((player.y)-40)*1, e, 0, -1); }

    function centralizar11() {
        if(player.x==null){ player.x==0 }
        if(player.y==null){ player.y==0 }
        for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id); socket.emit("5", (player.x), (player.y)-150, e, 0, -1); }
};

window.basesautomaticas = function () {
var bases = prompt("Escolha o número da base que deseja fazer:\n1- Base Full Ataque.\n2- Base Full Ataque GO.\n3- Base Full Ataque com 5 AntiTanks.\n4- Base 4 Sieges.\n5- Base DPK.");

if (bases == "1") {/*Full Atk Tradicional*/
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 295000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 352000); setTimeout(function() {selecionartropas();}, 358000); setTimeout(function() {centralizar3();}, 359000);
function gens1() {socket.emit("1",-1.5532024736165302,243.847739788582,3); socket.emit("1",-0.7357047649976083,243.84981217954626,3); socket.emit("1",-0.4631707810434728,243.85218493997556,3); socket.emit("1",-0.19069612575052558,243.85039122379942,3); socket.emit("1",0.081823242943498,243.84582383137092,3); socket.emit("1",0.3543068427626167,243.84595547189218,3); socket.emit("1",0.6268093323905378,243.84396855366344,3); socket.emit("1",0.8993152888678688,243.84944576520982,3); socket.emit("1",1.1718223321670949,243.85213326932367,3); socket.emit("1",1.4443151477371527,243.84787798953676,3); socket.emit("1",1.7192989793251703,243.85392205170697,3); socket.emit("1",-1.8288944376970422,243.84689971373433,3); socket.emit("1",1.9918103630041337,243.85460668193252,3); socket.emit("1",2.264316448888492,243.84897949345623,3); socket.emit("1",2.5368131007766124,243.85278858360428,3); socket.emit("1",2.8093246351976133,243.84723024877687,3); socket.emit("1",3.0843130098428064,243.8499212630589,3); socket.emit("1",-2.926357644061203,243.84645742761984,3); socket.emit("1",-2.6538811539385643,243.85120319571928,3); socket.emit("1",-2.3788730471629616,243.84483796053584,3); socket.emit("1",-2.1038593986469003,243.85357655773683,3); socket.emit("1",-1.2806671667751037,243.85129320961167,3); socket.emit("1",-1.0081716987983749,243.84706785196326,3); socket.emit("1",1.579987145667095,186.05785820545177,3); socket.emit("1",1.8200377893253108,131.9987878732225,3); socket.emit("1",1.3299885934720075,131.9987367363794,3); socket.emit("1",1.0700140183147795,183.45721926378366,3); socket.emit("1",0.8200112635098129,131.9969037515653,3); socket.emit("1",2.080020169750631,181.88728652657397,3); socket.emit("1",2.339962323692137,131.9988700709214,3); socket.emit("1",2.609997065030747,181.5314595325009,3); socket.emit("1",2.8799849967373223,132.00128673615268,3); socket.emit("1",-3.129973633515593,180.7422001083311,3); socket.emit("1",-2.8600046281491114,131.9987212059268,3); socket.emit("1",0.5500078589016157,181.36809090906803,3); socket.emit("1",0.28000624853648737,132.00094696630012,3); socket.emit("1",0.009993041907008273,181.12904377818583,3); socket.emit("1",-0.2599728532968926,131.99544878517588,3); socket.emit("1",-0.5300137628628261,181.13117705132927,3); socket.emit("1",-0.7999690811162178,132.00256436903035,3); socket.emit("1",-2.590017189612395,181.24926841231655,3); socket.emit("1",-2.320026939739574,131.9970927710153,3); socket.emit("1",-2.039999434196396,181.1243012408882,3); socket.emit("1",-1.0699951440269182,181.07652857286615,3);socket.emit("1", 4.725, 130, 7);}

function base() {socket.emit("1", 4.725, 130, 7); socket.emit("1", 5.245, 130, 4); socket.emit("1", 5.715, 130, 4); socket.emit("1", 6.185, 130, 4); socket.emit("1", 6.655, 130, 4); socket.emit("1", 7.13, 130, 4); socket.emit("1", 7.6, 130, 4); socket.emit("1", 1.85, 130, 4); socket.emit("1", 2.32, 130, 4); socket.emit("1", 2.79, 130, 4); socket.emit("1", 3.265, 130, 4); socket.emit("1", 3.735, 130, 4); socket.emit("1", 4.205, 130, 4); socket.emit("1", 5.06, 185, 4); socket.emit("1", 5.4, 185, 4); socket.emit("1", 5.725, 190, 4); socket.emit("1", 6.045, 186, 4); socket.emit("1", 6.374, 185, 4); socket.emit("1", 6.7215, 189.5, 4); socket.emit("1", 7.0425, 188.5, 4); socket.emit("1", 7.365, 185, 4); socket.emit("1", 7.712, 187.45, 4); socket.emit("1", 8.035, 188.5, 4); socket.emit("1", 8.36, 185, 4); socket.emit("1", 2.425, 188, 4); socket.emit("1", 2.75, 190, 4); socket.emit("1", 3.075, 184, 4); socket.emit("1", 3.42, 186, 4); socket.emit("1", 3.74, 190, 4); socket.emit("1", 4.06, 186, 4); socket.emit("1", 4.39, 185, 4); socket.emit("1", 4.8625, 245, 4); socket.emit("1", 5.1125, 245, 4); socket.emit("1", 5.3625, 245, 4); socket.emit("1", 5.6125, 245, 4); socket.emit("1", 5.8625, 245, 4); socket.emit("1", 6.1125, 245, 4); socket.emit("1", 6.3625, 245, 4); socket.emit("1", 6.6125, 245, 4); socket.emit("1", 6.8625, 245, 4); socket.emit("1", 7.14, 245, 4); socket.emit("1", 7.39, 245, 4); socket.emit("1", 7.64, 246, 4); socket.emit("1", 7.89, 246, 4); socket.emit("1", 8.14, 246, 4); socket.emit("1", 8.39, 246, 4); socket.emit("1", 8.635, 246, 4); socket.emit("1", 8.885, 246, 4); socket.emit("1", 2.5825, 245, 4); socket.emit("1", 2.8625, 245, 4); socket.emit("1", 3.1125, 245, 4); socket.emit("1", 3.3625, 245, 4); socket.emit("1", 3.6125, 245, 4); socket.emit("1", 3.8625, 245, 4); socket.emit("1", 4.1125, 245, 4); socket.emit("1", 4.3625, 245, 4); socket.emit("1", 4.6125, 245, 4);}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 10.07, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);socket.emit("1", 11.93, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upantitank() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-150)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-140)*1, e, 0, -1);}
}

if (bases == "4") {/*Full Siege*/
setTimeout(function(){ gens();},1000); setTimeout(function(){ gens();},10000); setTimeout(function(){ gens();},20000); setTimeout(function(){ gens();},30000); setTimeout(function(){ gens();},50000); setTimeout(function(){ gens();},55000); setTimeout(function(){ house();},65000); setTimeout(function(){ micro();},86000); setTimeout(function(){ barraca();},136000); setTimeout(function(){ vendergens();},206000); setTimeout(function(){ house();},207000); setTimeout(function(){ venderhouse();},284000); setTimeout(function(){ gens();},285000); setTimeout(function(){ siege();},286000); setTimeout(function(){ wall();},287000); setTimeout(function(){ micro();},288000); setTimeout(function(){ power();},294000);
function micro(){for (var i = 0; i < units.length; ++i) 3== units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function vendergens(){for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 0 && units[d].owner == player.sid) { var name = getUnitFromPath(units[d].uPath).name; (name === 'Generator') && a.push(units[d].id)}} socket.emit("3", a)}

function barraca(){for(i=0;i<units.length;++i){ if(2===units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,2);}}}

function venderhouse(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id); socket.emit("3", a);}

function siege(){for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 2 && units[d].owner == player.sid) { var name = getUnitFromPath(units[d].uPath).name; (name === 'Siege Factory') && a.push(units[d].id)}} socket.emit("3", a)}  function wall(){ socket.emit("1",10.07,311,1);}

function gens(){socket.emit("1",4.73,245,3); socket.emit("1",5.0025,245,3); socket.emit("1",5.275,245,3); socket.emit("1",5.5475,245,3); socket.emit("1",5.82,245,3); socket.emit("1",6.0925,245,3); socket.emit("1",6.365,245,3); socket.emit("1",6.6375,245,3); socket.emit("1",6.91,245,3); socket.emit("1",7.1825,245,3); socket.emit("1",7.455,245,3); socket.emit("1",7.7275,245,3); socket.emit("1",8.0025,245,3); socket.emit("1",8.275,245,3); socket.emit("1",8.5475,245,3); socket.emit("1",8.82,245,3); socket.emit("1",9.0925,245,3); socket.emit("1",9.3675,245,3); socket.emit("1",9.64,245,3); socket.emit("1",9.9125,245,3); socket.emit("1",10.1875,245,3); socket.emit("1",10.4625,245,3); socket.emit("1",10.7375,245,3); socket.emit("1",4.5889,186.5,3); socket.emit("1",5.085,180.5,3); socket.emit("1",5.64,180,3); socket.emit("1",5.999,180,3); socket.emit("1",6.51,185,3); socket.emit("1",7.05,185,3); socket.emit("1",7.6,185,3); socket.emit("1",8.15,185,3); socket.emit("1",8.675,185,3); socket.emit("1",9.225,185,3); socket.emit("1",9.78,185,3); socket.emit("1",10.325,185,3); socket.emit("1",4.81,130,3); socket.emit("1",5.36,130,3); socket.emit("1",6.275,130,3); socket.emit("1",6.775,130,3); socket.emit("1",7.3,130,3); socket.emit("1",7.85,130,3); socket.emit("1",8.4,130,3); socket.emit("1",8.925,130,3); socket.emit("1",9.5,130,3); socket.emit("1",10.05,130,3); socket.emit("1",10.6,130,3); }

function house(){socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1);}

function power(){for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
}

if (bases == "3") {/*Full Atk AntiTanks*/
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 295000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {upantitank();}, 303000); setTimeout(function() {upantitank();}, 304000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 352000); setTimeout(function() {selecionartropas();}, 358000); setTimeout(function() {centralizar3();}, 359000);
function gens1() {socket.emit("1",-1.5532024736165302,243.847739788582,3); socket.emit("1",-0.7357047649976083,243.84981217954626,3); socket.emit("1",-0.4631707810434728,243.85218493997556,3); socket.emit("1",-0.19069612575052558,243.85039122379942,3); socket.emit("1",0.081823242943498,243.84582383137092,3); socket.emit("1",0.3543068427626167,243.84595547189218,3); socket.emit("1",0.6268093323905378,243.84396855366344,3); socket.emit("1",0.8993152888678688,243.84944576520982,3); socket.emit("1",1.1718223321670949,243.85213326932367,3); socket.emit("1",1.4443151477371527,243.84787798953676,3); socket.emit("1",1.7192989793251703,243.85392205170697,3); socket.emit("1",-1.8288944376970422,243.84689971373433,3); socket.emit("1",1.9918103630041337,243.85460668193252,3); socket.emit("1",2.264316448888492,243.84897949345623,3); socket.emit("1",2.5368131007766124,243.85278858360428,3); socket.emit("1",2.8093246351976133,243.84723024877687,3); socket.emit("1",3.0843130098428064,243.8499212630589,3); socket.emit("1",-2.926357644061203,243.84645742761984,3); socket.emit("1",-2.6538811539385643,243.85120319571928,3); socket.emit("1",-2.3788730471629616,243.84483796053584,3); socket.emit("1",-2.1038593986469003,243.85357655773683,3); socket.emit("1",-1.2806671667751037,243.85129320961167,3); socket.emit("1",-1.0081716987983749,243.84706785196326,3); socket.emit("1",1.579987145667095,186.05785820545177,3); socket.emit("1",1.8200377893253108,131.9987878732225,3); socket.emit("1",1.3299885934720075,131.9987367363794,3); socket.emit("1",1.0700140183147795,183.45721926378366,3); socket.emit("1",0.8200112635098129,131.9969037515653,3); socket.emit("1",2.080020169750631,181.88728652657397,3); socket.emit("1",2.339962323692137,131.9988700709214,3); socket.emit("1",2.609997065030747,181.5314595325009,3); socket.emit("1",2.8799849967373223,132.00128673615268,3); socket.emit("1",-3.129973633515593,180.7422001083311,3); socket.emit("1",-2.8600046281491114,131.9987212059268,3); socket.emit("1",0.5500078589016157,181.36809090906803,3); socket.emit("1",0.28000624853648737,132.00094696630012,3); socket.emit("1",0.009993041907008273,181.12904377818583,3); socket.emit("1",-0.2599728532968926,131.99544878517588,3); socket.emit("1",-0.5300137628628261,181.13117705132927,3); socket.emit("1",-0.7999690811162178,132.00256436903035,3); socket.emit("1",-2.590017189612395,181.24926841231655,3); socket.emit("1",-2.320026939739574,131.9970927710153,3); socket.emit("1",-2.039999434196396,181.1243012408882,3); socket.emit("1",-1.0699951440269182,181.07652857286615,3);socket.emit("1", 4.725, 130, 7);}

function base() {socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,182,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,244,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4);socket.emit("1",1.5700120132302293,306.00009411763256,1); socket.emit("1",1.1499971718790971,306.0050262659095,1); socket.emit("1",1.9899995192529116,305.9950203843193,1); socket.emit("1",2.4099920661167316,306.0047628714298,1); socket.emit("1",2.61000611306913,305.99628265715904,1); socket.emit("1",2.8099934082207763,305.9999890522873,1); socket.emit("1",0.7300022038482981,305.996084942275,1); socket.emit("1",0.5299892581217004,305.9992753259393,1); socket.emit("1",0.3300076551622989,306.00190473263405,1); socket.emit("1",0.1300054534558023,306.00229623321457,1); socket.emit("1",-0.0699919517952906,305.9992197702471,1); socket.emit("1",-0.27000396268680654,305.99629491220963,1); socket.emit("1",-0.46999051303302675,305.9986418270513,1); socket.emit("1",3.0100021299486968,305.99549833290024,1); socket.emit("1",-3.0699964789961576,306.00395503980013,1); socket.emit("1",-2.8699950543696477,305.9967589697642,1); socket.emit("1",-2.6699945529662017,306.00215750873383,1); socket.emit("1",-2.4700160155011948,306.00059231968817,1); socket.emit("1",-2.2699866427014794,305.99837189109365,1); socket.emit("1",-2.0699943864344963,306.0024766239647,1); socket.emit("1",-0.6699944573743296,305.99938382290907,1); socket.emit("1",-0.8699825064937459,305.9984261397435,1); socket.emit("1",-1.069989043941217,305.9980111046476,1); socket.emit("1",-1.2700052430104105,305.9985999967974,1); socket.emit("1",-1.8700160655604219,305.996405207643,1); socket.emit("1",-1.6700097406586398,306.00481385102427,1); socket.emit("1",-1.470005829354906,306.0029846259674,1);socket.emit("1",1.3600139066101162,310.00109548193535,8);socket.emit("1",1.7799971310165548,309.9988419333208,8);socket.emit("1",2.200019512590295,309.999597580384,8);socket.emit("1",0.940005441020027,309.9950394764407,8);}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 11.93, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.07, 311, 8);socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upantitank() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-150)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-140)*1, e, 0, -1);}
}

if (bases == "5") {/*DPK*/
setTimeout(function(){ gens();},1000); setTimeout(function(){ gens();},12000); setTimeout(function(){ gens();},24000); setTimeout(function(){ upgens();},68000); setTimeout(function(){ upgens();},120000); setTimeout(function(){ turrets();},130000); setTimeout(function(){ upturrets();},156000); setTimeout(function(){ upturrets2();},198000); setTimeout(function(){ walls();},212000); setTimeout(function(){ upwalls();},254000); setTimeout(function(){ upwalls2();},375000); setTimeout(function(){ commander();},408000);
function gens(){for(i=-3.14;i<=3.14;i+=0.5233){ socket.emit("1",i,132,3); }for(i=-2.965;i<=3.14;i+=0.3488){ socket.emit("1",i,243.85,3); }}

function upgens(){for(i=0;i<units.length;++i){ if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function turrets(){for(i=-3.14;i<=3.14;i+=0.3488){ socket.emit("1",i,194,2); }}

function upturrets(){for(i=0;i<units.length;++i){ if(0===units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,1); } }}

function upturrets2(){for(i=0;i<units.length;++i){ if(0===units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function walls(){for(i=-3.14;i<3.14;i+=0.216){ socket.emit("1",i,1e3,1); }}

function upwalls(){for(i=0;i<units.length;++i){ if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function upwalls2(){for(i=0;i<units.length;++i){ if(3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function commander(){socket.emit("4",0,0,1);}
}

if (bases == "2") {/*Full Atk GO*/
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 260000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 360000); setTimeout(function() {selecionartropas();}, 366000); setTimeout(function() {centralizar3();}, 367000);
function gens1() {socket.emit("1",1.5532024736165302,243.847739788582,3); socket.emit("1",0.7357047649976083,243.84981217954626,3); socket.emit("1",0.4631707810434728,243.85218493997556,3); socket.emit("1",0.19069612575052558,243.85039122379942,3); socket.emit("1",-0.081823242943498,243.84582383137092,3); socket.emit("1",-0.3543068427626167,243.84595547189218,3); socket.emit("1",-0.6268093323905378,243.84396855366344,3); socket.emit("1",-0.8993152888678688,243.84944576520982,3); socket.emit("1",-1.1718223321670949,243.85213326932367,3); socket.emit("1",-1.4443151477371527,243.84787798953676,3); socket.emit("1",-1.7192989793251703,243.85392205170697,3); socket.emit("1",1.8288944376970422,243.84689971373433,3); socket.emit("1",-1.9918103630041337,243.85460668193252,3); socket.emit("1",-2.264316448888492,243.84897949345623,3); socket.emit("1",-2.5368131007766124,243.85278858360428,3); socket.emit("1",-2.8093246351976133,243.84723024877687,3); socket.emit("1",-3.0843130098428064,243.8499212630589,3); socket.emit("1",2.926357644061203,243.84645742761984,3); socket.emit("1",2.6538811539385643,243.85120319571928,3); socket.emit("1",2.3788730471629616,243.84483796053584,3); socket.emit("1",2.1038593986469003,243.85357655773683,3); socket.emit("1",1.2806671667751037,243.85129320961167,3); socket.emit("1",1.0081716987983749,243.84706785196326,3); socket.emit("1",-1.579987145667095,186.05785820545177,3); socket.emit("1",-1.8200377893253108,131.9987878732225,3); socket.emit("1",-1.3299885934720075,131.9987367363794,3); socket.emit("1",-1.0700140183147795,183.45721926378366,3); socket.emit("1",-0.8200112635098129,131.9969037515653,3); socket.emit("1",-2.080020169750631,181.88728652657397,3); socket.emit("1",-2.339962323692137,131.9988700709214,3); socket.emit("1",-2.609997065030747,181.5314595325009,3); socket.emit("1",-2.8799849967373223,132.00128673615268,3); socket.emit("1",3.129973633515593,180.7422001083311,3); socket.emit("1",2.8600046281491114,131.9987212059268,3); socket.emit("1",-0.5500078589016157,181.36809090906803,3); socket.emit("1",-0.28000624853648737,132.00094696630012,3); socket.emit("1",-0.009993041907008273,181.12904377818583,3); socket.emit("1",0.2599728532968926,131.99544878517588,3); socket.emit("1",0.5300137628628261,181.13117705132927,3); socket.emit("1",0.7999690811162178,132.00256436903035,3); socket.emit("1",2.590017189612395,181.24926841231655,3); socket.emit("1",2.320026939739574,131.9970927710153,3); socket.emit("1",2.039999434196396,181.1243012408882,3); socket.emit("1",1.0699951440269182,181.07652857286615,3); socket.emit("1", -4.70, 130, 7);}

function base() {socket.emit("1", -4.70, 130, 7);socket.emit("1", 1.71, 245.85, 4),socket.emit("1", 1.46, 245.85, 4),socket.emit("1", 1.96, 245.85, 4),socket.emit("1", 1.21, 245.85, 4),socket.emit("1", 2.21, 245.85, 4),socket.emit("1", 0.96, 245.85, 4),socket.emit("1", 2.46, 245.85, 4),socket.emit("1", 0.71, 245.85, 4),socket.emit("1", 0.46, 245.85, 4),socket.emit("1", 2.71, 245.85, 4),socket.emit("1", 2.96, 245.85, 4),socket.emit("1", 0.21, 245.85, 4),socket.emit("1", -3.07, 245.85, 4),socket.emit("1", -0.04, 245.85, 4),socket.emit("1", -0.29, 245.85, 4),socket.emit("1", -2.82, 245.85, 4),socket.emit("1", -2.57, 245.85, 4),socket.emit("1", -0.54, 245.85, 4),socket.emit("1", -2.32, 245.85, 4),socket.emit("1", -0.79, 245.85, 4),socket.emit("1", -2.07, 245.85, 4),socket.emit("1", -1.04, 245.85, 4),socket.emit("1", -1.82, 245.85, 4),socket.emit("1", -1.29, 245.85, 4),socket.emit("1",4.7280,245,4),socket.emit("1", 2.58, 190.7, 4),socket.emit("1", 0.59, 190.45, 4),socket.emit("1", -2.72, 189.71, 4),socket.emit("1", -0.39, 189.71, 4),socket.emit("1", -1.39, 189.09, 4),socket.emit("1", -1.73, 188.48, 4),socket.emit("1", -2.4, 187.66, 4),socket.emit("1", -0.71, 187.46, 4),socket.emit("1", 0.91, 186.12, 4),socket.emit("1", 0.27, 186.2, 4),socket.emit("1", 2.9, 186.15, 4),socket.emit("1", 2.26, 185.87, 4),socket.emit("1", -3.05, 185.31, 4),socket.emit("1", -0.06, 185.8, 4),socket.emit("1", -2.07, 185.43, 4),socket.emit("1", 1.24, 184.2, 4),socket.emit("1", -1.04, 184.09, 4),socket.emit("1", 1.93, 183.65, 4),socket.emit("1",-4.70,130,7),socket.emit("1", 2.11, 130, 4),socket.emit("1", 1.06, 130, 4),socket.emit("1", 2.58, 130, 4),socket.emit("1", 0.59, 130, 4),socket.emit("1", 3.05, 130, 4),socket.emit("1", 0.12, 130, 4),socket.emit("1", -2.76, 130, 4),socket.emit("1", -0.35, 130, 4),socket.emit("1", -0.83, 130, 4),socket.emit("1", -2.29, 130, 4),socket.emit("1", -1.82, 130, 4),socket.emit("1", -1.3, 130, 4)}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 10.07, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);socket.emit("1", 11.93, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+35)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+140)*1, e, 0, -1);}
}
 if (bases !== "1" && bases !== "2" && bases !== "3" && bases !== "4" && bases !== "5") {
     alert('Número de Base Inexistente!')}
};

window.party = function() {
    alert("http://bloble.io/?l=" + partyKey)
};
window.autogens = function () {
   var abcdd = document.getElementById('auto2');
   if (autoos) {
   autoos = false;
   abcdd.innerHTML = 'Auto Generators: <span class="botao">Off</span>';
   clearInterval(teste1);
   } else {
   autoos = true;
   abcdd.innerHTML = 'Auto Generators: <span class="botao">On</span>';
   window.teste1 = setInterval(autogens, 1000);
   function autogens() {
   socket.emit("1",1.5700171594315573,243.85007402090326,3); socket.emit("1",2.4400100710526793,196.79985467474305,3); socket.emit("1",2.2400039007898447,243.85656849877958,3); socket.emit("1",-2.7800023458624703,194.6788252481507,3); socket.emit("1",1.9699911201667188,243.85313366860794,3); socket.emit("1",2.0999878201715214,185.58517209087591,3); socket.emit("1",1.8700025978863808,132.00487756139935,3); socket.emit("1",1.2599938029024704,132.00454272486235,3); socket.emit("1",1.3800278697318928,194.13178049974198,3); socket.emit("1",1.7600061169825598,194.06341746965091,3); socket.emit("1",-2.4400027616849433,185.75130282181078,3); socket.emit("1",-2.1999936469647867,131.99750300668575,3); socket.emit("1",-2.5899833434664847,243.84680949317334,3); socket.emit("1",3.0599865137335724,131.9992848465475,3); socket.emit("1",2.3700155322992322,132.00115908582003,3); socket.emit("1",2.7699990995853443,180.63860107961412,3); socket.emit("1",2.910001829109119,243.8501927413633,3); socket.emit("1",2.6399909192202835,243.84888476267423,3); socket.emit("1",3.1100150743706907,196.05774072961268,3); socket.emit("1",-2.9699920613329622,243.85151732150447,3); socket.emit("1",-2.690040409174835,132.00027613607475,3); socket.emit("1",-2.3099851374683826,243.85151732150447,3); socket.emit("1",-2.0399825212769436,243.85142525726602,3); socket.emit("1",-1.7700175093099535,243.85316996094184,3); socket.emit("1",0.7600044161827382,132.00282572733062,3); socket.emit("1",0.35996640663856383,180.10304605974878,3); socket.emit("1",0.029980358323314006,197.1585985951411,3); socket.emit("1",-0.439963547142766,132.00080795207285,3); socket.emit("1",0.0800082011395776,132.0022685411125,3); socket.emit("1",0.22998938484625386,243.85088271318605,3); socket.emit("1",0.5000045603394669,243.85230796529285,3); socket.emit("1",0.7000201471114224,196.1091423162112,3); socket.emit("1",0.8999878082444033,243.84691201653544,3); socket.emit("1",1.0399986494012126,186.08457861950842,3); socket.emit("1",1.170002238251199,243.8551629553904,3); socket.emit("1",-0.170023102819992,243.84605081895415,3); socket.emit("1",-0.36001357695289626,194.92632916053194,3); socket.emit("1",-0.7000068138510656,183.7252296229344,3); socket.emit("1",-1.3600094643934062,243.84717119540267,3); socket.emit("1",-1.0899817628353876,243.84783862072678,3); socket.emit("1",-0.5500054440958607,243.85303709406625,3); socket.emit("1",-0.8199991749608286,243.85031002645857,3); socket.emit("1",-1.9300228177358634,182.30682104627905,3); socket.emit("1",-1.199997990229862,183.82290662482725,3); socket.emit("1",-0.9500096278543927,131.99805036438974,3); socket.emit("1",-1.5699815385655684,196.37006518306183,3); socket.emit("1",-1.5699629936544652,132.00004583332537,3);
}};
   window.statusBar();
   return autoos;
}

window.autopower = function () {
   var abce = document.getElementById('auto4');
   if (auto4) {
   auto4 = false;
   abce.innerHTML = 'Auto Power Plants: <span class="botao">Off</span>';
   clearInterval(teste4);
   } else {
   auto4 = true;
   abce.innerHTML = 'Auto Power Plants: <span class="botao">On</span>';
   window.teste4 = setInterval(autopower, 1000);
   function autopower() {
   for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}};
   window.statusBar();
   return auto4;
}

window.materiais = function () {
   var ab = document.getElementById('auto3');
   if (material) {
   material = false;
   ab.innerHTML = 'Auto Spikes: <span class="botao">Off</span>';
   clearInterval(teste2)
   } else {
   material = true;
   ab.innerHTML = 'Auto Spikes: <span class="botao">On</span>';
   window.teste2 = setInterval(spikes, 100);
   function spikes() {
   for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);
   for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);
}};
   window.statusBar();
   return material;
}

/*var blabla = prompt('Digite a senha:');
while (blabla !== "1qwe2asd") {
blabla = prompt('Digite a senha:');
}
*/

window.autocommander = function () {
   var abcf = document.getElementById('auto');
   if (auto5) {
   auto5 = false;
   abcf.innerHTML = 'Auto Commander: <span class="botao">Off</span>';
   clearInterval(teste3);
   } else {
   auto5 = true;
   abcf.innerHTML = 'Auto Commander: <span class="botao">On</span>';
   window.teste3 = setInterval(commander, 1000);
   function commander() {
   socket.emit("4",0,0,1)
}};
   window.statusBar();
   return auto5;
}

window.floodao = function () {
   var abcg = document.getElementById('floo');
   if (auto6) {
   auto6 = false;
   abcg.innerHTML = 'Auto Flood: <span class="botao">Off</span>';
   clearInterval(flood);
   } else {
   auto6 = true;
   abcg.innerHTML = 'Auto Flood: <span class="botao">On</span>';
   window.flood = setInterval(floodaoo, 50);
   var x = prompt("Digite a frase para flodar: ");
   function floodaoo() {
   socket.emit("ch",x);
   socket.emit("ch",x);
   socket.emit("ch",x);
   socket.emit("ch",x);
}};
   window.statusBar();
   return auto6;
}
cid = UTILS.getUniqueID();
localStorage.setItem("cid",cid);

window.BOT2 = function () {
   var bots = prompt("quantidade de bot")
   for (let i = 0; i < bots; i++) {
   window.open("http://bloble.io/?1="+partyKey)
}}


window.musicas = function () {
var chat = prompt("Quer Escutar Música?\n1-Lonely\n2-Alok\n3-Two\n4-Beliver\n5-Alan Walker- Cansado\n6-Panic! At the Disco - High Hopes\n7-Radioactive\n8-Titanium ");
if (chat == "1") {
   window.open("https://www.youtube.com/watch?v=6EEW-9NDM5k")}
if (chat == "2") {
   window.open("https://www.youtube.com/watch?v=bPFT4YKLzMg")}
if (chat == "3") {
   window.open("https://www.youtube.com/watch?v=HbuVy2i4S_Q")}
if (chat == "4") {
   window.open("https://www.youtube.com/watch?v=IhP3J0j9JmY")}
if (chat == "5") {
   window.open("https://www.youtube.com/watch?v=wIbVkKB4XqU")}
if (chat == "6") {
   window.open("https://www.youtube.com/watch?v=IPXIgEAGe4U")}
if (chat == "7") {
   window.open("https://www.youtube.com/watch?v=ktvTqknDobU")}
if (chat == "8") {
   window.open("https://www.youtube.com/watch?v=JRfuAukYTKg")}
}

window.bug = function () {
    alert("𝐁𝐚𝐫𝐫𝐚𝐜𝐤𝐬 𝐁𝐮𝐠 : First we put 3 barracks. Then we bring another commando to the distance where we can put barracks and we try to kill the commando by putting the barracks and when the commando dies, it becomes a bug.\n𝐁𝐮𝐠 𝐓𝐚𝐧𝐤𝐬 : You send the tanks to the enemy commando in turn and you kill the tanks one by one with the commando, and after a while we can see that the number of tanks has increased. (If you are lazy to send tanks, you can use the Bug Tank).\n𝐏𝐨𝐢𝐧𝐭 𝐁𝐮𝐠 : First, by making a bug tank, you increase the approximate number of tanks to 80. Then you gather all the tanks in one place and enter a base with all the tanks at the same time, with a base score of more than 120k, and your score suddenly increases by a great amount.");
};

window.autodefense7 = function () {
   var abct = document.getElementById('auto10');
   if (auto3) {
   auto3 = false;
   abct.innerHTML = 'Auto Defend: <span class="botao">Off</span>';
   clearInterval(teste3);
   } else {
   auto3 = true;
   abct.innerHTML = 'Auto Defend: <span class="botao">On</span>';
   window.teste3 = setInterval(autodefesa7, 150);
   function autodefesa7() {
        for(var i=0;i<loadedBase.length;i++){
             var building = loadedBase[i];
             socket.emit("1",building.dir,building.dst,1);
        }}};
   window.statusBar();
   return auto3;
}

window.autobuild = function () {
   var abctq = document.getElementById('build');
   if (build) {
   build = false;
   abctq.innerHTML = 'Auto Base: <span class="botao">Off</span>';
   clearInterval(teste10);
   } else {
   build = true;
   abctq.innerHTML = 'Auto Base: <span class="botao">On</span>';
   window.teste10 = setInterval(autodefesa10, 150);
   function autodefesa10() {
   for(var i=0;i<loadedBase.length;i++){var building = loadedBase[i];socket.emit("1",building.dir,building.dst,building.uPath[0])}};
   window.statusBar();
   return build;
}}

window.inverter = function () {
var giro = prompt("Digite:\n1 Para inverter base para baixo.\n2 Para inverter para a direita.\n3 Para inverter para a esquerda.\n4 Para mantê-la normal.");
        if (giro == "1"){
        socket.emit("1", (7.86)+3.14, 311, 1); socket.emit("1", (8.06)+3.14, 311, 1); socket.emit("1", (8.26)+3.14, 311, 1); socket.emit("1", (8.46)+3.14, 311, 1); socket.emit("1", (8.66)+3.14, 311, 1); socket.emit("1", (8.86)+3.14, 311, 1); socket.emit("1", (9.06)+3.14, 311, 1); socket.emit("1", (9.26)+3.14, 311, 1); socket.emit("1", (9.46)+3.14, 311, 1); socket.emit("1", (9.66)+3.14, 311, 1); socket.emit("1", (9.86)+3.14, 311, 1); socket.emit("1", (10.28)+3.14, 311, 1); socket.emit("1", (10.70)+3.14, 311, 1); socket.emit("1", (10.90)+3.14, 311, 1); socket.emit("1", (11.10)+3.14, 311, 1); socket.emit("1", (11.30)+3.14, 311, 1); socket.emit("1", (11.72)+3.14, 311, 1); socket.emit("1", (12.14)+3.14, 311, 1); socket.emit("1", (12.34)+3.14, 311, 1); socket.emit("1", (12.54)+3.14, 311, 1); socket.emit("1", (12.74)+3.14, 311, 1); socket.emit("1", (12.94)+3.14, 311, 1); socket.emit("1", (11.57)+3.14, 311, 1); socket.emit("1", (13.14)+3.14, 311, 1); socket.emit("1", (13.34)+3.14, 311, 1); socket.emit("1", (13.54)+3.14, 311, 1); socket.emit("1", (13.74)+3.14, 311, 1); socket.emit("1", (13.94)+3.14, 311, 1); socket.emit("1", (10.49)+3.14, 311, 8); socket.emit("1", (11.51)+3.14, 311, 8); socket.emit("1", (11.93)+3.14, 311, 8); socket.emit("1", (10.07)+3.14, 311, 8);}
        if (giro == "2"){
        socket.emit("1", (7.86)+1.57, 311, 1); socket.emit("1", (8.06)+1.57, 311, 1); socket.emit("1", (8.26)+1.57, 311, 1); socket.emit("1", (8.46)+1.57, 311, 1); socket.emit("1", (8.66)+1.57, 311, 1); socket.emit("1", (8.86)+1.57, 311, 1); socket.emit("1", (9.06)+1.57, 311, 1); socket.emit("1", (9.26)+1.57, 311, 1); socket.emit("1", (9.46)+1.57, 311, 1); socket.emit("1", (9.66)+1.57, 311, 1); socket.emit("1", (9.86)+1.57, 311, 1); socket.emit("1", (10.28)+1.57, 311, 1); socket.emit("1", (10.70)+1.57, 311, 1); socket.emit("1", (10.90)+1.57, 311, 1); socket.emit("1", (11.10)+1.57, 311, 1); socket.emit("1", (11.30)+1.57, 311, 1); socket.emit("1", (11.72)+1.57, 311, 1); socket.emit("1", (12.14)+1.57, 311, 1); socket.emit("1", (12.34)+1.57, 311, 1); socket.emit("1", (12.54)+1.57, 311, 1); socket.emit("1", (12.74)+1.57, 311, 1); socket.emit("1", (12.94)+1.57, 311, 1); socket.emit("1", (11.57)+1.57, 311, 1); socket.emit("1", (13.14)+1.57, 311, 1); socket.emit("1", (13.34)+1.57, 311, 1); socket.emit("1", (13.54)+1.57, 311, 1); socket.emit("1", (13.74)+1.57, 311, 1); socket.emit("1", (13.94)+1.57, 311, 1); socket.emit("1", (10.49)+1.57, 311, 8); socket.emit("1", (11.51)+1.57, 311, 8); socket.emit("1", (11.93)+1.57, 311, 8); socket.emit("1", (10.07)+1.57, 311, 8);}
        if (giro == "3"){
        socket.emit("1", (7.86)+4.71, 311, 1); socket.emit("1", (8.06)+4.71, 311, 1); socket.emit("1", (8.26)+4.71, 311, 1); socket.emit("1", (8.46)+4.71, 311, 1); socket.emit("1", (8.66)+4.71, 311, 1); socket.emit("1", (8.86)+4.71, 311, 1); socket.emit("1", (9.06)+4.71, 311, 1); socket.emit("1", (9.26)+4.71, 311, 1); socket.emit("1", (9.46)+4.71, 311, 1); socket.emit("1", (9.66)+4.71, 311, 1); socket.emit("1", (9.86)+4.71, 311, 1); socket.emit("1", (10.28)+4.71, 311, 1); socket.emit("1", (10.70)+4.71, 311, 1); socket.emit("1", (10.90)+4.71, 311, 1); socket.emit("1", (11.10)+4.71, 311, 1); socket.emit("1", (11.30)+4.71, 311, 1); socket.emit("1", (11.72)+4.71, 311, 1); socket.emit("1", (12.14)+4.71, 311, 1); socket.emit("1", (12.34)+4.71, 311, 1); socket.emit("1", (12.54)+4.71, 311, 1); socket.emit("1", (12.74)+4.71, 311, 1); socket.emit("1", (12.94)+4.71, 311, 1); socket.emit("1", (14.71)+4.71, 311, 1); socket.emit("1", (13.14)+4.71, 311, 1); socket.emit("1", (13.34)+4.71, 311, 1); socket.emit("1", (13.54)+4.71, 311, 1); socket.emit("1", (13.74)+4.71, 311, 1); socket.emit("1", (13.94)+4.71, 311, 1); socket.emit("1", (10.49)+4.71, 311, 8); socket.emit("1", (11.51)+4.71, 311, 8); socket.emit("1", (11.93)+4.71, 311, 8); socket.emit("1", (10.07)+4.71, 311, 8);}
        if (giro == "4"){
        socket.emit("1", (7.86)+0, 311, 1); socket.emit("1", (8.06)+0, 311, 1); socket.emit("1", (8.26)+0, 311, 1); socket.emit("1", (8.46)+0, 311, 1); socket.emit("1", (8.66)+0, 311, 1); socket.emit("1", (8.86)+0, 311, 1); socket.emit("1", (9.06)+0, 311, 1); socket.emit("1", (9.26)+0, 311, 1); socket.emit("1", (9.46)+0, 311, 1); socket.emit("1", (9.66)+0, 311, 1); socket.emit("1", (9.86)+0, 311, 1); socket.emit("1", (10.28)+0, 311, 1); socket.emit("1", (10.70)+0, 311, 1); socket.emit("1", (10.90)+0, 311, 1); socket.emit("1", (11.10)+0, 311, 1); socket.emit("1", (11.30)+0, 311, 1); socket.emit("1", (11.72)+0, 311, 1); socket.emit("1", (12.14)+0, 311, 1); socket.emit("1", (12.34)+0, 311, 1); socket.emit("1", (12.54)+0, 311, 1); socket.emit("1", (12.74)+0, 311, 1); socket.emit("1", (12.94)+0, 311, 1); socket.emit("1", (14.71)+0, 311, 1); socket.emit("1", (13.14)+0, 311, 1); socket.emit("1", (13.34)+0, 311, 1); socket.emit("1", (13.54)+0, 311, 1); socket.emit("1", (13.74)+0, 311, 1); socket.emit("1", (13.94)+0, 311, 1); socket.emit("1", (10.49)+0, 311, 8); socket.emit("1", (11.51)+0, 311, 8); socket.emit("1", (11.93)+0, 311, 8); socket.emit("1", (10.07)+0, 311, 8);}
        if (giro !== "1" && giro !== "2" && giro !== "3" && giro !== "4") {
        alert('Não foi possível colocar a base!')}
}


window.inverter2 = function () {
var giro2 = prompt("Digite:\n1 Para inverter base para baixo.\n2 Para inverter para a direita.\n3 Para inverter para a esquerda.\n4 Para mantê-la normal.");
    for(var i=0;i<loadedBase.length;i++){
        var building = loadedBase[i];
      if (giro2 == "1"){
        socket.emit("1", (building.dir)+3.14, building.dst, building.uPath[0]);}
      if (giro2 == "2"){
        socket.emit("1", (building.dir)+1.57, building.dst, building.uPath[0]);}
      if (giro2 == "3"){
        socket.emit("1", (building.dir)+4.71, building.dst, building.uPath[0]);}
      if (giro2 == "4"){
        socket.emit("1", (building.dir), building.dst, building.uPath[0]);}
    }
}

window.skin = function () {
   var abce = document.getElementById('skin');
   if (skins1) {
   skins1 = false;
   abce.innerHTML = 'Skins: <span class="botao">On</span>';
   function httpGetAsync(theUrl, callback) {
   var xmlHttp = new XMLHttpRequest();
   xmlHttp.onreadystatechange = function() {
   if (xmlHttp.readyState == 4)
   callback(xmlHttp.status == 200 ? xmlHttp.responseText : false);
}
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}
    var customSkins = [];
    httpGetAsync("https://andrewprivate.github.io/skins/skinlist", (b) => {
    if (b) {
    b = b.split('\n').filter((l) => {
    return l
});
    b.forEach((skin, i) => {
    customSkins.push(skin);
     })
   }
})

window.renderPlayer = function(a, d, c, b, g) {
    b.save();
    if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
        var e = new Image;
        e.onload = function() {
        this.readyToDraw = !0;
        this.onload = null;
        g == currentSkin && changeSkin(0)
};
        e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
        skinSprites[a.skin] = e
 } else if (customSkins.length && a && a.name) {
     if (!a.resolvedSkin) {
        a.resolvedSkin = true;
     if (a.name[0] === ':') {
        var match = a.name.match(/(?:\:([0-9]*))(.*)/);
     if (match[1]) {
         a.name = match[2].length ? match[2] : "unknown";
         a.customSkin = parseInt(match[1]);
      }
   }
}
     if (a.customSkin !== undefined && customSkins[a.customSkin]) {
       var ind = a.customSkin + playerSkins + 1
     if (!skinSprites[ind]) {
       var e = new Image;
           e.onload = function() {
           this.readyToDraw = !0;
           this.onload = null;
}
           e.onerror = function() {
           this.onerror = null;
     if (skinSprites[ind] !== false) {
           setTimeout(function() {
           skinSprites[ind] = false;
      }, 1000)
   }
}
           e.src = "https://andrewprivate.github.io/skins/" + customSkins[a.customSkin] + ".png";
           skinSprites[ind] = e
}
      if (skinSprites[ind].readyToDraw) {
           e = a.size - b.lineWidth / 4
           b.save()
           b.lineWidth /= 2
           renderCircle(d, c, a.size, b, !1, !0)
           b.clip()
           b.drawImage(skinSprites[ind], d - e, c - e, 2 * e, 2 * e)
           b.restore();
           return;
    }
  }
}
    a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.drawImage(skinSprites[a.skin], d - e, c - e, 2 * e, 2 * e), b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = playerColors[a.color], renderCircle(d,
    c, a.size, b));
    b.restore()
}
   } else {
   skins1 = true;
   abce.innerHTML = 'Skins: <span class="botao">Off</span>';;
   window.renderPlayer = function(a, d, c, b, g) {
   b.save();
   if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {
   var e = new Image;
   e.onload = function() {
   this.readyToDraw = !0;
   this.onload = null;
   g == currentSkin && changeSkin(0);
};
   e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";
   skinSprites[a.skin] = e;
}
  a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));
  b.restore();
}
};
  window.statusBar();
  return skins1;
}

/*KEYCODE*/
window.addEventListener("keydown", function(a) {
    a = a.keyCode ? a.keyCode : a.which;

       if (a === 69) {/*Commander e soldiers*/
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); unit.info.name !== 'Siege Ram' && selUnits.push(unit)  } });  selUnitType = "Unit";

} else if (a === 67) {/*Commander*/
     selUnits = []; units.every((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Commander') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit";

} else if (a === 81) {/*Soldier*/
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Soldier') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }
});



addEventListener("keydown", function(a){

if (a.keyCode == 33) {/*Full Houses And AntiTanks*/
   socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,183,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,246,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8); }

if (a.keyCode == 34) {/*Defend Full Houses and AntiTanks*/
   socket.emit("1",4.725,130,1); socket.emit("1",3.985,183,1); socket.emit("1",5.475,183,1); socket.emit("1",6.47,184,1); socket.emit("1",7.85,186,1); socket.emit("1",9.26,183,1); socket.emit("1",5.245,130,1); socket.emit("1",5.725,130,1); socket.emit("1",6.205,130,1); socket.emit("1",6.675,130,1); socket.emit("1",7.145,130,1); socket.emit("1",7.615,130,1); socket.emit("1",8.085,130,1); socket.emit("1",8.555,130,1); socket.emit("1",9.025,130,1); socket.emit("1",3.225,130,1); socket.emit("1",9.975,130,1); socket.emit("1",10.485,130,1); socket.emit("1",4.72,210,1); socket.emit("1",5.06,185,1); socket.emit("1",5.81,189,1); socket.emit("1",6.13,190,1); socket.emit("1",6.81,187,1); socket.emit("1",7.13,191,1); socket.emit("1",7.45,185,1); socket.emit("1",8.25,185,1); socket.emit("1",8.6,190,1); socket.emit("1",8.92,189,1); socket.emit("1",9.6,189,1); socket.emit("1",9.925,190,1); socket.emit("1",4.39,185,1); socket.emit("1",4.94,246,1); socket.emit("1",5.1875,246,1); socket.emit("1",5.435,246,1); socket.emit("1",5.685,246,1); socket.emit("1",5.935,246,1); socket.emit("1",6.24,246,1); socket.emit("1",6.49,246,1); socket.emit("1",6.74,246,1); socket.emit("1",6.99,246,1); socket.emit("1",7.25,246,1); socket.emit("1",7.5,246,1); socket.emit("1",7.75,246,1); socket.emit("1",8,246,1); socket.emit("1",8.25,246,1); socket.emit("1",8.5,246,1); socket.emit("1",8.75,246,1); socket.emit("1",9.01,246,1); socket.emit("1",9.26,246,1); socket.emit("1",9.51,246,1); socket.emit("1",9.76,246,1); socket.emit("1",10.03,246,1); socket.emit("1",4,246,1); socket.emit("1",4.25,246,1); socket.emit("1",4.5,246,1); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,1); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1); }


if(a.keyCode == 120){/*Full Gens*/
   socket.emit("1", 1.5700171594315573, 243.85007402090326, 3); socket.emit("1", 2.4400100710526793, 196.79985467474305, 3); socket.emit("1", 2.2400039007898447, 243.85656849877958, 3); socket.emit("1", -2.7800023458624703, 194.6788252481507, 3); socket.emit("1", 1.9699911201667188, 243.85313366860794, 3); socket.emit("1", 2.0999878201715214, 185.58517209087591, 3); socket.emit("1", 1.8700025978863808, 132.00487756139935, 3); socket.emit("1", 1.2599938029024704, 132.00454272486235, 3); socket.emit("1", 1.3800278697318928, 194.13178049974198, 3); socket.emit("1", 1.7600061169825598, 194.06341746965091, 3); socket.emit("1", -2.4400027616849433, 185.75130282181078, 3); socket.emit("1", -2.1999936469647867, 131.99750300668575, 3); socket.emit("1", -2.5899833434664847, 243.84680949317334, 3); socket.emit("1", 3.0599865137335724, 131.9992848465475, 3); socket.emit("1", 2.3700155322992322, 132.00115908582003, 3); socket.emit("1", 2.7699990995853443, 180.63860107961412, 3); socket.emit("1", 2.910001829109119, 243.8501927413633, 3); socket.emit("1", 2.6399909192202835, 243.84888476267423, 3); socket.emit("1", 3.1100150743706907, 196.05774072961268, 3); socket.emit("1", -2.9699920613329622, 243.85151732150447, 3); socket.emit("1", -2.690040409174835, 132.00027613607475, 3); socket.emit("1", -2.3099851374683826, 243.85151732150447, 3); socket.emit("1", -2.0399825212769436, 243.85142525726602, 3); socket.emit("1", -1.7700175093099535, 243.85316996094184, 3); socket.emit("1", 0.7600044161827382, 132.00282572733062, 3); socket.emit("1", 0.35996640663856383, 180.10304605974878, 3); socket.emit("1", 0.029980358323314006, 197.1585985951411, 3); socket.emit("1", -0.439963547142766, 132.00080795207285, 3); socket.emit("1", 0.0800082011395776, 132.0022685411125, 3); socket.emit("1", 0.22998938484625386, 243.85088271318605, 3); socket.emit("1", 0.5000045603394669, 243.85230796529285, 3); socket.emit("1", 0.7000201471114224, 196.1091423162112, 3); socket.emit("1", 0.8999878082444033, 243.84691201653544, 3); socket.emit("1", 1.0399986494012126, 186.08457861950842, 3); socket.emit("1", 1.170002238251199, 243.8551629553904, 3); socket.emit("1", -0.170023102819992, 243.84605081895415, 3); socket.emit("1", -0.36001357695289626, 194.92632916053194, 3); socket.emit("1", -0.7000068138510656, 183.7252296229344, 3); socket.emit("1", -1.3600094643934062, 243.84717119540267, 3); socket.emit("1", -1.0899817628353876, 243.84783862072678, 3); socket.emit("1", -0.5500054440958607, 243.85303709406625, 3); socket.emit("1", -0.8199991749608286, 243.85031002645857, 3); socket.emit("1", -1.9300228177358634, 182.30682104627905, 3); socket.emit("1", -1.199997990229862, 183.82290662482725, 3); socket.emit("1", -0.9500096278543927, 131.99805036438974, 3); socket.emit("1", -1.5699815385655684, 196.37006518306183, 3); socket.emit("1", -1.5699629936544652, 132.00004583332537, 3);}

if(a.keyCode == 121){/*Defesa Full Gens*/
   socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,1); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1); socket.emit("1", 1.5700171594315573, 243.85007402090326, 1); socket.emit("1", 2.4400100710526793, 196.79985467474305, 1); socket.emit("1", 2.2400039007898447, 243.85656849877958, 1); socket.emit("1", -2.7800023458624703, 194.6788252481507, 1); socket.emit("1", 1.9699911201667188, 243.85313366860794, 1); socket.emit("1", 2.0999878201715214, 185.58517209087591, 1); socket.emit("1", 1.8700025978863808, 132.00487756139935, 1); socket.emit("1", 1.2599938029024704, 132.00454272486235, 1); socket.emit("1", 1.3800278697318928, 194.13178049974198, 1); socket.emit("1", 1.7600061169825598, 194.06341746965091, 1); socket.emit("1", -2.4400027616849433, 185.75130282181078, 1); socket.emit("1", -2.1999936469647867, 131.99750300668575, 1); socket.emit("1", -2.5899833434664847, 243.84680949317334, 1); socket.emit("1", 3.0599865137335724, 131.9992848465475, 1); socket.emit("1", 2.3700155322992322, 132.00115908582003, 1); socket.emit("1", 2.7699990995853443, 180.63860107961412, 1); socket.emit("1", 2.910001829109119, 243.8501927413633, 1); socket.emit("1", 2.6399909192202835, 243.84888476267423, 1); socket.emit("1", 3.1100150743706907, 196.05774072961268, 1); socket.emit("1", -2.9699920613329622, 243.85151732150447, 1); socket.emit("1", -2.690040409174835, 132.00027613607475, 1); socket.emit("1", -2.3099851374683826, 243.85151732150447, 1); socket.emit("1", -2.0399825212769436, 243.85142525726602, 1); socket.emit("1", -1.7700175093099535, 243.85316996094184, 1); socket.emit("1", 0.7600044161827382, 132.00282572733062, 1); socket.emit("1", 0.35996640663856383, 180.10304605974878, 1); socket.emit("1", 0.029980358323314006, 197.1585985951411, 1); socket.emit("1", -0.439963547142766, 132.00080795207285, 1); socket.emit("1", 0.0800082011395776, 132.0022685411125, 1); socket.emit("1", 0.22998938484625386, 243.85088271318605, 1); socket.emit("1", 0.5000045603394669, 243.85230796529285, 1); socket.emit("1", 0.7000201471114224, 196.1091423162112, 1); socket.emit("1", 0.8999878082444033, 243.84691201653544, 1); socket.emit("1", 1.0399986494012126, 186.08457861950842, 1); socket.emit("1", 1.170002238251199, 243.8551629553904, 1); socket.emit("1", -0.170023102819992, 243.84605081895415, 1); socket.emit("1", -0.36001357695289626, 194.92632916053194, 1); socket.emit("1", -0.7000068138510656, 183.7252296229344, 1); socket.emit("1", -1.3600094643934062, 243.84717119540267, 1); socket.emit("1", -1.0899817628353876, 243.84783862072678, 1); socket.emit("1", -0.5500054440958607, 243.85303709406625, 1); socket.emit("1", -0.8199991749608286, 243.85031002645857, 1); socket.emit("1", -1.9300228177358634, 182.30682104627905, 1); socket.emit("1", -1.199997990229862, 183.82290662482725, 1); socket.emit("1", -0.9500096278543927, 131.99805036438974, 1); socket.emit("1", -1.5699815385655684, 196.37006518306183, 1); socket.emit("1", -1.5699629936544652, 132.00004583332537, 1);}

    let normalDashPacket = new Uint8Array([135, 102, 37, 116, 94, 162, 44, 210, 28, 223, 1, 13, 113, 180]);
        if (a.keyCode == 71) {
            ws.oldSend(normalDashPacket);
        }
    var ws;

if (a.keyCode == 97) {
   setTimeout(function() {vender();}, 20);
   setTimeout(function() {reconstruir();}, 30);}
   function vender() {
   for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)};
   function reconstruir() {
   socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}


if (a.keyCode == 90) {/*Full Atk*/
   socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}


if (a.keyCode == 88) {/*Defend*/
   socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1); socket.emit("1", 10.07, 311, 1); socket.emit("1", 10.49, 311, 1); socket.emit("1", 11.51, 311, 1); socket.emit("1", 11.93, 311, 1); socket.emit("1", 4.8625, 245, 1); socket.emit("1", 5.1125, 245, 1); socket.emit("1", 5.3625, 245, 1); socket.emit("1", 5.6125, 245, 1); socket.emit("1", 5.8625, 245, 1); socket.emit("1", 6.1125, 245, 1); socket.emit("1", 6.3625, 245, 1); socket.emit("1", 6.6125, 245, 1); socket.emit("1", 6.8625, 245, 1); socket.emit("1", 7.14, 245, 1); socket.emit("1", 7.39, 245, 1); socket.emit("1", 7.64, 246, 1); socket.emit("1", 7.89, 246, 1); socket.emit("1", 8.14, 246, 1); socket.emit("1", 8.39, 246, 1); socket.emit("1", 8.635, 246, 1); socket.emit("1", 8.885, 246, 1); socket.emit("1", 2.5825, 245, 1); socket.emit("1", 2.8625, 245, 1); socket.emit("1", 3.1125, 245, 1); socket.emit("1", 3.3625, 245, 1); socket.emit("1", 3.6125, 245, 1); socket.emit("1", 3.8625, 245, 1); socket.emit("1", 4.1125, 245, 1); socket.emit("1", 4.3625, 245, 1); socket.emit("1", 4.6125, 245, 1); socket.emit("1", 4.726, 190, 1); socket.emit("1", 5.725, 190, 1); socket.emit("1", 2.75, 190, 1); socket.emit("1", 3.74, 190, 1); socket.emit("1", 5.725, 190, 1); socket.emit("1", 2.75, 190, 1); socket.emit("1", 6.7215, 189.5, 1); socket.emit("1", 5.06, 185, 1); socket.emit("1", 5.4, 185, 1); socket.emit("1", 6.045, 186, 1); socket.emit("1", 6.374, 185, 1); socket.emit("1", 5.4, 185, 1); socket.emit("1", 7.0425, 188.5, 1); socket.emit("1", 7.365, 185, 1); socket.emit("1", 7.712, 187.45, 1); socket.emit("1", 8.035, 188.5, 1); socket.emit("1", 8.36, 185, 1); socket.emit("1", 2.425, 188, 1); socket.emit("1", 3.075, 184, 1); socket.emit("1", 5.06, 185, 1); socket.emit("1", 3.42, 186, 1); socket.emit("1", 3.74, 190, 1); socket.emit("1", 4.06, 186, 1); socket.emit("1", 4.39, 185, 1); socket.emit("1", 4.725, 130, 1); socket.emit("1", 5.245, 130, 1); socket.emit("1", 5.715, 130, 1); socket.emit("1", 6.185, 130, 1); socket.emit("1", 6.655, 130, 1); socket.emit("1", 7.13, 130, 1); socket.emit("1", 7.6, 130, 1); socket.emit("1", 1.85, 130, 1); socket.emit("1", 2.32, 130, 1); socket.emit("1", 2.79, 130, 1); socket.emit("1", 3.265, 130, 1); socket.emit("1", 3.735, 130, 1); socket.emit("1", 4.205, 130, 1);}


if (a.keyCode == 98) {/*Up Micro*/
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1);}

if (a.keyCode == 99) {
        for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Spikes' && a.push(units[d].id);
    socket.emit("3", a);
};


if (a.keyCode == 67) {/*Commander*/
socket.emit("4",0,0,1);}


if (a.keyCode == 96) {/*Sell Wall*/
for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)}

if (a.keyCode == 194) {/*0*/
    if(player.x==null){player.x==0}
    if(player.y==null){player.y==0}
    for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

})


addEventListener("keydown",function(a){
    if(document.activeElement == mainCanvas && selUnits.length){
        if(a.key=="*"){
            effect1();
        };
    };
});
var rot = 0.1;
function effect1(){
    var radiuslenght = prompt("Digite o tamanho do círculo:");
    var radius = radiuslenght;
    var x = player.x+targetDst*MathCOS(targetDir)+camX;
    var y = player.y+targetDst*MathSIN(targetDir)+camY;
    var interval = (Math.PI*2)/selUnits.length;
    rot+=0.1;
    for(let i=0;i<selUnits.length;i++){
        socket.emit("5",x+(Math.cos(interval*i+rot)*radius),y+(Math.sin(interval*i+rot)*radius),[selUnits[i].id],0,0);
    };
};

addEventListener("keydown", function(a) {
    if (a.keyCode == 111) {
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 1); ++b) e.push(selUnits[b].id);
            socket.emit("5", c, d, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 2); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 3); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 4); ++b) e.push(selUnits[b].id);
            socket.emit("5", c, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 5); ++b) e.push(selUnits[b].id);
            socket.emit("5", c, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 6); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 160, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 7); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 140, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 8); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 120, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 9); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 100, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 10); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 80, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 11); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 60, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 12); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 40, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 13); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 20, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 14); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 10, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 15); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 150, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 16); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 130, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 17); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 110, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 18); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 90, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 19); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 70, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 20); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 50, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 21); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 30, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 22); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d + 10, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 23); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 160, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 24); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 140, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 25); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 120, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 26); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 100, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 27); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 80, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 28); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 60, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 29); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 40, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 30); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 20, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 31); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 170, d - 5, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 32); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 150, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 33); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 130, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 34); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 110, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 35); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 90, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 36); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 70, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 37); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 50, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 38); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 30, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 39); ++b) e.push(selUnits[b].id);
            socket.emit("5", c + 10, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 40); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 150, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 41); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 130, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 42); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 110, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 43); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 90, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 44); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 70, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 45); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 50, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 46); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 30, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 47); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 5, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 48); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 49); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 150, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 50); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 130, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 51); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 110, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 52); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 90, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 53); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 70, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 54); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 50, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 55); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 30, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 56); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d - 10, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 57); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 58); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 150, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 59); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 130, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 60); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 110, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 61); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 90, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 62); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 70, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 63); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 50, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 64); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 30, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 65); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 170, d + 5, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 66); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 150, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 67); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 130, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 68); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 110, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 69); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 90, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 70); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 70, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 71); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 50, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 72); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 30, d + 170, e, 0, -1)
        }, 100);
        setTimeout(function() {
            var c = player.x + targetDst * MathCOS(targetDir) + camX,
                d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < Math.floor(selUnits.length - 73); ++b) e.push(selUnits[b].id);
            socket.emit("5", c - 5, d + 170, e, 0, -1)
        }, 100)
    }
});

/*var clanTag = "??";
var lastAlly=0;

chatInput.isFocused = false;
chatInput.onfocus=function(){chatInput.isFocused=true;};
chatInput.onblur=function(){chatInput.isFocused=false;};
addEventListener("keydown", function(a) {if (chatInput.isFocused===false&&a.keyCode == 16) {if(usersWithTag()!==0){for(i=lastAlly,e=users,h=e.length*2;i<h;++i){if(i==e.length){i=0;}if(i!==0&&users[i].sid!==player.sid&&users[i].name.startsWith(clanTag)){camX = users[i].x-player.x;camY = users[i].y-player.y;if(i==e.length){lastAlly=0;} else{lastAlly=1+i;} break;}}}}});
function usersWithTag(){if(users.lenght!==0){for(o=[],i=0,e=users;i<e.length;++i){if(users[i].sid!==player.sid&&users[i].name.startsWith(clanTag)){o.push(users[i]);}}return o.length;}else{return 0;}}

function playersLinked(a,d){if(a.sid==player.sid&&d.name.startsWith(clanTag)){return true;}}
*/

/*Players*/
var css = document.createElement("style")
css.innerText = `
#TotalMembers { display: inline-block; padding: 10px; background-color: #000000; font-family: 'regularF'; font-size: 20px; border-radius: 10px; color: #67676b;}

`
document.head.appendChild(css)
function players3() {
var nPlayers = document.createElement("div")
var play = setInterval(function() {
nPlayers.id = "TotalMembers"
document.getElementById("statContainer").appendChild(nPlayers)
nPlayers.innerText = "Players: " + users.length;
},1000)
}
setTimeout(players3, 10);
/*function chatrolagem() {
var chatList = document.querySelector('#chatList');
chatList.scrollTop = chatList.scrollHeight - chatList.clientHeight;}
setInterval(chatrolagem, 1000);
*/

/*Instafind*/
var gotoUsers = [];
var gotoIndex = 0;
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || {};

window.overrideSocketEvents.push({
    name: "l",
    description: "Leaderboard Insta Find override",
    func: function(a) {
        var d = "",
            c = 1,
            b = 0;
        for (; b < a.length;) {
            d += "<div class='leaderboardItem' onclick=goto2(" + a[b] + ");><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        }
        leaderboardList.innerHTML = d;
    }
})
leaderboardList.style.pointerEvents = 'auto';
chatListWrapper.style.pointerEvents = 'auto';

window.goto = function(username) {
    gotoUsers = users.filter((user) => {
        return user.name === username
    });
    gotoIndex = 0;
    if (gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    addChat(gotoUsers.length + ' users found with the name ' + username, 'Client');
    return gotoUsers.length;
}
window.goto2 = function(id, go) {
    gotoUsers = users.filter((user) => {
        return user.sid === id;
    });
    gotoIndex = 0;
    if (!go && gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    return gotoUsers.length;
}

window.gotoLeft = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex <= 0) gotoIndex = gotoUsers.length;
        gotoIndex--;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.gotoRight = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex >= gotoUsers.length - 1) gotoIndex = -1;
        gotoIndex++;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.addChat = function(msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    100 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}

window.resetCamera = function() { /*Override*/
    camX = camXS = camY = camYS = 0;
    cameraKeys = {
        l: 0,
        r: 0,
        u: 0,
        d: 0
    }

    if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
        window.overrideSocketEvents.forEach((item) => {
            socket.removeAllListeners(item.name)
            socket.on(item.name, item.func);
        });
    }
}



window.addChatLine = function(a, d, c) {
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";
            b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>' + g + ':</span> <span class="chatText">' + d + "</span>";
            100 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
}

/*COMANDS*/
enterGame = function() {
    socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]),
    hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value),
    mainCanvas.focus(),
    grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
    teste()
//    basespawn()
        socket.emit("spawn", {
            name: userNameInput.value,
            skin: 0
        }, a)
    }))
}

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.overrideSocketEvents = window.overrideSocketEvents || [];

window.chatCommands = window.chatCommands || [];

var muted = [];
window.overrideSocketEvents.push({
    name: "ch",
    description: "Chat Muter",
    func: function (a, d, c) {
        if (!muted[a])
            addChatLine(a, d, c)
    }
})

window.addChat = function (msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}


window.chatCommands.mute = function (split) {
    if (!split[1]) {
        addChat('Specify a name or "all" for everyone.')
    } else if (split[1] === 'all') {
        users.forEach((user) => {
            muted[user.sid] = true;
            mutados = users.length;
        });
        addChat('Muted ' + users.length + ' user(s).', 'BLOBLE.IO', playerColors[player.color]);
    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = true;
                len++;
            }
        });
        addChat('Muted ' + len + ' user(s) with the name ' + split[1], 'BLOBLE.IO', playerColors[player.color]);
    }
}
window.chatCommands.unmute = function (split) {
    if (!split[1]) {
        addChat('Specify a name or "all" for everyone.')
    } else if (split[1] === 'all') {
        addChat('Unmuted ' + mutados + ' user(s)', 'BLOBLE.IO', playerColors[player.color]);
        muted = {};
    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = false;
                len++;
            }
        });
        addChat('Unmuted ' + len + ' user(s) with the name ' + split[1], 'BLOBLE.IO', playerColors[player.color]);
    }
}
window.chatCommands.dpk = function (split) {
    var avail = Object.keys(window.chatCommands);
setTimeout(function(){ gens();},1000); setTimeout(function(){ gens();},12000); setTimeout(function(){ gens();},24000); setTimeout(function(){ upgens();},68000); setTimeout(function(){ upgens();},120000); setTimeout(function(){ turrets();},130000); setTimeout(function(){ upturrets();},156000); setTimeout(function(){ upturrets2();},198000); setTimeout(function(){ walls();},212000); setTimeout(function(){ upwalls();},254000); setTimeout(function(){ upwalls2();},375000); setTimeout(function(){ commander();},408000);
function gens(){for(i=-3.14;i<=3.14;i+=0.5233){ socket.emit("1",i,132,3); }for(i=-2.965;i<=3.14;i+=0.3488){ socket.emit("1",i,243.85,3); }}

function upgens(){for(i=0;i<units.length;++i){ if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function turrets(){for(i=-3.14;i<=3.14;i+=0.3488){ socket.emit("1",i,194,2); }}

function upturrets(){for(i=0;i<units.length;++i){ if(0===units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,1); } }}

function upturrets2(){for(i=0;i<units.length;++i){ if(0===units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function walls(){for(i=-3.14;i<3.14;i+=0.216){ socket.emit("1",i,1e3,1); }}

function upwalls(){for(i=0;i<units.length;++i){ if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function upwalls2(){for(i=0;i<units.length;++i){ if(3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0); } }}

function commander(){socket.emit("4",0,0,1);}
}
window.chatCommands.help = function (split) {
    var avail = Object.keys(window.chatCommands);
    addChat('They exist ' + avail.length + ' available commands.', 'BLOBLE.IO', playerColors[player.color]);
    addChat(avail.join(', '), 'BLOBLE.IO', playerColors[player.color]);
}
window.chatCommands.house = function (split) {
    var avail = Object.keys(window.chatCommands);
   setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 295000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 352000); setTimeout(function() {selecionartropas();}, 358000); setTimeout(function() {centralizar3();}, 359000);
function gens1() {socket.emit("1",-1.5532024736165302,243.847739788582,3); socket.emit("1",-0.7357047649976083,243.84981217954626,3); socket.emit("1",-0.4631707810434728,243.85218493997556,3); socket.emit("1",-0.19069612575052558,243.85039122379942,3); socket.emit("1",0.081823242943498,243.84582383137092,3); socket.emit("1",0.3543068427626167,243.84595547189218,3); socket.emit("1",0.6268093323905378,243.84396855366344,3); socket.emit("1",0.8993152888678688,243.84944576520982,3); socket.emit("1",1.1718223321670949,243.85213326932367,3); socket.emit("1",1.4443151477371527,243.84787798953676,3); socket.emit("1",1.7192989793251703,243.85392205170697,3); socket.emit("1",-1.8288944376970422,243.84689971373433,3); socket.emit("1",1.9918103630041337,243.85460668193252,3); socket.emit("1",2.264316448888492,243.84897949345623,3); socket.emit("1",2.5368131007766124,243.85278858360428,3); socket.emit("1",2.8093246351976133,243.84723024877687,3); socket.emit("1",3.0843130098428064,243.8499212630589,3); socket.emit("1",-2.926357644061203,243.84645742761984,3); socket.emit("1",-2.6538811539385643,243.85120319571928,3); socket.emit("1",-2.3788730471629616,243.84483796053584,3); socket.emit("1",-2.1038593986469003,243.85357655773683,3); socket.emit("1",-1.2806671667751037,243.85129320961167,3); socket.emit("1",-1.0081716987983749,243.84706785196326,3); socket.emit("1",1.579987145667095,186.05785820545177,3); socket.emit("1",1.8200377893253108,131.9987878732225,3); socket.emit("1",1.3299885934720075,131.9987367363794,3); socket.emit("1",1.0700140183147795,183.45721926378366,3); socket.emit("1",0.8200112635098129,131.9969037515653,3); socket.emit("1",2.080020169750631,181.88728652657397,3); socket.emit("1",2.339962323692137,131.9988700709214,3); socket.emit("1",2.609997065030747,181.5314595325009,3); socket.emit("1",2.8799849967373223,132.00128673615268,3); socket.emit("1",-3.129973633515593,180.7422001083311,3); socket.emit("1",-2.8600046281491114,131.9987212059268,3); socket.emit("1",0.5500078589016157,181.36809090906803,3); socket.emit("1",0.28000624853648737,132.00094696630012,3); socket.emit("1",0.009993041907008273,181.12904377818583,3); socket.emit("1",-0.2599728532968926,131.99544878517588,3); socket.emit("1",-0.5300137628628261,181.13117705132927,3); socket.emit("1",-0.7999690811162178,132.00256436903035,3); socket.emit("1",-2.590017189612395,181.24926841231655,3); socket.emit("1",-2.320026939739574,131.9970927710153,3); socket.emit("1",-2.039999434196396,181.1243012408882,3); socket.emit("1",-1.0699951440269182,181.07652857286615,3);socket.emit("1", 4.725, 130, 7);}

function base() {socket.emit("1", 4.725, 130, 7); socket.emit("1", 5.245, 130, 4); socket.emit("1", 5.715, 130, 4); socket.emit("1", 6.185, 130, 4); socket.emit("1", 6.655, 130, 4); socket.emit("1", 7.13, 130, 4); socket.emit("1", 7.6, 130, 4); socket.emit("1", 1.85, 130, 4); socket.emit("1", 2.32, 130, 4); socket.emit("1", 2.79, 130, 4); socket.emit("1", 3.265, 130, 4); socket.emit("1", 3.735, 130, 4); socket.emit("1", 4.205, 130, 4); socket.emit("1", 5.06, 185, 4); socket.emit("1", 5.4, 185, 4); socket.emit("1", 5.725, 190, 4); socket.emit("1", 6.045, 186, 4); socket.emit("1", 6.374, 185, 4); socket.emit("1", 6.7215, 189.5, 4); socket.emit("1", 7.0425, 188.5, 4); socket.emit("1", 7.365, 185, 4); socket.emit("1", 7.712, 187.45, 4); socket.emit("1", 8.035, 188.5, 4); socket.emit("1", 8.36, 185, 4); socket.emit("1", 2.425, 188, 4); socket.emit("1", 2.75, 190, 4); socket.emit("1", 3.075, 184, 4); socket.emit("1", 3.42, 186, 4); socket.emit("1", 3.74, 190, 4); socket.emit("1", 4.06, 186, 4); socket.emit("1", 4.39, 185, 4); socket.emit("1", 4.8625, 245, 4); socket.emit("1", 5.1125, 245, 4); socket.emit("1", 5.3625, 245, 4); socket.emit("1", 5.6125, 245, 4); socket.emit("1", 5.8625, 245, 4); socket.emit("1", 6.1125, 245, 4); socket.emit("1", 6.3625, 245, 4); socket.emit("1", 6.6125, 245, 4); socket.emit("1", 6.8625, 245, 4); socket.emit("1", 7.14, 245, 4); socket.emit("1", 7.39, 245, 4); socket.emit("1", 7.64, 246, 4); socket.emit("1", 7.89, 246, 4); socket.emit("1", 8.14, 246, 4); socket.emit("1", 8.39, 246, 4); socket.emit("1", 8.635, 246, 4); socket.emit("1", 8.885, 246, 4); socket.emit("1", 2.5825, 245, 4); socket.emit("1", 2.8625, 245, 4); socket.emit("1", 3.1125, 245, 4); socket.emit("1", 3.3625, 245, 4); socket.emit("1", 3.6125, 245, 4); socket.emit("1", 3.8625, 245, 4); socket.emit("1", 4.1125, 245, 4); socket.emit("1", 4.3625, 245, 4); socket.emit("1", 4.6125, 245, 4);}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 10.07, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);socket.emit("1", 11.93, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upantitank() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+35)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+140)*1, e, 0, -1);}
}

window.chatCommands.clear = function () {
    while (chatList.hasChildNodes()) {
        chatList.removeChild(chatList.lastChild);
    }
}
window.chatCommands.siege = function (split) {
    var avail = Object.keys(window.chatCommands);
    setTimeout(function(){ gens();},1000); setTimeout(function(){ gens();},10000); setTimeout(function(){ gens();},20000); setTimeout(function(){ gens();},30000); setTimeout(function(){ gens();},50000); setTimeout(function(){ gens();},55000); setTimeout(function(){ house();},65000); setTimeout(function(){ micro();},86000); setTimeout(function(){ barraca();},136000); setTimeout(function(){ vendergens();},206000); setTimeout(function(){ house();},207000); setTimeout(function(){ venderhouse();},284000); setTimeout(function(){ gens();},285000); setTimeout(function(){ siege();},286000); setTimeout(function(){ wall();},287000); setTimeout(function(){ micro();},288000); setTimeout(function(){ power();},294000);
function micro(){for (var i = 0; i < units.length; ++i) 3== units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function vendergens(){for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 0 && units[d].owner == player.sid) { var name = getUnitFromPath(units[d].uPath).name; (name === 'Generator') && a.push(units[d].id)}} socket.emit("3", a)}

function barraca(){for(i=0;i<units.length;++i){ if(2===units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,2);}}}

function venderhouse(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id); socket.emit("3", a);}

function siege(){for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 2 && units[d].owner == player.sid) { var name = getUnitFromPath(units[d].uPath).name; (name === 'Siege Factory') && a.push(units[d].id)}} socket.emit("3", a)}  function wall(){ socket.emit("1",10.07,311,1);}

function gens(){socket.emit("1",4.73,245,3); socket.emit("1",5.0025,245,3); socket.emit("1",5.275,245,3); socket.emit("1",5.5475,245,3); socket.emit("1",5.82,245,3); socket.emit("1",6.0925,245,3); socket.emit("1",6.365,245,3); socket.emit("1",6.6375,245,3); socket.emit("1",6.91,245,3); socket.emit("1",7.1825,245,3); socket.emit("1",7.455,245,3); socket.emit("1",7.7275,245,3); socket.emit("1",8.0025,245,3); socket.emit("1",8.275,245,3); socket.emit("1",8.5475,245,3); socket.emit("1",8.82,245,3); socket.emit("1",9.0925,245,3); socket.emit("1",9.3675,245,3); socket.emit("1",9.64,245,3); socket.emit("1",9.9125,245,3); socket.emit("1",10.1875,245,3); socket.emit("1",10.4625,245,3); socket.emit("1",10.7375,245,3); socket.emit("1",4.5889,186.5,3); socket.emit("1",5.085,180.5,3); socket.emit("1",5.64,180,3); socket.emit("1",5.999,180,3); socket.emit("1",6.51,185,3); socket.emit("1",7.05,185,3); socket.emit("1",7.6,185,3); socket.emit("1",8.15,185,3); socket.emit("1",8.675,185,3); socket.emit("1",9.225,185,3); socket.emit("1",9.78,185,3); socket.emit("1",10.325,185,3); socket.emit("1",4.81,130,3); socket.emit("1",5.36,130,3); socket.emit("1",6.275,130,3); socket.emit("1",6.775,130,3); socket.emit("1",7.3,130,3); socket.emit("1",7.85,130,3); socket.emit("1",8.4,130,3); socket.emit("1",8.925,130,3); socket.emit("1",9.5,130,3); socket.emit("1",10.05,130,3); socket.emit("1",10.6,130,3); }

function house(){socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1);}

function power(){for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+35)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+140)*1, e, 0, -1);}
}
window.chatCommands.reset = function () {
TemaUltron();
tema();}

var modsShown = true;
var chatHist = [];
var chatHistInd = -1;
var prevText = '';


function teste() {
setTimeout(function () {
   addChat('Welcome ' + player.name + '!!! ' + 'Type -help to see available commands.', 'BLOBLE.IO', playerColors[player.color]);
    var old = chatInput
    chatInput = old.cloneNode(true);
    old.parentNode.replaceChild(chatInput, old);
    chatInput.onclick = function () {
        toggleChat(!0)
    };

    chatInput.addEventListener("keyup", function (a) {
        var b = a.which || a.keyCode;
        if (b === 38) { /* up*/
            if (chatHistInd === -1) {
                prevText = chatInput.value;
                chatHistInd = chatHist.length;
            }
            if (chatHistInd > 0) chatHistInd--;
            chatInput.value = prevText + (chatHist[chatHistInd] || '')

        } else if (b === 40) {
            if (chatHistInd !== -1) {

                if (chatHistInd < chatHist.length) chatHistInd++;
                else chatHistInd = -1;
                chatInput.value = prevText + (chatHist[chatHistInd] || '')
            }
        } else
        if (gameState && socket && 13 === (a.which || a.keyCode) && "" != chatInput.value) {
            var value = chatInput.value;
            chatInput.value = ""
            mainCanvas.focus()

            if (value.charAt(0) === '-') {

                var split = value.split(' ');
                var name = split[0].substr(1);
                if (window.chatCommands[name]) window.chatCommands[name](split);
                else {
                    addChat("Commando '" + name + "' nonexistent. Type -help to access the list of commands.", 'BLOBLE.IO', playerColors[player.color]);
                }
            } else {
                socket.emit("ch", value)
            }
            if (chatHist[chatHist.length - 1] !== value) {
                var ind = chatHist.indexOf(value);
                if (ind !== -1) {
                    chatHist.splice(ind, 1);
                }
                chatHist.push(value);
            }
            chatHistInd = -1;
        }
    })
},1000)
    socket.on("pt", function(a) { scoreContainer.innerHTML = "Life: " + player.size + "%" + "<br>"+ "Power: <span> " + a });
    socket.on("l", function(a) {
        for (var d = "", c = 1, b = 0; b < a.length;) d += "<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        leaderboardList.innerHTML = d
    })
}

function basespawn() {
setTimeout(function() {gens1();}, 1000); setTimeout(function() {gens1();}, 10000); setTimeout(function() {gens1();}, 20000); setTimeout(function() {gens1();}, 30000); setTimeout(function() {gens1();}, 40000); setTimeout(function() {gens1();}, 50000); setTimeout(function() {gens1();}, 55000); setTimeout(function() {upgens1();}, 65000); setTimeout(function() {upgens1();}, 75000); setTimeout(function() {upgens1();}, 85000); setTimeout(function() {upgens1();}, 95000); setTimeout(function() {upgens1();}, 105000); setTimeout(function() {upgens1();}, 115000); setTimeout(function() {upgens1();}, 125000); setTimeout(function() {upgens1();}, 135000); setTimeout(function() {uparmory();}, 144000); setTimeout(function() {uparmory();}, 145000); setTimeout(function() {camada311();}, 155000); setTimeout(function() {upmicro();}, 170000); setTimeout(function() {barrack1();}, 175000); setTimeout(function() {upbarrack1();}, 210000); setTimeout(function() {barrack2();}, 215000); setTimeout(function() {upbarrack2();}, 235000); setTimeout(function() {commander();}, 255000); setTimeout(function() {upcommander();}, 260000); setTimeout(function() {vendergens();}, 300000); setTimeout(function() {base();}, 301000); setTimeout(function() {sellbarrack1();}, 330000); setTimeout(function() {barrack1();}, 331000); setTimeout(function() {selecionarsiege();}, 332000); setTimeout(function() {centralizar1();}, 333000); setTimeout(function() {centralizar2();}, 360000); setTimeout(function() {selecionartropas();}, 366000); setTimeout(function() {centralizar3();}, 367000);
function gens1() {socket.emit("1",1.5532024736165302,243.847739788582,3); socket.emit("1",0.7357047649976083,243.84981217954626,3); socket.emit("1",0.4631707810434728,243.85218493997556,3); socket.emit("1",0.19069612575052558,243.85039122379942,3); socket.emit("1",-0.081823242943498,243.84582383137092,3); socket.emit("1",-0.3543068427626167,243.84595547189218,3); socket.emit("1",-0.6268093323905378,243.84396855366344,3); socket.emit("1",-0.8993152888678688,243.84944576520982,3); socket.emit("1",-1.1718223321670949,243.85213326932367,3); socket.emit("1",-1.4443151477371527,243.84787798953676,3); socket.emit("1",-1.7192989793251703,243.85392205170697,3); socket.emit("1",1.8288944376970422,243.84689971373433,3); socket.emit("1",-1.9918103630041337,243.85460668193252,3); socket.emit("1",-2.264316448888492,243.84897949345623,3); socket.emit("1",-2.5368131007766124,243.85278858360428,3); socket.emit("1",-2.8093246351976133,243.84723024877687,3); socket.emit("1",-3.0843130098428064,243.8499212630589,3); socket.emit("1",2.926357644061203,243.84645742761984,3); socket.emit("1",2.6538811539385643,243.85120319571928,3); socket.emit("1",2.3788730471629616,243.84483796053584,3); socket.emit("1",2.1038593986469003,243.85357655773683,3); socket.emit("1",1.2806671667751037,243.85129320961167,3); socket.emit("1",1.0081716987983749,243.84706785196326,3); socket.emit("1",-1.579987145667095,186.05785820545177,3); socket.emit("1",-1.8200377893253108,131.9987878732225,3); socket.emit("1",-1.3299885934720075,131.9987367363794,3); socket.emit("1",-1.0700140183147795,183.45721926378366,3); socket.emit("1",-0.8200112635098129,131.9969037515653,3); socket.emit("1",-2.080020169750631,181.88728652657397,3); socket.emit("1",-2.339962323692137,131.9988700709214,3); socket.emit("1",-2.609997065030747,181.5314595325009,3); socket.emit("1",-2.8799849967373223,132.00128673615268,3); socket.emit("1",3.129973633515593,180.7422001083311,3); socket.emit("1",2.8600046281491114,131.9987212059268,3); socket.emit("1",-0.5500078589016157,181.36809090906803,3); socket.emit("1",-0.28000624853648737,132.00094696630012,3); socket.emit("1",-0.009993041907008273,181.12904377818583,3); socket.emit("1",0.2599728532968926,131.99544878517588,3); socket.emit("1",0.5300137628628261,181.13117705132927,3); socket.emit("1",0.7999690811162178,132.00256436903035,3); socket.emit("1",2.590017189612395,181.24926841231655,3); socket.emit("1",2.320026939739574,131.9970927710153,3); socket.emit("1",2.039999434196396,181.1243012408882,3); socket.emit("1",1.0699951440269182,181.07652857286615,3); socket.emit("1", -4.70, 130, 7);}

function base() {socket.emit("1", -4.70, 130, 7);socket.emit("1", 1.71, 245.85, 4),socket.emit("1", 1.46, 245.85, 4),socket.emit("1", 1.96, 245.85, 4),socket.emit("1", 1.21, 245.85, 4),socket.emit("1", 2.21, 245.85, 4),socket.emit("1", 0.96, 245.85, 4),socket.emit("1", 2.46, 245.85, 4),socket.emit("1", 0.71, 245.85, 4),socket.emit("1", 0.46, 245.85, 4),socket.emit("1", 2.71, 245.85, 4),socket.emit("1", 2.96, 245.85, 4),socket.emit("1", 0.21, 245.85, 4),socket.emit("1", -3.07, 245.85, 4),socket.emit("1", -0.04, 245.85, 4),socket.emit("1", -0.29, 245.85, 4),socket.emit("1", -2.82, 245.85, 4),socket.emit("1", -2.57, 245.85, 4),socket.emit("1", -0.54, 245.85, 4),socket.emit("1", -2.32, 245.85, 4),socket.emit("1", -0.79, 245.85, 4),socket.emit("1", -2.07, 245.85, 4),socket.emit("1", -1.04, 245.85, 4),socket.emit("1", -1.82, 245.85, 4),socket.emit("1", -1.29, 245.85, 4),socket.emit("1",4.7280,245,4),socket.emit("1", 2.58, 190.7, 4),socket.emit("1", 0.59, 190.45, 4),socket.emit("1", -2.72, 189.71, 4),socket.emit("1", -0.39, 189.71, 4),socket.emit("1", -1.39, 189.09, 4),socket.emit("1", -1.73, 188.48, 4),socket.emit("1", -2.4, 187.66, 4),socket.emit("1", -0.71, 187.46, 4),socket.emit("1", 0.91, 186.12, 4),socket.emit("1", 0.27, 186.2, 4),socket.emit("1", 2.9, 186.15, 4),socket.emit("1", 2.26, 185.87, 4),socket.emit("1", -3.05, 185.31, 4),socket.emit("1", -0.06, 185.8, 4),socket.emit("1", -2.07, 185.43, 4),socket.emit("1", 1.24, 184.2, 4),socket.emit("1", -1.04, 184.09, 4),socket.emit("1", 1.93, 183.65, 4),socket.emit("1",-4.70,130,7),socket.emit("1", 2.11, 130, 4),socket.emit("1", 1.06, 130, 4),socket.emit("1", 2.58, 130, 4),socket.emit("1", 0.59, 130, 4),socket.emit("1", 3.05, 130, 4),socket.emit("1", 0.12, 130, 4),socket.emit("1", -2.76, 130, 4),socket.emit("1", -0.35, 130, 4),socket.emit("1", -0.83, 130, 4),socket.emit("1", -2.29, 130, 4),socket.emit("1", -1.82, 130, 4),socket.emit("1", -1.3, 130, 4)}

function upgens1() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}

function barrack1() {socket.emit("1", 10.07, 311, 8);}

function upbarrack1() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 2);}}}

function barrack2() {socket.emit("1", 10.49, 311, 8);socket.emit("1", 11.51, 311, 8);socket.emit("1", 11.93, 311, 8);}

function camada311() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1);}

function uparmory() {for (i = 0; i < units.length; ++i) {if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function upbarrack2() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}

function vendergens() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)}

function sellbarrack1() {for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}

function commander(){socket.emit("4",0,0,1);}

function upmicro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}

function selecionartropas(){selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);unit.info.name !== 'Siege Ram' && selUnits.push(unit);}})}

function selecionarsiege() {selUnits = [];units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Siege Ram') {selUnits.push(unit);return false;}}return true;});selUnitType = "Unit";}

function upcommander() {for (var i = 0; i < units.length; ++i) 1 == units[i].type && "star" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}

function centralizar1() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-150)*1, e, 0, -1);}

function centralizar2() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}

function centralizar3() {
if(player.x==null){player.x==0}
if(player.y==null){player.y==0}
for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-140)*1, e, 0, -1);}
}

var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color: rgba(0, 0, 0);margin-left: 3px;border-radius:10px;pointer-events:all}#upgradeScriptCont{top: -180px;transition: 1s;margin-left:10px;position:absolute;padding-left:24px;margin-top:9px;border: 2px solid #67676b;padding-top:15px;width:330px;height:175px;font-family:arial;left:54%}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;border: 0.5px solid #67676b;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 12px;position: relative;left: 230px;bottom: 0px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="\n\
<div id=upgradeScriptCont>\n\
<div id=layer1>\n\
<div id=walls class=buttonClass onclick=a8()>Sell Inner</div>\n\
<div id=upgradeBoulders class=buttonClass onclick=a9()>Sell Outer</div>\n\
<div id=upgradeGen class=buttonClass onclick=a4()>Sell All</div>\n\
</div><div id=layer2 style=margin-top:7px;margin-left:0px>\n\
<div id=walls class=buttonClass onclick=a5()>Sell Wall</div>\n\
<div id=upgradeBoulders class=buttonClass onclick=a6()>Sell Generator</div>\n\
<div id=upgradeGen class=buttonClass onclick=a7()>Sell House</div></div>\n\
<div id=layer3 style=margin-top:7px;margin-left:0px>\n\
<div id=walls class=buttonClass onclick=a10()>Up Barracks</div>\n\
<div id=upgradeBoulders class=buttonClass onclick=a11()>Ranged</div>\n\
<div id=upgradeSpikes class=buttonClass onclick=a12()>Spotter</div>\n\
</div><div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div id=walls class=buttonClass onclick=a1()>PowerPlant</div>\n\
<div id=walls class=buttonClass onclick=a2()>Micro G.</div>\n\
<div id=walls class=buttonClass onclick=a3()>AntiTanks</div>\n\
</div><span class=hoverMessage>Hotbar - X1</span></div>",contAppend.insertBefore(menuA,contAppend.firstChild)
window.a1=function() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)};
window.a2=function() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)};
window.a3=function() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)};
window.a4=function() {for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);socket.emit("3", a)};
window.a5=function() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)};
window.a6=function() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Generator' && a.push(units[d].id);socket.emit("3", a);for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Power Plant' && a.push(units[d].id);socket.emit("3", a)};
window.a7=function() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);socket.emit("3", a)};
window.a8=function() {for (var a = [], d = 0; d < units.length; ++d) { if (units[d].type === 0 && units[d].owner == player.sid) { a.push(units[d].id) } } socket.emit("3", a) };
window.a9=function() {for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2) && units[d].owner == player.sid && a.push(units[d].id);socket.emit("3", a)};
window.a10=function() {for(i=0;i<units.length;++i){ if(2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0);}}};
window.a11=function() {for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)};
window.a12=function() {for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)}


window.makeUI = function () {
    if (window.hasMadeUI) return;
    window.hasMadeUI = true;
    window.statusItems.sort(function (a, b) {
        return a.order - b.order;
    })
    var levels = [];
    window.UIList.forEach((item) => {
        if (!levels[item.level]) levels[item.level] = [];
        levels[item.level].push(item)
    })

    levels = levels.filter((a) => {
        if (a) {
            a.sort(function (a, b) {
                return a.x - b.x;
            })
            return true;
        } else {
            return false;
        }
    })

    var headAppend = document.getElementsByTagName("head")[0],
        style = document.createElement("div");

    var toast = document.createElement('div');
    toast.id = "snackbar";
    var css = document.createElement('div');



    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 - 20;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
background-color:rgba(0, 0, 0);\n\
margin-left: 0px;\n\
border-radius:10px;\n\
pointer-events:all\n\
}\n\
#noobscriptUI {\n\
top: -" + (height + 13) + "px;\n\
transition: 0.8s;\n\
margin-left:20px;\n\
position:absolute;\n\
padding-left:24px;\n\
border: 2px solid #67676b;\n\
margin-top:9px;\n\
padding-top:15px;\n\
padding-bottom:15px;\n\
width:675px;\n\
height: " + height + "px;\n\
font-family:arial;\n\
left:2%\n\
hoverMessage:Upgrades\n\
}\n\
#noobscriptUI:hover{\n\
top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
color:#ffffff;\n\
padding:10px;\n\
height:10px;\n\
display:inline-block;\n\
border: 0.5px solid #67676b;\n\
cursor:pointer;\n\
font-size:15px\n\
}\n\
#noobscriptUI > div > div > div {\n\
color:#ffffff40;\n\
padding:10px;\n\
height:10px;\n\
display:inline-block;\n\
cursor:pointer;\n\
font-size:12px\n\
}\n\
</style>";

    headAppend.appendChild(style);
    headAppend.appendChild(css);


    var contAppend = document.getElementById("gameUiContainer"),
        menuA = document.createElement("div");

    var code = ['<div id="noobscriptUI">\n'];

    levels.forEach((items, i) => {
        code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
        items.forEach((el) => {
            code.push('        ' + el.html + '\n');
        })
        code.push('    </div>\n');
    })
    code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
    code.push('</div>');

    menuA.innerHTML = code.join("");
    contAppend.insertBefore(menuA, contAppend.firstChild)
    contAppend.appendChild(toast)
    var toastTimeout = false;
    window.showToast = function (msg) {
        toast.textContent = msg;

        if (toastTimeout) clearTimeout(toastTimeout);
        else toast.className = "show";
        toastTimeout = setTimeout(function () {
            toast.className = 'hide'
            setTimeout(function () {
                toast.className = '';
            }, 400);
            toastTimeout = false;
        }, 3000);
    }
    window.statusBar = function () {
        var el = document.getElementById('confinfo');
        var text = [];

        window.statusItems.forEach((item, i) => {
            if (i !== 0) text.push('     ');
            if (item.name) text.push(item.name + ': ');
        })

        el.textContent = text.join('');
    }
    window.statusBar();

    window.initFuncs.forEach((func) => {
        func();
    })
}
setTimeout(() => {
    window.makeUI();
}, 1000)

/*
// GLOBAL UNITLIST:
(function(exports) {
	exports.getBaseUpgrades = function() {
		return [{
			name: "Commander",
			desc: "Powerful commander unit",
			lockMaxBuy: true,
			cost: 1500,
			unitSpawn: 9
		}];
	};
	exports.getUnitList = function() {
		return [{
	    	name: "Soldier",
	    	shape: "circle",
	    	desc: "Expendable and perfect for rushing the enemy",
	    	typeName: "Unit",
	    	limit: 4,
	    	reward: 3,
	    	notUser: true,
	    	uPath: [0],
	    	space: 2,
	    	type: 1,
	    	size: 18,
	    	speed: 0.18,
	    	health: 30,
	    	dmg: 10
	    }, {
	    	name: "Wall",
	    	shape: "circle",
	    	desc: "Blocks incoming units and projectiles",
	    	typeName: "Tower",
	    	uPath: [1],
	    	type: 3,
	    	size: 30,
	    	cost: 20,
	    	health: 100,
	    	dmg: 50,
	    	upgrades: [{
	    		name: "Boulder",
	    		shape: "hexagon",
	    		desc: "Strong barrier that blocks incoming units",
	    		typeName: "Tower",
	    		uPath: [1,0],
	    		type: 3,
	    		size: 30,
	    		cost: 60,
	    		health: 150,
	    		dmg: 50,
	    		upgrades: [{
	    			name: "Spikes",
	    			shape: "spike",
	    			desc: "Strong spike that blocks incoming units",
	    			typeName: "Tower",
	    			uPath: [1,0,0],
	    			type: 3,
	    			size: 30,
	    			cost: 200,
	    			health: 200,
	    			dmg: 100
	    		}]
	    	}, {
	    		name: "Micro Generator",
		    	shape: "circle",
		    	desc: "Generates power over time",
		    	typeName: "Tower",
		    	uPath: [1,1],
		    	type: 3,
		    	size: 30,
		    	iSize: 0.55,
		    	cost: 30,
		    	health: 50,
		    	dmg: 10,
		    	pts: 0.5
	    	}]
	    }, {
	    	name: "Simple Turret",
	    	shape: "circle",
	    	desc: "Shoots incoming enemy units",
	    	typeName: "Tower",
	    	uPath: [2],
	    	type: 0,
	    	size: 29,
	    	cost: 25,
	    	turretIndex: 1,
	    	range: 180,
	    	reload: 800,
	    	health: 20,
	    	dmg: 20,
	    	upgrades: [{
	    		name: "Rapid Turret",
	    		shape: "circle",
	    		desc: "Shoots incoming units at faster rate",
	    		typeName: "Tower",
	    		uPath: [2,0],
	    		type: 0,
	    		size: 30,
	    		cost: 60,
	    		turretIndex: 2,
	    		range: 180,
	    		reload: 400,
	    		health: 20,
	    		dmg: 20,
	    		upgrades: [{
	    			name: "Gatlin Turret",
	    			shape: "circle",
	    			desc: "Rapidly shoots incoming units at close range",
	    			typeName: "Tower",
	    			uPath: [2,0,0],
	    			type: 0,
	    			size: 30,
	    			cost: 100,
	    			turretIndex: 7,
	    			range: 180,
	    			reload: 140,
	    			health: 20,
	    			dmg: 15
	    		}]
	    	}, {
	    		name: "Ranged Turret",
	    		shape: "circle",
	    		desc: "Turret with higher range and damage",
	    		typeName: "Tower",
	    		uPath: [2,1],
	    		type: 0,
	    		size: 30,
	    		cost: 60,
	    		turretIndex: 3,
	    		range: 240,
	    		reload: 800,
	    		health: 30,
	    		dmg: 30,
	    		upgrades: [{
	    			name: "Spotter Turret",
	    			shape: "circle",
	    			desc: "Shoots at very high range and reveals cloaked units",
	    			typeName: "Tower",
	    			seeCloak: true,
	    			uPath: [2,1,0],
	    			type: 0,
	    			size: 30,
	    			cost: 100,
	    			turretIndex: 10,
	    			range: 290,
	    			reload: 800,
	    			health: 30,
	    			dmg: 30
	    		}]
	    	}]
	    }, {
	    	name: "Generator",
	    	shape: "hexagon",
	    	desc: "Generates power over time",
	    	typeName: "Tower",
	    	uPath: [3],
	    	type: 0,
	    	size: 32,
	    	iSize: 0.55,
	    	cost: 50,
	    	health: 50,
	    	dmg: 10,
	    	pts: 1,
	    	upgrades: [{
	    		name: "Power Plant",
	    		shape: "octagon",
	    		desc: "Generates power at a faster rate",
	    		typeName: "Tower",
	    		uPath: [3,0],
	    		type: 0,
	    		size: 32,
	    		iSize: 0.6,
	    		cost: 100,
	    		health: 80,
	    		dmg: 10,
	    		pts: 1.5
	    	}]
	    }, {
	    	name: "House",
	    	shape: "pentagon",
	    	desc: "Increases unit limit",
	    	typeName: "Tower",
	    	uPath: [4],
	    	type: 0,
	    	size: 30,
	    	iSize: 0.3,
	    	cost: 60,
	    	health: 40,
	    	dmg: 10,
	    	lmt: [0,3]
	    }, {
	    	name: "Sniper Turret",
	    	shape: "circle",
	    	desc: "Slower firerate but larger range and damage",
	    	typeName: "Tower",
	    	uPath: [5],
	    	type: 0,
	    	size: 32,
	    	cost: 80,
	    	turretIndex: 4,
	    	range: 240,
	    	reload: 2000,
	    	health: 30,
	    	tDmg: 50,
	    	dmg: 30,
	    	upgrades: [{
	    		name: "Semi-Auto Sniper",
	    		shape: "circle",
	    		desc: "Fast firerate sniper turret",
	    		typeName: "Tower",
	    		uPath: [5, 0],
	    		type: 0,
	    		size: 32,
	    		cost: 180,
	    		turretIndex: 5,
	    		range: 240,
	    		reload: 1000,
	    		health: 60,
	    		tDmg: 50,
	    		dmg: 30
	    	}, {
	    		name: "Anti Tank Gun",
	    		shape: "circle",
	    		desc: "High damage turret with very slow firerate",
	    		typeName: "Tower",
	    		target: 1,
	    		uPath: [5, 1],
	    		type: 0,
	    		size: 32,
	    		cost: 300,
	    		turretIndex: 6,
	    		range: 280,
	    		reload: 4500,
	    		health: 60,
	    		tDmg: 250,
	    		dmg: 30
	    	}]
	    }, {
	    	name: "Tank",
	    	shape: "triangle",
	    	desc: "More powerful unit but moves slower",
	    	typeName: "Unit",
	    	group: 0,
	    	reward: 100,
	    	notUser: true,
	    	uPath: [6],
	    	space: 15,
	    	type: 1,
	    	size: 31,
	    	speed: 0.05,
	    	health: 250,
	    	dmg: 50
	    }, {
	    	name: "Armory",
	    	shape: "circle",
	    	desc: "Provides improvements for your army",
	    	typeName: "Tower",
	    	uPath: [7],
	    	limit: 1,
	    	type: 0,
	    	size: 40,
	    	renderIndex: 3,
	    	cost: 100,
	    	health: 90,
	    	dmg: 30,
	    	upgrades: [{
	    		name: "Power Armor",
	    		desc: "Increases soldier armor",
	    		powerup: true,
	    		uPath: [7, 0],
	    		cost: 500,
	    		uVals: [0, 'health', 20, 'renderIndex', 4]
	    	}, {
	    		name: "Booster Engines",
	    		desc: "Increases tank movement speed",
	    		powerup: true,
	    		uPath: [7, 1],
	    		cost: 600,
	    		uVals: [6, 'speed', 0.04, 'renderIndex', 5]
	    	}, {
	    		name: "Panzer Cannons",
	    		desc: "Adds cannons to tank units",
	    		powerup: true,
	    		uPath: [7, 2],
	    		cost: 1000,
	    		uVals: [6, 'turretIndex', 8, 'tDmg', 10, 'reload', 900, 'range', 200, 'shoot', true, 'target', 1]
	    	}, {
	    		name: "Cloaking Device",
	    		desc: "Hides tanks from enemy towers",
	    		powerup: true,
	    		uPath: [7, 3],
	    		cost: 2000,
	    		uVals: [6, 'cloak', 1, 'canCloak', 1]
	    	}]
	    }, {
	    	name: "Barracks",
	    	shape: "square",
	    	desc: "Produces soldiers over time",
	    	typeName: "Tower",
	    	uPath: [8],
	    	limit: 4,
	    	type: 2,
	    	size: 34,
	    	iSize: 0.55,
	    	cost: 150,
	    	reload: 3500,
	    	unitSpawn: 0,
	    	health: 60,
	    	dmg: 30,
	    	upgrades: [{
	    		name: "Greater Barracks",
	    		shape: "square",
	    		desc: "Produces soldiers more rapidly",
	    		typeName: "Tower",
	    		uPath: [8, 0],
	    		type: 2,
	    		size: 34,
	    		renderIndex: 1,
	    		cost: 500,
	    		reload: 2500,
	    		unitSpawn: 0,
	    		health: 80,
	    		dmg: 40
	    	}, {
	    		name: "Tank Factory",
	    		shape: "square",
	    		desc: "Slowly produces tanks over time",
	    		typeName: "Tower",
	    		uPath: [8, 1],
	    		type: 2,
	    		size: 35,
	    		range: 70,
	    		renderIndex: 2,
	    		cost: 2000,
	    		reload: 10000,
	    		unitSpawn: 6,
	    		health: 140,
	    		dmg: 50,
				upgrades: [{
					name: "Blitz Factory",
		    		shape: "square",
		    		desc: "Produces Tanks at a Faster rate",
		    		typeName: "Tower",
		    		uPath: [8,1,0],
		    		type: 2,
		    		size: 35,
		    		range: 70,
		    		renderIndex: 2,
		    		cost: 5000,
		    		reload: 6000,
		    		unitSpawn: 6,
		    		health: 180,
		    		dmg: 50
		    	}]
	    	}, {
	    		name: "Siege Factory",
	    		shape: "square",
	    		desc: "Produces siege tanks over time",
	    		typeName: "Tower",
	    		uPath: [8, 2],
	    		type: 2,
	    		size: 35,
	    		range: 70,
	    		renderIndex: 8,
	    		cost: 3000,
	    		reload: 20000,
	    		unitSpawn: 11,
	    		health: 200,
	    		dmg: 100
	    	}]
	    }, {
	    	name: "Commander",
	    	shape: "star",
	    	hero: true,
	    	desc: "Powerful commander unit",
	    	typeName: "Unit",
	    	reward: 200,
	    	notUser: true,
	    	uPath: [9],
	    	limit: 1,
	    	type: 1,
	    	size: 32,
	    	speed: 0.16,
	    	health: 700,
	    	dmg: 100,
	    	tDmg: 30,
	    	turretIndex: 9,
	    	reload: 600,
	    	range: 160,
	    	target: 1,
	    	upgrades: [{
	    		name: "Great Leadership",
	    		desc: "Increases population cap",
	    		powerup: true,
	    		removeOthers: true,
	    		uPath: [9, 0],
	    		cost: 500,
	    		lmt: [0,10]
	    	}]
	    }, {
	    	name: "Tree",
	    	desc: "Can be used for cover",
	    	typeName: "Nature",
	    	layer: 1,
	    	uPath: [10],
	    	type: 3,
	    	notUser: true,
	    	dontUpdate: true,
	    	size: 90,
	    	renderIndex: 7
	    }, {
	    	name: "Siege Ram",
	    	shape: "circle",
	    	desc: "Very powerful and slow siege tank",
	    	typeName: "Unit",
	    	group: 0,
	    	reward: 300,
	    	notUser: true,
	    	uPath: [11],
	    	space: 40,
	    	type: 1,
	    	size: 30,
	    	iSize: 0.5,
	    	speed: 0.015,
	    	health: 1500,
	    	dmg: 100
	    }];
	};
}(typeof exports==='undefined'?this.share={}:exports));
*/