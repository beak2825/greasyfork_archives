// ==UserScript==
// @name         kishi no meiyo
// @namespace    http://bloble.io/*
// @version      beta
// @description  LOCALE: pt-br , en-us . Script para o game: Bloble Online. Versão beta
// @author       PlayerX
// @license MIT
// @match        http://bloble.io/*
// @icon         https://github.com/PlayerX-000/img/blob/main/images.jpg?raw=true
// @connect localhost
// @downloadURL https://update.greasyfork.org/scripts/443008/kishi%20no%20meiyo.user.js
// @updateURL https://update.greasyfork.org/scripts/443008/kishi%20no%20meiyo.meta.js
// ==/UserScript==



window.onbeforeunload=function(a){}

window.onload = function(){
twttr = undefined;
adsbygoogle = undefined;
}

//VERIFICA STATUS DA CONEXÃO
const xhr = new XMLHttpRequest();
const href = window.location.href;
const linkGame = `http://bloble.io/`;

xhr.open('GET', href);

xhr.onprogress = function () {
if(xhr.status == 404) window.location.assign(linkGame,linkGame);
if(xhr.status !== 200) window.location.assign(href,href);
};

xhr.onload = function () {
console.log(`STATUS: ${xhr.status}`);
if(xhr.status == 404) window.location.assign(linkGame,linkGame);
if(xhr.status !== 200) window.location.assign(href,href);
};

xhr.send();



//VARIAVEIS
window.selBaseSpawn = {load:false,padrao:true,outra:false}
let placar = [];
let onOffFKA = "off"
let onOffDef = "off";
let onOffLag = "off";
let onOffFPB = "off";
let onOffBot = "on"
let TecPonto = false;
let onOffjointroop = "on";
let onOffantkick = "on";
let onOffPower = "off";
const host = "http://localhost:8080";
const heightPag = window.screen.height;
const widthPag = window.screen.width;
const tempoTransicao = 1.5;
window.sockets = [];
window.idBot = 0;
window.teclas = JSON.parse(localStorage.getItem("teclas"))

//PEGA TECLAS PADRÕES
let ArrTeclas = {
    zoomMin:       {  keyCode:73, id:0},
    zoomMax:       {  keyCode:79, id:1},
    resetaVerybase:{  keyCode:84, id:2},
    lag:           {  keyCode:86, id:3},
    def:           {  keyCode:67, id:4},
    tiraInterno:   {  keyCode:88, id:5},
    fullatk:       {  keyCode:90, id:6},
    joinTroop:     {  keyCode:66, id:7},
    JuntaTropa:    {  keyCode:80, id:8},
    selCommander:  {  keyCode:69, id:9},
    selSoldier:    {  keyCode:81, id:10},
    selAll:        {  keyCode:70, id:11},
    upgrade:       {  keyCode:16, id:12},
    speedCam:      {  keyCode:190,id:13}
}

//VERIFICA SE TEM UM PADRAO DE TECLAS PERSONALIZADAS SALVAS
if(window.teclas == undefined || Object.keys(window.teclas).length<14){
    window.teclas = ArrTeclas;
    localStorage.setItem("teclas",JSON.stringify(ArrTeclas));
    console.log("setado no localStorage")
}


//ANTES DA PAGINA SER TOTALMENTE CARREGADA
async function preLoad(){
mainCanvas.focus()

let nome = document.getElementsByTagName("title")
    nome[0].innerText = "Kishi no Meiyo"

//ABRIR VARIAS GUIAS DO JOGO NO NAVEGADOR
cid = UTILS.getUniqueID();
localStorage.setItem("cid",cid);

document.body.style = `
    pointer-events: none;
    cursor: default;
    `
let suportLoading = document.createElement("div")
suportLoading.id = "suportLoading"
suportLoading.innerHTML = `CARREGANDO... aguarde<style>
div#suportLoading{
    width: 100%;
    font-size: 30px;
    font-family: fantasy;
    align-items: center;
    position: absolute;
    z-index: 10000;
    text-align: center;
    color: #b90000;
    height: 100%;
    }
    </style>`

let img = document.createElement("img")
img.id = "loading";
img.src = "https://github.com/PlayerX-000/img/blob/main/loading-29.gif?raw=true";
img.innerHTML = `<style>
img#loading {
    width: 15%;
    height: auto;
    left: 42%;
    top: 42%;
    z-index: 9999;
    position: fixed;
}
</style>`

suportLoading.appendChild(img)
document.body.appendChild(suportLoading)

return addCSS()
}

//FUNÇÕES NATIVAS DO GAME



//MENU DA BASE
function unlockSkins(){skinInfo.style.display="inline-block";skinSelector.style.display="inline-block";unlockedSkins=!0;hasStorage&&localStorage.setItem("isFollBlob",1)}
unlockSkins()


//VERIFICA SE UM BOTAO DE UPGRADE DO JOGADOR OU OUTROS USERS FOI PRESSIONADO (EX: BOTAO DE SALVAR E CARREGAR)
function handleActiveBaseUpgrade(sid,IDUpgrade) {
         if (IDUpgrade == 1){
            //compra commander
                            }
    else if (IDUpgrade == 2){
        let nome = prompt("Insira um nome para salvar  a base")
         saveBase(sid,nome)
                            }
    else if (IDUpgrade == 3){
          let nome = prompt("Insira o nome de uma base, para poder carregar")
         loadBase(nome)
                            }
}

//SALVA A BASE
function saveBase(sid,nome='base1'){
  const user = users[getUserBySID(sid)];
    window.bases=[]
  units.forEach((unit)=>{
  if(unit.owner===user.sid && unit.type!=1){
    let    dir = UTILS.getDirection(unit.x,unit.y,user.x,user.y);
    let    dst = UTILS.getDistance(user.x,user.y,unit.x,unit.y);
    let    uPath = unit.uPath;

      window.bases.push({dir:dir,dst:dst,uPath:uPath,nome:nome})
  }
  })
    localStorage.setItem(nome,JSON.stringify(window.bases))

}


//ZOOM COM SCROLL(GRADATIVO)

let scroll = 0;

mainCanvas.addEventListener ? (window.addEventListener("mousewheel", zoom, !1),
    mainCanvas.addEventListener("DOMMouseScroll", zoom, !1)) : window.attachEvent("onmousewheel", zoom);

function zoom(a) {
    a = window.event || a;
    a.stopPropagation();
    scroll = Math.max(-1, Math.min(1, a.wheelDelta || -a.detail))
    if (scroll == -1) { //zoom out
        if(maxScreenHeight<60000){
      maxScreenWidth += 300
      maxScreenHeight += 300
      resize(true)
        scroll = 0
        }
    }

    if (scroll == 1) { //zoom in
        if(maxScreenHeight>=170){
      maxScreenHeight -= 1
      resize(true)
        scroll = 0
        }
        if(maxScreenWidth >= 1010){
         maxScreenWidth -= 1
      resize(true)
        scroll = 0
        }
    }
}

//TECLA PARA ZOOM
window.addEventListener('keyup', function(a) {
    a = a.keyCode ? a.keyCode : a.which;
       if (document.activeElement == mainCanvas) {
    if (a == window.teclas.zoomMax.keyCode) { // tecla 'o' to  out
        (maxScreenHeight = 30000, maxScreenWidth = 53333, resize(true));
        cameraSpd = (TecPonto==true ? 4.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)

    }
    if (a == window.teclas.zoomMin.keyCode) { // tecla 'i' to zoom in
        (maxScreenHeight = 170, maxScreenWidth = 1010, resize(true))
        cameraSpd = TecPonto==true ? 4.8 : .85;

    }

       }
})


//CARREGA BASE SALVA
function loadBase(nome='base1'){
    selBaseSpawn.padrao = false;
    selBaseSpawn.load = true;

let base = JSON.parse(localStorage.getItem(nome))
 window.bases = base
 popUpGenerico(`Base carregada !!!
Nome: ${bases[0].nome}
`,true,2000)
}

function fazBaseCarregada(){
for(let a=0;a<bases.length;a++){
socket.emit("1",bases[a].dir,bases[a].dst,bases[a].uPath[0])
}
}
//UPGRADE DE UNIDADES
upgradeUnit=function(a){socket&&gameState&&(1==selUnits.length?socket.emit("4",selUnits[0].id,a):(activeBase)?(a==0&&activeBase.sid==player.sid?(socket.emit("4",0,a,1)):(handleActiveBaseUpgrade(activeBase.sid,activeBase.upgrades[a].id))):(upgradeSelUnits(selUnits[0],a)))
 for (var i = 0; i < window.sockets.length; i++) { sockets[i] && gameState && (1 == selUnits.length ? sockets[i].sock.emit("4", selUnits[0].id, a) : activeBase && activeBase.sid == player.sid && sockets[i].sock.emit("4", 0, a, 1)); }
                       }

//MOSTRA INFO DAS UNITS
toggleUnitInfo=function(a,d){var c="";a&&a.uPath&&(c=void 0!=a.group?a.group:a.uPath[0],c=unitList[c].limit?(unitList[c].count||0)+"/"+unitList[c].limit:"");if(a&&(forceUnitInfoUpdate||"block"!=unitInfoContainer.style.display||unitInfoName.innerHTML!=(a.iName||a.name)||lastCount!=c)){forceUnitInfoUpdate=!1;unitInfoContainer.style.display="block";unitInfoName.innerHTML=a.iName||a.name;a.cost?(unitInfoCost.innerHTML="Cost "+a.cost,unitInfoCost.style.display="block"):unitInfoCost.style.display="none";
unitInfoDesc.innerHTML=a.desc;unitInfoType.innerHTML=a.typeName;var b=a.space;lastCount=c;c='<span style="color:#fff">'+c+"</span>";unitInfoLimit.innerHTML=b?'<span><i class="material-icons" style="vertical-align: top; font-size: 20px;">&#xE7FD;</i>'+b+"</span> "+c:c;unitInfoUpgrades.innerHTML="";if(d&&a.upgrades){for(var g,e,h,f,k,c=0;c<a.upgrades.length;++c)(function(b){g=a.upgrades[b];var c=!0;g.lockMaxBuy&&void 0!=g.unitSpawn&&(unitList[g.unitSpawn].count||0)>=(unitList[g.unitSpawn].limit||0)?
c=!1:g.dontShow&&(c=!1);c&&(e=document.createElement("div"),e.className="upgradeInfo",h=document.createElement("div"),h.className="unitInfoName",h.innerHTML=g.name,e.appendChild(h),f=document.createElement("div"),f.className="unitInfoCost",g.cost?(f.innerHTML="Cost "+g.cost,e.appendChild(f)):(null),k=document.createElement("div"),k.id="upgrDesc"+b,k.className="unitInfoDesc",k.innerHTML=g.desc,k.style.display="none",e.appendChild(k),e.onmouseover=function(){document.getElementById("upgrDesc"+b).style.display="block"},
e.onmouseout=function(){document.getElementById("upgrDesc"+b).style.display="none"},e.onclick=function(){upgradeUnit(b);mainCanvas.focus()},unitInfoUpgrades.appendChild(e))})(c);g=e=h=f=k=null}}else a||(unitInfoContainer.style.display="none")}


//FUNÇÕES CONSTRUTORAS


//VENDE UNITS SELECIONADAS
sellSelUnits=function(){ //Vende todas os objetos selecionados para bots
    if (selUnits.length) {
        for (var a = [], d = 0; d < selUnits.length; ++d)
            a.push(selUnits[d].id);
        socket.emit("3", a);

        for (var i = 0; i < window.sockets.length; i++) { window.sockets[i].sock.emit("3", a); }
    }

};


//UPA TODAS AS UNITS SELECIONADAS
function upgradeSelUnits(firstUnit,upgrade){ //UPA todas os objetos selecionados para bots
    var firstUnitName = getUnitFromPath(firstUnit.uPath).name
    for(var i=0;i<selUnits.length;i++){
        var unit = selUnits[i]
        if(getUnitFromPath(unit.uPath).name==firstUnitName){
            socket.emit("4",unit.id,upgrade)
            if(window.sockets.length>0){
            window.sockets.forEach((sk)=>{
            let socket = sk.sock
            socket.emit("4",unit.id,upgrade)
            })
            }
        }
    }
}




//SELECT COMMANDER BOTS
toggleSelUnit = function(){
    if (player && !activeUnit && units) {
        var a = (player.x || 0) - maxScreenWidth / 2 + camX,
            d = (player.y || 0) - maxScreenHeight / 2 + camY,
            c = player.x - a + targetDst * MathCOS(targetDir) + camX,
            b = player.y - d + targetDst * MathSIN(targetDir) + camY;
        disableSelUnit();
        var g = 4 >= MathABS(c - mouseStartX + (b - mouseStartY)),
            e = !1;
        activeBase = null;
        if (g)
            for (var h = 0; h < users.length; ++h)
                if (0 <= users[h].size - UTILS.getDistance(c, b, users[h].x - a, users[h].y - d)) {
                    activeBase = users[h];
                    forceUnitInfoUpdate = !0;
                    break
                }
        if (!activeBase) {
            activeBase = null;
            for (h = 0; h < units.length; ++h)
                if (users[getUserBySID(units[h].owner)] !== undefined && users[getUserBySID(units[h].owner)].name.startsWith(player.name) === true || units[h].owner == player.sid)
                    if (g) {
                        if (0 <= units[h].size - UTILS.getDistance(c, b, units[h].x - a, units[h].y - d)) {
                            selUnits.push(units[h]);
                            var f = getUnitFromPath(selUnits[0].uPath);
                            f && (selUnits[0].info = f, "Unit" == f.typeName && (e = !0));
                            break
                        }
                    } else UTILS.pointInRect(units[h].x - a, units[h].y - d, mouseStartX, mouseStartY, c - mouseStartX, b - mouseStartY) && (selUnits.push(units[h]), f = getUnitFromPath(selUnits[selUnits.length - 1].uPath)) && (selUnits[selUnits.length - 1].info = f, "Unit" == f.typeName && (e = !0));
            if (selUnits.length) {
                for (h = selUnits.length - 1; 0 <= h; --h) e && "Tower" == selUnits[h].info.typeName ? selUnits.splice(h, 1) : e || "Unit" != selUnits[h].info.typeName || selUnits.splice(h, 1);
                selUnitType = e ? "Unit" : "Tower";
                150 < selUnits.length && (selUnits.length = 150)
            }
        }
        updateSelUnitViews()
    }
}

//BOTAO VENDE
updateSelUnitViews=function() {
sellButton.style.display = "block";
for (var a = 0, d = 0; d < selUnits.length; ++d)
a += Math.round(selUnits[d].info.cost / 2);
a ? sellButton.innerHTML = "Sell <span class='spanLink'>" + a + "</span>" : sellButton.style.display = "none"
}



//ESPELHADO
sendUnit = function(a) {
    socket && gameState && activeUnit && !activeUnit.dontPlace && socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
    for (var i = 0; i < window.sockets.length; i++) { sockets[i].sock.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a); }
}


/*UPGRADE ESPELHADO
upgradeUnit = function(a) {
    socket && gameState && (1 == selUnits.length ? socket.emit("4", selUnits[0].id, a) : (activeBase) ? (a == 0 && activeBase.sid == player.sid ? (socket.emit("4", 0, a, 1)) : (handleActiveBaseUpgrade(activeBase.sid, activeBase.upgrades[a].name))) : (upgradeSelUnits(selUnits[0], a)))
    for (var i = 0; i < window.sockets.length; i++) { sockets[i] && gameState && (1 == selUnits.length ? sockets[i].emit("4", selUnits[0].id, a) : activeBase && activeBase.sid == player.sid && sockets[i].emit("4", 0, a, 1)); }
}
*/




//----------------------ARBUSTO INVISIVEL------------------------------------------------//


renderUnit = function(a, d, c, b, g, e, k) { //POR MIM (PlayerX)
    g="rgb(43 69 193 / 33%)"
            var f = b.size * (k ? iconSizeMult : 1),
                h = f + ":" + b.cloak + ":" + b.renderIndex + ":" + b.iSize + ":" + b.turretIndex + ":" + b.shape + ":" + g;
            if (!unitSprites[h]) {
                var m = document.createElement("canvas"),
                    l = m.getContext("2d");
                m.width = 2 * f + 30;
                m.height = m.width;
                m.style.width = m.width + "px";
                m.style.height = m.height + "px";
                l.translate(m.width / 2, m.height / 2);
                l.lineWidth = 2
                l.strokeStyle = "black";
                l.fillStyle = g;
                4 == b.renderIndex ? l.fillStyle = "rgb(0 6 72 / 84%)" : 5 == b.renderIndex && (l.fillStyle = "rgb(255 255 255 / 0%)",
                    renderRect(0, .76 * f, 1.3 * f, f / 2.4, l), l.fillStyle = g);
                b.cloak && (l.fillStyle = "rgb(255 255 255 / 0%)");
                "circle" == b.shape ? (renderCircle(0, 0, f, l), b.iSize && (l.fillStyle = "rgb(255 255 255 / 0%)", renderCircle(0, 0, f * b.iSize, l))) :
                    "triangle" == b.shape ? (renderTriangle(0, 0, f, l), b.iSize && (l.fillStyle = "rgb(255 255 255 / 0%)", renderTriangle(0, 2, f * b.iSize, l))) : "hexagon" == b.shape ? (renderAgon(0, 0, f, l, 6), b.iSize && (l.fillStyle = "rgb(255 255 255 / 0%)", renderAgon(0, 0, f * b.iSize, l, 6))) :
                    "octagon" == b.shape ? (l.rotate(MathPI / 8), renderAgon(0, 0, .96 * f, l, 8), b.iSize && (l.fillStyle = "rgb(255 255 255 / 0%)", renderAgon(0, 0, .96 * f * b.iSize, l, 8))) : "pentagon" == b.shape ? (l.rotate(-MathPI / 2), renderAgon(0, 0, 1.065 * f, l, 5), b.iSize && (l.fillStyle = "rgb(255 255 255 / 0%)", renderAgon(0, 0, 1.065 * f * b.iSize, l, 5))) :
                    "square" == b.shape ? (renderSquare(0, 0, f, l), b.iSize && (l.fillStyle = "rgb(255 255 255 / 0%)", renderSquare(0, 0, f * b.iSize, l))) : "spike" == b.shape ? renderStar(0, 0, f, .7 * f, l, 8) : "star" == b.shape && (f *= 1.2, renderStar(0, 0, f, .7 * f, l, 6));
                if (1 == b.renderIndex) l.fillStyle = "rgb(255 255 255 / 0%)", renderRect(f / 2.8, 0, f / 4, f / 1, l), renderRect(-f / 2.8, 0, f / 4, f / 1, l);
                else if (2 == b.renderIndex) l.fillStyle = "rgb(255 255 255 / 0%)", renderRect(f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l);
                else if (3 == b.renderIndex) l.fillStyle = "rgb(255 255 255 / 0%)", l.rotate(MathPI / 2), renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderCircle(0, 0, .5 * f, l), l.fillStyle = "rgb(255 255 255 / 0%)";
                else if (6 == b.renderIndex) l.fillStyle = "rgb(255 255 255 / 0%)", l.rotate(MathPI / 2), renderRectCircle(0, 0, .7 * f, f / 4, 5, l), l.rotate(-MathPI / 2), renderAgon(0, 0, .4 * f, l, 6);
                else if (7 == b.renderIndex)
                    for (g = 0; 3 > g; ++g) l.fillStyle ="rgb(255 255 255 / 0%)" ? 1 == g ? "transparent" : "transparent" : "transparent", renderStar(0, 0, f, .7 * f, l, 7), f *= .55;
                else 8 == b.renderIndex && (l.fillStyle = "rgb(255 255 255 / 0%)", renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderSquare(0, 0, .5 * f, l));
                1 != b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, k ? iconSizeMult : 1, -(MathPI / 2), l);
                unitSprites[h] = m
            }
            f = unitSprites[h];
            e.save();
            e.translate(a, d);
            e.rotate(c + MathPI / 2);
            e.drawImage(f, -(f.width / 2), -(f.height / 2), f.width, f.height);
            1 == b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, k ? iconSizeMult : 1, b.turRot - MathPI / 2 - c, e);
            e.restore()
        }

//------------------------------DESENHA AS LINHAS DA BASE----------------------------------------//

 renderDottedCircle=function(a, d, c, b) {
            b.setLineDash([0, 0]); b.beginPath(); b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI); b.stroke(); b.setLineDash([]) }
 renderDottedLine=function(a, d, c, b, g) {
            g.setLineDash([0, 0]); g.beginPath(); g.moveTo(a, d); g.lineTo(c, b); g.stroke(); g.setLineDash([]) }


//---------------------------------------LIGA OS PLAYER(LINHA DO JOGO)---------------------------//
function playersLinked(a, d) {
    if (a.sid == player.sid && d.name.startsWith(player.name)) {
        return true;
    }
}


//----------------------------------RENDERIZA BASE------------------------------------------------//


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
  a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgb(255 255 255 / 0%)", renderCircle(d, c, a.size, b));
  b.restore();
   }

//-----------------------------LOOP DO GAME-----------------------------------------//

updateGameLoop=function(a){if(player&&gameData){updateTarget();if(gameState&&mapBounds){if(camXS||camYS)camX+=camXS*cameraSpd*a,camY+=camYS*cameraSpd*a;player.x+camX<mapBounds[0]?camX=mapBounds[0]-player.x:player.x+camX>mapBounds[0]+mapBounds[2]&&(camX=mapBounds[0]+mapBounds[2]-player.x);player.y+camY<mapBounds[1]?camY=mapBounds[1]-player.y:player.y+camY>mapBounds[1]+mapBounds[3]&&(camY=mapBounds[1]+mapBounds[3]-player.y);
currentTime-lastCamSend>=sendFrequency&&(lastCamX!=camX||lastCamY!=camY)&&(lastCamX=camX,lastCamY=camY,lastCamSend=currentTime,socket.emit("2",Math.round(camX),Math.round(camY)))}renderBackground(outerColor);var d=(player.x||0)-maxScreenWidth/2+camX,c=(player.y||0)-maxScreenHeight/2+camY;mapBounds&&(mainContext.fillStyle=backgroundColor,mainContext.fillRect(mapBounds[0]-d,mapBounds[1]-c,mapBounds[2],mapBounds[3]));for(var b,g,e=0;e<units.length;++e)b=units[e],b.interpDst&&(g=b.interpDst*a*.015,b.interX+=
g*MathCOS(b.interpDir),b.interY+=g*MathSIN(b.interpDir),b.interpDst-=g,.1>=b.interpDst&&(b.interpDst=0,b.interX=b.interpDstS*MathCOS(b.interpDir),b.interY=b.interpDstS*MathSIN(b.interpDir))),b.speed&&(updateUnitPosition(b),b.x+=b.interX||0,b.y+=b.interY||0);var h,f;if(gameState)if(activeUnit){h=player.x-d+targetDst*MathCOS(targetDir)+camX;f=player.y-c+targetDst*MathSIN(targetDir)+camY;var k=UTILS.getDirection(h,f,player.x-d,player.y-c);0==activeUnit.type?(b=UTILS.getDistance(h,f,player.x-d,player.y-
c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange-.15&&(h=player.x-d+(player.buildRange-activeUnit.size-.15)*MathCOS(k),f=player.y-c+(player.buildRange-activeUnit.size-.15)*MathSIN(k))):1==activeUnit.type||2==activeUnit.type?(h=player.x-d+(activeUnit.size+player.buildRange)*MathCOS(k),f=player.y-c+(activeUnit.size+player.buildRange)*MathSIN(k)):3==activeUnit.type&&
(b=UTILS.getDistance(h,f,player.x-d,player.y-c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange+2*activeUnit.size&&(h=player.x-d+(player.buildRange+activeUnit.size)*MathCOS(k),f=player.y-c+(player.buildRange+activeUnit.size)*MathSIN(k)));activeUnitDir=k;activeUnitDst=UTILS.getDistance(h,f,player.x-d,player.y-c);activeUnit.dontPlace=!1;mainContext.fillStyle=
outerColor;if(0==activeUnit.type||2==activeUnit.type||3==activeUnit.type)for(e=0;e<units.length;++e)if(1!=units[e].type&&units[e].owner==player.sid&&0<=activeUnit.size+units[e].size-UTILS.getDistance(h,f,units[e].x-d,units[e].y-c)){mainContext.fillStyle=redColor;activeUnit.dontPlace=!0;break}renderCircle(h,f,activeUnit.range?activeUnit.range:activeUnit.size+30,mainContext,!0)}else if(selUnits.length)for(e=0;e<selUnits.length;++e)mainContext.fillStyle=outerColor,1<selUnits.length?renderCircle(selUnits[e].x-
d,selUnits[e].y-c,selUnits[e].size+25,mainContext,!0):renderCircle(selUnits[e].x-d,selUnits[e].y-c,selUnits[e].range?selUnits[e].range:selUnits[e].size+25,mainContext,!0);else activeBase&&(mainContext.fillStyle=outerColor,renderCircle(activeBase.x-d,activeBase.y-c,activeBase.size+50,mainContext,!0));if(selUnits.length)for(mainContext.strokeStyle=targetColor,e=0;e<selUnits.length;++e)selUnits[e].gatherPoint&&renderDottedCircle(selUnits[e].gatherPoint[0]-d,selUnits[e].gatherPoint[1]-c,30,mainContext);
for(e=0;e<users.length;++e)if(b=users[e],!b.dead){mainContext.lineWidth=1.2*outlineWidth;mainContext.strokeStyle=indicatorColor;isOnScreen(b.x-d,b.y-c,b.buildRange)&&(mainContext.save(),mainContext.translate(b.x-d,b.y-c),renderDottedCircle(0,0,b.buildRange,mainContext),renderDottedCircle(0,0,b.startSize,mainContext),mainContext.restore());b.spawnProt&&(mainContext.strokeStyle=redColor,mainContext.save(),mainContext.translate(b.x-d,b.y-c),
renderDottedCircle(0,0,b.buildRange+140,mainContext),mainContext.restore());for(var m=0;m<users.length;++m)e<m&&!users[m].dead&&(mainContext.strokeStyle=b.spawnProt||users[m].spawnProt?redColor:indicatorColor,playersLinked(b,users[m])&&(isOnScreen(b.x-d,b.y-c,0)||isOnScreen(users[m].x-d,users[m].y-c,0)||isOnScreen((b.x+users[m].x)/2-d,(b.y+users[m].y)/2-c,0))&&(g=UTILS.getDirection(b.x,b.y,users[m].x,users[m].y),renderDottedLine(b.x-(b.buildRange+lanePad+(b.spawnProt?140:0))*MathCOS(g)-d,b.y-(b.buildRange+
lanePad+(b.spawnProt?140:0))*MathSIN(g)-c,users[m].x+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathCOS(g)-d,users[m].y+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathSIN(g)-c,mainContext)))}mainContext.strokeStyle=darkColor;mainContext.lineWidth=1.2*outlineWidth;for(e=0;e<units.length;++e)b=units[e],b.layer||(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));for(e=0;e<units.length;++e)b=units[e],
1==b.layer&&(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));mainContext.fillStyle=bulletColor;for(e=bullets.length-1;0<=e;--e){b=bullets[e];if(b.speed&&(b.x+=b.speed*a*MathCOS(b.dir),b.y+=b.speed*a*MathSIN(b.dir),UTILS.getDistance(b.sX,b.sY,b.x,b.y)>=b.range)){bullets.splice(e,1);continue}isOnScreen(b.x-d,b.y-c,b.size)&&renderCircle(b.x-d,b.y-c,b.size,mainContext)}mainContext.strokeStyle=darkColor;mainContext.lineWidth=
1.2*outlineWidth;for(e=0;e<users.length;++e)b=users[e],!b.dead&&isOnScreen(b.x-d,b.y-c,b.size)&&(renderPlayer(b,b.x-d,b.y-c,mainContext),"unknown"!=b.name&&(tmpIndx=b.name+"-"+b.size,20<=b.size&&b.nameSpriteIndx!=tmpIndx&&(b.nameSpriteIndx=tmpIndx,b.nameSprite=renderText(b.name,b.size/4)),b.nameSprite&&mainContext.drawImage(b.nameSprite,b.x-d-b.nameSprite.width/2,b.y-c-b.nameSprite.height/2,b.nameSprite.width,b.nameSprite.height)));if(selUnits.length)for(e=selUnits.length-1;0<=e;--e)selUnits[e]&&
0>units.indexOf(selUnits[e])&&disableSelUnit(e);activeUnit&&renderUnit(h,f,k,activeUnit,playerColors[player.color],mainContext);showSelector&&(mainContext.fillStyle="rgba(255, 255, 255, 0.1)",h=player.x-d+targetDst*MathCOS(targetDir)+camX,f=player.y-c+targetDst*MathSIN(targetDir)+camY,mainContext.fillRect(mouseStartX,mouseStartY,h-mouseStartX,f-mouseStartY));playerBorderRot+=a/5600;hoverUnit?toggleUnitInfo(hoverUnit):activeBase?toggleUnitInfo(activeBase,true):activeUnit?toggleUnitInfo(activeUnit):
0<selUnits.length?toggleUnitInfo(selUnits[0].info,!0):toggleUnitInfo()}};
renderText=function(a, d) { var c = document.createElement("canvas") , b = c.getContext("2d"); b.font = d + "px regularF"; var g = b.measureText(a); c.width = g.width + 20; c.height = 2 * d; b.translate(c.width / 2, c.height / 2); b.font = d + "px regularF"; b.fillStyle = "#00e1ff"; b.textBaseline = "middle"; b.textAlign = "center"; b.strokeStyle = '#001044'; b.lineWidth = outlineWidth; b.strokeText(a, 0, 0); b.fillText(a, 0, 0); return c }


//ENVIA MENSAGEM LOCAL
window.addChat = function(msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">(' + from + ')</span> <span class="chatText" style="color:black">' + msg + "</span>";
    100 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}

//RECEBE E FAZ CHAT

window.addChatLine = function(a, mensagem, c) {
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";
            b.innerHTML = '<span style="color:' + c + '">_' + g + '_[ID:'+a+']</span> <span class="chatText">' + mensagem + "</span>";
            10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
    if (a == player.sid && mensagem.startsWith('*')) {
        window.sockets.forEach(socket => {
            socket.sock.emit("ch", mensagem.split('*')[1])
        })
    }
}

//-----------------------------RECEBE OS EVENTOS DO SERVIDOR-----------------------------------------//

setupSocket=function(){
    socket.on("pong",(a)=>{addChat('',`Ping: ${a}`,'#ffffff82')})
socket.on("connect_error",function(){document.location.reload();enterGame()});
    socket.on("disconnect",function(a){document.location.reload();enterGame()});
    socket.on("error",function(a){kickPlayer("Disconnected. The server may have updated.")});
    socket.on("kick",function(a){kickPlayer(a);enterGame()});
    socket.on("lk",function(a){partyKey=a;});
    socket.on("spawn",function(){
        gameState=1;
        unitList=share.getUnitList();
resetCamera();toggleMenuUI(!1);toggleGameUI(!0);updateUnitList();

        player.upgrades =  [{
            id:1,
            name: "Commander",
            desc: "Powerful commander unit",
            lockMaxBuy: true,
            cost: 1500,
            unitSpawn: 9
        },
        {
            id:2,
            name: "Salvar Base",
            desc: "Salvar Base, Para Poder Usar Em Qualquer Hora",
        },
        {
            id:3,
            name: "Carregar Base",
            desc: "Carregue Uma Base Salva Anteriormente",
        }]

        ;;mainCanvas.focus()});
    socket.on("gd",function(a){gameData=a});
    socket.on("mpd",function(a){mapBounds=a});
    socket.on("ch",function(a,d,c){addChatLine(a,d,c)});
    socket.on("setUser",function(a,d){
        if(a&&a[0]){var c=getUserBySID(a[0]),b={sid:a[0],name:a[1],iName:"Headquarters",dead:!1,color:a[2],size:a[3],startSize:a[4],x:a[5],y:a[6],buildRange:a[7],gridIndex:a[8],spawnProt:a[9],skin:a[10],desc:`ID: ${a[0]} <br>
Base do ${a[1]}<br>
`,kills:666,typeName:"by PlayerX",upgrades:[{id:2,name:"Copiar",desc:"Copiar base para poder usar depois"}]};null!=c?(users[c]=b,d&&(player=users[c])):(users.push(b),d&&(player=users[users.length-1]))}

    });
    socket.on("klUser",function(a){var d=getUserBySID(a);null!=d&&(users[d].dead=!0);player&&player.sid==a&&(hideMainMenuText(),leaveGame(),enterGame())});
    socket.on("delUser",function(a){a=getUserBySID(a);null!=a&&users.splice(a,1)});
    socket.on("au",function(a){a&&(units.push({id:a[0],owner:a[1],uPath:a[2]||0,type:a[3]||0,color:a[4]||0,paths:a[5],x:a[6]||0,sX:a[6]||0,y:a[7]||0,sY:a[7]||0,dir:a[8]||
0,turRot:a[8]||0,speed:a[9]||0,renderIndex:a[10]||0,turretIndex:a[11]||0,range:a[12]||0,cloak:a[13]||0}),units[units.length-1].speed&&(units[units.length-1].startTime=window.performance.now()),a=getUnitFromPath(units[units.length-1].uPath))&&(units[units.length-1].size=a.size,units[units.length-1].shape=a.shape,units[units.length-1].layer=a.layer,units[units.length-1].renderIndex||(units[units.length-1].renderIndex=a.renderIndex),units[units.length-1].range||(units[units.length-1].range=a.range),
units[units.length-1].turretIndex||(units[units.length-1].turretIndex=a.turretIndex),units[units.length-1].iSize=a.iSize)});
    socket.on("spa",function(a,d,c,b){a=getUnitById(a);if(null!=a){var g=UTILS.getDistance(d,c,units[a].x||d,units[a].y||c);300>g&&g?(units[a].interpDst=g,units[a].interpDstS=g,units[a].interpDir=UTILS.getDirection(d,c,units[a].x||d,units[a].y||c)):(units[a].interpDst=0,units[a].interpDstS=0,units[a].interpDir=0,units[a].x=d,units[a].y=c);units[a].interX=0;units[a].interY=0;units[a].sX=
units[a].x||d;units[a].sY=units[a].y||c;b[0]&&(units[a].dir=b[0],units[a].turRot=b[0]);units[a].paths=b;units[a].startTime=window.performance.now()}});
    socket.on("uc",function(a,d){unitList&&(unitList[a].count=d);forceUnitInfoUpdate=!0});
    socket.on("uul",function(a,d){unitList&&(unitList[a].limit+=d)});
    socket.on("rpu",function(a,d){var c=getUnitFromPath(a);c&&(c.dontShow=d,forceUnitInfoUpdate=!0)});
    socket.on("sp",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].spawnProt=d)});
    socket.on("ab",function(a){a&&
bullets.push({x:a[0],sX:a[0],y:a[1],sY:a[1],dir:a[2],speed:a[3],size:a[4],range:a[5]})});
    socket.on("uu",function(a,d){if(void 0!=a&&d){var c=getUnitById(a);if(null!=c)for(var b=0;b<d.length;)units[c][d[b]]=d[b+1],"dir"==d[b]&&(units[c].turRot=d[b+1]),b+=2}});
    socket.on("du",function(a){a=getUnitById(a);null!=a&&units.splice(a,1)});
    socket.on("sz",function(a,d){var c=getUserBySID(a);null!=c&&(users[c].size=d)});
    socket.on("pt",function(a){
        window.PowerPlayer = a;
let containerPonto = document.getElementById("statContainer")
let medicao = Math.round(a/60)

        containerPonto.innerHTML=`<div>Jogadores: <span> ${users.length}</span></div>
                                  <div>Lag: <span> ${onOffLag}</span></div>
                                  <div>Join Troop: <span> ${onOffjointroop}</span></div>
                                  <div style='width: 100%; height: auto; display: flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center'><div style='width:auto;height:auto'>💲</div> <div style='width:100%;height:15px'><div style='text-align: left; align-items: left;width:${medicao}%;height:100%;background-color:#29cb008f'> ${a}$</div></div></div>
                                  <div style='width: 100%; height: auto; display: flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center'><div style='width:auto;height:auto'>❤️</div> <div style='width:100%;height:15px'><div style='text-align: left; align-items: left;width:${player.size}%;height:100%;background-color:#ff000080'> ${player.size}%</div></div></div>
        `

    });


socket.on("l",function(a){
placar = []
for(var d="",c=1,b=0;b<a.length;){
placar.push({posicao:c,nome:a[b+1],pontos:a[b+2],sid:a[b]})
c++,b+=3
if(a==b)break}

layoutGame()
})
}

//----------------------------FUNCAO PARA ENTRAR NO GAME------------------------------------------//

enterGame=function(){
        let aviso = document.getElementById("suportLoading")
        aviso.style.display = "none"
        if(socket&&unitList){
            showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 2)])
                if(hasStorage){
                localStorage.setItem("lstnmdbl",userNameInput.value);
                mainCanvas.focus()
                grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then((a)=>{
                    socket.emit("spawn",{name:"PX "+userNameInput.value,skin:currentSkin},a)
                    }).catch((a)=>{console.log('erro ao executar grecaptcha\n');throw a;})

                }}}

//----------------------------------------------------------------------//

//ADICIONA CSS NA PAGINA
function addCSS(){

    console.log("pré-load: OK")

document.body.style = `
    background-color: #ffffff;
    margin: 0;
    width: 100%;
    height: 100%;
`
    let titulo = document.getElementById("gameTitle"),
    tagLinks = document.getElementById("linksContainer"),
    loading = document.getElementById("loading"),
    linkYT = document.getElementById("linksContainer"),
    todosC = document.getElementById("smallAdContainer"),
    links = document.getElementById("infoLinks"),
    leader = document.getElementById("leaderboardHeader"),
    Clink = document.getElementById("creatorLink"),
    adCont = document.getElementById("adContainer"),
    Darkner = document.getElementById("darkener"),
    enterGbotao = document.getElementById("enterGameButton"),
    inputName = document.getElementById("userNameInput")

    const cor_deFundo = "#5e5e5e87"
    const cor_daFont = "#000000a3"
    const cor_deFundoHome1 = "#5e5e5e87"
    const cor_deFundoHome2 = "#000000a3"
    const corFundoMenu = "#00093473"

//CRIA E ADICIONA O CSS MODIFICADO A PAGINA
const css = document.createElement("style")
css.innerText = `
th, td {
  padding: 8px;
  text-align: left;
  border: 1px solid #000;
}

tr:hover {background-color: #2942b973;}

div::-webkit-scrollbar {
  width: 12px;
}
div::-webkit-scrollbar-track {
  background-color: #001d6e9c;
    border-radius: 10px;
}
div::-webkit-scrollbar-thumb {
  background-color: #000934;
  border-radius: 20px;
  border: 3px solid #0049892b;
}

input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;

}
input[type=number] {
   -moz-appearance: textfield;
   appearance: textfield;

}

#sellButton{
    display: none;
    position: absolute;
    bottom: 18%;
    left: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    border-radius: 4px;
    font-family: 'regularF';
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    padding: 10px;
    pointer-events: all;
}

#statContainer {
    border-top-color: #c30e4059 !important;
    border-color: #862cb957;
    position: absolute;
    border-bottom-color: #c30e4059 !important;
    bottom: 10px;
    width: 20%;
    border-block: initial;
    background-color: #341ead42;
    height: auto;
    border-radius: 10px;
    border-style: solid;
    left: 10px;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
    }


div#leaderboardContainer > div > div {
    width: 70%;
}

.left {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
}
.right {
    width: 50%;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
}

div#leaderboardContainer > div > div > button {
    background-color: transparent;
    border: 0;
}

div#leaderboardContainer > div > div > button:hover {
    background-color: transparent;
    border: 0;
    font-size: larger;
}

div#leaderboardContainer > div {
    width: 100%;
    font-size: small;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: center;
}

#leaderboardContainer {
    display: flex;
    overflow-y: auto;
    width: 20%;
    position: absolute;
    top: 10px;
    right: 10px;
    height: auto;
    padding: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    font-family: 'regularF';
    font-size: 30px;
    border-radius: 4px;
    color: #fff;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    align-content: center;
    flex-wrap: nowrap;
}

div.contMenus > div {
    margin-left: 2% !important;
    padding: 0;
    margin: 0;
    width: auto;
}

div.contMenus > p {
    padding: 0;
    margin: 0;
}

div.contMenus {
    display: flex;
    flex-direction: row;
    pointer-events: all;
    flex-wrap: nowrap;
    height: auto;
    width: 100%;
    padding-top: 5%;
    padding-bottom: 1%;
    align-content: center;
    justify-content: space-between;
    align-items: center;
}

div#contDef {
    pointer-events: all;
}

/* Estilo iOS */
.switch__container {
  margin: 30px auto;
  width: 120px;
}

.switch {
  visibility: hidden;
  position: absolute;
  margin-left: 0;
}

.switch + label {
  display: block;
  position: relative;
  cursor: pointer;
  outline: none;
  user-select: none;
}

.switch--shadow + label {
    padding: 2px;
    width: 40px;
    height: 19px !important;
    background-color: #dddddd;
    border-radius: 25px;
}

.switch--shadow + label:before,
.switch--shadow + label:after {
  display: block;
  position: absolute;
  top: 1px;
  left: 1px;
  bottom: 1px;
  content: "";
}

.switch--shadow + label:before {
  right: 1px;
  background-color: #f1f1f1;
  border-radius: 60px;
  transition: background 0.4s;
}

.switch--shadow + label:after {
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 100%;
    box-shadow: 0 2px 5px rgb(0 0 0 / 30%);
    transition: all 0.4s;
}

.switch--shadow:checked + label:before {
  background-color: #8ce196;
}

.switch--shadow:checked + label:after {
    transform: translateX(22px);
}

/* Estilo Flat */
.switch--flat + label {
  padding: 2px;
  width: 120px;
  height: 60px;
  background-color: #dddddd;
  border-radius: 60px;
  transition: background 0.4s;
}

.switch--flat + label:before,
.switch--flat + label:after {
  display: block;
  position: absolute;
  content: "";
}

.switch--flat + label:before {
  top: 2px;
  left: 2px;
  bottom: 2px;
  right: 2px;
  background-color: #fff;
  border-radius: 60px;
  transition: background 0.4s;
}

.switch--flat + label:after {
  top: 4px;
  left: 4px;
  bottom: 4px;
  width: 56px;
  background-color: #dddddd;
  border-radius: 52px;
  transition: margin 0.4s, background 0.4s;
}

.switch--flat:checked + label {
  background-color: #8ce196;
}

.switch--flat:checked + label:after {
  margin-left: 60px;
  background-color: #8ce196;
}

p#sair {
    margin-left: 95%;
    margin-bottom: 5%;
    margin-top: 0;
    background-color: #dd0000c7;
    text-align: center;
    pointer-events: all;
    border-bottom-left-radius: 5px;
    width: 5%;
    height: auto;
}

p#sair:hover {
    margin-left: 94%;
    margin-bottom: 5%;
    margin-top: 0;
    background-color: #dd0000c7;
    text-align: center;
    border-bottom-left-radius: 5px;
    pointer-events: all;
    width: 6%;
    height: auto;
}

.menuOpc {
    border-width: thin;
    background-color: ${corFundoMenu};
    position: absolute;
    left: 25%;
    top: 25%;
    border-radius: 20px;
    border-top-right-radius: 0% !important;
    border-style: double;
}

button.botaoMenu1 {
    background-color: #4a4a4a33;
    border-color: #0c0c0c29;
    width: auto;
    pointer-events: all;
    -webkit-text-stroke: thin;
    height: 20px;
    transition: 1s;
    border-radius: 10px;
}

button.botaoMenu1:hover {
    background-color: #4a4a4a33;
    -webkit-text-stroke: thin;
    border-color: #00000091;
    width: auto;
    pointer-events: all;
    transition: 1s;
    height: 20px;
    border-radius: 10px;
}

div#menu1 {
    background-color: ${corFundoMenu};
    width: 8%;
    font-size: small;
    display: flex;
    transition: ${tempoTransicao}s;
    transition-delay: 2s !important;
    border-bottom-right-radius: 25px;
    pointer-events: all;
    height: 5.5%;
    position: absolute;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: center;
}

div#menu1:hover {
    background-color: ${corFundoMenu};
    width: 74%;
    display: flex;
    transition: ${corFundoMenu};
    transition-delay: 0s !important;
    border-bottom-right-radius: 25px;
    pointer-events: all;
    height: 7.5%;
    position: absolute;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: center;

}

#unitInfoContainer {
    padding-top: 5%;
    display: none;
}

div#portatorConfig {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-around;
    align-items: center;
}

div#configControle {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
}

.toggle {
    margin-bottom: 40px;
}

.toggle > input {
    display: none;
}

.toggle > label {
    position: relative;
    display: block;
    height: 20px;
    width: 44px;
    background: #898989;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.toggle > label:after {
    position: absolute;
    left: -2px;
    top: -3px;
    display: block;
    width: 26px;
    height: 26px;
    border-radius: 100px;
    background: #fff;
    box-shadow: 0px 3px 3px rgba(0,0,0,0.05);
    content: '';
    transition: all 0.3s ease;
}

.toggle > label:active:after {
    transform: scale(1.15, 0.85);
}

.toggle > input:checked ~ label {
    background: #6fbeb5;
}

.toggle > input:checked ~ label:after {
    left: 20px;
    background: #179588;
}

.toggle > input:disabled ~ label {
    background: #d5d5d5;
    pointer-events: none;
}

.toggle > input:disabled ~ label:after {
    background: #bcbdbc;
}

div#redesSociais {
    width: 100%;
    background-color: #50505091;
    height: auto;
}

.spanLink {
 width: 100%;
    text-align: center;
    font-family: fantasy;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #5c5c5c8c;
    color: #000000a3;
}

#lobbyKey {
    font-size: 20px;
}

.spanLink:hover {
   width: 100%;
    text-align: center;
    font-family: fantasy;
    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: #5c5c5c8c;
    color: #000000a3;
}

.deadLink {
width: 100%;
    text-align: center;
    font-family: fantasy;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #313a67d1;
    color: #000b2969;
}

.deadLink:hover {
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #5a6392d1;
    color: #0f39ab69;
}

#userNameInput {
    font-family: '-webkit-pictograph';
    font-size: 25px;
    padding: 0;
    margin: 0;
    border: 0;
    width: calc(100% - 30%);
    color: ${cor_daFont};
    background-color: ${cor_deFundo};
    text-align: center;
    border-radius: 40px;
    border-block: initial;
    border-color: #262626;
    border-style: double;
}

#userNameInput:hover {
    font-family: '-webkit-pictograph';
    font-size: 25px;
    padding: 0;
    margin: 0;
    border: 0;
    width: calc(100% - 20%);
    color: ${cor_daFont};
    background-color: ${cor_deFundo};
    text-align: center;
    border-radius: 40px;
    border-block: initial;
    border-color: #262626;
    border-style: double;
}

#userNameInput input:focus, .input-wrapper input:active{
    border-color:red;
}

#gameTitle {
width: auto;
    color: black;
    margin: 0;
    font-size: 3cm;
    font-family: fantasy;
}

#darkener {
display: block;
position: absolute;
width: 100%;
height: 100%;
}

.centerContent{
    border-block: unset;
    border-color: #00000040;
    border-style: double;
    text-align: center;
    height: 100%;
    display: flex !important;
    border-radius: 20px;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    align-content: center !important;
    justify-content: center !important;
    align-items: center !important;
}

#loadingContainer {
    color: #000000;
    font-size: calc(100% + 10px);
}

::placeholder{
color: #0000009e;
font-size: calc(100% - 40%);
}

#enterGameButton {
   font-family: '-webkit-pictograph';
    font-size: 25px;
    padding: 0;
    margin: 0;
    border: 0;
    width: calc(100% - 30%);
    color: ${cor_daFont};
    background-color: ${cor_deFundo};
    text-align: center;
    border-radius: 40px;
    border-block: initial;
    border-color: #262626;
    border-style: double;
}

#enterGameButton:hover {
   font-family: '-webkit-pictograph';
    font-size: 25px;
    padding: 0;
    margin: 0;
    border: 0;
    width: calc(100% - 20%);
    color: ${cor_daFont};
    background-color: ${cor_deFundo};
    text-align: center;
    border-radius: 40px;
    border-block: initial;
    border-color: #262626;
    border-style: double;
}

#skinInfo {
    display: grid;
    margin: 0;
    flex-direction: column;
    flex-wrap: nowrap;
    background-color: #00000026;
    align-content: center;
    padding: 0;
    background-color: ${cor_deFundo};
    position: relative;
    border-block: initial;
    border-color: #262626;
    border-style: double;
    justify-content: center;
    align-items: center;
}

#skinIcon {
    width: 100%;
    height: 100%;
    opacity: 0.4;
}

#containerForm {
    background-color: ${cor_deFundoHome2};
    width: auto;
    height: auto;
    display: flex;
    position: relative;
    border-radius: 20px;
    top: 0px;
    z-index: 100;
    align-items: center;
    text-align: center;
    cursor: crosshair;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
}

html, body{
  width: 100%;
  height: 100%;
}

.container{
    position: absolute;
    background: linear-gradient(0, #120c56, #000000);
    height: 100%;
    width: 100%;
}

#instructionsText {
display: none
}

#mainCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: crosshair;
}

div#skinSelecao {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    align-content: center;
}

div#frenteSkin {
    font-size: calc(100% + 200%);
}

div#atrasSkin {
    font-size: calc(100% + 200%);
}

div#frenteSkin:hover {
    font-size: calc(100% + 300%);
}

div#atrasSkin:hover {
    font-size: calc(100% + 300%);
}

img#logoHome {
    top: 0;
    width: 24.8%;
    z-index:1;
    position: absolute;
}

img#wallpaper {
    top: 0;
    z-index: 0;
    width: -webkit-fill-available;
    height: -webkit-fill-available;
}

#menuContainer {
    width: 100%;
    height: 100%;
    display: flex;
    top: 0;
    z-index: 2;
    align-items: center;
    text-align: center;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
}

p#atualizaFPS{
    padding: 0;
    -webkit-text-stroke: medium;
    margin: 0;
    text-transform: uppercase;
}

#gameUiContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    display: none;
    pointer-events: none;
    background-color: rgb(2 0 108 / 33%);
}

`,document.head.appendChild(css);


//TELA INICIAL

let body = tagLinks.parentNode
body.removeChild(tagLinks)

linkYT.innerHTML = "";

adCont.innerHTML = "";

Clink.innerHTML = "";

leader.innerHTML = "";

links.innerHTML = "";

todosC.innerHTML = "";

inputName.onfocus = false;

enterGbotao.innerHTML = "<div>⚔COMEÇAR⚔</div>";

//FIM TELA INICIAL
     return addJS()
}

function modificaElementos(){

console.log("addJS: OK");

const status = document.getElementById("suportLoading")
document.body.removeChild(status)

let suportLoading = document.createElement("div")
suportLoading.id = "suportLoading"
suportLoading.innerHTML = `
CARREGADO...
<style>
div#suportLoading{
    width: 100%;
    font-size: 30px;
    align-items: center;
    font-family: fantasy;
    position: absolute;
    z-index: 10000;
    top: 0;
    text-align: center;
    color: green;
    height: auto;
    cursor: crosshair;
    }
    </style>
`;

document.body.appendChild(suportLoading)

    let configpainelpai = document.createElement("div")
    let configpainelpot = document.createElement("div")
    let configpainelfilho = document.createElement("div")
    let configpainelInput = document.createElement("input")
    let configpainelLabel = document.createElement("label")
    let configpainelfilho2 = document.createElement("div")
    let configpainelInput2 = document.createElement("input")
    let configpainelLabel2 = document.createElement("label")

//----------------------------------------------------------------------//

        configpainelpai.id = "configpai"

        configpainelfilho.class = "toggle"

        configpainelInput.type = "checkbox"
        configpainelInput.id = "mouse"
        configpainelInput.value = "mouse"
        configpainelInput.checked = true

        configpainelLabel.for = "mouse"
        configpainelLabel.innerText = "Mouse"

        configpainelfilho.appendChild(configpainelLabel)
        configpainelfilho.appendChild(configpainelInput)

//----------------------------------------------------------------------//

        configpainelfilho2.class = "toggle"

        configpainelInput2.type = "checkbox"
        configpainelInput2.id = "touchpad"
        configpainelInput2.value = "touchpad"

        configpainelLabel2.for = "touchpad"
        configpainelLabel2.innerText = "Touchpad"

        configpainelfilho2.appendChild(configpainelLabel2)
        configpainelfilho2.appendChild(configpainelInput2)

//----------------------------------------------------------------------//

        configpainelpot.id = "portatorConfig"
        configpainelpot.appendChild(configpainelfilho)
        configpainelpot.appendChild(configpainelfilho2)

        configpainelpai.appendChild(configpainelpot)

//----------------------------------------------------------------------//

    let linksSociais = document.createElement("div")
        linksSociais.id = "redesSociais"
        linksSociais.appendChild(configpainelpai)

    let formEnterGameClass = document.getElementsByClassName("centerContent")
        formEnterGameClass[0].id = "painel"

    let formEnterGame = document.getElementById("painel")

    let menucontainer = document.getElementById("menuContainer")

    let containerForm = document.createElement("div")
        containerForm.id = "containerForm"

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

    menucontainer.removeChild(formEnterGame)

    containerForm.appendChild(formEnterGame)
    containerForm.appendChild(linksSociais)

    menucontainer.appendChild(containerForm)

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//SELEÇÃO DE SKIN PERSONALIZADA
    let avo = document.getElementById("userInfoContainer");
    let pai = document.createElement("div");
    let btnskin = document.getElementById("skinSelector");

pai.id = "skinSelecao";

    let anterior = document.createElement("div");

anterior.id = "atrasSkin";
anterior.innerHTML = "▶";
anterior.addEventListener('keyup', ()=>changeSkin(-1))

    let skinInf = document.getElementById("skinInfo");
    let prox = document.createElement("div");

prox.id = "frenteSkin";
prox.innerHTML = "◀";

avo.removeChild(btnskin);
avo.removeChild(skinInf);

pai.appendChild(skinInf);
pai.appendChild(anterior);

    let skinInfP = skinInf.parentNode;

skinInfP.insertBefore(prox,skinInf);

avo.appendChild(pai)


let nextSkin = document.getElementById("frenteSkin")
nextSkin.addEventListener('click', ()=>{
    changeSkin(1);

})


let vltSkin = document.getElementById("atrasSkin")
vltSkin.addEventListener('click', ()=>{
    changeSkin(-1);

})

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//Adiciona uma logo na home

let container = document.getElementById("darkener")
let img = document.createElement("img")
img.id = "logoHome";
img.src = "https://github.com/PlayerX-000/img/blob/main/PlayerX.png?raw=true";
container.appendChild(img)

//adiciona um fundo na tela principal

let wallpaper = document.createElement("img")
wallpaper.id = "wallpaper";
wallpaper.src = "https://github.com/PlayerX-000/img/blob/main/1414647.jpg?raw=true"
container.appendChild(wallpaper)

//
//conecta a um servior

/*                                                   EM DESENVOLVIMENTO
    let cod = document.createElement("script")
    cod.type = "text/javascript"
    cod.src = `${host}/socket.io/socket.io.js`
   document.body.appendChild(cod)
*/
    //FIM TELA INICIAL


    return console.log("modificaElementos: OK")
}

function addJS(){

console.log("addCSS: OK")

adsbygoogle = undefined

$("#mouse").click(()=>{
let touchpad = document.getElementById("touchpad").checked
if(touchpad===true)document.getElementById("touchpad").checked = false;
})
$("#touchpad").click(()=>{
let mouse = document.getElementById("mouse").checked
if(mouse===true)document.getElementById("mouse").checked = false;
})

document.getElementById("enterGameButton").onclick = function(){enterGame()}




    return modificaElementos()
}


//FUNCÇÔES DO SCRIPT






////////////////FUNÇÕES USADAS PELO PLAYER



function layoutGame(){
let placarParty = document.getElementById("leaderboardContainer")

placarParty.innerHTML = ""
for(let a=0;a<placar.length;a++){

let divbtn = document.createElement("div")
let divLupa = document.createElement("div")
let btnSrc = document.createElement("button")

divbtn.innerHTML = `<div class='left' style='font-size: small; display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; justify-content: flex-start; align-content: center;'><div>${placar[a].posicao}º- </div><div style='overflow-x:hidden;pointer-evente:all'>${placar[a].nome}</div></div>`

btnSrc.className = "srcBase"
btnSrc.style = "pointer-events: all;"
btnSrc.id = placar[a].sid
btnSrc.innerText = "🔎"

divLupa.style = "font-size: small; display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: flex-end; align-items: center; align-content: center;"
divLupa.innerHTML = `<div class='left' style='font-size: small;'> (${placar[a].pontos})</div>`

btnSrc.onclick = function(){

const idUser = Number(this.id)
users.filter((user)=>{
if(user.sid === idUser){
camX = user.x -  player.x
camY = user.y - player.y
}
})
}
divLupa.appendChild(btnSrc)
divbtn.appendChild(divLupa)
placarParty.appendChild(divbtn)
}
}
function criaMenus(){
  //tela do game
    let contAppend=document.getElementById("gameUiContainer")
    //div com os botoes
    let divMenuPai = document.createElement("div")

    let botao1 = document.createElement("button")
    let botao2 = document.createElement("button")
    let botao3 = document.createElement("button")
    let ico = document.createElement("p")

ico.id = "atualizaFPS"
botao1.innerText = "Base"
botao2.innerText = "Ajuda"
botao3.innerText = "Funções"
botao1.className = "botaoMenu1"
botao2.className = "botaoMenu1"
botao3.className = "botaoMenu1"

botao1.onclick = function(){
if(document.getElementById("menuOpc")===null){
    base()
}
}
botao2.onclick = function(){
if(document.getElementById("menuOpc")===null){
    configuracoes()
}
}
botao3.onclick = function(){
if(document.getElementById("menuOpc")===null){
opcoes()
}
}

divMenuPai.id = "menu1"

botao1.classList.add("hide");
botao2.classList.add("hide");
botao3.classList.add("hide");

divMenuPai.appendChild(ico)

contAppend.insertBefore(divMenuPai,contAppend.firstChild)

        divMenuPai.onmouseleave = () => {
/*
botao1.classList.add("hide");
botao2.classList.add("hide");
botao3.classList.add("hide");
*/
divMenuPai.removeChild(botao1)
divMenuPai.removeChild(botao2)
divMenuPai.removeChild(botao3)
}

        divMenuPai.onmouseover = () => {
divMenuPai.appendChild(botao1)
divMenuPai.appendChild(botao2)
divMenuPai.appendChild(botao3)
/*
botao1.classList.remove("hide");
botao2.classList.remove("hide");
botao3.classList.remove("hide");
*/
}

//pega o fps a cada 1 segundo

let before,now,fps,fpsps;
before=Date.now();
fps=0;
requestAnimationFrame(
    function loop(){
        now=Date.now();
        fps=Math.round(1000/(now-before));
        before=now;
        requestAnimationFrame(loop);
    }
 );

  setInterval(function(){
      if(gameState!==1) return
        fpsps=fps
      document.getElementById("atualizaFPS").innerText = "fps("+fpsps+")"
        },1000)



}
function alteraMapa(){
units.forEach((a)=>{
if(a.owner<0)a.renderIndex = 0
})
}

function lerEventos(){
	socket._emit = socket.emit;

	socket.emit = (...args) => {
        socket._emit(...args)
	}
}

const waitUntilReadyInterval = setInterval(() => {
	if (socket) {
		clearInterval(waitUntilReadyInterval);
		lerEventos();
	}
}, 100);


//ABRE popup Da BASE
function base(){

    //tela do game
    let contAppend=document.getElementById("gameUiContainer")
    //div com os botoes
    let divBase = document.createElement("div")
   let sellallbot = document.createElement("button")
   let dpkbot = document.createElement("button")
    let divBaseCont = document.createElement("div")
    let back = document.createElement("p")
       let containerPowerBOT = document.createElement("div")


       containerPowerBOT.className = "contMenus"

    containerPowerBOT.innerHTML = `<p>FullPower BOT </p><div class="switch__container">
  <input id="switch-shadowfpb" value="off" class="switch switch--shadow" type="checkbox">
  <label for="switch-shadowfpb"></label>
</div>
`

back.innerText = "X"
back.id = "sair"

sellallbot.innerText = "Vender tudo"
sellallbot.className = "botaoMenu1"
sellallbot.id = "vendetdBot"

dpkbot.innerText = "DPK bot"
dpkbot.className = "botaoMenu1"
dpkbot.id = "dpkBot"

    sellallbot.onclick = () => {vendeBot()}
        dpkbot.onclick = () => {dpkbots()}

divBase.id = "menuOpc"
divBase.className = "menuOpc"
divBase.style.width = "50%"
divBase.style.height = "50%"

divBaseCont.style=`
width: 65%;
    height: 75%;
    margin-left: 2%;
    pointer-events: auto;
    overflow: hidden auto;
    border: #001b66b5;
    border-style: outset;
    border-radius: 2%;
    border-inline: none;
`

divBase.appendChild(back)
divBaseCont.appendChild(sellallbot)
divBaseCont.appendChild(dpkbot)
divBaseCont.appendChild(containerPowerBOT)
divBase.appendChild(divBaseCont)

contAppend.insertBefore(divBase,contAppend.firstChild)

back.onclick = () => fechaBase(contAppend)



     var onOffFullpBOT = document.getElementById("switch-shadowfpb")
 if(onOffFPB=="off" && onOffFullpBOT.value == "on") onOffFullpBOT.click()
 if(onOffFPB=="on" && onOffFullpBOT.value == "off") onOffFullpBOT.click()
onOffFullpBOT.value = onOffFPB

onOffFullpBOT.onclick = () =>{
    if(onOffFullpBOT.value == "on"){
        onOffFullpBOT.value="off"
        onOffFPB = "off"
        clearInterval(fazBaseBot)
    }else if(onOffFullpBOT.value=="off"){
        onOffFullpBOT.value="on"
        onOffFPB = "on"
           window.fazBaseBot = setInterval(BaseBot,2000)
    }

}



}

const fechaBase = (contAppend) =>{
    let popup = document.getElementById("menuOpc")
    contAppend.removeChild(popup)
}

//ABRE popup Das configurações
function configuracoes(){
    //tela do game
    let contAppend=document.getElementById("gameUiContainer")
    let divPai = document.createElement("div")
    let divBaseConfig = document.createElement("div")
    let table = document.createElement("div");
    let back = document.createElement("p")

back.innerText = "X"
back.id = "sair"

divBaseConfig.id = "menuOpc"
divBaseConfig.className = "menuOpc"
divBaseConfig.style.width = "50%"
divBaseConfig.style.height = "50%"
divBaseConfig.appendChild(back)

divPai.style = `
    width: 100%;
    height: 80%;
    pointer-events: auto;
    overflow: hidden auto;
    border: outset rgba(0, 27, 102, 0.71);
    border-radius: 2%;
    border-inline: none;
`;

table.style = `
    width:100%;
    height:auto;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    align-content: center;
    justify-content: flex-start;
`;

table.innerHTML = `
<table width="10%" border="1" cellspacing="0" cellpadding="4" style='width: 100%; height: max-content;'>

 <caption>Teclas do SCRIPT</caption>

  <colgroup>
    <col style="background-color: #00d0ff29;">
    <col style="background-color: #0000ff1c;">
    <col style="background-color: #ff003b0d;">
  </colgroup>

    <tbody>
 <tr align="center">
        <td>Tecla</td>
        <td>função</td>
        <td>explicação</td>
    </tr>

 <tr align="center">
        <td>V</td>
        <td>Lag</td>
        <td>Ativa e desativa lag</td>
    </tr>

     <tr align="center">
        <td>B</td>
        <td>JoinTroop</td>
        <td>Ativa e desativa a função de juntar tropas</td>
    </tr>

     <tr align="center">
       <td>O</td>
       <td>Min Zoom</td>
       <td>Aumenta o alcançe da camera</td>
    </tr>

       <tr align="center">
       <td>I</td>
       <td>Max Zoom</td>
       <td>Diminue o alcançe da camera</td>
    </tr>

      <tr align="center">
       <td>P</td>
       <td>Junta Tropa</td>
       <td>Junta todas as tropas selecionadas</td>
    </tr>

      <tr align="center">
       <td>C</td>
       <td>Def manual</td>
       <td>Defende manualmente</td>
    </tr>

         <tr align="center">
       <td>X</td>
       <td>Retira construçoes</td>
       <td>Tira construções desnecessarias para poder fazer full atk</td>
    </tr>

      <tr align="center">
       <td>Z</td>
       <td>Faz Base</td>
       <td>Faz ultima base que estava sendo utilizada ou padrão</td>
    </tr>

          <tr align="center">
       <td>Shift</td>
       <td>Faz Upgrade na Base</td>
       <td>Ataliza wall, barrack, armoury</td>
    </tr>

          <tr align="center">
       <td>E</td>
       <td>Compra Commander</td>
       <td>Compra e seleciona unidade: COMMANDER</td>
    </tr>

          <tr align="center">
       <td>Q</td>
       <td>Seleciona Soldier</td>
       <td>Seleciona todos os soldados do jogador</td>
    </tr>

          <tr align="center">
       <td>F</td>
       <td>Seleciona Tudo</td>
       <td>Seleciona todas as unidades exceto construções e siege</td>
    </tr>

          <tr align="center">
       <td>.</td>
       <td>Velocidade camera</td>
       <td>Aumenta a velocidade de movimentação da camera</td>
    </tr>

              <tr align="center">
       <td>* + Mensagem</td>
       <td>Fala dos Bots</td>
       <td>Enviar mensagem no chat com * na frente az com q todos os bots falem a msg</td>
    </tr>
    <tbody>
    </table>
`;
divPai.appendChild(table)
divBaseConfig.appendChild(divPai)


contAppend.insertBefore(divBaseConfig,contAppend.firstChild)

back.onclick = () => fechaConfiguracoes(contAppend)
}

const fechaConfiguracoes = (contAppend) =>{
    let popup = document.getElementById("menuOpc")
    contAppend.removeChild(popup)
}

//ABRE popup Das Opções
function opcoes(){

    //tela do game
let contAppend=document.getElementById("gameUiContainer")
    //div com os botoes
    let divBaseConfig = document.createElement("div")
    let divBaseConfigCont = document.createElement("div")
    let divBaseConfigInf = document.createElement("div")
    let divBaseConfigContP = document.createElement("div")
    let containerLink = document.createElement("div")
    let containerDef = document.createElement("div")
    let derrubar = document.createElement("div")
    let fullpower = document.createElement("div")
    let antKick = document.createElement("div")
    let fullatk = document.createElement("div")
    let textoLinksala = document.createElement("input")
    let linksala = document.createElement("button")
    let centralizaContainer = document.createElement("div")
    let centraliza = document.createElement("button")
    let spabot = document.createElement("button")
    let ultControl = document.createElement("div")
    let rembot = document.createElement("button")
    let qntbot = document.createElement("input")
    let back = document.createElement("p")


divBaseConfigInf.style = `
width: 50%;
    height: 100%;
display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
`
divBaseConfigInf.id = 'InfsMenu'
divBaseConfigInf.innerHTML = `Bots: ${window.sockets.length}`

divBaseConfigContP.style=`
display: flex;
    flex-flow: row nowrap;
    place-content: center space-between;
    align-items: center;
    width: 100%;
    height: 76%;
    margin-inline-start: auto;
    margin-inline-end: auto;
`

centralizaContainer.className = "contMenus"
antKick.className = "contMenus"
fullatk.className = "contMenus"
containerDef.className = "contMenus"
derrubar.className = "contMenus"
fullpower.className = "contMenus"

containerLink.id = "contLink"

back.innerText = "X"
back.id = "sair"

divBaseConfigCont.style = `
width: 100%;
    margin-left: 2%;
    height: 100%;
    pointer-events: auto;
    overflow: hidden auto;
    border: #001b66b5;
    border-style: outset;
    border-radius: 2%;
    border-inline: none;

`

divBaseConfig.id = "menuOpc"
divBaseConfig.className = "menuOpc"
divBaseConfig.style.width = "50%"
divBaseConfig.style.height = "50%"
divBaseConfig.appendChild(back)

linksala.innerText = "Copiar"
linksala.className = "botaoMenu1"
linksala.id = "copylink"


centraliza.innerText = "Centralizar"
centraliza.className = "botaoMenu1"
centraliza.id = "copylink"

spabot.innerText = "Add"
spabot.className = "botaoMenu1"
spabot.id = "SpawnBot"

rembot.id = "RemoveBot"
rembot.innerText = "Remove"
rembot.className = "botaoMenu1"

qntbot.id = "NumberBot"
qntbot.style = "width: 25%;border-radius: 15px;"
qntbot.type = "number"

ultControl.style = "display: flex; flex-direction: row; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center;"


ultControl.appendChild(rembot)
ultControl.appendChild(qntbot)
ultControl.appendChild(spabot)

textoLinksala.id = "linksala"
textoLinksala.value = "http://bloble.io/?l=" + partyKey
textoLinksala.type = "text"
textoLinksala.style = `
background-color: #898989;
border-radius: 10px;
`
centraliza.onclick = () => {
CE()
}

linksala.onclick = () => {
    const texto = document.getElementById("linksala")
    texto.select();
    texto.setSelectionRange(0, 99999)
    document.execCommand("copy");
    alert("Copiado")
                         }
spabot.onclick = async() =>{
var qntBot = document.getElementById("NumberBot").value


   if(onOffBot=="off") return
   if(gameState==0) return
    fechaOpcoes(contAppend)
let valor = Number(qntBot);
if(valor<=0)valor = 1;
  await Bots(valor)
}

rembot.onclick = async() =>{
var qntBot = document.getElementById("NumberBot").value

   if(onOffBot=="off") return
   if(gameState==0) return
    fechaOpcoes(contAppend)
let valor = Number(qntBot);
if(valor<=0)valor = 1;
classBot.RemoveBots(valor)
}




containerLink.appendChild(textoLinksala)
containerLink.appendChild(linksala)


derrubar.innerHTML = `<p>BOT's </p>
`,derrubar.appendChild(ultControl)

containerDef.innerHTML = `<p>DEFEND </p><div class="switch__container">
  <input id="switch-shadowDef" value="off" class="switch switch--shadow" type="checkbox">
  <label for="switch-shadowDef"></label>
</div>
`
fullpower.innerHTML = `
<p>FULL POWER </p><div class="switch__container">
  <input id="switch-shadowPower" value="off" class="switch switch--shadow" type="checkbox">
  <label for="switch-shadowPower"></label>
</div>
`
centralizaContainer.innerHTML = `
<p>CENTRALIZAR</p>
`,centralizaContainer.appendChild(centraliza)

antKick.innerHTML = `
<p>ANT KICK </p><div class="switch__container">
  <input id="switch-shadowAntKick" value="off" class="switch switch--shadow" type="checkbox">
  <label for="switch-shadowAntKick"></label>
</div>
`
fullatk.innerHTML = `
<p>FULL ATK AUTO </p><div class="switch__container">
  <input id="switch-shadowFullatk" value="off" class="switch switch--shadow" type="checkbox">
  <label for="switch-shadowFullatk"></label>
</div>
`

divBaseConfig.appendChild(containerLink)
divBaseConfigCont.appendChild(antKick)
divBaseConfigCont.appendChild(fullatk)
divBaseConfigCont.appendChild(derrubar)
divBaseConfigCont.appendChild(containerDef)
divBaseConfigCont.appendChild(fullpower)
divBaseConfigCont.appendChild(centralizaContainer)

divBaseConfigContP.appendChild(divBaseConfigCont)
divBaseConfigContP.appendChild(divBaseConfigInf)

divBaseConfig.appendChild(divBaseConfigContP)

contAppend.insertBefore(divBaseConfig,contAppend.firstChild)

back.onclick = () => fechaOpcoes(contAppend)

 //DEF
 var onOffDefelement = document.getElementById("switch-shadowDef")
 if(onOffDef=="off" && onOffDefelement.value == "on") onOffDefelement.click()
 if(onOffDef=="on" && onOffDefelement.value == "off") onOffDefelement.click()
onOffDefelement.value = onOffDef

onOffDefelement.onclick = () =>{
    if(onOffDefelement.value == "on"){
        onOffDefelement.value="off"
        onOffDef = "off"
clearInterval(defendLoop)
    }else if(onOffDefelement.value=="off"){
        onOffDefelement.value="on"
        onOffDef = "on"
window.defendLoop = setInterval(()=>{
defend.filtraInimigos(units,player);
defend.verificaDistancia();
defend.acionaDef(window.placeWalls);
},200)
    }

}


//Bots
/*
 var BotsS =  document.getElementById("switch-shadowDeRR")

 if(onOffBot=="off" && BotsS.value == "on") BotsS.click()
 if(onOffBot=="on" && BotsS.value == "off") BotsS.click()
BotsS.value = onOffBot
*/


//POWER
 var onOffPowerelement = document.getElementById("switch-shadowPower")
 if(onOffPower=="off" && onOffPowerelement.value == "on") onOffPowerelement.click()
 if(onOffPower=="on" && onOffPowerelement.value == "off") onOffPowerelement.click()
onOffPowerelement.value = onOffPower
onOffPowerelement.onclick = () =>{
    if(onOffPowerelement.value == "on"){
        onOffPowerelement.value="off"
        onOffPower = "off"
        clearInterval(power)
    }else if(onOffPowerelement.value=="off"){
        onOffPowerelement.value="on"
        onOffPower = "on"
   window.power = setInterval(()=>{

   gerador(socket)
   powerPlants(socket)
   },1000)
    }

}


//AUTO FULL ATK
 var onOffFKAelements = document.getElementById("switch-shadowFullatk")
 if(onOffFKA=="off" && onOffFKAelements.value == "on") onOffFKAelements.click()
 if(onOffFKA=="on" && onOffFKAelements.value == "off") onOffFKAelements.click()
onOffFKAelements.value = onOffFKA
onOffFKAelements.onclick = () =>{

    if(onOffFKAelements.value == "on"){
        onOffFKAelements.value="off"
        onOffFKA = "off"
        clearInterval(fullatkautoVar)
    }else if(onOffFKAelements.value=="off"){
        onOffFKAelements.value="on"
        onOffFKA = "on"

   window.fullatkautoVar = setInterval(()=>{

  fullatkauto(socket)
   },1000)
    }

}


//ANT KICK
 var onOffAntKick = document.getElementById("switch-shadowAntKick")
 if(onOffantkick=="off" && onOffAntKick.value == "on") onOffAntKick.click();
 if(onOffantkick=="on" && onOffAntKick.value == "off") onOffAntKick.click();
onOffAntKick.value = onOffantkick
onOffAntKick.onclick = () =>{
    if(onOffAntKick.value == "on"){
        onOffAntKick.value="off"
        onOffantkick = "off"
    }else if(onOffAntKick.value=="off"){
        onOffAntKick.value="on"
        onOffantkick = "on"
    }

}

}

const fechaOpcoes = (contAppend) =>{
    let popup = document.getElementById("menuOpc")
    contAppend.removeChild(popup)
}


//auto base(fullatk)
function fullatkauto(socket){
    let siegeExistbarrack, commanderExist, siegeExist


if(onOffFKA==="off") return

if(window.PowerPlayer<4000){
gerador(socket)
powerPlants(socket)
}else
if(window.PowerPlayer>4000){
commanderExist = units.some((unit)=>{
if(unit.type == 1 && unit.shape=="star" && unit.owner==player.sid) return unit
})

if(commanderExist==false){
spawnaComanderESeleciona()

}else{
    socket.emit("1",-2.08,309.99919886993257,8)
    for (var i = 0; i < units.length; ++i){
    if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 2)
     }
}


siegeExistbarrack = units.some((unit)=>{
if(unit.type == 2 && unit.shape=="square"  && unit.owner==player.sid) return unit
})

siegeExist = units.some((unit)=>{
if(unit.type == 1 && unit.shape=="triangle" && unit.uPath[0]==11  && unit.owner==player.sid) return unit
})

if(siegeExistbarrack==true){
if(siegeExist==true){
  for(let a=0;a<units.length;a++){
        if(units[a].uPath[0]==8 && units[a].uPath[1]==2 && units[a].owner==player.sid){
       let z = []
        z.push(units[a].id)
        socket.emit("3",z)
        }
        }

        for(let a=0;a<units.length;a++){
        if(units[a].uPath[0]==11 && units[a].owner==player.sid){
        selUnits.push(units[a])
            CE()
        }
        }
    tirafull()
    fullAtk(socket)
    setTimeout(()=>{soldadoarmory(socket)},800)
    setTimeout(()=>{UpgradeGreaterBarracks1(socket)},900)
    setTimeout(()=>{microGenerators(socket)},1000)
    setTimeout(()=>{
           onOffFKA = "off"
           clearInterval(fullatkautoVar)
    },1100)
    }else{
      let aer = []
units.forEach((a)=>{
if(a.owner==player.sid&&a.dir>0.1)aer.push(a.id)
})
socket.emit('3',aer)
 House(socket)
    }

    }
}
}
}



//centraliza
function CE() {
var trops = [];
    if (player.x == null) {
        player.x == 0.
    }
    if (player.y == null) {
        player.y == 0.
    }
for (var b = 0; b < selUnits.length; ++b){

    trops.push(selUnits[b].id);

}

socket.emit("5",
Math.floor((player.x))*(1.0000009999),
Math.floor((player.y))*(1.0000000999),
trops, 0, -1);

}




//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//PopUp Generico(pode ser definido um tempo em que ele sera visivel e uma mensagem)

const popUpGenerico=(Mensagem="...",Contador=false,Tempo=5000)=>{

    //tela do game
    let contAppend=document.getElementById("gameUiContainer")
    //div com os botoes
    let divBaseConfig = document.createElement("div")

    let back = document.createElement("p")

    let msg = document.createElement("div")

msg.style.width = "100%"
msg.style.height = "100%"
msg.style = "display: flex; flex-direction: column; flex-wrap: nowrap; align-content: center; justify-content: center; align-items: center"
msg.innerHTML = "<div style='text-align:center'>"+Mensagem+"</div>"


back.innerText = "X"
back.id = "sair"

divBaseConfig.id = "popUpGenerico"
divBaseConfig.className = "menuOpc"
divBaseConfig.style.width = "50%"
divBaseConfig.style.height = "20%"
divBaseConfig.appendChild(back)
divBaseConfig.appendChild(msg)

let veryG = document.getElementById("popUpGenerico")

if(veryG==null){
contAppend.insertBefore(divBaseConfig,contAppend.firstChild)
}else{
fechaPopUpGenerico(veryG)
contAppend.insertBefore(divBaseConfig,contAppend.firstChild)
}
if(Contador===true){
setTimeout(()=>{fechaPopUpGenerico(divBaseConfig)},Tempo)
}
back.onclick = () => fechaPopUpGenerico(divBaseConfig)
}

const fechaPopUpGenerico = (divBaseConfig) => {
    let pai = divBaseConfig.parentNode
    pai.removeChild(divBaseConfig)
}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||


//RETIRA OS BOTS
function RBots(objetivo=1){
let Qnt = objetivo;
let retirados = 0;

for(;retirados<Qnt;){
retirados+=1;
window.sockets[0].sock.close();
window.sockets.splice(0, 1);
console.log(retirados)
console.log(Qnt)
if(retirados==Qnt || window.sockets.length<=0){
popUpGenerico(`${retirados} de ${Qnt} removidos`,true,3000);
return
};
};



}
window.ioConn


//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//ADD OS BOTS

class CriacaoBots {
constructor(maxAdd,minAdd,limite){
this.max = maxAdd;
this.min = minAdd;
this.aviso = ``;
this.cont = 0;
this.valor = 0;
this.limite = limite;
};

RemoveBots(a){
let valor = a;
const ob = window.sockets.length - valor;
let atual = window.sockets.length;
if(ob<=0)valor = atual;
for(let a=0;a<valor;a++){
let arrBots = window.sockets.filter(bot => (bot!=undefined))
window.sockets = arrBots;
window.sockets[0].sock.close();
window.sockets.splice(0, 1);
}
}

addValor(valor){
this.valor = valor;
};

verificaValor(){
if(this.valor<this.min)this.valor = this.min,this.aviso = `! Quantidade de bots nao alcança o minimo esperado de ${this.min} Bot<br> -Numero de spawns alterado para ${this.min}`;
if(this.valor>this.max)this.valor = this.max,this.aviso = `! Quantidade de bots ultrapassa o limite de ${this.max} Bots<br> -Numero de spawns alterado para ${this.max}`;
};

verificaLimiteDeBots(){
if(window.sockets.length>=this.limite){
onOffBot = "off"
};
};

alertaLimiteAlcancado(){
return popUpGenerico(`Numero de bots alcançado... Para acesso completo fale com o PlayerX/DEV`,true,3000);
}

popUpGeraSocket(){
popUpGenerico(`
${this.aviso}<br>
${this.cont }/${this.valor}
`);
};

popUpSpawnaSocket(){
popUpGenerico("Spawnando Bots...",true,2000);
};

zeraAdd(){
this.aviso = ``;
this.cont = 0;
this.valor = 0;
};

spawnBots(){
window.sockets.forEach((socket,pos)=>{
if((pos)>=this.limite)return;
socket.sock.emit("spawn",{name:userNameInput.value,skin:13,},socket.captcha);
});
};
};

let spwVxMin = 1;
let spwVxMax = 5;
let limBots = 10;

const classBot = new CriacaoBots(spwVxMax,spwVxMin,limBots);

function criarArrBot(cap){
return new Promise(function (resolve, reject) {
try{
const socketz = io.connect(socket.io.uri,{query:"cid="+UTILS.getUniqueID()+'666PlayerX999'+"&rmid=undefined"});
window.sockets[window.idBot]={sock:socketz,captcha:cap};
resolve();
}catch(err){
reject(err);
};
});
};

async function Bots(a=1){
classBot.addValor(a)
classBot.verificaValor()
if(classBot.cont<classBot.valor){
classBot.verificaLimiteDeBots()
classBot.popUpGeraSocket()
await grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then((cap)=>{
criarArrBot(cap).then(res=>{
window.idBot+=1;
classBot.cont += 1;
}).catch(err=>{
throw err;
});
});
classBot.verificaValor()
if(onOffBot == "on"){
Bots(a);
}else{
classBot.alertaLimiteAlcancado();
classBot.spawnBots();
}
}else{
classBot.zeraAdd();
classBot.popUpSpawnaSocket();
classBot.spawnBots();
};
};


//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||


//SPAWNA BOTS
function SPAWN(){

    popUpGenerico("Spawnando Bots...",true,2000)
window.sockets.forEach((socket,pos)=>{
  socket.sock.emit("spawn",{name:userNameInput.value,skin:13,},socket.captcha)
})

}


//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||


//VERIFICA POWER DOS BOTS E CONSTROI FULLPOWER
function BaseBot(){
if(onOffFPB=="off")return
sockets.forEach((socket,pos)=>{

socket.sock.on("pt",function(a){
window.ptsBot = a

})


if(window.ptsBot<6000){
gerador(socket.sock)
 microGenerators(socket.sock)
 powerPlants(socket.sock)
}
})

}

//VERIFICA QUAL BASE PLAYER ESTA USANDO PARA REFAZER BASE ATUAL
function VeryBase(){
 
if(selBaseSpawn.load==true){
fazBaseCarregada()
}else
if(selBaseSpawn.padrao==true){
fullAtk(socket)
}else
if(selBaseSpawn.outra==true){

}
}



function resetVeryBase(){
selBaseSpawn.load = false;
selBaseSpawn.padrao = true;
selBaseSpawn.outra = false;
}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||
//teclas eventos

//ao soltar tecla
window.addEventListener("keyup",(a)=>{
    let tecla = event.keyCode || event.which
if (document.activeElement == mainCanvas){


if(tecla == window.teclas.speedCam.keyCode){ //caractere (ponto final)
    TecPonto = false;
    cameraSpd = (TecPonto==true ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
}


}
})

//ao precionar tecla
window.addEventListener("keydown",async function(event){
    let tecla = event.keyCode || event.which
if (document.activeElement == mainCanvas) {

if(tecla == window.teclas.speedCam.keyCode){ //caractere (ponto final)
    TecPonto = true;
    cameraSpd = (TecPonto==true ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
}
if(tecla==window.teclas.def.keyCode){ //tecla c
	placeWalls(socket);
}
if(tecla==window.teclas.resetaVerybase.keyCode){ //tecla t
	resetVeryBase();
}
if(tecla==window.teclas.lag.keyCode){ //tecla v
lagOnOff()
}
if(tecla==window.teclas.tiraInterno.keyCode){ //tecla x
tirafull()
}
if(tecla==window.teclas.fullatk.keyCode){ //tecla z
VeryBase()
}
if(tecla==window.teclas.joinTroop.keyCode){ //tecla b
joiOnOff()
}
if(tecla==window.teclas.JuntaTropa.keyCode){ //tecla p
       function movebot(){
    var e = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;

        for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
        sockets.forEach((sock)=>{
              sock.sock.emit("5", a, d, e, 0, -1)
        })
    }
        movebot()
        if(onOffjointroop=="on"){
    if(onOffLag=="on"){
juntarComLag()
    }else if(onOffLag=="off"){
await juntarSemLag()
    }}else if(onOffjointroop=="off"){
    moveSemLag()
    }
}
if(tecla==window.teclas.selCommander.keyCode){ //tecla e
spawnaComanderESeleciona()
}
if(tecla==window.teclas.selSoldier.keyCode){ //tecla q
selecionaMenosCommander()
}
if(tecla==window.teclas.selAll.keyCode){ //tecla f
selecionaMenosSiege()
}
if(tecla==window.teclas.upgrade.keyCode){ //tecla Shift
 soldadoarmory(socket)
 UpgradeGreaterBarracks1(socket)
 microGenerators(socket)
 powerPlants(socket)
}
}
})



//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//aciona eventos enquanto mouse estiver pressionado(tropas seguem sem precisar ficar clicando com o mouse)

let intervalo
mainCanvas.addEventListener("mousedown",function(a){
    a.preventDefault();a.stopPropagation()

    if(document.activeElement!=mainCanvas) mainCanvas.focus();
    mouseStartX=maxScreenWidth/2+targetDst*MathCOS(targetDir);
    mouseStartY=maxScreenHeight/2+targetDst*MathSIN(targetDir);
    showSelector=!0;
    activeUnit?(showSelector=!1,3===a.which?toggleActiveUnit():unitList&&(a=unitList.indexOf(activeUnit),sendUnit(a))):3!==a.which&&2!==a.button||!selUnits.length||(showSelector=!1,"Unit"==selUnitType?  intervalo = setInterval(()=>{moveSelUnits()},100):setSelUnitGather())
});

mainCanvas.addEventListener("mouseup", function(){
   clearInterval(intervalo);
});

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//entrar no game ao dar enter no input name(tela inicial)
document.getElementById("userNameInput").addEventListener("keypress",(tecla)=>{
        let cod = tecla.keyCode ? tecla.keyCode : tecla.which;
    if(cod && cod === 13) enterGame()
})

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//liga desliga o Lag
function lagOnOff(){
if(onOffLag=="on"){
onOffLag="off"
}else if(onOffLag=="off"){
onOffLag="on"
}
}

//liga desliga o JoinTroop
function joiOnOff(){
if(onOffjointroop=="on"){
onOffjointroop="off"
}else if(onOffjointroop=="off"){
onOffjointroop="on"
}
}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||


//spawna full wall
function placeWalls() {
  let objwall=[{
           coamdnos:           socket.emit("1",-2.08,309.99919886993257,1),
           coamdnos:           socket.emit("1",-2.5,309.9985538675946,1),
           coamdnos:           socket.emit("1",-1.06,309.9996570965847,1),
           coamdnos:           socket.emit("1",-0.64,309.99990225804925,1),
           coamdnos:           socket.emit("1", -1.06, 310, 1),
           coamdnos:           socket.emit("1", -2.08, 310, 1),
           coamdnos:           socket.emit("1", -0.64, 310, 1),
           coamdnos:           socket.emit("1", -2.5, 310, 1),
           coamdnos:           socket.emit("1", -1.87, 306, 1),
           coamdnos:           socket.emit("1", -1.27, 306, 1),
           coamdnos:           socket.emit("1", -1.67, 306, 1),
           coamdnos:           socket.emit("1", -1.47, 306, 1),
           coamdnos:           socket.emit("1", -2.29, 306, 1),
           coamdnos:           socket.emit("1", -0.85, 306, 1),
           coamdnos:           socket.emit("1", -0.43, 306, 1),
           coamdnos:           socket.emit("1", -2.71, 306, 1),
           coamdnos:           socket.emit("1", -2.91, 306, 1),
           coamdnos:           socket.emit("1", -0.23, 306, 1),
           coamdnos:           socket.emit("1", -0.03, 306, 1),
           coamdnos:           socket.emit("1", -3.11, 306, 1),
           coamdnos:           socket.emit("1", 2.97, 306, 1),
           coamdnos:           socket.emit("1", 0.17, 306, 1),
           coamdnos:           socket.emit("1", 2.77, 306, 1),
           coamdnos:           socket.emit("1", 0.37, 306, 1),
           coamdnos:           socket.emit("1", 0.57, 306, 1),
           coamdnos:           socket.emit("1", 2.57, 306, 1),
           coamdnos:           socket.emit("1", 2.37, 306, 1),
           coamdnos:           socket.emit("1", 0.77, 306, 1),
           coamdnos:           socket.emit("1", 0.97, 306, 1),
           coamdnos:           socket.emit("1", 2.17, 306, 1),
           coamdnos:           socket.emit("1", 1.97, 306, 1),
           coamdnos:           socket.emit("1", 1.17, 306, 1),
           coamdnos:           socket.emit("1", 1.37, 306, 1),
           coamdnos:           socket.emit("1", 1.77, 306, 1),
           coamdnos:           socket.emit("1",Math.PI*-1.5,306,1),
           coamdnos:           socket.emit("1", -1.7, 245.85, 1),
           coamdnos:           socket.emit("1", -1.45, 245.85, 1),
           coamdnos:           socket.emit("1", -1.96, 245.85, 1),
           coamdnos:           socket.emit("1", -1.19, 245.85, 1),
           coamdnos:           socket.emit("1", -0.94, 245.85, 1),
           coamdnos:           socket.emit("1", -2.21, 245.85, 1),
           coamdnos:           socket.emit("1", -2.46, 245.85, 1),
           coamdnos:           socket.emit("1", -0.69, 245.85, 1),
           coamdnos:           socket.emit("1", -2.71, 245.85, 1),
           coamdnos:           socket.emit("1", -0.44, 245.85, 1),
           coamdnos:           socket.emit("1", -2.96, 245.85, 1),
           coamdnos:           socket.emit("1", -0.19, 245.85, 1),
           coamdnos:           socket.emit("1", 3.07, 245.85, 1),
           coamdnos:           socket.emit("1", 0.06, 245.85, 1),
           coamdnos:           socket.emit("1", 2.82, 245.85, 1),
           coamdnos:           socket.emit("1", 0.31, 245.85, 1),
           coamdnos:           socket.emit("1", 2.57, 245.85, 1),
           coamdnos:           socket.emit("1", 0.57, 245.85, 1),
           coamdnos:           socket.emit("1", 2.32, 245.85, 1),
           coamdnos:           socket.emit("1", 0.82, 245.85, 1),
           coamdnos:           socket.emit("1", 1.07, 245.85, 1),
           coamdnos:           socket.emit("1", 2.07, 245.85, 1),
           coamdnos:           socket.emit("1", 1.32, 245.85, 1),
           coamdnos:           socket.emit("1", 1.82, 245.85, 1),
           coamdnos:           socket.emit("1",Math.PI*-1.5,245.85,1),
           coamdnos:           socket.emit("1", -1.91, 184.69, 1),
           coamdnos:           socket.emit("1", -1.23, 184.4, 1),
           coamdnos:           socket.emit("1", -2.25, 185.57, 1),
           coamdnos:           socket.emit("1", -0.89, 184.93, 1),
           coamdnos:           socket.emit("1", -2.58, 190.21, 1),
           coamdnos:           socket.emit("1", -0.56, 190.16, 1),
           coamdnos:           socket.emit("1", -2.9, 186.72, 1),
           coamdnos:           socket.emit("1", -0.24, 185.76, 1),
           coamdnos:           socket.emit("1", 3.05, 183.1, 1),
           coamdnos:           socket.emit("1", 0.09, 183.95, 1),
           coamdnos:           socket.emit("1", 0.42, 189.81, 1),
           coamdnos:           socket.emit("1", 2.72, 189.79, 1),
           coamdnos:           socket.emit("1", 0.74, 187.09, 1),
           coamdnos:           socket.emit("1", 2.4, 188, 1),
           coamdnos:           socket.emit("1", 2.07, 181, 1),
           coamdnos:           socket.emit("1", 1.08, 181.02, 1),
           coamdnos:           socket.emit("1", 1.735, 188.31, 1),
           coamdnos:           socket.emit("1", 1.41, 188.81, 1),
           coamdnos:           socket.emit("1",Math.PI*1.5,140,1),
           coamdnos:           socket.emit("1", -2.095, 130, 1),
           coamdnos:           socket.emit("1", -1.048, 130, 1),
           coamdnos:           socket.emit("1", -2.565, 130, 1),
           coamdnos:           socket.emit("1", -0.58, 130, 1),
           coamdnos:           socket.emit("1", -3.035, 130, 1),
           coamdnos:           socket.emit("1", -0.09, 130, 1),
           coamdnos:           socket.emit("1", 0.38, 130, 1),
           coamdnos:           socket.emit("1", 2.78, 130, 1),
           coamdnos:           socket.emit("1", 2.3, 130, 1),
           coamdnos:           socket.emit("1", 0.86, 130, 1),
           coamdnos:           socket.emit("1", 1.83, 130, 1),
           coamdnos:           socket.emit("1", 1.33, 130, 1)
         }]
     objwall[0]
}


window.placeWalls = placeWalls

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//cria full power
function gerador(socketB){
    socketB.emit("1",-1.7700175093099544, 243.8531699609419, 3)
    socketB.emit("1", 1.5700171594315573, 243.85007402090326, 3);
    socketB.emit("1", 2.4400100710526793, 196.79985467474305, 3);
    socketB.emit("1", 2.2400039007898447, 243.85656849877958, 3);
    socketB.emit("1", -2.7800023458624703, 194.6788252481507, 3);
    socketB.emit("1", 1.9699911201667188, 243.85313366860794, 3);
    socketB.emit("1", 2.0999878201715214, 185.58517209087591, 3);

    socketB.emit("1", 1.8700025978863808, 132.00487756139935, 3);
    socketB.emit("1", 1.2599938029024704, 132.00454272486235, 3);
    socketB.emit("1", 1.3800278697318928, 194.13178049974198, 3);
    socketB.emit("1", 1.7600061169825598, 194.06341746965091, 3);
    socketB.emit("1", -2.4400027616849433, 185.75130282181078, 3);
    socketB.emit("1", -2.1999936469647867, 131.99750300668575, 3);

    socketB.emit("1", -2.5899833434664847, 243.84680949317334, 3);
    socketB.emit("1", 3.0599865137335724, 131.9992848465475, 3);
    socketB.emit("1", 2.3700155322992322, 132.00115908582003, 3);
    socketB.emit("1", 2.7699990995853443, 180.63860107961412, 3);
    socketB.emit("1", 2.910001829109119, 243.8501927413633, 3);
    socketB.emit("1", 2.6399909192202835, 243.84888476267423, 3);
    socketB.emit("1", 3.1100150743706907, 196.05774072961268, 3);

    socketB.emit("1", -2.9699920613329622, 243.85151732150447, 3);
    socketB.emit("1", -2.690040409174835, 132.00027613607475, 3);
    socketB.emit("1", -2.3099851374683826, 243.85151732150447, 3);
    socketB.emit("1", -2.0399825212769436, 243.85142525726602, 3);
    socketB.emit("1", 0.7600044161827382, 132.00282572733062, 3);
    socketB.emit("1", 0.35996640663856383, 180.10304605974878, 3);
    socketB.emit("1", 0.029980358323314006, 197.1585985951411, 3);
    socketB.emit("1", -0.439963547142766, 132.00080795207285, 3);
    socketB.emit("1", 0.0800082011395776, 132.0022685411125, 3);
    socketB.emit("1", 0.22998938484625386, 243.85088271318605, 3);
    socketB.emit("1", 0.5000045603394669, 243.85230796529285, 3);

    socketB.emit("1", 0.7000201471114224, 196.1091423162112, 3);
    socketB.emit("1", 0.8999878082444033, 243.84691201653544, 3);
    socketB.emit("1", 1.0399986494012126, 186.08457861950842, 3);
    socketB.emit("1", 1.170002238251199, 243.8551629553904, 3);
    socketB.emit("1", -0.170023102819992, 243.84605081895415, 3);
    socketB.emit("1", -0.36001357695289626, 194.92632916053194, 3);
    socketB.emit("1", -0.7000068138510656, 183.7252296229344, 3);

    socketB.emit("1", -1.3600094643934062, 243.84717119540267, 3);
    socketB.emit("1", -1.0899817628353876, 243.84783862072678, 3);
    socketB.emit("1", -0.5500054440958607, 243.85303709406625, 3);
    socketB.emit("1", -0.8199991749608286, 243.85031002645857, 3);
    socketB.emit("1", -1.9300228177358634, 182.30682104627905, 3);
    socketB.emit("1", -1.199997990229862, 183.82290662482725, 3);
    socketB.emit("1", -0.9500096278543927, 131.99805036438974, 3);
    socketB.emit("1", -1.5699815385655684, 196.37006518306183, 3);
    socketB.emit("1", -1.5699629936544652, 132.00004583332537, 3);

}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//base full atk
const fullAtk=(socketB)=>{
    socketB.emit("1",-1.5700106126708684, 140.00004321427903, 7);
    socketB.emit("1",-2.08,309.99919886993257,8)
    socketB.emit("1",-2.5,309.9985538675946,8)
    socketB.emit("1",-1.06,309.9996570965847,8)
    socketB.emit("1",-0.64,309.99990225804925,8)
    socketB.emit("1", -1.87, 306, 1),socketB.emit("1", -1.27, 306, 1),socketB.emit("1", -1.67, 306, 1),socketB.emit("1", -1.47, 306, 1),socketB.emit("1", -2.29, 306, 1),socketB.emit("1", -0.85, 306, 1),socketB.emit("1", -0.43, 306, 1),socketB.emit("1", -2.71, 306, 1),socketB.emit("1", -2.91, 306, 1),socketB.emit("1", -0.23, 306, 1),socketB.emit("1", -0.03, 306, 1),socketB.emit("1", -3.11, 306, 1),socketB.emit("1", 2.97, 306, 1),socketB.emit("1", 0.17, 306, 1),socketB.emit("1", 2.77, 306, 1),socketB.emit("1", 0.37, 306, 1),socketB.emit("1", 0.57, 306, 1),socketB.emit("1", 2.57, 306, 1),socketB.emit("1", 2.37, 306, 1),socketB.emit("1", 0.77, 306, 1),socketB.emit("1", 0.97, 306, 1),socketB.emit("1", 2.17, 306, 1),socketB.emit("1", 1.97, 306, 1),socketB.emit("1", 1.17, 306, 1),socketB.emit("1", 1.37, 306, 1),socketB.emit("1", 1.77, 306, 1),socketB.emit("1",Math.PI*-1.5,306,1),socketB.emit("1", -1.7, 245.85, 4),socketB.emit("1", -1.45, 245.85, 4),socketB.emit("1", -1.96, 245.85, 4),socketB.emit("1", -1.19, 245.85, 4),socketB.emit("1", -0.94, 245.85, 4),socketB.emit("1", -2.21, 245.85, 4),socketB.emit("1", -2.46, 245.85, 4),socketB.emit("1", -0.69, 245.85, 4),socketB.emit("1", -2.71, 245.85, 4),socketB.emit("1", -0.44, 245.85, 4),socketB.emit("1", -2.96, 245.85, 4),socketB.emit("1", -0.19, 245.85, 4),socketB.emit("1", 3.07, 245.85, 4),socketB.emit("1", 0.06, 245.85, 4),socketB.emit("1", 2.82, 245.85, 4),socketB.emit("1", 0.31, 245.85, 4),socketB.emit("1", 2.57, 245.85, 4),socketB.emit("1", 0.57, 245.85, 4),socketB.emit("1", 2.32, 245.85, 4),socketB.emit("1", 0.82, 245.85, 4),socketB.emit("1", 1.07, 245.85, 4),socketB.emit("1", 2.07, 245.85, 4),socketB.emit("1", 1.32, 245.85, 4),socketB.emit("1", 1.82, 245.85, 4),socketB.emit("1",Math.PI*-1.5,245,4),socketB.emit("1", -1.91, 184.69, 4),socketB.emit("1", -1.23, 184.4, 4),socketB.emit("1", -2.25, 185.57, 4),socketB.emit("1", -0.89, 184.93, 4),socketB.emit("1", -2.58, 190.21, 4),socketB.emit("1", -0.56, 190.16, 4),socketB.emit("1", -2.9, 186.72, 4),socketB.emit("1", -0.24, 185.76, 4),socketB.emit("1", 3.05, 183.1, 4),socketB.emit("1", 0.09, 183.95, 4),socketB.emit("1", 0.42, 189.81, 4),socketB.emit("1", 2.72, 189.79, 4),socketB.emit("1", 0.74, 187.09, 4),socketB.emit("1", 2.4, 188, 4),socketB.emit("1", 2.07, 181, 4),socketB.emit("1", 1.08, 181.02, 4),socketB.emit("1", 1.735, 188.31, 4),socketB.emit("1", 1.41, 188.81, 4),socketB.emit("1", -2.095, 130, 4),socketB.emit("1", -1.048, 130, 4),socketB.emit("1", -2.565, 130, 4),socketB.emit("1", -0.58, 130, 4),socketB.emit("1", -3.035, 130, 4),socketB.emit("1", -0.09, 130, 4),socketB.emit("1", 0.38, 130, 4),socketB.emit("1", 2.78, 130, 4),socketB.emit("1", 2.3, 130, 4),socketB.emit("1", 0.86, 130, 4),socketB.emit("1", 1.83, 130, 4),socketB.emit("1", 1.33, 130, 4);
    }

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//faz houses
const House=(socketB)=>{
socketB.emit("1", -1.7, 245.85, 4),socketB.emit("1", -1.45, 245.85, 4),socketB.emit("1", -1.96, 245.85, 4),socketB.emit("1", -1.19, 245.85, 4),socketB.emit("1", -0.94, 245.85, 4),socketB.emit("1", -2.21, 245.85, 4),socketB.emit("1", -2.46, 245.85, 4),socketB.emit("1", -0.69, 245.85, 4),socketB.emit("1", -2.71, 245.85, 4),socketB.emit("1", -0.44, 245.85, 4),socketB.emit("1", -2.96, 245.85, 4),socketB.emit("1", -0.19, 245.85, 4),socketB.emit("1", 3.07, 245.85, 4),socketB.emit("1", 0.06, 245.85, 4),socketB.emit("1", 2.82, 245.85, 4),socketB.emit("1", 0.31, 245.85, 4),socketB.emit("1", 2.57, 245.85, 4),socketB.emit("1", 0.57, 245.85, 4),socketB.emit("1", 2.32, 245.85, 4),socketB.emit("1", 0.82, 245.85, 4),socketB.emit("1", 1.07, 245.85, 4),socketB.emit("1", 2.07, 245.85, 4),socketB.emit("1", 1.32, 245.85, 4),socketB.emit("1", 1.82, 245.85, 4),socketB.emit("1",Math.PI*-1.5,245,4),socketB.emit("1", -1.91, 184.69, 4),socketB.emit("1", -1.23, 184.4, 4),socketB.emit("1", -2.25, 185.57, 4),socketB.emit("1", -0.89, 184.93, 4),socketB.emit("1", -2.58, 190.21, 4),socketB.emit("1", -0.56, 190.16, 4),socketB.emit("1", -2.9, 186.72, 4),socketB.emit("1", -0.24, 185.76, 4),socketB.emit("1", 3.05, 183.1, 4),socketB.emit("1", 0.09, 183.95, 4),socketB.emit("1", 0.42, 189.81, 4),socketB.emit("1", 2.72, 189.79, 4),socketB.emit("1", 0.74, 187.09, 4),socketB.emit("1", 2.4, 188, 4),socketB.emit("1", 2.07, 181, 4),socketB.emit("1", 1.08, 181.02, 4),socketB.emit("1", 1.735, 188.31, 4),socketB.emit("1", 1.41, 188.81, 4),socketB.emit("1", -2.095, 130, 4),socketB.emit("1", -1.048, 130, 4),socketB.emit("1", -2.565, 130, 4),socketB.emit("1", -0.58, 130, 4),socketB.emit("1", -3.035, 130, 4),socketB.emit("1", -0.09, 130, 4),socketB.emit("1", 0.38, 130, 4),socketB.emit("1", 2.78, 130, 4),socketB.emit("1", 2.3, 130, 4),socketB.emit("1", 0.86, 130, 4),socketB.emit("1", 1.83, 130, 4),socketB.emit("1", 1.33, 130, 4);
}
//tira construções desnecessarias para o full atk
function tirafull(){
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid && units[d].type !=1) {
         let upath = units[d].uPath[0]
if(units[d].dir == -1.06) {
if(upath!==4 && upath!==7 && upath!==5 && upath!==2 && upath!==8){
a.push(units[d].id)
socket.emit("3", a)
}}}}
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid && units[d].type !=1) {
         let upath = units[d].uPath[0]
if(units[d].dir == -2.08) {
if(upath!==4 && upath!==7 && upath!==5 && upath!==2 && upath!==8){
a.push(units[d].id)
socket.emit("3", a)
}}}}
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid && units[d].type !=1) {
         let upath = units[d].uPath[0]
if(units[d].dir == -0.64) {
if(upath!==4 && upath!==7 && upath!==5 && upath!==2 && upath!==8){
a.push(units[d].id)
socket.emit("3", a)
}}}}
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid && units[d].type !=1) {
         let upath = units[d].uPath[0]
if(units[d].dir == -2.5) {
if(upath!==4 && upath!==7 && upath!==5 && upath!==2 && upath!==8){
a.push(units[d].id)
socket.emit("3", a)
}}}}
var sellwall;
for(var i=0,s=[],s2=[];i<units.length;++i){
if (units[i].owner == player.sid && units[i].type !=1) {
         let upath = units[i].uPath[0]
sellwall = UTILS.getDistance(player.x,player.y,units[i].x,units[i].y);
if(upath!==4 && upath!==7 && upath!==5 && upath!==2 && upath!==8){
if(UTILS.roundToTwo(sellwall)<300){
s.push(units[i].id);
socket.emit("3",s);
}}}}}

//VENDE TUDO PARA OS BOTS
function vendeBot(){

      window.sockets.forEach(socket => {
          let userMesmoNome = []

        users.forEach((user)=>{
            if(user.name == player.name) userMesmoNome.push(user)
        })

        for (var a = [], d = 0; d < units.length; ++d) {

            userMesmoNome.forEach((bots)=>{
            if(units[d].type!=1 && units[d].owner == bots.sid ){a.push(units[d].id)
                socket.sock.emit("3", a);
                                                               }
        })

       }
    })
};

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//upgrades

//upgrade para boulder
function UpgradeBoulder(socket){
        units.forEach(unit=>{
if(3 == unit.type && "circle" == unit.shape){
            socket.emit("4", unit.id, 0)
  }
})
}

//upgrade para spike
function UpgradeSpikes(socket){
        units.forEach(unit=>{
     if(3 == unit.type && "hexagon" == unit.shape){
         socket.emit("4", unit.id, 0)
     }
})
        }

//upgrade anti tank
function UpgradeAntiTankGun(socket){

        units.forEach(unit=>{
    if(0 == unit.type && 4 == unit.turretIndex && "circle" == unit.shape){
        socket.emit("4", unit.id, 1)
    }
})
}

//upgrade torreta longa
function UpgradeRangedTurret(socket){

      units.forEach(unit=>{
      if(0 == unit.type && 1 == unit.turretIndex && "circle" == unit.shape){
          socket.emit("4", unit.id, 1)
      }
})
}

//upgrade para spotter
function UpgradeSpotterTurret(socket){
     units.forEach(unit=>{
     if(0 == unit.type && 3 == unit.turretIndex && "circle" == unit.shape){
         socket.emit("4", unit.id, 0)
     }
 })
}


//upgrade para micro geradores
function microGenerators(socketB){
    units.forEach(unit=>{
        if (unit.type === 3 && "circle" == unit.shape) {
            socketB.emit("4", unit.id, 1)
        }
})
}

//upgrade para power plants
function powerPlants(socketB){
     units.forEach(unit=>{
        if (unit.type === 0 && "hexagon" == unit.shape) {
            socketB.emit("4", unit.id, 0)
        }
    })

}
//upgrade barracas
function UpgradeGreaterBarracks1(socketB){
     units.forEach(unit=>{
     if(2 == unit.type && "square" == unit.shape){
         socketB.emit("4", unit.id, 0)
     }
})
}

//upa soldados (upgrade armoury)
function soldadoarmory(socketB){
     for (var i = 0; i < units.length; ++i){
     if(0 == units[i].type && getUnitFromPath(units[i].uPath).name ==="Armory"){
         socketB.emit("4", units[i].id, 0);
     }
}
}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//move unidades
moveSelUnits = async function() {
    if (selUnits.length) {
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY,
            c = 1;
        if (c && 1 < selUnits.length)
            for (var b = 0; b < users.length; ++b)
                if (UTILS.pointInCircle(a, d, users[b].x, users[b].y, users[b].size)) { c = 0; break }
        var g = -1;
        if (c)
            for (b = 0; b < units.length; ++b)
                if (units[b].onScreen && units[b].owner != player.sid && UTILS.pointInCircle(a, d, units[b].x, units[b].y, units[b].size)) {
                    c = 0;
                    g = units[b].id;
                    break
                }
        1 == selUnits.length && (c = 0);
    function movebot(){
    var e = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;

        for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
        sockets.forEach((sock)=>{
              sock.sock.emit("5", a, d, e, 0, -1)
        })
    }
        movebot()
        if(onOffjointroop=="on"){
    if(onOffLag=="on"){
juntarComLag()
    }else if(onOffLag=="off"){
await juntarSemLag()
    }}else if(onOffjointroop=="off"){
    moveSemLag()
    }
    }
}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//junta sem lag
async function juntarSemLag(){
    var e = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
             await socket.emit("5", a, d, e, 0, -1)
}

//move sem juntar e sem lag
async function moveSemLag(){
    var e = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
             await socket.emit("5", a, d, e, 1, -1)
}


//junta com lag2
function juntarComLag2(){
   let a = player.x + targetDst * MathCOS(targetDir) + camX,
       d = player.y + targetDst * MathSIN(targetDir) + camY;
   let arrayTropa = [];
    selUnits.forEach((tropa)=>{arrayTropa.push(tropa.id)});

    envTropa1(a,d,arrayTropa)
    envTropa2(a,d,arrayTropa)
    envTropa3(a,d,arrayTropa)

    setTimeout(()=>{
   let loop1 = setInterval(()=>{
       juntarComLag2()
    },100)
   setTimeout(()=>{
   clearInterval(loop1)
   },500)
    },100)

        setTimeout(()=>{
   let loop1 = setInterval(()=>{
       juntarComLag2()
    },100)
   setTimeout(()=>{
   clearInterval(loop1)
   },500)
    },200)

        setTimeout(()=>{
   let loop1 = setInterval(()=>{
       juntarComLag2()
    },100)
   setTimeout(()=>{
   clearInterval(loop1)
   },500)
    },300)


}

function envTropa1(a,d,arrayTropa){
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), arrayTropa, 0, -1);
};
function envTropa2(a,d,arrayTropa){
socket.emit("5", a,d, arrayTropa, 0, -1);
socket.emit("5", a,d, arrayTropa, 0, -1);
socket.emit("5", a,d, arrayTropa, 0, -1);
socket.emit("5", a,d, arrayTropa, 0, -1);
};
function envTropa3(a,d,arrayTropa){
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), arrayTropa, 0, -1);
};
function envTropa4(a,d,arrayTropa){
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToTwo(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToOne(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToTwo(d), arrayTropa, 0, -1);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToOne(d), arrayTropa, 0, -1);
};


///////////////////////////////////////////////////////////////////////////////////////////


function juntarComLag(){
   let a = player.x + targetDst * MathCOS(targetDir) + camX,
       d = player.y + targetDst * MathSIN(targetDir) + camY;
selUnits.forEach((tropa)=>{
if(tropa.owner==player.sid && tropa.type==1){
socket.emit("5", a,d, [tropa.id], 0, -1);
socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), [tropa.id], 0, -1);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), [tropa.id], 0, -1);
socket.emit("5", a,d, [tropa.id], 0, -1);
}
})
}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//adiciona os menus na tela do game
let setaVars = setInterval(()=>{
if(socket && gameState==1){
    clearInterval(setaVars)
        criaMenus()
}
},500)


//modifica menus do game



//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//seleciona tropas
function selecionaMenosCommander(){
        selUnits = [];
        units.forEach((unit) => {
        if (unit.owner === player.sid && unit.type === 1) {
        if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
        unit.info.name !== 'Commander' && unit.info.name !== 'Siege Ram' &&selUnits.push(unit)
}});
        selUnitType = "Unit";
}


function selecionaMenosSiege(){
               selUnits = [];
        units.forEach((unit) => {
        if (unit.owner === player.sid && unit.type === 1) {
        if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
        unit.info.name !== 'Siege Ram' &&selUnits.push(unit)
}});
        selUnitType = "Unit";
}

function spawnaComanderESeleciona(){
    socket.emit("4",0,0,1);
    window.sockets.forEach((socket)=>{
    socket.sock.emit("4",0,0,1);
    })
        selUnits = [];
        units.forEach((unit) => {
        if (unit.owner === player.sid && unit.type === 1) {
        if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
        if (unit.info.name === 'Commander') {
        selUnits.push(unit)
}}});
        selUnitType = "Unit";

}


//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||


//base dpk V2
   function dpkbots(){
    window.sockets.forEach((bot) => {
        const socket = bot.sock
socket.emit("1",-3.1400017458410745,132.00016704534883,3);
socket.emit("1",-2.616686461722192,132.00119469156337,3);
socket.emit("1",-2.093428548209908,132.00104734432995,3);
socket.emit("1",-1.5701145087187327,132.00003068181462,3);
socket.emit("1",-1.0467734858480617,132.0030552676717,3);
socket.emit("1",-0.5235155658601258,131.9990246176084,3);
socket.emit("1",-0.00022727272335942278,132.00000340909085,3);
socket.emit("1",0.523073890253546,132.00002310605853,3);
socket.emit("1",1.0463973901061703,131.9971048924937,3);
socket.emit("1",1.5697357211319762,132.00007424240337,3);
socket.emit("1",-3.139991347768931,306.00039232000995,1);
socket.emit("1",-2.923994196541792,305.99577121261,1);
socket.emit("1",-2.7079979891398973,305.9964967119722,1);
socket.emit("1",-2.492000077058938,306.00367726548654,1);
socket.emit("1",-2.276016223968046,306.00062516276,1);
socket.emit("1",-2.060007793381665,306.0030262922248,1);
socket.emit("1",-1.8439875536674648,305.9980001568637,1);
socket.emit("1",-1.6279843105192338,306.0002452613396,1);
socket.emit("1",-1.4119926259902449,306.00035065339387,1);
socket.emit("1",-1.1960064618373838,306.0012058799769,1);
socket.emit("1",-0.9799930163427818,305.9987898668882,1);
socket.emit("1",-0.7640215518210055,305.99966094752466,1);
socket.emit("1",-0.5480025429968127,305.99828839390597,1);
socket.emit("1",-0.3320125932586849,306.0012609451144,1);
socket.emit("1",-0.11601286924045082,305.99689540908753,1);
socket.emit("1",0.10000358459797759,305.99882908272707,1);
socket.emit("1",0.31598401089984723,305.9997232024892,1);
socket.emit("1",0.5319958032307893,306.00034722202525,1);
socket.emit("1",0.7480000132173787,305.99521728288505,1);
socket.emit("1",0.964003270834421,305.99613886452875,1);
socket.emit("1",1.1800097508428806,305.999376633352,1);
socket.emit("1",1.3959878271385584,306.003535927283,1);
socket.emit("1",1.6119845064123546,305.99952222184925,1);
socket.emit("1",1.8280052688256236,305.99612824347963,1);
socket.emit("1",2.0440168675640136,305.99756289879167,1);
socket.emit("1",2.2599863338360344,306.00132957227487,1);
socket.emit("1",2.4759978600339494,305.994679692311,1);
socket.emit("1",2.6919903375268674,306.0003075161853,1);
socket.emit("1",2.908003886220855,306.000367646838,1);
socket.emit("1",0.8699987279653572,243.8481535710288,5);
socket.emit("1",1.210014562203788,243.84870083722004,5);
socket.emit("1",1.5600109838562193,243.85418286344807,5);
socket.emit("1",2.609999577077718,243.85133196273503,5);
socket.emit("1",2.9599932123218666,243.84984560175542,5);
socket.emit("1",-2.9699920613329622,243.85151732150447,5);
socket.emit("1",-2.6199947908961105,243.84557900441834,5);
socket.emit("1",-2.269992483231978,243.84610003032654,5);
socket.emit("1",-1.919991274434831,243.84651279032065,5);
socket.emit("1",-1.5700171594315573,243.85007402090326,5);
socket.emit("1",-1.2500054152201767,243.8496672132238,5);
socket.emit("1",-0.5199803036175189,243.84989235183193,5);
socket.emit("1",-0.8699987279653568,243.84815357102872,5);
socket.emit("1",-0.17002310281999192,243.84605081895427,5);
socket.emit("1",0.18001488891124995,243.85037153959803,5);
socket.emit("1",0.5299754465231121,243.851702680133,5);
socket.emit("1",2.100015962749604,131.99701966332432,3);
socket.emit("1",2.616310321066522,131.99528817347996,3);
socket.emit("1",-3.139994716805523,194.00024768025426,2);
socket.emit("1",-2.791214196322064,193.99668089944223,2);
socket.emit("1",-2.442392890871587,194.0008505135995,2);
socket.emit("1",-2.093605849859661,194.0052705469621,2);
socket.emit("1",-1.744817577540963,194.0000850515278,2);
socket.emit("1",-1.047200313208691,194.00092809056352,2);
socket.emit("1",-0.6983945911642702,194.00021649472453,2);
socket.emit("1",-0.0008247420810452244,194.00006597937022,2);
socket.emit("1",0.34801353139633523,193.99990335049142,2);
socket.emit("1",0.6967842348778635,193.99932577202424,2);
socket.emit("1",1.0455826284612566,193.99761699567333,2);
socket.emit("1",1.394419117420156,193.99974664931912,2);
socket.emit("1",1.7431991142527825,193.99590923522064,2);
socket.emit("1",2.092013943372238,194.0006639163897,2);
socket.emit("1",2.4407825661619134,194.00249586023364,2);
socket.emit("1",2.7895848737881193,194.00599011370753,2);
socket.emit("1",1.910002502175056,243.85508237475804,5);
socket.emit("1",2.2699924832319778,243.84610003032665,5);
socket.emit("1",-1.3900285221526352,189.7823239925152,2);
socket.emit("1",-0.3600050614110291,188.68568838149864,2);
UpgradeBoulder(socket)
UpgradeSpikes(socket)
UpgradeAntiTankGun(socket)
UpgradeRangedTurret(socket)
UpgradeSpotterTurret(socket)
    })
        }


//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//loops

 

   window.antkick = setInterval(()=>{
   if(onOffantkick=="off") return
   if(gameState==0) return
       antKickGame()
   },80000)



//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||


//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||

//ANT KICK
function antKickGame(){
     socket.emit("2", 0, 0);
     socket.emit("2", Math.round(camX), Math.round(camY));
     socket.emit("2",camX,camY);
    if(window.sockets.length>0){
    window.sockets.forEach((socket)=>{
     socket.sock.emit("2", 0, 0);
     socket.sock.emit("2", Math.round(camX), Math.round(camY));
     socket.sock.emit("2",camX,camY);
    })
    }
}

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||



//chama funçoes para iniciar hack
    try{
    preLoad();
    }catch(erro){
    alert(erro)
    throw erro
    }

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||


//cria uma area - se detectar um inimigo ele ativa o def (by PlayerX)

/* def tipo 1
function reconhecimento(){
if(onOffDef=="off") return
units.forEach(async(unit) => {
if(unit.owner!==player.sid && (unit.x>(player.x-390))&&(unit.x<(player.x+390))&&(unit.y>(player.y-390))&&(unit.y<(player.y+390))){
await coloc()
}
})
}


   window.defend = setInterval(()=>{
   reconhecimento()
   },100)
*/



/*     def tipo 2
window.setInterval(() => {
    let Acct = false
	units.forEach(unit => {
		if (unit.owner === player.sid) return;
		const distance = Math.sqrt((unit.x - player.x) ** 2 + (unit.y - player.y) ** 2);

		if (distance < 400) Acct=true;
	});

	if (onOffDef=="on" && Acct==true) {
		window.placeWalls(socket);
	}
}, 200);
*/



class Defend {

filtraInimigos(units,player){
this.unidades = units;
this.jogador = player;


this.inimigos = this.unidades.map((unit)=>{
if(unit.owner!==this.jogador.sid && unit.speed>0)return unit
})

this.inimigos = this.inimigos.filter(unit => (unit!=undefined))

}

verificaDistancia(){
this.interruptor = this.inimigos.some((unidadeInimiga)=>{
	const distance = Math.sqrt((unidadeInimiga.x - player.x) ** 2 + (unidadeInimiga.y - player.y) ** 2);
    if(distance<=399) return unidadeInimiga
})
}

acionaDef(defend){
if(this.interruptor && onOffDef==="on"){
defend()
}
}



}

const defend = new Defend()

//------------------------------------------------------------------------------------------||------------------------------------------------------------------------------------------||
