// ==UserScript==
// @name         NTX SCRIPT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script Reduzido
// @author       NeutroX
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432023/NTX%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/432023/NTX%20SCRIPT.meta.js
// ==/UserScript==
window.renderPlayer = function(a, d, c, b, g) {b.save();if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {var e = new Image;e.onload = function() {this.readyToDraw = !0;this.onload = null;g == currentSkin && changeSkin(0);};e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";skinSprites[a.skin] = e;};a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));    b.restore();};
function theme(){
}
theme();
document.getElementById("youtubeContainer").innerHTML = '';
document.getElementById("youtuberOf").innerHTML = '';
document.getElementById("smallAdContainer").innerHTML = '';
document.getElementById("infoLinks").innerHTML = '';
document.getElementById("creatorLink").innerHTML = '';
document.getElementById("adContainer").innerHTML = '';
playerBorderRot=selUnitType;
function lines() {renderDottedCircle=function(a, d, c, b) {b.setLineDash([5500, 1200]); b.beginPath(); b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI); b.stroke(); b.setLineDash([]) };renderDottedLine=function(a, d, c, b, g) {g.setLineDash([5500, 1200]); g.beginPath(); g.moveTo(a, d); g.lineTo(c, b); g.stroke(); g.setLineDash([]) }}lines();
function antikick() {setInterval(function(){if(window.socket){window.socket.emit("2",window.camX,window.camY)}},20000)}antikick();
//TabBots//
cid = UTILS.getUniqueID();
localStorage.setItem("cid",cid);
//Players//
var css = document.createElement("style")
css.innerText = `
html, body {width: 100%; height: 100%; cursor: Crosshair; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
body {background-color: #ffffff; margin: 0; overflow: hidden; cursor: Crosshair; }
#TotalMembers { display: inline-block; padding: 10px; background-color: rgba(40, 40, 40, 0.5); font-family: 'regularF'; font-size: 20px; border-radius: 4px; color: #fff;}
`
document.head.appendChild(css)
function players3() {
var nPlayers = document.createElement("div")
var play = setInterval(function() {
nPlayers.id = "TotalMembers"
document.getElementById("statContainer").appendChild(nPlayers)
nPlayers.innerText = users.length;
},1000)};setTimeout(players3, 10);
//Alterações extras//
setupSocket=function(){socket.on("connect_error",function(){lobbyURLIP?kickPlayer("Connection failed. Please check your lobby ID"):kickPlayer("Connection failed. Check your internet and firewall settings")});socket.on("disconnect",function(a){kickPlayer("Disconnected.")});socket.on("error",function(a){kickPlayer("Disconnected. The server may have updated.")});socket.on("kick",function(a){kickPlayer(a)});socket.on("lk",function(a){partyKey=a});socket.on("spawn",function(){gameState=1;unitList=share.getUnitList();
resetCamera();toggleMenuUI(!1);toggleGameUI(!0);updateUnitList();player.upgrades=share.getBaseUpgrades();mainCanvas.focus()});socket.on("gd",function(a){gameData=a});socket.on("mpd",function(a){mapBounds=a});socket.on("ch",function(a,d,c){addChatLine(a,d,c)});socket.on("setUser",function(a,d){if(a&&a[0]){var c=getUserBySID(a[0]),b={sid:a[0],name:a[1],iName:"Headquarters",upgrades:[window.share.getBaseUpgrades()[1]],dead:!1,color:a[2],size:a[3],startSize:a[3] - a[3] + 32,x:a[5],y:a[6],buildRange:a[7],gridIndex:a[8],spawnProt:a[9],skin:a[10],desc:"Base of operations of "+
a[1] + " ID: " + a[0] + " X: " + a[5] + " Y: " + a[6],kills:0,typeName:"Base"};null!=c?(users[c]=b,d&&(player=users[c])):(users.push(b),d&&(player=users[users.length-1]))}});socket.on("klUser",function(a){var d=getUserBySID(a);null!=d&&(users[d].dead=!0);player&&player.sid==a&&(hideMainMenuText(),leaveGame())});socket.on("delUser",function(a){a=getUserBySID(a);null!=a&&users.splice(a,1)});socket.on("au",function(a){a&&(units.push({id:a[0],owner:a[1],uPath:a[2]||0,type:a[3]||0,color:a[4]||0,paths:a[5],x:a[6]||0,sX:a[6]||0,y:a[7]||0,sY:a[7]||0,dir:a[8]||
0,turRot:a[8]||0,speed:a[9]||0,renderIndex:a[10]||0,turretIndex:a[11]||0,range:a[12]||0,cloak:a[13]||0}),units[units.length-1].speed&&(units[units.length-1].startTime=window.performance.now()),a=getUnitFromPath(units[units.length-1].uPath))&&(units[units.length-1].size=a.size,units[units.length-1].shape=a.shape,units[units.length-1].layer=a.layer,units[units.length-1].renderIndex||(units[units.length-1].renderIndex=a.renderIndex),units[units.length-1].range||(units[units.length-1].range=a.range),
units[units.length-1].turretIndex||(units[units.length-1].turretIndex=a.turretIndex),units[units.length-1].iSize=a.iSize)});socket.on("spa",function(a,d,c,b){a=getUnitById(a);if(null!=a){var g=UTILS.getDistance(d,c,units[a].x||d,units[a].y||c);300>g&&g?(units[a].interpDst=g,units[a].interpDstS=g,units[a].interpDir=UTILS.getDirection(d,c,units[a].x||d,units[a].y||c)):(units[a].interpDst=0,units[a].interpDstS=0,units[a].interpDir=0,units[a].x=d,units[a].y=c);units[a].interX=0;units[a].interY=0;units[a].sX=
units[a].x||d;units[a].sY=units[a].y||c;b[0]&&(units[a].dir=b[0],units[a].turRot=b[0]);units[a].paths=b;units[a].startTime=window.performance.now()}});socket.on("uc",function(a,d){unitList&&(unitList[a].count=d);forceUnitInfoUpdate=!0});socket.on("uul",function(a,d){unitList&&(unitList[a].limit+=d)});socket.on("rpu",function(a,d){var c=getUnitFromPath(a);c&&(c.dontShow=d,forceUnitInfoUpdate=!0)});socket.on("sp",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].spawnProt=d)});socket.on("ab",function(a){a&&
bullets.push({x:a[0],sX:a[0],y:a[1],sY:a[1],dir:a[2],speed:a[3],size:a[4],range:a[5]})});socket.on("uu",function(a,d){if(void 0!=a&&d){var c=getUnitById(a);if(null!=c)for(var b=0;b<d.length;)units[c][d[b]]=d[b+1],"dir"==d[b]&&(units[c].turRot=d[b+1]),b+=2}});socket.on("du",function(a){a=getUnitById(a);null!=a&&units.splice(a,1)});socket.on("sz",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].size=d)});socket.on("pt",function(a){scoreContainer.innerHTML="<span class='spanLink'>"+a+
"</span>",player.power = a});socket.on("l",function(a){for(var d="",c=1,b=0;b<a.length;)d+="<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>"+c+".</div> <div class='"+(player&&a[b]==player.sid?"leaderYou":"leader")+"'>"+a[b+1]+"</div><div class='scoreText'>"+a[b+2]+"</div></div>",c++,b+=3;leaderboardList.innerHTML=d})}

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
else if(7==b.renderIndex)for(g=0;3>g;++g)l.fillStyle=g?1==g?"#00000000":"#00000000":"#00000000",renderStar(0, 0, f, .7 * f, l, 7),f *= .55;
else 8==b.renderIndex&&(l.fillStyle=turretColor,renderRectCircle(0,0,.75*f,f/2.85,3,l),renderSquare(0,0,.5*f,l));1!=b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,-(MathPI/2),l);
unitSprites[h]=m}f=unitSprites[h];e.save();e.translate(a,d);e.rotate(c+MathPI/2);
e.drawImage(f,-(f.width/2),-(f.height/2),f.width,f.height);
1==b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,b.turRot-MathPI/2-c,e);e.restore()};
renderText=function(a, d) { var c = document.createElement("canvas") , b = c.getContext("2d"); b.font = d + "px regularF"; var g = b.measureText(a); c.width = g.width + 20; c.height = 2 * d; b.translate(c.width / 2, c.height / 2); b.font = d + "px regularF"; b.fillStyle = "#000"; b.textBaseline = "middle"; b.textAlign = "center"; b.strokeStyle = darkColor; b.lineWidth = outlineWidth; b.strokeText(a, 0, 0); b.fillText(a, 0, 0); return c }

var joinEnabled = true
addEventListener("keydown", function(a){
if(a.keyCode == 45){
    joinEnabled = !joinEnabled
}
})
moveSelUnits=function(){if(selUnits.length){var a=player.x+targetDst*MathCOS(targetDir)+camX,d=player.y+targetDst*MathSIN(targetDir)+camY,c=1;if(c&&1<selUnits.length)for(var b=0;b<users.length;++b)if(UTILS.pointInCircle(a,d,users[b].x,users[b].y,users[b].size)){c=0;break}var g=-1;if(c)for(b=0;b<units.length;++b)if(units[b].onScreen&&units[b].owner!=player.sid&&UTILS.pointInCircle(a,d,units[b].x,units[b].y,units[b].size)){c=0;g=units[b].id;break}1==selUnits.length&&(c=0);for(var e=[],b=0;b<selUnits.length;++b)e.push(selUnits[b].id);
socket.emit("5",UTILS.roundToTwo(a),UTILS.roundToTwo(d),e,joinEnabled?(0):(c),g)}}

//Hotbar//
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.UIList.push({
level:0,x:0,html:'<div id="res" onclick=setRes()>Res(1)</div>'}, {
level:0,x:1,html:'<div onclick=bots()>Bots</div>'},{
level:0,x:2,html:'<div onclick=upgens()>Up Gens</div>'},{
level:0,x:3,html:'<div onclick=upbarracks()>Up Barrack</div>'},{
level:0,x:4,html:'<div onclick=sellhouse()>Sell House</div>'},{
level:0,x:5,html:'<div onclick=sellgens()>Sell Gens</div>'},{
level:0,x:6,html:'<div onclick=buildAT()>Build AntiTanks</div>'},{
//level:1,x:0,html:'<div onclick=nucleo()>Nucleo</div>'},{

})
//window.nucleo = function() {
//var size = prompt("Tamanho")
//for (i=0;i<users.length;i++) {
//users[i].size=size
//}
//}
/*Res*/
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
if (resolution === 1) {
    resolution = .1;
    el.textContent = 'Res(.1)';
} else if (resolution === .1) {
    resolution = .2;
    el.textContent = 'Res(.2)';
} else if (resolution === .2) {
    resolution = .3;
    el.textContent = 'Res(.3)';
} else if (resolution === .3) {
    resolution = .4;
    el.textContent = 'Res(.4)';
} else if (resolution === .4) {
    resolution = .5;
    el.textContent = 'Res(.5)';
} else if (resolution === .5) {
    resolution = .6;
    el.textContent = 'Res(.6)';
} else if (resolution === .6) {
    resolution = .7;
    el.textContent = 'Res(.7)';
} else if (resolution === .7) {
    resolution = .8;
    el.textContent = 'Res(.8)';
} else if (resolution === .8) {
    resolution = .9;
    el.textContent = 'Res(.9)';
} else if (resolution === .9) {
    resolution = 1;
    el.textContent = 'Res(1)';
}

    unitSprites = {};
resize();
window.statusBar();
};
window.bots = function () {
var bots = prompt("quantidade de bot")
for (let i = 0; i < bots; i++) {
window.open("http://bloble.io/?l="+partyKey)}}
window.sellhouse = function () {venderhouse();}
window.sellgens = function () {vendergens();}
window.upgens = function () {upgens();}
window.upbarracks = function () {upbarrack();}
window.buildAT = function () {buildAT();}

//funções//
function CeS() {selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); unit.info.name !== 'Siege Ram' && selUnits.push(unit)  } });  selUnitType = "Unit";}
function Com() {selUnits = []; units.every((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Commander') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit";}
function Sol() {selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Soldier') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }
function Gens() {socket.emit("1", 4.73, 245, 3); socket.emit("1", 5.0025, 245, 3); socket.emit("1", 5.275, 245, 3); socket.emit("1", 5.5475, 245, 3); socket.emit("1", 5.82, 245, 3); socket.emit("1", 6.0925, 245, 3); socket.emit("1", 6.365, 245, 3); socket.emit("1", 6.6375, 245, 3); socket.emit("1", 6.91, 245, 3); socket.emit("1", 7.1825, 245, 3); socket.emit("1", 7.455, 245, 3); socket.emit("1", 7.7275, 245, 3); socket.emit("1", 8.0025, 245, 3); socket.emit("1", 8.275, 245, 3); socket.emit("1", 8.5475, 245, 3); socket.emit("1", 8.82, 245, 3); socket.emit("1", 9.0925, 245, 3); socket.emit("1", 9.3675, 245, 3); socket.emit("1", 9.64, 245, 3); socket.emit("1", 9.9125, 245, 3); socket.emit("1", 10.1875, 245, 3); socket.emit("1", 10.4625, 245, 3); socket.emit("1", 10.7375, 245, 3); socket.emit("1", 5.999, 180, 3); socket.emit("1", 6.275, 130, 3); socket.emit("1", 6.51, 185, 3); socket.emit("1", 6.775, 130, 3); socket.emit("1", 7.05, 185, 3); socket.emit("1", 7.3, 130, 3); socket.emit("1", 7.6, 185, 3); socket.emit("1", 7.85, 130, 3); socket.emit("1", 8.15, 185, 3); socket.emit("1", 8.4, 130, 3); socket.emit("1", 8.675, 185, 3); socket.emit("1", 8.925, 130, 3); socket.emit("1", 9.225, 185, 3); socket.emit("1", 9.5, 130, 3); socket.emit("1", 9.78, 185, 3); socket.emit("1", 10.05, 130, 3); socket.emit("1", 10.325, 185, 3); socket.emit("1", 10.6, 130, 3); socket.emit("1", 4.5889, 186.5, 3); socket.emit("1", 4.81, 130, 3); socket.emit("1", 5.085, 180.5, 3); socket.emit("1", 5.36, 130, 3); socket.emit("1", 5.64, 180, 3);}
function BaseZ() {socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}
function BaseX() {socket.emit("1", 7.86, 311, 1); socket.emit("1", 8.06, 311, 1); socket.emit("1", 8.26, 311, 1); socket.emit("1", 8.46, 311, 1); socket.emit("1", 8.66, 311, 1); socket.emit("1", 8.86, 311, 1); socket.emit("1", 9.06, 311, 1); socket.emit("1", 9.26, 311, 1); socket.emit("1", 9.46, 311, 1); socket.emit("1", 9.66, 311, 1); socket.emit("1", 9.86, 311, 1); socket.emit("1", 10.28, 311, 1); socket.emit("1", 10.70, 311, 1); socket.emit("1", 10.90, 311, 1); socket.emit("1", 11.10, 311, 1); socket.emit("1", 11.30, 311, 1); socket.emit("1", 11.72, 311, 1); socket.emit("1", 12.14, 311, 1); socket.emit("1", 12.34, 311, 1); socket.emit("1", 12.54, 311, 1); socket.emit("1", 12.74, 311, 1); socket.emit("1", 12.94, 311, 1); socket.emit("1", 13.14, 311, 1); socket.emit("1", 13.34, 311, 1); socket.emit("1", 13.54, 311, 1); socket.emit("1", 13.74, 311, 1); socket.emit("1", 13.94, 311, 1); socket.emit("1", 10.07, 311, 1); socket.emit("1", 10.49, 311, 1); socket.emit("1", 11.51, 311, 1); socket.emit("1", 11.93, 311, 1); socket.emit("1", 4.8625, 245, 1); socket.emit("1", 5.1125, 245, 1); socket.emit("1", 5.3625, 245, 1); socket.emit("1", 5.6125, 245, 1); socket.emit("1", 5.8625, 245, 1); socket.emit("1", 6.1125, 245, 1); socket.emit("1", 6.3625, 245, 1); socket.emit("1", 6.6125, 245, 1); socket.emit("1", 6.8625, 245, 1); socket.emit("1", 7.14, 245, 1); socket.emit("1", 7.39, 245, 1); socket.emit("1", 7.64, 246, 1); socket.emit("1", 7.89, 246, 1); socket.emit("1", 8.14, 246, 1); socket.emit("1", 8.39, 246, 1); socket.emit("1", 8.635, 246, 1); socket.emit("1", 8.885, 246, 1); socket.emit("1", 2.5825, 245, 1); socket.emit("1", 2.8625, 245, 1); socket.emit("1", 3.1125, 245, 1); socket.emit("1", 3.3625, 245, 1); socket.emit("1", 3.6125, 245, 1); socket.emit("1", 3.8625, 245, 1); socket.emit("1", 4.1125, 245, 1); socket.emit("1", 4.3625, 245, 1); socket.emit("1", 4.6125, 245, 1); socket.emit("1", 4.726, 190, 1); socket.emit("1", 5.725, 190, 1); socket.emit("1", 2.75, 190, 1); socket.emit("1", 3.74, 190, 1); socket.emit("1", 5.725, 190, 1); socket.emit("1", 2.75, 190, 1); socket.emit("1", 6.7215, 189.5, 1); socket.emit("1", 5.06, 185, 1); socket.emit("1", 5.4, 185, 1); socket.emit("1", 6.045, 186, 1); socket.emit("1", 6.374, 185, 1); socket.emit("1", 5.4, 185, 1); socket.emit("1", 7.0425, 188.5, 1); socket.emit("1", 7.365, 185, 1); socket.emit("1", 7.712, 187.45, 1); socket.emit("1", 8.035, 188.5, 1); socket.emit("1", 8.36, 185, 1); socket.emit("1", 2.425, 188, 1); socket.emit("1", 3.075, 184, 1); socket.emit("1", 5.06, 185, 1); socket.emit("1", 3.42, 186, 1); socket.emit("1", 3.74, 190, 1); socket.emit("1", 4.06, 186, 1); socket.emit("1", 4.39, 185, 1); socket.emit("1", 4.725, 130, 1); socket.emit("1", 5.245, 130, 1); socket.emit("1", 5.715, 130, 1); socket.emit("1", 6.185, 130, 1); socket.emit("1", 6.655, 130, 1); socket.emit("1", 7.13, 130, 1); socket.emit("1", 7.6, 130, 1); socket.emit("1", 1.85, 130, 1); socket.emit("1", 2.32, 130, 1); socket.emit("1", 2.79, 130, 1); socket.emit("1", 3.265, 130, 1); socket.emit("1", 3.735, 130, 1); socket.emit("1", 4.205, 130, 1);}
function Micro() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1);}
function Commander() {socket.emit("4",0,0,1);}
function SellWall() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)}
function Centralizar() {if(player.x==null){player.x==0};if(player.y==null){player.y==0};for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}
function Dpk() {for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}}
function DefendDpk() {for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,1);}for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,1);}for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,1);}for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}}
function vender() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)};
function reconstruir() {socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);}
function upDpk() {for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1);for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0);for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1);}
function venderhouse(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);socket.emit("3", a);}
function vendergens(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Generator' && a.push(units[d].id);socket.emit("3", a);for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Power Plant' && a.push(units[d].id);socket.emit("3", a)}
function upgens(){for(i=0;i<units.length;++i){if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){socket.emit("4",units[i].id,0);}}}
function upbarrack() {for (i = 0; i < units.length; ++i) {if (2 === units[i].type && "square" == units[i].shape && units[i].owner == player.sid) {socket.emit("4", units[i].id, 0);}}}
function buildAT() {socket.emit('1',-1.3199892037085443,243.84945929814975,5);socket.emit('1',-1.7999896546591665,243.84659296369102,5);socket.emit('1',-0.7400025342187257,243.85657936582308,5);socket.emit('1',-1.0299900119965648,243.8487114995689,5);socket.emit('1',-2.3800043480588884,243.84417831886003,5);socket.emit('1',-2.0900238258029606,243.84856796790913,5);socket.emit('1',-1.5600048680308953,211.2823023823813,2);socket.emit('1',1.5899892447705761,243.85491280677533,5);socket.emit('1',1.2500054152201776,243.84966721322377,5);socket.emit('1',1.9199912744348302,243.84651279032056,5);}

function baseDPK(){
setTimeout(function(){ gens2();},1000);setTimeout(function(){ gens2();},10000);setTimeout(function(){ gens2();},20000);setTimeout(function(){ gens2();},30000);setTimeout(function(){ gens2();},50000);setTimeout(function(){ gens2();},55000);setTimeout(function(){ power();},70000);setTimeout(function(){ power();},80000);setTimeout(function(){ power();},90000);setTimeout(function(){ power();},100000);setTimeout(function(){ power();},110000);setTimeout(function(){ power();},120000);setTimeout(function(){ power();},130000);setTimeout(function(){ power();},140000);setTimeout(function(){ wall();},144000);setTimeout(function(){ walls();},146000);setTimeout(function(){ upwalls();},170000);setTimeout(function(){ upwalls2();},255000);setTimeout(function(){ barraca();},305000);setTimeout(function(){ vendergens();},355000);setTimeout(function(){ house();},356000);setTimeout(function(){ venderhouse();},432000);setTimeout(function(){ gens();},433000);setTimeout(function(){ siege();},434000);setTimeout(function(){ walls();},435000);setTimeout(function(){ upwalls();},436000);setTimeout(function(){ upwalls2();},437000);setTimeout(function(){ selecionar2();},438000);setTimeout(function(){ centralizarr2();},439000);setTimeout(function(){ power();},440000);setTimeout(function(){ turrets();},441000);setTimeout(function(){ upturrets();},451000);setTimeout(function(){ upturrets2();},500000);setTimeout(function(){ commander();},600000);
function micro(){for (var i = 0; i < units.length; ++i) 3== units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}
function vendergens(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Generator' && a.push(units[d].id);socket.emit("3", a);for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Power Plant' && a.push(units[d].id);socket.emit("3", a)}
function barraca(){for(i=0;i<units.length;++i){if(2===units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){socket.emit("4",units[i].id,2);}}}
function venderhouse(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);socket.emit("3", a);}
function siege(){for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 2 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Siege Factory') && a.push(units[d].id)}}socket.emit("3", a)}
function wall(){socket.emit("1",10.07,311,8);}
function gens2(){socket.emit("1",4.73,245,3); socket.emit("1",5.0025,245,3); socket.emit("1",5.275,245,3); socket.emit("1",5.5475,245,3); socket.emit("1",5.82,245,3); socket.emit("1",6.0925,245,3); socket.emit("1",6.365,245,3); socket.emit("1",6.6375,245,3); socket.emit("1",6.91,245,3); socket.emit("1",7.1825,245,3); socket.emit("1",7.455,245,3); socket.emit("1",7.7275,245,3); socket.emit("1",8.0025,245,3); socket.emit("1",8.275,245,3); socket.emit("1",8.5475,245,3); socket.emit("1",8.82,245,3); socket.emit("1",9.0925,245,3); socket.emit("1",9.3675,245,3); socket.emit("1",9.64,245,3); socket.emit("1",9.9125,245,3); socket.emit("1",10.1875,245,3); socket.emit("1",10.4625,245,3); socket.emit("1",10.7375,245,3); socket.emit("1",4.5889,186.5,3); socket.emit("1",5.085,180.5,3); socket.emit("1",5.64,180,3); socket.emit("1",5.999,180,3); socket.emit("1",6.51,185,3); socket.emit("1",7.05,185,3); socket.emit("1",7.6,185,3); socket.emit("1",8.15,185,3); socket.emit("1",8.675,185,3); socket.emit("1",9.225,185,3); socket.emit("1",9.78,185,3); socket.emit("1",10.325,185,3); socket.emit("1",4.81,130,3); socket.emit("1",5.36,130,3); socket.emit("1",6.275,130,3); socket.emit("1",6.775,130,3); socket.emit("1",7.3,130,3); socket.emit("1",7.85,130,3); socket.emit("1",8.4,130,3); socket.emit("1",8.925,130,3); socket.emit("1",9.5,130,3); socket.emit("1",10.05,130,3); socket.emit("1",10.6,130,3); }
function house(){socket.emit("1",5.245,130,4); socket.emit("1",5.715,130,4); socket.emit("1",6.185,130,4); socket.emit("1",6.655,130,4); socket.emit("1",7.13,130,4); socket.emit("1",7.6,130,4); socket.emit("1",1.85,130,4); socket.emit("1",2.32,130,4); socket.emit("1",2.79,130,4); socket.emit("1",3.265,130,4); socket.emit("1",3.735,130,4); socket.emit("1",4.205,130,4); socket.emit("1",5.06,185,4); socket.emit("1",5.4,185,4); socket.emit("1",5.725,190,4); socket.emit("1",6.045,186,4); socket.emit("1",6.374,185,4); socket.emit("1",6.7215,189.5,4); socket.emit("1",7.0425,188.5,4); socket.emit("1",7.365,185,4); socket.emit("1",7.712,187.45,4); socket.emit("1",8.035,188.5,4); socket.emit("1",8.36,185,4); socket.emit("1",2.425,188,4); socket.emit("1",2.75,190,4); socket.emit("1",3.075,184,4); socket.emit("1",3.42,186,4); socket.emit("1",3.74,190,4); socket.emit("1",4.06,186,4); socket.emit("1",4.39,185,4); socket.emit("1",4.8625,245,4); socket.emit("1",5.1125,245,4); socket.emit("1",5.3625,245,4); socket.emit("1",5.6125,245,4); socket.emit("1",5.8625,245,4); socket.emit("1",6.1125,245,4); socket.emit("1",6.3625,245,4); socket.emit("1",6.6125,245,4); socket.emit("1",6.8625,245,4); socket.emit("1",7.14,245,4); socket.emit("1",7.39,245,4); socket.emit("1",7.64,246,4); socket.emit("1",7.89,246,4); socket.emit("1",8.14,246,4); socket.emit("1",8.39,246,4); socket.emit("1",8.635,246,4); socket.emit("1",8.885,246,4); socket.emit("1",2.5825,245,4); socket.emit("1",2.8625,245,4); socket.emit("1",3.1125,245,4); socket.emit("1",3.3625,245,4); socket.emit("1",3.6125,245,4); socket.emit("1",3.8625,245,4); socket.emit("1",4.1125,245,4); socket.emit("1",4.3625,245,4); socket.emit("1",4.6125,245,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1);}
function power(){for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
function selecionar2() {selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Siege Ram') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }
function centralizarr2() {if(player.x==null){player.x==0 };if(player.y==null){player.y==0 };for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)+40)*1, ((player.y))*1, e, 0, -1);for (var e = [], b = 0; b < Math.floor(selUnits.length-1); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)+40)*1, e, 0, -1);for (var e = [], b = 0; b < Math.floor(selUnits.length-2); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x)-40)*1, ((player.y))*1, e, 0, -1);for (var e = [], b = 0; b < Math.floor(selUnits.length-3); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-40)*1, e, 0, -1);}
function gens(){for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}}
function upgens(){for(i=0;i<units.length;++i){if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){socket.emit("4",units[i].id,0);}}}
function turrets(){for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}}
function upturrets(){for(i=0;i<units.length;++i){if(0===units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){socket.emit("4",units[i].id,1);}}}
function upturrets2(){for(i=0;i<units.length;++i){if(0===units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){socket.emit("4",units[i].id,0);}}}
function walls(){for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}}
function upwalls(){for(i=0;i<units.length;++i){if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){socket.emit("4",units[i].id,0);}}}
function upwalls2(){for(i=0;i<units.length;++i){if(3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){socket.emit("4",units[i].id,0);}}}
function sellmicro(){for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Micro Generator' && a.push(units[d].id);socket.emit("3", a)}
}

function baseATK(){
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
function centralizar1() {if(player.x==null){player.x==0};if(player.y==null){player.y==0};for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-150)*1, e, 0, -1);}
function centralizar2() {if(player.x==null){player.x==0};if(player.y==null){player.y==0};for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);}
function centralizar3() {if(player.x==null){player.x==0};if(player.y==null){player.y==0};for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", ((player.x))*1, ((player.y)-140)*1, e, 0, -1);}
}
//Teclas//
addEventListener("keydown", function(a){
if(a.keyCode == 69){CeS();}
if(a.keyCode == 67){Com();}
if(a.keyCode == 81){Sol();}
if(a.keyCode == 120){Gens();}
if(a.keyCode == 90){BaseZ();}
if(a.keyCode == 88){BaseX();}
if(a.keyCode == 98){Micro();}
if(a.keyCode == 67){Commander();}
if(a.keyCode == 96){SellWall();}
if(a.keyCode == 194){Centralizar();}
if(a.keyCode == 33){Dpk();}
if(a.keyCode == 34){DefendDpk();}
if(a.keyCode == 97){setTimeout(function() {vender();},20);setTimeout(function() {reconstruir();},30);}
if(a.keyCode == 16){if (selUnits.length) {var a = player.x + targetDst * MathCOS(targetDir) + camX,d = player.y + targetDst * MathSIN(targetDir) + camY;for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -1)}}
if(a.keyCode == 111){baseATK();}
if(a.keyCode == 106){baseDPK();}
if(a.keyCode == 121){upDpk();}
})


//Instafind//
var gotoUsers = [];var gotoIndex = 0;
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || {};
window.overrideSocketEvents.push({name: "l",description: "Leaderboard Insta Find override",func: function(a) {var d = "",c = 1,b = 0;for (; b < a.length;) {d += "<div class='leaderboardItem' onclick=goto2(" + a[b] + ");><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;}leaderboardList.innerHTML = d;}});leaderboardList.style.pointerEvents = 'auto';chatListWrapper.style.pointerEvents = 'auto';
window.goto = function(username) {gotoUsers = users.filter((user) => {return user.name === username});gotoIndex = 0;if (gotoUsers[0]) {camX = gotoUsers[0].x - player.x;camY = gotoUsers[0].y - player.y;}addChat(gotoUsers.length + ' users found with the name ' + username, 'Client');return gotoUsers.length;}
window.goto2 = function(id, go) {gotoUsers = users.filter((user) => {return user.sid === id;});gotoIndex = 0;if (!go && gotoUsers[0]) {camX = gotoUsers[0].x - player.x;camY = gotoUsers[0].y - player.y;}return gotoUsers.length;}
window.resetCamera = function() {camX = camXS = camY = camYS = 0;cameraKeys = {l: 0,r: 0,u: 0,d: 0};if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
window.overrideSocketEvents.forEach((item) => {socket.removeAllListeners(item.name);socket.on(item.name, item.func);});}}
window.addChatLine = function(a, d, c) {if (player) {var b = getUserBySID(a);if (c || 0 <= b) {var g = c ? "SERVER" : users[b].name;c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];player.sid == a && (c = "#fff");b = document.createElement("li");b.className = player.sid == a ? "chatme" : "chatother";b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>[' + g + ']</span> <span class="chatText">' + d + "</span>";10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);chatList.appendChild(b)}}}
//Hotbar//
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

    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
    background-color: #00095970;\n\
    margin-left: 3px;\n\
    border-radius:4px;\n\
    pointer-events:all\n\
}\n\
#noobscriptUI {\n\
    top: -" + (height + 12) + "px;\n\
    transition: 1s;\n\
    margin-left:10px;\n\
    position:absolute;\n\
    padding-left:24px;\n\
    border: 4px solid #000959 ;\n\
    margin-top:9px;\n\
    padding-top:15px;\n\
    width:640px;\n\
    height: " + height + "px;\n\
    font-family:arial;\n\
    left:12%\n\
}\n\
#noobscriptUI:hover{\n\
    top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
    color:#fff;\n\
    padding:7px;\n\
    height:19px;\n\
    display:inline-block;\n\
    background-color: #000;\n\
    border: 2px solid #000959 ;\n\
    cursor:pointer;\n\
    font-size:15px\n\
}\n\
</style>"

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
            text.push(item.value());
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
}, 1000);

/*Zoom*/
cameraSpd *=1.5
var scroll = 0;
zoom  = function(a) {
    a = window.event || a;
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail));
    -1 == scroll ? 50000 > maxScreenHeight && (maxScreenHeight += 130,
    maxScreenWidth += 130,
    resize(),
    scroll = 0) : 1 == scroll && 150 < maxScreenHeight && (maxScreenHeight -= 130,
    maxScreenWidth -= 130,
    resize(),
    scroll = 0)
}
mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);
window.addEventListener("mousemove", gameInput, !1);
window.addEventListener('keyup', function (a) {a = a.keyCode ? a.keyCode : a.which;if (a == 107) {(maxScreenHeight = 15000, maxScreenWidth = 30000, resize(true));};if (a == 109) {(maxScreenHeight = 1080, maxScreenWidth = 1920, resize(true));};});

//Tropas Círculares//
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
	    	shape: "circle",
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
	    	shape: "circle",
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