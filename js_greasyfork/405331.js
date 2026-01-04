// ==UserScript==
// @name         Op bloble.io hack (private)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Op bloble.io hack
// @author       John Dave
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405331/Op%20blobleio%20hack%20%28private%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405331/Op%20blobleio%20hack%20%28private%29.meta.js
// ==/UserScript==

$("#youtuberOf").hide();
$("#youtubeFollow").hide();
$("#adCard").hide();
$("#mobileInstructions").hide();
$("#promoImgHolder").hide();
$("#downloadButtonContainer").hide();
$("#mobileDownloadButtonContainer").hide();
$(".downloadBadge").hide();

//anti-kick
setInterval(function(){if(window.socket){window.socket.emit("2",window.camX,window.camY)}},200000)

//base transparente :)
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

//EVEN MORE THEME AAAAAAAAAAAAAAAAA
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
var theme = 1;

window.UIList.push({
    level: 0,
    x: 1,
    html: '<div id="eme" onclick=setTheme()>Classic</div>'
});

window.setTheme = function () {
    var el = document.getElementById('eme');
    if (theme === 1) {
        theme = 2;
        backgroundColor = "#ebebeb";
        outerColor="#d6d6d6";
        indicatorColor ="rgba(0,0,0,0.08)";
        redColor = "rgba(255, 0, 0, 0.1)";
        el.textContent = 'Classic';
    } else if (theme === 2) {
        theme = 3;
        backgroundColor = "#09090f";
        outerColor = "#05060b";
        indicatorColor = "#878787";
        redColor = "rgba(255, 0, 0, 0.5)";
        el.textContent = 'Dark';
    } else if (theme === 3) {
        theme = 4;
        backgroundColor = "#000000";
        outerColor = "#0b0b0b";
        indicatorColor = "rgba(255, 255, 0, 0.8)";
        redColor = "rgba(255, 0, 0, 0.8)";
        el.textContent = 'Neon';
    } else if (theme === 4) {
        theme = 5;
        backgroundColor = "#dbdbdb";
        outerColor = "#c5c5c5";
        indicatorColor = "#d2d2d2";
        redColor = "#bebebe";
        el.textContent = 'Arras';
    } else if (theme === 5) {
        theme = 6;
        backgroundColor = "#bfd6e9";
        outerColor = "#debe85";
        indicatorColor = "rgba(0, 0, 255, 0.1)";
        redColor = "rgba(0, 0, 255, 0.3)";
        el.textContent = 'Beach';
    } else if (theme === 6) {
        theme = 7;
        backgroundColor = "#a6cae8";
        outerColor = "#293e8c";
        indicatorColor = "rgba(255, 255, 255, 0.2)";
        redColor = "rgba(255, 255, 255, 0.4)";
        el.textContent = 'Ocean';
    } else if (theme === 7) {
        theme = 8;
        backgroundColor = "#010a01";
        outerColor = "#010700";
        indicatorColor = "rgba(0, 255, 0, 0.3)";
        redColor = "rgba(255, 0, 0, 0.3)";
        el.textContent = 'Matrix';
    } else if (theme === 8) {
        theme = 9;
        backgroundColor = "#000000";
        outerColor = "#000000";
        indicatorColor = "rgba(255, 255, 255, 0.05)";
        redColor = "rgba(255, 255, 255, 0.2)";
        el.textContent = 'Space';
    } else if (theme === 9) {
        theme = 10;
        backgroundColor = "#f4c254";
        outerColor = "#f47602";
        indicatorColor = "rgba(54, 53, 34, 0.5)";
        redColor = "rgba(54, 53, 34, 0.8)";
        el.textContent = 'Desert';
    } else {
        theme = 1;
        backgroundColor = "#f78031";
        outerColor = "#5b1305";
        indicatorColor = "rgba(0, 0, 0, 0.1)";
        redColor = "rgba(0, 0, 0, 0.3)";
        el.textContent = 'UnderWorld';
    }
    window.statusBar();
}

//Resolution chooser.
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
var resolution = 1;

window.removeEventListener("mousemove", gameInput);

window.gameInput = function (a) {
    a.preventDefault();
    a.stopPropagation();
    mouseX = a.clientX * resolution;
    mouseY = a.clientY * resolution;
}
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
    }

    mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, Math.floor((screenWidth - maxScreenWidth * scaleFillNative) / 2), Math.floor((screenHeight - maxScreenHeight * scaleFillNative) / 2));
    player || renderBackground()
}
window.addEventListener("resize", resize);
window.statusItems.push({
    order: 4,
    name: 'Resolution',
    value: function () {
        return document.getElementById('res').textContent;
    }
});
window.UIList.push({
    level: 0,
    x: 2,
    html: '<div id="res" onclick=setRes()>Normal Res</div>'
});

window.setRes = function () {
    var el = document.getElementById('res');
    if (resolution === 2) {
        resolution = .4;
        el.textContent = 'Low Res';
    } else if (resolution === .4) {
        resolution = .8;
        el.textContent = 'Med Res';
    } else if (resolution === .8) {
        resolution = 1;
        el.textContent = 'Normal Res';
    } else if (resolution === 1) {
        resolution = 1.5;
        el.textContent = 'High Res';
    } else {
        resolution = 2;
        el.textContent = 'Max Res';
    }
    unitSprites = {};
    resize();
    window.statusBar();
}

//Troop join, save base, load base, changelog and some game changes
var css = document.createElement("style")
css.innerText = `
#joinTroopContainer {
    display: inline-block;
	padding: 10px;
	background-color: rgba(40, 40, 40, 0.5);
	font-family: 'regularF';
	font-size: 20px;
	border-radius: 4px;
	color: #fff;
}
#chatBox {
    FONT-VARIANT-EAST-ASIAN: JIS83;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 350px;
    overflow: hidden;
}
#Changelog {
    position: absolute;
    display: inline-block;
    width: 630px;
    height: 220px;
    padding-top: 8px;
    padding-left: 8px;
    text-align: left;
	background-color: #4d4d4d;
	font-family: 'regularF';
	font-size: 18px;
	border-radius: 8px;
	color: #d6d6d6;
    margin-left: 25px;
    margin-top: 150px;
}
#work {
    position: absolute;
    display: inline-block;
    width: 400px;
    height: 500px;
    padding-top: 14px;
    padding-left: 210px;
    text-align: left;
	background-color: #737373;
    front-position: middle
	font-family: 'regularF';
	font-size: 24px;
	color: #d0d0d0;
    margin-left: 56px;
    margin-top: 45px;
}
#skinSelector {
    display: none;
    font-family: 'regularF';
    font-size: 26px;
    padding: 6px;
    padding-left: 12px;
    padding-right: 12px;
    border: none;
    border-radius: 8px;
    background-color: blank;
    color: #fff;
    cursor: pointer;
}
#enterGameButton {
    font-family: 'regularF';
    font-size: 26px;
    padding: 5px;
    color: #fff;
    background-color: #d6d6d6;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    border-radius: 8px;
}
#gameTitle {
    color: #d6d6d6;
    font-size: 90px;
    width: 100%;
    text-align: center;
    font-family: 'regularF';
}
#skinInfo {
    position: absolute;
    display: none;
    text-align: left;
    width: 110px;
    margin-left: -140px;
    padding: 6px;
    padding-top: 7px;
    padding-left: 16px;
    color: #fff;
    border-radius: 8px;
    background-color: rgba(40, 40, 40, 0.5);
    font-family: 'regularF';
    font-size: 15px;
}
.unitItem {
    pointer-events: all;
    margin-left: 18px;
    position: relative;
    display: inline-block;
    width: 69px;
    height: 65px;
    background-color: rgba(40, 40, 40, 0.5);
    border-radius: 8px;
    cursor: pointer;
}
#scoreContainer {
    display: inline-block;
    padding: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    font-family: 'regularF';
    font-size: 20px;
    border-radius: 4px;
    color: #fff;
}
#leaderboardContainer {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    font-family: 'regularF';
    font-size: 24px;
    border-radius: 4px;
    color: #fff;
}
`
document.head.appendChild(css)

var loadedBase = null;
var defendInterval = null
var joinEnabled = false
var joinTroopsDiv = document.createElement("div")
joinTroopsDiv.id = "joinTroopContainer"
document.getElementById("statContainer").appendChild(joinTroopsDiv)
joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")

function buildLoadedBase(){
    for(var i=0;i<loadedBase.length;i++){
        var building = loadedBase[i];
        socket.emit("1",building.dir,building.dst,building.uPath[0]);
    }
};
function startDefend(){
    if(defendInterval!=null){return}
    defendInterval = setInterval(function(){
        for(var i=0;i<loadedBase.length;i++){
            var building = loadedBase[i];
            socket.emit("1",building.dir,building.dst,1);
        }
    },200000/2000)
}
function stopDefend(){
    clearInterval(defendInterval)
    defendInterval = null
}
function saveBase(userSid){
    var user = users[getUserBySID(userSid)];
    var base = [];
    for(var i=0;i<units.length;i++){
        if(units[i].owner == userSid && units[i].type!=1){
            var unit = units[i];
            base.push({
                dir:UTILS.getDirection(unit.x,unit.y,user.x,user.y),
                x:UTILS.roundToTwo(unit.x-user.x),
                y:UTILS.roundToTwo(unit.y-user.y),
                dst:UTILS.getDistance(user.x,user.y,unit.x,unit.y),
                uPath:unit.uPath,
            });
        }
    }
    localStorage.setItem("base_"+prompt("Type the base name:"),JSON.stringify(base))
};
function loadBase(){
    loadedBase = JSON.parse(localStorage.getItem("base_"+prompt("Type the base name:")))
}
window.addEventListener("keypress",function(event){
    if(document.activeElement == mainCanvas){
        if(loadedBase&&loadedBase.length){
            if(event.key == "l"){
                buildLoadedBase()
            }
            if(event.key == "l"){
                buildLoadedBase()
            }
            else if(event.key == "p"){
                startDefend()
            }
            else if(event.key == "p"){
                startDefend()
            }
        }
        if(event.key == "j"){
            joinEnabled = !joinEnabled
            joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")
        }
        else if(event.key=="m"){
            loadNextTheme()
        }
    }
})
window.addEventListener("keyup",function(event){
    if(event.key == "o"){
        if(defendInterval!=null){
            stopDefend()
        }
    }
})
window.addEventListener("keyup",function(event){
    if(event.key == "o"){
        if(defendInterval!=null){
            stopDefend()
        }
    }
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
            desc:"Load a base, press L to build and hold P to defend",
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
a[1],kills:0,typeName:"Base"};null!=c?(users[c]=b,d&&(player=users[c])):(users.push(b),d&&(player=users[users.length-1]))}});socket.on("klUser",function(a){var d=getUserBySID(a);null!=d&&(users[d].dead=!0);player&&player.sid==a&&(hideMainMenuText(),leaveGame())});socket.on("delUser",function(a){a=getUserBySID(a);null!=a&&users.splice(a,1)});socket.on("au",function(a){a&&(units.push({id:a[0],owner:a[1],uPath:a[2]||0,type:a[3]||0,color:a[4]||0,paths:a[5],x:a[6]||0,sX:a[6]||0,y:a[7]||0,sY:a[7]||0,dir:a[8]||
0,turRot:a[8]||0,speed:a[9]||0,renderIndex:a[10]||0,turretIndex:a[11]||0,range:a[12]||0,cloak:a[13]||0}),units[units.length-1].speed&&(units[units.length-1].startTime=window.performance.now()),a=getUnitFromPath(units[units.length-1].uPath))&&(units[units.length-1].size=a.size,units[units.length-1].shape=a.shape,units[units.length-1].layer=a.layer,units[units.length-1].renderIndex||(units[units.length-1].renderIndex=a.renderIndex),units[units.length-1].range||(units[units.length-1].range=a.range),
units[units.length-1].turretIndex||(units[units.length-1].turretIndex=a.turretIndex),units[units.length-1].iSize=a.iSize)});socket.on("spa",function(a,d,c,b){a=getUnitById(a);if(null!=a){var g=UTILS.getDistance(d,c,units[a].x||d,units[a].y||c);300>g&&g?(units[a].interpDst=g,units[a].interpDstS=g,units[a].interpDir=UTILS.getDirection(d,c,units[a].x||d,units[a].y||c)):(units[a].interpDst=0,units[a].interpDstS=0,units[a].interpDir=0,units[a].x=d,units[a].y=c);units[a].interX=0;units[a].interY=0;units[a].sX=
units[a].x||d;units[a].sY=units[a].y||c;b[0]&&(units[a].dir=b[0],units[a].turRot=b[0]);units[a].paths=b;units[a].startTime=window.performance.now()}});socket.on("uc",function(a,d){unitList&&(unitList[a].count=d);forceUnitInfoUpdate=!0});socket.on("uul",function(a,d){unitList&&(unitList[a].limit+=d)});socket.on("rpu",function(a,d){var c=getUnitFromPath(a);c&&(c.dontShow=d,forceUnitInfoUpdate=!0)});socket.on("sp",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].spawnProt=d)});socket.on("ab",function(a){a&&
bullets.push({x:a[0],sX:a[0],y:a[1],sY:a[1],dir:a[2],speed:a[3],size:a[4],range:a[5]})});socket.on("uu",function(a,d){if(void 0!=a&&d){var c=getUnitById(a);if(null!=c)for(var b=0;b<d.length;)units[c][d[b]]=d[b+1],"dir"==d[b]&&(units[c].turRot=d[b+1]),b+=2}});socket.on("du",function(a){a=getUnitById(a);null!=a&&units.splice(a,1)});socket.on("sz",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].size=d)});socket.on("pt",function(a){scoreContainer.innerHTML="Power <span class='greyMenuText'>"+a+
"/6000</span>"});socket.on("l",function(a){for(var d="",c=1,b=0;b<a.length;)d+="<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>"+c+".</div> <div class='"+(player&&a[b]==player.sid?"leaderYou":"leader")+"'>"+a[b+1]+"</div><div class='scoreText'>"+a[b+2]+"</div></div>",c++,b+=3;leaderboardList.innerHTML=d})}


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
0>units.indexOf(selUnits[e])&&disableSelUnit(e);activeUnit&&renderUnit(h,f,k,activeUnit,playerColors[player.color],mainContext);showSelector&&(mainContext.fillStyle="rgba(0, 0, 0, 0.1)",h=player.x-d+targetDst*MathCOS(targetDir)+camX,f=player.y-c+targetDst*MathSIN(targetDir)+camY,mainContext.fillRect(mouseStartX,mouseStartY,h-mouseStartX,f-mouseStartY));playerBorderRot+=a/5600;hoverUnit?toggleUnitInfo(hoverUnit):activeBase?toggleUnitInfo(activeBase,true):activeUnit?toggleUnitInfo(activeUnit):
0<selUnits.length?toggleUnitInfo(selUnits[0].info,!0):toggleUnitInfo()}};
console.log()

var workDiv = document.createElement("div");workDiv.id = "work";document.getElementById("skinInfo").appendChild(workDiv);workDiv.innerText = ("'It just works'")

//Current version
var ChangelogDiv = document.createElement("div")
ChangelogDiv.id = "Changelog"
document.getElementById("skinInfo").appendChild(ChangelogDiv)
ChangelogDiv.innerText = ("Simple Bloble Hax\nCurrent version:\nv1.9.3\n\n---CHANGELOG---\n(1.9.3)\n>Improved Hybrid base\n(v1.9.21)\n>Generator base now have 47 instead of 46 generators")

//One-click auto defence/buy/upgrade and in-game information
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.autoDefense = false;
window.autoGens = false;
window.autoUpgrade = false;
window.autoHybrid = false;
window.UIList.push({
    level: 3,
    x: 1,
    html: '<div id=auto onclick=autodefense()>Auto Defense:Disabled</div>'
}, {
    level: 3,
    x: 2,
    html: '<div id=auto1 onclick=autogens()>Auto Buy Generators:Disabled</div>'
}, {
    level: 4,
    x: 1,
    html: '<div id=auto2 onclick=autoupgrade()>Auto Upgrade Powerplant/micro:Disabled</div>'
}, {
    level: 4,
    x: 2,
    html: '<div id=auto3 onclick=autohybrid()>Auto Upgrade(Hybrid):Disabled</div>'
}, {
    level: 0,
    x: 4,
    html: '<div id=help onclick=information()>[𝐢]</div>'
});

//In-game information
window.information = function () {
    var help = document.getElementById('help');
    alert(">INFORMATION<\nBASE BUILDER---\n>Generators : F9, F10 defend\n>Full House(179):F2, F7 defend\n>Gunner : F4, F7 defend\n>Hybrid : F6, F8 defend\n>Full House(159) + anti tank : Alpha9, Alpha0 defend\n\nHOT KEYS---\n>Q: All troos except Commander\n>E: Everything\n>C: Commander only\n>J: Toggle troop join ON or OFF\n\nADVANCED---\n>L: Load base\n>P: Start auto defend loaded base\n>O: Stop auto defend loaded base\n>INFORMATION<\n\nnow you can die lol");
}

//Auto defence
window.autodefense = function () {
    var elaa = document.getElementById('auto');
    if (autoDefense) {
        autoDefense = false
        elaa.textContent = 'Auto Defense:Disabled'
        clearInterval(teste)
    } else {
        autoDefense = true;
        elaa.textContent = 'Auto Defense:Enabled';
        window.teste = setInterval(autodefesa,200000/2000)
        function autodefesa() {
            defend()
        }
    }
    window.statusBar();
    return autoDefense()
}

//Auto buy generators
window.autogens = function () {
    var elaaa = document.getElementById('auto1');
    if (autoGens) {
        autoGens = false
        elaaa.textContent = 'Auto Buy Generators:Disabled'
        clearInterval(testee)
    } else {
        autoGens = true;
        elaaa.textContent = 'Auto Buy Generators:Enabled';
        window.testee = setInterval(autogense,1000)
        function autogense() {
            buildgen()
        }
    }
    window.statusBar();
    return autoGens()
}

//Auto upgrade micro/power plant
window.autoupgrade = function () {
    var elaaaa = document.getElementById('auto2');
    if (autoUpgrade) {
        autoUpgrade = false
        elaaaa.textContent = 'Auto Upgrade Powerplant/micro:Disabled'
        clearInterval(testeee)
    } else {
        autoUpgrade = true;
        elaaaa.textContent = 'Auto Upgrade Powerplant/micro:Enabled';
        window.testeee = setInterval(autoupgrades,1000)
        function autoupgrades() {
            for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1);for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
        }
    }
    window.statusBar();
    return autoUpgrade()
}

//Auto upgrade (Hybrid)
window.autohybrid = function () {
    var elaaaaa = document.getElementById('auto3');
    if (autoHybrid) {
        autoHybrid = false
        elaaaaa.textContent = 'Auto Upgrade (Hybrid):Disabled'
        clearInterval(testeeee)
    } else {
        autoHybrid = true;
        elaaaaa.textContent = 'Auto Upgrade (Hybrid):Enabled';
        window.testeeee = setInterval(autohybrids,1000)
        function autohybrids() {
            for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
        }
    }
    window.statusBar();
    return autoHybrid()
}

//chat focus
chatInput.onblur=function(){chatInput.isFocused=false;};
chatInput.onfocus=function(){chatInput.isFocused=true;};
chatInput.isFocused=false

//troop selection
window.addEventListener("keyup", function(a) {
    a = a.keyCode ? a.keyCode : a.which;

    if (a === 81) { // All troops except commander
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                unit.info.name !== 'Commander' && selUnits.push(unit)

            }
        });
        selUnitType = "Unit";
    } else if (a === 69) { // Everything
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                selUnits.push(unit)
            }
        });
        selUnitType = "Unit";
    } else if (a === 67) { // Commander
        selUnits = [];
        units.every((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                if (unit.info.name === 'Commander') {
                    selUnits.push(unit)
                    return false;
                }
            }
            return true;
        });
        selUnitType = "Unit";
    }
});

//base build
addEventListener("keydown", function(a) {
    if (chatInput.isFocused===false&&a.keyCode == 120) {
        buildgen()
    }
    if (chatInput.isFocused===false&&a.keyCode == 121) {
        defendgen()
    }
    if (chatInput.isFocused===false&&a.keyCode == 113) {
        fullhouse()
    }
    if (chatInput.isFocused===false&&a.keyCode == 115) {
        gunner()
    }
    if (chatInput.isFocused===false&&a.keyCode == 17) { //left ctrl
        defend()
    }
    if (chatInput.isFocused===false&&a.keyCode == 118) {
        defend()
    }
    if (chatInput.isFocused===false&&a.keyCode == 117) {
        hybrid()
    }
    if (chatInput.isFocused===false&&a.keyCode == 119) {
        defendhybrid()
    }
    if (chatInput.isFocused===false&&a.keyCode == 57) {
        tank()
    }
    if (chatInput.isFocused===false&&a.keyCode == 48) {
        defendtank()
    }
})
function buildgen(){socket.emit("1",-1.32,132,3);socket.emit("1",-1.82,132,3);socket.emit("1",-1.57,183.88,3);socket.emit("1",-1.44,243.85,3);socket.emit("1",-1.71,243.85,3);
socket.emit("1",-1.92,194.45,3);socket.emit("1",-2.11,243.85,3);socket.emit("1",-1.23,195.13,3);socket.emit("1",-1.03,243.85,3);socket.emit("1",-0.76,132,3);socket.emit("1",-2.38,132,3);
socket.emit("1",-2.31,195.63,3);socket.emit("1",-0.83,195.27,3);socket.emit("1",-0.63,243.85,3);socket.emit("1",-2.51,243.85,3);socket.emit("1",-2.78,243.85,3);socket.emit("1",-0.36,243.85,3);
socket.emit("1",-0.49,186,3);socket.emit("1",-0.26,132,3);socket.emit("1",-2.65,185.81,3);socket.emit("1",-0.15,194.38,3);socket.emit("1",-2.88,132,3);socket.emit("1",-2.99,194.38,3);
socket.emit("1",3.1,243.85,3);socket.emit("1",0.04,243.85,3);socket.emit("1",2.82,132,3);socket.emit("1",2.91,194.55,3);socket.emit("1",2.71,243.85,3);socket.emit("1",0.23,132,3);
socket.emit("1",0.24,196,3);socket.emit("1",0.44,243.85,3);socket.emit("1",2.44,243.85,3);socket.emit("1",2.57,185.57,3);socket.emit("1",2.32,132,3);socket.emit("1",2.23,195.77,3);
socket.emit("1",2.03,243.85,3);socket.emit("1",0.73,132,3);socket.emit("1",0.63,194.11,3);socket.emit("1",0.83,243.85,3);socket.emit("1",1.1,243.85,3);socket.emit("1",0.98,184.97,3);
socket.emit("1",1.22,132,3);socket.emit("1",1.37,243.85,3);socket.emit("1",1.47,183.36,3);socket.emit("1",1.72,132,3);socket.emit("1",1.84,193.89,3);socket.emit("1",1.64,243.85,3);
}function defendgen(){socket.emit("1",-1.32,132,1);socket.emit("1",-1.82,132,1);socket.emit("1",-1.57,183.88,1);socket.emit("1",-1.44,243.85,1);socket.emit("1",-1.71,243.85,1);socket.emit("1",-1.92,194.45,1);
socket.emit("1",-2.11,243.85,1);socket.emit("1",-1.23,195.13,1);socket.emit("1",-1.03,243.85,1);socket.emit("1",-0.76,132,1);socket.emit("1",-2.38,132,1);socket.emit("1",-2.31,195.63,1);
socket.emit("1",-0.83,195.27,1);socket.emit("1",-0.63,243.85,1);socket.emit("1",-2.51,243.85,1);socket.emit("1",-2.78,243.85,1);socket.emit("1",-0.36,243.85,1);socket.emit("1",-0.49,186,1);
socket.emit("1",-0.26,132,1);socket.emit("1",-2.65,185.81,1);socket.emit("1",-0.15,194.38,1);socket.emit("1",-2.88,132,1);socket.emit("1",-2.99,194.38,1);socket.emit("1",3.1,243.85,1);
socket.emit("1",0.04,243.85,1);socket.emit("1",2.82,132,1);socket.emit("1",2.91,194.55,1);socket.emit("1",2.71,243.85,1);socket.emit("1",0.23,132,1);socket.emit("1",0.24,196,1);
socket.emit("1",0.44,243.85,1);socket.emit("1",2.44,243.85,1);socket.emit("1",2.57,185.57,1);socket.emit("1",2.32,132,1);socket.emit("1",2.23,195.77,1);socket.emit("1",2.03,243.85,1);
socket.emit("1",0.73,132,1);socket.emit("1",0.63,194.11,1);socket.emit("1",0.83,243.85,1);socket.emit("1",1.1,243.85,1);socket.emit("1",0.98,184.97,1);socket.emit("1",1.22,132,1);
socket.emit("1",1.37,243.85,1);socket.emit("1",1.47,183.36,1);socket.emit("1",1.72,132,1);socket.emit("1",1.84,193.89,1);socket.emit("1",1.64,243.85,1);
}function fullhouse(){socket.emit("1",4.725,130,7);socket.emit("1",5.245,130,4);
socket.emit("1",5.715,130,4);socket.emit("1",6.185,130,4);socket.emit("1",6.655,130,4);socket.emit("1",7.13,130,4);socket.emit("1",7.6,130,4);socket.emit("1",1.85,130,4);
socket.emit("1",2.32,130,4);socket.emit("1",2.79,130,4);socket.emit("1",3.265,130,4);socket.emit("1",3.735,130,4);socket.emit("1",4.205,130,4);socket.emit("1",5.06,185,4);
socket.emit("1",5.4,185,4);socket.emit("1",5.725,190,4);socket.emit("1",6.045,186,4);socket.emit("1",6.374,185,4);socket.emit("1",6.7215,189.5,4);socket.emit("1",7.0425,188.5,4);
socket.emit("1",7.365,185,4);socket.emit("1",7.712,187.45,4);socket.emit("1",8.035,188.5,4);socket.emit("1",8.36,185,4);socket.emit("1",2.425,188,4);socket.emit("1",2.75,190,4);
socket.emit("1",3.075,184,4);socket.emit("1",3.42,186,4);socket.emit("1",3.74,190,4);socket.emit("1",4.06,186,4);socket.emit("1",4.39,185,4);socket.emit("1",4.8625,245,4);
socket.emit("1",5.1125,245,4);socket.emit("1",5.3625,245,4);socket.emit("1",5.6125,245,4);socket.emit("1",5.8625,245,4);socket.emit("1",6.1125,245,4);socket.emit("1",6.3625,245,4);
socket.emit("1",6.6125,245,4);socket.emit("1",6.8625,245,4);socket.emit("1",7.14,245,4);socket.emit("1",7.39,245,4);socket.emit("1",7.64,246,4);socket.emit("1",7.89,246,4);
socket.emit("1",8.14,246,4);socket.emit("1",8.39,246,4);socket.emit("1",8.635,246,4);socket.emit("1",8.885,246,4);socket.emit("1",2.5825,245,4);socket.emit("1",2.8625,245,4);
socket.emit("1",3.1125,245,4);socket.emit("1",3.3625,245,4);socket.emit("1",3.6125,245,4);socket.emit("1",3.8625,245,4);socket.emit("1",4.1125,245,4);socket.emit("1",4.3625,245,4);
socket.emit("1",4.6125,245,4);socket.emit("1",5.21,245,1);socket.emit("1",5.71,245,1);socket.emit("1",3.725,245,1);socket.emit("1",4.225,245,1);socket.emit("1",7.86,311,1);
socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);
socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);
socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);
socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);
socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1",10.07,311,8);socket.emit("1",10.49,311,8);socket.emit("1",11.51,311,8);socket.emit("1",11.93,311,8);
}function gunner(){socket.emit("1",4.725,130,2);socket.emit("1",5.245,130,2);socket.emit("1",5.715,130,2);socket.emit("1",6.185,130,2);socket.emit("1",6.655,130,2);socket.emit("1",7.13,130,2);
socket.emit("1",7.6,130,2);socket.emit("1",1.85,130,2);socket.emit("1",2.32,130,2);socket.emit("1",2.79,130,2);socket.emit("1",3.265,130,2);socket.emit("1",3.735,130,2);
socket.emit("1",4.205,130,2);socket.emit("1",5.06,185,2);socket.emit("1",5.4,185,2);socket.emit("1",5.725,190,2);socket.emit("1",6.045,186,2);socket.emit("1",6.374,185,2);
socket.emit("1",6.7215,189.5,2);socket.emit("1",7.0425,188.5,2);socket.emit("1",7.365,185,2);socket.emit("1",7.712,187.45,2);socket.emit("1",8.035,188.5,2);socket.emit("1",8.36,185,2);
socket.emit("1",2.425,188,2);socket.emit("1",2.75,190,2);socket.emit("1",3.075,184,2);socket.emit("1",3.42,186,2);socket.emit("1",3.74,190,2);socket.emit("1",4.06,186,2);
socket.emit("1",4.39,185,2);socket.emit("1",4.8625,245,2);socket.emit("1",5.1125,245,2);socket.emit("1",5.3625,245,2);socket.emit("1",5.6125,245,2);socket.emit("1",5.8625,245,2);
socket.emit("1",6.1125,245,2);socket.emit("1",6.3625,245,2);socket.emit("1",6.6125,245,2);socket.emit("1",6.8625,245,2);socket.emit("1",7.14,245,2);socket.emit("1",7.39,245,2);
socket.emit("1",7.64,246,2);socket.emit("1",7.89,246,2);socket.emit("1",8.14,246,2);socket.emit("1",8.39,246,2);socket.emit("1",8.635,246,2);socket.emit("1",8.885,246,2);
socket.emit("1",2.5825,245,2);socket.emit("1",2.8625,245,2);socket.emit("1",3.1125,245,2);socket.emit("1",3.3625,245,2);socket.emit("1",3.6125,245,2);socket.emit("1",3.8625,245,2);
socket.emit("1",4.1125,245,2);socket.emit("1",4.3625,245,2);socket.emit("1",4.6125,245,2);socket.emit("1",4.725,130,2);socket.emit("1",5.245,130,2);socket.emit("1",5.715,130,2);
socket.emit("1",6.185,130,2);socket.emit("1",6.655,130,2);socket.emit("1",7.13,130,2);socket.emit("1",7.6,130,2);socket.emit("1",1.85,130,2);socket.emit("1",2.32,130,2);
socket.emit("1",2.79,130,2);socket.emit("1",3.265,130,2);socket.emit("1",3.735,130,2);socket.emit("1",4.205,130,2);socket.emit("1",5.06,185,2);socket.emit("1",5.4,185,2);
socket.emit("1",5.725,190,2);socket.emit("1",6.045,186,2);socket.emit("1",6.374,185,2);socket.emit("1",6.7215,189.5,2);socket.emit("1",7.0425,188.5,2);socket.emit("1",7.365,185,2);
socket.emit("1",7.712,187.45,2);socket.emit("1",8.035,188.5,2);socket.emit("1",8.36,185,2);socket.emit("1",2.425,188,2);socket.emit("1",2.75,190,2);socket.emit("1",3.075,184,2);
socket.emit("1",3.42,186,2);socket.emit("1",3.74,190,2);socket.emit("1",4.06,186,2);socket.emit("1",4.39,185,2);socket.emit("1",4.8625,245,2);socket.emit("1",5.1125,245,2);
socket.emit("1",5.3625,245,2);socket.emit("1",5.6125,245,2);socket.emit("1",5.8625,245,2);socket.emit("1",6.1125,245,2);socket.emit("1",6.3625,245,2);socket.emit("1",6.6125,245,2);
socket.emit("1",6.8625,245,2);socket.emit("1",7.14,245,2);socket.emit("1",7.39,245,2);socket.emit("1",7.64,246,2);socket.emit("1",7.89,246,2);socket.emit("1",8.14,246,2);
socket.emit("1",8.39,246,2);socket.emit("1",8.635,246,2);socket.emit("1",8.885,246,2);socket.emit("1",2.5825,245,2);socket.emit("1",2.8625,245,2);socket.emit("1",3.1125,245,2);
socket.emit("1",3.3625,245,2);socket.emit("1",3.6125,245,2);socket.emit("1",3.8625,245,2);socket.emit("1",4.1125,245,2);socket.emit("1",4.3625,245,2);socket.emit("1",4.6125,245,2);
socket.emit("1",-1.55,190,2);socket.emit("1",5.21,245,1);socket.emit("1",5.71,245,1);socket.emit("1",3.725,245,1);socket.emit("1",4.225,245,1);socket.emit("1",7.86,311,1);
socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);
socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);
socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);
socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);
socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1",10.07,311,1);socket.emit("1",10.49,311,1);socket.emit("1",11.51,311,1);socket.emit("1",11.93,311,1);
}function defend(){socket.emit("1",4.725,130,1);socket.emit("1",5.245,130,1);socket.emit("1",5.715,130,1);socket.emit("1",6.185,130,1);
socket.emit("1",6.655,130,1);socket.emit("1",7.13,130,1);socket.emit("1",7.6,130,1);socket.emit("1",1.85,130,1);socket.emit("1",2.32,130,1);socket.emit("1",2.79,130,1);
socket.emit("1",3.265,130,1);socket.emit("1",3.735,130,1);socket.emit("1",4.205,130,1);socket.emit("1",5.06,185,1);socket.emit("1",5.4,185,1);socket.emit("1",5.725,190,1);
socket.emit("1",6.045,186,1);socket.emit("1",6.374,185,1);socket.emit("1",6.7215,189.5,1);socket.emit("1",7.0425,188.5,1);socket.emit("1",7.365,185,1);socket.emit("1",7.712,187.45,1);
socket.emit("1",8.035,188.5,1);socket.emit("1",8.36,185,1);socket.emit("1",2.425,188,1);socket.emit("1",2.75,190,1);socket.emit("1",3.075,184,1);socket.emit("1",3.42,186,1);
socket.emit("1",3.74,190,1);socket.emit("1",4.06,186,1);socket.emit("1",4.39,185,1);socket.emit("1",4.8625,245,1);socket.emit("1",5.1125,245,1);socket.emit("1",5.3625,245,1);
socket.emit("1",5.6125,245,1);socket.emit("1",5.8625,245,1);socket.emit("1",6.1125,245,1);socket.emit("1",6.3625,245,1);socket.emit("1",6.6125,245,1);socket.emit("1",6.8625,245,1);
socket.emit("1",7.14,245,1);socket.emit("1",7.39,245,1);socket.emit("1",7.64,246,1);socket.emit("1",7.89,246,1);socket.emit("1",8.14,246,1);socket.emit("1",8.39,246,1);
socket.emit("1",8.635,246,1);socket.emit("1",8.885,246,1);socket.emit("1",2.5825,245,1);socket.emit("1",2.8625,245,1);socket.emit("1",3.1125,245,1);socket.emit("1",3.3625,245,1);
socket.emit("1",3.6125,245,1);socket.emit("1",3.8625,245,1);socket.emit("1",4.1125,245,1);socket.emit("1",4.3625,245,1);socket.emit("1",4.6125,245,1);socket.emit("1",5.21,245,1);
socket.emit("1",5.71,245,1);socket.emit("1",3.725,245,1);socket.emit("1",4.225,245,1);socket.emit("1",7.86,311,1);socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);
socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);
socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);
socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);
socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);
socket.emit("1",10.07,311,1);socket.emit("1",10.49,311,1);socket.emit("1",11.51,311,1);socket.emit("1",11.93,311,1);socket.emit("1",4.725,250,1);socket.emit("1",-1.55,190,1);
}function hybrid(){socket.emit("1",4.725,130,7);socket.emit("1",-1.22,187.85,3);socket.emit("1",-0.83,183.45,3);socket.emit("1",0.54,186.347,3);socket.emit("1",1.06,243.846,3);socket.emit("1",-1.9,187.43,3);
socket.emit("1",2.99,183.96,3);socket.emit("1",1.58,179.07,3);socket.emit("1",2.63,186.89,3);socket.emit("1",-2.3,182.73,3);socket.emit("1",0.17,183.9,3);socket.emit("1",2.1,243.85,3);
socket.emit("1",2.31,132,3);socket.emit("1",0.85,132,3);socket.emit("1",-0.32,243.85,5);socket.emit("1",1.58,243.85,5);socket.emit("1",-1.56,212.1,5);socket.emit("1",-2.8,243.85,5);
socket.emit("1",2.46,243.85,5);socket.emit("1",0.7,243.85,5);socket.emit("1",-1.08,245.85,1);socket.emit("1",-2.04,245.85,1);socket.emit("1",-0.58,245.85,1);socket.emit("1",-2.54,245.85,1);
socket.emit("1",-0.49,188.93,4);socket.emit("1",-0.06,245.85,4);socket.emit("1",-3.06,245.85,4);socket.emit("1",-0.83,245.85,4);socket.emit("1",-1.33,245.85,4);socket.emit("1",-1.79,245.85,4);
socket.emit("1",-2.29,245.85,4);socket.emit("1",-0.17,190.44,4);socket.emit("1",-2.64,188.59,4);socket.emit("1",1.93,188.06,4);socket.emit("1",-2.96,189.7,4);socket.emit("1",1.23,188.83,4);
socket.emit("1",-3.0182,130,4);socket.emit("1",-2.5482,130,4);socket.emit("1",-2.0782,130,4);socket.emit("1",2.72,245.85,4);socket.emit("1",2.97,245.85,4);socket.emit("1",0.44,245.85,4);
socket.emit("1",0.19,245.85,4);socket.emit("1",1.32,245.85,4);socket.emit("1",1.84,245.85,4);socket.emit("1",-1.038,130,4);socket.emit("1",-0.568,130,4);socket.emit("1",-0.098,130,4);
socket.emit("1",0.3718,130,4);socket.emit("1",2.1,243.85,4);socket.emit("1",2.28,194.3,4);socket.emit("1",1.83,130,4);socket.emit("1",1.33,130,4);socket.emit("1",2.79,130,4);
socket.emit("1",0.88,194,4);socket.emit("1",5.21,245,1);socket.emit("1",5.71,245,1);socket.emit("1",3.725,245,1);socket.emit("1",4.225,245,1);socket.emit("1",7.86,311,1);
socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);
socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);
socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);
socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);
socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1",10.07,311,8);socket.emit("1",10.49,311,8);socket.emit("1",11.51,311,8);socket.emit("1",11.93,311,8);
}function defendhybrid(){socket.emit("1",4.725,130,1);socket.emit("1",-1.22,187.85,1);socket.emit("1",-0.83,183.45,1);socket.emit("1",0.54,186.347,1);socket.emit("1",1.06,243.846,1);socket.emit("1",-1.9,187.43,1);
socket.emit("1",2.99,183.96,1);socket.emit("1",1.58,179.07,1);socket.emit("1",2.63,186.89,1);socket.emit("1",-2.3,182.73,1);socket.emit("1",0.17,183.9,1);socket.emit("1",2.1,243.85,1);
socket.emit("1",2.31,132,1);socket.emit("1",0.85,132,1);socket.emit("1",-0.32,243.85,1);socket.emit("1",1.58,243.85,1);socket.emit("1",-1.56,212.1,1);socket.emit("1",-2.8,243.85,1);
socket.emit("1",2.46,243.85,1);socket.emit("1",0.7,243.85,1);socket.emit("1",-1.08,245.85,1);socket.emit("1",-2.04,245.85,1);socket.emit("1",-0.58,245.85,1);socket.emit("1",-2.54,245.85,1);
socket.emit("1",-0.49,188.93,1);socket.emit("1",-0.06,245.85,1);socket.emit("1",-3.06,245.85,1);socket.emit("1",-0.83,245.85,1);socket.emit("1",-1.33,245.85,1);socket.emit("1",-1.79,245.85,1);
socket.emit("1",-2.29,245.85,1);socket.emit("1",-0.17,190.44,1);socket.emit("1",-2.64,188.59,1);socket.emit("1",1.93,188.06,1);socket.emit("1",-2.96,189.7,1);socket.emit("1",1.23,188.83,1);
socket.emit("1",-3.0182,130,1);socket.emit("1",-2.5482,130,1);socket.emit("1",-2.0782,130,1);socket.emit("1",2.72,245.85,1);socket.emit("1",2.97,245.85,1);socket.emit("1",0.44,245.85,1);
socket.emit("1",0.19,245.85,1);socket.emit("1",1.32,245.85,1);socket.emit("1",1.84,245.85,1);socket.emit("1",-1.038,130,1);socket.emit("1",-0.568,130,1);socket.emit("1",-0.098,130,1);
socket.emit("1",0.3718,130,1);socket.emit("1",2.1,243.85,1);socket.emit("1",2.28,194.3,1);socket.emit("1",1.83,130,1);socket.emit("1",1.33,130,1);socket.emit("1",2.79,130,1);
socket.emit("1",0.88,194,1);socket.emit("1",5.21,245,1);socket.emit("1",5.71,245,1);socket.emit("1",3.725,245,1);socket.emit("1",4.225,245,1);socket.emit("1",7.86,311,1);
socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);
socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);
socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);
socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);
socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1",10.07,311,1);socket.emit("1",10.49,311,1);socket.emit("1",11.51,311,1);socket.emit("1",11.93,311,1);
}function tank(){socket.emit("1",4.725,130,7);socket.emit("1",2.79,130,4);socket.emit("1",-3.0182,130,4);socket.emit("1",-2.5482,130,4);socket.emit("1",-2.87,185.6,4);
socket.emit("1",-2.52,190.27,4);socket.emit("1",2.75,190.12,4);socket.emit("1",2.43,187.78,4);socket.emit("1",3.08,182.826,4);socket.emit("1",-2.88,245.853,4);
socket.emit("1",-2.63,245.8475,4);socket.emit("1",2.62,245.852,4);socket.emit("1",2.88,245.8534,4);socket.emit("1",-1.038,130,4);socket.emit("1",-0.568,130,4);
socket.emit("1",-0.098,130,4);socket.emit("1",0.3718,130,4);socket.emit("1",0.8468,130,4);socket.emit("1",1.3168,130,4);socket.emit("1",1.85,130,4);socket.emit("1",2.32,130,4);
socket.emit("1",-2.0782,130,4);socket.emit("1",-1.79,245.8527,4);socket.emit("1",-2.04,245.85,4);socket.emit("1",-1.33,245.85,4);socket.emit("1",-1.24,188.37,4);
socket.emit("1",-1.88,188.72,4);socket.emit("1",-0.91997,189.57,4);socket.emit("1",-0.6,190,4);socket.emit("1",-0.26,185.42,4);socket.emit("1",0.74,187.6896,4);
socket.emit("1",0.42,189.64,4);socket.emit("1",0.0899,182.8396,4);socket.emit("1",-2.2,187.98,4);socket.emit("1",1.74,188.2186,4);socket.emit("1",1.41997,188.55,4);
socket.emit("1",1.08,181.2777,4);socket.emit("1",2.08,181.05,4);socket.emit("1",2.34998,245.85,4);socket.emit("1",1.8299,245.85,4);socket.emit("1",1.5799,245.85,4);
socket.emit("1",1.33,245.85,4);socket.emit("1",0.81,245.85,4);socket.emit("1",0.2799,245.85,4);socket.emit("1",0.5399,245.85,4);socket.emit("1",-0.24,245.85,4);
socket.emit("1",-0.4899,245.85,4);socket.emit("1",-1.08,245.85,4);socket.emit("1",-3.14,243.85,5);socket.emit("1",2.09,243.85,5);socket.emit("1",-0.7799,243.85,5);
socket.emit("1",-1.56,212.1223,5);socket.emit("1",1.07,243.85,5);socket.emit("1",-2.3399,243.85,5);socket.emit("1",0.02,243.85,5);socket.emit("1",7.86,311,1);
socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);
socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);
socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);
socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);
socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1",10.07,311,8);socket.emit("1",10.49,311,8);socket.emit("1",11.51,311,8);socket.emit("1",11.93,311,8);
}function defendtank(){socket.emit("1",4.725,130,1);socket.emit("1",2.79,130,1);socket.emit("1",-3.0182,130,1);socket.emit("1",-2.5482,130,1);socket.emit("1",-2.87,185.6,1);
socket.emit("1",-2.52,190.27,1);socket.emit("1",2.75,190.12,1);socket.emit("1",2.43,187.78,1);socket.emit("1",3.08,182.826,1);socket.emit("1",-2.88,245.853,1);
socket.emit("1",-2.63,245.8475,1);socket.emit("1",2.62,245.852,1);socket.emit("1",2.88,245.8534,1);socket.emit("1",-1.038,130,1);socket.emit("1",-0.568,130,1);
socket.emit("1",-0.098,130,1);socket.emit("1",0.3718,130,1);socket.emit("1",0.8468,130,1);socket.emit("1",1.3168,130,1);socket.emit("1",1.85,130,1);socket.emit("1",2.32,130,1);
socket.emit("1",-2.0782,130,1);socket.emit("1",-1.79,245.8527,1);socket.emit("1",-2.04,245.85,1);socket.emit("1",-1.33,245.85,1);socket.emit("1",-1.24,188.37,1);
socket.emit("1",-1.88,188.72,1);socket.emit("1",-0.91997,189.57,1);socket.emit("1",-0.6,190,1);socket.emit("1",-0.26,185.42,1);socket.emit("1",0.74,187.6896,1);
socket.emit("1",0.42,189.64,1);socket.emit("1",0.0899,182.8396,1);socket.emit("1",-2.2,187.98,1);socket.emit("1",1.74,188.2186,1);socket.emit("1",1.41997,188.55,1);
socket.emit("1",1.08,181.2777,1);socket.emit("1",2.08,181.05,1);socket.emit("1",2.34998,245.85,1);socket.emit("1",1.8299,245.85,1);socket.emit("1",1.5799,245.85,1);
socket.emit("1",1.33,245.85,1);socket.emit("1",0.81,245.85,1);socket.emit("1",0.2799,245.85,1);socket.emit("1",0.5399,245.85,1);socket.emit("1",-0.24,245.85,1);
socket.emit("1",-0.4899,245.85,1);socket.emit("1",-1.08,245.85,1);socket.emit("1",-3.14,243.85,1);socket.emit("1",2.09,243.85,1);socket.emit("1",-0.7799,243.85,1);
socket.emit("1",-1.56,212.1223,1);socket.emit("1",1.07,243.85,1);socket.emit("1",-2.3399,243.85,1);socket.emit("1",0.02,243.85,1);socket.emit("1",7.86,311,1);
socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);
socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);
socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);
socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);
socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1",10.07,311,1);socket.emit("1",10.49,311,1);socket.emit("1",11.51,311,1);socket.emit("1",11.93,311,1);}

//One-click upgrade/sell
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.UIList.push({
    level: 1,
    x: 1,
    html: '<div onclick=greaterBarracks()>Upgrade Greater Barracks</div>'
}, {
    level: 3,
    x: 2,
    html: '<div onclick=instantspike()>Instant Spike</div>'
}, {
    level: 1,
    x: 3,
    html: '<div onclick=sellGenerators()>Sell Generators</div>'
}, {
    level: 2,
    x: 1,
    html: '<div onclick=sellHouse()>Sell House</div>'
}, {
    level: 2,
    x: 2,
    html: '<div onclick=sellall()>Sell All</div>'
},{
    level: 2,
    x: 3,
    html: '<div onclick=sellw()>Sell Inner Walls</div>'
}, {
    level: 2,
    x: 4,
    html: '<div onclick=sellbarracks()>Sell All Barracks</div>'
});

function emit2() {
    socket.emit.apply(socket, arguments);
}
window.sellw = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellGenerators = window.sellGenerators || function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            var name = getUnitFromPath(units[d].uPath).name;
            (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.instantspike = window.instantspike || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
    }
    setInterval(inspike,100)
    function inspike() {
        for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.greaterBarracks = window.greaterBarracks || function () {
    for (var i = 0; i < units.length; ++i) 2 == units[i].type && "square" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.sellbarracks = function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 2 && units[d].owner == player.sid) {
            var name = getUnitFromPath(units[d].uPath).name;
            (name === 'Barracks' || name === 'Greater Barracks' || name === 'Tank Factory' || name === 'Siege Factory' || name === 'Blitz Factory') && a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellHouse = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellwalls = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellinner = function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellall = function () {
    for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);
    socket.emit("3", a)
}

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

    css.innerHTML = '<style>\n\
#snackbar {\n\
visibility: hidden;\n\
min-width: 250px;\n\
margin-left: -125px;\n\
background-color: rgba(40, 40, 40, 0.5);\n\
color: #fff;\n\
text-align: center;\n\
border-radius: 4px;\n\
padding: 10px;\n\
font-family: "regularF";\n\
font-size: 16px;\n\
position: left;\n\
z-index: 100;\n\
left: 50%;\n\
top: 30px;\n\
}\n\
#snackbar.show {\n\
visibility: visible;\n\
-webkit-animation: fadein 0.1s;\n\
animation: fadein 0.1s;\n\
}\n\
#snackbar.hide {\n\
visibility: visible;\n\
-webkit-animation: fadeout 0.1s;\n\
animation: fadeout 0.1s;\n\
}\n\
@-webkit-keyframes fadein {\n\
from {top: 0; opacity: 0;}\n\
to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
from {top: 0; opacity: 0;}\n\
to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
from {top: 30px; opacity: 1;}\n\
to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
from {top: 30px; opacity: 1;}\n\
to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
background-color:rgba(40,40,40,.5);\n\
margin-left: 3px;\n\
border-radius:4px;\n\
pointer-events:all\n\
}\n\
#noobscriptUI {\n\
top: -" + (height + 12) + "px;\n\
transition: 0.5s;\n\
margin-left:10px;\n\
position:absolute;\n\
padding-left:24px;\n\
margin-top:9px;\n\
padding-top:15px;\n\
width:580px;\n\
height: " + height + "px;\n\
font-family:arial;\n\
left:25%\n\
}\n\
#noobscriptUI:hover{\n\
top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
color:#fff;\n\
padding:7px;\n\
height:19px;\n\
display:inline-block;\n\
cursor:pointer;\n\
font-size:16px\n\
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
}, 1000)

//Another one-click upgrade
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

    css.innerHTML = '<style>\n\
#snackbar {\n\
visibility: hidden;\n\
min-width: 250px;\n\
margin-left: -125px;\n\
background-color: rgba(40, 40, 40, 0.5);\n\
color: #fff;\n\
text-align: center;\n\
border-radius: 4px;\n\
padding: 10px;\n\
font-family: "regularF";\n\
font-size: 16px;\n\
position: left;\n\
z-index: 100;\n\
left: 50%;\n\
top: 30px;\n\
}\n\
#snackbar.show {\n\
visibility: visible;\n\
-webkit-animation: fadein 0.1s;\n\
animation: fadein 0.1s;\n\
}\n\
#snackbar.hide {\n\
visibility: visible;\n\
-webkit-animation: fadeout 0.1s;\n\
animation: fadeout 0.1s;\n\
}\n\
@-webkit-keyframes fadein {\n\
from {top: 0; opacity: 0;}\n\
to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
from {top: 0; opacity: 0;}\n\
to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
from {top: 30px; opacity: 1;}\n\
to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
from {top: 30px; opacity: 1;}\n\
to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
background-color:rgba(40,40,40,.5);\n\
margin-left: 3px;\n\
border-radius:4px;\n\
pointer-events:all\n\
}\n\
#noobscriptUI {\n\
top: -" + (height + 12) + "px;\n\
transition: 0.5s;\n\
margin-left:10px;\n\
position:absolute;\n\
padding-left:24px;\n\
margin-top:9px;\n\
padding-top:15px;\n\
width:580px;\n\
height: " + height + "px;\n\
font-family:arial;\n\
left:25%\n\
}\n\
#noobscriptUI:hover{\n\
top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
color:#fff;\n\
padding:7px;\n\
height:19px;\n\
display:inline-block;\n\
cursor:pointer;\n\
font-size:16px\n\
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
}, 1000)
var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color:rgba(40,40,40,.5);margin-left: 3px;border-radius:4px;pointer-events:all}#upgradeScriptCont{top: -138px;transition: 1s;margin-left:10px;position:absolute;padding-left:24px;margin-top:9px;padding-top:15px;width:530px;height:128px;font-family:arial;left:28%}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 14px;position: relative;left: 457px;bottom: 2px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="<div id=upgradeScriptCont><div id=layer1><div id=walls class=buttonClass onclick=walls()>Buy Walls</div><div id=upgradeBoulders class=buttonClass onclick=boulders()>Upgrade Boulders</div><div id=upgradeSpikes class=buttonClass onclick=spikes()>Upgrade Spikes</div><div id=upgradeGen class=buttonClass onclick=powerPlants()>Upgrade Power Plants</div></div><div id=layer2 style=margin-top:7px;margin-left:7px><div id=walls class=buttonClass onclick=generators()>Buy Generators</div><div id=upgradeBoulders class=buttonClass onclick=rapid()>Upgrade Rapid</div><div id=upgradeSpikes class=buttonClass onclick=ranged()>Upgrade Ranged</div><div id=upgradeGen class=buttonClass onclick=antiTank()>Upgrade anti-tank</div></div><div id=layer3 style=margin-top:7px;margin-left:-16px><div id=walls class=buttonClass onclick=gatlins()>Upgrade Gatlins</div><div id=upgradeBoulders class=buttonClass onclick=spotter()>Upgrade spotter</div><div id=upgradeMicro class=buttonClass onclick=microGenerators()>Upgrade Micro-Gen</div><div id=upgradeSpikes class=buttonClass onclick=semiAuto()>Upgrade Semi-auto</div></div><span class=hoverMessage>Hover over</span></div>",contAppend.insertBefore(menuA,contAppend.firstChild),window.walls=function(){for(i=-3.14;i<3.14;i+=.108)socket.emit("1",i,1e3,1)},window.generators=function(){for(i=-3.14;i<3.14;i+=.075)socket.emit("1",i,132,3)},window.boulders=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.microGenerators=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.spikes=function(){for(i=0;i<units.length;++i)3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.powerPlants=function(){for(i=0;i<units.length;++i)0==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.rapid=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.ranged=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.antiTank=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.semiAuto=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.gatlins=function(){for(i=0;i<units.length;++i)0==units[i].type&&2==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.spotter=function(){for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)};

//InstaFind
var gotoUsers = [];
var gotoIndex = 0;
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || {};

window.chatCommands.find = function(split) {
    var name = split.slice(1).join(' ');
    if (name == '') {
        addChat('Please specify a username', 'Client')
        return;
    }
    window.goto(name)
}
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
    10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}

// Override
window.resetCamera = function() {
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

            b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>[' + g + ']</span> <span class="chatText">' + d + "</span>";
            10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
}

window.addEventListener("keyup", function(a) {
    a = a.keyCode ? a.keyCode : a.which;
    if (a === 190) {
        window.gotoRight()
    } else if (a === 188) {
        window.gotoLeft();
    }

});


//Zoom
var scroll = 0;
mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
                               mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);
function zoom(a) {
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
            scroll = 0
        }
    }

    if (scroll == 1) { //zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
            scroll = 0
        }
    }
}

mainCanvas.onkeydown = function(event) {
    var k = event.keyCode ? event.keyCode : event.which;
    if (k == 45) { // - to zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
        }
    }
    if (k == 61) {// = to zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
        }

    }

    {if(65==a||37==a)cameraKeys.l=0,updateCameraInput();if(68==a||39==a)cameraKeys.r=0,updateCameraInput();if(87==a||38==a)cameraKeys.u=0,updateCameraInput();if(83==a||40==a)cameraKeys.d=0,updateCameraInput();if(32==a){var d=unitList.indexOf(activeUnit);sendUnit(d)}void 0!=upgrInputsToIndex["k"+a]&&toggleActiveUnit(upgrInputsToIndex["k"+a]);46==a&&selUnits.length&&sellSelUnits();84==a&&toggleChat("none"==chatListWrapper.style.display);
     27==a&&(toggleActiveUnit(),disableSelUnit(),showSelector=!1);82==a&&(camY=camX=0)}};mainCanvas.onkeydown=function(a){a=a.keyCode?a.keyCode:a.which;socket&&player&&!player.dead&&(65!=a&&37!=a||cameraKeys.l||(cameraKeys.l=-1,cameraKeys.r=0,updateCameraInput()),68!=a&&39!=a||cameraKeys.r||(cameraKeys.r=1,cameraKeys.l=0,updateCameraInput()),87!=a&&38!=a||cameraKeys.u||(cameraKeys.u=-1,cameraKeys.d=0,updateCameraInput()),83!=a&&40!=a||cameraKeys.d||(cameraKeys.d=1,cameraKeys.u=0,updateCameraInput()))}

     addEventListener("keydown", function(a) {
         if (a.keyCode == 77){
             for(i=0;i<users.length;++i){
                 if(users[i].name.startsWith("[G]")&&users[i].name !== player.name){
                     camX = users[i].x-player.x;
                     camY = users[i].y-player.y;
                 }
             }
         }
     });

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];

window.sendIndex = 0;
window.loops = 0;
window.hasSentTarget = false;
window.usePatch = true;
window.cache = [];
window.cacheHeight = 0;
window.cacheIndexes = 0;
window.shift = false;
window.sendFrequency = 1E3 / 15
window.UIList.push({
    level: 0,
    x: 3,
    description: 'Zoom Patch',
    html: '<div id="patch" onclick=patch()>Zoom:Disabled</div>'
});

window.statusItems.push({
    name: 'Zoom Patch',
    order: 2,
    value: function () {
        return usePatch ? 'On' : 'Off';
    }
});

window.patch = function () {
    var el = document.getElementById('patch');
    if (usePatch) {
        usePatch = false
        socket.emit("2", Math.round(camX), Math.round(camY))
        el.textContent = 'Zoom:Enabled'
    } else {
        usePatch = true;
        el.textContent = 'Zoom:Disabled';
        populate();
    }
    window.statusBar();
    return usePatch;
}


function populate() {
    if (!usePatch) return;
    cacheHeight = Math.round(maxScreenHeight / 1080);
    cacheIndexes = cacheHeight * cacheHeight - 1;
    for (var i = cache.length; i < cacheIndexes; i++) {
        cache[i] = spiral(i);
    }
}
populate();

function zoom(a) {
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if (maxScreenHeight < 30000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize(true));
            cameraSpd = (shift ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
            scroll = 0
            populate()
        }
    }

    if (scroll == 1) { //zoom in
        if (maxScreenHeight > 1080) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize(true))
            cameraSpd = (shift ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
            scroll = 0
            populate()
        }
    }
}
mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
                               mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);

function spiral(n) {
    var r = Math.floor((Math.sqrt(n + 1) - 1) / 2) + 1;
    var p = (8 * r * (r - 1)) / 2;
    var en = r * 2;
    var a = (1 + n - p) % (r * 8);
    var pos = [0, 0, r];
    switch (Math.floor(a / (r * 2))) {
        case 0:
            pos[0] = a - r;
            pos[1] = -r;
            break;
        case 1:
            pos[0] = r;
            pos[1] = (a % en) - r;
            break;
        case 2:
            pos[0] = r - (a % en);
            pos[1] = r;
            break;
        case 3:
            pos[0] = -r;
            pos[1] = r - (a % en);
            break;
    }
    return pos;
}

window.initFuncs.push(function () {
    var js = window.updateGameLoop.toString();

    var ind = js.indexOf('if (gameState && mapBounds) {');
    if (ind === -1) ind = js.indexOf('if (gameState&&mapBounds) {');
    if (ind === -1) ind = js.indexOf('if(gameState&&mapBounds){');

    var ind2 = js.indexOf('}', ind);

    var n = js.substring(0, ind) + 'if(gameState&&mapBounds){if(camXS||camYS)camX+=camXS*cameraSpd*a,camY+=camYS*cameraSpd*a;player.x+camX<mapBounds[0]?camX=mapBounds[0]-player.x:player.x+camX>mapBounds[0]+mapBounds[2]&&(camX=mapBounds[0]+mapBounds[2]-player.x);player.y+camY<mapBounds[1]?camY=mapBounds[1]-player.y:player.y+camY>mapBounds[1]+mapBounds[3]&&(camY=mapBounds[1]+mapBounds[3]-player.y);if(currentTime-lastCamSend>=sendFrequency)if(lastCamSend=currentTime,usePatch&&cacheIndexes)if(lastCamX!=camX||lastCamY!=camY)lastCamX=camX,lastCamY=camY,loop=sendIndex=0;else{if(4>=loop){if(sendIndex%2)(sendIndex-1)%6?socket.emit("2",Math.round(camX),Math.round(camY)):socket.emit("2",0,0);else{var index=sendIndex/2;index>=cacheIndexes?(sendIndex=0,loop++):socket.emit("2",Math.round(camX+1920*cache[index][0]),Math.round(camY+1080*cache[index][1]))}hasSentTarget=!1;sendIndex++}}else lastCamX==camX&&lastCamY==camY&&hasSentTarget||(lastCamX=camX,hasSentTarget=!0,lastCamY=camY,loop=0,socket.emit("2",Math.round(camX),Math.round(camY)))}' +
        js.substr(ind2 + 1);
    n = n.substring(n.indexOf('{') + 1, n.lastIndexOf('}'));
    window.updateGameLoop = new Function('a', n)

});
// ==UserScript==
// @name         Bloble.io NoobScript V3 BaseBuild Fragment
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A fragment of code from NoobScript V3 - The Base Builder.
// @author       NoobishHacker
// @match        http://bloble.io/*
// @grant        none
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];


window.UIList.push({
    level: 0,
    x: 0,
    html: '<div onclick=buildGenerators()>Build Generators</div>'
}, {
    level: 0,
    x: 1,
    html: '<div onclick=walls()>Build Walls</div>'
}, {
    level: 1,
    x: 0,
    html: '<div onclick=boulders()>Upgrade Boulders</div>'
}, {
    level: 1,
    x: 1,
    html: '<div onclick=spikes()>Upgrade Spikes</div>'
}, {
    level: 1,
    x: 2,
    html: '<div onclick=microGenerators()>Mico-Generators</div>'
}, {
    level: 2,
    x: 0,
    html: '<div onclick=powerPlants()>Upgrade Power Plants</div>'
}, {
    level: 2,
    x: 1,
    html: '<div onclick=sellGenerators()>Sell Generators</div>'
});

function emit2() {
    socket.emit.apply(socket, arguments);
}
window.walls = function () {
    for (i = -3.14; i < 3.14; i += .108) emit2("1", i, 1e3, 1)
}
window.sellGenerators = window.sellGenerators || function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            var name = getUnitFromPath(units[d].uPath).name;
            (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellhouses = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellwalls = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellinner = function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellall = function () {
    for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);
    socket.emit("3", a)
}
window.boulders = window.boulders || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.microGenerators = window.microGenerators || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.spikes = window.spikes || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.powerPlants = window.powerPlants || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.rapid = window.rapid || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.ranged = window.ranged || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.antiTank = window.antiTank || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.semiAuto = window.semiAuto || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.gatlins = window.gatlins || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 2 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.spotter = window.spotter || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 3 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
};
window.build = function (instr) {
    instr.forEach((ins) => {
        emit2.apply({}, ins);
    })
}
window.buildHybrid = function () {
    window.build([["1", 3.13, 243.85, 5], ["1", 2.87, 246.85, 2], ["1", 2.62, 243.85, 5], ["1", 2.37, 246.85, 2], ["1", 2.11, 243.85, 5], ["1", 1.86, 246.85, 2], ["1", 1.6, 243.85, 5], ["1", 1.34, 246.85, 2], ["1", 1.08, 243.85, 5], ["1", 0.82, 246.85, 2], ["1", 0.56, 243.85, 5], ["1", 0.3, 246.85, 2], ["1", 0.04, 243.85, 5], ["1", -0.21, 246.85, 2], ["1", -0.46, 243.85, 5], ["1", -0.72, 246.85, 2], ["1", -0.98, 243.85, 5], ["1", -1.23, 246.85, 2], ["1", -1.49, 243.85, 5], ["1", -1.74, 246.85, 2], ["1", -1.99, 243.85, 5], ["1", -2.25, 246.85, 2], ["1", -2.51, 243.85, 5], ["1", -2.77, 246.85, 2], ["1", 2.77, 190.49, 2], ["1", 2.43, 187.99, 2], ["1", 1.96, 188.53, 2], ["1", 2.76, 130, 4], ["1", 2.28, 130, 4], ["1", 1.79, 130, 4], ["1", 1.28, 130, 4], ["1", 0.79, 130, 4], ["1", 0.28, 130, 4], ["1", -0.19, 130, 4], ["1", -0.67, 130, 4], ["1", -1.17, 130, 4], ["1", -1.64, 130, 4], ["1", -2.13, 130, 4], ["1", -2.61, 130, 4], ["1", -3.06, 138.27, 4], ["1", -2.94, 195.69, 2], ["1", -2.4, 183.33, 2], ["1", -1.91, 180.8, 2], ["1", -1.41, 182.01, 2], ["1", -0.94, 182.52, 2], ["1", -0.45, 180.37, 2], ["1", 0.04, 178.74, 2], ["1", 0.53, 177.22, 2], ["1", 1.03, 181.72, 2], ["1", 1.49, 184.1, 2]]);
}
window.buildHouses = function () {
    window.build([["1", -0.09, 245.4, 1], ["1", 0.16, 243.15, 1], ["1", 0.41, 243.84, 1], ["1", 0.67, 244.57, 1], ["1", 0.04, 183.15, 5], ["1", 0.39, 184.96, 2], ["1", 0.72, 184.99, 4], ["1", 0.92, 245.85, 4], ["1", -0.34, 245.85, 4], ["1", -0.34, 140, 7], ["1", -0.6, 245.85, 4], ["1", 0.25, 130, 4], ["1", -0.88, 130, 4], ["1", -1.37, 130, 4], ["1", -1.86, 130, 4], ["1", -2.36, 130, 4], ["1", -2.88, 130, 4], ["1", 2.85, 130, 4], ["1", 2.36, 130, 4], ["1", 1.85, 130, 4], ["1", 1.38, 130, 4], ["1", 0.9, 130, 4], ["1", 1.19, 245.85, 4], ["1", 1.46, 245.85, 4], ["1", 1.73, 245.85, 4], ["1", 2, 245.85, 4], ["1", 2.26, 245.85, 4], ["1", 2.52, 245.85, 4], ["1", 2.78, 245.85, 4], ["1", 3.04, 245.85, 4], ["1", -2.99, 245.85, 4], ["1", -2.74, 245.85, 4], ["1", -2.49, 245.85, 4], ["1", -2.24, 245.85, 4], ["1", -1.99, 245.85, 4], ["1", -1.74, 245.85, 4], ["1", -1.48, 245.85, 4], ["1", -1.23, 245.85, 4], ["1", -0.94, 245.85, 4], ["1", -0.72, 187.11, 4], ["1", -1.06, 186.05, 4], ["1", -1.53, 186.15, 4], ["1", -1.87, 191.23, 4], ["1", -2.21, 185.53, 4], ["1", -2.55, 184.19, 4], ["1", 1.07, 186.28, 4], ["1", 1.61, 184.13, 4], ["1", 2.07, 185.66, 4], ["1", 2.39, 192.03, 4], ["1", 2.71, 186.8, 4], ["1", 3.06, 185.93, 4]])
    //     window.build([["1", 0.24, 245.85, 4], ["1", 0.49, 245.85, 4], ["1", 0.74, 245.85, 4], ["1", -0.01, 245.85, 4], ["1", -0.26, 245.85, 4], ["1", -0.51, 245.85, 4], ["1", 1, 245.85, 4], ["1", 1.25, 245.85, 4], ["1", 1.5, 245.85, 4], ["1", 1.75, 245.85, 4], ["1", 2, 245.85, 4], ["1", 2.25, 245.85, 4], ["1", 2.5, 245.85, 4], ["1", 2.75, 245.85, 4], ["1", 3.01, 245.85, 4], ["1", -3.03, 245.85, 4], ["1", -3.01, 245.85, 4], ["1", -2.75, 245.85, 4], ["1", -2.49, 245.85, 4], ["1", -2.24, 245.85, 4], ["1", -1.98, 245.85, 4], ["1", -1.72, 245.85, 4], ["1", -1.46, 245.85, 4], ["1", -1.21, 245.85, 4], ["1", -0.96, 245.85, 4], ["1", -0.72, 203.14, 4], ["1", -0.39, 190.85, 4], ["1", -0.59, 130, 4], ["1", -0.05, 185.69, 4], ["1", 0.11, 130, 4], ["1", 0.31, 185.08, 5], ["1", 0.66, 187.02, 4], ["1", 1.02, 184.03, 4], ["1", 0.84, 130, 4], ["1", 1.36, 189.19, 4], ["1", 1.7, 186.55, 4], ["1", 1.44, 130, 4], ["1", 2.05, 186.48, 4], ["1", 1.92, 130, 4], ["1", 1.91, 130, 4], ["1", 2.38, 191.67, 4], ["1", 2.38, 130, 4], ["1", 2.71, 185.92, 4], ["1", 3.05, 185.84, 4], ["1", 2.87, 130, 4], ["1", -2.9, 188.9, 4], ["1", -2.57, 187.48, 4], ["1", -2.74, 130, 4], ["1", -2.24, 185.43, 4], ["1", -1.91, 186.44, 4], ["1", -2.07, 130, 4], ["1", -1.57, 190.81, 4], ["1", -1.58, 186.32, 4], ["1", -1.42, 130, 4], ["1", -1.24, 186.06, 4]]);
}
window.buildGenerators = function () {
    var arr = [["1", 3.11, 243.85, 3], ["1", -2.9, 243.85, 3], ["1", -2.63, 243.85, 3], ["1", -2.36, 243.85, 3], ["1", -2.06, 243.85, 3], ["1", -1.77, 243.85, 3], ["1", -1.5, 243.85, 3], ["1", -1.22, 243.85, 3], ["1", -0.94, 243.85, 3], ["1", -0.64, 243.85, 3], ["1", -0.36, 243.85, 3], ["1", -0.07, 243.85, 3], ["1", 0.2, 243.85, 3], ["1", 0.47, 243.85, 3], ["1", 0.76, 243.85, 3], ["1", 1.05, 243.85, 3], ["1", 1.35, 243.85, 3], ["1", 1.64, 243.85, 3], ["1", 1.92, 243.85, 3], ["1", 2.22, 243.85, 3], ["1", 2.49, 243.85, 3], ["1", 2.78, 243.85, 3], ["1", 3, 183.39, 3], ["1", -2.91, 178.82, 3], ["1", -2.5, 182.85, 3], ["1", -2.11, 178.92, 3], ["1", -1.72, 176.82, 3], ["1", -1.35, 177.59, 3], ["1", -0.98, 174.52, 3], ["1", -0.57, 179.76, 3], ["1", -0.19, 183.42, 3], ["1", 0.21, 176.37, 3], ["1", 0.63, 179.87, 3], ["1", 1.03, 175.57, 3], ["1", 1.43, 176.6, 3], ["1", 1.8, 181.19, 3], ["1", 2.19, 177.95, 3], ["1", 2.6, 178.66, 3]]
    window.build(arr);
}
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

    css.innerHTML = '<style>\n\
#snackbar {\n\
    visibility: hidden;\n\
    min-width: 250px;\n\
    margin-left: -125px;\n\
    background-color: rgba(40, 40, 40, 0.5);\n\
    color: #fff;\n\
    text-align: center;\n\
    border-radius: 4px;\n\
    padding: 10px;\n\
    font-family: "regularF";\n\
    font-size: 20px;\n\
    position: fixed;\n\
    z-index: 100;\n\
    left: 50%;\n\
    top: 30px;\n\
}\n\
#snackbar.show {\n\
    visibility: visible;\n\
    -webkit-animation: fadein 0.5s;\n\
    animation: fadein 0.5s;\n\
}\n\
#snackbar.hide {\n\
    visibility: visible;\n\
    -webkit-animation: fadeout 0.5s;\n\
    animation: fadeout 0.5s;\n\
}\n\
@-webkit-keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
    background-color:rgba(40,40,40,.5);\n\
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
    margin-top:9px;\n\
    padding-top:15px;\n\
    width:580px;\n\
    height: " + height + "px;\n\
    font-family:arial;\n\
    left:25%\n\
}\n\
#noobscriptUI:hover{\n\
    top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
    color:#fff;\n\
    padding:7px;\n\
    height:19px;\n\
    display:inline-block;\n\
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
}, 1000)
// ==UserScript==
// @name         Bloble.io Auto Place and Zoom in and out Combination
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zoom in and Zoom out, Press 1, 2, 3, 4, 5, 6, or 7 *depending on which building you want to place automatically* NaTh BuildSystem 1.2 + ZOOM HACK for Bloble.io! Sorry for Copying. Before installing this script, Get the Extension: Tampermonkey
// @author       BuildFast (Credit goes to MaximusSRB Zoom hack and this unknown guy who made NaTh BuildSystem 1.2)
// @match        http://bloble.io/*
// @grant        none
// ==/UserScript==

$("#youtuberOf").hide();
$("#youtubeFollow").hide();
$("#adCard").hide();
$("#mobileInstructions").hide();
$("#promoImgHolder").hide();
$("#downloadButtonContainer").hide();
$("#mobileDownloadButtonContainer").hide();
$(".downloadBadge").hide();

var scroll = 0;

mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
                               mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);

function zoom(a) {
    a = window.event || a;
    a.preventDefault();
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
            scroll = 0
        }
    }

    if (scroll == 1) { //zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
            scroll = 0
        }
    }
}

mainCanvas.onkeydown = function(event) {
    var k = event.keyCode ? event.keyCode : event.which;
    if (k == 70) { // F to zoom out
        if (maxScreenHeight < 10000) {
            (maxScreenHeight += 250, maxScreenWidth += 250, resize());
        }
    }
    if (k == 67) {// C to zoom in
        if (maxScreenHeight > 1000) {
            (maxScreenHeight -= 250, maxScreenWidth -= 250, resize())
        }

    }

    {if(65==a||37==a)cameraKeys.l=0,updateCameraInput();if(68==a||39==a)cameraKeys.r=0,updateCameraInput();if(87==a||38==a)cameraKeys.u=0,updateCameraInput();if(83==a||40==a)cameraKeys.d=0,updateCameraInput();if(32==a){var d=unitList.indexOf(activeUnit);sendUnit(d)}void 0!=upgrInputsToIndex["k"+a]&&toggleActiveUnit(upgrInputsToIndex["k"+a]);46==a&&selUnits.length&&sellSelUnits();84==a&&toggleChat("none"==chatListWrapper.style.display);
     27==a&&(toggleActiveUnit(),disableSelUnit(),showSelector=!1);82==a&&(camY=camX=0)}};mainCanvas.onkeydown=function(a){a=a.keyCode?a.keyCode:a.which;socket&&player&&!player.dead&&(65!=a&&37!=a||cameraKeys.l||(cameraKeys.l=-1,cameraKeys.r=0,updateCameraInput()),68!=a&&39!=a||cameraKeys.r||(cameraKeys.r=1,cameraKeys.l=0,updateCameraInput()),87!=a&&38!=a||cameraKeys.u||(cameraKeys.u=-1,cameraKeys.d=0,updateCameraInput()),83!=a&&40!=a||cameraKeys.d||(cameraKeys.d=1,cameraKeys.u=0,updateCameraInput()))}


     addEventListener("keydown", function(a) {
         if (a.keyCode == 51) { //Generators
             for(i=-3.14;i<=2.36;i+=0.050){
                 socket.emit("1",i,132,3);
             }
         }
         if (a.keyCode == 54) { //Armory
             socket.emit("1",UTILS.roundToTwo(2.75),UTILS.roundToTwo(175),7);
         }
         if (a.keyCode == 52) { //Houses
             for(i=-3.134;i<=2.492;i+=0.04620){
                 socket.emit("1",i,194,4);
             }
         }

         if (a.keyCode == 50) {//Turrets
             socket.emit("1",2.75,245.75,2);socket.emit("1",2.50,245,2);socket.emit("1",3,245,2);
             for(i=-2.98;i<=2.2;i+=0.3235){
                 socket.emit("1",i,245,2);
             }
         }
         if (a.keyCode == 49) {//Walls
             for(i=-3.14;i<3.14;i+=0.216){
                 socket.emit("1",i,1e3,1);
             }
         }
         if (a.keyCode == 55) {//Barracks
             socket.emit("1",0.32,310,8);
             socket.emit("1",-0.98,310,8);
             socket.emit("1",1.61,310,8);
             socket.emit("1",-2.27,310,8);
         }
     });

addEventListener("keydown", function(a) {
    if (a.keyCode == 77){
        for(i=0;i<users.length;++i){
            if(users[i].name.startsWith("[G]")&&users[i].name !== player.name){
                camX = users[i].x-player.x;
                camY = users[i].y-player.y;
            }
        }
    }
});